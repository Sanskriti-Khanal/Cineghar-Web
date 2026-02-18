// Use test DB for integration tests (set before configs are loaded)
process.env.MONGODB_URI =
  process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/cineghar_test";

// Mock uuid (ESM package) so upload middleware loads without ESM parse errors
jest.mock("uuid", () => ({
  v4: () => "mock-uuid-1234",
}));
