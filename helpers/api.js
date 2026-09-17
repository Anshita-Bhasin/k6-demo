import http from 'k6/http';
import { check } from 'k6';

export const baseUrl = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

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

export function runPostsFlow() {
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
}
