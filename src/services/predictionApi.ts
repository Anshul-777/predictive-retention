// src/services/predictionApi.ts

// Pointing to local FastAPI. Change to your live URL upon deployment.
export const API_BASE_URL = "http://localhost:8000"; 

export interface CustomerFormData {
  gender: string;
  seniorCitizen: number;
  partner: string;
  dependents: string;
  tenure: number;
  contract: string;
  paymentMethod: string;
  paperlessBilling: string;
  monthlyCharges: number;
  phoneService: string;
  multipleLines: string;
  internetService: string;
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
  recommendations?: string[];
}

export async function predictChurn(data: CustomerFormData): Promise<PredictionResult> {
  // 1. Map React camelCase to FastAPI PascalCase/camelCase payload
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

  try {
    // 2. Execute network request
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 3. Robust Error Handling for Server Crashes or Validation Errors
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error ${response.status}: Failed to reach predictor.`;
      
      // Attempt to parse FastAPI's detailed JSON error if available
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.detail) {
          errorMessage = typeof errorJson.detail === 'string' 
            ? errorJson.detail 
            : JSON.stringify(errorJson.detail);
        }
      } catch (parseError) {
        // Fallback to raw text if the server threw a non-JSON error (e.g., 502 Bad Gateway)
        errorMessage = `API Error ${response.status}: ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    // 4. Parse the successful response
    const result = await response.json();

    // 5. Safe variable mapping (Targeting 'probability_of_churn' specifically)
    const probability = result.probability_of_churn ?? result.churn_probability ?? result.probability ?? 0;
    
    // 6. Safe Risk Level casting
    let riskLevel: "Low" | "Medium" | "High" = "Low";
    if (result.risk_level === "High" || result.risk_level === "Medium" || result.risk_level === "Low") {
      riskLevel = result.risk_level;
    } else {
      // Fallback calculation if backend doesn't provide it
      riskLevel = probability < 0.35 ? "Low" : probability < 0.65 ? "Medium" : "High";
    }

    return {
      churn_probability: probability,
      predicted_churn: probability >= 0.5,
      risk_level: riskLevel,
      recommendations: result.recommendations || [],
    };

  } catch (error) {
    console.error("Critical error during churn prediction:", error);
    throw error;
  }
}
