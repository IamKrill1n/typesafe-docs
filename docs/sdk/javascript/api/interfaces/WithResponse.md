# Interface: WithResponse<T>

Parsed data with its HTTP response and request ID.

## Type Parameters

### T

`T`

## Properties

### data

```ts
data: T;
```

The parsed response body.

***

### requestId

```ts
requestId: string | undefined;
```

Request ID from `x-typesafe-request-id`, or `undefined` when absent.

***

### response

```ts
response: Response;
```

The HTTP response, with its body consumed by parsing.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
