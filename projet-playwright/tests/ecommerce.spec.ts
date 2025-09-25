import { test, expect } from "@playwright/test";

const siteURL = "https://automationexercise.com/";

test.describe("Ecommerce's product page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(siteURL);
    // Le site semble avoir retiré la bannière de cookies, mais on garde ce code
    // au cas où. Il ne plantera pas si le bouton n'est pas là.
    const acceptCookiesButton = page.getByRole("button", { name: "Consent" });
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
    }
  });

  // === EXERCICE 1 (inchangé, fonctionnait déjà) ===
  test("should go to product page", async ({ page }) => {
    await page.getByRole("link", { name: "Products" }).click();
    await expect(page).toHaveURL("https://automationexercise.com/products");
    await expect(page).toHaveTitle("Automation Exercise - All Products");
  });

  // === EXERCICE 2 (corrigé) ===
  test("should find a t-shirt", async ({ page }) => {
    await page.getByRole("link", { name: "Products" }).click();
    await expect(page).toHaveURL("https://automationexercise.com/products");

    await page.getByRole("textbox", { name: "Search Product" }).fill("t-shirt");
    await page.locator("#submit_search").click();

    const products = page.locator(".features_items .product-image-wrapper");

    // CORRECTION : On vérifie que le PREMIER produit est visible
    await expect(products.first()).toBeVisible();
    await expect(products.count()).toBeGreaterThan(0);
  });

  // === EXERCICE 3 (corrigé) ===
  test("should contain product details like title and price", async ({
    page,
  }) => {
    await page.goto("https://automationexercise.com/product_details/30");

    await expect(page).toHaveTitle("Automation Exercise - Product Details");

    // CORRECTION : Le nom du produit a été mis à jour
    const productName = page.getByRole("heading", {
      name: "Premium Polo T-Shirts",
    });
    await expect(productName).toBeVisible();

    const productPrice = page.getByText(/Rs\./);
    await expect(productPrice).toBeVisible();

    const addToCartButton = page.getByRole("button", { name: "Add to cart" });
    await expect(addToCartButton).toBeVisible();
  });
});
