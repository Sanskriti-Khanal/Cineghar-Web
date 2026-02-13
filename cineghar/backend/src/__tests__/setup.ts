process.env.NODE_ENV = "test";

// Load .env so we can use the same MongoDB cluster as dev (e.g. Atlas) with a test DB
require("dotenv").config({ path: require("path").resolve(process.cwd(), ".env") });

// Use test DB for integration tests
// If MONGODB_URI_TEST is set, use it; else use main MONGODB_URI with _test suffix so we don't touch dev data
const mainUri = process.env.MONGODB_URI || "";
if (process.env.MONGODB_URI_TEST) {
  process.env.MONGODB_URI = process.env.MONGODB_URI_TEST;
} else if (mainUri) {
  // Use same cluster as .env but with a test database name so we don't touch dev data
  const testUri = mainUri.includes("?")
    ? mainUri.replace(/(\/[^/?]*)(\?.*)$/, "/cineghar_test$2")
    : mainUri.replace(/\/[^/]*$/, "/cineghar_test");
  process.env.MONGODB_URI = testUri;
} else {
  process.env.MONGODB_URI = "mongodb://localhost:27017/cineghar_test";
}
