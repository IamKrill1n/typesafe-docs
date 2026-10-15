# Type Alias: SentContent<T>

```ts
type SentContent<T> = T extends Asset | TextWithAssets ? string : T extends object ? { readonly [key in keyof T]: SentContent<T[key]> } : T;
```

Content as the API returns it, with assets and `withAssets` text written as strings.

## Type Parameters

### T

`T`

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
