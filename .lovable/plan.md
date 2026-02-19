
## Customer Churn Predictor — Full-Stack Premium Web App

A polished, enterprise-grade React application with a **Light Clean SaaS** aesthetic that interfaces with your live LGBM API and stores predictions in Supabase.

---

### 1. Visual Identity & Theme Setup
- **Color palette**: Off-white background (`#F8FAFC`), **Deep Indigo** as primary, **Emerald Green** for safe/low-risk indicators, **Crimson Red** for high-risk churn alerts
- **Typography**: Inter font loaded via Google Fonts — clean, geometric, perfect for data-heavy interfaces
- **Custom CSS variables** updated across the design system to reflect the new palette

---

### 2. Landing Page
A professional marketing-style entry point:
- **Hero Section**: Bold headline *"Stop Customer Churn Before It Happens"* with a supporting subheadline and a glowing indigo CTA button: **"Launch Predictor"**
- **How It Works**: A visual 3-step horizontal pipeline — *Input Customer Data → LGBM Model Analyzes → Get Retention Strategy*
- **Stats Bar**: Mock trust-building metrics (e.g., "94.2% Model Accuracy", "2,000+ Predictions Made")
- **Footer**: Clean minimal footer with project links

---

### 3. Input Dashboard (Split-Screen Layout)
The core prediction interface:

**Left Panel (60%) — Grouped Input Form:**
- **Demographics Card**: Gender, Senior Citizen toggle, Partner, Dependents
- **Account Info Card**: Tenure (slider), Contract type, Payment Method, Paperless Billing
- **Services Card**: Phone service, Multiple Lines, Internet Service type
- **Add-ons Card**: Online Security, Online Backup, Device Protection, Tech Support, Streaming TV, Streaming Movies
- Each group is collapsible (accordion style) to reduce cognitive overload
- All inputs use natural language labels with `?` tooltip icons explaining each field
- **React Hook Form + Zod** validation — red inline errors if any field is invalid

**Right Panel (40%, sticky) — Live Prediction Panel:**
- Shows a placeholder state before prediction is run
- After submission: displays a **Score Gauge** (animated arc/dial from 0–100%) color-coded green → yellow → red
- **Churn Probability %** displayed prominently
- **Risk Badge**: "Low Risk", "Medium Risk", or "High Risk" with matching color
- **Actionable Insights**: Dynamic bullet-point recommendations that change based on the score (e.g., "Consider offering a long-term contract discount" if score is high)
- **Save to History** button after each prediction

---

### 4. Supabase Integration
- **Database table** `churn_predictions` with columns: all raw customer inputs + `churn_probability`, `predicted_churn_status`, `prediction_timestamp`
- **Prediction History Page**: A searchable, sortable table showing all past predictions with color-coded risk badges, timestamps, and the ability to click any row to reload the inputs
- Supabase auth is **not required** — predictions are stored anonymously with a session ID

---

### 5. API Integration
- A clean **API service layer** (`src/services/predictionApi.ts`) that packages the form data into the exact JSON payload your FastAPI backend expects
- The service calls your live API URL via `fetch`, handles loading and error states gracefully
- API URL stored as a configurable constant (easy to swap out)
- Loading spinner on the prediction panel while the model runs
- Error toast notification if the API call fails

---

### 6. Navigation
- **Top Navbar**: Logo/brand name on the left, navigation links (Home, Predictor, History) on the right
- Smooth routing between Landing, Dashboard, and History pages via React Router

---

### Pages & Components Summary
- `LandingPage` → Hero, Pipeline, Stats, CTA
- `Dashboard` → `FormSection` (4 input cards) + `PredictionPanel` (gauge + insights)
- `HistoryPage` → Searchable table of past predictions from Supabase
- Shared: `Navbar`, `ChurnGauge`, `RiskBadge`, `InsightsCard`
