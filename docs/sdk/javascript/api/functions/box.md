# Function: box()

```ts
function box(instructions?): BoxQuestion;
```

Create a question that locates what its instructions describe in the request's image.
Use the `jev-preview` model for `box` questions.

## Parameters

### instructions?

[`EntryType`](../type-aliases/EntryType.md) = `null`

What to locate, as text, an asset, a JSON object or array; defaults to `null`.

## Returns

[`BoxQuestion`](../interfaces/BoxQuestion.md)

## Example

```ts
const { answers } = await client.systemOne({
  state: image(await openAsBlob("photo.jpg")),
  questions: { dog: box("The dog") },
  model: "jev-preview",
});
const { top, bottom, left, right } = answers.dog.box;
```

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
