# Use cases

> Build business workflows where Jev makes the judgments and your code acts on them.

Use cases include checking invoices, moderating chat, guarding LLM apps, and searching documents. Pick a category to see its use cases and try the example behind each one, or read on for how they are built.

## Use case categories

[Business process automationCheck invoices, claims, and documents before money moves, and send the uncertain ones to a person. Code owns the control flow, not markdown files, so it runs a million times in the background without a human co-pilot.](#business-process-automation)

[Real-time appsFrontier intelligence in about 150ms, fast enough for live UIs, voice assistants, games, and live chat moderation.](#real-time-apps)

[Search and labeling at scaleAbout 100x cheaper than a frontier LLM, so you can ask a question of every row, line, or record, then rank, filter, or label the results.](#search-and-labeling-at-scale)

[Agents and verificationCatch the jailbreaks, hallucinations, and citation errors other AIs make, at a fraction of the cost of the LLM call, and add routing, safety checks, and new abilities to agents.](#agents-and-verification)

[Images and videoFind, read, and check what's in scans, photos, and video frames.](#images-and-video)

## Use cases and examples

### Business process automation

For teams that check documents and claims before money moves, copy values out of documents by hand, or work through a queue of alerts.

| Use case | What Jev judges | What your code does | Example |
| - | - | - | - |
| **Decide whether an invoice can be paid** | Questions about the invoice, purchase order, contract, vendor record, prior invoices, correspondence, delivery evidence, and approvals | Stops on fraud or duplicates, then holds, disputes line items, requests a corrected invoice, routes for approval, pays less than the invoiced amount, schedules, or pays | [See the workflow ↗](https://evals.typesafe.ai/invoice_processing) |
| **Check OCR values and their bounding boxes on invoices** | Where each value an OCR extractor read appears on the page, whether the page supports that value, and whether a crop of its box does too | Accepts the fields and sends low-scoring ones to review | [Try it →](https://docs.typesafe.ai/cookbooks/ocr_confidence_bounding_boxes.md) |
| **Extract pre-parsed values, such as invoice totals** | Which of the candidates a regex found is the value you asked for | Copies that text exactly as it appears and converts it to a standard format | [Try it →](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook.md) |
| **Extract dates from documents** | Which day, month, year, or relative date (such as "next Thursday") a document names for each date you ask about | Works out the calendar date, checks that it is valid, and sends low-confidence ones to review | [Try it →](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook.md) |
| **Recover the structure of plain-text documents** | Which lines continue the one before, and whether each block is a heading, list, code, or callout | Rebuilds the document as Markdown | [Try it →](https://docs.typesafe.ai/cookbooks/autoformat.md) |
| **Classify SEC filings by industry** | Which of 75 industry groups an SEC annual report belongs to | Reports the group, or the broader division above it when the answer's confidence is low | [Try it →](https://docs.typesafe.ai/cookbooks/classification_using_confidence.md) |
| **Brief a regulation in one request** | Thirteen questions about the GDPR's Wikipedia article, such as whether a data breach must be reported within 72 hours, whether the law applies outside the EU, and how large its fines can be | Gets all 13 answers from one request, about 12x cheaper and faster than asking them one at a time | [Try it →](https://docs.typesafe.ai/cookbooks/parallel_questions.md) |
| **Triage security alerts** | Whether the activity was unauthorized, whether a ticket or schedule explains it, and how strong the evidence is | Closes explained alerts, queues unclear ones, and acts to contain confirmed incidents | [See the workflow ↗](https://evals.typesafe.ai/security_incidents) |

> [accordion] Worked example: catch invoice fraud in an accounts-payable inbox
>
> A finance team's shared inbox gets invoices, payment reminders, and questions from vendors. A few emails pretend to come from a vendor and ask for payment to new bank details. They can read like normal vendor emails, so a spam filter lets them through.
>
> Instead of asking Jev whether an email is fraudulent, ask about the signs of fraud. Send one request with the email, the vendor's record on file, the open invoices, and specific questions to help you determine if the email is fraud:
>
> * Does the email need an action from the finance team?
> * Does the sender's address look like it belongs to the vendor named in the email?
> * Does the email ask to change the vendor's payment or bank details?
> * Does the email pressure the reader to act quickly?
> * Which open invoice is the email about?
> * Does the email refer to any open invoice?
>
> Your code checks the fraud rule first, then whether the email needs action, and finally which invoice it concerns. If an answer needed for the next step is uncertain, send the email to finance. Once the answers an action needs are clear, uncertainty in the other answers does not stop it.
>
> | Answers | Action |
> | - | - |
> | Asks to change payment or bank details, and either the sender's address looks wrong or the email pressures the reader | Hold payments to that vendor and alert finance |
> | Fraud rule does not trigger, and the email needs no action | Archive |
> | Fraud rule does not trigger, the email needs action, and it refers to an open invoice that Jev identifies with a probability above your threshold | Send to the person who owns the invoice |
> | Fraud rule does not trigger, the email needs action, and it refers to no open invoice | Send to finance |
> | An answer that the fraud rule, the needs-action check, or the invoice match depends on is uncertain | Send to finance |
>
> Set probability thresholds for the answers each rule uses. If a temporary payment hold is less costly than missing a suspicious payment request, use a lower threshold to hold it for review. Require stronger evidence before archiving: the fraud rule must be ruled out, and the probability that the email needs action must be below your no-action threshold. Keep checks your code can do in the code, such as comparing an invoice total with its purchase order.
>
> This example combines three [patterns](https://docs.typesafe.ai/patterns.md#the-patterns) for asking questions and using the answers in code. [Speculative fan-out](https://docs.typesafe.ai/patterns/fan-out.md) asks every question in one request, including ones your code ends up not needing. The last question in the list is a [companion Noul](https://docs.typesafe.ai/patterns/companion-noul.md) question: it tells your code when the email names no open invoice. [Routing by probability](https://docs.typesafe.ai/patterns/probability-routing.md) sets a stricter threshold for actions that are hard to undo, such as archiving.
>
> The [invoice payment workflow](https://evals.typesafe.ai/invoice_processing) applies the same approach to the whole decision of whether an invoice can be paid.

**More ideas**

> [accordion] Claims triage
>
> * Classify first notice of loss (FNOL) reports, adjuster notes, and supporting documents.
> * Judge how complex a claim is, and detect missing information and potential fraud indicators.
> * Prioritize claims for specialist review or for straight-through processing (STP), where a claim is handled automatically from start to finish with no manual step.
> * Escalate uncertain or high-risk cases to a human adjuster.

> [accordion] Financial crime and know-your-customer (KYC) checks
>
> * Evaluate payment descriptions (such as a transfer's reference or memo), KYC documents, and past alerts for suspicious characteristics.
> * Match the same person or company across records whose names and profiles don't agree.
> * Prioritize alerts by risk, relevance, and evidence quality.
> * Route ambiguous cases to investigators for review.

> [accordion] Risk assessment
>
> * Turn incident reports, claims notes, transaction descriptions, and vendor assessments into risk indicators, each with a probability.
> * Use these indicators in insurance and underwriting workflows, where underwriting means deciding whether to take on a risk and on what terms.
> * Classify risk types and detect suspicious characteristics.
> * Score severity and prioritize review.
> * Extract features, the input values a model learns from, for broader risk models.

### Real-time apps

For apps that need an answer in milliseconds, such as smart home assistants, ordering, presentation tools, and live chat moderation.

| Use case | What Jev judges | What your code does | Example |
| - | - | - | - |
| **Tick off a presenter's notes as they speak** | How well the live transcript covers each note not yet ticked | Ticks a note once its score passes the threshold | [Try it →](https://docs.typesafe.ai/cookbooks/intelliprompter.md) |
| **Turn a cafe order into a shopping cart** | Which menu items an order names, and the fields of each item | Builds a structured cart | [Try it →](https://docs.typesafe.ai/cookbooks/cart_from_primitives.md) |
| **Control a smart home from plain-language requests** | What kind of request it is, and which area, device, and action it targets | Runs the command, and passes questions and conversation to an LLM | [Try it →](https://docs.typesafe.ai/demos/smart-home.md) |
| **Filter Twitch chat** | What kind of message it is (a question, cheering, chat, unasked-for gameplay advice, or spam), whether it insults someone, and whether it spoils the game | Hides insults, spam, and unasked-for advice, blurs spoilers, and highlights questions | [Try it →](https://docs.typesafe.ai/cookbooks/twitch_chat_filter.md) |

**More ideas**

> [accordion] Voice agents
>
> * Judge whether the speaker has finished their turn, alongside your speech-to-text model's end-of-turn signals.
> * Route customer-service calls: Jev makes the judgments in your decision tree, and your code applies the fixed rules and picks the final route.
> * Handle simple intents fast, such as a weather request.
> * Catch account numbers and other sensitive values that arrive split across transcript chunks, and avoid redacting values that aren't sensitive.

### Search and labeling at scale

For teams searching long documents, organizing product catalogs, merging datasets, or building predictive models from text.

| Use case | What Jev judges | What your code does | Example |
| - | - | - | - |
| **Line-by-line search of a long document** | Which line answers a plain-language query, and whether the document answers it at all | Ranks the lines, and labels the document as answered, partly answered, or not answered | [Try it →](https://docs.typesafe.ai/cookbooks/semantic_find.md) |
| **Re-rank legal search results** | Whether each candidate on a keyword-search shortlist could be the precedent a court opinion cites | Puts the most likely candidates first | [Try it →](https://docs.typesafe.ai/cookbooks/rerank_typesafe.md) |
| **Find a half-remembered film among 5,000** | Whether each film matches the person's description, first from a short plot, then from a long plot for the top 80, then which of the top 20 it is | Shows one film when the top probability is high, or a short list when it isn't | [Try it →](https://docs.typesafe.ai/cookbooks/infinite_cardinality_choice.md) |
| **Search Airbnb listings from a Google Sheets formula** | Which listings in each group of 100 best match a plain-English request, then how well each shortlisted listing matches it | Keeps the top 5 from each group, turns each score into a mark out of 10, and returns the 10 best | [Try it →](https://docs.typesafe.ai/demos/airbnb-listing-search.md) |
| **Hierarchical classification of patents, products, and medical topics** | Which category fits an item at each level of a category tree | Follows the most likely branches down to the most specific category | [Try it →](https://docs.typesafe.ai/cookbooks/hierarchical_classification.md) |
| **Align entities across knowledge graphs** | Whether two records describe the same item, closely related items, or different items, and whether their title, artist, and label match | Recommends a merge for clear matches, sends in-between pairs to a curator, and leaves the rest unlinked | [Try it →](https://docs.typesafe.ai/cookbooks/entity_alignment.md) |
| **Discover features for a predictive model** | Questions about each record that an LLM proposes | Turns the answers into numeric input columns for the model, and accepts a change that rewords or drops a question only when it lowers the model's error | [Try it →](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery.md) |

**More ideas**

> [accordion] Relationships and contradictions in records
>
> * Classify relationships and entity types.
> * Detect contradictions between records or claims.

> [accordion] Demand forecasting
>
> * Add features from customer inquiries, sales notes, product reviews, support tickets, and market reports to forecasting models.
> * Extract purchase intent, urgency, and product interest.
> * Detect supply concerns, competitive pressure, and new kinds of demand.
> * Feed those features into a forecasting model alongside historical time-series data.

### Agents and verification

For teams whose agents or LLM features in production need checks, routing, or review.

| Use case | What Jev judges | What your code does | Example |
| - | - | - | - |
| **Guardrails for LLM inputs and outputs** | Whether a message tries to override the app's instructions, asks for help to cause harm or for medical advice, or hints at self-harm, and how much harm answering would do | Lets each message through, sends it for review, blocks it, or routes it to a crisis-support path, using thresholds you set | [Try it →](https://docs.typesafe.ai/cookbooks/llm_guardrails.md) |
| **Double-check citations** | Whether the section a quote comes from supports the claim, contradicts it, or says nothing about it | Marks quotes missing from the source as fabricated, labels the rest verified, contradicted, or unsupported, and sends low-confidence labels to a person | [Try it →](https://docs.typesafe.ai/cookbooks/citation_check.md) |
| **Check an LLM's answer against the paragraphs it was given** | Whether the paragraphs state every fact the question needs, whether the answer declines, and whether following the paragraphs step by step leads to the answer | Turns the three probabilities into a risk and sends answers above your threshold to review | [Try it →](https://docs.typesafe.ai/cookbooks/verify_llm_outputs.md) |
| **Review finished agent runs** | Whether the agent was allowed to take its irreversible actions, whether the task got done, and how satisfied the user seemed | Alerts whoever is on call about actions that weren't permitted, closes runs with no problems, and files issues for failures | [See the workflow ↗](https://evals.typesafe.ai/agent_trace_observability) |
| **Classify RAG passages** | Whether each retrieved passage is relevant to the question, contains an answer, contradicts what the question assumes, or tries to give the model instructions | Drops irrelevant passages and ones with injected instructions, and gives the answering model the rest, with contradicting passages marked as conflicting | [Try it →](https://docs.typesafe.ai/cookbooks/classifying_rag_passages.md) |
| **Model cascade: cheap first, escalate on failure** | Whether each field a cheap model pulled out of the source is wrong, for example because the value doesn't fit the field's name, has the wrong type, or is empty when the source has that information | Accepts the cheap model's answer, and pays for a reasoning model only when a check fails | [Try it →](https://docs.typesafe.ai/cookbooks/sde_cascade.md) |
| **Suggest a skill for an agent** | Whether the request needs a skill at all, which of 194 skills fit it, then which of the top 3 fits best and whether each one does what was asked | Asks about the top 3 again with their full descriptions, and suggests at most one skill, or none when the probabilities fall below your thresholds | [Try it →](https://docs.typesafe.ai/cookbooks/skill_suggestion.md) |
| **Choose a support assistant's next actions** | What the customer wants, how frustrated they are, and whether they report charges they don't recognize or ask for a person | Applies safety rules first, then hands off to a person, refunds, freezes a card, or asks the customer to clarify | [See the workflow ↗](https://evals.typesafe.ai/customer_service) |
| **Give an assistant a simple memory** | Whether a request states a lasting fact about the customer, such as their plan or product edition | Saves those requests with Jev's answers, and adds them to that customer's later requests to Jev | [Try it →](https://docs.typesafe.ai/cookbooks/basic_memory.md) |
| **Function calling from plain-language requests** | Which function the request needs, and, for each argument limited to a fixed list of values, which value it takes | Calls the matching function in your code with those values, and leaves out arguments the request doesn't mention | [Try it →](https://docs.typesafe.ai/cookbooks/function_calling.md) |

**More ideas**

> [accordion] Tool-call and data-leak checks
>
> * Check the meaning of every tool call an agent makes, at a fraction of the cost of the LLM call.
> * Catch leaks of sensitive data in LLM outputs.
> * Detect tool-call errors and poor-quality responses as they happen.
> * Log each check's result and probability, so failures in the AI system or its harness (the code that runs the model and its tools) are easier to trace.

> [accordion] Scoring LLM answers
>
> * Score each LLM answer on the qualities you care about, such as whether it answers the question, stays on topic, or follows your style guide.
> * Compare two models' or two prompts' answers to the same input, and record which one is better.
> * Run the checks on every answer in production, and track the scores over time.
> * Send answers that score low, or that Jev is unsure about, to a person for review.

> [accordion] Model router: match each prompt to a model
>
> * Use Jev to build a custom router that chooses which LLM receives each prompt.
> * Set routing rules and thresholds for your specific workflow.
> * Classify each prompt's intent and subject area.
> * Estimate difficulty and risk.

> [accordion] Semantic code linting
>
> * Use Jev to add automated lint checks on the meaning of code and writing.
> * Define checks for your team's coding conventions and writing guidelines.
> * Run these checks in CI and flag violations for review.

### Images and video

For teams reading scans, photos, or video frames by eye.

| Use case | What Jev judges | What your code does | Example |
| - | - | - | - |
| **Read a scanned vaccination record** | Whether each vaccine is on the scan and where, which year each dose was given (or that it is unreadable), and whether each dose still protects on the departure date | Works out how long before the trip each dose was given, flags doubtful readings and out-of-date doses for a nurse, and crops the flagged rows | [Try it →](https://docs.typesafe.ai/cookbooks/reading_scanned_documents.md) |
| **Log bird visits from a feeder camera** | Whether a frame shows a bird, where it is, and which species it is | Turns the answers into a visit log for each species | [Try it →](https://docs.typesafe.ai/cookbooks/feeder_watch.md) |

### More industries

Ideas for industries beyond the categories above.

> [accordion] Content moderation
>
> * Apply company-specific, nuanced criteria to judge which posts meet your moderation standards.
> * Moderate user content and automated conversations across communities, customer support, and outreach by SDRs (sales development reps).
> * Detect fraud, unsafe advice, personal-data exposure, opt-out requests, and policy-violating claims.
> * Combine severity and probability or confidence to allow, warn, review, or block content.

> [accordion] Gaming
>
> * Evaluate player reports, in-game chat, reviews, and support conversations.
> * Detect suspicious behavior in player reports and chat.
> * Annotate content and score frustration or engagement.
> * Detect signs of churn (players about to stop playing) and route player-support requests.

> [accordion] Customer support
>
> * Classify incoming tickets by issue, product area, and customer intent.
> * Process call transcripts to extract customer issues, commitments, and follow-up actions.
> * Detect urgency and churn risk.
> * Route cases to the right team, queue, or automated workflow.
> * Verify support responses against policies and the customer's request.

> [accordion] Legal and compliance
>
> * Classify contracts, policies, regulatory filings, and marketing claims.
> * Detect missing clauses, prohibited claims, and policy violations.
> * Verify documents against explicit legal or compliance requirements.
> * Escalate high-risk or uncertain findings to counsel or compliance teams.

> [accordion] Recruiting
>
> * Evaluate resumes, applications, and interview feedback against explicit, job-related criteria.
> * Identify relevant experience.
> * Score evidence for required competencies.
> * Match candidates to roles.
> * Route candidates to hiring managers or recruiters.
> * Escalate uncertain cases for human review.

> [accordion] Lead generation
>
> * Match company profiles, executive biographies, and inbound messages to an ideal customer profile.
> * Score industry fit and company maturity.
> * Detect buyer relevance, pain points, and purchase intent.
> * Prioritize and route leads.

> [accordion] E-commerce marketplaces
>
> * Classify product listings from seller catalogs that don't match each other, and convert them to one standard format.
> * Extract product attributes from titles and descriptions.
> * Detect prohibited listings, counterfeit signals, review abuse, and policy violations.
> * Rank products and route uncertain listings for human review.

> [accordion] Advertising
>
> * Evaluate ad images and video, campaign copy, landing pages, and the content an ad appears next to.
> * Classify brand safety (whether nearby content could hurt the advertiser's brand) and whether an ad suits its audience.
> * Check regulatory compliance and prohibited claims.
> * Evaluate the quality of an ad and whether it matches its landing page.

> [accordion] Scientific discovery
>
> * Screen papers against inclusion and exclusion criteria for systematic reviews.
> * Label passages in interview transcripts, open-ended survey responses, and field notes using predefined themes or categories.
> * Flag missing methodological details, such as controls, dataset descriptions, and experimental settings.
> * Identify entities and relationships across papers to build research knowledge graphs, linking findings to supporting passages.

## Signs that you need Jev in your code workflow

* You ask an LLM to return JSON, then parse, validate, and retry it. Jev answers each question as a typed [primitive](https://docs.typesafe.ai/primitives) with its probability, so there's no text to parse.
* You have too much data to feed through a frontier LLM at a practical cost. In the [customer service evaluation](https://evals.typesafe.ai/customer_service), a Jev workflow costs much less than the frontier models.
* Your LLM workflow gives different answers to the same input. Ask narrow questions, and the probabilities show your code which answers are unsure. [Self-consistency: choices](https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook.md) and [Self-consistency: nouls](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook.md) show how to measure how often answers change. Across the [four evaluations](https://evals.typesafe.ai/), every model was more accurate as a structured workflow than with the same rules in one prompt.
* Your LLM workflow is too slow. In the [security incidents evaluation](https://evals.typesafe.ai/security_incidents), a Jev workflow takes 0.3 seconds a case, against 3.4 to 66 seconds for the frontier models.
* Someone on your team reads each item to decide what happens to it, and the decision depends on details an informed person would notice at a glance.
* Mistakes are costly, so uncertain cases need to reach a person.

## Designing your own workflow

Start from the action your system takes, and list the judgments it depends on. Turn each judgment into a question for Jev. Keep the rules that combine the answers into a decision in your code. [Patterns by goal](https://docs.typesafe.ai/patterns.md#patterns-by-goal) shows what each pattern is for, and [How to build with TypeSafe](https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md) covers how to design the questions and rules. If you build with a coding agent, install the [TypeSafe agent skill](https://docs.typesafe.ai/agent-skill.md) so it can help you write the code.

> [accordion] Decision shapes
>
> | Decision shape | Use it when | Common uses | Example |
> | - | - | - | - |
> | Classification | The answer is one category from a known list | Intent, topic, department, risk type, entity type | [Classification using confidence](https://docs.typesafe.ai/cookbooks/classification_using_confidence.md) |
> | Detection | You need a probability that one property is present | Spam, fraud, urgency, jailbreaks, sensitive data | [Guardrails for LLMs](https://docs.typesafe.ai/cookbooks/llm_guardrails.md) |
> | Scoring | The answer is a point on an ordered scale, such as low to high | Severity, relevance, quality, frustration, suitability | [Composite scoring](https://docs.typesafe.ai/patterns/composite-scoring.md) |
> | Routing | A category selects the next code path | Tool use, escalation, model routing, support queues | [Function calling](https://docs.typesafe.ai/cookbooks/function_calling.md) |
> | Search | You need to find items that match a natural-language query | Semantic search, document discovery, candidate generation | [Line-by-line search](https://docs.typesafe.ai/cookbooks/semantic_find.md) |
> | Retrieval | A workflow needs the most relevant context or records | RAG context, evidence retrieval, knowledge lookup | [Classifying RAG passages](https://docs.typesafe.ai/cookbooks/classifying_rag_passages.md) |
> | Ranking | Items need to be ordered by semantic relevance or quality | Search results, recommendations, candidate prioritization | [Re-ranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe.md) |
> | Verification | Output, such as an LLM answer or a tool call, must be checked for specific kinds of error | Citation support, policy violations, tool-call errors, response quality | [Double-checking citations](https://docs.typesafe.ai/cookbooks/citation_check.md) |
> | ML feature extraction | A traditional ML model needs features drawn from the meaning of text | Purchase intent, product interest, competitive pressure, churn signals | [Autoresearch feature discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery.md) |
> | Structured data extraction | Known fields must be pulled out of input with no fixed format | Candidate attributes, order fields, document labels | [Pre-parsed value extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook.md) |

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.
