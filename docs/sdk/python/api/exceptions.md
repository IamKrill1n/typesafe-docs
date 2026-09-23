# Exceptions

> Handle TypeSafe API errors, rate limits, connection failures, and timeouts.

<a id="exceptions" />

<h2 id="base-exception">
  Base exception
</h2>

<h2 id="typesafe_sdk.TypeSafeError">
  typesafe_sdk.TypeSafeError
</h2>

Bases: <code><a href="https://docs.python.org/3/builtins/exceptions.html#Exception">Exception</a></code>

Base exception for SDK failures.

<h2 id="http-errors">
  HTTP errors
</h2>

<h2 id="typesafe_sdk.TypeSafeAPIError">
  typesafe_sdk.TypeSafeAPIError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeError">TypeSafeError</a></code>

An unsuccessful HTTP response with its body and request metadata.

<h3 id="typesafe_sdk.TypeSafeAPIError.status">
  status
</h3>

`instance-attribute`

```python
status = status
```

HTTP response status code.

<h3 id="typesafe_sdk.TypeSafeAPIError.body">
  body
</h3>

`instance-attribute`

```python
body = body
```

The server's JSON error body, plain response text, or `None` for an empty body.

<h3 id="typesafe_sdk.TypeSafeAPIError.headers">
  headers
</h3>

`instance-attribute`

```python
headers = headers
```

HTTP response headers.

<h3 id="typesafe_sdk.TypeSafeAPIError.endpoint">
  endpoint
</h3>

`instance-attribute`

```python
endpoint = endpoint
```

The request method and URL, without credentials, query parameters, or fragment, when available.

<h3 id="typesafe_sdk.TypeSafeAPIError.request_id">
  request_id
</h3>

`property`

```python
request_id: str | None
```

The `x-typesafe-request-id` response header, or `None` if absent.

<h2 id="typesafe_sdk.TypeSafeBadRequestError">
  typesafe_sdk.TypeSafeBadRequestError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeAPIError">TypeSafeAPIError</a></code>

The request was invalid (400).

<h2 id="typesafe_sdk.TypeSafeAuthenticationError">
  typesafe_sdk.TypeSafeAuthenticationError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeAPIError">TypeSafeAPIError</a></code>

Authentication failed (401).

<h2 id="typesafe_sdk.TypeSafePermissionDeniedError">
  typesafe_sdk.TypeSafePermissionDeniedError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeAPIError">TypeSafeAPIError</a></code>

Access was denied (403).

<h2 id="typesafe_sdk.TypeSafeNotFoundError">
  typesafe_sdk.TypeSafeNotFoundError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeAPIError">TypeSafeAPIError</a></code>

The resource was not found (404).

<h2 id="typesafe_sdk.TypeSafeUnprocessableEntityError">
  typesafe_sdk.TypeSafeUnprocessableEntityError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeAPIError">TypeSafeAPIError</a></code>

The request failed server validation (422).

<h2 id="typesafe_sdk.TypeSafeRateLimitError">
  typesafe_sdk.TypeSafeRateLimitError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeAPIError">TypeSafeAPIError</a></code>

The rate limit was exceeded (429).

<h3 id="typesafe_sdk.TypeSafeRateLimitError.retry_after_ms">
  retry_after_ms
</h3>

`instance-attribute`

```python
retry_after_ms = parse_retry_after(headers)
```

The server's requested wait in milliseconds, or `None` if unavailable.

<h2 id="typesafe_sdk.TypeSafeInternalServerError">
  typesafe_sdk.TypeSafeInternalServerError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeAPIError">TypeSafeAPIError</a></code>

The server failed to process the request (5xx).

<h2 id="connection-errors">
  Connection errors
</h2>

<h2 id="typesafe_sdk.TypeSafeAPIConnectionError">
  typesafe_sdk.TypeSafeAPIConnectionError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeError">TypeSafeError</a></code>, <code><a href="https://docs.python.org/3/builtins/exceptions.html#ConnectionError">ConnectionError</a></code>

A request failed without an HTTP response.

<h2 id="typesafe_sdk.TypeSafeAPITimeoutError">
  typesafe_sdk.TypeSafeAPITimeoutError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeAPIConnectionError">TypeSafeAPIConnectionError</a></code>, <code><a href="https://docs.python.org/3/builtins/exceptions.html#TimeoutError">TimeoutError</a></code>

A request exceeded its configured timeout.

<h3 id="typesafe_sdk.TypeSafeAPITimeoutError.timeout">
  timeout
</h3>

`instance-attribute`

```python
timeout = timeout
```

The timeout setting used for the request, in seconds or as an `httpx2.Timeout`.

<h2 id="response-validation">
  Response validation
</h2>

<h2 id="typesafe_sdk.TypeSafeAPIResponseValidationError">
  typesafe_sdk.TypeSafeAPIResponseValidationError
</h2>

Bases: <code><a href="/sdk/python/api/exceptions#typesafe_sdk.TypeSafeAPIError">TypeSafeAPIError</a></code>

A successful HTTP response whose body was missing or structurally invalid required data.

<h3 id="typesafe_sdk.TypeSafeAPIResponseValidationError.field_path">
  field_path
</h3>

`instance-attribute`

```python
field_path = field_path
```

Dotted path to the offending field, such as `answers.tone.confidence`.

<h3 id="typesafe_sdk.TypeSafeAPIResponseValidationError.args">
  args
</h3>

`instance-attribute`

```python
args = (
    status,
    body,
    headers,
    field_path,
    endpoint,
)
```
