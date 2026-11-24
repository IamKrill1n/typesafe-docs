> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Choice

> A Choice is a System One question type for selecting one option from a defined set. The answer includes the selected option, a probability for each option, and confidence.

Use a Choice when the answer is one of a fixed set of options. For example, which team handles a ticket, which category a product belongs to, or which language a code snippet is written in. If the answer is a position on a spectrum, use a [Score](https://docs.typesafe.ai/primitives/score.md). If it's a yes or no, use a [Noul](https://docs.typesafe.ai/primitives/noul.md). [Choose a question type](https://docs.typesafe.ai/primitives#choose-a-question-type) compares all three.

A Choice answer is the selected option in `choice`. The model also returns a probability for every option in `probabilities`, and a `confidence` value for the selected option.

Example questions:

```
"What programming language is this code written in"
  → options: python, javascript, typescript, go, rust, other

"What type of meeting is this based on the title and description"
  → options: standup, planning, retrospective, one on one, brainstorm, none of the above

"Which product category does this item belong to"
  → options: electronics, clothing, home garden, food and beverage
```

## Request structure

The POST request body to the [TypeSafe API](https://docs.typesafe.ai/api) has a specific structure. The top level has three fields: `state`, the content to evaluate; `model`; and `questions`, a map from question ids you choose to question objects. Each Choice question has the following fields:

* `type`: Always `"choice"`.
* `instructions`: The question the model answers.
* `criteria`: The answer options, as a map. Each key is an option name and each value is a description of that option.

Below is a request where the state is a support ticket from an online shoe store and the question is which team should handle it:

Try it in the Playground →

You choose the question id, `department` in this case. The answer is returned under the same id. The model never sees the question id. The option names and their descriptions are both sent to the model, so write descriptions that separate the options from each other.

Our [client SDKs](https://docs.typesafe.ai/sdk.md) provide typed questions. In Python, the same question is a `Choice`:

```python theme={null}
from typesafe_sdk import Choice, TypeSafeClient

with TypeSafeClient() as client:
    response = client.system_one(
        state="My running shoes arrived in the wrong size. Can I swap them for a size 10?",
        questions={
            "department": Choice(
                instructions="Which team should handle this?",
                criteria={
                    "returns": "Exchanges, wrong or damaged items",
                    "shipping": "Delivery status, delays, lost packages",
                    "billing": "Charges, invoices, payment problems",
                },
            ),
        },
    )

    print(response.answers["department"].choice)
```

Use the `system_one` method or the `https://api.typesafe.ai/v1/systemone` endpoint to call a System One model such as Jev. The `model` field selects which model handles the request. [How to build with TypeSafe](https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md) covers where in your code to call it.

Use one of our [client SDKs](https://docs.typesafe.ai/sdk.md) or call the [HTTP API](https://docs.typesafe.ai/api) directly. If a coding agent is writing the integration for you, install the [TypeSafe agent skill](https://docs.typesafe.ai/agent-skill.md#installation) first so it knows the request and response shapes.

> [!NOTE]
>
> `instructions` and each entry in `criteria` can be a string, an object, or an array. Start with a string. Use an object when a description needs several kinds of guidance, such as what an option covers, what it doesn't cover, and some examples. See [Structured instructions and criteria](#structured-instructions-and-criteria) below and the [API reference](https://docs.typesafe.ai/api).

## Response structure

The response has one entry in `answers` per question, under the ids from the request. This is the response to the example request above:

```json theme={null}
{
  "model": "jev-1.14.0",
  "answers": {
    "department": {
      "type": "choice",
      "choice": "returns",
      "confidence": 1.0,
      "probabilities": {
        "returns": 1.0,
        "shipping": 0.0,
        "billing": 0.0
      }
    }
  },
  "usage": {
    "input_tokens": 357,
    "output_tokens": 38
  }
}
```

Besides `type`, each Choice answer has three values:

* `choice`: The option with the highest probability.
* `probabilities`: The full probability distribution across every option. The sum of all values is 1.
* [`confidence`](https://docs.typesafe.ai/confidence): A number from 0 to 1 computed from how `probabilities` is spread. A flat shape, with probability spread across several options, means low confidence. A single peak on one option means high confidence.

This ticket is an easy one, so all of the probability is on `returns` and confidence is 1.0. A ticket that mentions a wrong size and a missing refund would split probability between `returns` and `billing`, and confidence would drop.

## Good practice: ask more than one question per request

Ask every Choice question your code might need in a single request rather than one request per question. Questions are evaluated in parallel. Adding questions barely changes the response time, and the code can ignore answers it doesn't need. Extra questions still cost tokens. [Ask multiple questions together](https://docs.typesafe.ai/primitives#ask-multiple-questions-together) explains this in full; the next section shows five Choice questions in one request.

The same logic applies to the options inside a single Choice question. A Choice question accepts up to 255 options, and adding options costs a few tokens each, so give the model the full list of teams, categories, or products rather than a shortlist. Add an `other` or `none of the above` option when the list might not cover every input, so the model can say none of the others fit.

> [!TIP]
>
> A `none of the above` option may not work well in many use cases. As an alternative, ask a companion [Noul](https://docs.typesafe.ai/primitives/noul.md) question in the same request that checks whether anything fits at all, such as "Does `message` name any of `our_products`?" Your code then reads the Choice answer only when the Noul says yes.

To classify documents through a deep hierarchy or large taxonomy, chain Choice questions level by level. The [Hierarchical Classification cookbook](https://docs.typesafe.ai/cookbooks/hierarchical_classification.md) shows how to run a beam search over Choice probabilities, keeping the best `K` candidate paths at each level instead of committing to a single greedy path.

## A more complex example

The basic example above routes a ticket to a team. A bigger support system might also need the return reason, the delivery problem, what the customer wants, and the customer's tone.

The request below asks five Choice questions about a ticket that is more ambiguous than the first: it involves three teams and doesn't say what the customer wants.

Try it in the Playground →

Two of these Choice questions are speculative: `return_reason` only matters if the `department` is `returns`, and `shipping_issue` only matters if it's `shipping`. The `tone` question uses `null` descriptions because the option names are clear on their own.

Jev's response:

```json theme={null}
{
  "model": "jev-1.14.0",
  "answers": {
    "department": {
      "type": "choice",
      "choice": "billing",
      "confidence": 0.31,
      "probabilities": {
        "returns": 0.35,
        "shipping": 0.11,
        "billing": 0.54
      }
    },
    "return_reason": {
      "type": "choice",
      "choice": "wrong_size",
      "confidence": 1.0,
      "probabilities": {
        "wrong_size": 1.0,
        "wrong_item": 0.0,
        "damaged": 0.0,
        "changed_mind": 0.0,
        "other": 0.0
      }
    },
    "shipping_issue": {
      "type": "choice",
      "choice": "delayed",
      "confidence": 0.56,
      "probabilities": {
        "not_delivered": 0.0,
        "delayed": 0.65,
        "wrong_address": 0.0,
        "damaged_in_transit": 0.0,
        "other": 0.35
      }
    },
    "requested_resolution": {
      "type": "choice",
      "choice": "refund",
      "confidence": 0.28,
      "probabilities": {
        "exchange": 0.25,
        "refund": 0.46,
        "replacement": 0.26,
        "information": 0.03
      }
    },
    "tone": {
      "type": "choice",
      "choice": "frustrated",
      "confidence": 0.66,
      "probabilities": {
        "calm": 0.0,
        "frustrated": 0.77,
        "angry": 0.23
      }
    }
  },
  "usage": {
    "input_tokens": 750,
    "output_tokens": 237
  }
}
```

Each question is answered on its own against the ticket:

* The `department` answer is `billing` with a 0.54 probability, but `returns` has 0.35 because of the wrong size. The ticket belongs to two teams, which is why confidence is low, at 0.31.
* The `return_reason` is `wrong_size` with a confidence of 1.0, which is expected because it says this clearly in the ticket.
* The `shipping_issue` answer is split between `delayed` and `other`. It's a speculative question and `department` didn't come back as shipping, so it can be ignored by the code, as shown in the example code snippet below.
* The `requested_resolution` answer leans to `refund` at 0.46, with most of the rest split between `replacement` and `exchange`. Confidence is 0.28. The double charge suggests money back, the wrong size suggests a swap, and the customer never says which they want.
* The `tone` answer is `frustrated` with a probability of 0.77 and a confidence of 0.66.

The example code below uses only the answers it needs. When the chosen option has a low probability, the code hands the ticket to a person or asks the customer, instead of acting on that answer:

```python theme={null}
from typesafe_sdk import Choice, TypeSafeClient

TRIAGE_QUESTIONS = {
    "department": Choice(
        instructions="Which team should handle this?",
        criteria={
            "returns": "Exchanges, wrong or damaged items",
            "shipping": "Delivery status, delays, lost packages",
            "billing": "Charges, invoices, payment problems",
        },
    ),
    "return_reason": Choice(
        instructions="If the customer wants to return something, why?",
        criteria={
            "wrong_size": "The item doesn't fit",
            "wrong_item": "A different product was delivered",
            "damaged": "The item arrived broken or faulty",
            "changed_mind": "The item is fine, the customer no longer wants it",
            "other": "A return reason that fits none of the above",
        },
    ),
    "shipping_issue": Choice(
        instructions="If this is a shipping problem, which kind is it?",
        criteria={
            "not_delivered": "The package never arrived",
            "delayed": "The package is late but still on its way",
            "wrong_address": "The package went to the wrong place",
            "damaged_in_transit": "The package arrived damaged",
            "other": "A shipping problem that fits none of the above",
        },
    ),
    "requested_resolution": Choice(
        instructions="What does the customer want to happen?",
        criteria={
            "exchange": "Swap the item for a different one",
            "refund": "Money back",
            "replacement": "The same item sent again",
            "information": "Just an answer, no action needed",
        },
    ),
    "tone": Choice(
        instructions="What is the customer's tone?",
        criteria={"calm": None, "frustrated": None, "angry": None},
    ),
}


def triage(ticket: str) -> None:
    with TypeSafeClient() as client:
        response = client.system_one(
            state=ticket,
            questions=TRIAGE_QUESTIONS,
        )
    answers = response.answers

    department = answers["department"]
    if department.probabilities[department.choice] < 0.53:
        # Not clear which team to send to. Let a person decide.
        send_to_manual_triage(ticket)
        return

    if department.choice == "returns":
        # return_reason answer is only used here
        assign(ticket, team="returns", issue=answers["return_reason"].choice)
    elif department.choice == "shipping":
        # shipping_issue answer is only used here
        assign(ticket, team="shipping", issue=answers["shipping_issue"].choice)
    else:
        assign(ticket, team="billing")

    # A second team with a real share of the probability gets a copy
    for team, probability in department.probabilities.items():
        if team != department.choice and probability > 0.25:
            notify(ticket, team=team)

    resolution = answers["requested_resolution"]
    if resolution.probabilities[resolution.choice] < 0.63:
        # The customer hasn't said what they want. Ask, don't guess.
        ask_customer_what_they_want(ticket)
    elif resolution.choice == "refund":
        flag_for_refund_approval(ticket)

    if answers["tone"].choice == "angry":
        flag_for_senior_agent(ticket)
```

For the ticket above, `billing` has a probability of 0.54, just over the 0.53 cutoff, so the code assigns the ticket to the billing team instead of sending it to a person to route. `returns` has a probability of 0.35, over the 0.25 cutoff, so the returns team gets a copy. `refund` has a probability of 0.46, under the 0.63 cutoff, so the code asks the customer what they want. The code does not use the `return_reason` or `shipping_issue` answers.

One request, five answers, and the routing logic is ordinary `if` statements. If you later need to know the customer's language, or which product the ticket is about, add another Choice question to `TRIAGE_QUESTIONS`; the call count stays at one.

The [smart home assistant demo](https://docs.typesafe.ai/demos/smart-home.md) evaluates every user request against a long list of Choice questions in one call: the request category, the room, the device, and the action. Most of those questions are irrelevant to any one request and the code ignores them.

## Structured instructions and criteria

Start with a one-line description per option. When two options are similar and the model keeps confusing them, describe each one with an object instead of a string. Give it fields for what the option covers, what belongs to a neighboring option instead, and a few example inputs.

The two answer options below, return\_policy and return\_status, are easy to confuse. A ticket about either one can mention returns and refunds, so each option says what it is not for.

Try it in the Playground →

The response is `return_status` at confidence 1.0:

```json theme={null}
{
  "model": "jev-1.14.0",
  "answers": {
    "return_topic": {
      "type": "choice",
      "choice": "return_status",
      "confidence": 1.0,
      "probabilities": {
        "return_policy": 0.0,
        "return_status": 1.0
      }
    }
  },
  "usage": {
    "input_tokens": 459,
    "output_tokens": 35
  }
}
```

The field names `question`, `focus`, `what`, `not_for`, and `examples` are not part of the API, and none are reserved. You choose them, the same way you choose option names. The model sees the names along with the values, so use short names that label what follows.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.