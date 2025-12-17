// src/api/index.ts
import { Api } from "./Api";

type SecurityData = { token: string };

export const api = new Api<SecurityData>({
  baseURL: "http://localhost:8082/api/v1",
  securityWorker: (securityData) => {
    if (!securityData?.token) return {};
    return { headers: { Authorization: `Bearer ${securityData.token}` } };
  },
});
