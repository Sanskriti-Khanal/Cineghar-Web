import { test, expect } from "@playwright/test";

test.describe("Public home page", () => {
  test("shows hero sections and nav links", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: /CineGhar/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Signup" })).toBeVisible();

    await expect(page.getByText("Your Ultimate")).toBeVisible();
    await expect(page.getByText("Movie Destination")).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore Movies" })).toBeVisible();
  });
});