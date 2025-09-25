// src/modules/interoperability/export/export.test.js

import { describe, it, expect, vi, afterEach } from "vitest";
import xlsx from "node-xlsx";
// On importe la fonction mockée pour pouvoir l'inspecter
import { writeFileSync } from "fs";

import { createExport } from "./export.service";
import * as transferRepository from "../../banking/transfer/transfer.repository";

// On mocke les modules externes et notre propre repository
vi.mock("node-xlsx");
// Mock avancé pour simuler l'export nommé 'writeFileSync'
vi.mock("fs", () => ({
  writeFileSync: vi.fn(),
}));
vi.mock("../../banking/transfer/transfer.repository");

describe("Export Service", () => {
  afterEach(() => {
    // Efface tous les mocks entre les tests
    vi.clearAllMocks();
  });

  it("should generate an xlsx file from user transfers", async () => {
    // Arrange
    const userId = 1;
    const mockTransfers = [
      { id: 1, fromAccountId: 2, toAccountId: 1, amount: 200 },
      { id: 2, fromAccountId: 1, toAccountId: 3, amount: 50 },
    ];
    vi.spyOn(
      transferRepository,
      "getTransfersFromRepository"
    ).mockResolvedValue(mockTransfers);

    const mockBuffer = "fake-excel-buffer";
    vi.spyOn(xlsx, "build").mockReturnValue(mockBuffer);

    // Act
    await createExport(userId);

    // Assert
    // 1. A-t-on bien formaté les données pour la librairie ?
    const expectedDataForExcel = [
      ["ID", "From Account ID", "To Account ID", "Amount"],
      [1, 2, 1, 200],
      [2, 1, 3, 50],
    ];
    expect(xlsx.build).toHaveBeenCalledWith([
      { name: "Transfers", data: expectedDataForExcel },
    ]);

    // 2. A-t-on bien tenté d'écrire le fichier ?
    // On vérifie directement la fonction mockée, plus besoin de spyOn ici.
    expect(writeFileSync).toHaveBeenCalledWith(
      `transfers-user-${userId}.xlsx`,
      mockBuffer
    );
  });
});
