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

<a id="sdk-constructor" />

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

<a id="sdk-body" />

### body

```ts
readonly body: unknown;
```

Parsed JSON, response text, or `undefined` for an empty body.

***

<a id="sdk-headers" />

### headers

```ts
readonly headers: Headers;
```

HTTP response headers.

***

<a id="sdk-requestid" />

### requestId

```ts
readonly requestId: string | undefined;
```

Request ID from `x-typesafe-request-id`, or `undefined` when absent.

***

<a id="sdk-status" />

### status

```ts
readonly status: number;
```

HTTP response status code.

## Methods

<a id="sdk-fromresponse" />

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
