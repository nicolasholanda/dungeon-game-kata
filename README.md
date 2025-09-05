# to run the project:
```shell
  docker compose up --build
```

## Server

`http://localhost:80` via HAProxy (routes to app1/app2 at 8081 and app3 at 9050)
Direct containers:
- app3 (Chaos Monkey profile): `http://localhost:9050`

## Swagger UI

`http://localhost:80/swagger-ui.html`

## REST endpoints

- GET `/hello`

  - Response: `{"status": "ok"}`

- POST `/dungeon/solve`

  - Request body: `[[1,-3,3],[0,-2,0],[-3,-3,-3]]`
  - Response: `{ "minimumHP": 3, "path": [ [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 1, 2 ], [ 2, 2 ] ] }`

  ## Testing it

  curl -s -X POST http://localhost:80/dungeon/solve \
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

# Install Chaos Toolkit and Spring extension
pip install -r experiments/requirements.txt
```

Run chaos experiments:
```bash
# Database failure test
chaos run experiments/database-failure.json

# Load test
chaos run experiments/load-test.json

# Enable Chaos Monkey and apply latency assaults to controllers
# Target app3's actuator directly (published on :9050)
export APP_URL=http://localhost:9050/actuator
chaos run experiments/spring-chaosmonkey.json
```

Notes:
- Actuator exposes the Chaos Monkey endpoint id `chaosmonkey` (see application.yml) 
- and watchers are off by default (`chaos.monkey.enabled: false`).
- The Spring experiment enforces a baseline by first disabling Chaos Monkey,
- then enabling it and configuring a latency assault (500–1500ms),
- and finally verifying it's enabled; it rolls back by disabling and resetting assaults.