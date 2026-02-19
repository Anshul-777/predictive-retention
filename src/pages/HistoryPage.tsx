import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RiskBadge from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  Search,
  ArrowUpDown,
  ExternalLink,
  RefreshCw,
  Loader2,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";

interface PredictionRow {
  id: string;
  gender: string;
  tenure: number;
  contract: string;
  internet_service: string;
  monthly_charges: number;
  churn_probability: number;
  predicted_churn_status: string;
  prediction_timestamp: string;
  // All other fields for reload
  senior_citizen: number;
  partner: string;
  dependents: string;
  payment_method: string;
  paperless_billing: string;
  phone_service: string;
  multiple_lines: string;
  online_security: string;
  online_backup: string;
  device_protection: string;
  tech_support: string;
  streaming_tv: string;
  streaming_movies: string;
}

type SortField = "prediction_timestamp" | "churn_probability" | "tenure";
type SortDir = "asc" | "desc";

export default function HistoryPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rows, setRows] = useState<PredictionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField>("prediction_timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchRows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("churn_predictions")
        .select("*")
        .order(sortField, { ascending: sortDir === "asc" })
        .limit(200);
      if (error) throw error;
      setRows((data as PredictionRow[]) ?? []);
    } catch {
      toast({ title: "Failed to load history", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleReload = (row: PredictionRow) => {
    const reloadData = {
      gender: row.gender,
      seniorCitizen: row.senior_citizen,
      partner: row.partner,
      dependents: row.dependents,
      tenure: row.tenure,
      contract: row.contract,
      paymentMethod: row.payment_method,
      paperlessBilling: row.paperless_billing,
      monthlyCharges: row.monthly_charges ?? 65,
      phoneService: row.phone_service,
      multipleLines: row.multiple_lines,
      internetService: row.internet_service,
      onlineSecurity: row.online_security,
      onlineBackup: row.online_backup,
      deviceProtection: row.device_protection,
      techSupport: row.tech_support,
      streamingTV: row.streaming_tv,
      streamingMovies: row.streaming_movies,
    };
    sessionStorage.setItem("reload_prediction", JSON.stringify(reloadData));
    navigate("/dashboard");
  };

  const getRiskLevel = (status: string): "Low" | "Medium" | "High" => {
    if (status === "High") return "High";
    if (status === "Medium") return "Medium";
    return "Low";
  };

  const filtered = rows.filter((r) => {
    const matchesSearch =
      r.contract?.toLowerCase().includes(search.toLowerCase()) ||
      r.internet_service?.toLowerCase().includes(search.toLowerCase()) ||
      r.gender?.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "All" || r.predicted_churn_status === riskFilter;
    return matchesSearch && matchesRisk;
  });

  // Summary stats
  const highRiskCount = rows.filter((r) => r.predicted_churn_status === "High").length;
  const avgProbability =
    rows.length > 0
      ? rows.reduce((sum, r) => sum + (r.churn_probability ?? 0), 0) / rows.length
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              Prediction History
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse all past churn predictions. Click any row to reload inputs into the dashboard.
            </p>
          </div>
          <Button variant="outline" onClick={fetchRows} disabled={isLoading} className="shrink-0">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Predictions</p>
                  <p className="text-2xl font-bold text-foreground">{rows.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--churn-high-bg))" }}>
                  <AlertTriangle className="h-5 w-5" style={{ color: "hsl(var(--churn-high))" }} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold text-foreground">{highRiskCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--churn-low-bg))" }}>
                  <CheckCircle2 className="h-5 w-5" style={{ color: "hsl(var(--churn-low))" }} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Churn Score</p>
                  <p className="text-2xl font-bold text-foreground">
                    {(avgProbability * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by contract, internet service, gender..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Risk Levels</SelectItem>
              <SelectItem value="High">High Risk</SelectItem>
              <SelectItem value="Medium">Medium Risk</SelectItem>
              <SelectItem value="Low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-muted-foreground">Loading predictions...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <History className="h-12 w-12 text-muted-foreground/40" />
                <p className="font-medium text-foreground">No predictions found</p>
                <p className="text-sm text-muted-foreground">
                  {rows.length === 0
                    ? "Run your first prediction from the Dashboard and save it."
                    : "No results match your current filters."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead
                      className="cursor-pointer hover:text-foreground select-none"
                      onClick={() => handleSort("prediction_timestamp")}
                    >
                      <span className="flex items-center gap-1">
                        Date <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-foreground select-none"
                      onClick={() => handleSort("tenure")}
                    >
                      <span className="flex items-center gap-1">
                        Tenure <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Internet</TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-foreground select-none"
                      onClick={() => handleSort("churn_probability")}
                    >
                      <span className="flex items-center gap-1">
                        Score <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleReload(row)}
                    >
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(row.prediction_timestamp), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-sm">{row.gender}</TableCell>
                      <TableCell className="text-sm tabular-nums">{row.tenure} mo</TableCell>
                      <TableCell className="text-sm">{row.contract}</TableCell>
                      <TableCell className="text-sm">{row.internet_service}</TableCell>
                      <TableCell className="text-sm font-semibold tabular-nums">
                        {row.churn_probability != null
                          ? `${(row.churn_probability * 100).toFixed(1)}%`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={getRiskLevel(row.predicted_churn_status)} size="sm" />
                      </TableCell>
                      <TableCell>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {filtered.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3 text-right">
            Showing {filtered.length} of {rows.length} predictions
          </p>
        )}
      </div>
    </div>
  );
}
