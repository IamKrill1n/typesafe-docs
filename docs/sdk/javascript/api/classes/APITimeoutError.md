# Class: APITimeoutError

The full response did not arrive within the timeout. A kind of `APIConnectionError`.

## Extends

* [`APIConnectionError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIConnectionError)

## Constructors

### Constructor

```ts
new APITimeoutError(timeoutMs, options?): APITimeoutError;
```

#### Parameters

##### timeoutMs

`number`

##### options?

`ErrorOptions`

#### Returns

`APITimeoutError`

#### Overrides

[`APIConnectionError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIConnectionError).[`constructor`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIConnectionError#sdk-constructor)

## Properties

### timeoutMs

```ts
readonly timeoutMs: number;
```

Configured timeout in milliseconds.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
