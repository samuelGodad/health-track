
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NutritionCardProps {
  metrics: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
  onChange: (field: string, value: string) => void;
}

export function NutritionCard({ metrics, onChange }: NutritionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="protein">Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            step="0.1"
            value={metrics.protein}
            onChange={(e) => onChange('protein', e.target.value)}
            placeholder="Enter protein intake"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="carbs">Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            step="0.1"
            value={metrics.carbs}
            onChange={(e) => onChange('carbs', e.target.value)}
            placeholder="Enter carb intake"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fats">Fats (g)</Label>
          <Input
            id="fats"
            type="number"
            step="0.1"
            value={metrics.fats}
            onChange={(e) => onChange('fats', e.target.value)}
            placeholder="Enter fat intake"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            type="number"
            value={metrics.calories}
            onChange={(e) => onChange('calories', e.target.value)}
            placeholder="Enter Macros and your calories will be estimated here"
          />
        </div>
      </CardContent>
    </Card>
  );
}
