export interface CourseGrade {
  grade: string;
  credits: string;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface BmiResult {
  bmi: number;
  category: "Underweight" | "Normal" | "Overweight" | "Obese";
}

export interface TipResult {
  tipAmount: number;
  total: number;
  perPerson: number;
}

export type UnitCategory = "Length" | "Weight" | "Temperature";
export type BasicOperator = "+" | "-" | "×" | "÷";

export const units: Record<UnitCategory, Record<string, number>> = {
  Length: {
    Meter: 1,
    Kilometer: 0.001,
    Centimeter: 100,
    Millimeter: 1000,
    Mile: 0.000621371192,
    Yard: 1.093613298,
    Foot: 3.280839895,
    Inch: 39.37007874,
  },
  Weight: {
    Kilogram: 1,
    Gram: 1000,
    Milligram: 1_000_000,
    Pound: 2.204622622,
    Ounce: 35.27396195,
    Ton: 0.001,
  },
  Temperature: { Celsius: 1, Fahrenheit: 1, Kelvin: 1 },
};

const readFiniteNumber = (value: string | number): number | null => {
  if (typeof value === "string" && value.trim() === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
};

export const calculateBasic = (
  firstValue: string | number,
  operator: BasicOperator,
  secondValue: string | number,
): number | null => {
  const first = readFiniteNumber(firstValue);
  const second = readFiniteNumber(secondValue);
  if (first === null || second === null || (operator === "÷" && second === 0)) return null;

  const result = operator === "+"
    ? first + second
    : operator === "-"
      ? first - second
      : operator === "×"
        ? first * second
        : first / second;
  return Number.isFinite(result) ? result : null;
};

export const calculateGpa = (courses: CourseGrade[]): GpaResult | null => {
  if (!courses.length) return null;

  let weightedGradeTotal = 0;
  let totalCredits = 0;

  for (const course of courses) {
    const grade = readFiniteNumber(course.grade);
    const credits = readFiniteNumber(course.credits);
    if (grade === null || credits === null || grade < 0 || grade > 4 || credits <= 0) return null;
    weightedGradeTotal += grade * credits;
    totalCredits += credits;
  }

  const gpa = weightedGradeTotal / totalCredits;
  return totalCredits > 0 && Number.isFinite(gpa) && Number.isFinite(totalCredits)
    ? { gpa, totalCredits }
    : null;
};

export const calculateAge = (dateOfBirth: string, referenceDate = new Date()): AgeResult | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return null;

  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const birth = new Date(Date.UTC(year, month - 1, day));
  const today = new Date(Date.UTC(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  ));

  if (
    birth.getUTCFullYear() !== year
    || birth.getUTCMonth() !== month - 1
    || birth.getUTCDate() !== day
    || birth.getTime() > today.getTime()
  ) return null;

  let years = today.getUTCFullYear() - year;
  let months = today.getUTCMonth() - (month - 1);
  let days = today.getUTCDate() - day;

  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years,
    months,
    days,
    totalDays: (today.getTime() - birth.getTime()) / 86_400_000,
  };
};

export const calculateLoan = (
  principal: string | number,
  annualRatePercent: string | number,
  numberOfMonths: string | number,
): LoanResult | null => {
  const amount = readFiniteNumber(principal);
  const annualRate = readFiniteNumber(annualRatePercent);
  const months = readFiniteNumber(numberOfMonths);

  if (
    amount === null || annualRate === null || months === null
    || amount <= 0 || annualRate < 0 || months <= 0 || !Number.isInteger(months)
  ) return null;

  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = monthlyRate === 0
    ? amount / months
    : amount * monthlyRate / (1 - (1 + monthlyRate) ** -months);
  const totalPayment = monthlyPayment * months;
  if (!Number.isFinite(monthlyPayment) || !Number.isFinite(totalPayment)) return null;

  return { monthlyPayment, totalPayment, totalInterest: totalPayment - amount };
};

export const calculateTax = (amount: string | number, ratePercent: string | number) => {
  const baseAmount = readFiniteNumber(amount);
  const rate = readFiniteNumber(ratePercent);
  if (baseAmount === null || rate === null || baseAmount < 0 || rate < 0) return null;
  const tax = baseAmount * rate / 100;
  if (!Number.isFinite(tax)) return null;
  return { tax, total: baseAmount + tax, rate };
};

export const calculateBmi = (heightCm: string | number, weightKg: string | number): BmiResult | null => {
  const height = readFiniteNumber(heightCm);
  const weight = readFiniteNumber(weightKg);
  if (height === null || weight === null || height <= 0 || weight <= 0) return null;

  const bmi = weight / ((height / 100) ** 2);
  if (!Number.isFinite(bmi)) return null;
  const category = bmi < 18.5
    ? "Underweight"
    : bmi < 25
      ? "Normal"
      : bmi < 30
        ? "Overweight"
        : "Obese";
  return { bmi, category };
};

export const calculatePercentage = (value: string | number, total: string | number) => {
  const part = readFiniteNumber(value);
  const whole = readFiniteNumber(total);
  if (part === null || whole === null || whole === 0) return null;
  const percentage = part / whole * 100;
  return Number.isFinite(percentage) ? { percentage, fraction: `${part}/${whole}` } : null;
};

export const calculateDiscount = (price: string | number, discountPercent: string | number) => {
  const originalPrice = readFiniteNumber(price);
  const discount = readFiniteNumber(discountPercent);
  if (
    originalPrice === null || discount === null
    || originalPrice < 0 || discount < 0 || discount > 100
  ) return null;
  const savings = originalPrice * discount / 100;
  if (!Number.isFinite(savings)) return null;
  return { savings, finalPrice: originalPrice - savings, discount };
};

export const calculateTip = (
  bill: string | number,
  tipPercent: string | number,
  people: string | number,
): TipResult | null => {
  const billAmount = readFiniteNumber(bill);
  const tipRate = readFiniteNumber(tipPercent);
  const splitCount = readFiniteNumber(people);
  if (
    billAmount === null || tipRate === null || splitCount === null
    || billAmount < 0 || tipRate < 0 || splitCount <= 0 || !Number.isInteger(splitCount)
  ) return null;

  const tipAmount = billAmount * tipRate / 100;
  const total = billAmount + tipAmount;
  const perPerson = total / splitCount;
  return Number.isFinite(tipAmount) && Number.isFinite(total) && Number.isFinite(perPerson)
    ? { tipAmount, total, perPerson }
    : null;
};

export const convertUnit = (
  value: string | number,
  category: UnitCategory,
  from: string,
  to: string,
): number | null => {
  const amount = readFiniteNumber(value);
  if (amount === null || !(from in units[category]) || !(to in units[category])) return null;

  if (category !== "Temperature") {
    const converted = amount / units[category][from] * units[category][to];
    return Number.isFinite(converted) ? converted : null;
  }

  const celsius = from === "Celsius"
    ? amount
    : from === "Fahrenheit"
      ? (amount - 32) * 5 / 9
      : amount - 273.15;
  const converted = to === "Celsius"
    ? celsius
    : to === "Fahrenheit"
      ? celsius * 9 / 5 + 32
      : celsius + 273.15;
  return Number.isFinite(converted) ? converted : null;
};
