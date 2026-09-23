# Retries

> Configure retries with RetryPolicy — attempt count, retryable statuses, backoff, and retry headers handling.

<a id="retries" />

<h2 id="typesafe_sdk.RetryPolicy">
  typesafe_sdk.RetryPolicy
</h2>

`dataclass`

```python
RetryPolicy(
    max_retries: int = 2,
    backoff_initial: float = 0.5,
    backoff_max: float = 5.0,
    backoff_jitter: float = 0.25,
    http_statuses: set[int] = (
        lambda: {408, 429, *range(500, 600)}
    )(),
    respect_retry_after: bool = True,
    api_connection_error: bool = True,
    api_timeout_error: bool = True,
    exceptions: set[
        type[BaseException]
    ] = set(),
    predicate: Callable[[BaseException], bool]
    | None = None,
    timeout: float | None = 30.0,
)
```

Configuration for SDK retry behavior.

Examples:

```python
from typesafe_sdk import RetryPolicy, TypeSafeClient

client = TypeSafeClient(
    retry=RetryPolicy(
        max_retries=3, timeout=10.0, http_statuses={429, 500, 502, 503, 504}
    )
)
```

<h3 id="typesafe_sdk.RetryPolicy.max_retries">
  max_retries
</h3>

`class-attribute` `instance-attribute`

```python
max_retries: int = 2
```

Maximum retries after the initial attempt; `0` disables retries.

<h3 id="typesafe_sdk.RetryPolicy.backoff_initial">
  backoff_initial
</h3>

`class-attribute` `instance-attribute`

```python
backoff_initial: float = 0.5
```

First backoff delay in seconds, doubled each attempt up to `backoff_max`; zero disables backoff.

<h3 id="typesafe_sdk.RetryPolicy.backoff_max">
  backoff_max
</h3>

`class-attribute` `instance-attribute`

```python
backoff_max: float = 5.0
```

Maximum backoff delay in seconds; zero disables backoff.

<h3 id="typesafe_sdk.RetryPolicy.backoff_jitter">
  backoff_jitter
</h3>

`class-attribute` `instance-attribute`

```python
backoff_jitter: float = 0.25
```

Fraction of each backoff delay randomly subtracted, between 0 and 1.

<h3 id="typesafe_sdk.RetryPolicy.http_statuses">
  http_statuses
</h3>

`class-attribute` `instance-attribute`

```python
http_statuses: set[int] = field(
    default_factory=lambda: {
        408,
        429,
        *range(500, 600),
    }
)
```

HTTP status codes that are retried.

<h3 id="typesafe_sdk.RetryPolicy.respect_retry_after">
  respect_retry_after
</h3>

`class-attribute` `instance-attribute`

```python
respect_retry_after: bool = True
```

Whether to honor `Retry-After` and `retry-after-ms` response headers.

<h3 id="typesafe_sdk.RetryPolicy.api_connection_error">
  api_connection_error
</h3>

`class-attribute` `instance-attribute`

```python
api_connection_error: bool = True
```

Whether to retry `TypeSafeAPIConnectionError`, raised when the request cannot reach or read from the server.

<h3 id="typesafe_sdk.RetryPolicy.api_timeout_error">
  api_timeout_error
</h3>

`class-attribute` `instance-attribute`

```python
api_timeout_error: bool = True
```

Whether to retry `TypeSafeAPITimeoutError`, raised when the request exceeds its timeout.

<h3 id="typesafe_sdk.RetryPolicy.exceptions">
  exceptions
</h3>

`class-attribute` `instance-attribute`

```python
exceptions: set[type[BaseException]] = field(
    default_factory=set
)
```

Additional exception types that trigger a retry, on top of the built-in rules.

<h3 id="typesafe_sdk.RetryPolicy.predicate">
  predicate
</h3>

`class-attribute` `instance-attribute`

```python
predicate: (
    Callable[[BaseException], bool] | None
) = None
```

An optional predicate called with the raised exception; returning `True` triggers a retry in addition to the other rules.

<h3 id="typesafe_sdk.RetryPolicy.timeout">
  timeout
</h3>

`class-attribute` `instance-attribute`

```python
timeout: float | None = 30.0
```

Total retry budget in seconds per SDK call, including the initial attempt and delays; `None` disables the limit.

Stops before a retry whose delay would reach or exceed the budget, re-raising the last error.
