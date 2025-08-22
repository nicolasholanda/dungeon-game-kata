import type { Matrix } from './types';
import { validateMatrix } from './dungeon';

/**
 * Parses a JSON string into a matrix
 */
export function parseMatrixFromJSON(jsonString: string): { matrix: Matrix | null; error: string | null } {
  try {
    const parsed = JSON.parse(jsonString.trim());

    if (!Array.isArray(parsed)) {
      return { matrix: null, error: 'Input must be a 2D array' };
    }

    const matrix = parsed as Matrix;
    const validation = validateMatrix(matrix);

    if (!validation.isValid) {
      return { matrix: null, error: validation.error || 'Invalid matrix' };
    }

    return { matrix, error: null };
  } catch (error) {
    console.error(error);
    return { matrix: null, error: 'Invalid JSON format' };
  }
}

/**
 * Converts a matrix to JSON string
 */
export function matrixToJSON(matrix: Matrix): string {
  return JSON.stringify(matrix, null, 2);
}