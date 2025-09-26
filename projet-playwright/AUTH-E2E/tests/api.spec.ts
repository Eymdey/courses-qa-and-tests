import { test, expect } from "@playwright/test";

// --- CORRECTION 1 ---
// La baseURL est la racine de l'API, sans l'endpoint.
const baseURL = "https://reqres.in/api";

test.describe.serial("API /users", () => {
  const newUser = {
    username: "Api User",
    email: "api.user@example.com",
  };

  test("devrait créer un nouvel utilisateur via POST", async ({ request }) => {
    // On envoie une requête POST à l'endpoint /users
    const response = await request.post(`${baseURL}/users`, { // <-- URL corrigée
      data: newUser,
    });

    // On vérifie que la réponse est correcte
    expect(response.status()).toBe(201); // 201 Created

    const responseBody = await response.json();
    // On vérifie que le corps de la réponse contient bien les données envoyées
    expect(responseBody).toMatchObject(newUser);
    // On vérifie qu'un ID a bien été ajouté par le serveur
    expect(responseBody.id).toBeDefined();
  });

  // --- CORRECTION 2 ---
  // On réécrit ce test pour qu'il soit compatible avec une API de test.
  test("devrait récupérer une liste d'utilisateurs via GET", async ({
    request,
  }) => {
    // On envoie une requête GET à l'endpoint /users
    const response = await request.get(`${baseURL}/users`); // <-- URL corrigée

    // On vérifie que la requête a réussi
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();
    // On vérifie que la réponse contient une propriété "data" qui est un tableau
    expect(responseBody).toHaveProperty('data');
    expect(Array.isArray(responseBody.data)).toBe(true);
    
    // On vérifie que le premier utilisateur de la liste a la bonne structure
    if (responseBody.data.length > 0) {
      const firstUser = responseBody.data[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('email');
      expect(firstUser).toHaveProperty('first_name');
      expect(firstUser).toHaveProperty('last_name');
    }
  });
});