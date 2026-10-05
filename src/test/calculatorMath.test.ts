import { describe, expect, it } from "vitest";
import {
  calculateAge,
  calculateBasic,
  calculateBmi,
  calculateDiscount,
  calculateGpa,
  calculateLoan,
  calculatePercentage,
  calculateTax,
  calculateTip,
  convertUnit,
} from "@/lib/calculatorMath";

describe("calculator math", () => {
  it("performs basic arithmetic and rejects division by zero", () => {
    expect(calculateBasic("12.5", "+", "7.5")).toBe(20);
    expect(calculateBasic("12", "-", "5")).toBe(7);
    expect(calculateBasic("12", "×", "5")).toBe(60);
    expect(calculateBasic("12", "÷", "3")).toBe(4);
    expect(calculateBasic("12", "÷", "0")).toBeNull();
  });

  it("calculates weighted GPA and rejects invalid course values", () => {
    expect(calculateGpa([
      { grade: "4", credits: "3" },
      { grade: "3", credits: "1" },
    ])).toEqual({ gpa: 3.75, totalCredits: 4 });
    expect(calculateGpa([{ grade: "4.1", credits: "3" }])).toBeNull();
    expect(calculateGpa([{ grade: "4", credits: "" }])).toBeNull();
  });

  it("calculates age by calendar days and rejects invalid or future dates", () => {
    expect(calculateAge("2000-02-29", new Date(2024, 2, 1))).toEqual({
      years: 24,
      months: 0,
      days: 1,
      totalDays: 8767,
    });
    expect(calculateAge("2025-02-29", new Date(2025, 5, 1))).toBeNull();
    expect(calculateAge("2030-01-01", new Date(2025, 5, 1))).toBeNull();
  });

  it("calculates EMI including a zero-rate loan and rejects invalid terms", () => {
    expect(calculateLoan("1200", "0", "12")).toEqual({
      monthlyPayment: 100,
      totalPayment: 1200,
      totalInterest: 0,
    });
    expect(calculateLoan("1200", "12", "12")?.monthlyPayment).toBeCloseTo(106.62, 2);
    expect(calculateLoan("1200", "12", "0")).toBeNull();
    expect(calculateLoan("1200", "12", "2.5")).toBeNull();
  });

  it("calculates tax-added totals", () => {
    expect(calculateTax("1000", "15")).toEqual({ tax: 150, total: 1150, rate: 15 });
    expect(calculateTax("1000", "-1")).toBeNull();
  });

  it("calculates BMI and rejects zero measurements", () => {
    expect(calculateBmi("170", "70")).toEqual({
      bmi: 70 / 1.7 ** 2,
      category: "Normal",
    });
    expect(calculateBmi("0", "70")).toBeNull();
  });

  it("calculates percentages without hiding division by zero", () => {
    expect(calculatePercentage("25", "200")).toEqual({ percentage: 12.5, fraction: "25/200" });
    expect(calculatePercentage("25", "0")).toBeNull();
  });

  it("calculates discounts and rejects values outside the valid range", () => {
    expect(calculateDiscount("1000", "20")).toEqual({ savings: 200, finalPrice: 800, discount: 20 });
    expect(calculateDiscount("1000", "101")).toBeNull();
  });

  it("calculates tip and an even bill split", () => {
    expect(calculateTip("500", "15", "2")).toEqual({
      tipAmount: 75,
      total: 575,
      perPerson: 287.5,
    });
    expect(calculateTip("500", "15", "0")).toBeNull();
  });

  it("converts length, weight and temperature in both directions", () => {
    expect(convertUnit("1", "Length", "Kilometer", "Meter")).toBe(1000);
    expect(convertUnit("1", "Weight", "Kilogram", "Pound")).toBeCloseTo(2.20462, 5);
    expect(convertUnit("32", "Temperature", "Fahrenheit", "Celsius")).toBeCloseTo(0, 10);
    expect(convertUnit("-40", "Temperature", "Celsius", "Fahrenheit")).toBe(-40);
    expect(convertUnit("", "Length", "Meter", "Inch")).toBeNull();
  });
});
