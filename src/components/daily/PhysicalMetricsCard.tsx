
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhysicalMetricsCardProps {
  metrics: {
    weight: string;
    systolicBP: string;
    diastolicBP: string;
    steps: string;
    totalSleep: string;
    restingHeartRate: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PhysicalMetricsCard({ metrics, onChange }: PhysicalMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Physical Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={metrics.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            placeholder="Enter weight"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="systolic">Systolic BP</Label>
            <Input
              id="systolic"
              type="number"
              value={metrics.systolicBP}
              onChange={(e) => onChange('systolicBP', e.target.value)}
              placeholder="120"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diastolic">Diastolic BP</Label>
            <Input
              id="diastolic"
              type="number"
              value={metrics.diastolicBP}
              onChange={(e) => onChange('diastolicBP', e.target.value)}
              placeholder="80"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="steps">Step Count</Label>
          <Input
            id="steps"
            type="number"
            value={metrics.steps}
            onChange={(e) => onChange('steps', e.target.value)}
            placeholder="Enter step count"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalSleep">Total Sleep (hours)</Label>
          <Input
            id="totalSleep"
            type="number"
            step="0.1"
            value={metrics.totalSleep}
            onChange={(e) => onChange('totalSleep', e.target.value)}
            placeholder="e.g. 7.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="restingHeartRate">Resting Heart Rate (bpm)</Label>
          <Input
            id="restingHeartRate"
            type="number"
            value={metrics.restingHeartRate}
            onChange={(e) => onChange('restingHeartRate', e.target.value)}
            placeholder="e.g. 55"
          />
        </div>
      </CardContent>
    </Card>
  );
}
