import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { analyzeCateringCost, applyAdjustments, CostData } from "@/lib/aiUtils";

interface AIPredictionBoxProps {
  costData: CostData;
  onApplyChanges: (newCostData: CostData) => void;
}

export default function AIPredictionBox({
  costData,
  onApplyChanges,
}: AIPredictionBoxProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    isReasonable: boolean;
    suggestedAdjustments: {
      laborCostMultiplier?: number;
      materialCostMultiplier?: number;
      profitMargin?: number;
    };
    explanation: string;
  } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeCateringCost(costData);
      setSuggestion(analysis);
      setAnalyzed(true);
      
      // If adjustments are suggested, show the dialog
      if (
        !analysis.isReasonable && 
        (analysis.suggestedAdjustments.laborCostMultiplier !== 1 || 
         analysis.suggestedAdjustments.materialCostMultiplier !== 1 ||
         analysis.suggestedAdjustments.profitMargin !== costData?.profitMargin)
      ) {
        setShowDialog(true);
      }
    } catch (err) {
      setError("Failed to analyze the cost data. Please try again.");
      console.error("Error in AI analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyChanges = () => {
    if (suggestion && suggestion.suggestedAdjustments) {
      const newCostData = applyAdjustments(costData, suggestion.suggestedAdjustments);
      onApplyChanges(newCostData);
      setShowDialog(false);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <div className="border rounded-xl p-4 bg-blue-50/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
            <i className="ri-ai-generate text-lg"></i>
          </div>
          <h3 className="font-medium text-blue-800">AI Price Analysis</h3>
        </div>

        {!analyzed ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Our AI can analyze your calculation and suggest adjustments to make it more accurate based on industry standards.
            </p>
            <Button
              onClick={handleAnalysis}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <i className="ri-magic-line"></i>
                  Analyze with AI
                </div>
              )}
            </Button>
          </div>
        ) : suggestion ? (
          <div>
            <Alert
              className={`mb-3 ${
                suggestion.isReasonable
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-yellow-50 border-yellow-200 text-yellow-800"
              }`}
            >
              <div className="flex gap-2 items-start">
                {suggestion.isReasonable ? (
                  <i className="ri-check-line text-green-600 text-lg mt-0.5"></i>
                ) : (
                  <i className="ri-error-warning-line text-yellow-600 text-lg mt-0.5"></i>
                )}
                <div>
                  <AlertTitle>
                    {suggestion.isReasonable
                      ? "Your calculation looks good!"
                      : "Adjustments suggested!"}
                  </AlertTitle>
                  <AlertDescription className="text-sm mt-1">
                    {suggestion.explanation}
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            {!suggestion.isReasonable && (
              <Button
                onClick={() => setShowDialog(true)}
                variant="outline"
                className="w-full"
              >
                <i className="ri-magic-line mr-2"></i>
                View Suggested Adjustments
              </Button>
            )}

            <div className="mt-3">
              <Button
                onClick={() => {
                  setAnalyzed(false);
                  setSuggestion(null);
                }}
                variant="ghost"
                size="sm"
                className="text-sm"
              >
                <i className="ri-refresh-line mr-1"></i>
                Analyze Again
              </Button>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : null}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suggested Cost Adjustments</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 mt-2">
                <p className="text-gray-700">{suggestion?.explanation}</p>
                
                <div className="bg-gray-50 p-3 rounded-md space-y-2">
                  <h4 className="font-medium text-gray-800">Recommended Changes:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {suggestion?.suggestedAdjustments.laborCostMultiplier && (
                      <li>
                        Labor cost: 
                        <span className={suggestion.suggestedAdjustments.laborCostMultiplier > 1 ? "text-green-600" : "text-red-600"}>
                          {" "}
                          {suggestion.suggestedAdjustments.laborCostMultiplier > 1 ? "+" : ""}
                          {((suggestion.suggestedAdjustments.laborCostMultiplier - 1) * 100).toFixed(0)}%
                        </span>
                        {" "}
                        (₹{costData.laborCost.toLocaleString()} → ₹{Math.round(costData.laborCost * (suggestion.suggestedAdjustments.laborCostMultiplier || 1)).toLocaleString()})
                      </li>
                    )}
                    
                    {suggestion?.suggestedAdjustments.materialCostMultiplier && (
                      <li>
                        Material cost: 
                        <span className={suggestion.suggestedAdjustments.materialCostMultiplier > 1 ? "text-green-600" : "text-red-600"}>
                          {" "}
                          {suggestion.suggestedAdjustments.materialCostMultiplier > 1 ? "+" : ""}
                          {((suggestion.suggestedAdjustments.materialCostMultiplier - 1) * 100).toFixed(0)}%
                        </span>
                        {" "}
                        (₹{costData.materialCost.toLocaleString()} → ₹{Math.round(costData.materialCost * (suggestion.suggestedAdjustments.materialCostMultiplier || 1)).toLocaleString()})
                      </li>
                    )}
                    
                    {suggestion?.suggestedAdjustments.profitMargin && (
                      <li>
                        Profit margin: 
                        <span className={suggestion.suggestedAdjustments.profitMargin > costData.profitMargin ? "text-green-600" : "text-red-600"}>
                          {" "}
                          {suggestion.suggestedAdjustments.profitMargin}%
                        </span>
                        {" "}
                        (from {costData.profitMargin}%)
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApplyChanges}>
              Apply Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}