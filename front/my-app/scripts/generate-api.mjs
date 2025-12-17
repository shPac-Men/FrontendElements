// scripts/generate-api.mjs
import { resolve } from "node:path";
import process from "node:process";
import { generateApi } from "swagger-typescript-api";

await generateApi({
  name: "Api.ts",
  output: resolve(process.cwd(), "./src/api"),
  url: "http://localhost:8082/swagger/doc.json",
  httpClientType: "axios",
});
