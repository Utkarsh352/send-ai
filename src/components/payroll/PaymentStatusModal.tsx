"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { PayrollSession } from "@/lib/clearnode";

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: PayrollSession | null;
  employeeName?: string;
}

export function PaymentStatusModal({
  isOpen,
  onClose,
  session,
  employeeName
}: PaymentStatusModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Initializing Payment",
      description: "Creating state channel session",
      duration: 2000,
    },
    {
      title: "Connecting to Yellow Network",
      description: "Establishing secure connection",
      duration: 3000,
    },
    {
      title: "Processing Payment",
      description: "Transferring funds via state channels",
      duration: 5000,
    },
    {
      title: "Finalizing Transaction",
      description: "Closing session and updating balances",
      duration: 2000,
    },
    {
      title: "Payment Complete",
      description: "Funds successfully transferred",
      duration: 0,
    }
  ];

  // Simulate payment processing steps
  useEffect(() => {
    if (!isOpen || !session || session.status === 'completed' || session.status === 'failed') {
      return;
    }

    if (session.status === 'processing') {
      let stepIndex = 0;
      let progressValue = 0;

      const processSteps = () => {
        if (stepIndex >= steps.length - 1) {
          setProgress(100);
          setCurrentStep(steps.length - 1);
          return;
        }

        setCurrentStep(stepIndex);
        const step = steps[stepIndex];
        const stepProgress = (stepIndex / (steps.length - 1)) * 100;

        // Animate progress for current step
        const progressInterval = setInterval(() => {
          progressValue += 2;
          const currentStepProgress = stepProgress + (progressValue / 50) * (100 / (steps.length - 1));
          setProgress(Math.min(currentStepProgress, (stepIndex + 1) / (steps.length - 1) * 100));

          if (progressValue >= 50) {
            clearInterval(progressInterval);
            progressValue = 0;
            stepIndex++;
            setTimeout(processSteps, 500);
          }
        }, step.duration / 50);
      };

      processSteps();
    }
  }, [isOpen, session]);

  const getStatusIcon = (status: PayrollSession['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: PayrollSession['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatAmount = (amount: string, asset: string) => {
    const numAmount = parseFloat(amount);
    if (asset.toLowerCase() === 'usdc' || asset.toLowerCase() === 'usdt') {
      return `$${(numAmount / 1_000_000).toLocaleString()}`;
    }
    return `${(numAmount / 1e18).toFixed(4)} ${asset.toUpperCase()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {session && getStatusIcon(session.status)}
            Payment Status
          </DialogTitle>
          <DialogDescription>
            {employeeName && `Processing payment to ${employeeName}`}
          </DialogDescription>
        </DialogHeader>

        {session && (
          <div className="space-y-6">
            {/* Payment Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold">
                  {formatAmount(session.amount, session.asset)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Asset</span>
                <Badge variant="outline">
                  {session.asset.toUpperCase()}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={getStatusColor(session.status)}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Session ID</span>
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                  {session.sessionId.slice(0, 8)}...{session.sessionId.slice(-6)}
                </span>
              </div>
            </div>

            {/* Progress Indicator */}
            {session.status === 'processing' && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />

                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        index === currentStep
                          ? 'bg-blue-50 border border-blue-200'
                          : index < currentStep
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : index === currentStep ? (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}

                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completion Message */}
            {session.status === 'completed' && (
              <div className="text-center space-y-3 p-6 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <p className="font-semibold text-green-800">Payment Successful!</p>
                  <p className="text-sm text-green-600">
                    Funds transferred via Yellow Network state channels
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-green-600">
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    ⚡ Instant Settlement
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    🚫 Zero Gas Fees
                  </Badge>
                </div>
              </div>
            )}

            {/* Error Message */}
            {session.status === 'failed' && (
              <div className="text-center space-y-3 p-6 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                <div>
                  <p className="font-semibold text-red-800">Payment Failed</p>
                  <p className="text-sm text-red-600">
                    The payment could not be processed. Please try again.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {session.status === 'completed' && (
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Transaction
                </Button>
              )}
              <Button
                onClick={onClose}
                variant={session.status === 'processing' ? 'outline' : 'default'}
                className="flex-1"
              >
                {session.status === 'processing' ? 'Close' : 'Done'}
              </Button>
            </div>

            {/* Technical Details */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Started: {new Date(session.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(session.lastUpdated).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}