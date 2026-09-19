# k6 Performance Testing Suite

This project contains a reusable k6 performance testing suite for load, stress, soak, and cloud tests.

It supports local execution, Grafana Cloud execution, and CI-based performance validation through GitHub Actions.

## Project Layout

```text
k6-demo/
├── helpers/
│   ├── api.js
│   └── suite.js
├── load-test.js
├── stress-test.js
├── soak-test.js
├── cloud-test.js
├── bottleneck-demo.js
├── README.md
└── .github/
    └── workflows/
        └── k6-performance-test.yml
```

### What each file does

- `helpers/api.js` — reusable request flows (the "what" to test).
- `helpers/suite.js` — reusable scenarios and thresholds (the "how hard" to test).
- `load-test.js` — normal expected traffic.
- `stress-test.js` — push past normal load to find the breaking point.
- `soak-test.js` — sustained load over time, to catch leaks/degradation.
- `cloud-test.js` — short scenario run against Grafana Cloud.
- `bottleneck-demo.js` — standalone script showing a slow endpoint.
- `.github/workflows/k6-performance-test.yml` — CI performance test workflow.

The test files follow a reusable pattern:

```text
API Flow + Scenario + Thresholds
            ↓
        Test File
            ↓
     Local / Cloud / CI
```

Most test files don't define their own logic. They import a flow from `helpers/api.js` and a scenario/threshold set from `helpers/suite.js`, then wire the two together in `options`.

This avoids duplicating the same requests, checks, scenarios, and thresholds across multiple test files. That's the pattern to follow for any new test.

## Running a Test Locally

To run the load test locally:

```bash
k6 run load-test.js
```

You can run the other test configurations in the same way:

```bash
k6 run stress-test.js
```

```bash
k6 run soak-test.js
```

## Using a Different Environment

The API base URL is provided through the `BASE_URL` environment variable.

For example:

```bash
k6 run --env BASE_URL=https://staging.k6.com load-test.js
```

The reusable API module reads the value using:

```javascript
__ENV.BASE_URL
```

This means the test scripts do not need to contain environment-specific URLs.

If `BASE_URL` isn't set, tests fall back to a public demo API (`jsonplaceholder.typicode.com`), so you can run everything out of the box with no setup.

## Extending the Test Suite

When adding a new endpoint test, reuse the existing helper modules instead of creating a completely separate test structure.

### Step 1: Add the API Flow

Add the reusable API flow to:

`helpers/api.js`

For example:

```javascript
export function runUsersFlow() {
  const listResponse = http.get(`${baseUrl}/users`);
  const detailResponse = http.get(`${baseUrl}/users/1`);

  check(listResponse, {
    'list users - status is 200': (r) => r.status === 200,
  });
  check(detailResponse, {
    'view user - status is 200': (r) => r.status === 200,
  });
}
```

The API behavior belongs in the helper module so it can be reused by different test configurations.

### Step 2: Reuse a Scenario and Thresholds

Scenarios and thresholds are defined in:

`helpers/suite.js`

Reuse an existing scenario when possible (or add a new one there, e.g. `scenarios.spike`) instead of redefining VUs, stages, or thresholds per file.

If a new testing pattern is required, add the new scenario or threshold to `helpers/suite.js` instead of duplicating the configuration in multiple test files.

### Step 3: Create the Test File

Import the reusable API flow and shared configuration:

```javascript
import { sleep } from 'k6';
import { runUsersFlow } from './helpers/api.js';
import { scenarios, thresholds } from './helpers/suite.js';

export const options = {
  scenarios: { load: scenarios.load },
  thresholds,
};

export default function () {
  runUsersFlow();
  sleep(1);
}
```

That's it — no new boilerplate for stages, thresholds, or summary stats. The test file should focus on selecting the API flow and execution configuration rather than repeating shared logic.

> **Note:** `soak-test.js` and `bottleneck-demo.js` predate this pattern and still inline their own logic. Treat them as the "before" example of what `helpers/` saves you from repeating.

## Where to Run the Tests

| Environment | Command |
|---|---|
| Local | `k6 run <file>.js` |
| Grafana Cloud | `k6 cloud run --local-execution cloud-test.js` (needs `K6_CLOUD_TOKEN` + stack slug) |
| CI | `.github/workflows/k6-performance-test.yml` — runs on push/PR to `main`, on a weekly schedule, and on manual dispatch, using the `staging` environment's `BASE_URL` and cloud secrets |

## Grafana Cloud

The test can be executed locally while sending the results to Grafana Cloud.

Run:

```bash
k6 cloud run --local-execution cloud-test.js
```

With `--local-execution`, the test runs on the local machine while the results are streamed to Grafana Cloud.

Make sure the k6 CLI is authenticated with your Grafana Cloud account before running cloud tests.

## GitHub Actions

Performance tests are also integrated into GitHub Actions.

The workflow is located at:

`.github/workflows/k6-performance-test.yml`

It runs on push/PR to `main`, on a weekly schedule, and on manual dispatch, using the `staging` environment's `BASE_URL` and cloud secrets. It provides the required environment configuration, runs the k6 performance test, and uses the configured thresholds to validate performance.

The workflow can be used for automated performance validation as part of the development workflow.

## The Reusable Pattern

When adding a new performance test, follow this pattern:

1. Add reusable API behavior to `helpers/api.js`.
2. Add or reuse scenarios and thresholds in `helpers/suite.js`.
3. Create a small test file that imports the shared modules.
4. Pass environment-specific values through `BASE_URL`.
5. Run the test locally, through Grafana Cloud, or through CI.

The goal is to keep API behavior, test configuration, and execution concerns separated.

This makes the performance-testing suite easier to maintain, reuse, and extend across teams.
