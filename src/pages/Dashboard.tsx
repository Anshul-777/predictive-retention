import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { predictChurn, CustomerFormData } from "@/services/predictionApi";
import { useToast } from "@/hooks/use-toast";
import ChurnGauge from "@/components/ChurnGauge";
import RiskBadge from "@/components/RiskBadge";
import InsightsCard from "@/components/InsightsCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Users,
  CreditCard,
  Globe,
  Shield,
  HelpCircle,
  Save,
  RotateCcw,
  Sparkles,
  TrendingDown,
} from "lucide-react";

// Schema
const formSchema = z.object({
  gender: z.string().min(1, "Required"),
  seniorCitizen: z.number(),
  partner: z.string().min(1, "Required"),
  dependents: z.string().min(1, "Required"),
  tenure: z.number().min(0).max(72),
  contract: z.string().min(1, "Required"),
  paymentMethod: z.string().min(1, "Required"),
  paperlessBilling: z.string().min(1, "Required"),
  monthlyCharges: z.number().min(0),
  phoneService: z.string().min(1, "Required"),
  multipleLines: z.string().min(1, "Required"),
  internetService: z.string().min(1, "Required"),
  onlineSecurity: z.string().min(1, "Required"),
  onlineBackup: z.string().min(1, "Required"),
  deviceProtection: z.string().min(1, "Required"),
  techSupport: z.string().min(1, "Required"),
  streamingTV: z.string().min(1, "Required"),
  streamingMovies: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  gender: "Male",
  seniorCitizen: 0,
  partner: "No",
  dependents: "No",
  tenure: 0,
  contract: "Month-to-month",
  paymentMethod: "Electronic check",
  paperlessBilling: "No",
  monthlyCharges: 0,
  phoneService: "No",
  multipleLines: "No",
  internetService: "No",
  onlineSecurity: "No",
  onlineBackup: "No",
  deviceProtection: "No",
  techSupport: "No",
  streamingTV: "No",
  streamingMovies: "No",
};

// Info tooltip descriptions for model expectations
const fieldInfo: Record<string, string> = {
  gender: "Model expects: 'Male' or 'Female'. Slight correlation with churn patterns in the training data.",
  seniorCitizen: "Model expects: 0 (No) or 1 (Yes). Senior citizens (65+) show ~42% churn rate vs ~24% for non-seniors.",
  partner: "Model expects: 'Yes' or 'No'. Having a partner reduces churn probability by ~13%.",
  dependents: "Model expects: 'Yes' or 'No'. Customers with dependents churn ~15% less than those without.",
  tenure: "Model expects: 0-72 months. Customers with <12 months tenure have 3x higher churn risk.",
  contract: "Model expects: 'Month-to-month', 'One year', or 'Two year'. Month-to-month has ~43% churn vs ~3% for two-year.",
  paymentMethod: "Model expects: 'Electronic check', 'Mailed check', 'Bank transfer (automatic)', or 'Credit card (automatic)'. Electronic check users churn ~45%.",
  paperlessBilling: "Model expects: 'Yes' or 'No'. Paperless billing customers churn slightly more (~34% vs ~25%).",
  monthlyCharges: "Model expects: $18-$120. Higher charges correlate with increased churn risk.",
  phoneService: "Model expects: 'Yes' or 'No'. Basic phone service has minimal impact on churn.",
  multipleLines: "Model expects: 'Yes', 'No', or 'No phone service'. Marginal impact on churn prediction.",
  internetService: "Model expects: 'DSL', 'Fiber optic', or 'No'. Fiber optic has highest churn (~42%) due to pricing.",
  onlineSecurity: "Model expects: 'Yes', 'No', or 'No internet service'. No online security = higher churn risk.",
  onlineBackup: "Model expects: 'Yes', 'No', or 'No internet service'. Online backup slightly reduces churn.",
  deviceProtection: "Model expects: 'Yes', 'No', or 'No internet service'. Adds stickiness to subscription.",
  techSupport: "Model expects: 'Yes', 'No', or 'No internet service'. No tech support = ~42% churn rate.",
  streamingTV: "Model expects: 'Yes', 'No', or 'No internet service'. Increases engagement.",
  streamingMovies: "Model expects: 'Yes', 'No', or 'No internet service'. Increases perceived subscription value.",
};

// Info tooltip component with 3-second auto-hide
function FieldInfoTip({ fieldKey }: { fieldKey: string }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdingRef = useRef(false);

  const show = useCallback(() => {
    setVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!holdingRef.current) setVisible(false);
    }, 3000);
  }, []);

  const handleMouseDown = () => {
    holdingRef.current = true;
    setVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMouseUp = () => {
    holdingRef.current = false;
    timeoutRef.current = setTimeout(() => setVisible(false), 500);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!holdingRef.current) show();
  };

  return (
    <span className="relative inline-block ml-1.5">
      <button
        type="button"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className="text-muted-foreground hover:text-primary transition-colors cursor-help"
        aria-label="Field info"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {visible && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg animate-fade-slide-up"
          style={{ animation: "fadeSlideUp 0.2s ease both" }}
        >
          {fieldInfo[fieldKey]}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-2 h-2 rotate-45 bg-popover border-r border-b border-border" />
          </div>
        </div>
      )}
    </span>
  );
}

function SelectField({
  label,
  fieldKey,
  options,
  value,
  onChange,
}: {
  label: string;
  fieldKey: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground flex items-center">
        {label}
        <FieldInfoTip fieldKey={fieldKey} />
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Session ID
function getSessionId() {
  let id = sessionStorage.getItem("churn_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("churn_session_id", id);
  }
  return id;
}

interface PredictionResult {
  churn_probability: number;
  predicted_churn: boolean;
  predicted_churn_status: string;
  risk_level: "Low" | "Medium" | "High";
  recommendations: string[];
}

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [savedFormData, setSavedFormData] = useState<CustomerFormData | null>(null);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Wake up Render backend on mount
  useEffect(() => {
    fetch("https://customer-churn-predictor-zdez.onrender.com/docs", { mode: "no-cors" }).catch(() => {});
  }, []);

  // Check for reload data from history
  useEffect(() => {
    const reloadData = sessionStorage.getItem("reload_prediction");
    if (reloadData) {
      try {
        const parsed = JSON.parse(reloadData);
        reset(parsed);
        sessionStorage.removeItem("reload_prediction");
        toast({ title: "Customer data loaded", description: "Form pre-filled from history." });
      } catch {}
    }
  }, [reset, toast]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictChurn(values as CustomerFormData);
      setPrediction(result);
      setSavedFormData(values as CustomerFormData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to connect to prediction API.";
      toast({ title: "Prediction Failed", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prediction || !savedFormData) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("churn_predictions").insert({
        session_id: getSessionId(),
        gender: savedFormData.gender,
        senior_citizen: savedFormData.seniorCitizen,
        partner: savedFormData.partner,
        dependents: savedFormData.dependents,
        tenure: savedFormData.tenure,
        contract: savedFormData.contract,
        payment_method: savedFormData.paymentMethod,
        paperless_billing: savedFormData.paperlessBilling,
        monthly_charges: savedFormData.monthlyCharges,
        phone_service: savedFormData.phoneService,
        multiple_lines: savedFormData.multipleLines,
        internet_service: savedFormData.internetService,
        online_security: savedFormData.onlineSecurity,
        online_backup: savedFormData.onlineBackup,
        device_protection: savedFormData.deviceProtection,
        tech_support: savedFormData.techSupport,
        streaming_tv: savedFormData.streamingTV,
        streaming_movies: savedFormData.streamingMovies,
        churn_probability: prediction.churn_probability,
        predicted_churn_status: prediction.risk_level,
        total_charges: savedFormData.tenure * savedFormData.monthlyCharges,
      });
      if (error) throw error;
      toast({ title: "Prediction Saved!", description: "View it in the History tab." });
    } catch (err) {
      toast({ title: "Save Failed", description: "Could not save to database.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const tenureValue = watch("tenure");
  const monthlyChargesValue = watch("monthlyCharges");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Churn Predictor
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Fill in the customer profile below to generate an instant churn probability score.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-slide-up">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left Panel: Input Form */}
            <div className="w-full lg:w-[58%] space-y-4">
              <Accordion type="multiple" defaultValue={["demographics", "account", "services", "addons"]}>
                {/* Demographics */}
                <AccordionItem value="demographics" className="border border-border rounded-xl overflow-hidden mb-4 shadow-sm">
                  <Card className="border-0 shadow-none">
                    <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                      <CardHeader className="p-0 flex-row items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-base">Demographics</CardTitle>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-0 pb-6 px-4 sm:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Controller name="gender" control={control} render={({ field }) => (
                            <SelectField label="Gender" fieldKey="gender" options={["Male", "Female"]} value={field.value} onChange={field.onChange} />
                          )} />
                          <Controller name="partner" control={control} render={({ field }) => (
                            <SelectField label="Has a Partner?" fieldKey="partner" options={["Yes", "No"]} value={field.value} onChange={field.onChange} />
                          )} />
                          <Controller name="dependents" control={control} render={({ field }) => (
                            <SelectField label="Has Dependents?" fieldKey="dependents" options={["Yes", "No"]} value={field.value} onChange={field.onChange} />
                          )} />
                          <Controller name="seniorCitizen" control={control} render={({ field }) => (
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium text-foreground flex items-center">
                                Senior Citizen?
                                <FieldInfoTip fieldKey="seniorCitizen" />
                              </Label>
                              <div className="flex items-center gap-3 h-9">
                                <Switch checked={field.value === 1} onCheckedChange={(v) => field.onChange(v ? 1 : 0)} />
                                <span className="text-sm text-muted-foreground">{field.value === 1 ? "Yes" : "No"}</span>
                              </div>
                            </div>
                          )} />
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* Account Info */}
                <AccordionItem value="account" className="border border-border rounded-xl overflow-hidden mb-4 shadow-sm">
                  <Card className="border-0 shadow-none">
                    <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                      <CardHeader className="p-0 flex-row items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-base">Account Info</CardTitle>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-0 pb-6 px-4 sm:px-6 space-y-5">
                        <Controller name="tenure" control={control} render={({ field }) => (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm font-medium text-foreground flex items-center">
                                Tenure (months)
                                <FieldInfoTip fieldKey="tenure" />
                              </Label>
                              <span className="text-sm font-semibold text-primary tabular-nums">{tenureValue} mo</span>
                            </div>
                            <Slider min={0} max={72} step={1} value={[field.value]} onValueChange={([v]) => field.onChange(v)} className="w-full" />
                            <div className="flex justify-between text-xs text-muted-foreground"><span>0 months</span><span>72 months</span></div>
                          </div>
                        )} />

                        <Controller name="monthlyCharges" control={control} render={({ field }) => (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm font-medium text-foreground flex items-center">
                                Monthly Charges ($)
                                <FieldInfoTip fieldKey="monthlyCharges" />
                              </Label>
                              <span className="text-sm font-semibold text-primary tabular-nums">${monthlyChargesValue}</span>
                            </div>
                            <Slider min={0} max={120} step={1} value={[field.value]} onValueChange={([v]) => field.onChange(v)} className="w-full" />
                            <div className="flex justify-between text-xs text-muted-foreground"><span>$0</span><span>$120</span></div>
                          </div>
                        )} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Controller name="contract" control={control} render={({ field }) => (
                            <SelectField label="Contract Type" fieldKey="contract" options={["Month-to-month", "One year", "Two year"]} value={field.value} onChange={field.onChange} />
                          )} />
                          <Controller name="paymentMethod" control={control} render={({ field }) => (
                            <SelectField label="Payment Method" fieldKey="paymentMethod" options={["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"]} value={field.value} onChange={field.onChange} />
                          )} />
                          <Controller name="paperlessBilling" control={control} render={({ field }) => (
                            <SelectField label="Paperless Billing?" fieldKey="paperlessBilling" options={["Yes", "No"]} value={field.value} onChange={field.onChange} />
                          )} />
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* Services */}
                <AccordionItem value="services" className="border border-border rounded-xl overflow-hidden mb-4 shadow-sm">
                  <Card className="border-0 shadow-none">
                    <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                      <CardHeader className="p-0 flex-row items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-base">Services</CardTitle>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-0 pb-6 px-4 sm:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Controller name="phoneService" control={control} render={({ field }) => (
                            <SelectField label="Phone Service?" fieldKey="phoneService" options={["Yes", "No"]} value={field.value} onChange={field.onChange} />
                          )} />
                          <Controller name="multipleLines" control={control} render={({ field }) => (
                            <SelectField label="Multiple Lines?" fieldKey="multipleLines" options={["Yes", "No", "No phone service"]} value={field.value} onChange={field.onChange} />
                          )} />
                          <Controller name="internetService" control={control} render={({ field }) => (
                            <SelectField label="Internet Service" fieldKey="internetService" options={["DSL", "Fiber optic", "No"]} value={field.value} onChange={field.onChange} />
                          )} />
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>

                {/* Add-ons */}
                <AccordionItem value="addons" className="border border-border rounded-xl overflow-hidden shadow-sm">
                  <Card className="border-0 shadow-none">
                    <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                      <CardHeader className="p-0 flex-row items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-base">Add-on Services</CardTitle>
                      </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-0 pb-6 px-4 sm:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {([
                            { name: "onlineSecurity" as const, label: "Online Security" },
                            { name: "onlineBackup" as const, label: "Online Backup" },
                            { name: "deviceProtection" as const, label: "Device Protection" },
                            { name: "techSupport" as const, label: "Tech Support" },
                            { name: "streamingTV" as const, label: "Streaming TV" },
                            { name: "streamingMovies" as const, label: "Streaming Movies" },
                          ]).map(({ name, label }) => (
                            <Controller key={name} name={name} control={control} render={({ field }) => (
                              <SelectField label={label} fieldKey={name} options={["Yes", "No", "No internet service"]} value={field.value} onChange={field.onChange} />
                            )} />
                          ))}
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>

              {/* Form actions */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isLoading} className="flex-1 h-11 text-base font-semibold" style={{ boxShadow: "var(--shadow-elevated)" }}>
                  {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Analyzing...</>) : (<><Sparkles className="h-4 w-4" />Run Prediction</>)}
                </Button>
                <Button type="button" variant="outline" className="h-11 px-4" onClick={() => { reset(defaultValues); setPrediction(null); }}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Panel: Prediction Results */}
            <div className="w-full lg:w-[42%] lg:sticky lg:top-24">
              <Card className="border shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Prediction Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-8 px-4 sm:px-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full border-4 border-accent" />
                        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Running LGBM model...</p>
                    </div>
                  ) : prediction ? (
                    <div className="space-y-8">
                      {/* Gauge */}
                      <div className="flex justify-center py-2">
                        <ChurnGauge probability={prediction.churn_probability} size={220} />
                      </div>

                      {/* Risk badge + summary */}
                      <div className="text-center space-y-3 py-2">
                        <RiskBadge level={prediction.risk_level} size="lg" />
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                          {prediction.risk_level === "High"
                            ? "Immediate action recommended to prevent churn."
                            : prediction.risk_level === "Medium"
                            ? "Monitor closely and engage proactively."
                            : "Customer appears stable. Focus on growth opportunities."}
                        </p>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-secondary p-4 text-center">
                          <div className="text-xs text-muted-foreground mb-1.5">Churn Probability</div>
                          <div className="text-2xl font-bold text-foreground">
                            {(prediction.churn_probability * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="rounded-xl bg-secondary p-4 text-center">
                          <div className="text-xs text-muted-foreground mb-1.5">Prediction</div>
                          <div className="text-sm font-bold text-foreground leading-tight mt-1">
                            {prediction.predicted_churn ? "Likely to Leave" : "Likely to Stay"}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-border" />

                      {/* Insights */}
                      <InsightsCard
                        probability={prediction.churn_probability}
                        riskLevel={prediction.risk_level}
                        recommendations={prediction.recommendations}
                      />

                      {/* Save button */}
                      <Button className="w-full h-11" variant="outline" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save to History
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center">
                        <TrendingDown className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">No prediction yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Fill in the customer profile and click{" "}
                          <span className="font-medium text-primary">Run Prediction</span>
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
