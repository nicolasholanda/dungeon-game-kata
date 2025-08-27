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
