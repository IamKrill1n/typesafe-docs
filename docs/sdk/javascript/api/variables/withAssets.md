# Variable: withAssets

```ts
const withAssets: {
(strings, ...values): TextWithAssets;
  join: TextWithAssets;
};
```

Tag a template literal so the assets interpolated into it are sent with the text.

Each asset is replaced by its reference; other values are converted to strings, as in an
untagged template literal. To write a list of assets with a separator, use
`withAssets.join`.

## Type Declaration

## Parameters

### strings

`TemplateStringsArray`

### values

...readonly `unknown`\[]

## Returns

[`TextWithAssets`](../interfaces/TextWithAssets.md)

<a id="sdk-join" />

### join()

```ts
join(values, separator?): TextWithAssets;
```

Join `values` with `separator`, as `Array.prototype.join` does, and send the assets among
them with the text. The result can be passed as content or interpolated into `withAssets`.

#### Parameters

##### values

readonly `unknown`\[]

##### separator?

`string`

Written between values. Default: `","`.

#### Returns

[`TextWithAssets`](../interfaces/TextWithAssets.md)

#### Example

```ts
const { answers } = await client.systemOne({
  state: withAssets`The seller uploaded ${withAssets.join(uploads, ", ")}.`,
  questions: { same: noul("Do the uploads show the same product?") },
});
```

## Example

```ts
const { answers } = await client.systemOne({
  state: withAssets`Compare ${photo} with the listing.`,
  questions: { same: noul(withAssets`Is ${photo} the product in ${listing}?`) },
});
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
