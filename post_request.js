import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '5s',
};

const url = 'https://jsonplaceholder.typicode.com/posts';

const payload = JSON.stringify({
     title: 'k6 test',
    body: 'performance testing',
    userId: 1,
});

const params = {
  headers: {
    'Content-Type': 'application/json'
  },
};

export default function() {
  let createResponse = http.post (url, payload, params);
  const ratingId = createResponse.json('id');
  const getResponse = http.get(url);
  const deleteResponse = http.del(    `${url}/${ratingId}`);
const verifyResponse = http.get(url);
  
check(createResponse, {
  'rating created successfully': (r) => r.status === 201,
});

check(getResponse, {
  'ratings retrieved successfully': (r) => r.status === 200,
});

check(deleteResponse, {
  'rating deleted successfully': (r) => r.status === 204,
});

check(verifyResponse, {
  'verification successful': (r) => r.status === 200,
});


  sleep(1);
}
