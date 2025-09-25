// src/modules/interoperability/export/export.test.js

import { describe, it, expect, vi, afterEach } from "vitest";
import xlsx from "node-xlsx";
import fs from "fs";

import { createExport } from "./export.service";
import * as transferRepository from "../../banking/transfer/transfer.repository";

// On mocke les modules externes et notre propre repository
vi.mock("node-xlsx");
vi.mock("fs");
vi.mock("../../banking/transfer/transfer.repository");

describe("Export Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should generate an xlsx file from user transfers", async () => {
    // Arrange
    const userId = 1;
    const mockTransfers = [
      { id: 1, fromAccountId: 2, toAccountId: 1, amount: 200 },
      { id: 2, fromAccountId: 1, toAccountId: 3, amount: 50 },
    ];
    // Simuler la récupération des données
    vi.spyOn(
      transferRepository,
      "getTransfersFromRepository"
    ).mockResolvedValue(mockTransfers);

    // Simuler le retour de la librairie xlsx
    const mockBuffer = "fake-excel-buffer";
    vi.spyOn(xlsx, "build").mockReturnValue(mockBuffer);

    // Espionner l'écriture du fichier
    const writeFileSpy = vi
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

    // Act
    await createExport(userId);

    // Assert
    // 1. A-t-on bien formaté les données pour la librairie ?
    const expectedDataForExcel = [
      ["ID", "From Account ID", "To Account ID", "Amount"], // Headers
      [1, 2, 1, 200], // Row 1
      [2, 1, 3, 50], // Row 2
    ];
    expect(xlsx.build).toHaveBeenCalledWith([
      { name: "Transfers", data: expectedDataForExcel },
    ]);

    // 2. A-t-on bien tenté d'écrire le fichier ?
    expect(writeFileSpy).toHaveBeenCalledWith(
      `transfers-user-${userId}.xlsx`,
      mockBuffer
    );
  });
});
