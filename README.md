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

# Install K6
sudo apt install k6

# Install reporting extension (optional)
pip install chaostoolkit-reporting

# Install Cairo graphics library (required for reporting)
sudo apt-get install libcairo2-dev

sudo wget -q https://github.com/jgm/pandoc/releases/download/3.7.0.2/pandoc-3.7.0.2-linux-amd64.tar.gz \
  && sudo tar -xzf pandoc-3.7.0.2-linux-amd64.tar.gz \
  && sudo cp -r pandoc-3.7.0.2/bin/* /usr/local/bin/ \
  && sudo rm -rf pandoc-3.7.0.2*

# Install Pumba for Docker chaos experiments
sudo curl -L https://github.com/alexei-led/pumba/releases/download/0.11.6/pumba_linux_amd64  -o /usr/local/bin/pumba
sudo chmod +x /usr/local/bin/pumba
```

Run chaos experiments:
```bash
# Database failure test
chaos run experiments/database-failure.json

# Load test
chaos run experiments/load-test.json
```
