import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AppShell } from './components/AppShell';
import { MatrixInputCard } from './components/MatrixInputCard';
import { ControlsBar } from './components/ControlsBar';
import { DungeonGrid } from './components/DungeonGrid';
import { ResultPanel } from './components/ResultPanel';
import { useDungeonSimulation } from './hooks/useDungeonSim';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import type { Matrix } from './lib/types';

function App() {
  const [hello, setHello] = useState('');
  const [loading, setLoading] = useState(false);
  const [matrix, setMatrix] = useState<Matrix | null>(null);
  const { result, simulationState, visibleSteps, controls } = useDungeonSimulation(matrix);

  const fetchHello = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/hello');
      const data = await res.json();
      setHello(data.status);
    } catch (error) {
      console.error(error);
      setHello('Erro ao conectar ao backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <section className="space-y-6">
        {/* Input Section */}
        <MatrixInputCard
          matrix={matrix}
          onMatrixChange={setMatrix}
        />

        {!matrix && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Enter a 2D matrix above to visualize the Dungeon Game solution.
              Try loading an example or generating a random matrix to get started.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {matrix && result && (
          <>
            {/* Controls */}
            <ControlsBar
              simulationState={simulationState}
              result={result}
              onPlay={controls.play}
              onPause={controls.pause}
              onReset={controls.reset}
              onNextStep={controls.nextStep}
              onPreviousStep={controls.previousStep}
              onSetSpeed={controls.setSpeed}
              onToggleShowPath={controls.toggleShowPath}
              onGoToStep={controls.goToStep}
            />

            {/* Main Grid and Results */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DungeonGrid
                  matrix={matrix}
                  result={result}
                  visibleSteps={visibleSteps}
                  showPath={simulationState.showPath}
                />
              </div>
              <div>
                <ResultPanel
                  matrix={matrix}
                  result={result}
                  currentStep={simulationState.currentStep}
                />
              </div>
            </div>
          </>
        )}

        <Card className="p-8 w-full max-w-md shadow-lg">
          <h5 className="text-2xl font-bold mb-4">Hello World via API</h5>
          <Button onClick={fetchHello} disabled={loading}>
            {loading ? 'Carregando...' : 'Fazer requisição'}
          </Button>
          {hello && (
            <div className="mt-4 text-lg text-green-700">{hello}</div>
          )}
        </Card>
      </section>

      <Toaster />
    </AppShell>
  );
}

export default App;