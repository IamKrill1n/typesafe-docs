> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Function: box()

```ts theme={null}
function box(instructions?): BoxQuestion;
```

Create a question that locates what its instructions describe in the request's image.
Use the `jev-preview` model for `box` questions.

## Parameters

### instructions?

[`EntryType`](/sdk/javascript/api/type-aliases/EntryType) = `null`

What to locate, as text, an asset, a JSON object or array; defaults to `null`.

## Returns

[`BoxQuestion`](/sdk/javascript/api/interfaces/BoxQuestion)

## Example

```ts theme={null}
const { answers } = await client.systemOne({
  state: image(await openAsBlob("photo.jpg")),
  questions: { dog: box("The dog") },
  model: "jev-preview",
});
const { top, bottom, left, right } = answers.dog.box;
```


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.