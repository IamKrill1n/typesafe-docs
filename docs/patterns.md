# Patterns

> Architectural patterns for building systems with TypeSafe.

TypeSafe is designed to sit within a larger system, powering decisions with AI. Learning to think in terms of discrete, atomic decisions that compose into complex system behavior is a key skill for getting the most out of TypeSafe.

This section assumes you know the [TypeSafe primitives](https://docs.typesafe.ai/primitives) and understand [how confidence works](https://docs.typesafe.ai/confidence.md). If not, read those first.

## The patterns

| Pattern | What it does | Benefits |
| - | - | - |
| [Speculative fan-out](https://docs.typesafe.ai/patterns/fan-out.md) | Send many questions in a single request, including speculative ones, and let your code decide what's relevant | Cost, Speed |
| [Screen with a Noul first](https://docs.typesafe.ai/patterns/noul-screen.md) | Ask one cheap yes/no question first, and run the expensive stage only when it passes | Cost, Speed |
| [Companion Noul](https://docs.typesafe.ai/patterns/companion-noul.md) | Pair a Choice question with a Noul question that asks whether anything fits, so your code can tell when nothing does | Reliability |
| [Routing by confidence](https://docs.typesafe.ai/patterns/confidence-routing.md) | Send a Score answer to a person when its confidence is low, and route the rest on the score | Reliability, Safety |
| [Routing by probability](https://docs.typesafe.ai/patterns/probability-routing.md) | Set a higher probability threshold for riskier actions | Reliability, Safety |
| [Composite scoring](https://docs.typesafe.ai/patterns/composite-scoring.md) | Combine several dimensions of analysis into a single score | Cost, Reliability, Speed |

## Patterns by goal

Every pattern splits a decision into small System One questions and leaves the decision to your code: Jev answers each question with a probability, and your code decides what happens next. Pick by what you need:

* **Spend less.** [Speculative fan-out](https://docs.typesafe.ai/patterns/fan-out.md) asks everything in one request. [Screen with a Noul first](https://docs.typesafe.ai/patterns/noul-screen.md) keeps the expensive stages from running on inputs that don't need them.
* **Act safely.** [Routing by probability](https://docs.typesafe.ai/patterns/probability-routing.md) sets a higher threshold for riskier actions. [Routing by confidence](https://docs.typesafe.ai/patterns/confidence-routing.md) sends a Score answer that is spread across the scale to a person. [Companion Noul](https://docs.typesafe.ai/patterns/companion-noul.md) catches the case where nothing fits.
* **Combine answers.** [Composite scoring](https://docs.typesafe.ai/patterns/composite-scoring.md) adds up several Scores with weights you control.

> [!TIP]
>
> We're always keen to learn how people are making use of our primitives. If you've found a killer use case you think should be mentioned here, feel free to drop us a note!

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
