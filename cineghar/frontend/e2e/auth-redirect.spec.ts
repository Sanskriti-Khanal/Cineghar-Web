import { test, expect } from "@playwright/test";

test.describe("Auth redirects", () => {
  test("unauthenticated user visiting dashboard is redirected to login", async ({ page }) => {
    await page.goto("/auth/dashboard");

    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole("heading", { name: /Welcome Back!/i })).toBeVisible();
  });
});

