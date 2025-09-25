import { test, expect } from "@playwright/test";

test.describe("Formulaire d'inscription", () => {
  // Ce test correspond à l'Exercice 2
  test("devrait créer un compte avec succès", async ({ page }) => {
    // On va sur la page d'accueil (configurée dans baseURL)
    await page.goto("/");

    // On remplit les champs du formulaire
    await page.getByPlaceholder("Nom d'utilisateur").fill("Test User");
    await page.getByPlaceholder("E-mail").fill("test@example.com");
    await page.getByPlaceholder("Mot de passe").fill("password123");

    // On clique sur le bouton "S'inscrire"
    await page.getByRole("button", { name: "S'inscrire" }).click();

    // On vérifie que le message de succès s'affiche
    const successMessage = page.locator("#message");
    await expect(successMessage).toHaveText("Compte créé pour Test User !");
    await expect(successMessage).toHaveClass("success");
  });

  // Ce test correspond à la première partie de l'Exercice 3
  test("devrait afficher une erreur si l'e-mail est invalide", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByPlaceholder("Nom d'utilisateur").fill("Test User");
    await page.getByPlaceholder("E-mail").fill("email-invalide"); // Email incorrect
    await page.getByPlaceholder("Mot de passe").fill("password123");

    await page.getByRole("button", { name: "S'inscrire" }).click();

    // On vérifie que le message d'erreur s'affiche
    const errorMessage = page.locator("#message");
    await expect(errorMessage).toHaveText(
      "Le format de l'e-mail est invalide."
    );
    await expect(errorMessage).toHaveClass("error");
  });

  // Ce test correspond à la deuxième partie de l'Exercice 3
  test("devrait afficher une erreur si des champs sont vides", async ({
    page,
  }) => {
    await page.goto("/");

    // On ne remplit que le nom d'utilisateur
    await page.getByPlaceholder("Nom d'utilisateur").fill("Test User");

    // On clique directement
    await page.getByRole("button", { name: "S'inscrire" }).click();

    // On vérifie que le message d'erreur s'affiche
    const errorMessage = page.locator("#message");
    await expect(errorMessage).toHaveText("Tous les champs sont requis.");
    await expect(errorMessage).toHaveClass("error");
  });
});
