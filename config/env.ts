import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const env = {
  baseUrl: process.env.BASE_URL ?? "http://localhost:4200",
  apiUrl:  process.env.API_URL  ?? "http://localhost:8000/api/",

  testUserPassword: required("TEST_USER_PASSWORD"),
  adminPassword:    required("ADMIN_PASSWORD"),
};
