export type Matrix = number[][];

export interface Step {
  i: number;
  j: number;
  dpValue: number;
  from: 'right' | 'down' | null;
  decision?: 'right' | 'down';
}

export interface DungeonResult {
  dp: number[][];
  minInitialHealth: number;
  path: [number, number][];
  steps: Step[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface SimulationState {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  showPath: boolean;
}