# Answers and responses

> Read answers, confidence scores, token usage, and available models returned by the TypeSafe API.

<a id="answers-and-responses" />

<h2 id="response">
  Response
</h2>

<h2 id="typesafe_sdk.SystemOneResponse">
  typesafe_sdk.SystemOneResponse
</h2>

`pydantic-model`

Bases: `Response`

Answers grouped by question type with model and usage metadata.

See [System One](https://docs.typesafe.ai/concepts/system-one) for details.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "$defs": {
>   "ChoiceAnswer": {
>     "description": "A selected label and its probabilities.\n\nSee the [choice primitive](https://docs.typesafe.ai/primitives/choice) for details.",
>     "properties": {
>       "type": {
>         "const": "choice",
>         "default": "choice",
>         "title": "Type",
>         "type": "string"
>       },
>       "choice": {
>         "description": "The name of the choice with the highest probability among the question's criteria.",
>         "examples": [
>           "angry"
>         ],
>         "title": "Choice",
>         "type": "string"
>       },
>       "confidence": {
>         "description": "Confidence in the selected choice, from 0 to 1. Higher values indicate greater certainty; use lower values to flag uncertain selections for review.",
>         "examples": [
>           0.9
>         ],
>         "title": "Confidence",
>         "type": "number"
>       },
>       "probabilities": {
>         "additionalProperties": {
>           "type": "number"
>         },
>         "description": "Probability of each choice in criteria, keyed by choice name, from 0 to 1. Shows how likely the alternatives are; values sum to approximately 1.",
>         "examples": [
>           {
>             "angry": 0.8,
>             "calm": 0.1,
>             "excited": 0.1
>           }
>         ],
>         "title": "Probabilities",
>         "type": "object"
>       }
>     },
>     "required": [
>       "choice",
>       "confidence",
>       "probabilities"
>     ],
>     "title": "ChoiceAnswer",
>     "type": "object"
>   },
>   "NoulAnswer": {
>     "description": "A yes/no answer.\n\nSee the [noul primitive](https://docs.typesafe.ai/primitives/noul) for details.",
>     "properties": {
>       "type": {
>         "const": "noul",
>         "default": "noul",
>         "title": "Type",
>         "type": "string"
>       },
>       "noul": {
>         "description": "Probability of a yes answer or a true statement, from 0 to 1. Values near 1 favor yes or true, values near 0 favor no or false, and values near 0.5 indicate uncertainty.",
>         "examples": [
>           0.98
>         ],
>         "title": "Noul",
>         "type": "number"
>       }
>     },
>     "required": [
>       "noul"
>     ],
>     "title": "NoulAnswer",
>     "type": "object"
>   },
>   "ScoreAnswer": {
>     "description": "An expected score with its rubric and probabilities.\n\nSee the [score primitive](https://docs.typesafe.ai/primitives/score) for details.",
>     "properties": {
>       "type": {
>         "const": "score",
>         "default": "score",
>         "title": "Type",
>         "type": "string"
>       },
>       "score": {
>         "description": "Expected score: the probability-weighted average of the rubric levels. May fall between integer levels.",
>         "examples": [
>           1.7
>         ],
>         "title": "Score",
>         "type": "number"
>       },
>       "confidence": {
>         "description": "Confidence in the score, from 0 to 1. Higher values indicate greater certainty; use lower values to flag uncertain ratings for review.",
>         "examples": [
>           0.9
>         ],
>         "title": "Confidence",
>         "type": "number"
>       },
>       "legend": {
>         "additionalProperties": {
>           "anyOf": [
>             {
>               "type": "string"
>             },
>             {
>               "additionalProperties": true,
>               "type": "object"
>             },
>             {
>               "items": {},
>               "type": "array"
>             }
>           ]
>         },
>         "title": "Legend",
>         "type": "object"
>       },
>       "probabilities": {
>         "additionalProperties": {
>           "type": "number"
>         },
>         "title": "Probabilities",
>         "type": "object"
>       }
>     },
>     "required": [
>       "score",
>       "confidence",
>       "legend",
>       "probabilities"
>     ],
>     "title": "ScoreAnswer",
>     "type": "object"
>   },
>   "Usage": {
>     "description": "Token counts for a request, when reported by the API.",
>     "properties": {
>       "input_tokens": {
>         "anyOf": [
>           {
>             "type": "integer"
>           },
>           {
>             "type": "null"
>           }
>         ],
>         "default": null,
>         "title": "Input Tokens"
>       },
>       "output_tokens": {
>         "anyOf": [
>           {
>             "type": "integer"
>           },
>           {
>             "type": "null"
>           }
>         ],
>         "default": null,
>         "title": "Output Tokens"
>       }
>     },
>     "title": "Usage",
>     "type": "object"
>   }
> },
> "description": "Answers grouped by question type with model and usage metadata.\n\nSee [System One](https://docs.typesafe.ai/concepts/system-one) for details.",
> "properties": {
>   "model": {
>     "title": "Model",
>     "type": "string"
>   },
>   "usage": {
>     "$ref": "#/$defs/Usage"
>   },
>   "answers": {
>     "additionalProperties": {
>       "discriminator": {
>         "mapping": {
>           "choice": "#/$defs/ChoiceAnswer",
>           "noul": "#/$defs/NoulAnswer",
>           "score": "#/$defs/ScoreAnswer"
>         },
>         "propertyName": "type"
>       },
>       "oneOf": [
>         {
>           "$ref": "#/$defs/NoulAnswer"
>         },
>         {
>           "$ref": "#/$defs/ChoiceAnswer"
>         },
>         {
>           "$ref": "#/$defs/ScoreAnswer"
>         }
>       ]
>     },
>     "title": "Answers",
>     "type": "object"
>   }
> },
> "required": [
>   "model",
>   "usage"
> ],
> "title": "SystemOneResponse",
> "type": "object"
> }
> ```

Config:

* `extra`: `ignore`
* `frozen`: `True`
* `strict`: `True`

Fields:

* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.SystemOneResponse.model">model</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a></code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.SystemOneResponse.usage">usage</a></code> (<code><a href="/sdk/python/api/types/responses#typesafe_sdk.Usage">Usage</a></code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.SystemOneResponse.answers">answers</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#dict">dict</a>\[<a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a>, <a href="/sdk/python/api/types/responses#typesafe_sdk.Answer">Answer</a>]</code>)

<h3 id="typesafe_sdk.SystemOneResponse.request_id">
  request_id
</h3>

`cached` `property`

```python
request_id: str
```

The `x-typesafe-request-id` response header.

<h3 id="typesafe_sdk.SystemOneResponse.raw_http_response">
  raw_http_response
</h3>

`property`

```python
raw_http_response: httpx2.Response
```

The underlying `httpx2.Response`, exposing status, headers, and body.

<h3 id="typesafe_sdk.SystemOneResponse.model_config">
  model_config
</h3>

`class-attribute` `instance-attribute`

```python
model_config = ConfigDict(
    extra="ignore", frozen=True, strict=True
)
```

<h3 id="typesafe_sdk.SystemOneResponse.model">
  model
</h3>

`pydantic-field`

```python
model: str
```

The model used to answer the request.

<h3 id="typesafe_sdk.SystemOneResponse.usage">
  usage
</h3>

`pydantic-field`

```python
usage: Usage
```

Token usage for the request.

<h3 id="typesafe_sdk.SystemOneResponse.answers">
  answers
</h3>

`pydantic-field`

```python
answers: dict[str, Answer]
```

All answer objects keyed by question name.

<h3 id="typesafe_sdk.SystemOneResponse.nouls">
  nouls
</h3>

`cached` `property`

```python
nouls: dict[str, NoulAnswer]
```

Yes/no answers keyed by question name.

<h3 id="typesafe_sdk.SystemOneResponse.choices">
  choices
</h3>

`cached` `property`

```python
choices: dict[str, ChoiceAnswer]
```

Choice answers keyed by question name.

<h3 id="typesafe_sdk.SystemOneResponse.scores">
  scores
</h3>

`cached` `property`

```python
scores: dict[str, ScoreAnswer]
```

Score answers keyed by question name.

<h2 id="typesafe_sdk.Usage">
  typesafe_sdk.Usage
</h2>

`pydantic-model`

Bases: `wire.Usage`

Token counts for a request, when reported by the API.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "description": "Token counts for a request, when reported by the API.",
> "properties": {
>   "input_tokens": {
>     "anyOf": [
>       {
>         "type": "integer"
>       },
>       {
>         "type": "null"
>       }
>     ],
>     "default": null,
>     "title": "Input Tokens"
>   },
>   "output_tokens": {
>     "anyOf": [
>       {
>         "type": "integer"
>       },
>       {
>         "type": "null"
>       }
>     ],
>     "default": null,
>     "title": "Output Tokens"
>   }
> },
> "title": "Usage",
> "type": "object"
> }
> ```

Config:

* `extra`: `ignore`
* `frozen`: `True`
* `strict`: `True`

Fields:

* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.Usage.input_tokens">input_tokens</a></code> (<code><a href="https://docs.python.org/3/builtins/functions.html#int">int</a> | None</code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.Usage.output_tokens">output_tokens</a></code> (<code><a href="https://docs.python.org/3/builtins/functions.html#int">int</a> | None</code>)

<h3 id="typesafe_sdk.Usage.model_config">
  model_config
</h3>

`class-attribute` `instance-attribute`

```python
model_config = ConfigDict(
    extra="ignore", frozen=True, strict=True
)
```

<h3 id="typesafe_sdk.Usage.input_tokens">
  input_tokens
</h3>

`pydantic-field`

```python
input_tokens: int | None = None
```

Number of input tokens used, or `None` when the API did not report it.

<h3 id="typesafe_sdk.Usage.output_tokens">
  output_tokens
</h3>

`pydantic-field`

```python
output_tokens: int | None = None
```

Number of output tokens used, or `None` when the API did not report it.

<h2 id="answers">
  Answers
</h2>

<h2 id="typesafe_sdk.NoulAnswer">
  typesafe_sdk.NoulAnswer
</h2>

`pydantic-model`

Bases: `wire.NoulAnswer`

A yes/no answer.

See the [noul primitive](https://docs.typesafe.ai/primitives/noul) for details.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "description": "A yes/no answer.\n\nSee the [noul primitive](https://docs.typesafe.ai/primitives/noul) for details.",
> "properties": {
>   "type": {
>     "const": "noul",
>     "default": "noul",
>     "title": "Type",
>     "type": "string"
>   },
>   "noul": {
>     "description": "Probability of a yes answer or a true statement, from 0 to 1. Values near 1 favor yes or true, values near 0 favor no or false, and values near 0.5 indicate uncertainty.",
>     "examples": [
>       0.98
>     ],
>     "title": "Noul",
>     "type": "number"
>   }
> },
> "required": [
>   "noul"
> ],
> "title": "NoulAnswer",
> "type": "object"
> }
> ```

Config:

* `extra`: `ignore`
* `frozen`: `True`
* `strict`: `True`

Fields:

* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.NoulAnswer.noul">noul</a></code> (<code><a href="https://docs.python.org/3/builtins/functions.html#float">float</a></code>)
* `type` (<code><a href="https://docs.python.org/3/library/typing.html#typing.Literal">Literal</a>\['noul']</code>)

<h3 id="typesafe_sdk.NoulAnswer.noul">
  noul
</h3>

`pydantic-field`

```python
noul: float
```

Probability of a yes answer or a true statement, from 0 to 1. Values near 1 favor yes or true, values near 0 favor no or false, and values near 0.5 indicate uncertainty.

<h3 id="typesafe_sdk.NoulAnswer.model_config">
  model_config
</h3>

`class-attribute` `instance-attribute`

```python
model_config = ConfigDict(
    extra="ignore", frozen=True, strict=True
)
```

<h2 id="typesafe_sdk.ChoiceAnswer">
  typesafe_sdk.ChoiceAnswer
</h2>

`pydantic-model`

Bases: `wire.ChoiceAnswer`

A selected label and its probabilities.

See the [choice primitive](https://docs.typesafe.ai/primitives/choice) for details.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "description": "A selected label and its probabilities.\n\nSee the [choice primitive](https://docs.typesafe.ai/primitives/choice) for details.",
> "properties": {
>   "type": {
>     "const": "choice",
>     "default": "choice",
>     "title": "Type",
>     "type": "string"
>   },
>   "choice": {
>     "description": "The name of the choice with the highest probability among the question's criteria.",
>     "examples": [
>       "angry"
>     ],
>     "title": "Choice",
>     "type": "string"
>   },
>   "confidence": {
>     "description": "Confidence in the selected choice, from 0 to 1. Higher values indicate greater certainty; use lower values to flag uncertain selections for review.",
>     "examples": [
>       0.9
>     ],
>     "title": "Confidence",
>     "type": "number"
>   },
>   "probabilities": {
>     "additionalProperties": {
>       "type": "number"
>     },
>     "description": "Probability of each choice in criteria, keyed by choice name, from 0 to 1. Shows how likely the alternatives are; values sum to approximately 1.",
>     "examples": [
>       {
>         "angry": 0.8,
>         "calm": 0.1,
>         "excited": 0.1
>       }
>     ],
>     "title": "Probabilities",
>     "type": "object"
>   }
> },
> "required": [
>   "choice",
>   "confidence",
>   "probabilities"
> ],
> "title": "ChoiceAnswer",
> "type": "object"
> }
> ```

Config:

* `extra`: `ignore`
* `frozen`: `True`
* `strict`: `True`

Fields:

* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ChoiceAnswer.choice">choice</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a></code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ChoiceAnswer.confidence">confidence</a></code> (<code><a href="https://docs.python.org/3/builtins/functions.html#float">float</a></code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ChoiceAnswer.probabilities">probabilities</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#dict">dict</a>\[<a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a>, <a href="https://docs.python.org/3/builtins/functions.html#float">float</a>]</code>)
* `type` (<code><a href="https://docs.python.org/3/library/typing.html#typing.Literal">Literal</a>\['choice']</code>)

<h3 id="typesafe_sdk.ChoiceAnswer.choice">
  choice
</h3>

`pydantic-field`

```python
choice: str
```

The name of the choice with the highest probability among the question's criteria.

<h3 id="typesafe_sdk.ChoiceAnswer.confidence">
  confidence
</h3>

`pydantic-field`

```python
confidence: float
```

Confidence in the selected choice, from 0 to 1. Higher values indicate greater certainty; use lower values to flag uncertain selections for review.

<h3 id="typesafe_sdk.ChoiceAnswer.probabilities">
  probabilities
</h3>

`pydantic-field`

```python
probabilities: dict[str, float]
```

Probability of each choice in criteria, keyed by choice name, from 0 to 1. Shows how likely the alternatives are; values sum to approximately 1.

<h3 id="typesafe_sdk.ChoiceAnswer.model_config">
  model_config
</h3>

`class-attribute` `instance-attribute`

```python
model_config = ConfigDict(
    extra="ignore", frozen=True, strict=True
)
```

<h2 id="typesafe_sdk.ScoreAnswer">
  typesafe_sdk.ScoreAnswer
</h2>

`pydantic-model`

Bases: `wire.ScoreAnswer`

An expected score with its rubric and probabilities.

See the [score primitive](https://docs.typesafe.ai/primitives/score) for details.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "description": "An expected score with its rubric and probabilities.\n\nSee the [score primitive](https://docs.typesafe.ai/primitives/score) for details.",
> "properties": {
>   "type": {
>     "const": "score",
>     "default": "score",
>     "title": "Type",
>     "type": "string"
>   },
>   "score": {
>     "description": "Expected score: the probability-weighted average of the rubric levels. May fall between integer levels.",
>     "examples": [
>       1.7
>     ],
>     "title": "Score",
>     "type": "number"
>   },
>   "confidence": {
>     "description": "Confidence in the score, from 0 to 1. Higher values indicate greater certainty; use lower values to flag uncertain ratings for review.",
>     "examples": [
>       0.9
>     ],
>     "title": "Confidence",
>     "type": "number"
>   },
>   "legend": {
>     "additionalProperties": {
>       "anyOf": [
>         {
>           "type": "string"
>         },
>         {
>           "additionalProperties": true,
>           "type": "object"
>         },
>         {
>           "items": {},
>           "type": "array"
>         }
>       ]
>     },
>     "title": "Legend",
>     "type": "object"
>   },
>   "probabilities": {
>     "additionalProperties": {
>       "type": "number"
>     },
>     "title": "Probabilities",
>     "type": "object"
>   }
> },
> "required": [
>   "score",
>   "confidence",
>   "legend",
>   "probabilities"
> ],
> "title": "ScoreAnswer",
> "type": "object"
> }
> ```

Config:

* `extra`: `ignore`
* `frozen`: `True`
* `strict`: `True`

Fields:

* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ScoreAnswer.score">score</a></code> (<code><a href="https://docs.python.org/3/builtins/functions.html#float">float</a></code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ScoreAnswer.confidence">confidence</a></code> (<code><a href="https://docs.python.org/3/builtins/functions.html#float">float</a></code>)
* `type` (<code><a href="https://docs.python.org/3/library/typing.html#typing.Literal">Literal</a>\['score']</code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ScoreAnswer.legend">legend</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#dict">dict</a>\[<a href="https://docs.python.org/3/builtins/functions.html#int">int</a>, <a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a> | <a href="https://docs.python.org/3/builtins/stdtypes.html#dict">dict</a>\[<a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a>, <a href="https://docs.python.org/3/library/typing.html#typing.Any">Any</a>] | <a href="https://docs.python.org/3/builtins/stdtypes.html#list">list</a>\[<a href="https://docs.python.org/3/library/typing.html#typing.Any">Any</a>]]</code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ScoreAnswer.probabilities">probabilities</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#dict">dict</a>\[<a href="https://docs.python.org/3/builtins/functions.html#int">int</a>, <a href="https://docs.python.org/3/builtins/functions.html#float">float</a>]</code>)

<h3 id="typesafe_sdk.ScoreAnswer.score">
  score
</h3>

`pydantic-field`

```python
score: float
```

Expected score: the probability-weighted average of the rubric levels. May fall between integer levels.

<h3 id="typesafe_sdk.ScoreAnswer.confidence">
  confidence
</h3>

`pydantic-field`

```python
confidence: float
```

Confidence in the score, from 0 to 1. Higher values indicate greater certainty; use lower values to flag uncertain ratings for review.

<h3 id="typesafe_sdk.ScoreAnswer.model_config">
  model_config
</h3>

`class-attribute` `instance-attribute`

```python
model_config = ConfigDict(
    extra="ignore", frozen=True, strict=True
)
```

<h3 id="typesafe_sdk.ScoreAnswer.legend">
  legend
</h3>

`pydantic-field`

```python
legend: dict[
    int, str | dict[str, Any] | list[Any]
]
```

Rubric descriptions keyed by integer score.

<h3 id="typesafe_sdk.ScoreAnswer.probabilities">
  probabilities
</h3>

`pydantic-field`

```python
probabilities: dict[int, float]
```

Probabilities keyed by integer score.

<h2 id="typesafe_sdk.Answer">
  typesafe_sdk.Answer
</h2>

`module-attribute`

```python
Answer: TypeAlias = Annotated[
    NoulAnswer | ChoiceAnswer | ScoreAnswer,
    Field(discriminator="type"),
]
```

An answer to a single question, identified by its `type`.

<h2 id="available-models">
  Available models
</h2>

<h2 id="typesafe_sdk.ListModelsResponse">
  typesafe_sdk.ListModelsResponse
</h2>

`pydantic-model`

Bases: `Response`

The models available to the account.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "$defs": {
>   "ModelMetadata": {
>     "description": "Metadata describing a single available model.",
>     "properties": {
>       "name": {
>         "title": "Name",
>         "type": "string"
>       },
>       "description": {
>         "title": "Description",
>         "type": "string"
>       },
>       "release_date": {
>         "title": "Release Date",
>         "type": "string"
>       }
>     },
>     "required": [
>       "name",
>       "description",
>       "release_date"
>     ],
>     "title": "ModelMetadata",
>     "type": "object"
>   }
> },
> "description": "The models available to the account.",
> "properties": {
>   "models": {
>     "items": {
>       "$ref": "#/$defs/ModelMetadata"
>     },
>     "title": "Models",
>     "type": "array"
>   }
> },
> "required": [
>   "models"
> ],
> "title": "ListModelsResponse",
> "type": "object"
> }
> ```

Fields:

* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ListModelsResponse.models">models</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#tuple">tuple</a>\[<a href="/sdk/python/api/types/responses#typesafe_sdk.ModelMetadata">ModelMetadata</a>, ...]</code>)

<h3 id="typesafe_sdk.ListModelsResponse.request_id">
  request_id
</h3>

`cached` `property`

```python
request_id: str
```

The `x-typesafe-request-id` response header.

<h3 id="typesafe_sdk.ListModelsResponse.raw_http_response">
  raw_http_response
</h3>

`property`

```python
raw_http_response: httpx2.Response
```

The underlying `httpx2.Response`, exposing status, headers, and body.

<h3 id="typesafe_sdk.ListModelsResponse.model_config">
  model_config
</h3>

`class-attribute` `instance-attribute`

```python
model_config = ConfigDict(
    extra="ignore", frozen=True, strict=True
)
```

<h3 id="typesafe_sdk.ListModelsResponse.models">
  models
</h3>

`pydantic-field`

```python
models: tuple[ModelMetadata, ...]
```

The available models.

<h2 id="typesafe_sdk.ModelMetadata">
  typesafe_sdk.ModelMetadata
</h2>

`pydantic-model`

Bases: `Schema`

Metadata describing a single available model.

> **Note:**
> **Show JSON schema:**
>
> #### Details

> ```json
> {
> "description": "Metadata describing a single available model.",
> "properties": {
>   "name": {
>     "title": "Name",
>     "type": "string"
>   },
>   "description": {
>     "title": "Description",
>     "type": "string"
>   },
>   "release_date": {
>     "title": "Release Date",
>     "type": "string"
>   }
> },
> "required": [
>   "name",
>   "description",
>   "release_date"
> ],
> "title": "ModelMetadata",
> "type": "object"
> }
> ```

Fields:

* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ModelMetadata.name">name</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a></code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ModelMetadata.description">description</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a></code>)
* <code><a href="/sdk/python/api/types/responses#typesafe_sdk.ModelMetadata.release_date">release_date</a></code> (<code><a href="https://docs.python.org/3/builtins/stdtypes.html#str">str</a></code>)

<h3 id="typesafe_sdk.ModelMetadata.name">
  name
</h3>

`pydantic-field`

```python
name: str
```

Model name or alias accepted by a request's model field.

<h3 id="typesafe_sdk.ModelMetadata.description">
  description
</h3>

`pydantic-field`

```python
description: str
```

Human-readable description of the model and its capabilities.

<h3 id="typesafe_sdk.ModelMetadata.release_date">
  release_date
</h3>

`pydantic-field`

```python
release_date: str
```

Model release date, formatted as YYYY-MM-DD.
