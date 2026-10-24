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

`NonNullable`\<[`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType)>

#### criteria?

\| \{
`false?`: [`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType);
`true?`: [`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType);
}
\| `null`

##### Type Literal

\{
`false?`: [`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType);
`true?`: [`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType);
}

###### false?

[`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType)

Description of the no outcome.

###### true?

[`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType)

Description of the yes outcome.

***

`null`

### Returns

[`NoulQuestion`](https://docs.typesafe.ai/sdk/javascript/api/interfaces/NoulQuestion)

## Call Signature

```ts
(instructions, criteria): NoulQuestion;
```

### Parameters

#### instructions

[`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType) | `undefined`

#### criteria

\| \{
`false?`: [`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType);
`true`: `NonNullable`\<[`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType)>;
}
\| \{
`false`: `NonNullable`\<[`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType)>;
`true?`: [`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType);
}

### Returns

[`NoulQuestion`](https://docs.typesafe.ai/sdk/javascript/api/interfaces/NoulQuestion)

## Param

**instructions**

The question as text, a JSON object or array; `null` or omitted
requires `criteria` to describe at least one outcome.

## Param

**criteria**

Descriptions of the yes and no outcomes.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
