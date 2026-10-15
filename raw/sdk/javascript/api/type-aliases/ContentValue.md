> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Type Alias: ContentValue

```ts theme={null}
type ContentValue = 
  | string
  | number
  | boolean
  | null
  | Asset
  | TextWithAssets
  | ContentValue[]
  | {
[key: string]: ContentValue;
};
```

A JSON-compatible value that may also hold assets, each written as its name in `assets`, or
else as its reference.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.