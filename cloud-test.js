import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  scenarios: {
    cloud_demo: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 12 },
        { duration: '10s', target: 0 },
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

const baseUrl = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

const createPayload = JSON.stringify({
  title: 'My New Post',
  body: 'This is the content of my post.',
  userId: 1,
});

const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function () {
  const browseResponse = http.get(`${baseUrl}/posts?_limit=5`);

  const viewResponse = http.get(`${baseUrl}/posts/1`);

  const createResponse = http.post(`${baseUrl}/posts`, createPayload, params);

  check(browseResponse, {
    'browse posts - status is 200': (r) => r.status === 200,
  });

  check(viewResponse, {
    'view post - status is 200': (r) => r.status === 200,
  });

  check(createResponse, {
    'create post - status is 201': (r) => r.status === 201,
  });

  sleep(1);
}