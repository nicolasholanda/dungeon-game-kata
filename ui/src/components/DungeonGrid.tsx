interface DungeonGridProps {
  matrix: number[][];
  minimumHP: number;
  path: number[][];
}

export function DungeonGrid({ matrix, minimumHP, path }: DungeonGridProps) {
  const cols = matrix[0]?.length || 3;
  const pathSet = new Set(path.map(([i, j]) => `${i},${j}`));

  return (
    <section className="p-6 border-2 rounded-xl bg-white shadow-lg max-w-full overflow-auto">
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold text-gray-800">Minimum HP: {minimumHP}</div>
        <div className="text-sm text-gray-500 mt-1">
          {path.length > 0 ? `Path length: ${path.length} steps` : 'No path calculated'}
        </div>
      </div>
      <div
        className="grid gap-3 mx-auto w-fit"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(4rem, 1fr))` }}
      >
        {matrix.map((row, i) =>
          row.map((cell, j) => {
            const isOnPath = pathSet.has(`${i},${j}`);
            const isStart = i === 0 && j === 0;
            const isEnd = i === matrix.length - 1 && j === matrix[0].length - 1;

            return (
              <div
                key={`${i},${j}`}
                className={`
                  flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 
                  border-2 rounded-xl text-sm sm:text-base font-mono font-bold
                  transition-all duration-200 hover:scale-105 cursor-default
                  ${isOnPath
                    ? 'bg-gradient-to-br from-green-200 to-green-300 border-green-600 text-green-800 shadow-md'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-gray-700 hover:from-gray-100 hover:to-gray-200'
                  }
                  ${isStart ? 'ring-4 ring-blue-400' : ''}
                  ${isEnd ? 'ring-4 ring-red-400' : ''}
                `}
                title={`[${i},${j}]${isOnPath ? ' (path)' : ''}${isStart ? ' (start)' : ''}${isEnd ? ' (end)' : ''}`}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>
      {path.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Optimal Path:</div>
          <div className="text-sm text-gray-600 break-all leading-relaxed">
            {path.map(([i, j]) => `[${i},${j}]`).join(' → ')}
          </div>
        </div>
      )}
    </section>
  );
}