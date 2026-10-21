# Class: Image

A PNG or JPEG image asset, created by `image` or `Image.fromBase64`.

## Constructors

### Constructor

```ts
new Image(data): Image;
```

#### Parameters

##### data

`ArrayBuffer` | `ArrayBufferView`\<`ArrayBufferLike`> | `Blob`

#### Returns

`Image`

#### Throws

`data` is empty or isn't file bytes or a `Blob`.

## Properties

### data

```ts
readonly data: Uint8Array<ArrayBufferLike> | Blob;
```

The image file bytes, or a `Blob` read when the request is sent.

***

### type

```ts
readonly type: "image" = "image";
```

## Methods

### toJSON()

```ts
toJSON(): string;
```

The reference, written by `JSON.stringify` wherever the image appears in a request.

#### Returns

`string`

***

### toString()

```ts
toString(): string;
```

The unique reference this image is sent under, for referencing it inside text.

#### Returns

`string`

***

### fromBase64()

```ts
static fromBase64(text): Image;
```

Create an image from base64-encoded file bytes, decoding them now.

#### Parameters

##### text

`string`

The image file bytes, base64-encoded, without a `data:` URL prefix.

#### Returns

`Image`

#### Throws

`text` isn't valid base64 or decodes to no bytes.

#### Example

```ts
const photo = Image.fromBase64(upload.photoBase64);
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
