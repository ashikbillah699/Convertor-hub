import type { SeoFaq } from "@/components/seo/ToolSeo";

export interface CalculatorPageSeo {
  title: string;
  description: string;
  keywords: string[];
  features: string[];
  faqs: SeoFaq[];
}

const calculatorPages: Record<string, CalculatorPageSeo> = {
  basic: {
    title: "Basic Calculator - Add, Subtract, Multiply & Divide | OpticThirst",
    description: "Use a free online basic calculator for addition, subtraction, multiplication and division. Enter two numbers to get an instant result in your browser.",
    keywords: ["basic calculator", "online calculator", "free calculator", "addition subtraction calculator", "multiply divide calculator"],
    features: ["Add, subtract, multiply and divide numbers", "Calculate decimal values", "Prevent division by zero", "Get instant results in your browser"],
    faqs: [
      { question: "Which operations does this calculator support?", answer: "The basic calculator supports addition, subtraction, multiplication and division for whole numbers and decimals." },
      { question: "Can I divide by zero?", answer: "No. Division by zero is undefined, so the calculator asks you to enter a non-zero divisor." },
      { question: "Are calculations processed online on a server?", answer: "No. Basic arithmetic runs locally in your browser and does not require an account." },
    ],
  },
  gpa: {
    title: "GPA Calculator - Calculate Your Grade Point Average | OpticThirst",
    description: "Calculate your weighted GPA from course grades and credits with this free online GPA calculator. Add or remove courses and see your total credits instantly.",
    keywords: ["GPA calculator", "grade point average calculator", "weighted GPA calculator", "college GPA calculator", "calculate GPA online"],
    features: ["Calculate credit-weighted GPA on a 4.0 scale", "Add or remove course rows", "See total credits alongside GPA", "Calculate instantly in your browser"],
    faqs: [
      { question: "How is GPA calculated?", answer: "Multiply each course grade point by its credits, add those weighted points, then divide by total credits." },
      { question: "What GPA scale does this calculator use?", answer: "This calculator uses a 4.0 scale. Enter each course grade from 0 through 4 and its positive credit value." },
      { question: "Can courses have different credit values?", answer: "Yes. Enter the credit value for each course; the result weights each grade according to its credits." },
    ],
  },
  age: {
    title: "Age Calculator - Exact Age in Years, Months & Days | OpticThirst",
    description: "Find your exact age from your date of birth in years, months, days and total days. Free online age calculator with leap-year-aware calendar dates.",
    keywords: ["age calculator", "exact age calculator", "date of birth calculator", "age in years months days", "calculate age online"],
    features: ["Calculate age in calendar years, months and days", "Show the total number of elapsed days", "Validate dates and prevent future birth dates", "Calculate privately in your browser"],
    faqs: [
      { question: "How do I calculate my exact age?", answer: "Choose your date of birth. The calculator compares it with today's calendar date and shows years, months, days and total elapsed days." },
      { question: "Does this age calculator support leap years?", answer: "Yes. Calendar dates and elapsed days are calculated using UTC calendar days to avoid daylight-saving clock changes." },
      { question: "Can I enter a future date of birth?", answer: "No. A future date is invalid and the calculator asks for a date that is today or earlier." },
    ],
  },
  emi: {
    title: "EMI Calculator - Monthly Loan Payment & Interest | OpticThirst",
    description: "Estimate your monthly loan EMI, total repayment and total interest from the loan amount, annual interest rate and repayment months with this free EMI calculator.",
    keywords: ["EMI calculator", "loan EMI calculator", "monthly installment calculator", "loan payment calculator", "EMI calculation online"],
    features: ["Estimate monthly loan installments", "Calculate total repayment and interest", "Handle zero-interest loans", "Recalculate instantly as inputs change"],
    faqs: [
      { question: "What does EMI mean?", answer: "EMI means Equated Monthly Installment, the regular monthly payment used to repay a loan over its term." },
      { question: "How is monthly EMI calculated?", answer: "For a fixed-rate loan, EMI uses the principal, monthly interest rate and number of monthly payments. A zero-interest loan is divided evenly across the term." },
      { question: "Are the results a lender quote?", answer: "No. Results are estimates and do not include lender fees, insurance, taxes or rate changes." },
    ],
  },
  "vat-tax": {
    title: "VAT & Tax Calculator - Add Tax to an Amount | OpticThirst",
    description: "Calculate VAT or sales tax on an amount and see the tax-inclusive total instantly. Free online tax calculator for quick estimates.",
    keywords: ["VAT calculator", "tax calculator", "sales tax calculator", "add VAT to price", "tax amount calculator"],
    features: ["Calculate tax amount from a percentage rate", "Show the total including tax", "Support decimal rates", "Run instantly in your browser"],
    faqs: [
      { question: "How do I calculate VAT on a price?", answer: "Enter the pre-tax amount and VAT rate. Tax is amount multiplied by rate divided by 100; the total is amount plus tax." },
      { question: "Can I use this for sales tax?", answer: "Yes. Enter the applicable tax rate to estimate the tax amount and tax-inclusive total." },
      { question: "Does it calculate tax-inclusive prices backwards?", answer: "This calculator adds tax to a pre-tax amount. It does not extract a tax portion from a tax-inclusive price." },
    ],
  },
  bmi: {
    title: "BMI Calculator - Body Mass Index from Height & Weight | OpticThirst",
    description: "Calculate body mass index (BMI) from height in centimeters and weight in kilograms, with a standard adult BMI category. Free private online calculator.",
    keywords: ["BMI calculator", "body mass index calculator", "BMI calculator kg cm", "calculate BMI online", "height weight calculator"],
    features: ["Calculate BMI from metric height and weight", "Show standard adult BMI ranges", "Reject zero or invalid measurements", "Calculate without uploading personal data"],
    faqs: [
      { question: "How is BMI calculated?", answer: "BMI is weight in kilograms divided by height in meters squared." },
      { question: "What do the BMI categories mean?", answer: "For adults, standard ranges are under 18.5 (underweight), 18.5 to under 25 (normal), 25 to under 30 (overweight), and 30 or more (obese)." },
      { question: "Is BMI a medical diagnosis?", answer: "No. BMI is a screening measure and does not account for every health factor. Consult a qualified healthcare professional for medical advice." },
    ],
  },
  percentage: {
    title: "Percentage Calculator - Find What Percent One Number Is | OpticThirst",
    description: "Find what percentage one number is of another with this free percentage calculator. Enter a value and total to get the percentage immediately.",
    keywords: ["percentage calculator", "what percent calculator", "percent of total calculator", "percentage finder", "calculate percentage online"],
    features: ["Calculate a value as a percentage of a total", "Show the input fraction", "Support decimal and negative values", "Recalculate instantly"],
    faqs: [
      { question: "How do I find what percent a number is of another?", answer: "Divide the value by the total and multiply by 100. The calculator displays the result as a percentage." },
      { question: "Can a percentage be over 100%?", answer: "Yes. If the value is larger than the total, the calculated percentage is greater than 100%." },
      { question: "Why can't the total be zero?", answer: "Division by zero is undefined, so a percentage cannot be calculated when the total is zero." },
    ],
  },
  discount: {
    title: "Discount Calculator - Sale Price & Savings | OpticThirst",
    description: "Calculate how much you save and the final sale price after a percentage discount. Free discount calculator for shopping and price comparisons.",
    keywords: ["discount calculator", "sale price calculator", "percentage discount calculator", "discount savings calculator", "price after discount"],
    features: ["Calculate savings from a percentage discount", "Show final price after discount", "Validate discount between 0 and 100 percent", "Calculate prices instantly"],
    faqs: [
      { question: "How do I calculate the price after a discount?", answer: "Multiply the original price by the discount percentage to find the savings, then subtract the savings from the original price." },
      { question: "Can I enter a discount greater than 100%?", answer: "No. A discount must be between 0% and 100% so the final price does not become negative." },
      { question: "Does the result include sales tax?", answer: "No. The result is the discounted price before any tax, shipping or other fees." },
    ],
  },
  loan: {
    title: "Loan Calculator - Monthly Payment & Total Interest | OpticThirst",
    description: "Estimate monthly payments, total repayment and interest for a fixed-rate loan. Enter the loan amount, annual interest rate and term in years.",
    keywords: ["loan calculator", "monthly loan payment calculator", "loan interest calculator", "loan repayment calculator", "fixed rate loan calculator"],
    features: ["Estimate fixed-rate monthly loan payments", "Show total repayment and total interest", "Support zero-interest loans", "Calculate locally with no sign-up"],
    faqs: [
      { question: "How are fixed-rate loan payments estimated?", answer: "The calculator applies the standard amortization formula using the principal, annual interest rate and monthly payment count." },
      { question: "Does it support a zero-interest loan?", answer: "Yes. For a zero-interest loan, the principal is divided evenly across the monthly payment count." },
      { question: "Are fees and variable rates included?", answer: "No. The estimate assumes a fixed annual rate and excludes fees, taxes, insurance and changes to the interest rate." },
    ],
  },
  tip: {
    title: "Tip Calculator - Calculate Tip & Split a Bill | OpticThirst",
    description: "Calculate a restaurant tip, the total bill and the amount each person pays when splitting the bill. Free online tip calculator.",
    keywords: ["tip calculator", "bill split calculator", "restaurant tip calculator", "tip per person calculator", "split bill with tip"],
    features: ["Calculate tip amount from bill and percentage", "Add tip to find the total bill", "Split the total between people", "Support decimal tip rates"],
    faqs: [
      { question: "How is the tip calculated?", answer: "The tip is the bill amount multiplied by the tip percentage divided by 100." },
      { question: "How do I split a bill with tip?", answer: "Enter the number of people. The calculator divides the bill plus tip evenly among them." },
      { question: "Can the number of people be a fraction?", answer: "No. The split count must be a positive whole number of people." },
    ],
  },
  "unit-converter": {
    title: "Unit Converter - Length, Weight & Temperature | OpticThirst",
    description: "Convert common length, weight and temperature units online. Choose a category, source unit and target unit to see an instant conversion.",
    keywords: ["unit converter", "length converter", "weight converter", "temperature converter", "metric conversion calculator"],
    features: ["Convert meters, kilometers, miles, feet and more", "Convert kilograms, pounds, grams and ounces", "Convert Celsius, Fahrenheit and Kelvin", "Convert values instantly in your browser"],
    faqs: [
      { question: "Which units can I convert?", answer: "The converter supports common length, weight and temperature units, including meters, kilometers, miles, kilograms, pounds, Celsius, Fahrenheit and Kelvin." },
      { question: "How are temperature conversions handled?", answer: "Temperature conversion uses the Celsius scale as the intermediate value and applies the standard Celsius, Fahrenheit and Kelvin formulas." },
      { question: "Can I convert negative temperatures?", answer: "Yes. Negative temperatures are supported. The displayed value follows the selected units." },
    ],
  },
};

export default calculatorPages;
