import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Matrix, DungeonResult, SimulationState } from '../lib/types';
import { solveDungeon } from '../lib/dungeon';

export function useDungeonSimulation(matrix: Matrix | null) {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    currentStep: 0,
    isPlaying: false,
    speed: 500, // milliseconds between steps
    showPath: true
  });

  // Solve the dungeon when matrix changes
  const result: DungeonResult | null = useMemo(() => {
    if (!matrix) return null;
    return solveDungeon(matrix);
  }, [matrix]);

  // Auto-play functionality
  useEffect(() => {
    if (!simulationState.isPlaying || !result) return;

    const interval = setInterval(() => {
      setSimulationState(prev => {
        if (prev.currentStep >= result.steps.length - 1) {
          return { ...prev, isPlaying: false };
        }
        return { ...prev, currentStep: prev.currentStep + 1 };
      });
    }, simulationState.speed);

    return () => clearInterval(interval);
  }, [simulationState.isPlaying, simulationState.speed, result]);

  const play = useCallback(() => {
    if (!result) return;
    setSimulationState(prev => ({ ...prev, isPlaying: true }));
  }, [result]);

  const pause = useCallback(() => {
    setSimulationState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    setSimulationState(prev => ({
      ...prev,
      currentStep: 0,
      isPlaying: false
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (!result) return;
    setSimulationState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, result.steps.length - 1),
      isPlaying: false
    }));
  }, [result]);

  const previousStep = useCallback(() => {
    setSimulationState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      isPlaying: false
    }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setSimulationState(prev => ({ ...prev, speed }));
  }, []);

  const toggleShowPath = useCallback(() => {
    setSimulationState(prev => ({ ...prev, showPath: !prev.showPath }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (!result) return;
    setSimulationState(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, result.steps.length - 1)),
      isPlaying: false
    }));
  }, [result]);

  // Current visible steps (all steps up to current step)
  const visibleSteps = useMemo(() => {
    if (!result) return [];
    return result.steps.slice(0, simulationState.currentStep + 1);
  }, [result, simulationState.currentStep]);

  return {
    result,
    simulationState,
    visibleSteps,
    controls: {
      play,
      pause,
      reset,
      nextStep,
      previousStep,
      setSpeed,
      toggleShowPath,
      goToStep
    }
  };
}