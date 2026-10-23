> ## Documentation Index
> Fetch the complete documentation index at: https://docs.typesafe.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Common types

> Common types for TypeSafe API SDK.

## typesafe\_sdk.JSONValue

`module-attribute`

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`JSONValue = [TypeAliasType](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.TypeAliasType)(
&#x20;   "JSONValue",
&#x20;   "str | int | float | bool | Sequence\[JSONValue | None] | Mapping\[str, JSONValue | None]",
)`</pre>

A JSON-like value. May be nested and contain `None`.

## typesafe\_sdk.JSONContent

`module-attribute`

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`JSONContent = [TypeAliasType](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.TypeAliasType)(
&#x20;   "JSONContent",
&#x20;   "str | Mapping\[str, JSONValue | None] | Sequence\[JSONValue | None]",
)`</pre>

Either a plain string or a mapping/sequence of [`JSONValue`](/sdk/python/api/types/common#typesafe_sdk.JSONValue) entries.

## typesafe\_sdk.ContentValue

`module-attribute`

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`ContentValue = [TypeAliasType](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.TypeAliasType)(
&#x20;   "ContentValue",
&#x20;   "str | int | float | bool | Sequence\[ContentValue | None] | Mapping\[str, ContentValue | None] | Asset",
)`</pre>

A JSON-like value that may also hold [assets](/sdk/python/api/types/assets.md#typesafe_sdk.Asset). May be nested and contain `None`.

## typesafe\_sdk.Content

`module-attribute`

Copy signature
<pre tabIndex="0" aria-label="SDK signature">`Content = [TypeAliasType](https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.TypeAliasType)(
&#x20;   "Content",
&#x20;   "str | Mapping\[str, ContentValue | None] | Sequence\[ContentValue | None] | Asset",
)`</pre>

Text, an [asset](/sdk/python/api/types/assets.md#typesafe_sdk.Asset), or a mapping/sequence of [`ContentValue`](/sdk/python/api/types/common#typesafe_sdk.ContentValue) entries.

Each asset is sent in the request's assets, with its unique reference in its place.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.