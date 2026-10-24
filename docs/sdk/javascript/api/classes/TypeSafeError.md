# Class: TypeSafeError

Base class for SDK errors.

## Extends

* `Error`

## Extended by

* [`APIConnectionError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIConnectionError)
* [`APIError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError)
* [`APIUserAbortError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIUserAbortError)

## Constructors

### Constructor

```ts
new TypeSafeError(message, options?): TypeSafeError;
```

#### Parameters

##### message

`string`

##### options?

`ErrorOptions`

#### Returns

`TypeSafeError`

#### Overrides

```ts
Error.constructor
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
