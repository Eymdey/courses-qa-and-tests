// src/modules/banking/account/account.service.js

import * as repository from "./account.repository.js";
import { HttpBadRequest, HttpNotFound } from "../../../utils/errors.js";

/**
 * Crée un nouveau compte bancaire.
 * Vérifie que les données nécessaires sont présentes avant d'appeler le repository.
 */
export const createAccount = async (accountData) => {
  // Validation des données d'entrée
  if (!accountData.name || !accountData.userId) {
    throw new HttpBadRequest("Missing required fields: name and userId.");
  }

  // Appel au repository pour créer le compte
  return repository.createAccountInRepository(accountData);
};

/**
 * Récupère tous les comptes pour un utilisateur donné.
 */
export const getAccounts = async (userId) => {
  // Simple appel au repository, pas de logique métier complexe ici
  return repository.getAccountsFromRepository(userId);
};

/**
 * Supprime un compte bancaire par son ID.
 * Vérifie que le compte a bien été trouvé et supprimé par le repository.
 */
export const deleteAccount = async (accountId) => {
  // Appel au repository pour supprimer le compte
  const result = await repository.deleteAccountInRepository(accountId);

  // Si le repository ne retourne rien, cela signifie que le compte n'a pas été trouvé
  if (!result) {
    throw new HttpNotFound("Account not found.");
  }
};
