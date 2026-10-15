# Type Alias: EntryType

```ts
type EntryType = 
  | string
  | Asset
  | TextWithAssets
  | {
[key: string]: ContentValue;
}
  | ContentValue[]
  | null;
```

Text, an asset, a JSON object or array, or `null` for instructions and criteria.

Each asset in it is written as its name in `assets`, or else as its reference, and sent
with the request.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
