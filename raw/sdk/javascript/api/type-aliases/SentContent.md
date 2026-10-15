> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Type Alias: SentContent<T>

```ts theme={null}
type SentContent<T> = T extends Asset | TextWithAssets ? string : T extends object ? { readonly [key in keyof T]: SentContent<T[key]> } : T;
```

Content as the API returns it, with assets and `withAssets` text written as strings.

## Type Parameters

### T

`T`


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.