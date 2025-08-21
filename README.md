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