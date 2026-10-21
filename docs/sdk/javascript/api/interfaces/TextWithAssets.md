# Interface: TextWithAssets

Text from a `withAssets` tagged template, with the assets interpolated into it.

## Properties

### assets

```ts
readonly assets: readonly Image[];
```

The assets interpolated into the text, including those in nested `withAssets` text.

***

### text

```ts
readonly text: string;
```

The text, with each asset replaced by its reference.

## Methods

### toJSON()

```ts
toJSON(): string;
```

The text, written by `JSON.stringify` wherever this value appears in a request.

#### Returns

`string`

***

### toString()

```ts
toString(): string;
```

#### Returns

`string`

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
