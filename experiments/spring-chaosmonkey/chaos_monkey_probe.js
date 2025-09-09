import http from "k6/http";
import { check } from "k6";

export let options = {
  iterations: 50
};

function randomMatrix(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * 100))
  );
}

export default function () {
  const url = 'http://localhost:9050/dungeon/solve';
  const payload = JSON.stringify(randomMatrix(3, 3));
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    "status is 200 or 500": (r) => r.status === 200 || r.status === 500,
    "successful responses have valid structure": (r) => {
      if (r.status === 200) {
        const body = r.json();
        return body && typeof body.minimumHP === 'number';
      }
      return true;
    },
    "error responses are properly formatted": (r) => {
      if (r.status === 500) {
        const body = r.json();
        return body && body.message && body.statusCode;
      }
      return true;
    },
  });
}