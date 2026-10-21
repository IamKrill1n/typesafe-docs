# Class: BadRequestError

HTTP 400: the request is invalid.

## Extends

* [`APIError`](./APIError.md)

## Constructors

### Constructor

```ts
new BadRequestError(
   status, 
   body, 
   headers, 
   message?
): BadRequestError;
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

`BadRequestError`

#### Inherited from

[`APIError`](./APIError.md).[`constructor`](./APIError.md#sdk-constructor)

## Properties

### body

```ts
readonly body: unknown;
```

Parsed JSON, response text, or `undefined` for an empty body.

#### Inherited from

[`APIError`](./APIError.md).[`body`](./APIError.md#sdk-body)

***

### headers

```ts
readonly headers: Headers;
```

HTTP response headers.

#### Inherited from

[`APIError`](./APIError.md).[`headers`](./APIError.md#sdk-headers)

***

### requestId

```ts
readonly requestId: string | undefined;
```

Request ID from `x-typesafe-request-id`, or `undefined` when absent.

#### Inherited from

[`APIError`](./APIError.md).[`requestId`](./APIError.md#sdk-requestid)

***

### status

```ts
readonly status: number;
```

HTTP response status code.

#### Inherited from

[`APIError`](./APIError.md).[`status`](./APIError.md#sdk-status)

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

[`APIError`](./APIError.md)

#### Inherited from

[`APIError`](./APIError.md).[`fromResponse`](./APIError.md#sdk-fromresponse)

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
