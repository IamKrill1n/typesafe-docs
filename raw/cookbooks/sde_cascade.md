> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# SDE cascade

> Extracts structured data with a cheap model, checks each field with TypeSafe, and escalates to a reasoning model only when a check fires.

* Overview
  * big reasoning models extract structured data well, but are slow and expensive
  * small models are cheap, but make mistakes
  * a *cascade* runs the small model first and pays for the big one only when a check
    flags the small model's answer
  * the models we use:
    * rung 0 (mini):
      [`gpt-5.4-mini`](https://developers.openai.com/api/docs/models/gpt-5.4-mini)
    * rung 1 (reasoning):
      [`gpt-5.5`](https://developers.openai.com/api/docs/models/gpt-5.5)
    * verifier: TypeSafe `jev-1.14.0`
* Algorithm
  1. **Extract** with a cheap/small model.
  2. **Verify** with **TypeSafe**: ask yes/no questions ("Noul questions") about each
     field, such as "is this value absent from the source?" or "was it lifted from
     unrelated text?"; each returns P(something is wrong).
  3. **Escalate** to an expensive reasoning model if a verifier signal fires; otherwise
     keep the cheap answer.

## Setup

* install the dependencies:

```bash theme={null}
pip install openai jsonschema ipython 'cooksafe>=0.2.0,<0.3.0'
```

* then set `OPENAI_API_KEY` and `TYPESAFE_API_KEY` in your environment

```python theme={null}
import json
import os
import urllib.request
from pathlib import Path

import jsonschema
from cooksafe import JsonCache, make_playground_link
from IPython.display import Markdown, display
from openai import OpenAI
from typesafe_sdk import Noul, NoulCriteria, TypeSafeClient

MINI = "gpt-5.4-mini"  # rung 0: cheap + fast
REASONING = "gpt-5.5"  # rung 1: strong, run with reasoning_effort="high"
TS_MODEL = "jev-1.14.0"  # the TypeSafe verifier model
FIRE_T = 0.7  # escalate if any per-field P(wrong) exceeds this; also the "<== FIRES" display marker

oai = OpenAI()

ts = TypeSafeClient(api_key=os.environ["TYPESAFE_API_KEY"], timeout=30.0)
```

## Step 1: the data

* `example.json` holds one page written for this cookbook, in the shape of a row from
  [ScrapeGraphAI-100k](https://huggingface.co/datasets/scrapegraphai/scrapegraphai-100k):
  a prompt, a JSON Schema, and the page text as a scraper captured it
* the code below downloads it from typesafe-public-examples unless it is already on disk

```python theme={null}
EXAMPLE = Path("example.json")
EXAMPLE_URL = (
    "https://raw.githubusercontent.com/typesafe-ai/typesafe-public-examples/main/"
    "cookbooks/sde_cascade/example.json"
)
if not EXAMPLE.exists():
    urllib.request.urlretrieve(EXAMPLE_URL, EXAMPLE)
example = json.loads(EXAMPLE.read_text())
schema = example["schema"]
prompt = example["prompt"]
content = example["content"]

print(
    f"""
PROMPT
===========
{prompt}

SCHEMA
===========
{json.dumps(schema, indent=2)}

CONTENT
===========
{content}
""".strip()
)
```

```text expandable theme={null}
PROMPT
===========
Find the date fall registration opens at Wrenfield Community College in Wrenfield, Oregon, for the 2026-2027 school year.

SCHEMA
===========
{
  "title": "RegistrationOpen",
  "type": "object",
  "properties": {
    "registration_open_date": {
      "title": "Registration Open Date",
      "type": "string",
      "description": "The date registration opens for the fall semester, in mm/dd/yyyy format, such as 08/03/2026. Return a blank string if you are unsure."
    },
    "description": {
      "title": "Description",
      "type": "string",
      "description": "A short description of the registration open date, such as 'Registration opens for the fall semester'."
    }
  },
  "required": [
    "registration_open_date",
    "description"
  ]
}

CONTENT
===========
Skip to content

[Wrenfield Community College](https://www.wrenfield.example/)

  * [Academics](https://www.wrenfield.example/academics)
  * [Admissions](https://www.wrenfield.example/admissions)
  * [Student Life](https://www.wrenfield.example/life)
  * [About](https://www.wrenfield.example/about)

[Log In](https://my.wrenfield.example/)

Search Site

# Events Calendar

Search Events

Apply Reset

## Fall 2026 Census Date

Monday, September 14, 2026 · All day · Online

The census date is the last day to drop a fall class and get a full tuition refund. Classes
dropped after this date stay on your transcript with a grade of W.

[Add to calendar](https://events.wrenfield.example/fall-2026-census-date.ics)

Related: [Academic calendar](https://www.wrenfield.example/academics/calendar) ·
[Drop a class](https://my.wrenfield.example/drop)

Wrenfield Community College

  * [Campus Map](https://www.wrenfield.example/map)
  * [Contact Us](https://www.wrenfield.example/contact)
  * [Privacy](https://www.wrenfield.example/privacy)
  * [Accessibility](https://www.wrenfield.example/accessibility)

© 2026 Wrenfield Community College
```

* This page is a college **events-calendar page**:
  * the schema asks for just two fields: `registration_open_date` and `description`
  * the page's one event is the fall census date: it gives **no registration date and no
    description of one**
  * note the schema's own text for `description` includes an *example* value:
    "Registration opens for the fall semester"
* so a well-behaved extractor should *decline* to invent the fields the page doesn't
  contain

## Step 2: extract with the mini model (text mode)

* both rungs reply in plain text, not structured outputs, tool calls or JSON mode: the
  mistakes this cascade catches are schema-valid, and constrained decoding would only hide
  a model that breaks the schema because it misread the page

```python expandable theme={null}
EXTRACT_SYSTEM = (
    "You extract structured data from documents. Return only values supported by the text. "
    "Follow any value format specified by the schema or its field descriptions."
)


# LLM and TypeSafe calls are cached in ``json_cache.json``, so a re-run reuses earlier answers
# instead of calling the APIs again; delete the file to call them fresh.
json_cache = JsonCache(Path("json_cache.json"))


@json_cache
def extract(
    model: str,
    prompt: str,
    schema: dict,
    content: str,
    *,
    reasoning_effort: str | None = None,
    temperature: float | None = None,
) -> dict:
    user = (
        f"{prompt}\n\nReturn ONLY a JSON object matching this JSON Schema:\n"
        f"{json.dumps(schema, indent=2)}\n\nDocument:\n{content}"
    )
    kwargs = {
        "model": model,
        "messages": [
            {"role": "system", "content": EXTRACT_SYSTEM},
            {"role": "user", "content": user},
        ],
    }
    if reasoning_effort:
        kwargs["reasoning_effort"] = reasoning_effort
    if temperature is not None:
        kwargs["temperature"] = temperature
    text = oai.chat.completions.create(**kwargs).choices[0].message.content
    # The prompt asks for ONLY a JSON object, so parse the reply as-is -- no regex fishing a
    # substring out of a malformed reply. If ``json.loads`` fails, treat it as an empty extraction:
    # every field reads as absent, which the verifier flags and the gate escalates -- the safe
    # direction.
    try:
        return json.loads(text)
    except (ValueError, json.JSONDecodeError):
        return {}


mini_record = extract(MINI, prompt, schema, content, temperature=0)
print("mini extraction:\n", json.dumps(mini_record, indent=2))

print("\nschema-valid:", jsonschema.Draft202012Validator(schema).is_valid(mini_record))
```

```
mini extraction:
 {
  "registration_open_date": "",
  "description": "Registration opens for the fall semester"
}

schema-valid: True
```

* The record is **schema-valid** (the line above prints `True`), yet it's wrong:
  * `registration_open_date` is left blank, which matches the page: it states no date
  * but `description` is fabricated: the page never describes a registration date, so
    mini copies the schema's own example, "Registration opens for the fall semester"
  * a JSON-Schema check can't see this. A cheap model produces confident,
    schema-satisfying fabrications of this kind, and catching them is the job of a
    semantic verifier

## Step 3: verify with TypeSafe

* the verifier is **TypeSafe**; for each field we build several `Noul` questions, each:
  * a narrow yes/no, framed so that `true` = something is wrong (escalate)
* TypeSafe returns a calibrated `noul` = `P(true)` per question, in one system\_one call
* the question set:
  * one holistic **`__overall__::judge`** head ("should this record be escalated?"). We
    compute and display it to contrast a whole-record judgment with the per-field heads;
    it does not decide escalation, the per-field battery does.
  * a per-field battery
    * non-empty fields get the full set of heads
    * empty fields (null / "" / \[]) get only the `absence_wrong` head
* **The TypeSafe Way: Decomposition**
  * we split the check in code into narrow questions, one per field and failure mode,
    never one question about the whole record
  * a flag then names the field and what is wrong with it, and each question can be
    reworded or re-thresholded on its own
  * a single "is this extraction good?" returns one score that cannot say which field
    went wrong
  * see
    [Decompose the questions](https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md#decompose-the-questions)
  * ![this is the way](https://mintcdn.com/ts-docs/2NirYCl-v96cw05F/cookbooks/sde_cascade/this_is_the_way.jpg?fit=max\&auto=format\&n=2NirYCl-v96cw05F\&q=85\&s=10bd7d99dc5f679022bb6763dde57330)

```python expandable theme={null}
# metric -> (question, NoulCriteria)
MAIN_QUESTIONS = {
    "name_desc_mismatch": (
        "Does the `extracted_field` fail to match the field at `path` or the `description` in the "
        "`field_spec`? If the `description` is empty, judge against the `path` alone.",
        NoulCriteria(
            true="the `extracted_field` does not match the field name or its `description`",
            false="the `extracted_field` matches the field name and `description`",
        ),
    ),
    "type_mismatch": (
        "Does the `extracted_field` violate the `type` declared in the `field_spec`?",
        NoulCriteria(
            true="the `extracted_field` violates the declared `type`",
            false="the `extracted_field` conforms to the declared `type`",
        ),
    ),
    "unreasonable": (
        "Is the `extracted_field` one that a reasonable person would not have extracted for this "
        "`field_spec`?",
        NoulCriteria(
            true="a reasonable person would not have extracted this value",
            false="the extraction is reasonable",
        ),
    ),
    "hallucinated": (
        "Is the `extracted_field` unsupported by, or absent from, the source text?",
        NoulCriteria(
            true="the `extracted_field` is a hallucination -- not supported by, or absent "
            "from, the source text",
            false="the `extracted_field` is supported by the source text",
        ),
    ),
    "off_target": (
        "Does the source text fail to genuinely report the thing the `field_spec` describes, so the "
        "value was pulled from incidental text?",
        NoulCriteria(
            true="the source does not genuinely provide this field -- the value was pulled "
            "from incidental text",
            false="the source genuinely reports this field",
        ),
    ),
    "incomplete": (
        "Does the `extracted_field` fail to capture a value the source supports (note whether the "
        "`field_spec` is `required`)?",
        NoulCriteria(
            true="the field is wrongly empty, null, or missing a value the source supports",
            false="the field captures the value the source supports",
        ),
    ),
    "format_violation": (
        "Does the `extracted_field` violate the format or constraints implied by the `description`, "
        "the schema `type`, and the extraction instructions (e.g. date format, units, enum membership)?",
        NoulCriteria(
            true="the `extracted_field` violates the implied format or constraints",
            false="the `extracted_field` satisfies the format and constraints",
        ),
    ),
}
ABSENCE_QUESTION = (
    "The `extracted_field` is empty, null, or an empty collection. Does the source text contain the "
    "information the `field_spec` describes, making the empty result wrong?"
)
ABSENCE_CRITERIA = NoulCriteria(
    true="a value was wrongly omitted", false="returning nothing is correct"
)

OVERALL_JUDGE = (
    "Is this extracted record an incorrect extraction -- some value unsupported by the source or "
    "not conforming to the schema, required information missing or wrong, or some field hallucinated -- "
    "so it should be escalated to a smarter model?"
)
OVERALL_JUDGE_CRITERIA = NoulCriteria(
    true="the record is an incorrect extraction",
    false="the record is a correct extraction",
)


def is_empty(v) -> bool:
    return v is None or (isinstance(v, (str, list, dict)) and len(v) == 0)


def field_spec(name: str) -> dict:
    """Minimal spec pulled from the schema (unwrapping anyOf/null for optional fields)."""
    p = schema["properties"][name]
    branches = p.get("anyOf") or []
    typ = p.get("type") or next(
        (b["type"] for b in branches if b.get("type") != "null"), "unknown"
    )
    return {
        "path": name,
        "type": typ,
        "description": p.get("description", ""),
        "required": name in schema.get("required", []),
    }


def build_questions(record: dict) -> dict[str, Noul]:
    """The verify question set: one holistic ``__overall__::judge`` head plus a per-field battery,
    keyed ``field::metric``."""
    questions: dict[str, Noul] = {
        "__overall__::judge": Noul(
            instructions=OVERALL_JUDGE, criteria=OVERALL_JUDGE_CRITERIA
        ),
    }
    # Loop over the schema, not the record, so a field the extractor left out still gets asked.
    for name in schema["properties"]:
        value = record.get(name)
        spec = field_spec(name)
        if is_empty(value):
            questions[f"{name}::absence_wrong"] = Noul(
                instructions={
                    "field_spec": spec,
                    "extracted_field": value,
                    "main_question": ABSENCE_QUESTION,
                },
                criteria=ABSENCE_CRITERIA,
            )
            continue
        for metric, (question, criteria) in MAIN_QUESTIONS.items():
            if metric == "type_mismatch" and spec["type"] == "unknown":
                continue
            questions[f"{name}::{metric}"] = Noul(
                instructions={
                    "field_spec": spec,
                    "extracted_field": value,
                    "main_question": question,
                },
                criteria=criteria,
            )
    return questions


@json_cache
def verify(record: dict) -> dict[str, float | str]:
    """Run the whole Noul battery over a record in one TypeSafe call; return ``{field::metric: P(true)}``."""
    state = {
        "system_message": EXTRACT_SYSTEM,
        "instruction": "Extract the structured record from this document",
        "source_text": content,
        "schema": schema,
        "extraction": record,
    }
    questions = build_questions(record)
    answers = ts.system_one(state=state, questions=questions, model=TS_MODEL).answers
    return {qid: ans.noul for qid, ans in answers.items()} | {
        "playground_link": make_playground_link(state, questions)
    }
```

```python theme={null}
checks = verify(mini_record)
playground_link = checks.pop("playground_link")
display(
    Markdown(
        f"🔗 [Open this verification in the TypeSafe playground]({playground_link})"
    )
)

print(f"{'qid':<40}{'P(wrong)':>9}")
print("-" * 50)
for fld, p in sorted(checks.items(), key=lambda c: -c[-1]):
    flag = "  <== FIRES" if p > FIRE_T else ""
    print(f"{fld:<40}{p:>9.2f}{flag}")
```

```
qid                                      P(wrong)
--------------------------------------------------
description::hallucinated                    0.98  <== FIRES
description::off_target                      0.97  <== FIRES
__overall__::judge                           0.90  <== FIRES
description::unreasonable                    0.86  <== FIRES
description::incomplete                      0.54
description::name_desc_mismatch              0.46
description::format_violation                0.41
registration_open_date::absence_wrong        0.05
description::type_mismatch                   0.04
```

[Open this verification in the TypeSafe playground →](https://console.typesafe.ai/playground#share/N4IgJg9gxgrgtgUwHYBcAqCAeKQC4AEIwAOiAM4CeZKCcA+omWQIYDmCpBpAmhDPlhQAnZlBT5qQmGJhCEYfGGYpm+AGZCIcRdHjIUZAHT4ASghSyk+CEgA2FfADdmtmAjISYABy8QhNBQAjBxQACwR8GmxjADEIW1sIAHd8ZiQHZ1cItT84ZQkvBCgASzVi+XxgyPCJKHC86yF8YoN1ctsFMHcoIWKvFGKbI1IAGnxSYqRJaQGbTnGQAFFsETFqiOmZOQU5KD8FDS1q4o9IWERUUYWyPiEoBDoolHnSAGUAaz7IiHw91H1iMQkICkABtADqciQZQQHXwAGEtHAYEgWg5EQkEOwALoAClCKBQXjIuAA9KSkpTDEkoTCOoYsMw4F5bAhSQBKEEg-D4ABU+FBAEEoMwunBilAyHiCUSSeTKUlqbT2mAGZgmSy2aJRbQJWROUCefyhWBxUxBlNpYTiWSKVSacg6arGczWaTRWayBb9dy+QLXhYuqh8AAZUoIK2y20KpWOlVqjVu2zhg1WP1CwJ8FCRm3y+3K2HO9WurWZmAoVMg0EhiCsfAASSQOblpLgFFj0PjLs1HK5QNeCGYd1C+FeLQ4QJBAGJ8ItHPoPPCXMglEI+0gB0O6rP56gyOvBT57KZ3OZ11OZzEXLZ8AAmAAMt4AbAjkGQYB4ACLKCfAoEAWRsJQKDGAd+loQIECaABGAAWMYH2ffAAHb8EFBJFGYBxUIAeTsSZfxBNAanuKYP0wmhmg8MIIlsZhqEwkIfjATQvFSdRr1+OimFSJAFHYcRVDUGAMIsFoLXwORhL44x4W4sh3BBFiIB8CpmDUGgmjCE4KI2FQHBsfAKFuSIRCmHo+nEJIWhHVRWBELprDUfBwUMdcTQUFAfhFVk+KHZtbQQXcDA7J0ExLUk1GvABaRCn2i0j3zIaKlBoQw9UrIEzDogICCFEUxQlX5lz8oQArzRUHU7Qtwp7bVCslUkfJXId2RQqtP1Y9ioHk8rW3bKqwu7N1lK8TKkEhONCwRJEUTRGbMXYdcjQFJdmXI-9mC8PqY0Grtix7PIxt9Y1EVQURxAAVSlfFrRbXaC3pYa2T+FQxFTFbQQABV6ZwoAoHb8ymp6DrdLxftECgPvTYV7nNQJimTFAAduqMKtC-bEy1KA4a9BGkah9cAEq70fF9JuquFETgZFUWRhbWSWycQDGUgyDqWhmHmEgQAGFBWReEAzFYE5hGUC0cMKYEWYWZHCkFiBAgAKyKZ4ZdIcGVKggZFLwfAebkEXJHFmw6C1pA6FSjg9Z5vmBb10hhdFkRZisSXkHwb8aCuUg5etrhyGESZWB98Bul6foLUF4iIitySsWdk2rHNjwci0mooowhTGE0sZJnwGnSTAMBSQoMuHDTvIUDGd9t3o-B7wADlJe8AGZSTi4wzAsIQrFUQI6KQd4JCDpA61KIy+FSOR8BRd85DckAAF9WbD9mI9d7nfZae2A8-cPLKj9XeYoeWHcD3ox9Drp18PuZz8FCRQj8cQb4syPDIgZyaPjo2xdd6wUtdI12kLZDwAByJ2xsAEp3UH4dYHEs60HcJpcBi8l4rwWHIAAjjAYo2x5iglIIbROrszZS0tj+a+B8P7S2xJg0gghVibxtsQhO0CLTkOQJQ7259qG31oYLKB-8JKwLTggzON5s4oKgqQDBMsQCa2ZAYDA2A9ZEFIHQM284RAJC0bgXASsYBgCWqwk+Z8A5ID4LYUOkxNiu33Ofes1FQg6SYRdCoux9i8WaEgPYQhdjiHcWICS0VooSC0BETIbhZ5kR8C-CoVQf43FkPcRo+ArHiD+JXYO3wEHs3qMwMYOC8HbF8ZXJOBcThejHukmkNhWBjHgTcRAbRpqhGvNISYP4FBhIic0cQZBn4iSCBEboLgel5NUGQPI-goIFwgF0WwAB+UOFlNLFC5mY4QbhBY-y8UIBQOk0i+P8YEgQKwLpH1XpnBSeyagHKOR4VQZzVYXLFiE++GDV4kI4abc2PCEAGOYIEBSfiHj1Kvts0+-sFhWJErYqYOzPlTC3iAJ0dAyCFCgGirwyhQiC1+SI-5FCrahz9oLSQwd+HvxYQHGOulf6kNEVLVO8Cf6SIkMg6gUE85WELsXUu5c4FCCriAuuHgm4t3bp3E8Pc+6VEHsPKltSJ7GX4EOCIc9ZAIEXj8hAuD8HyHmDshADCQDBICHQJ0gtQ55EmHQXBKCj70pqAAA0tfIa1Ko3VUQEMokCGSRK2CaU0E5tB+gOD2JiFFxhPwQHcPk24aSni-BsCofOP9JgVIAT-N1GKsVFF9W-XokEyBjDyJ8WpP8I30zkO+WwVlNBj1WcvVe6yoKbLRaawWqhokRCSPXSFrBjxaBaAEUOtzYVsPlbkzJrjVUeFeWIOR5qS13yQAYpATIHhvwYCcKudRu0wsFvCmxx87HIocWigt2LcX4sFuuwRx8KXnxVSHY+T66ULEfkMl+igaEwO-g89hxLk5AKtuKsB+BIGgZdiyt8IqJGcWkTyoQaDQ4lKNWAE1UgzWr09WAb1hYhFwcqWI9lGcUPcs0na5gDqnXUBdQseNia82EeIx0X1UVEZ5MPSODlKpUjiDdXisIvrKMRDdV+i0vrM3utvUW5ZDZgNSZkzYOTHha2BqMSYiIbB6NIoQaJ-FvqXA2F1XI9tvQNlbIILbPD9ypMcadMWhNHhMkF2UNuQT01t2tPgS0Dw0nAOycnS4O5592OXLEF61zXmUAcxcdkIT-n9N8XwCFgRrs3WrtXupzduA-b7pmd5gl0KLFwusYi+x3ob0qkxXesxYnysBwK+Sk9b7R4fvy6F++Adf3P38AB7LojVNMr+eBj2kHPASpg8I+Dn9WVIY5dRnOUEMPHywwQvWprzUuZVKRv+i2ptTBW1RpB621zH3tRbRj37SCseS5lg7hZfWOEGDlCIea-bFqKHRMp8mpOKagG61t5qO29Ds-rX2jmovute1xpwn2fzPa6D1TVCg3W-fC7YSLAdosfKtfF7JuRqI-B-ujgHFRscwty8vNdfXCsojkPRGwILd4w-MdOkAZ6atXrq2YkH96wiPqZx1yrbNus0o3sx0gg3-0FacggolJ3AHTZ-FB1IECFvkeW+I1bl2ZHob1Vgg1pTjW7bw-tmLxPDvn11zA-XknEFSJo7Im7hnHVuCY-1hYzjjOI7ABJpA32OmCXjmz7dA8IiFCEDcKwSRrEKE8x0+c7zmEVAN644LIOwdWYWJDrt2y4cB1UKzhPHPY9QQT-gJPIyMkQHEGnsZtuKjaQ8P23H+PZY1EtRJHSFf2cx7ywsArBiOkJC6duidFWed84vUiqQKLHH2dIML5rD7z7tZfZ1gO76ZcbsFgr4bSuv4q7I07jXNAtf11g8dvXiHs-ZDW8bzb+rDU7YIHtgjbeiM2od0vwQzO2f1dy5SuzowYx9wexAAD0J0z3-x9ViXfHiTmSCEDXgRBTBXEEODgDGGSWTW+0EHB2s3HCh27VL172cz-042Dz9VUEn1cBKBn1CXCU8xQN8DQMqAwLDVBX0HUE0DwKTVSSIOwG7x53gI8UQLez9Q4ISXQOELuFELVm+THyZwMS-jUEeCHAEmPUl152q0X1qyGHq0LEayKBF1azUNG3vlXlfX32l0-XFwfifkVyZ2V32SAKW2vwQFvx1y8NOzZXThfyNzQ3fzN0-0t2-2t1-yJzi3twDkd2AKCOQ1CNo09ygOdT90e3c0UJTUEA4l4y8nwHYCQDwVD2PDkE4PEB-m0mrQUwa0LVBxGwsjLRrgpxqH7Tr3ri8GDSz0ENOWKCDBUBvCeBIMLxs07Whwc12Xhw2EIJ0ETU81KPKNhAcE1g+0cg7zaThD6R-i6MHQ8F6MxAOAGMmBKGGJcEiEEHEKcwiREJKOQFWMqIQGqJcR0gANUNIHH1wHOK0E1F4TX251PUMNXkvWX2vSF0aKayBJazFxsOljsL32uEcN6wROP1cNP3cPP08IfyvysBm1rmg3v2ZW8JAJd05VQ1QVNzYUiJwytzcBtziOkI6CO1JMCPOxCLdwgIyLu2gLlxACe0DxoPix41GO8i2h7n0ycBcBiQIIeLkP8A8FxEyQHXCBomCMyzzz9TdW23kDdXZHGNICL2mNh1mIJwziEx0mHWPG0zGDKISFDSqXNFqT7VlLD3mIVO8DeNuLmJ2IUBFH6B1Wey6PlKUM8FQIMFH2+PUNwBzToA+3iCTj0Pn1BIWHBJmEFyBI31hK3za2cKRP0IPycPRJcL-SxIRI8JAzxOAOAVm2JKSLJJSMN25LfxpJAD1PpOiMZNiIQNoLZMm3V3JM1MpPd2u1Xlu29yyOlj3lyMkNixZLoMTK+wkVyHyHgT+GNkmFaGKFdHKAULzQKzdXwJqAKU5ky1+zGDSE8j71twHyX0zKGHwFxF1VYGMDjhzTGDmgMDGCeO0EQDgEgnj1cTGiNJABNIoPNKoJexFKQOXNRwQV3JZH3JFSrnSU3LFm3McRuQiwkIR1gpkJYAGDIBhGexzV4gDKGEwr3FXSXgUS2mKAADUa8LR1FHBoJl4gA)

* Only the wrong field scores high:
  * `description` fires `hallucinated` (0.98), `off_target` (0.97) and `unreasonable`
    (0.86)
  * the empty `registration_open_date` is right, and its `absence_wrong` head stays low
    (0.05)
* The holistic judge flags the record too (0.90), but only the per-field heads say which
  field is wrong and why

## Step 4: the escalation gate

* now we gate on **`any_flag`**: escalate if *any* field flag exceeds `FIRE_T`
* this is a `max`-style gate, not a mean, so one confident red flag is enough instead of
  being averaged into silence
* one threshold works only if the heads separate, scoring high on wrong fields and low on
  right ones, as in Step 3
* the verifier has to cost far less than the reasoning rung, or the cascade saves nothing

```python theme={null}
# any_flag is a per-field gate: the holistic __overall__ head is shown above but not part of it
fired = {
    qid: p
    for qid, p in checks.items()
    if not qid.startswith("__overall__") and p > FIRE_T
}
escalate = bool(fired)

print(
    f"any_flag gate (threshold {FIRE_T}): {'ESCALATE' if escalate else 'ACCEPT cheap result'}"
)
for qid, p in sorted(fired.items(), key=lambda c: -c[1]):
    print(f"  fired: {qid}  (P={p:.2f})")
```

```
any_flag gate (threshold 0.7): ESCALATE
  fired: description::hallucinated  (P=0.98)
  fired: description::off_target  (P=0.97)
  fired: description::unreasonable  (P=0.86)
```

## Step 5: escalate to the reasoning model

Since a signal fired, we pay for the strong model (`gpt-5.5`, `reasoning_effort="high"`)

```python theme={null}
final_record = (
    extract(REASONING, prompt, schema, content, reasoning_effort="high")
    if escalate
    else mini_record
)

print("mini      :", json.dumps(mini_record))
print("reasoning :", json.dumps(final_record))
print("\nfield-level diff (mini -> final):")
for name in mini_record:
    if mini_record[name] != final_record.get(name):
        print(f"  {name}: {mini_record[name]!r}  ->  {final_record.get(name)!r}")
```

```
mini      : {"registration_open_date": "", "description": "Registration opens for the fall semester"}
reasoning : {"registration_open_date": "", "description": ""}

field-level diff (mini -> final):
  description: 'Registration opens for the fall semester'  ->  ''
```

* **The improvement**
  * The reasoning model drops the fabricated `description`, returning `""`
  * It recognized the page never describes a registration date, and declined to invent one
  * The cascade paid for the reasoning model on this item only because the verifier
    flagged it

## Step 6: what this looks like on 100 prompts

* **These are internal TypeSafe results** from an earlier, separate run of the same loop:
  * `extract → verify → escalate`, `gpt-5.4-mini → gpt-5.5-reasoning`, with the
    `any_flag` gate over the per-field heads, on 100 ScrapeGraphAI-100k prompts
  * TypeSafe scores each item's cheap-rung extraction; we sweep the gate threshold from 0
    to 1 and plot every resulting config in (cost, quality) space
  * quality is an LLM judge's score of each extraction (`mean llm_judge` on the chart)
  * the verifier in that run was `jev-1.12`

![internal results: cost/quality frontier over 100 prompts](https://mintcdn.com/ts-docs/2NirYCl-v96cw05F/cookbooks/sde_cascade/pareto_100prompts.png?fit=max\&auto=format\&n=2NirYCl-v96cw05F\&q=85\&s=ca6731507e07b501a6627616ba0b767a)

* how to read it:
  * **black diamonds** = the four models run on their own; cost climbs with capability,
    and the strongest, `gpt-5.5-reasoning`, sits top-right
  * **blue points** (`any_flag`) = the cascade at many gate thresholds; the dashed line is
    the **pareto frontier**
  * the cascade frontier sits **up-and-left of every single model**: a cascade point at
    about \$0.02 per extraction scores about 0.79, against 0.82 for `gpt-5.5-reasoning` at
    about \$0.045
  * the cheap rung handles the easy items, and only the flagged items pay for the
    reasoning model


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.