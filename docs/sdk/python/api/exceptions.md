# Exceptions

> Handle TypeSafe API errors, rate limits, connection failures, and timeouts.

## Base exception

## typesafe_sdk.TypeSafeError

Bases: `Exception`

Base exception for SDK failures.

## HTTP errors

## typesafe_sdk.TypeSafeAPIError

Bases: `TypeSafeError`

An unsuccessful HTTP response with its body and request metadata.

### status

`instance-attribute`

```python
status = status
```

HTTP response status code.

### body

`instance-attribute`

```python
body = body
```

The server's JSON error body, plain response text, or `None` for an empty body.

### headers

`instance-attribute`

```python
headers = headers
```

HTTP response headers.

### endpoint

`instance-attribute`

```python
endpoint = endpoint
```

The request method and URL, without credentials, query parameters, or fragment, when available.

### request_id

`property`

Copy signature

<pre tabIndex={0} aria-label="SDK signature">
  \`request\_id

  :

  &#x20;

  [str](https://docs.python.org/3/builtins/stdtypes.html#str)

  &#x20;

  |

  &#x20;

  None\`
</pre>

The `x-typesafe-request-id` response header, or `None` if absent.

## typesafe_sdk.TypeSafeBadRequestError

Bases: `TypeSafeAPIError`

The request was invalid (400).

## typesafe_sdk.TypeSafeAuthenticationError

Bases: `TypeSafeAPIError`

Authentication failed (401).

## typesafe_sdk.TypeSafePermissionDeniedError

Bases: `TypeSafeAPIError`

Access was denied (403).

## typesafe_sdk.TypeSafeNotFoundError

Bases: `TypeSafeAPIError`

The resource was not found (404).

## typesafe_sdk.TypeSafeUnprocessableEntityError

Bases: `TypeSafeAPIError`

The request failed server validation (422).

## typesafe_sdk.TypeSafeRateLimitError

Bases: `TypeSafeAPIError`

The rate limit was exceeded (429).

### retry_after_ms

`instance-attribute`

```python
retry_after_ms = parse_retry_after(headers)
```

The server's requested wait in milliseconds, or `None` if unavailable.

## typesafe_sdk.TypeSafeInternalServerError

Bases: `TypeSafeAPIError`

The server failed to process the request (5xx).

## Connection errors

## typesafe_sdk.TypeSafeAPIConnectionError

Bases: `TypeSafeError`, `ConnectionError`

A request failed without an HTTP response.

## typesafe_sdk.TypeSafeAPITimeoutError

Bases: `TypeSafeAPIConnectionError`, `TimeoutError`

A request exceeded its configured timeout.

### timeout

`instance-attribute`

```python
timeout = timeout
```

The timeout setting used for the request, in seconds or as an `httpx2.Timeout`.

## Response validation

## typesafe_sdk.TypeSafeAPIResponseValidationError

Bases: `TypeSafeAPIError`

A successful HTTP response whose body was missing or structurally invalid required data.

### field_path

`instance-attribute`

```python
field_path = field_path
```

Dotted path to the offending field, such as `answers.tone.confidence`.

### args

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

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
