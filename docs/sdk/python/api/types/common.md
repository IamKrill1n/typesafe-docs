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
