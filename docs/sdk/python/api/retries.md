# Retries

> Configure retries with RetryPolicy — attempt count, retryable statuses, backoff, and retry headers handling.

## typesafe_sdk.RetryPolicy

`dataclass`

Copy signature
<pre tabIndex={0} aria-label="SDK signature">`RetryPolicy(
&#x20;   max_retries: [int](https://docs.python.org/3/builtins/functions.html#int) = 2,
&#x20;   backoff_initial: [float](https://docs.python.org/3/builtins/functions.html#float) = 0.5,
&#x20;   backoff_max: [float](https://docs.python.org/3/builtins/functions.html#float) = 5.0,
&#x20;   backoff_jitter: [float](https://docs.python.org/3/builtins/functions.html#float) = 0.25,
&#x20;   http_statuses: [set](https://docs.python.org/3/builtins/stdtypes.html#set)\[[int](https://docs.python.org/3/builtins/functions.html#int)] = (
&#x20;       lambda: \{408, 429, \*[range](https://docs.python.org/3/builtins/stdtypes.html#range)(500, 600)}
&#x20;   )(),
&#x20;   respect_retry_after: [bool](https://docs.python.org/3/builtins/functions.html#bool) = True,
&#x20;   api_connection_error: [bool](https://docs.python.org/3/builtins/functions.html#bool) = True,
&#x20;   api_timeout_error: [bool](https://docs.python.org/3/builtins/functions.html#bool) = True,
&#x20;   exceptions: [set](https://docs.python.org/3/builtins/stdtypes.html#set)\[
&#x20;       [type](https://docs.python.org/3/builtins/functions.html#type)\[[BaseException](https://docs.python.org/3/builtins/exceptions.html#BaseException)]
&#x20;   ] = [set](https://docs.python.org/3/builtins/stdtypes.html#set)(),
&#x20;   predicate: [Callable](https://docs.python.org/3/library/collections.abc.html#collections.abc.Callable)\[\[[BaseException](https://docs.python.org/3/builtins/exceptions.html#BaseException)], [bool](https://docs.python.org/3/builtins/functions.html#bool)]
&#x20;   | None = None,
&#x20;   timeout: [float](https://docs.python.org/3/builtins/functions.html#float) | None = 30.0,
)`</pre>

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

### max_retries

`class-attribute` `instance-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`max\_retries

  :

  &#x20;

  [int](https://docs.python.org/3/builtins/functions.html#int)

  &#x20;

  \=

  &#x20;

  2\`
</pre>

Maximum retries after the initial attempt; `0` disables retries.

### backoff_initial

`class-attribute` `instance-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`backoff\_initial

  :

  &#x20;

  [float](https://docs.python.org/3/builtins/functions.html#float)

  &#x20;

  \=

  &#x20;

  0.5\`
</pre>

First backoff delay in seconds, doubled each attempt up to `backoff_max`; zero disables backoff.

### backoff_max

`class-attribute` `instance-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`backoff\_max

  :

  &#x20;

  [float](https://docs.python.org/3/builtins/functions.html#float)

  &#x20;

  \=

  &#x20;

  5.0\`
</pre>

Maximum backoff delay in seconds; zero disables backoff.

### backoff_jitter

`class-attribute` `instance-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`backoff\_jitter

  :

  &#x20;

  [float](https://docs.python.org/3/builtins/functions.html#float)

  &#x20;

  \=

  &#x20;

  0.25\`
</pre>

Fraction of each backoff delay randomly subtracted, between 0 and 1.

### http_statuses

`class-attribute` `instance-attribute`

Copy signature
<pre tabIndex={0} aria-label="SDK signature">`http\_statuses: [set](https://docs.python.org/3/builtins/stdtypes.html#set)\[[int](https://docs.python.org/3/builtins/functions.html#int)] = [field](https://docs.python.org/3/library/dataclasses.html#dataclasses.field)(
&#x20;   default_factory=lambda: \{
&#x20;       408,
&#x20;       429,
&#x20;       \*[range](https://docs.python.org/3/builtins/stdtypes.html#range)(500, 600),
&#x20;   }
)`</pre>

HTTP status codes that are retried.

### respect_retry_after

`class-attribute` `instance-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`respect\_retry\_after

  :

  &#x20;

  [bool](https://docs.python.org/3/builtins/functions.html#bool)

  &#x20;

  \=

  &#x20;

  True\`
</pre>

Whether to honor `Retry-After` and `retry-after-ms` response headers.

### api_connection_error

`class-attribute` `instance-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`api\_connection\_error

  :

  &#x20;

  [bool](https://docs.python.org/3/builtins/functions.html#bool)

  &#x20;

  \=

  &#x20;

  True\`
</pre>

Whether to retry `TypeSafeAPIConnectionError`, raised when the request cannot reach or read from the server.

### api_timeout_error

`class-attribute` `instance-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`api\_timeout\_error

  :

  &#x20;

  [bool](https://docs.python.org/3/builtins/functions.html#bool)

  &#x20;

  \=

  &#x20;

  True\`
</pre>

Whether to retry `TypeSafeAPITimeoutError`, raised when the request exceeds its timeout.

### exceptions

`class-attribute` `instance-attribute`

Copy signature
<pre tabIndex={0} aria-label="SDK signature">`exceptions: [set](https://docs.python.org/3/builtins/stdtypes.html#set)\[[type](https://docs.python.org/3/builtins/functions.html#type)\[[BaseException](https://docs.python.org/3/builtins/exceptions.html#BaseException)]] = [field](https://docs.python.org/3/library/dataclasses.html#dataclasses.field)(
&#x20;   default_factory=[set](https://docs.python.org/3/builtins/stdtypes.html#set)
)`</pre>

Additional exception types that trigger a retry, on top of the built-in rules.

### predicate

`class-attribute` `instance-attribute`

Copy signature
<pre tabIndex={0} aria-label="SDK signature">`predicate: (
&#x20;   [Callable](https://docs.python.org/3/library/collections.abc.html#collections.abc.Callable)\[\[[BaseException](https://docs.python.org/3/builtins/exceptions.html#BaseException)], [bool](https://docs.python.org/3/builtins/functions.html#bool)] | None
) = None`</pre>

An optional predicate called with the raised exception; returning `True` triggers a retry in addition to the other rules.

### timeout

`class-attribute` `instance-attribute`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`timeout

  :

  &#x20;

  [float](https://docs.python.org/3/builtins/functions.html#float)

  &#x20;

  |

  &#x20;

  None

  &#x20;

  \=

  &#x20;

  30.0\`
</pre>

Total retry budget in seconds per SDK call, including the initial attempt and delays; `None` disables the limit.

Stops before a retry whose delay would reach or exceed the budget, re-raising the last error.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
