// API service layer for the LGBM Churn Prediction model
// Replace this URL with your live FastAPI endpoint
export const API_BASE_URL = "https://your-api-url.com";

export interface CustomerFormData {
  // Demographics
  gender: string;
  seniorCitizen: number;
  partner: string;
  dependents: string;
  // Account Info
  tenure: number;
  contract: string;
  paymentMethod: string;
  paperlessBilling: string;
  monthlyCharges: number;
  // Services
  phoneService: string;
  multipleLines: string;
  internetService: string;
  // Add-ons
  onlineSecurity: string;
  onlineBackup: string;
  deviceProtection: string;
  techSupport: string;
  streamingTV: string;
  streamingMovies: string;
}

export interface PredictionResult {
  churn_probability: number;
  predicted_churn: boolean;
  risk_level: "Low" | "Medium" | "High";
}

export async function predictChurn(data: CustomerFormData): Promise<PredictionResult> {
  const payload = {
    gender: data.gender,
    SeniorCitizen: data.seniorCitizen,
    Partner: data.partner,
    Dependents: data.dependents,
    tenure: data.tenure,
    PhoneService: data.phoneService,
    MultipleLines: data.multipleLines,
    InternetService: data.internetService,
    OnlineSecurity: data.onlineSecurity,
    OnlineBackup: data.onlineBackup,
    DeviceProtection: data.deviceProtection,
    TechSupport: data.techSupport,
    StreamingTV: data.streamingTV,
    StreamingMovies: data.streamingMovies,
    Contract: data.contract,
    PaperlessBilling: data.paperlessBilling,
    PaymentMethod: data.paymentMethod,
    MonthlyCharges: data.monthlyCharges,
  };

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const result = await response.json();

  // Normalize API response — adjust field names to match your FastAPI response
  const probability = result.churn_probability ?? result.probability ?? result.churn_prob ?? 0;
  const riskLevel: "Low" | "Medium" | "High" =
    probability < 0.35 ? "Low" : probability < 0.65 ? "Medium" : "High";

  return {
    churn_probability: probability,
    predicted_churn: probability >= 0.5,
    risk_level: riskLevel,
  };
}
