// src/modules/authentication/user/user.test.js

import { describe, it, vi, expect, afterEach } from "vitest";
import { createUser } from "./user.service";
import { createUserInRepository } from "./user.repository";
import { HttpBadRequest, HttpForbidden } from "../../../utils/errors.js";

// Étape 2: Mock du repository
vi.mock("./user.repository", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    createUserInRepository: vi.fn((data) => {
      return {
        id: 1,
        name: data.name,
        birthday: data.birthday,
      };
    }),
  };
});

// Étape 1: Structure du test
describe("User Service", () => {
  // Étape 4: Nettoyage
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Étape 3: Logique du test et assertions
  it("should create an user", async () => {
    const user = await createUser({
      name: "Valentin R",
      birthday: new Date(1997, 8, 13),
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(typeof user.id).toBe("number");
    expect(user).toHaveProperty("name", "Valentin R");
    expect(user.birthday).toBeDefined();
    expect(user.birthday.getFullYear()).toBe(1997);
    expect(user.birthday.getMonth()).toBe(8);

    expect(createUserInRepository).toHaveBeenCalledTimes(1);
    expect(createUserInRepository).toHaveBeenCalledWith({
      name: "Valentin R",
      birthday: new Date(1997, 8, 13),
    });
  });

  // Remplacez l'ancien test "should throw..." par celui-ci

  it("should throw HttpForbidden if the user is too young", async () => {
    // Arrange
    const today = new Date();
    const tooYoungBirthday = new Date(
      today.getFullYear() - 10,
      today.getMonth(),
      today.getDate()
    );
    const youngUserData = { name: "Too Young", birthday: tooYoungBirthday };

    // Act & Assert
    // On utilise un bloc try...catch pour capturer l'erreur et l'analyser
    try {
      await createUser(youngUserData);
      // Si on arrive ici, c'est que le code n'a pas levé d'erreur, donc le test échoue.
      throw new Error("Expected createUser to throw an error, but it did not.");
    } catch (error) {
      // On vérifie les propriétés de l'erreur attrapée
      expect(error.name).toBe("HttpForbidden");
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe("User is too young.");
    }
  });
  // Remplacez le dernier test par celui-ci

  it("should throw HttpBadRequest for invalid schema data", async () => {
    // Arrange
    const invalidUserData = {
      name: 12345, // Incorrect type
      // birthday is missing
    };

    // Act & Assert
    try {
      await createUser(invalidUserData);
      throw new Error("Expected createUser to throw an error, but it did not.");
    } catch (error) {
      // On vérifie les propriétés de l'erreur
      expect(error.name).toBe("HttpBadRequest");
      expect(error.statusCode).toBe(400);
    }
  });
});
