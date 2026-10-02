# Type Alias: JsonValue

```ts
type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | {
[key: string]: JsonValue;
};
```

A JSON-compatible value.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
