# from project root

```shell
  docker compose up --build
```

## Server

`http://localhost:8080`

## Swagger UI

`http://localhost:8080/swagger-ui.html`

## REST endpoints

- GET `/hello`

  - Response: `{"status": "ok"}`

- POST `/dungeon/solve`

  - Request body: `[[1,-3,3],[0,-2,0],[-3,-3,-3]]`
  - Response: `{ "minimumHP": 3, "path": [ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 1, 2 ], [ 2, 2 ] ] }`

  ## Testing it

  curl -s -X POST http://localhost:8080/dungeon/solve \
   -H "Content-Type: application/json" \
   -d '[[1,-3,3],[0,-2,0],[-3,-3,-3]]'

  docker exec -it dungeon-game-kata-db-1 \
   psql -U app -d appdb -c "SELECT id, input, output, created_at FROM model_runs ORDER BY id DESC;"

  ## Frontend

  Inside UI folder

  ```shell
  npm i
  npm run dev # to run dev
  npm run build && npm run preview # to run prject build
  ```

## Chaos Engineering Setup

Install Python and tools:
```bash
# Install Python 3 and pip
sudo apt update
sudo apt install python3 python3-pip

# Install Chaos Toolkit
pip install chaostoolkit

# Install K6 extension for load testing
pip install chaostoolkit-k6

# Install the Spring extension used by the new experiment
pip install -r experiments/requirements.txt
```

Run chaos experiments:
```bash
# Database failure test
chaos run experiments/database-failure.json

# Load test
chaos run experiments/load-test.json

# NEW: Enable Chaos Monkey and apply latency assaults to controllers
chaos run experiments/spring-chaosmonkey.json
```

Notes:
- The application exposes the Chaos Monkey actuator endpoint at `/actuator/chaosmonkey` and is disabled by default via configuration.
- The experiment will:
  - verify Chaos Monkey is disabled,
  - enable it,
  - configure a latency assault (500–1500ms) for REST controllers,
  - verify the configuration,
  - and finally disable Chaos Monkey as a rollback.
- Ensure the app is running locally on port 80 (or update the `base_url` in the experiment accordingly).
