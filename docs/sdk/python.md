# TypeSafe Python SDK

> Install the TypeSafe Python SDK and get started with asynchronous or synchronous API calls.

Browse the [Python SDK source on GitHub](https://github.com/typesafe-ai/typesafe-sdk-python).

Asynchronous and synchronous Python clients for the [TypeSafe](https://typesafe.ai) API. Learn how to use TypeSafe [here](https://docs.typesafe.ai/).

## Quickstart

1. Install the SDK:

   > [tab] uv
   >
   > ```sh
   > uv add typesafe-sdk
   > ```

   > [tab] pip
   >
   > ```sh
   > pip install typesafe-sdk
   > ```

   Extras (for example, `typesafe-sdk[http2]`) supported:

   * `http2`: enable [HTTP/2 support](https://docs.typesafe.ai/sdk/python/usage/advanced.md#http2)
   * `pil`: send [Pillow images](https://docs.typesafe.ai/sdk/python/api/types/assets.md#typesafe_sdk.Image.from_pil)
   * `zstd`: [compress request bodies](https://docs.typesafe.ai/sdk/python/usage/advanced.md#ensure-zstd-is-available) on Python 3.13 and earlier
2. Set `TYPESAFE_API_KEY` in your environment (create it [here](https://console.typesafe.ai/))
3. Call the System One API:

   > [tab] Async
   >
   > With [AsyncTypeSafeClient](https://docs.typesafe.ai/sdk/python/api/clients/async.md):
   >
   > ```python
   > from typesafe_sdk import AsyncTypeSafeClient, Choice, Noul, Score
   >
   >
   > async def main() -> None:
   >     async with AsyncTypeSafeClient() as client:
   >         response = await client.system_one(
   >             state={"document": "I was charged twice. Please fix this ASAP."},
   >             questions={
   >                 "billing": Noul(instructions="Is this ticket about billing?"),
   >                 "tone": Choice(
   >                     instructions="What is the customer's tone?",
   >                     criteria={"calm": None, "frustrated": None, "angry": None},
   >                 ),
   >                 "urgency": Score(
   >                     instructions="How urgent is this ticket?",
   >                     criteria=["can wait", "this week", "today"],
   >                 ),
   >             },
   >         )
   >
   >     print(response.nouls["billing"].noul)
   >     print(response.choices["tone"].choice)
   >     print(response.scores["urgency"].score)
   > ```

   > [tab] Sync
   >
   > With [TypeSafeClient](https://docs.typesafe.ai/sdk/python/api/clients/sync.md):
   >
   > ```python
   > from typesafe_sdk import Choice, Noul, Score, TypeSafeClient
   >
   > with TypeSafeClient() as client:
   >     response = client.system_one(
   >         state={"document": "I was charged twice. Please fix this ASAP."},
   >         questions={
   >             "billing": Noul(instructions="Is this ticket about billing?"),
   >             "tone": Choice(
   >                 instructions="What is the customer's tone?",
   >                 criteria={"calm": None, "frustrated": None, "angry": None},
   >             ),
   >             "urgency": Score(
   >                 instructions="How urgent is this ticket?",
   >                 criteria=["can wait", "this week", "today"],
   >             ),
   >         },
   >     )
   >
   > print(response.nouls["billing"].noul)
   > print(response.choices["tone"].choice)
   > print(response.scores["urgency"].score)
   > ```

## What's next

Visit the [Usage guide](https://docs.typesafe.ai/sdk/python/usage/basic.md) to learn how to:

* [Choose a System One model](https://docs.typesafe.ai/sdk/python/usage/basic.md#choosing-a-model)
* [Send media inputs](https://docs.typesafe.ai/sdk/python/usage/basic.md#attaching-media-assets)
* [Use typed responses](https://docs.typesafe.ai/sdk/python/usage/basic.md#typed-system_one-responses)
* [Configure retry policy](https://docs.typesafe.ai/sdk/python/usage/basic.md#retries)
* [Optimize performance](https://docs.typesafe.ai/sdk/python/usage/advanced.md#performance)

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
