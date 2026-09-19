import { sleep, check } from 'k6';
import { runPostsFlow } from './helpers/api.js';
import { scenarios, thresholds } from './helpers/suite.js';



export const options = {
  scenarios: {
    stress: scenarios.stress,
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

  thresholds
};



export default function () {
  runPostsFlow();
  sleep(1);
}