import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import type { DungeonResult, Matrix } from '../lib/types';

interface ResultPanelProps {
  matrix: Matrix;
  result: DungeonResult;
  currentStep: number;
}

export function ResultPanel({ result }: ResultPanelProps) {

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Solution
          </CardTitle>
          <CardDescription>
            Minimum initial health required to survive the dungeon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {result.minInitialHealth}
            </div>
            <div className="text-sm text-muted-foreground">
              Health Points Required
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}