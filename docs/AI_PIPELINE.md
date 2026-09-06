# JanDrishti AI Pipeline

The civic intelligence pipeline follows a robust, strictly typed workflow to convert natural language into actionable priorities.

## Flow

1. **Citizen Input**: A citizen submits a raw, unstructured text complaint (e.g., "The street light in front of my house has been broken for 3 weeks.").
2. **Gemini Extraction**: The backend makes a secure REST call to Google Gemini 1.5 Pro. The prompt explicitly restricts Gemini to act as an information extractor, NOT a policy maker.
3. **Structured JSON**: Gemini returns a strictly structured JSON containing the categorized complaint, language, location, extracted entities, urgency level, and confidence score.
4. **Validation**: The backend validates the AI response against strict enums (e.g. Category must be one of the known enums) and boundary limits.
5. **Persistence**: The validated data is saved alongside the original report. The report status advances to `AI_PROCESSED`.
6. **Clustering**: The `DemandClusterService` deterministically groups the new report into a cluster defined by `Category + Ward + District`.
7. **Priority Engine**: The cluster's priority score is mathematically recalculated. It combines Demand Volume (35%), Growth Rate (25%), Service Gap (20%), Population Impact (10%), and AI Urgency (10%).
8. **Officer Review**: High-priority clusters appear on the Officer Dashboard. An AI-generated summary provides explainability for the priority score.
9. **Human Decision**: An Officer reviews the recommendation and makes a final decision (`APPROVED`, `MODIFIED`, `REJECTED`). The decision is logged for auditing, and the citizen is notified.

## Why Gemini Does Not Make the Final Decision
AI models are highly capable of natural language understanding and information extraction. However, civic decisions require context that an LLM may not have (budget constraints, existing ongoing projects, localized geopolitical sensitivities). To ensure safety, fairness, and accountability, Gemini is used strictly for *Intelligence* and *Triaging*. The final execution decision always remains with a human Officer.
