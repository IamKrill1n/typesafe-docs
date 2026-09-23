# Questions

> Provide state and ask yes/no, choice, and score questions using objects or dictionaries.

<a id="questions" />

<h2 id="state">
  State
</h2>

`state` is the text or JSON object you want to ask questions about. It cannot be `None`, but values inside an object may be `None`.

<h2 id="question-objects">
  Question objects
</h2>

Use `Noul`, `Choice`, and `Score` to define questions with named arguments.

<h2 id="typesafe_sdk.NoulCriteria">
  typesafe_sdk.NoulCriteria
</h2>

Bases: <code><a href="https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.TypedDict">TypedDict</a></code>

Optional descriptions of the yes and no outcomes.

See the [noul primitive](https://docs.typesafe.ai/primitives/noul) for details.

<h3 id="typesafe_sdk.NoulCriteria.true">
  true
</h3>

`instance-attribute`

```python
true: JSONContent | None
```

Description of the yes outcome as text, a JSON object, or an array; `None` leaves it undescribed.

<h3 id="typesafe_sdk.NoulCriteria.false">
  false
</h3>

`instance-attribute`

```python
false: JSONContent | None
```

Description of the no outcome as text, a JSON object, or an array; `None` leaves it undescribed.

<h2 id="typesafe_sdk.Noul">
  typesafe_sdk.Noul
</h2>

`pydantic-model`

Bases: `_Question`, `wire.NoulQuestion`

A yes/no question with optional descriptions for either outcome.

See the [noul primitive](https://docs.typesafe.ai/primitives/noul) for details.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "$defs": {
>   "JSONContent": {
>     "anyOf": [
>       {
>         "type": "string"
>       },
>       {
>         "additionalProperties": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "object"
>       },
>       {
>         "items": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "array"
>       }
>     ]
>   },
>   "JSONValue": {
>     "anyOf": [
>       {
>         "type": "string"
>       },
>       {
>         "type": "integer"
>       },
>       {
>         "type": "number"
>       },
>       {
>         "type": "boolean"
>       },
>       {
>         "items": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "array"
>       },
>       {
>         "additionalProperties": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "object"
>       }
>     ]
>   },
>   "NoulCriteria": {
>     "additionalProperties": false,
>     "description": "Optional descriptions of the yes and no outcomes.\n\nSee the [noul primitive](https://docs.typesafe.ai/primitives/noul) for details.",
>     "properties": {
>       "true": {
>         "anyOf": [
>           {
>             "$ref": "#/$defs/JSONContent"
>           },
>           {
>             "type": "null"
>           }
>         ]
>       },
>       "false": {
>         "anyOf": [
>           {
>             "$ref": "#/$defs/JSONContent"
>           },
>           {
>             "type": "null"
>           }
>         ]
>       }
>     },
>     "title": "NoulCriteria",
>     "type": "object"
>   }
> },
> "additionalProperties": false,
> "description": "A yes/no question with optional descriptions for either outcome.\n\nSee the [noul primitive](https://docs.typesafe.ai/primitives/noul) for details.",
> "properties": {
>   "type": {
>     "const": "noul",
>     "default": "noul",
>     "title": "Type",
>     "type": "string"
>   },
>   "instructions": {
>     "anyOf": [
>       {
>         "$ref": "#/$defs/JSONContent"
>       },
>       {
>         "type": "null"
>       }
>     ],
>     "default": null
>   },
>   "criteria": {
>     "anyOf": [
>       {
>         "$ref": "#/$defs/NoulCriteria"
>       },
>       {
>         "type": "null"
>       }
>     ],
>     "default": null
>   }
> },
> "title": "Noul",
> "type": "object"
> }
> ```

Fields:

* `type` (<code><a href="https://docs.python.org/3/library/typing.html#typing.Literal">Literal</a>\['noul']</code>)
* <code><a href="/sdk/python/api/types/questions#typesafe_sdk.Noul.instructions">instructions</a></code> (<code><a href="/sdk/python/api/types/common#typesafe_sdk.JSONContent">JSONContent</a> | None</code>)
* <code><a href="/sdk/python/api/types/questions#typesafe_sdk.Noul.criteria">criteria</a></code> (<code><a href="/sdk/python/api/types/questions#typesafe_sdk.NoulCriteria">NoulCriteria</a> | None</code>)

<h3 id="typesafe_sdk.Noul.instructions">
  instructions
</h3>

`pydantic-field`

```python
instructions: JSONContent | None = None
```

The question to ask, expressed as text, a JSON object, or an array; optional.

<h3 id="typesafe_sdk.Noul.criteria">
  criteria
</h3>

`pydantic-field`

```python
criteria: NoulCriteria | None = None
```

Optional descriptions of the yes and no outcomes.

<h2 id="typesafe_sdk.Choice">
  typesafe_sdk.Choice
</h2>

`pydantic-model`

Bases: `_Question`, `wire.ChoiceQuestion`

A question that selects between named alternatives.

See the [choice primitive](https://docs.typesafe.ai/primitives/choice) for details.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "$defs": {
>   "JSONContent": {
>     "anyOf": [
>       {
>         "type": "string"
>       },
>       {
>         "additionalProperties": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "object"
>       },
>       {
>         "items": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "array"
>       }
>     ]
>   },
>   "JSONValue": {
>     "anyOf": [
>       {
>         "type": "string"
>       },
>       {
>         "type": "integer"
>       },
>       {
>         "type": "number"
>       },
>       {
>         "type": "boolean"
>       },
>       {
>         "items": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "array"
>       },
>       {
>         "additionalProperties": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "object"
>       }
>     ]
>   }
> },
> "additionalProperties": false,
> "description": "A question that selects between named alternatives.\n\nSee the [choice primitive](https://docs.typesafe.ai/primitives/choice) for details.",
> "properties": {
>   "type": {
>     "const": "choice",
>     "default": "choice",
>     "title": "Type",
>     "type": "string"
>   },
>   "instructions": {
>     "anyOf": [
>       {
>         "$ref": "#/$defs/JSONContent"
>       },
>       {
>         "type": "null"
>       }
>     ],
>     "default": null
>   },
>   "criteria": {
>     "additionalProperties": {
>       "anyOf": [
>         {
>           "$ref": "#/$defs/JSONContent"
>         },
>         {
>           "type": "null"
>         }
>       ]
>     },
>     "title": "Criteria",
>     "type": "object"
>   }
> },
> "required": [
>   "criteria"
> ],
> "title": "Choice",
> "type": "object"
> }
> ```

Fields:

* `type` (<code><a href="https://docs.python.org/3/library/typing.html#typing.Literal">Literal</a>\['choice']</code>)
* <code><a href="/sdk/python/api/types/questions#typesafe_sdk.Choice.criteria">criteria</a></code> (<code><a href="https://docs.python.org/3/library/collections.abc.html#collections.abc.Mapping">Mapping</a>\[<a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a>, <a href="/sdk/python/api/types/common#typesafe_sdk.JSONContent">JSONContent</a> | None]</code>)
* <code><a href="/sdk/python/api/types/questions#typesafe_sdk.Choice.instructions">instructions</a></code> (<code><a href="/sdk/python/api/types/common#typesafe_sdk.JSONContent">JSONContent</a> | None</code>)

<h3 id="typesafe_sdk.Choice.criteria">
  criteria
</h3>

`pydantic-field`

```python
criteria: Mapping[str, JSONContent | None]
```

Labels mapped to text, object, or array descriptions, or `None` for undescribed labels.

<h3 id="typesafe_sdk.Choice.instructions">
  instructions
</h3>

`pydantic-field`

```python
instructions: JSONContent | None = None
```

The question to ask, expressed as text, a JSON object, or an array; optional.

<h2 id="typesafe_sdk.Score">
  typesafe_sdk.Score
</h2>

`pydantic-model`

Bases: `_Question`, `wire.ScoreQuestion`

A question that assigns a score using an ordered rubric.

See the [score primitive](https://docs.typesafe.ai/primitives/score) for details.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "$defs": {
>   "JSONContent": {
>     "anyOf": [
>       {
>         "type": "string"
>       },
>       {
>         "additionalProperties": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "object"
>       },
>       {
>         "items": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "array"
>       }
>     ]
>   },
>   "JSONValue": {
>     "anyOf": [
>       {
>         "type": "string"
>       },
>       {
>         "type": "integer"
>       },
>       {
>         "type": "number"
>       },
>       {
>         "type": "boolean"
>       },
>       {
>         "items": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "array"
>       },
>       {
>         "additionalProperties": {
>           "anyOf": [
>             {
>               "$ref": "#/$defs/JSONValue"
>             },
>             {
>               "type": "null"
>             }
>           ]
>         },
>         "type": "object"
>       }
>     ]
>   }
> },
> "additionalProperties": false,
> "description": "A question that assigns a score using an ordered rubric.\n\nSee the [score primitive](https://docs.typesafe.ai/primitives/score) for details.",
> "properties": {
>   "type": {
>     "const": "score",
>     "default": "score",
>     "title": "Type",
>     "type": "string"
>   },
>   "instructions": {
>     "anyOf": [
>       {
>         "$ref": "#/$defs/JSONContent"
>       },
>       {
>         "type": "null"
>       }
>     ],
>     "default": null
>   },
>   "criteria": {
>     "items": {
>       "$ref": "#/$defs/JSONContent"
>     },
>     "title": "Criteria",
>     "type": "array"
>   }
> },
> "required": [
>   "criteria"
> ],
> "title": "Score",
> "type": "object"
> }
> ```

Fields:

* `type` (<code><a href="https://docs.python.org/3/library/typing.html#typing.Literal">Literal</a>\['score']</code>)
* <code><a href="/sdk/python/api/types/questions#typesafe_sdk.Score.criteria">criteria</a></code> (<code><a href="https://docs.python.org/3/library/collections.abc.html#collections.abc.Sequence">Sequence</a>\[<a href="/sdk/python/api/types/common#typesafe_sdk.JSONContent">JSONContent</a>]</code>)
* <code><a href="/sdk/python/api/types/questions#typesafe_sdk.Score.instructions">instructions</a></code> (<code><a href="/sdk/python/api/types/common#typesafe_sdk.JSONContent">JSONContent</a> | None</code>)

<h3 id="typesafe_sdk.Score.criteria">
  criteria
</h3>

`pydantic-field`

```python
criteria: Sequence[JSONContent]
```

A nonempty, ordered list of text, object, or array descriptions, one per score from zero.

<h3 id="typesafe_sdk.Score.instructions">
  instructions
</h3>

`pydantic-field`

```python
instructions: JSONContent | None = None
```

The question to ask, expressed as text, a JSON object, or an array; optional.

<h2 id="typesafe_sdk.Question">
  typesafe_sdk.Question
</h2>

`module-attribute`

```python
Question: TypeAlias = (
    Noul | Choice | Score | QuestionModel
)
```

A question object or question dictionary.

<h2 id="typesafe_sdk.Questions">
  typesafe_sdk.Questions
</h2>

`module-attribute`

```python
Questions: TypeAlias = Mapping[str, Question]
```

Question inputs keyed by the names used to identify their answers.

<h2 id="question-dictionaries">
  Question dictionaries
</h2>

Question dictionaries include a `type` key: `"noul"`, `"choice"`, or `"score"`. You can mix dictionaries and question objects in the same request.

<h2 id="typesafe_sdk.NoulModel">
  typesafe_sdk.NoulModel
</h2>

Bases: <code><a href="https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.TypedDict">TypedDict</a></code>

A yes/no question dictionary with `type="noul"`.

See the [noul primitive](https://docs.typesafe.ai/primitives/noul) for details.

<h3 id="typesafe_sdk.NoulModel.type">
  type
</h3>

`instance-attribute`

```python
type: Literal['noul']
```

<h3 id="typesafe_sdk.NoulModel.instructions">
  instructions
</h3>

`instance-attribute`

```python
instructions: NotRequired[JSONContent | None]
```

The question to ask, expressed as text, a JSON object, or an array; optional.

<h3 id="typesafe_sdk.NoulModel.criteria">
  criteria
</h3>

`instance-attribute`

```python
criteria: NotRequired[NoulCriteria | None]
```

Optional descriptions of the yes and no outcomes.

<h2 id="typesafe_sdk.ChoiceModel">
  typesafe_sdk.ChoiceModel
</h2>

Bases: <code><a href="https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.TypedDict">TypedDict</a></code>

A choice question dictionary with `type="choice"`.

See the [choice primitive](https://docs.typesafe.ai/primitives/choice) for details.

<h3 id="typesafe_sdk.ChoiceModel.type">
  type
</h3>

`instance-attribute`

```python
type: Literal['choice']
```

<h3 id="typesafe_sdk.ChoiceModel.instructions">
  instructions
</h3>

`instance-attribute`

```python
instructions: NotRequired[JSONContent | None]
```

The question to ask, expressed as text, a JSON object, or an array; optional.

<h3 id="typesafe_sdk.ChoiceModel.criteria">
  criteria
</h3>

`instance-attribute`

```python
criteria: Mapping[str, JSONContent | None]
```

Labels mapped to text, object, or array descriptions, or `None` for undescribed labels.

<h2 id="typesafe_sdk.ScoreModel">
  typesafe_sdk.ScoreModel
</h2>

Bases: <code><a href="https://typing-extensions.readthedocs.io/en/latest/index.html#typing_extensions.TypedDict">TypedDict</a></code>

A score question dictionary with `type="score"`.

See the [score primitive](https://docs.typesafe.ai/primitives/score) for details.

<h3 id="typesafe_sdk.ScoreModel.type">
  type
</h3>

`instance-attribute`

```python
type: Literal['score']
```

<h3 id="typesafe_sdk.ScoreModel.instructions">
  instructions
</h3>

`instance-attribute`

```python
instructions: NotRequired[JSONContent | None]
```

The question to ask, expressed as text, a JSON object, or an array; optional.

<h3 id="typesafe_sdk.ScoreModel.criteria">
  criteria
</h3>

`instance-attribute`

```python
criteria: Sequence[JSONContent]
```

A nonempty, ordered list of text, object, or array descriptions, one per score from zero.

<h2 id="typesafe_sdk.QuestionModel">
  typesafe_sdk.QuestionModel
</h2>

`module-attribute`

```python
QuestionModel: TypeAlias = (
    NoulModel | ChoiceModel | ScoreModel
)
```

A question dictionary identified by its `type` key.
