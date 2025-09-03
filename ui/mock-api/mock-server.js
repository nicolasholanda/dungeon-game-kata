const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8081;

// Middlewares
app.use(cors());
app.use(express.json());

function validateDungeonInput(dungeon) {
  if (!dungeon || !Array.isArray(dungeon) || dungeon.length === 0) {
    throw new Error("Dungeon array cannot be null or empty");
  }

  const rows = dungeon.length;
  const cols = dungeon[0].length;

  if (cols === 0) {
    throw new Error("Dungeon array cannot have empty rows");
  }

  // Check rolls
  for (let i = 1; i < rows; i++) {
    if (dungeon[i].length !== cols) {
      throw new Error("All rows in dungeon must have the same length");
    }
  }
}

// Mock function to calculate minimum HP (simplified)
function calculateMinimumHP(dungeonGrid) {
  const rows = dungeonGrid.length;
  const cols = dungeonGrid[0].length;
  const path = [];
  
  for (let j = 0; j < cols; j++) {
    path.push([0, j]);
  }

  for (let i = 1; i < rows; i++) {
    path.push([i, cols - 1]);
  }

  let minimumHP = 1;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (dungeonGrid[i][j] < 0) {
        minimumHP += Math.abs(dungeonGrid[i][j]);
      }
    }
  }

  return {
    minimumHP: minimumHP,
    path: path
  };
}

// Error helper
function createErrorResponse(message, statusCode, path = '', error = '') {
  return {
    message: message,
    statusCode: statusCode,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    path: path,
    error: error
  };
}

app.get('/hello', (req, res) => {
  console.log('GET /hello - Health check');
  res.json({ status: 'ok' });
});

app.post('/dungeon/solve', (req, res) => {
  console.log('POST /dungeon/solve - Received request:', JSON.stringify(req.body));

  try {
    const dungeonGrid = req.body;
    validateDungeonInput(dungeonGrid);
    const result = calculateMinimumHP(dungeonGrid);

    console.log('Returning result:', JSON.stringify(result));
    res.json(result);

  } catch (error) {
    console.error('Error processing dungeon:', error.message);

    if (error.message.includes('Dungeon array')) {
      const errorResponse = createErrorResponse(
        error.message,
        400,
        '/dungeon/solve',
        'Bad Request'
      );
      res.status(400).json(errorResponse);
    } else {
      const errorResponse = createErrorResponse(
        'An unexpected error occurred',
        500,
        '/dungeon/solve',
        'Internal Server Error'
      );
      res.status(500).json(errorResponse);
    }
  }
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('Malformed JSON:', error.message);
    const errorResponse = createErrorResponse(
      'Invalid JSON format or malformed request body',
      400,
      req.path,
      'Bad Request'
    );
    return res.status(400).json(errorResponse);
  }
  next();
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Not found: ${req.method} ${req.originalUrl}`);
  const errorResponse = createErrorResponse(
    'Endpoint not found',
    404,
    req.originalUrl,
    'Not Found'
  );
  res.status(404).json(errorResponse);
});

// Start server
app.listen(PORT, () => {
  console.log(`  GET  http://localhost:${PORT}/hello`);
  console.log(`  POST http://localhost:${PORT}/dungeon/solve`);
});

module.exports = app;
