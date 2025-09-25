// src/modules/banking/account/account.test.js

import { describe, it, expect, vi, afterEach } from "vitest";
// Ligne CORRECTE ET DÉFINITIVE
import { HttpBadRequest, HttpNotFound } from "../../../utils/errors.js";

// On importe les futures fonctions de notre service
import { createAccount, getAccounts, deleteAccount } from "./account.service";

// On importe les futures fonctions du repository pour les mocker
import * as repository from "./account.repository";

// On mocke le module repository en entier
vi.mock("./account.repository");

describe("Account Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Ajoutez ce code dans le describe 'Account Service'

  describe("createAccount", () => {
    it("should create an account successfully", async () => {
      // Arrange: on prépare le mock
      const newAccountData = {
        userId: 1,
        name: "Compte courant",
        balance: 1000,
      };
      const expectedAccount = { id: 1, ...newAccountData };

      // On dit à notre mock de retourner cette valeur
      vi.spyOn(repository, "createAccountInRepository").mockResolvedValue(
        expectedAccount
      );

      // Act: on appelle la fonction
      const result = await createAccount(newAccountData);

      // Assert: on vérifie le résultat
      expect(result).toEqual(expectedAccount);
      expect(repository.createAccountInRepository).toHaveBeenCalledWith(
        newAccountData
      );
    });

    // Ajoutez ce code dans le describe 'createAccount'

    it("should throw HttpBadRequest if parameters are invalid", async () => {
      // Arrange: données invalides
      const invalidAccountData = { userId: 1, balance: 1000 }; // Il manque 'name'

      // Act & Assert: on s'attend à ce que la promesse soit rejetée avec une erreur spécifique
      await expect(createAccount(invalidAccountData)).rejects.toThrow(
        HttpBadRequest
      );
    });
  });

  // Ajoutez ce code dans le describe 'Account Service'

  describe("getAccounts", () => {
    it("should return a list of accounts for a user", async () => {
      // Arrange
      const userId = 1;
      const expectedAccounts = [
        { id: 1, userId: 1, name: "Compte courant", balance: 1000 },
        { id: 2, userId: 1, name: "Livret A", balance: 5000 },
      ];
      vi.spyOn(repository, "getAccountsFromRepository").mockResolvedValue(
        expectedAccounts
      );

      // Act
      const result = await getAccounts(userId);

      // Assert
      expect(result).toEqual(expectedAccounts);
      expect(repository.getAccountsFromRepository).toHaveBeenCalledWith(userId);
    });
  });

  // Ajoutez ce code dans le describe 'Account Service'

  describe("deleteAccount", () => {
    it("should delete an account successfully", async () => {
      // Arrange
      const accountId = 1;
      vi.spyOn(repository, "deleteAccountInRepository").mockResolvedValue({
        id: accountId,
      });

      // Act & Assert: on vérifie que la fonction s'exécute sans erreur
      await expect(deleteAccount(accountId)).resolves.not.toThrow();
      expect(repository.deleteAccountInRepository).toHaveBeenCalledWith(
        accountId
      );
    });

    // Ajoutez ce code dans le describe 'deleteAccount'

    it("should throw HttpNotFound if account id is invalid or does not exist", async () => {
      // Arrange
      const invalidAccountId = 999;
      // On simule que la BDD ne trouve rien (retourne null)
      vi.spyOn(repository, "deleteAccountInRepository").mockResolvedValue(null);

      // Act & Assert
      await expect(deleteAccount(invalidAccountId)).rejects.toThrow(
        HttpNotFound
      );
    });
  });
});
