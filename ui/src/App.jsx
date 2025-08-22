
import { useState } from 'react';
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";

function App() {
  const [hello, setHello] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Hello World via API</h1>
        <Button onClick={fetchHello} disabled={loading}>
          {loading ? 'Carregando...' : 'Fazer requisição'}
        </Button>
        {hello && (
          <div className="mt-4 text-lg text-green-700">{hello}</div>
        )}
      </Card>
    </div>
  );
}

export default App;
