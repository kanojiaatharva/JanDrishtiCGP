# JanDrishti 5-Minute Hackathon Demo Script

This script walks through the end-to-end civic intelligence flow of the JanDrishti prototype.

## Prerequisites
1. **Database**: MySQL running, schema seeded.
2. **Backend**: Spring Boot active on port 8080.
3. **Frontend**: Vite active on port 5173.
4. **Environment**: `GEMINI_API_KEY` present in backend `.env`.

---

## 1. Introduction (0:00 - 1:00)
**Speaker**: "Namaste. Welcome to JanDrishti. Traditional civic complaint systems are slow, manual, and localized. When hundreds of citizens report the same broken water line, officers have to manually triage each complaint. JanDrishti changes this by using AI to autonomously group complaints into actionable intelligence."

## 2. Citizen Experience (1:00 - 2:00)
1. Open `http://localhost:5173/login`.
2. Click **Load Demo Credentials (Citizen)**.
3. Click **Sign in**.
4. The mobile-first citizen home screen appears.
5. **Speaker**: "Here, Meena can report an issue effortlessly. She doesn't need to know which government department to select."
6. Click the large Microphone button (**Tap to speak**).
7. Wait 3 seconds for the mock transcription: *"हमारे गांव में पीने का पानी साफ नहीं है, कृपया इसे ठीक करें।"*
8. Click **Analyze Report**.
9. **Speaker**: "Instead of a generic form, JanDrishti uses Google Gemini to instantly parse the Hindi text, categorize it as 'Drinking Water', detect the urgency, and extract the location."
10. Show the **Review Report** screen, pointing out the 90%+ AI Confidence metric.
11. Click **Confirm Submission**.
12. **Speaker**: "The report is saved, and behind the scenes, our deterministic Priority Engine immediately recalculates the severity of this issue across the entire district."

## 3. Officer Intelligence Dashboard (2:00 - 3:30)
1. In a new incognito window, open `http://localhost:5173/login`.
2. Log in with `officer@demo.com` and password `password`.
3. The desktop Officer Dashboard appears.
4. **Speaker**: "Now let's switch to the Government Officer view. Notice the critical alert for Ward 14. Let's look at the Hotspots."
5. Click **Demand Hotspots** in the sidebar.
6. **Speaker**: "The system has aggregated over 1,284 individual citizen complaints into a single actionable hotspot for Ward 14 with a Priority Score of 92."
7. Click the **Ward 14** card.

## 4. Human-in-the-Loop & Explainable AI (3:30 - 4:30)
1. Scroll down the Hotspot Detail page.
2. **Speaker**: "AI shouldn't be a black box making government policy. Our Priority Engine provides a mathematical breakdown of why this score is a 92: High Demand, Rapid Growth, and Critical AI Urgency."
3. Point to the **AI Recommendation** section.
4. **Speaker**: "Gemini provides tactical recommendations—like deploying temporary water tankers—but the final decision remains strictly human."
5. Type "Dispatching engineering team immediately" into the Human Decision comment box.
6. Click **Approve Action**.

## 5. The Feedback Loop (4:30 - 5:00)
1. **Speaker**: "The decision is recorded in an immutable audit log, and the citizen receives an immediate update."
2. (Optional: Switch back to Citizen tab, click 'My Reports' to show the status updated to `ACTION_APPROVED`).
3. **Speaker**: "JanDrishti: Transforming millions of individual complaints into a single, intelligent lens for governance. Thank you."
