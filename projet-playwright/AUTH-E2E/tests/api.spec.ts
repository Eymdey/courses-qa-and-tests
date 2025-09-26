import { test, expect } from "@playwright/test";

// On définit l'URL de base de notre API
const baseURL = "https://reqres.in/api/users";

// On utilise test.describe.serial() pour que les tests de ce groupe
// s'exécutent les uns après les autres, dans l'ordre. C'est important
// car le test GET dépend du POST qui a créé l'utilisateur.
test.describe.serial("API /users", () => {
  // Données de l'utilisateur qu'on va créer
  const newUser = {
    username: "Api User",
    email: "api.user@example.com",
  };
  let createdUserId: number; // Pour stocker l'ID de l'utilisateur créé

  test("devrait créer un nouvel utilisateur via POST", async ({ request }) => {
    // On envoie une requête POST à /users
    const response = await request.post(`${baseURL}/users`, {
      data: newUser,
    });

    // On vérifie que la réponse est correcte
    expect(response.status()).toBe(201); // 201 Created

    const responseBody = await response.json();
    // On vérifie que le corps de la réponse contient bien les données envoyées
    expect(responseBody).toMatchObject(newUser);
    // On vérifie qu'un ID a bien été ajouté par le serveur
    expect(responseBody.id).toBeDefined();

    // On sauvegarde l'ID pour le test suivant
    createdUserId = responseBody.id;
  });

  test("devrait récupérer la liste des utilisateurs via GET", async ({
    request,
  }) => {
    // On envoie une requête GET à /users
    const response = await request.get(`${baseURL}/users`);

    // On vérifie que la requête a réussi
    expect(response.ok()).toBeTruthy(); // ok() vérifie un statut 2xx

    const responseBody = await response.json();
    // On s'attend à ce que la réponse soit un tableau
    expect(Array.isArray(responseBody)).toBe(true);
    // On vérifie qu'au moins un utilisateur (celui qu'on vient de créer) existe
    expect(responseBody.length).toBeGreaterThan(0);

    // On cherche l'utilisateur créé dans la liste
    const foundUser = responseBody.find(
      (user: any) => user.id === createdUserId
    );
    expect(foundUser).toBeDefined();
    expect(foundUser.username).toBe(newUser.username);
  });
});
