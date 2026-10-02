# Class: TypeSafeError

Base class for SDK errors.

## Extends

* `Error`

## Extended by

* [`APIConnectionError`](./APIConnectionError.md)
* [`APIError`](./APIError.md)
* [`APIUserAbortError`](./APIUserAbortError.md)

## Constructors

<a id="sdk-constructor" />

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
