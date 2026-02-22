import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are ChurnBot, the AI assistant for ChurnSense AI — a customer churn prediction application built for the telecom industry.

About ChurnSense AI:
- It uses a LightGBM (LGBM) machine learning model trained on the IBM Telco Customer Churn dataset with 7,043 records
- Model accuracy: 83.79% on holdout test set
- It predicts whether a telecom customer is likely to churn (leave) based on 18+ features
- Backend: FastAPI (Python) deployed on Render
- Frontend: React + TypeScript + Vite
- Edge proxy handles CORS between frontend and backend
- Predictions are saved to a cloud database with session tracking

Key Features:
- Input customer demographics, account info, services, and add-ons
- Get instant churn probability score (0-100%) with risk level (Low/Medium/High)
- Receive tailored retention recommendations
- Save and browse prediction history
- Reload past predictions into the form

Input Features the model uses:
- Demographics: Gender, Senior Citizen, Partner, Dependents
- Account: Tenure (0-72 months), Contract type, Payment method, Paperless billing, Monthly charges
- Services: Phone service, Multiple lines, Internet service (DSL/Fiber/No)
- Add-ons: Online security, Online backup, Device protection, Tech support, Streaming TV, Streaming movies

Key churn drivers:
- Month-to-month contracts (~43% churn rate)
- Fiber optic without security add-ons
- Tenure < 12 months (3x higher risk)
- Electronic check payment (~45% churn)
- No tech support (~42% churn rate)
- Senior citizens (~42% vs ~24%)

The model uses One-Hot Encoding + StandardScaler preprocessing, with engineered features like Num_Addon_Services and Has_Internet_No_Security.

Built by Anshul. GitHub: https://github.com/Anshul-777/predictive-retention
Portfolio: https://portfolio-alpha-lac-41.vercel.app/
API Docs: https://customer-churn-predictor-zdez.onrender.com/docs

Be helpful, concise, and knowledgeable about this project. If asked about unrelated topics, politely redirect to ChurnSense AI topics.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chatbot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
