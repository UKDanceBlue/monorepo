import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";

import { InvalidArgumentError } from "../../error/direct.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import {
  BatchType,
  DailyDepartmentNotificationBatchNode,
  DailyDepartmentNotificationNode,
  extractDDNBatchType,
  stringifyDDNBatchType,
} from "./DailyDepartmentNotification.js";
import { SolicitationCodeNode } from "./SolicitationCode.js";

describe("extractDDNBatchType", () => {
  it("should return the correct BatchType for valid batch IDs", () => {
    expect(extractDDNBatchType("123C").unwrap()).toBe(BatchType.Check);
    expect(extractDDNBatchType("123T").unwrap()).toBe(BatchType.Transmittal);
    expect(extractDDNBatchType("123D").unwrap()).toBe(BatchType.CreditCard);
    expect(extractDDNBatchType("123A").unwrap()).toBe(BatchType.ACH);
    expect(extractDDNBatchType("123N").unwrap()).toBe(BatchType.NonCash);
    expect(extractDDNBatchType("123X").unwrap()).toBe(
      BatchType.PayrollDeduction
    );
    expect(extractDDNBatchType("123P").unwrap()).toBe(BatchType.P);
  });

  it("should return an error for invalid batch IDs", () => {
    expect(extractDDNBatchType("123Z").unwrapErr()).toBeInstanceOf(
      InvalidArgumentError
    );
    expect(extractDDNBatchType("123").unwrapErr()).toBeInstanceOf(
      InvalidArgumentError
    );
  });
});

describe("stringifyDDNBatchType", () => {
  it("should return the correct string representation for BatchType", () => {
    expect(stringifyDDNBatchType(BatchType.CreditCard)).toBe("Credit Card");
    expect(stringifyDDNBatchType(BatchType.NonCash)).toBe("Non-cash");
    expect(stringifyDDNBatchType(BatchType.PayrollDeduction)).toBe(
      "Payroll Deduction"
    );
    expect(stringifyDDNBatchType(BatchType.Check)).toBe(BatchType.Check);
  });
});

describe("DailyDepartmentNotificationNode", () => {
  it("should initialize correctly", () => {
    const initValues = {
      id: "uuid1",
      transactionType: "Donation",
      combinedAmount: 100,
      pledgedAmount: 100,
      accountNumber: "12345",
      accountName: "Test Account",
      onlineGift: true,
      solicitationCode: new SolicitationCodeNode(),
      ukFirstGift: true,
      divFirstGift: true,
      idSorter: "1",
      combinedDonorName: "John Doe",
      combinedDonorSalutation: "Mr. Doe",
      createdAt: DateTime.now(),
    };

    const node = DailyDepartmentNotificationNode.init(initValues);
    expect(node.id.id).toBe(initValues.id);
    expect(node.transactionType).toBe(initValues.transactionType);
    expect(node.combinedAmount).toBe(initValues.combinedAmount);
    expect(node.pledgedAmount).toBe(initValues.pledgedAmount);
    expect(node.accountNumber).toBe(initValues.accountNumber);
    expect(node.accountName).toBe(initValues.accountName);
    expect(node.onlineGift).toBe(initValues.onlineGift);
    expect(node.solicitationCode).toBe(initValues.solicitationCode);
    expect(node.ukFirstGift).toBe(initValues.ukFirstGift);
    expect(node.divFirstGift).toBe(initValues.divFirstGift);
    expect(node.idSorter).toBe(initValues.idSorter);
    expect(node.combinedDonorName).toBe(initValues.combinedDonorName);
    expect(node.combinedDonorSalutation).toBe(
      initValues.combinedDonorSalutation
    );
    expect(node.createdAt).toBe(initValues.createdAt);
  });

  it("should return the correct unique ID", () => {
    const node = new DailyDepartmentNotificationNode();
    node.id = { id: "unique-id" } as GlobalId;
    expect(node.getUniqueId()).toBe("unique-id");
  });

  it("should return the correct text", () => {
    const node = new DailyDepartmentNotificationNode();
    node.combinedAmount = 100;
    node.combinedDonorName = "John Doe";
    node.comment = "Test Comment";
    expect(node.text()).toBe("100 from John Doe to Test Comment");
  });
});

describe("DailyDepartmentNotificationBatchNode", () => {
  it("should initialize correctly", () => {
    const initValues = {
      id: "uuid1",
      batchNumber: "123C",
    };

    const node = DailyDepartmentNotificationBatchNode.init(initValues);
    expect(node.id.id).toBe(initValues.id);
    expect(node.batchNumber).toBe(initValues.batchNumber);
  });

  it("should return the correct unique ID", () => {
    const node = new DailyDepartmentNotificationBatchNode();
    node.id = { id: "unique-id" } as GlobalId;
    expect(node.getUniqueId()).toBe("unique-id");
  });

  it("should return the correct batch type", () => {
    const node = new DailyDepartmentNotificationBatchNode();
    node.batchNumber = "123C";
    expect(node.batchType()).toBe(BatchType.Check);
  });

  it("should return the correct text", () => {
    const node = new DailyDepartmentNotificationBatchNode();
    node.batchNumber = "123C";
    expect(node.text()).toBe("Batch 123C");
  });
});
