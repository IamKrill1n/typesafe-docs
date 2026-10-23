# Synchronous client

> Use TypeSafeClient to ask questions, list models, and configure synchronous TypeSafe API requests.

## typesafe_sdk.TypeSafeClient

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`TypeSafeClient(
&#x20;   \*,
&#x20;   api_key: [str](https://docs.python.org/3/builtins/stdtypes.html#str) | None = None,
&#x20;   model: [str](https://docs.python.org/3/builtins/stdtypes.html#str) | None = None,
&#x20;   retry: [RetryPolicy](../retries.md#typesafe_sdk.RetryPolicy) | None = None,
&#x20;   timeout: [float](https://docs.python.org/3/builtins/functions.html#float)
&#x20;   | httpx2.Timeout
&#x20;   | None = None,
&#x20;   headers: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [str](https://docs.python.org/3/builtins/stdtypes.html#str)] | None = None,
&#x20;   transport: httpx2.BaseTransport
&#x20;   | None = None,
&#x20;   http_client: httpx2.[Client](https://pydantic.dev/docs/httpx2/api/api/#httpx2.Client) | None = None,
&#x20;   base_url: [str](https://docs.python.org/3/builtins/stdtypes.html#str) | None = None,
&#x20;   compression: [Literal](https://docs.python.org/3/library/typing.html#typing.Literal)\["zstd", False]
&#x20;   | None = None,
)`</pre>

Create an HTTP client for [TypeSafe AI API](https://typesafe.ai).

Explicit options take precedence over environment variables; empty or whitespace-only environment values are ignored.

> [!TIP]
>
> **Logging setup**
>
> The SDK logs to the `typesafe_sdk` logger; configure it through standard logging, or set `TYPESAFE_LOG_LEVEL` (`debug`, `info`, ...) for a quick default. Secret headers are redacted from log output; request and response bodies are not.

Parameters:

* **`api_key`** (`str | None`, default: `None` ) –

  Required API key; may be set via the `TYPESAFE_API_KEY` environment variable. Leading and trailing whitespace is stripped. Empty keys, internal whitespace, control characters, and non-ASCII characters are rejected.
* **`model`** (`str | None`, default: `None` ) –

  Model name; may be set via the `TYPESAFE_DEFAULT_MODEL` environment variable.
* **`retry`** (`RetryPolicy | None`, default: `None` ) –

  A `RetryPolicy` controlling retry behavior; see `RetryPolicy` for the available options and their defaults. Pass `RetryPolicy(max_retries=0)` to disable retries.
* **`timeout`** (`float | httpx2.Timeout | None`, default: `None` ) –

  Timeout for HTTP operations. Inherits `http_client.timeout` when supplied, otherwise the SDK default.
* **`headers`** (`Mapping[str, str] | None`, default: `None` ) –

  Additional request headers to set.
* **`transport`** (`httpx2.BaseTransport | None`, default: `None` ) –

  Optional custom HTTP transport, closed when this SDK client closes.
* **`http_client`** (`httpx2.Client | None`, default: `None` ) –

  Optional `httpx2.Client`; mutually exclusive with `transport`. Closed when this SDK client closes.
* **`base_url`** (`str | None`, default: `None` ) –

  API root; may be set via the `TYPESAFE_BASE_URL` environment variable.
* **`compression`** (`Literal['zstd', False] | None`, default: `None` ) –

  Request body compression: `"zstd"`, or `False` to send bodies uncompressed. Defaults to zstd [when available](../../usage/advanced.md#ensure-zstd-is-available).

Raises:

* `TypeSafeError` –

  The API key is missing or invalid, the timeout is invalid, or zstd compression is unavailable.
* `ValueError` –

  Both `transport` and `http_client` are supplied.

Examples:

```python
from typesafe_sdk import Choice, Noul, TypeSafeClient

with TypeSafeClient() as client:
    result = client.system_one(
        state="I was charged twice. Please help.",
        questions={
            "billing": Noul(instructions="Is this about billing?"),
            "tone": Choice(
                instructions="What is the tone?",
                criteria={"calm": None, "angry": None},
            ),
        },
    )
    assert 0 <= result.nouls["billing"].noul <= 1
    assert result.choices["tone"].choice in {"calm", "angry"}
```

### models

`cached` `property`

Copy signature

<pre tabIndex="0" aria-label="SDK signature">
  \`models

  :

  &#x20;

  [Models](./sync.md#typesafe_sdk.Models)\`
</pre>

An accessor for the Models API resource.

Examples:

```python
with TypeSafeClient() as client:
    models = client.models.list()
```

### attach_assets

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`attach\_assets(
&#x20;   assets: [Asset](../types/assets.md#typesafe_sdk.Asset) | [Sequence](https://docs.python.org/3/library/collections.abc.html#collections.abc.Sequence)\[[Asset](../types/assets.md#typesafe_sdk.Asset)],
) -> [AbstractContextManager](https://docs.python.org/3/library/contextlib.html#contextlib.AbstractContextManager)\[None]`</pre>

Attach assets to calls made within a `with` block, for referencing them inside strings.

Until the block exits, calls on this client send each attached asset whose reference, `str(asset)`, appears in the request.

> [!WARNING]
>
> **Warning**
>
> The SDK only recognizes references to assets that are attached, passed in `assets`, or placed directly in the content. A reference to any other asset is sent as plain text, without the asset.

Parameters:

* **`assets`** (`Asset | Sequence[Asset]`) –

  An asset, or a sequence of them.

Raises:

* `TypeSafeError` –

  An attached value is not an asset.

Examples:

```python
from pathlib import Path

from typesafe_sdk import Image, Noul, SystemOneResponse, TypeSafeClient

def inspect(client: TypeSafeClient, path: Path) -> SystemOneResponse:
    photo = Image(path)
    with client.attach_assets(photo):
        return client.system_one(
            state=f"Product: {photo}",
            questions={"damaged": Noul(instructions="Is the product damaged?")},
        )
```

### system_one

**Implementation**

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`system\_one(
&#x20;   state: [Content](../types/common.md#typesafe_sdk.Content),
&#x20;   questions: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [Question](../types/questions.md#typesafe_sdk.Question)],
&#x20;   \*,
&#x20;   model: [str](https://docs.python.org/3/builtins/stdtypes.html#str) | None = None,
&#x20;   assets: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [Asset](../types/assets.md#typesafe_sdk.Asset)] | None = None,
&#x20;   retry: [RetryPolicy](../retries.md#typesafe_sdk.RetryPolicy) | None = None,
&#x20;   timeout: [float](https://docs.python.org/3/builtins/functions.html#float)
&#x20;   | httpx2.Timeout
&#x20;   | None = None,
&#x20;   extra_headers: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [str](https://docs.python.org/3/builtins/stdtypes.html#str)]
&#x20;   | None = None,
&#x20;   extra_body: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [JSONValue](../types/common.md#typesafe_sdk.JSONValue) | None]
&#x20;   | None = None,
&#x20;   response_model: [type](https://docs.python.org/3/builtins/functions.html#type)\[ResponseT]
&#x20;   | None = None,
) -> [SystemOneResponse](../types/responses.md#typesafe_sdk.SystemOneResponse) | ResponseT`</pre>

**Overload 1**

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`system\_one(
&#x20;   state: [Content](../types/common.md#typesafe_sdk.Content),
&#x20;   questions: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [Question](../types/questions.md#typesafe_sdk.Question)],
&#x20;   \*,
&#x20;   model: [str](https://docs.python.org/3/builtins/stdtypes.html#str) | None = None,
&#x20;   assets: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [Asset](../types/assets.md#typesafe_sdk.Asset)] | None = None,
&#x20;   retry: [RetryPolicy](../retries.md#typesafe_sdk.RetryPolicy) | None = None,
&#x20;   timeout: [float](https://docs.python.org/3/builtins/functions.html#float)
&#x20;   | httpx2.Timeout
&#x20;   | None = None,
&#x20;   extra_headers: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [str](https://docs.python.org/3/builtins/stdtypes.html#str)]
&#x20;   | None = None,
&#x20;   extra_body: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [JSONValue](../types/common.md#typesafe_sdk.JSONValue) | None]
&#x20;   | None = None,
&#x20;   response_model: None = None,
) -> [SystemOneResponse](../types/responses.md#typesafe_sdk.SystemOneResponse)`</pre>

**Overload 2**

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`system\_one(
&#x20;   state: [Content](../types/common.md#typesafe_sdk.Content),
&#x20;   questions: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [Question](../types/questions.md#typesafe_sdk.Question)],
&#x20;   \*,
&#x20;   model: [str](https://docs.python.org/3/builtins/stdtypes.html#str) | None = None,
&#x20;   assets: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [Asset](../types/assets.md#typesafe_sdk.Asset)] | None = None,
&#x20;   retry: [RetryPolicy](../retries.md#typesafe_sdk.RetryPolicy) | None = None,
&#x20;   timeout: [float](https://docs.python.org/3/builtins/functions.html#float)
&#x20;   | httpx2.Timeout
&#x20;   | None = None,
&#x20;   extra_headers: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [str](https://docs.python.org/3/builtins/stdtypes.html#str)]
&#x20;   | None = None,
&#x20;   extra_body: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [JSONValue](../types/common.md#typesafe_sdk.JSONValue) | None]
&#x20;   | None = None,
&#x20;   response_model: [type](https://docs.python.org/3/builtins/functions.html#type)\[ResponseT],
) -> ResponseT`</pre>

Answer named questions about text, structured state, or assets.

See [System One](https://docs.typesafe.ai/go/system-one.md) for details.

Parameters:

* **`state`** (`Content`) –

  Text, an asset, a JSON object, or an array to evaluate. See [state](https://docs.typesafe.ai/go/state.md) for details.
* **`questions`** (`Mapping[str, Question]`) –

  Nonempty mapping of names to question objects or raw dictionaries.
* **`model`** (`str | None`, default: `None` ) –

  Model override; `None` inherits the client default.
* **`assets`** (`Mapping[str, Asset] | None`, default: `None` ) –

  Assets keyed by the reference used for them in `state` or questions; see [Attaching media assets](../../usage/basic.md#attaching-media-assets).
* **`retry`** (`RetryPolicy | None`, default: `None` ) –

  An optional retry policy to override the client-level value for this call only.
* **`timeout`** (`float | httpx2.Timeout | None`, default: `None` ) –

  An optional timeout for http operations to override the client-level value for this call only, in seconds.
* **`extra_headers`** (`Mapping[str, str] | None`, default: `None` ) –

  Additional request headers to set.
* **`extra_body`** (`Mapping[str, JSONValue | None] | None`, default: `None` ) –

  Additional top-level request-body fields, shallow-merged over the body after `state`, `model`, `questions`, and `assets` are set. Merging is last-write-wins: a key that collides with those fields overrides it, and object values are replaced rather than deep-merged.
* **`response_model`** (`type[ResponseT] | None`, default: `None` ) –

  Optional Pydantic `BaseModel` type describing the JSON response body, including any nested answer models.

Returns:

* `SystemOneResponse | ResponseT` –

  An instance of `response_model`, or `SystemOneResponse` with answers keyed by question
* `SystemOneResponse | ResponseT` –

  name and model and token usage details when no custom model is supplied.

Raises:

* `TypeSafeError` –

  The request is invalid before it's sent, such as empty questions or an unreadable asset.
* `TypeSafeAPIError` –

  The server returns an unsuccessful HTTP response after any retries.
* `TypeSafeAPIConnectionError` –

  The request cannot connect or times out after any retries.
* `TypeSafeAPIResponseValidationError` –

  The response body does not match the response model.

Examples:

Create questions with named arguments:

```python
with TypeSafeClient() as client:
    result = client.system_one(
        state="I was charged twice. Please help.",
        questions={
            "billing": Noul(instructions="Is this about billing?"),
            "tone": Choice(
                instructions="What is the tone?",
                criteria={"calm": None, "angry": None},
            ),
        },
    )
    assert 0 <= result.nouls["billing"].noul <= 1
    assert result.choices["tone"].choice in {"calm", "angry"}
```

Pass questions as dictionaries:

```python
with TypeSafeClient() as client:
    result = client.system_one(
        state={"message": "I was charged twice. Please help."},
        questions={
            "billing": {"type": "noul", "instructions": "Is this about billing?"},
            "tone": {
                "type": "choice",
                "instructions": "What is the tone?",
                "criteria": {"calm": None, "angry": None},
            },
        },
    )
    assert 0 <= result.nouls["billing"].noul <= 1
    assert result.choices["tone"].choice in {"calm", "angry"}
```

### close

```python
close() -> None
```

Release network resources and close the underlying HTTP client, including a supplied one.

## Models resource

Reached through [`TypeSafeClient.models`](./sync.md#typesafe_sdk.TypeSafeClient.models).

### typesafe_sdk.Models

Access to the models available to the account, reached through `TypeSafeClient.models`.

#### list

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`list(
&#x20;   \*,
&#x20;   retry: [RetryPolicy](../retries.md#typesafe_sdk.RetryPolicy) | None = None,
&#x20;   timeout: [float](https://docs.python.org/3/builtins/functions.html#float)
&#x20;   | httpx2.Timeout
&#x20;   | None = None,
&#x20;   extra_headers: [Mapping](https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping)\[[str](https://docs.python.org/3/builtins/stdtypes.html#str), [str](https://docs.python.org/3/builtins/stdtypes.html#str)]
&#x20;   | None = None,
) -> [ListModelsResponse](../types/responses.md#typesafe_sdk.ListModelsResponse)`</pre>

List the models available to the account.

Parameters:

* **`retry`** (`RetryPolicy | None`, default: `None` ) –

  An optional retry policy to override the client-level value for this call only.
* **`timeout`** (`float | httpx2.Timeout | None`, default: `None` ) –

  Per-operation timeout override; `None` inherits the client setting.
* **`extra_headers`** (`Mapping[str, str] | None`, default: `None` ) –

  Overrides for additional request headers; authentication, SDK identification, and `Accept` remain protected.

Returns:

* `ListModelsResponse` –

  A `ListModelsResponse` whose `models` holds each model's name, description,
* `ListModelsResponse` –

  and release date.

Raises:

* `TypeSafeAPIError` –

  The server returns an unsuccessful HTTP response after any retries.
* `TypeSafeAPIConnectionError` –

  The request cannot connect or times out after any retries.

Examples:

```python
from typesafe_sdk import TypeSafeClient

with TypeSafeClient() as client:
    models = client.models.list()
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
