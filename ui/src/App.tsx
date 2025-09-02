import { useState } from 'react';
import { AppWrapper } from './components/AppShell';
import { DungeonGrid } from './components/DungeonGrid';
import { generateRandomMatrix, EXAMPLE_MATRICES, matrixToJSON } from './utils/matrix';
import "./App.css"
import { SimpleTestPanel } from './components/SimpleTestPanel';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export default function App() {
  const [matrix, setMatrix] = useState<string>('[[0,0,0],[0,0,0],[0,0,0]]');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ minimumHP: number; path: number[][] } | null>({ minimumHP: 0, path: [] });
  const [error, setError] = useState<string | null>(null);

  const handleMatrixSelect = (type: string) => {
    const matrixGenerators: Record<string, () => string> = {
      default: () => matrixToJSON(EXAMPLE_MATRICES.default),
      simple: () => matrixToJSON(EXAMPLE_MATRICES.simple),
      negative: () => matrixToJSON(EXAMPLE_MATRICES.negative),
      mixed: () => matrixToJSON(EXAMPLE_MATRICES.mixed),
      large: () => matrixToJSON(EXAMPLE_MATRICES.large),
      random3x3: () => matrixToJSON(generateRandomMatrix(3, 3)),
      random4x4: () => matrixToJSON(generateRandomMatrix(4, 4)),
      random5x5: () => matrixToJSON(generateRandomMatrix(5, 5)),
    };

    const generator = matrixGenerators[type] || matrixGenerators.default;
    const newMatrix = generator();

    setMatrix(newMatrix);
    setResult({ minimumHP: 0, path: [] });
    setError(null);
  };

  async function handleSolve() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const res = await fetch(`${API_BASE_URL}/dungeon/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: matrix,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setResult(data);

    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      if (errorMessage.includes('aborted') || errorMessage.includes('NetworkError')) {
        setError('⚠️ API unavailable - Using offline mode. Please try again when the connection is restored.');
        // Simulate offline result for demonstration  
        setResult({
          minimumHP: -1,
          path: [[0, 0], [0, 1], [0, 2]]
        });
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppWrapper>
      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Input Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Matrix Input</h2>
          {/* Matrix Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quick Select:</label>
            <select
              className="w-full p-2 border-2 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
              onChange={(e) => handleMatrixSelect(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Choose a matrix...</option>
              <optgroup label="Examples">
                <option value="default">Default (3x3)</option>
                <option value="simple">Simple (3x3)</option>
                <option value="negative">Negative (3x3)</option>
                <option value="mixed">Mixed (3x3)</option>
                <option value="large">Large (5x5)</option>
              </optgroup>
              <optgroup label="Random">
                <option value="random3x3">Random 3x3</option>
                <option value="random4x4">Random 4x4</option>
                <option value="random5x5">Random 5x5</option>
              </optgroup>
              <optgroup label="Zero Matrix">
                <option value="zero3x3">Zero 3x3</option>
              </optgroup>
            </select>
          </div>

          <textarea
            className="w-full h-64 p-4 border-2 rounded-lg bg-white font-mono text-sm resize-none focus:border-blue-500 focus:outline-none"
            value={matrix}
            onChange={e => setMatrix(e.target.value)}
            placeholder="Enter matrix as JSON: [[0,0,0],[0,0,0],[0,0,0]]"
          />
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSolve}
            disabled={loading}
          >
            {loading ? 'Resolvendo...' : 'Resolver'}
          </button>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Grid Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Visualization</h2>
          <DungeonGrid
            matrix={JSON.parse(matrix)}
            minimumHP={result?.minimumHP || 0}
            path={result?.path || []}
          />
        </div>
      </div>

      <section className="flex flex-col items-center mt-8 space-y-3">
        <img
          src="/retro-knight-dungeon.png"
          alt="Dungeon Knight"
          className="w-80 h-auto max-w-[350px] rounded-lg shadow-md"
          loading="lazy"
        />
        <p className="text-sm text-gray-600 text-center">
          Dungeon Knight to test throttle and offline capabilities
        </p>
      </section>
      <SimpleTestPanel />
    </AppWrapper>
  );
}