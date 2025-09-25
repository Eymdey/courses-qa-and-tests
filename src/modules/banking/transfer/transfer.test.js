// src/modules/banking/transfer/transfer.test.js

import { describe, it, expect, vi, afterEach } from "vitest";
import { HttpBadRequest } from "../../../utils/errors.js";

// Fonctions du service à tester
import { createTransfer, getTransfers } from "./transfer.service";

// On importe les repositories pour les mocker
import * as transferRepository from "./transfer.repository";
import * as accountRepository from "../account/account.repository";

// On mocke les deux modules
vi.mock("./transfer.repository");
vi.mock("../account/account.repository");

describe("Transfer Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createTransfer", () => {
    it("should create a transfer and update account balances successfully", async () => {
      // Arrange
      const transferData = { fromAccountId: 1, toAccountId: 2, amount: 100 };
      const fromAccount = { id: 1, balance: 500 };
      const toAccount = { id: 2, balance: 1000 };

      // Simuler la récupération des comptes
      vi.spyOn(accountRepository, "getAccountByIdInRepository")
        .mockResolvedValueOnce(fromAccount)
        .mockResolvedValueOnce(toAccount);
      // Simuler la création du transfert
      vi.spyOn(
        transferRepository,
        "createTransferInRepository"
      ).mockResolvedValue({ id: 1, ...transferData });
      // Simuler la mise à jour des comptes
      vi.spyOn(accountRepository, "patchAccountInRepository").mockResolvedValue(
        true
      );

      // Act
      const result = await createTransfer(transferData);

      // Assert
      expect(result).toBeDefined();
      expect(result.amount).toBe(100);
      expect(
        transferRepository.createTransferInRepository
      ).toHaveBeenCalledWith(transferData);

      // Vérifier la mise à jour des soldes
      expect(accountRepository.patchAccountInRepository).toHaveBeenCalledTimes(
        2
      );
      expect(accountRepository.patchAccountInRepository).toHaveBeenCalledWith(
        1,
        { balance: 400 }
      ); // 500 - 100
      expect(accountRepository.patchAccountInRepository).toHaveBeenCalledWith(
        2,
        { balance: 1100 }
      ); // 1000 + 100
    });

    it("should throw an error for negative transfer amount", async () => {
      const transferData = { fromAccountId: 1, toAccountId: 2, amount: -50 };
      await expect(createTransfer(transferData)).rejects.toThrow(
        HttpBadRequest
      );
    });

    it("should throw an error for insufficient funds", async () => {
      const transferData = { fromAccountId: 1, toAccountId: 2, amount: 1000 };
      const fromAccount = { id: 1, balance: 500 }; // Solde insuffisant

      vi.spyOn(
        accountRepository,
        "getAccountByIdInRepository"
      ).mockResolvedValue(fromAccount);

      await expect(createTransfer(transferData)).rejects.toThrow(
        HttpBadRequest
      );
      await expect(createTransfer(transferData)).rejects.toThrow(
        "Insufficient funds."
      );
    });
  });

  describe("getTransfers", () => {
    it("should return a list of transfers for a user", async () => {
      // Arrange
      const userId = 1;
      const expectedTransfers = [
        { id: 1, fromAccountId: 2, toAccountId: 1, amount: 200 },
      ];
      vi.spyOn(
        transferRepository,
        "getTransfersFromRepository"
      ).mockResolvedValue(expectedTransfers);

      // Act
      const result = await getTransfers(userId);

      // Assert
      expect(result).toEqual(expectedTransfers);
      expect(
        transferRepository.getTransfersFromRepository
      ).toHaveBeenCalledWith(userId);
    });
  });
});
