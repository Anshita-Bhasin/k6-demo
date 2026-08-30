import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    dashboard_demo: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 12 },
        { duration: '10s', target: 0 },
      ],
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  }
};

export default function () {
  http.get('https://quickpizza.grafana.com/api/delay/1'); 
  http.get('https://quickpizza.grafana.com/api/status/500');

  sleep(1);
}