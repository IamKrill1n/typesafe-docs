# Variable: noul

```ts
const noul: {
  (instructions, criteria?): NoulQuestion;
  (instructions, criteria): NoulQuestion;
};
```

Create a yes/no question with optional descriptions for either outcome.

## Call Signature

```ts
(instructions, criteria?): NoulQuestion;
```

### Parameters

#### instructions

`NonNullable`\<[`EntryType`](../type-aliases/EntryType.md)>

#### criteria?

\| \{
`false?`: [`EntryType`](../type-aliases/EntryType.md);
`true?`: [`EntryType`](../type-aliases/EntryType.md);
}
\| `null`

##### Type Literal

\{
`false?`: [`EntryType`](../type-aliases/EntryType.md);
`true?`: [`EntryType`](../type-aliases/EntryType.md);
}

###### false?

[`EntryType`](../type-aliases/EntryType.md)

Description of the no outcome.

###### true?

[`EntryType`](../type-aliases/EntryType.md)

Description of the yes outcome.

***

`null`

### Returns

[`NoulQuestion`](../interfaces/NoulQuestion.md)

## Call Signature

```ts
(instructions, criteria): NoulQuestion;
```

### Parameters

#### instructions

[`EntryType`](../type-aliases/EntryType.md) | `undefined`

#### criteria

\| \{
`false?`: [`EntryType`](../type-aliases/EntryType.md);
`true`: `NonNullable`\<[`EntryType`](../type-aliases/EntryType.md)>;
}
\| \{
`false`: `NonNullable`\<[`EntryType`](../type-aliases/EntryType.md)>;
`true?`: [`EntryType`](../type-aliases/EntryType.md);
}

### Returns

[`NoulQuestion`](../interfaces/NoulQuestion.md)

## Param

**instructions**

The question as text, a JSON object or array; `null` or omitted
requires `criteria` to describe at least one outcome.

## Param

**criteria**

Descriptions of the yes and no outcomes.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
