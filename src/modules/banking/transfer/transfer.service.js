// src/modules/banking/transfer/transfer.service.js

import * as transferRepository from "./transfer.repository.js";
import * as accountRepository from "../account/account.repository.js";
import { HttpBadRequest } from "../../../utils/errors.js";

export const createTransfer = async (transferData) => {
  const { fromAccountId, toAccountId, amount } = transferData;

  // 1. Validation des données d'entrée
  if (!fromAccountId || !toAccountId || !amount) {
    throw new HttpBadRequest("Missing required fields.");
  }
  if (amount <= 0) {
    throw new HttpBadRequest("Transfer amount must be positive.");
  }

  // 2. Récupérer les comptes
  const fromAccount = await accountRepository.getAccountByIdInRepository(
    fromAccountId
  );
  const toAccount = await accountRepository.getAccountByIdInRepository(
    toAccountId
  );

  if (!fromAccount || !toAccount) {
    throw new HttpBadRequest("Invalid account ID.");
  }

  // 3. Vérifier le solde
  if (fromAccount.balance < amount) {
    throw new HttpBadRequest("Insufficient funds.");
  }

  // 4. Mettre à jour les soldes des comptes
  const newFromBalance = fromAccount.balance - amount;
  const newToBalance = toAccount.balance + amount;

  await accountRepository.patchAccountInRepository(fromAccountId, {
    balance: newFromBalance,
  });
  await accountRepository.patchAccountInRepository(toAccountId, {
    balance: newToBalance,
  });

  // 5. Créer l'enregistrement du transfert
  const createdTransfer = await transferRepository.createTransferInRepository(
    transferData
  );

  return createdTransfer;
};

export const getTransfers = async (userId) => {
  return transferRepository.getTransfersFromRepository(userId);
};
