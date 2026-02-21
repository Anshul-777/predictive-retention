import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, List
from fastapi.middleware.cors import CORSMiddleware


# ===============================
# Load Model Artifacts
# ===============================

loaded_lgbm_model = joblib.load("best_lgbm_model.joblib")
loaded_scaler = joblib.load("scaler.joblib")
loaded_encoder = joblib.load("encoder.joblib")

numerical_features_model_columns = [
    "SeniorCitizen",
    "tenure",
    "MonthlyCharges",
    "TotalCharges",
    "Num_Addon_Services",
    "Has_Internet_No_Security",
]

categorical_features_for_encoder = [
    "gender",
    "Partner",
    "Dependents",
    "PhoneService",
    "MultipleLines",
    "InternetService",
    "Contract",
    "PaperlessBilling",
    "PaymentMethod",
]

encoded_feature_names = loaded_encoder.get_feature_names_out(
    categorical_features_for_encoder
)

MODEL_FEATURES = numerical_features_model_columns + list(encoded_feature_names)

print("Model, scaler, and encoder loaded successfully.")
print(f"Total expected model features: {len(MODEL_FEATURES)}")


# ===============================
# Pydantic Schemas
# ===============================

class CustomerData(BaseModel):
    gender: Literal["Male", "Female"]
    SeniorCitizen: Literal[0, 1]
    Partner: Literal["Yes", "No"]
    Dependents: Literal["Yes", "No"]
    tenure: int = Field(..., ge=0, le=72)
    PhoneService: Literal["Yes", "No"]
    MultipleLines: Literal["Yes", "No", "No phone service"]
    InternetService: Literal["DSL", "Fiber optic", "No"]
    OnlineSecurity: Literal["Yes", "No", "No internet service"]
    OnlineBackup: Literal["Yes", "No", "No internet service"]
    DeviceProtection: Literal["Yes", "No", "No internet service"]
    TechSupport: Literal["Yes", "No", "No internet service"]
    StreamingTV: Literal["Yes", "No", "No internet service"]
    StreamingMovies: Literal["Yes", "No", "No internet service"]
    Contract: Literal["Month-to-month", "One year", "Two year"]
    PaperlessBilling: Literal["Yes", "No"]
    PaymentMethod: Literal[
        "Electronic check",
        "Mailed check",
        "Bank transfer (automatic)",
        "Credit card (automatic)",
    ]
    MonthlyCharges: float = Field(..., ge=0)
    TotalCharges: float = Field(..., ge=0)


class PredictionResponse(BaseModel):
    predicted_churn_status: str
    probability_of_churn: float
    risk_level: Literal["Low", "Medium", "High"]
    recommendations: List[str]


# ===============================
# Preprocessing Function
# ===============================

def preprocess_input(customer_data: CustomerData) -> pd.DataFrame:
    raw_data = customer_data.model_dump()

    # Fix list values like [1] → 1
    for key, value in raw_data.items():
        if isinstance(value, list):
            raw_data[key] = value[0]

    user_df = pd.DataFrame([raw_data])

    # Force numeric types
    user_df["SeniorCitizen"] = int(user_df["SeniorCitizen"])
    user_df["tenure"] = int(user_df["tenure"])
    user_df["MonthlyCharges"] = float(user_df["MonthlyCharges"])
    user_df["TotalCharges"] = float(user_df["TotalCharges"])

    # Map add-on services to numeric
    addon_map = {"Yes": 1, "No": 0, "No internet service": 0}
    addon_cols = [
        "OnlineSecurity",
        "OnlineBackup",
        "DeviceProtection",
        "TechSupport",
        "StreamingTV",
        "StreamingMovies",
    ]

    for col in addon_cols:
        user_df[col] = user_df[col].map(addon_map)

    user_df["Num_Addon_Services"] = user_df[addon_cols].sum(axis=1)

    user_df["Has_Internet_No_Security"] = (
        (user_df["InternetService"] != "No")
        & (user_df["OnlineSecurity"] == 0)
        & (user_df["TechSupport"] == 0)
    ).astype(int)

    # Encode categorical
    encoded = loaded_encoder.transform(
        user_df[categorical_features_for_encoder]
    )

    encoded_df = pd.DataFrame(
        encoded,
        columns=loaded_encoder.get_feature_names_out(
            categorical_features_for_encoder
        ),
    )

    # Scale numerical
    scaled = loaded_scaler.transform(
        user_df[numerical_features_model_columns]
    )

    scaled_df = pd.DataFrame(
        scaled,
        columns=numerical_features_model_columns,
    )

    final_df = pd.concat([scaled_df, encoded_df], axis=1)

    final_df = final_df.reindex(columns=MODEL_FEATURES, fill_value=0)

    return final_df


# ===============================
# FastAPI App
# ===============================

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://customer-churn-predictor-eta.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ===============================
# Health Check
# ===============================

@app.get("/")
def health_check():
    return {"status": "healthy", "model_loaded": True}


@app.get("/health")
def detailed_health():
    return {
        "status": "running",
        "model_features_count": len(MODEL_FEATURES),
    }


# ===============================
# Prediction Endpoint
# ===============================

@app.post("/predict", response_model=PredictionResponse)
async def predict_churn(customer_data: CustomerData):
    try:
        processed_input = preprocess_input(customer_data)

        churn_probability = loaded_lgbm_model.predict_proba(
            processed_input
        )[:, 1][0]

        predicted_churn = int(churn_probability >= 0.5)

        if predicted_churn == 1:
            status = "Churn (Likely to leave)"
            risk = "High"
            recommendations = [
                "Offer retention discount.",
                "Contact customer for feedback.",
                "Review pricing structure.",
            ]
        else:
            status = "No Churn (Likely to stay)"
            risk = "Low"
            recommendations = [
                "Monitor satisfaction.",
                "Upsell relevant services.",
                "Reward loyalty.",
            ]

        return PredictionResponse(
            predicted_churn_status=status,
            probability_of_churn=float(churn_probability),
            risk_level=risk,
            recommendations=recommendations,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
