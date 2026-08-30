import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 5 },
    { duration: '10s', target: 0 },
  ],

  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const normalResponse = http.get(
    'https://quickpizza.grafana.com'
  );

  const slowResponse = http.get(
    'https://quickpizza.grafana.com/api/delay/1'
  );

  check(normalResponse, {
    'home request returned 200': (response) =>
      response.status === 200,
  });

  check(slowResponse, {
    'slow request returned 200': (response) =>
      response.status === 200,
  });

  sleep(1);
}