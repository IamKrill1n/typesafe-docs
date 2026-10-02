# Type Alias: EntryType

```ts
type EntryType = 
  | string
  | {
[key: string]: JsonValue;
}
  | JsonValue[]
  | null;
```

Text, a JSON object or array, or `null` for state, instructions, and criteria.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
