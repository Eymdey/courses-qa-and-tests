// src/modules/authentication/user/user.test.js

import { describe, it, vi, expect, afterEach } from "vitest";
import { createUser } from "./user.service";
import { createUserInRepository } from "./user.repository";

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
});
