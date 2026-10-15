# Common types

> Common types for TypeSafe API SDK.

<a id="common-types" />

<h2 id="typesafe_sdk.JSONValue">
  typesafe_sdk.JSONValue
</h2>

`module-attribute`

```python
JSONValue = TypeAliasType(
    "JSONValue",
    "str | int | float | bool | Sequence[JSONValue | None] | Mapping[str, JSONValue | None]",
)
```

A JSON-like value. May be nested and contain `None`.

<h2 id="typesafe_sdk.JSONContent">
  typesafe_sdk.JSONContent
</h2>

`module-attribute`

```python
JSONContent = TypeAliasType(
    "JSONContent",
    "str | Mapping[str, JSONValue | None] | Sequence[JSONValue | None]",
)
```

Either a plain string or a mapping/sequence of [`JSONValue`](./common.md#typesafe_sdk.JSONValue) entries.

<h2 id="typesafe_sdk.ContentValue">
  typesafe_sdk.ContentValue
</h2>

`module-attribute`

```python
ContentValue = TypeAliasType(
    "ContentValue",
    "str | int | float | bool | Sequence[ContentValue | None] | Mapping[str, ContentValue | None] | Asset",
)
```

A JSON-like value that may also hold [assets](./assets.md#typesafe_sdk.Asset). May be nested and contain `None`.

<h2 id="typesafe_sdk.Content">
  typesafe_sdk.Content
</h2>

`module-attribute`

```python
Content = TypeAliasType(
    "Content",
    "str | Mapping[str, ContentValue | None] | Sequence[ContentValue | None] | Asset",
)
```

Text, an [asset](./assets.md#typesafe_sdk.Asset), or a mapping/sequence of [`ContentValue`](./common.md#typesafe_sdk.ContentValue) entries.

Each asset is sent in the request's assets, with its unique reference in its place.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
