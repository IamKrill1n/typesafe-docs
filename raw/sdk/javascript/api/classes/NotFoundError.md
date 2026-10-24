> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Class: NotFoundError

HTTP 404: the resource was not found.

## Extends

* [`APIError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError)

## Constructors

### Constructor

```ts theme={null}
new NotFoundError(
   status, 
   body, 
   headers, 
   message?
): NotFoundError;
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

`NotFoundError`

#### Inherited from

[`APIError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError).[`constructor`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError#sdk-constructor)

## Properties

### body

```ts theme={null}
readonly body: unknown;
```

Parsed JSON, response text, or `undefined` for an empty body.

#### Inherited from

[`APIError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError).[`body`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError#sdk-body)

***

### headers

```ts theme={null}
readonly headers: Headers;
```

HTTP response headers.

#### Inherited from

[`APIError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError).[`headers`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError#sdk-headers)

***

### requestId

```ts theme={null}
readonly requestId: string | undefined;
```

Request ID from `x-typesafe-request-id`, or `undefined` when absent.

#### Inherited from

[`APIError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError).[`requestId`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError#sdk-requestid)

***

### status

```ts theme={null}
readonly status: number;
```

HTTP response status code.

#### Inherited from

[`APIError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError).[`status`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError#sdk-status)

## Methods

### fromResponse()

```ts theme={null}
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

[`APIError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError)

#### Inherited from

[`APIError`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError).[`fromResponse`](https://docs.typesafe.ai/sdk/javascript/api/classes/APIError#sdk-fromresponse)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.