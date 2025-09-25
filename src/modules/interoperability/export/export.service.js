// src/modules/interoperability/export/export.service.js

import xlsx from "node-xlsx";
import { writeFileSync } from "fs";
import { getTransfersFromRepository } from "../../banking/transfer/transfer.repository.js";

export const createExport = async (userId) => {
  // 1. Récupérer les données
  const transfers = await getTransfersFromRepository(userId);

  // 2. Formatter les données pour le fichier Excel
  const headers = ["ID", "From Account ID", "To Account ID", "Amount"];
  const dataRows = transfers.map((t) => [
    t.id,
    t.fromAccountId,
    t.toAccountId,
    t.amount,
  ]);
  const dataForSheet = [headers, ...dataRows];

  const sheetOptions = {
    name: "Transfers",
    data: dataForSheet,
  };

  // 3. Utiliser la librairie pour créer le buffer du fichier
  const buffer = xlsx.build([sheetOptions]);

  // 4. Écrire le fichier sur le disque
  writeFileSync(`transfers-user-${userId}.xlsx`, buffer);
};
