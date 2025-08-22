import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Matrix, DungeonResult, Step } from '../lib/types';

interface DungeonGridProps {
  matrix: Matrix;
  result: DungeonResult;
  visibleSteps: Step[];
  showPath: boolean;
  isLoading?: boolean;
}

interface CellInfo {
  i: number;
  j: number;
  originalValue: number;
  dpValue: number | null;
  isOnPath: boolean;
  isCurrentStep: boolean;
  decision?: 'right' | 'down';
}

export function DungeonGrid({
  matrix,
  result,
  visibleSteps,
  showPath,
  isLoading = false
}: DungeonGridProps) {
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Computing Solution...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}>
            {matrix.flat().map((_, index) => (
              <Skeleton key={index} className="aspect-square" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const rows = matrix.length;
  const cols = matrix[0].length;

  // Make map of visible steps for quick lookup
  const visibleStepsMap = new Map<string, Step>();
  visibleSteps.forEach(step => {
    visibleStepsMap.set(`${step.i},${step.j}`, step);
  });

  // Do a path set for quick lookup
  const pathSet = new Set<string>();
  if (showPath) {
    result.path.forEach(([i, j]) => {
      pathSet.add(`${i},${j}`);
    });
  }

  // Get current step (last visible step)
  const currentStep = visibleSteps[visibleSteps.length - 1];

  // Generate cell information
  const cells: CellInfo[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const key = `${i},${j}`;
      const step = visibleStepsMap.get(key);

      cells.push({
        i,
        j,
        originalValue: matrix[i][j],
        dpValue: step?.dpValue ?? null,
        isOnPath: pathSet.has(key),
        isCurrentStep: currentStep?.i === i && currentStep?.j === j,
        decision: step?.decision
      });
    }
  }

  const getCellColor = (cell: CellInfo) => {
    // Current step highlighting
    if (cell.isCurrentStep) {
      return 'bg-blue-100 border-blue-400 ring-2 ring-blue-300';
    }

    // Path highlighting
    if (cell.isOnPath && showPath) {
      return 'bg-green-50 border-green-300';
    }

    // Value-based coloring
    if (cell.originalValue > 0) {
      return 'bg-emerald-50 border-emerald-200 text-emerald-800';
    } else if (cell.originalValue < 0) {
      return 'bg-red-50 border-red-200 text-red-800';
    } else {
      return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  const getCellContent = (cell: CellInfo) => {
    if (cell.dpValue === null) {
      return (
        <div className="text-center">
          <div className="font-medium">{cell.originalValue}</div>
          <div className="text-xs text-muted-foreground">?</div>
        </div>
      );
    }

    return (
      <div className="text-center relative">
        <div className="font-medium text-sm">{cell.originalValue}</div>
        <div className="text-xs font-mono text-blue-600 bg-blue-100 rounded px-1">
          {cell.dpValue}
        </div>
        {cell.decision && (
          <div className="absolute -top-1 -right-1">
            {cell.decision === 'right' ? (
              <ArrowRight className="h-3 w-3 text-orange-500" />
            ) : (
              <ArrowDown className="h-3 w-3 text-orange-500" />
            )}
          </div>
        )}
      </div>
    );
  };

  const getTooltipContent = (cell: CellInfo) => (
    <div className="space-y-1 text-xs">
      <div className="font-medium">Cell [{cell.i}, {cell.j}]</div>
      <div>Original Value: <span className="font-mono">{cell.originalValue}</span></div>
      {cell.dpValue !== null && (
        <>
          <div>Min Health Required: <span className="font-mono text-blue-600">{cell.dpValue}</span></div>
          {cell.decision && (
            <div>Optimal Move: <span className="capitalize">{cell.decision}</span></div>
          )}
        </>
      )}
      {cell.isOnPath && <div className="text-green-600">✓ On optimal path</div>}
      {cell.isCurrentStep && <div className="text-blue-600">⚡ Current step</div>}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Dungeon Grid Visualization
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {rows} × {cols}
            </Badge>
            {result && (
              <Badge className="bg-green-600">
                Min Health: {result.minInitialHealth}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={300}>
          <div
            className="grid gap-2 mx-auto max-w-fit"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              maxWidth: cols > 8 ? '100%' : 'fit-content'
            }}
          >
            {cells.map((cell, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "relative border-2 rounded-lg p-3 min-h-[60px] flex items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-md",
                      getCellColor(cell),
                      hoveredCell?.[0] === cell.i && hoveredCell?.[1] === cell.j && "scale-105"
                    )}
                    onMouseEnter={() => setHoveredCell([cell.i, cell.j])}
                    onMouseLeave={() => setHoveredCell(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Cell at row ${cell.i}, column ${cell.j}, value ${cell.originalValue}`}
                  >
                    {getCellContent(cell)}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {getTooltipContent(cell)}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Legend */}
        <section className="mt-6 pt-4 border-t">
          <div className="text-sm font-medium mb-2">Legend:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-50 border border-emerald-200 rounded"></div>
              <span>Healing (+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span>Damage (-)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-300 rounded"></div>
              <span>Optimal Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
              <span>Current Step</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Each cell shows: <span className="font-medium">original value</span> (top) and
            <span className="font-medium text-blue-600"> min health required</span> (bottom).
            Arrows indicate optimal movement direction.
          </div>
        </section>
      </CardContent>
    </Card>
  );
}