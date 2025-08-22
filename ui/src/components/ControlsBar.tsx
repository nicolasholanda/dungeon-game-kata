import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from 'lucide-react';
import type { SimulationState, DungeonResult } from '../lib/types';

interface ControlsBarProps {
  simulationState: SimulationState;
  result: DungeonResult | null;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onSetSpeed: (speed: number) => void;
  onToggleShowPath: () => void;
  onGoToStep: (step: number) => void;
}

export function ControlsBar({
  simulationState,
  result,
  onPlay,
  onPause,
  onReset,
  onNextStep,
  onPreviousStep,
  onGoToStep
}: ControlsBarProps) {
  if (!result) return null;

  const { currentStep, isPlaying } = simulationState;
  const totalSteps = result.steps.length;
  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Simulation Progress</Label>
              <Badge variant="outline">
                Step {currentStep + 1} of {totalSteps}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
            <Slider
              value={[currentStep]}
              onValueChange={(value) => onGoToStep(value[0])}
              max={totalSteps - 1}
              step={1}
              className="cursor-pointer"
              aria-label="Go to step"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={currentStep === 0}
              aria-label="Reset to beginning"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousStep}
              disabled={currentStep === 0}
              aria-label="Previous step"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              onClick={isPlaying ? onPause : onPlay}
              disabled={currentStep >= totalSteps - 1 && !isPlaying}
              className="min-w-[100px]"
              aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onNextStep}
              disabled={currentStep >= totalSteps - 1}
              aria-label="Next step"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}