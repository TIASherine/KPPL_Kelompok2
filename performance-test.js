import http from "k6/http";
import { check, sleep } from "k6";

const VUS = Number(__ENV.VUS || 10);
const DURATION = __ENV.DURATION || "60s";

export const options = {
  scenarios: {
    product_search: {
      executor: "constant-vus",
      vus: VUS,
      duration: DURATION,
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.05"],
    checks: ["rate>0.95"],
  },
};

export default function () {
  const response = http.get("http://localhost:3000/products/search?q=Produk");

  check(response, {
    "HTTP status 200": (r) => r.status === 200,
    "Response under 1s": (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
