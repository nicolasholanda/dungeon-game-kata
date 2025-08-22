import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, AlertCircle, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseMatrixFromJSON, matrixToJSON } from '../lib/parse';
import { generateRandomMatrix } from '../lib/dungeon';
import type { Matrix } from '../lib/types';

interface MatrixInputCardProps {
  matrix: Matrix | null;
  onMatrixChange: (matrix: Matrix | null) => void;
}

export function MatrixInputCard({ matrix, onMatrixChange }: MatrixInputCardProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (value: string) => {
    setInput(value);
    setError(null);

    if (value.trim() === '') {
      onMatrixChange(null);
      return;
    }

    const { matrix: parsedMatrix, error: parseError } = parseMatrixFromJSON(value);

    if (parseError) {
      setError(parseError);
      onMatrixChange(null);
    } else {
      onMatrixChange(parsedMatrix);
    }
  };

  const loadExample = (exampleMatrix: Matrix) => {
    const jsonString = matrixToJSON(exampleMatrix);
    setInput(jsonString);
    handleInputChange(jsonString);
  };

  const generateRandom = (rows: number, cols: number) => {
    const randomMatrix = generateRandomMatrix(rows, cols);
    const jsonString = matrixToJSON(randomMatrix);
    setInput(jsonString);
    handleInputChange(jsonString);
  };

  const clearInput = () => {
    setInput('');
    setError(null);
    onMatrixChange(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      handleInputChange(content);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleCopy = async () => {
    if (!matrix) {
      toast({
        title: "No matrix to copy",
        description: "Please enter a valid matrix first.",
        variant: "destructive"
      });
      return;
    }

    const success = await copyToClipboard(matrixToJSON(matrix));
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Matrix copied",
        description: "The matrix has been copied to your clipboard."
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Could not copy matrix to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Matrix Input
          {matrix && (
            <Badge variant="secondary">
              {matrix.length} × {matrix[0].length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Enter your dungeon matrix as a 2D JSON array. Maximum size: 30×30.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="matrix-input">Matrix (JSON format)</Label>
          <Textarea
            id="matrix-input"
            placeholder="[[1,-3,3],[0,-2,0],[-3,-3,-3]]"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="font-mono text-sm min-h-[120px]"
            aria-describedby={error ? "matrix-error" : undefined}
          />
        </div>

        {error && (
          <Alert variant="destructive" id="matrix-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div>
            <Label className="text-sm font-medium">Generate Random:</Label>
            <Select onValueChange={(value) => {
              const [rows, cols] = value.split('x').map(Number);
              generateRandom(rows, cols);
            }}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Size..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3x3">3×3</SelectItem>
                <SelectItem value="4x4">4×4</SelectItem>
                <SelectItem value="5x5">5×5</SelectItem>
                <SelectItem value="6x8">6×8</SelectItem>
                <SelectItem value="8x6">8×6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={clearInput}
            className="mt-6"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <div className="hidden">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              id="file-upload"
            />
          </div>


          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!matrix}
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}