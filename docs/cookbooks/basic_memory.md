# Simple memory system

> Let Jev decide which requests and answers are worth remembering, then wrap the Jev call in a small function that adds memories to later calls.

Each Jev request sees only the state you send it. What a customer told your app last
month, such as their edition or their plan, is not in their next request unless your code
puts it there. The memory system here does that with one extra Jev request per call and a
Python dict.

Our example routes support tickets. In August, a customer said they self-host on Windows
Server. In September they write "Dashboards have been really slow since this morning".
Without memory, Jev sends that ticket to the cloud team instead of the self-hosted team.
With memory, all six later tickets reach the expected teams. Routing each ticket alone
gets three out of six correct.

The simple memory system has two parts:

* After each call, Jev sees the original request and its answer together. A
  `Noul` question, which we call the gate, asks whether the request states an important
  fact about the customer that should be remembered. If P(yes) is at least 0.5, the
  ticket and Jev's answer are saved as a memory for that customer.
* Before each call, we add the customer's saved tickets, with Jev's answers to them, to
  the state. We do this in a wrapper, `ask_with_memory()`, with the same arguments and
  response as `ask()`: the TypeSafe Python SDK's `client.system_one`, with the model
  pinned and the call cached.

That wrapper is a basic agent harness. A harness is the code around a model that gives it
extra capabilities such as [tool calls](https://docs.typesafe.ai/cookbooks/function_calling.md) and running in loops.
Ours only gives the model memory, kept in a plain Python dict with one list per customer
ID.

```mermaid actions={true}
  %%{init: {"fontFamily": "Inter, sans-serif", "flowchart": {"rankSpacing": 25, "wrappingWidth": 300, "subGraphTitleMargin": {"top": 8, "bottom": 20}}}}%%
flowchart TB
    IN["ask_with_memory(state, questions)"]
    subgraph R["Jev: answer the question"]
        Q1["<b>Choice:</b> which support team?"]
    end
    subgraph G["Jev: judge the routed ticket"]
        Q2["<b>Noul:</b> does the request state<br/>an important fact about the customer?"]
    end
    DEC{"P(yes) ≥ threshold?<br/>your code"}
    SAVE["save the memory<br/>under this customer's ID"]
    OUT["your code acts on<br/>the routing answer"]
    MEM[("saved memories<br/>per customer")]
    IN -- "state with memories" --> R
    R -- "original request + answer" --> G
    G --> DEC
    DEC -- "yes" --> SAVE
    DEC -- "no" --> OUT
    SAVE --> OUT
    SAVE --> MEM
    IN -. "added to this customer's<br/>next requests" .- MEM
```

Each call makes two Jev requests, one after the other: the routing request, then the gate,
which judges the ticket together with Jev's answer. You get the routing response back
whether or not anything is saved.

Because `ask_with_memory()` takes the same arguments as `ask()` and returns the same
response, you can swap one for the other without changing any other code.

## Setup

```bash
pip install ipython 'cooksafe>=0.2.0,<0.3.0'
```

Set `TYPESAFE_API_KEY`. Every API call is cached in
[`json_cache.json`](https://github.com/typesafe-ai/typesafe-public-examples/blob/main/cookbooks/basic_memory/json_cache.json).
Download it into the folder you run this code from to replay the published numbers
instead of calling the API, or leave it out to run everything live.

Numbers below came from `jev-1.14.0` on 2026-10-29.

```python
import json
import os
from pathlib import Path

from cooksafe import JsonCache, make_playground_link
from IPython.display import Markdown, display
from typesafe_sdk import Choice, Noul, NoulCriteria, SystemOneResponse, TypeSafeClient

TYPESAFE_MODEL = "jev-1.14.0"
REMEMBER_AT = 0.5  # save when P(lasting customer fact) reaches this starting threshold
MEMORY_KEY = "earlier_tickets_from_this_customer"  # where saved tickets go in the state

client = TypeSafeClient(
    api_key=os.environ.get("TYPESAFE_API_KEY", "cache-only"),  # keyless kernels replay the cache
    base_url=os.environ.get("TYPESAFE_ENDPOINT"),
    timeout=120.0,
)
json_cache = JsonCache(Path("json_cache.json"))
```

## Define the tickets

Two customers, five earlier tickets and three later messages, all written for this
cookbook. C-1042 (Acme Corp) runs the self-hosted edition on Windows Server under an
Enterprise contract. C-2210 (Example Studio) is on the cloud edition's self-serve Team
plan. Three of the earlier tickets state a lasting fact: an edition, a plan, a contract.
Two don't: a phone at the airport, a public holiday. No later message mentions the
customer's setup, so without memory Jev has to guess it.

Each ticket becomes a state with two parts, built by `ticket_state()`: `customer`, who the
customer is, and `ticket`, a simplified helpdesk thread. In your app, the state is each
ticket as your helpdesk sends it, and `ask_with_memory()` adds the customer's saved
tickets to it.
The split into earlier tickets and later messages is only for this example.

```python expandable
DATA = {
    "customers": {
        "C-1042": {"id": "C-1042", "company": "Acme Corp"},
        "C-2210": {"id": "C-2210", "company": "Example Studio"},
    },
    "earlier_tickets": [
        {"id": "T-101", "customer_id": "C-1042", "received_on": "2026-08-04",
         "subject": "Adding an admin",
         "text": "Hi, we run your self-hosted edition on Windows Server 2022 in our own data "
                 "centre. How do I add a new admin user?"},
        {"id": "T-102", "customer_id": "C-2210", "received_on": "2026-08-11",
         "subject": "Exporting to PDF",
         "text": "We're a small design studio on your cloud edition, paying monthly on the "
                 "self-serve Team plan. How do I export a dashboard as a PDF?"},
        {"id": "T-103", "customer_id": "C-1042", "received_on": "2026-08-19",
         "subject": "Invoice download",
         "text": "Sorry for the typos, typing this on my phone at the airport. Where can I "
                 "download last month's invoice?"},
        {"id": "T-104", "customer_id": "C-2210", "received_on": "2026-09-02",
         "subject": "Dark mode?",
         "text": "Our whole team is out on Friday for a public holiday, so no rush on this "
                 "one. Is there a dark mode?"},
        {"id": "T-105", "customer_id": "C-1042", "received_on": "2026-09-10",
         "subject": "Sandbox environment",
         "text": "For context, we signed an Enterprise contract with you in March. Can we get "
                 "a sandbox environment for testing?"},
    ],
    "later_messages": [
        {"subject": "Slow dashboards",
         "text": "Dashboards have been really slow since this morning."},
        {"subject": "Upgrade failing",
         "text": "The upgrade to version 5.2 keeps failing halfway through."},
        {"subject": "More seats",
         "text": "We'd like to add 20 more seats before next quarter."},
    ],
    "later_received_on": "2026-09-28",
    # Labelled by hand from what each customer said in the earlier tickets.
    "expected_team": {
        "C-1042": {"Slow dashboards": "selfhosted_windows",
                   "Upgrade failing": "selfhosted_windows", "More seats": "enterprise_desk"},
        "C-2210": {"Slow dashboards": "cloud_ops", "Upgrade failing": "cloud_ops",
                   "More seats": "billing"},
    },
}
CUSTOMERS = DATA["customers"]

def ticket_state(customer_id: str, ticket_id: str, received_on: str, subject: str,
                 text: str) -> dict:
    """The state Jev sees for one ticket: a simplified ticket, like one from a helpdesk."""
    return {
        "customer": CUSTOMERS[customer_id],
        "ticket": {
            "id": ticket_id,
            "received_on": received_on,
            "subject": subject,
            "messages": [{"from": "customer", "text": text}],
        },
    }

EARLIER = [
    ticket_state(t["customer_id"], t["id"], t["received_on"], t["subject"], t["text"])
    for t in DATA["earlier_tickets"]
]
print(f"{len(CUSTOMERS)} customers, {len(EARLIER)} earlier tickets, "
      f"{len(DATA['later_messages'])} later messages. The first ticket as Jev sees it:\n")
print(json.dumps(EARLIER[0], indent=2))
```

```
2 customers, 5 earlier tickets, 3 later messages. The first ticket as Jev sees it:

{
  "customer": {
    "id": "C-1042",
    "company": "Acme Corp"
  },
  "ticket": {
    "id": "T-101",
    "received_on": "2026-08-04",
    "subject": "Adding an admin",
    "messages": [
      {
        "from": "customer",
        "text": "Hi, we run your self-hosted edition on Windows Server 2022 in our own data centre. How do I add a new admin user?"
      }
    ]
  }
}
```

## Route a ticket

One `Choice` question picks the support team. The `none_suitable` option gives Jev an
answer for when no team fits, and a ticket with too little context can end up there.

```python expandable
ROUTE = {
    "team": Choice(
        instructions="Which support team should handle `ticket`?",
        criteria={
            "cloud_ops": "Cloud team: problems with the hosted cloud edition, run by us",
            "selfhosted_linux": "Self-hosted team, Linux: installs, upgrades and "
            "performance of the self-hosted edition on Linux servers",
            "selfhosted_windows": "Self-hosted team, Windows: installs, upgrades and "
            "performance of the self-hosted edition on Windows Server",
            "billing": "Billing: invoices, payments, seats and plan changes for "
            "self-serve plans",
            "enterprise_desk": "Enterprise desk: seats, contracts and account changes for "
            "customers on an Enterprise contract (their technical problems go to the "
            "technical teams)",
            "general": "General product questions: features, how-to, settings",
            "none_suitable": "None of these teams fits the ticket",
        },
    ),
}

@json_cache
def _system_one(model: str, state: str, questions: str) -> dict:
    response = client.system_one(
        state=json.loads(state), questions=json.loads(questions), model=model
    )
    return response.model_dump(mode="json")

def ask(state: dict, questions: dict) -> SystemOneResponse:
    """client.system_one, with the model pinned and the call cached."""
    as_json = {qid: q.model_dump(mode="json", exclude_none=True) for qid, q in questions.items()}
    raw = _system_one(TYPESAFE_MODEL, json.dumps(state), json.dumps(as_json))
    return SystemOneResponse.model_validate(raw)

def later_state(customer_id: str, message_index: int) -> dict:
    """One of the later messages, sent by this customer, with a fixed ticket ID."""
    n = 201 + 3 * list(CUSTOMERS).index(customer_id) + message_index
    message = DATA["later_messages"][message_index]
    return ticket_state(customer_id, f"T-{n}", DATA["later_received_on"], message["subject"],
                        message["text"])

slow = later_state("C-1042", 0)
team = ask(slow, ROUTE).answers["team"]
print(f"C-1042: {slow['ticket']['messages'][0]['text']!r}")
print(f"  plain Jev -> {team.choice} {team.probabilities[team.choice]:.2f}")
```

```
C-1042: 'Dashboards have been really slow since this morning.'
  plain Jev -> cloud_ops 0.55
```

Plain Jev sends C-1042's slow dashboards to the cloud team. This ticket alone gives it no
reason to do anything else.

## Ask Jev whether the ticket is worth remembering

First, we pair the original state with Jev's answer in `as_memory()`. This pair is the
memory the wrapper may save. The `request` key holds the state from before memories were
added, so old memories never end up nested inside new ones. `jev_answered` maps each
question to its answer.

A second Jev call reads that pair. The gate asks whether the request
states an important fact about the customer, such as their edition, operating system, plan
or contract. Jev's answer is there as context, but a fact that appears only in the
answer does not count. Without that rule, a generic answer such as "General product
questions" can outweigh a real fact in the request, and an answer that relied on an
earlier memory can be saved again as if it were new.

```python expandable
GATE = {
    "remember": Noul(
        instructions=(
            "In `request.ticket`, does the thread state a lasting fact about the customer that "
            "should change how their future, unrelated tickets are handled? Count what the "
            "customer or our support staff wrote in `request.ticket`. `jev_answered` shows how "
            "the ticket was routed, which may rely on things learned earlier: do not count "
            "anything it says or implies."
        ),
        criteria=NoulCriteria(
            true=(
                "Yes: in `request.ticket` the customer or our support staff state something "
                "about the customer that stays true after this ticket, such as the product "
                "edition or operating system they run, their plan or contract, or a standing "
                "preference."
            ),
            false=(
                "No: `request.ticket` only contains things specific to this one ticket or "
                "moment, such as a one-off request, today's schedule, or the device they "
                "happen to be typing on; or the lasting fact appears only in `jev_answered`."
            ),
        ),
    ),
}

def answer_text(question, answer):
    """The readable part of an answer: the chosen option's description, or the number."""
    if answer.type == "choice":
        return question.criteria[answer.choice]
    return answer.noul if answer.type == "noul" else answer.score

def as_memory(state: dict, questions: dict, response: SystemOneResponse) -> dict:
    return {
        "request": state,
        "jev_answered": {
            q.instructions: answer_text(q, response.answers[qid])
            for qid, q in questions.items()
        },
    }

def remember_probability(memory: dict) -> float:
    """P(the request states an important fact about the customer), with the answer as context."""
    return ask(memory, GATE).answers["remember"].noul
```

## Wrap the call so it remembers

We keep memories in `MEMORIES`, one list per customer ID, and look them up by the ID in
the state.

```python
MEMORIES: dict[str, list[dict]] = {}  # customer ID -> that customer's saved memories

def customer_id(state: dict) -> str:
    return state["customer"]["id"]

def ask_with_memory(state: dict, questions: dict) -> SystemOneResponse:
    """ask(), plus memory: same arguments, same return value."""
    # 1. Answer the call with this customer's existing memories.
    saved = MEMORIES.get(customer_id(state), [])
    response = ask({**state, MEMORY_KEY: saved} if saved else state, questions)

    # 2. Ask Jev whether the original request states an important fact worth keeping.
    memory = as_memory(state, questions, response)
    if remember_probability(memory) >= REMEMBER_AT:
        MEMORIES.setdefault(customer_id(state), []).append(memory)
    return response
```

Adding memory this way has five consequences for your app:

* **Every call makes two sequential requests:** the routing request, then the memory
  gate. The gate judges the ticket together with Jev's answer, so it runs after the
  routing request. If your gate ignores the answer, it could instead be a second question
  in the routing request (see [fan-out](https://docs.typesafe.ai/patterns/fan-out.md) and
  [parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions.md)).
* **Memory only grows.** Every saved memory goes into every later call for that
  customer. There is no size limit, no check for relevance and no expiry date here.
* **Your questions never mention the memories.** The memories go into the state under
  `earlier_tickets_from_this_customer`, and Jev reads the whole state. Nothing in
  `ROUTE` changes.
* **The state needs `customer.id`.** Plain Jev also accepts a string as the state, but
  this wrapper needs the ID to find the customer's list.
* **A saved answer can repeat a mistake.** The gate ignores anything that appears only in
  Jev's answer, so an answer can't get a ticket saved by itself. A saved ticket keeps its
  answer, though, and every later call for that customer reads it, so a wrong inference
  can carry forward.

## Send the earlier tickets and watch the answers change

Send the five earlier tickets through `ask_with_memory()`, in the order they arrived.
Before the first ticket, and again after each one, that customer sends two of the later
messages: slow dashboards and 20 more seats. This shows how each saved memory changes
Jev's answers. The repeated messages go through the wrapper too, so the gate judges them
as well.

```python
PROBES = {"Slow dashboards": 0, "More seats": 2}  # later messages to send after each ticket

def memory_ids(cid: str) -> str:
    return ", ".join(m["request"]["ticket"]["id"] for m in MEMORIES.get(cid, [])) or "none"

def send_probes(cid: str) -> None:
    for subject, i in PROBES.items():
        team = ask_with_memory(later_state(cid, i), ROUTE).answers["team"]
        print(f"      {subject:<16} -> {team.choice:<19} {team.probabilities[team.choice]:.2f}")

for cid in CUSTOMERS:
    print(f"{cid}, memories: {memory_ids(cid)}")
    send_probes(cid)

for state in EARLIER:
    cid = customer_id(state)
    response = ask_with_memory(state, ROUTE)
    p = remember_probability(as_memory(state, ROUTE, response))  # cached: the wrapper's call
    verdict = "saved" if p >= REMEMBER_AT else "not saved"
    text = state["ticket"]["messages"][0]["text"]
    print(f"\n{cid} {state['ticket']['id']}  {response.answers['team'].choice:<19} "
          f"P(remember) {p:.2f}  {verdict}")
    print(f"    {text[:84]}")
    print(f"{cid}, memories: {memory_ids(cid)}")
    send_probes(cid)
```

```text expandable
C-1042, memories: none
      Slow dashboards  -> cloud_ops           0.55
      More seats       -> enterprise_desk     0.53
C-2210, memories: none
      Slow dashboards  -> cloud_ops           0.68
      More seats       -> billing             0.58

C-1042 T-101  selfhosted_windows  P(remember) 0.97  saved
    Hi, we run your self-hosted edition on Windows Server 2022 in our own data centre. H
C-1042, memories: T-101
      Slow dashboards  -> selfhosted_windows  0.99
      More seats       -> enterprise_desk     0.53

C-2210 T-102  general             P(remember) 0.98  saved
    We're a small design studio on your cloud edition, paying monthly on the self-serve 
C-2210, memories: T-102
      Slow dashboards  -> cloud_ops           0.98
      More seats       -> billing             0.98

C-1042 T-103  billing             P(remember) 0.02  not saved
    Sorry for the typos, typing this on my phone at the airport. Where can I download la
C-1042, memories: T-101
      Slow dashboards  -> selfhosted_windows  0.99
      More seats       -> enterprise_desk     0.53

C-2210 T-104  general             P(remember) 0.03  not saved
    Our whole team is out on Friday for a public holiday, so no rush on this one. Is the
C-2210, memories: T-102
      Slow dashboards  -> cloud_ops           0.98
      More seats       -> billing             0.98

C-1042 T-105  enterprise_desk     P(remember) 0.96  saved
    For context, we signed an Enterprise contract with you in March. Can we get a sandbo
C-1042, memories: T-101, T-105
      Slow dashboards  -> selfhosted_windows  0.98
      More seats       -> enterprise_desk     1.00
```

The three tickets that state an edition, a plan or a contract are saved at 0.96 to 0.98.
T-102 is saved even though Jev routed it to the general team, because the gate counts
the customer's words, not the answer. The airport and public-holiday tickets score 0.02
and 0.03 and are not saved, so the answers after them do not change.

Each saved memory changes the answers it is relevant to. For C-1042, the Windows ticket
moves slow dashboards from the cloud team (0.55) to the Windows team (0.99), and the
Enterprise contract raises the Enterprise desk's probability for more seats from 0.53 to
1.00. For C-2210, the Team-plan ticket raises the cloud team's probability for slow
dashboards from 0.68 to 0.98, and billing's for more seats from 0.58 to 0.98. The gate
saved none of the repeated messages.

## Route the same messages for both customers

Each customer now sends the three later messages. Each message goes to plain `ask()` and
to `ask_with_memory()`, with the same state and the same question.

```python
EXPECTED = DATA["expected_team"]
plain_correct = memory_correct = total = 0
example_state = None

def cell(answer, expected: str) -> str:
    mark = "✓" if answer.choice == expected else "✗"
    return f"{mark} {answer.choice} {answer.probabilities[answer.choice]:.2f}"

print(f"{'customer':<9}{'message':<17}{'expected':<20}{'plain Jev':<27}{'with memory':<27}")
for cid in CUSTOMERS:
    for i, message in enumerate(DATA["later_messages"]):
        state = later_state(cid, i)
        expected = EXPECTED[cid][message["subject"]]
        plain = ask(state, ROUTE).answers["team"]
        if example_state is None:
            # Keep the exact state used for this call for the playground link.
            saved = MEMORIES.get(cid, [])
            example_state = json.loads(json.dumps({**state, MEMORY_KEY: saved} if saved else state))
        response = ask_with_memory(state, ROUTE)
        remembered = response.answers["team"]
        plain_correct += plain.choice == expected
        memory_correct += remembered.choice == expected
        total += 1
        print(f"{cid:<9}{message['subject']:<17}{expected:<20}{cell(plain, expected):<27}"
              f"{cell(remembered, expected):<27}")

print(f"\nExpected routes: {plain_correct}/{total} without memory, "
      f"{memory_correct}/{total} with memory.")
```

```
customer message          expected            plain Jev                  with memory                
C-1042   Slow dashboards  selfhosted_windows  ✗ cloud_ops 0.55           ✓ selfhosted_windows 0.98  
C-1042   Upgrade failing  selfhosted_windows  ✗ none_suitable 0.64       ✓ selfhosted_windows 1.00  
C-1042   More seats       enterprise_desk     ✓ enterprise_desk 0.53     ✓ enterprise_desk 1.00     
C-2210   Slow dashboards  cloud_ops           ✓ cloud_ops 0.68           ✓ cloud_ops 0.98           
C-2210   Upgrade failing  cloud_ops           ✗ none_suitable 0.58       ✓ cloud_ops 0.95           
C-2210   More seats       billing             ✓ billing 0.58             ✓ billing 0.98             

Expected routes: 3/6 without memory, 6/6 with memory.
```

With memory, all six messages reach the expected team, against three without. The same
message now goes to a different team for each customer: slow dashboards go to the
Windows team for C-1042 and stay with the cloud team for C-2210, and 20 more seats go to
the Enterprise desk for C-1042 and to billing for C-2210. Where plain Jev was already
right, memory raises the probability, from 0.53 to 1.00 for C-1042's seats. The gate also
judged the six later messages and saved none, because they state no important fact.

Each row's expected team follows from the customer's setup in the earlier tickets:
C-1042's self-hosted edition and Enterprise contract, C-2210's cloud Team plan.

## Open it in the playground

The link holds the exact routing state used for C-1042's first slow-dashboards call,
including its memories at that point, plus the routing question.

```python
playground_link = make_playground_link(example_state, ROUTE, models=[TYPESAFE_MODEL])
display(Markdown(
    f"🔗 [Open C-1042's ticket with its memories in the TypeSafe playground]({playground_link})"
))
```

[Open C-1042's ticket with its memories in the TypeSafe playground →](https://console.typesafe.ai/playground#share/N4IgJg9gxgrgtgUwHYBcAqCAeKQC4AEIwAOiLAM4oSIBOpBJIAlmPfqQMIC0AjAAwAWAEykANOzLUADgEMkATzakAglET4OEGlNIBfcaRRMoAawQo2jFkpBouQvjzESaCKAiYA3BGAD6EJBsHIQA2Lj4ATnsADmdSchgAIwArNws8CQBlABsIAHd8MBlyAAtEiBkaMHI4kERychkAcwQajIBtRgAzGmobCipaWpQsdIJSABFisoqq8nwSmW98RIRkfFcZbOz5fHJcgvImJHd8FBKmebgtJGOmgDo9AF19CQRK7KYEGl8jU3NyL4etRfhdAQNqN82J1SK4AI4wVpjfCMCFDDJWVgZTi8QQiEAGSRwWQKGyqdSabR6Ql-MzIzE2Oz8JwElxuDzePwBIJ8ULhaLhAS1BIpNJksBgO74OTSsBwY61eqNFptAgwkDAuD9GCUSF0VmGUY2AASTHEeQQGxgSHw8ggMBoewQ2S6XBKEEoPnwPiYRgC+H9AHVjpA8vNMt9vI7gkJ8McAw6A3kbUUUDJ8O5UK57vhjflChB8ABJWVgaX4JAIAoyOXxnXfAD8z10r1IqU8vjk5AtrixDFIgYuUBKexgUikWhQZ3ecD27pg2TLiyQYGyloABrTzOum9iQBGXW6PSMyyMZHBxMGV-lyARjpQttlyOIx00aDXWtKV-gpN8ulo4DkU4IC6M4SktchnVdd1PTLH0-RtIMQxvfAIxoKM9FeRh4URShLFINEoQxUhrD3bh+GEWooGkORFD3clLUpHQQFbEAt3pEi+wkJk+AAVlqVx3C8Hx-ECPdgjCSJcWFJJUigZFSEyOQwHKTBvSQTwmF6JBEFQRVWmVVpoW6XotT3Qj9RpI09wAMS0DMAhGbBzQgpgmkrMsZQAUVQb4pBoS5LWorMZHk-A8l9Ec7RgOMbQAWUqYccw4GULXwFop3TRoV1U9TNO03Sp3-R0RkoO5d10F5WPbTskG7b4fHwkBB2MEcEnHSdp3POd7UXBZlLXfBN2MOkdxsHyRm0ALIMKVoTAISCZBQZ8HJC+T5mU6UoGo60p2HOQVXwYqMx1QZvnmf1vN8qbAtWlB3zCgAKc4PBKtwSluKAth-XpEjXOB5iaQsqDAy0RmHT7vrPAGAEpMJeVkQH86RlowbAMiIQ1zyalB5F-fp3WMBBanve6YHkpgAlVCQWuHUcOpoKdoZ6hclwGjd2LGg0yACyamBkJqoFyGAuSkanOGF08ZwIZG-oQAHwsi0GFmPL0hftODJQQ8QaGtFZdh1YUoJgk9fE+JAYEwGwD2g1WpfPcQABljktu86rTbYVtfd8wE-TbfxoYrAJOS0QOVyDDxNr14MpxCbWdi21Mg9DzqNl0o78CLrzDa2oKPWCuovfAr1DW9YofT2XykN8Pw278A6DoDQ9Al6nUju3vS12OAxtEuULQjDucSJhtjuGwACER-Npo3c8CAiZW2R5EKlbFuWr8yykbIZX2pBDuOiPXWT5Yt67WpkEm-zAt8X3yBMcbrqvmbb-mp0lpW4L7tC9fNtCnbUAzMufe9kLIXRtFdS+00gqOQelOZ64EtLTghsYb6st-qA2BsDcCSCPooOyIXcgcNuYtErO+bINgADiyBvioN6GAcmU4ERIljmXLo7wUAOlaOId0eQuBUHEJBFARg95tEJEgAICBfAJF9DIOWNgAByEiAwt3AjNaG8wui+nmK3dimFdCIxkFIJgAA1c6scMaeB4IjCOaQfBxQgL7J8HQQDtl4PcHgAh7h8BAC8IAA)

## Next steps

* **Choose what your app should remember.** Edit `GATE` to describe what is worth
  remembering for your own task. To set `REMEMBER_AT`, label request-and-answer pairs from
  your traffic as worth remembering or not, pick the probability that best separates the
  two groups, and check it on pairs you didn't use to pick it. Raise it if a misleading
  memory costs more than a missing one. See [Confidence](https://docs.typesafe.ai/confidence.md) and
  [confidence-based routing](https://docs.typesafe.ai/patterns/confidence-routing.md).
* **Choose which memories to add.** The wrapper adds every saved memory. A relevance
  question can select a smaller set once the list gets long.
* **Replace outdated memories.** Ask whether a new memory replaces an older one, then
  remove the old entry in code when appropriate.
* **Keep memories between runs.** Replace `MEMORIES` with a database keyed by customer
  ID. The in-memory dict disappears when the process exits.
* **Remember what your app did.** Add your reply to the ticket thread as a support
  message, and the gate judges it along with the customer's words.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
