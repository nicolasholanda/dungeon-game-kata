import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 20,
  duration: '30s',
};

const invalidPayloads = [
  // Invalid JSON syntax
  '{invalid json}',
  '{"broken": json}',
  '[[[broken array structure',
  '{"missing": "quote}',

  // Wrong data types
  '"just a string"',
  '12345',
  'null',
  'true',

  // Malformed arrays
  '[1,2,3,',
  '[[1,2],[3,4',
  '[1,,3]',
  '[[],[]]',

  // Empty/null cases
  '',
  '{}',
  '[]',

  // Oversized but invalid
  '[' + '1,'.repeat(1000) + ']',
];

const wrongContentTypes = [
  'text/plain',
  'text/html',
  'application/xml',
  'application/x-www-form-urlencoded',
];

export default function() {
  const url = 'http://localhost:80/dungeon/solve';

  // Randomly pick an invalid payload
  const payload = invalidPayloads[Math.floor(Math.random() * invalidPayloads.length)];

  // Randomly pick a content type (sometimes wrong, sometimes correct)
  const contentType = Math.random() < 0.3
    ? wrongContentTypes[Math.floor(Math.random() * wrongContentTypes.length)]
    : 'application/json';

  const params = {
    headers: {
      'Content-Type': contentType,
    },
    timeout: '10s',
  };

  let response = http.post(url, payload, params);

  check(response, {
    'responds within 10s': (r) => r.timings.duration < 10000,
    'returns some response': (r) => r.status > 0,
    'not 5xx server error': (r) => r.status < 500 || r.status >= 600,
  });

  // Small delay to prevent overwhelming the server completely
  sleep(0.1);
}
