import { HttpError } from "../errors/http-error";

describe("HttpError unit tests", () => {
  it("stores statusCode and message", () => {
    const err = new HttpError(404, "Not found");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not found");
  });

  it("is instance of Error and HttpError", () => {
    const err = new HttpError(500, "Internal");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(HttpError);
  });

  it("preserves stack trace", () => {
    const err = new HttpError(400, "Bad request");
    expect(err.stack).toBeDefined();
  });
});

