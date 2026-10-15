> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Variable: noul

```ts theme={null}
const noul: {
  (instructions, criteria?): NoulQuestion;
  (instructions, criteria): NoulQuestion;
};
```

Create a yes/no question with optional descriptions for either outcome.

## Call Signature

```ts theme={null}
(instructions, criteria?): NoulQuestion;
```

### Parameters

#### instructions

`NonNullable`\<[`EntryType`](/sdk/javascript/api/type-aliases/EntryType)>

#### criteria?

\| \{
`false?`: [`EntryType`](/sdk/javascript/api/type-aliases/EntryType);
`true?`: [`EntryType`](/sdk/javascript/api/type-aliases/EntryType);
}
\| `null`

##### Type Literal

\{
`false?`: [`EntryType`](/sdk/javascript/api/type-aliases/EntryType);
`true?`: [`EntryType`](/sdk/javascript/api/type-aliases/EntryType);
}

###### false?

[`EntryType`](/sdk/javascript/api/type-aliases/EntryType)

Description of the no outcome.

###### true?

[`EntryType`](/sdk/javascript/api/type-aliases/EntryType)

Description of the yes outcome.

***

`null`

### Returns

[`NoulQuestion`](/sdk/javascript/api/interfaces/NoulQuestion)

## Call Signature

```ts theme={null}
(instructions, criteria): NoulQuestion;
```

### Parameters

#### instructions

[`EntryType`](/sdk/javascript/api/type-aliases/EntryType) | `undefined`

#### criteria

\| \{
`false?`: [`EntryType`](/sdk/javascript/api/type-aliases/EntryType);
`true`: `NonNullable`\<[`EntryType`](/sdk/javascript/api/type-aliases/EntryType)>;
}
\| \{
`false`: `NonNullable`\<[`EntryType`](/sdk/javascript/api/type-aliases/EntryType)>;
`true?`: [`EntryType`](/sdk/javascript/api/type-aliases/EntryType);
}

### Returns

[`NoulQuestion`](/sdk/javascript/api/interfaces/NoulQuestion)

## Param

**instructions**

The question as text, a JSON object or array; `null` or omitted
requires `criteria` to describe at least one outcome.

## Param

**criteria**

Descriptions of the yes and no outcomes.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.