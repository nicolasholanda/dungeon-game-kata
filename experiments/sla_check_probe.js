import http from "k6/http";
import { check } from "k6";

export let options = {
  iterations: 100,
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.03"],
  },
};

function randomMatrix(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * 100))
  );
}

export default function () {
  const url = 'http://localhost:80/dungeon/solve';
  const payload = JSON.stringify(randomMatrix(3, 3));
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    "status is 2xx": (r) => r.status >= 200 && r.status < 300,
    "response time < 500ms": (r) => r.timings.duration < 500,
  });
}
