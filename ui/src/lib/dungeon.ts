import type { Matrix, DungeonResult, Step, ValidationResult } from './types';

/**
 * Validates a matrix for the dungeon game
 */
export function validateMatrix(matrix: Matrix): ValidationResult {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    return { isValid: false, error: 'Matrix must be a non-empty array' };
  }

  if (matrix.length > 30) {
    return { isValid: false, error: 'Matrix height cannot exceed 30' };
  }

  const cols = matrix[0].length;
  if (cols === 0 || cols > 30) {
    return { isValid: false, error: 'Matrix width must be between 1 and 30' };
  }

  for (let i = 0; i < matrix.length; i++) {
    if (!Array.isArray(matrix[i]) || matrix[i].length !== cols) {
      return { isValid: false, error: 'Matrix must be rectangular (all rows same length)' };
    }

    for (let j = 0; j < matrix[i].length; j++) {
      const value = matrix[i][j];
      if (!Number.isInteger(value)) {
        return { isValid: false, error: `All values must be integers. Found non-integer at [${i}, ${j}]` };
      }
    }
  }

  return { isValid: true };
}

/**
 * Solves the dungeon game using dynamic programming
 */
export function solveDungeon(dungeon: Matrix): DungeonResult {
  const m = dungeon.length;
  const n = dungeon[0].length;

  // Initialize DP table
  const dp: number[][] = Array(m).fill(null).map(() => Array(n).fill(0));
  const steps: Step[] = [];

  // Base case: bottom-right corner
  dp[m - 1][n - 1] = Math.max(1, 1 - dungeon[m - 1][n - 1]);
  steps.push({
    i: m - 1,
    j: n - 1,
    dpValue: dp[m - 1][n - 1],
    from: null
  });

  // Fill last row (can only come from left)
  for (let j = n - 2; j >= 0; j--) {
    const need = dp[m - 1][j + 1] - dungeon[m - 1][j];
    dp[m - 1][j] = Math.max(1, need);
    steps.push({
      i: m - 1,
      j,
      dpValue: dp[m - 1][j],
      from: 'right'
    });
  }

  // Fill last column (can only come from above)
  for (let i = m - 2; i >= 0; i--) {
    const need = dp[i + 1][n - 1] - dungeon[i][n - 1];
    dp[i][n - 1] = Math.max(1, need);
    steps.push({
      i,
      j: n - 1,
      dpValue: dp[i][n - 1],
      from: 'down'
    });
  }

  // Fill the rest of the table
  for (let i = m - 2; i >= 0; i--) {
    for (let j = n - 2; j >= 0; j--) {
      const rightNeed = dp[i][j + 1] - dungeon[i][j];
      const downNeed = dp[i + 1][j] - dungeon[i][j];
      const minNeed = Math.min(rightNeed, downNeed);

      dp[i][j] = Math.max(1, minNeed);

      steps.push({
        i,
        j,
        dpValue: dp[i][j],
        from: rightNeed <= downNeed ? 'right' : 'down',
        decision: rightNeed <= downNeed ? 'right' : 'down'
      });
    }
  }

  // Reconstruct optimal path
  const path: [number, number][] = [];
  let currentI = 0;
  let currentJ = 0;
  path.push([currentI, currentJ]);

  while (currentI < m - 1 || currentJ < n - 1) {
    if (currentI === m - 1) {
      // Can only go right
      currentJ++;
    } else if (currentJ === n - 1) {
      // Can only go down
      currentI++;
    } else {
      // Choose the direction that led to minimum health requirement
      const rightNeed = dp[currentI][currentJ + 1] - dungeon[currentI][currentJ];
      const downNeed = dp[currentI + 1][currentJ] - dungeon[currentI][currentJ];

      if (rightNeed <= downNeed) {
        currentJ++;
      } else {
        currentI++;
      }
    }
    path.push([currentI, currentJ]);
  }

  return {
    dp,
    minInitialHealth: dp[0][0],
    path,
    steps: steps.reverse() // Reverse to show forward progression
  };
}

/**
 * Generates a random matrix for testing
 */
export function generateRandomMatrix(rows: number, cols: number, minValue = -10, maxValue = 5): Matrix {
  const matrix: Matrix = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      row.push(value);
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Predefined test cases
 */
export const TEST_CASES: { name: string; matrix: Matrix; expectedHealth: number }[] = [
  {
    name: 'Classic Example',
    matrix: [[1, -3, 3], [0, -2, 0], [-3, -3, -3]],
    expectedHealth: 3
  },
];