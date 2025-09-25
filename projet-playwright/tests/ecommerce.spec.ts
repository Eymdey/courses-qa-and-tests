// Importe les modules nécessaires de Playwright
import { test, expect, Page } from "@playwright/test";

// URL du site à tester
const siteURL = "https://automationexercise.com/";

// On définit une suite de tests pour la page produit de notre e-commerce
test.describe("Ecommerce's product page", () => {
  // Cette fonction s'exécutera avant chaque test de cette suite
  test.beforeEach(async ({ page }) => {
    // 1. On va sur la page d'accueil du site
    await page.goto(siteURL);

    // 2. On gère la bannière de cookies (si elle apparaît)
    // C'est une bonne pratique de l'isoler car elle peut être conditionnelle
    const acceptCookiesButton = page.getByRole("button", { name: "Consent" });
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
    }
  });

  // === EXERCICE 1 ===
  test("should go to product page", async ({ page }) => {
    // 3. On clique sur le lien qui mène à la page des produits.
    // On utilise getByRole pour trouver un lien avec le nom "Products".
    await page.getByRole("link", { name: "Products" }).click();

    // 4. On vérifie que l'URL est bien celle de la page des produits
    await expect(page).toHaveURL("https://automationexercise.com/products");

    // 5. On vérifie que le titre de la page est correct
    await expect(page).toHaveTitle("Automation Exercise - All Products");
  });
});
