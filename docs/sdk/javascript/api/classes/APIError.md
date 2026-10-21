# Class: APIError

An unsuccessful HTTP response from the API.

## Extends

* [`TypeSafeError`](./TypeSafeError.md)

## Extended by

* [`AuthenticationError`](./AuthenticationError.md)
* [`BadRequestError`](./BadRequestError.md)
* [`InternalServerError`](./InternalServerError.md)
* [`NotFoundError`](./NotFoundError.md)
* [`PermissionDeniedError`](./PermissionDeniedError.md)
* [`RateLimitError`](./RateLimitError.md)
* [`UnprocessableEntityError`](./UnprocessableEntityError.md)

## Constructors

### Constructor

```ts
new APIError(
   status, 
   body, 
   headers, 
   message?
): APIError;
```

#### Parameters

##### status

`number`

##### body

`unknown`

##### headers

`Headers`

##### message?

`string`

#### Returns

`APIError`

#### Overrides

[`TypeSafeError`](./TypeSafeError.md).[`constructor`](./TypeSafeError.md#sdk-constructor)

## Properties

### body

```ts
readonly body: unknown;
```

Parsed JSON, response text, or `undefined` for an empty body.

***

### headers

```ts
readonly headers: Headers;
```

HTTP response headers.

***

### requestId

```ts
readonly requestId: string | undefined;
```

Request ID from `x-typesafe-request-id`, or `undefined` when absent.

***

### status

```ts
readonly status: number;
```

HTTP response status code.

## Methods

### fromResponse()

```ts
static fromResponse(
   status, 
   body, 
   headers
): APIError;
```

Create the error subclass for an HTTP status code.

#### Parameters

##### status

`number`

##### body

`unknown`

##### headers

`Headers`

#### Returns

`APIError`

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
