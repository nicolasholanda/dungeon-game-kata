export type Matrix = number[][];

export function generateRandomMatrix(rows: number, cols: number): Matrix {
  const matrix: Matrix = [];

  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      // Generate random values between -10 and 10
      const value = Math.floor(Math.random() * 21) - 10;
      row.push(value);
    }
    matrix.push(row);
  }

  return matrix;
}

// Predefined matrices
export const EXAMPLE_MATRICES = {
  default: [[1, -3, 3], [0, -2, 0], [-3, -3, -3]] as Matrix,
  simple: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] as Matrix,
  negative: [[-1, -2, -3], [-4, -5, -6], [-7, -8, -9]] as Matrix,
  mixed: [[5, -3, 2], [-1, 4, -2], [3, -1, 1]] as Matrix,
  large: [
    [1, -3, 3, 0, -2],
    [0, -2, 0, 1, -1],
    [-3, -3, -3, 2, 0],
    [1, 0, -1, -2, 3],
    [-1, 2, 1, 0, -1]
  ] as Matrix
};

export function matrixToJSON(matrix: Matrix): string {
  return JSON.stringify(matrix);
}

export function parseMatrixFromJSON(jsonString: string): { matrix: Matrix | null; error: string | null } {
  try {
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) {
      return { matrix: null, error: 'Input must be an array' };
    }

    if (parsed.length === 0) {
      return { matrix: null, error: 'Matrix cannot be empty' };
    }

    if (!Array.isArray(parsed[0])) {
      return { matrix: null, error: 'Matrix must be a 2D array' };
    }

    const cols = parsed[0].length;
    if (cols === 0) {
      return { matrix: null, error: 'Matrix rows cannot be empty' };
    }

    // Check if all rows have the same length
    for (let i = 0; i < parsed.length; i++) {
      if (!Array.isArray(parsed[i]) || parsed[i].length !== cols) {
        return { matrix: null, error: 'All matrix rows must have the same length' };
      }

      // Check if all elements are numbers
      for (let j = 0; j < parsed[i].length; j++) {
        if (typeof parsed[i][j] !== 'number') {
          return { matrix: null, error: 'All matrix elements must be numbers' };
        }
      }
    }

    return { matrix: parsed, error: null };
  } catch {
    return { matrix: null, error: 'Invalid JSON format' };
  }
}

export function validateMatrixDimensions(matrix: Matrix, maxRows = 30, maxCols = 30): string | null {
  if (matrix.length > maxRows) {
    return `Matrix cannot have more than ${maxRows} rows`;
  }

  if (matrix[0].length > maxCols) {
    return `Matrix cannot have more than ${maxCols} columns`;
  }

  return null;
}
