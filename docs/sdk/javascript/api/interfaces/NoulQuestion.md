# Interface: NoulQuestion

A yes/no question with optional descriptions for either outcome.

## Properties

<a id="sdk-criteria" />

### criteria?

```ts
optional criteria?: 
  | {
  false?: EntryType;
  true?: EntryType;
}
  | null;
```

Descriptions of the yes and no outcomes; at least one is required when `instructions` is omitted or `null`.

#### Union Members

##### Type Literal

```ts
{
  false?: EntryType;
  true?: EntryType;
}
```

##### false?

```ts
optional false?: EntryType;
```

Description of the no outcome.

##### true?

```ts
optional true?: EntryType;
```

Description of the yes outcome.

***

`null`

***

<a id="sdk-instructions" />

### instructions?

```ts
optional instructions?: EntryType;
```

The question as text, a JSON object, or an array; optional when `criteria` describes an outcome.

***

<a id="sdk-type" />

### type

```ts
type: "noul";
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
