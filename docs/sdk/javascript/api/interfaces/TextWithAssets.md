# Interface: TextWithAssets

Text from a `withAssets` tagged template, with the assets interpolated into it.

## Properties

<a id="sdk-assets" />

### assets

```ts
readonly assets: readonly Image[];
```

The assets interpolated into the text, including those in nested `withAssets` text.

***

<a id="sdk-text" />

### text

```ts
readonly text: string;
```

The text, with each asset replaced by its reference.

## Methods

<a id="sdk-tojson" />

### toJSON()

```ts
toJSON(): string;
```

The text, written by `JSON.stringify` wherever this value appears in a request.

#### Returns

`string`

***

<a id="sdk-tostring" />

### toString()

```ts
toString(): string;
```

#### Returns

`string`

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
