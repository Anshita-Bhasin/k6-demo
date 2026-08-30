# k6 Demo 🚀

A collection of [k6](https://k6.io) load testing scripts covering the core performance testing patterns: smoke tests, load tests, stress tests, soak tests, and bottleneck diagnostics.

## Prerequisites

Install k6:

```bash
# macOS
brew install k6

# Docker
docker pull grafana/k6
```

## Scripts

| Script | Pattern | What it does |
|---|---|---|
| [`script.js`](script.js) | Smoke test | 30 constant VUs for 30s against a single endpoint — quick sanity check. |
| [`load-test.js`](load-test.js) | Load test | Ramps 0 → 10 → 0 VUs over 2 minutes to verify normal-traffic behavior. |
| [`stress-test.js`](stress-test.js) | Stress test | Ramps 0 → 20 → 40 → 60 → 80 → 0 VUs to find the breaking point. |
| [`soak-test.js`](soak-test.js) | Soak test | Holds 10 VUs steady for ~4 minutes to catch memory leaks / degradation over time. |
| [`end-to-end.js`](end-to-end.js) | Journey test | Full CRUD flow — create, read, delete, verify — against a REST API. |
| [`post_request.js`](post_request.js) | Journey test | Simplified create → get → delete → verify flow, 10 VUs for 5s. |
| [`bottleneck-demo.js`](bottleneck-demo.js) | Diagnostics | Compares a fast endpoint against an artificially delayed one to surface latency bottlenecks. |
| [`dashboard-comparison.js`](dashboard-comparison.js) | Diagnostics | Hits a delayed endpoint and a 500-error endpoint to populate dashboards with mixed signal. |
| [`cloud-test.js`](cloud-test.js) | Cloud run | Ramping-VU scenario shaped for running on Grafana Cloud k6. |

Most scripts target [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) or [quickpizza.grafana.com](https://quickpizza.grafana.com), k6's recommended public test APIs.

## Running a script

```bash
k6 run load-test.js
```

Override the target host where supported via the `BASE_URL` environment variable:

```bash
BASE_URL=https://your-api.example.com k6 run load-test.js
```

## Running in the cloud

```bash
k6 cloud login
k6 cloud run cloud-test.js
```

## Thresholds

Most scripts enforce the same pass/fail criteria:

- `http_req_duration`: 95th percentile under 500ms
- `http_req_failed`: error rate under 1%

k6 exits non-zero if a threshold is breached — handy for wiring into CI.

## Reading the results

Each run prints a summary of key metrics (`avg`, `min`, `med`, `max`, `p90`, `p95`, `p99`). For richer visualization, stream results to [Grafana Cloud k6](https://k6.io/docs/results-output/real-time/cloud/) or a local Grafana + InfluxDB/Prometheus stack.
