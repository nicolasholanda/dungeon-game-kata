import http from 'k6/http';
import { check, sleep } from 'k6';

export default function() {
  const url = 'http://localhost/dungeon/solve';
  const payload = JSON.stringify([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response = http.post(url, payload, params);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 5000ms': (r) => r.timings.duration < 5000,
  });
}
