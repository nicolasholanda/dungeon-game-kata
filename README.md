# from project root

```shell
  docker compose up --build
```

## Server

`http://localhost:8080`

## REST endpoints

- GET `/hello`

  - Response: `{"status": "ok"}`

- POST `/dungeon/solve`

  - Request body: `[[1,-3,3],[0,-2,0],[-3,-3,-3]]`
  - Response: `3`

  ## Testing it

  curl -s -X POST http://localhost:8080/dungeon/solve \
  -H "Content-Type: application/json" \
  -d '[[1,-3,3],[0,-2,0],[-3,-3,-3]]'

  docker exec -it dungeon-game-kata-db-1 \
  psql -U app -d appdb -c "SELECT id, input, output, created_at FROM model_runs ORDER BY id DESC;"
