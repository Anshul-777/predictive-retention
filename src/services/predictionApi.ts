// src/services/predictionApi.ts

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
  // Map React form data to the exact schema your main.py CustomerData class expects
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
    // Inject the missing required variable by calculating it here
    TotalCharges: data.tenure * data.monthlyCharges, 
  };

  try {
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

    // Your main.py returns the PredictionResponse class
    const result = await response.json();

    return {
      churn_probability: result.probability_of_churn,
      predicted_churn: result.probability_of_churn >= 0.5,
      // Your main.py calculates risk_level as either 'Low' or 'High'
      risk_level: result.risk_level as "Low" | "Medium" | "High",
      recommendations: result.recommendations,
    };

  } catch (error) {
    console.error("Error during churn prediction:", error);
    throw error;
  }
}
