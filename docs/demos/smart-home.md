# Smart home assistant demo

> Demo code: a smart home assistant that uses Jev to evaluate user requests.

## Check it out in action

[Smart home assistant demo video](https://player.vimeo.com/video/1230923853)

## How it works

### Speculative fan-out

The chief pattern demonstrated here is [speculative fan-out](https://docs.typesafe.ai/patterns/fan-out.md). Each user request is evaluated against a long list of questions, including many that will end up irrelevant for most requests.

To carry out "Turn off all of the lights in the house", the code needs only four answers:

* "What category of request is this?" (smarthome command)
* "What domain is this request targeting?" (whole house)
* "What type of device is this request targeting?" (lights)
* "What action should be taken on the lights?" (turn off)

The last question assumes the request is a command to the lights, and Jev is asked it before anything confirms that. This is a speculative question: asking it early lets all the questions go to Jev in parallel, and code ignores the answers that don't apply. One set of questions then covers many kinds of request.

#### The wrong way: sequential API calls

The slower way is to split the questions across several API calls, and ask each one only once an earlier answer shows it's needed:

* "What category of request is this?" (smarthome command)

Then, only once you know it's a smarthome command:

* "What domain is this request targeting?" (whole house)
* "What type of device is this request targeting?" (lights)

Then, only once you know it's targeting lights:

* "What action should be taken on the lights?" (turn off)

This approach optimizes for a minimum number of questions, but it ends up being much slower and more expensive than batching all of the questions into one upfront API call.

### Jev and LLM pairing

The assistant calls an LLM in two cases, both where it needs generated text:

**Splitting a compound user request:** One of the questions in this demo is a Noul question identifying if the user request is asking for more than one distinct action. If this is true, the system uses an LLM to split the request into a list of atomic commands. The split requests are then evaluated by Jev individually.

**Falling back to a conversational LLM:** When Jev determines that the user query is a request for general information or conversation, the system calls an LLM to generate a freeform response. This allows an interactive system to handle requests with known deterministic behavior in a fast and cost efficient way, while still allowing for the flexibility provided by a generative LLM when needed. Jev's initial response is so fast compared to the LLM response that it adds negligible latency to the overall system.

## Run it yourself

This demo is a simple Vite/React single-page app that uses the TypeSafe API to evaluate user requests. The full source code will be available on GitHub at release. Its README includes instructions for running the demo locally and an overview of which bits of the source code are responsible for which parts of the demo.

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
