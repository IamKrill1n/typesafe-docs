> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Variable: score

```ts theme={null}
const score: {
<T>  (instructions, criteria): ScoreQuestion<T>;
<T>  (instructions, criteria): ScoreQuestion<readonly [T[number], T[number], T[number]]>;
};
```

Create a score question using an ordered rubric.

## Call Signature

```ts theme={null}
<T>(instructions, criteria): ScoreQuestion<T>;
```

### Type Parameters

#### T

`T` *extends* [`ScoreCriteria`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/ScoreCriteria)

### Parameters

#### instructions

[`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType)

#### criteria

`T`

### Returns

[`ScoreQuestion`](https://docs.typesafe.ai/sdk/javascript/api/interfaces/ScoreQuestion)\<`T`>

## Call Signature

```ts theme={null}
<T>(instructions, criteria): ScoreQuestion<readonly [T[number], T[number], T[number]]>;
```

### Type Parameters

#### T

`T` *extends* readonly [`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType)\[]

### Parameters

#### instructions

[`EntryType`](https://docs.typesafe.ai/sdk/javascript/api/type-aliases/EntryType)

#### criteria

`T` & `number` *extends* `T`\[`"length"`] ? `unknown` : `never`

### Returns

[`ScoreQuestion`](https://docs.typesafe.ai/sdk/javascript/api/interfaces/ScoreQuestion)\<readonly \[`T`\[`number`], `T`\[`number`], `T`\[`number`]]>

## Param

**instructions**

The question as text, a JSON object or array, or `null`.

## Param

**criteria**

At least two descriptions indexed by score from zero; entries may be `null`.
A list built at runtime, such as a `string[]`, is accepted, and `systemOne` rejects it when
it has fewer than two entries.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.