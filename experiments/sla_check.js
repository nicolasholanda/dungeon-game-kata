import http from "k6/http";
import { check } from "k6";
import { Rate } from "k6/metrics";

export let options = {
  iterations: 10,
  thresholds: {
    http_req_duration: ["p(99)<500"], // 99% of requests under 500ms
    http_req_failed: ["rate<0.01"],   // <1% failures
  },
};

function randomMatrix(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * 100))
  );
}

export default function () {
  const url = 'http://localhost:80/dungeon/solve';
  const payload = JSON.stringify(randomMatrix(5, 5));
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    "status is 2xx": (r) => r.status >= 200 && r.status < 300
  });
}
