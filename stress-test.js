import http from 'k6/http';
import { sleep, check } from 'k6';
import { runPostsFlow } from './helpers/api.js';



export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 20 },
        { duration: '15s', target: 40 },
        { duration: '15s', target: 60 },
        { duration: '15s', target: 80 },
        { duration: '15s', target: 0 },
      ],
    },
  },
  
  summaryTrendStats: [
    'avg',
    'min',
    'med',
    'max',
    'p(90)',
    'p(95)',
    'p(99)',
  ],

  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  runPostsFlow();
  sleep(1);
}