> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Integrations

> Use Jev from the agent frameworks you already build with.

Each integration starts with a quickstart that makes one Jev request through the framework, then a cookbook that builds something with it.

## LangChain

[LangChain](https://docs.langchain.com/oss/python/langchain/overview) calls Jev through its `TypeSafeClassifier` class, so a decision in an agent's middleware or chain is answered as a Jev question.

| Cookbook | What you build | Needs |
| - | - | - |
| [Quickstart](https://docs.typesafe.ai/cookbooks/langchain_quickstart.md) | One question to Jev, no agent | TypeSafe key |
| [Tool-call safety gate](https://docs.typesafe.ai/cookbooks/langchain_safety_gate.md) | An agent that asks Jev before each tool call | TypeSafe and OpenAI keys |


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.