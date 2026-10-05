import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/tools/ToolLayout";
import ToolSeo from "@/components/seo/ToolSeo";
import { Calculator } from "lucide-react";
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
  units,
  type CourseGrade,
  type BasicOperator,
  type UnitCategory,
} from "@/lib/calculatorMath";
import calculatorPages from "@/pages/tools/calculatorSeo";

interface CalculatorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "number" | "date";
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

const CalculatorInput = ({ label, value, onChange, type = "number", ...attributes }: CalculatorInputProps) => {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
        {...attributes}
      />
    </div>
  );
};

const CalculatorResults = ({ items }: { items: { label: string; value: string | number }[] }) => (
  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-live="polite">
    {items.map(item => (
      <div key={item.label} className="tool-card text-center">
        <p className="break-words text-2xl font-bold text-primary">{item.value}</p>
        <p className="text-xs text-muted-foreground">{item.label}</p>
      </div>
    ))}
  </div>
);

const InvalidInput = ({ children = "Check the values entered above." }: { children?: string }) => (
  <p role="alert" className="mt-4 text-sm text-destructive">{children}</p>
);

const todayForDateInput = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

const BasicCalculator = () => {
  const [first, setFirst] = useState("12");
  const [operator, setOperator] = useState<BasicOperator>("+");
  const [second, setSecond] = useState("8");
  const result = calculateBasic(first, operator, second);

  return (
    <div className="space-y-4">
      <CalculatorInput label="First Number" value={first} onChange={setFirst} step="any" />
      <div>
        <label htmlFor="basic-operator" className="mb-1 block text-sm font-medium">Operation</label>
        <select
          id="basic-operator"
          value={operator}
          onChange={event => setOperator(event.target.value as BasicOperator)}
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        >
          <option value="+">Addition (+)</option>
          <option value="-">Subtraction (−)</option>
          <option value="×">Multiplication (×)</option>
          <option value="÷">Division (÷)</option>
        </select>
      </div>
      <CalculatorInput label="Second Number" value={second} onChange={setSecond} step="any" />
      {result !== null ? (
        <CalculatorResults items={[{ label: "Result", value: Number(result.toPrecision(12)).toLocaleString() }]} />
      ) : <InvalidInput>Enter valid numbers. The divisor cannot be zero.</InvalidInput>}
    </div>
  );
};

const GpaCalculator = () => {
  const [courses, setCourses] = useState<CourseGrade[]>([{ grade: "4.0", credits: "3" }]);
  const result = calculateGpa(courses);

  const updateCourse = (index: number, field: keyof CourseGrade, value: string) => {
    setCourses(current => current.map((course, courseIndex) =>
      courseIndex === index ? { ...course, [field]: value } : course,
    ));
  };

  return (
    <div className="space-y-4">
      {courses.map((course, index) => (
        <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <CalculatorInput
            label={`Course ${index + 1} Grade (0–4)`}
            value={course.grade}
            onChange={value => updateCourse(index, "grade", value)}
            min="0"
            max="4"
            step="0.01"
          />
          <CalculatorInput
            label={`Course ${index + 1} Credits`}
            value={course.credits}
            onChange={value => updateCourse(index, "credits", value)}
            min="0.01"
            step="0.5"
          />
          {courses.length > 1 && (
            <Button
              type="button"
              variant="outline"
              className="self-end"
              onClick={() => setCourses(current => current.filter((_, courseIndex) => courseIndex !== index))}
              aria-label={`Remove course ${index + 1}`}
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => setCourses(current => [...current, { grade: "4.0", credits: "3" }])}
      >
        + Add Course
      </Button>
      {result ? (
        <CalculatorResults items={[
          { label: "Weighted GPA (4.0 scale)", value: result.gpa.toFixed(2) },
          { label: "Total Credits", value: result.totalCredits.toLocaleString() },
        ]} />
      ) : <InvalidInput>Enter a grade from 0 to 4 and a positive credit value for every course.</InvalidInput>}
    </div>
  );
};

const AgeCalculator = () => {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const result = dateOfBirth ? calculateAge(dateOfBirth) : null;

  return (
    <div className="space-y-4">
      <CalculatorInput
        label="Date of Birth"
        value={dateOfBirth}
        onChange={setDateOfBirth}
        type="date"
        max={todayForDateInput()}
      />
      {result ? (
        <CalculatorResults items={[
          { label: "Years", value: result.years },
          { label: "Months", value: result.months },
          { label: "Days", value: result.days },
          { label: "Total Days", value: result.totalDays.toLocaleString() },
        ]} />
      ) : dateOfBirth
        ? <InvalidInput>Enter a valid date of birth that is today or earlier.</InvalidInput>
        : <p className="text-sm text-muted-foreground">Choose your date of birth to calculate your age.</p>}
    </div>
  );
};

const EmiCalculator = () => {
  const [principal, setPrincipal] = useState("100000");
  const [annualRate, setAnnualRate] = useState("10");
  const [months, setMonths] = useState("12");
  const result = calculateLoan(principal, annualRate, months);

  return (
    <div className="space-y-4">
      <CalculatorInput label="Loan Amount (৳)" value={principal} onChange={setPrincipal} min="0.01" step="any" />
      <CalculatorInput label="Interest Rate (% per year)" value={annualRate} onChange={setAnnualRate} min="0" step="0.01" />
      <CalculatorInput label="Tenure (months)" value={months} onChange={setMonths} min="1" step="1" />
      {result ? (
        <CalculatorResults items={[
          { label: "Monthly EMI", value: `৳${result.monthlyPayment.toFixed(2)}` },
          { label: "Total Payment", value: `৳${result.totalPayment.toFixed(2)}` },
          { label: "Total Interest", value: `৳${result.totalInterest.toFixed(2)}` },
        ]} />
      ) : <InvalidInput>Enter a positive loan amount, a non-negative annual rate, and a whole number of months.</InvalidInput>}
    </div>
  );
};

const VatCalculator = () => {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("15");
  const result = calculateTax(amount, rate);

  return (
    <div className="space-y-4">
      <CalculatorInput label="Amount before tax (৳)" value={amount} onChange={setAmount} min="0" step="any" />
      <CalculatorInput label="Tax Rate (%)" value={rate} onChange={setRate} min="0" step="0.01" />
      {result ? (
        <CalculatorResults items={[
          { label: "Tax Amount", value: `৳${result.tax.toFixed(2)}` },
          { label: "Total with Tax", value: `৳${result.total.toFixed(2)}` },
          { label: "Tax Rate", value: `${result.rate}%` },
        ]} />
      ) : <InvalidInput>Enter an amount and a non-negative tax rate.</InvalidInput>}
    </div>
  );
};

const BmiCalculator = () => {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const result = calculateBmi(height, weight);

  return (
    <div className="space-y-4">
      <CalculatorInput label="Height (cm)" value={height} onChange={setHeight} min="0.01" step="any" />
      <CalculatorInput label="Weight (kg)" value={weight} onChange={setWeight} min="0.01" step="any" />
      {result ? (
        <>
          <CalculatorResults items={[
            { label: "BMI", value: result.bmi.toFixed(1) },
            { label: "Adult BMI Category", value: result.category },
          ]} />
          <p className="text-xs text-muted-foreground">BMI is a screening measure, not a medical diagnosis.</p>
        </>
      ) : <InvalidInput>Enter a height and weight greater than zero.</InvalidInput>}
    </div>
  );
};

const PercentageCalculator = () => {
  const [value, setValue] = useState("25");
  const [total, setTotal] = useState("200");
  const result = calculatePercentage(value, total);

  return (
    <div className="space-y-4">
      <CalculatorInput label="Value" value={value} onChange={setValue} step="any" />
      <CalculatorInput label="Total (cannot be zero)" value={total} onChange={setTotal} step="any" />
      {result ? (
        <CalculatorResults items={[
          { label: "Percentage", value: `${result.percentage.toFixed(2)}%` },
          { label: "Fraction", value: result.fraction },
        ]} />
      ) : <InvalidInput>Enter valid numbers and a non-zero total.</InvalidInput>}
    </div>
  );
};

const DiscountCalculator = () => {
  const [price, setPrice] = useState("1000");
  const [discount, setDiscount] = useState("20");
  const result = calculateDiscount(price, discount);

  return (
    <div className="space-y-4">
      <CalculatorInput label="Original Price (৳)" value={price} onChange={setPrice} min="0" step="any" />
      <CalculatorInput label="Discount (%)" value={discount} onChange={setDiscount} min="0" max="100" step="0.01" />
      {result ? (
        <CalculatorResults items={[
          { label: "You Save", value: `৳${result.savings.toFixed(2)}` },
          { label: "Final Price", value: `৳${result.finalPrice.toFixed(2)}` },
          { label: "Discount", value: `${result.discount}%` },
        ]} />
      ) : <InvalidInput>Enter a non-negative price and a discount from 0 to 100%.</InvalidInput>}
    </div>
  );
};

const LoanCalculator = () => {
  const [amount, setAmount] = useState("500000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");
  const months = Number(years) * 12;
  const result = calculateLoan(amount, rate, months);

  return (
    <div className="space-y-4">
      <CalculatorInput label="Loan Amount (৳)" value={amount} onChange={setAmount} min="0.01" step="any" />
      <CalculatorInput label="Interest Rate (% per year)" value={rate} onChange={setRate} min="0" step="0.01" />
      <CalculatorInput label="Loan Term (years)" value={years} onChange={setYears} min="1" step="1" />
      {result ? (
        <CalculatorResults items={[
          { label: "Monthly Payment", value: `৳${result.monthlyPayment.toFixed(2)}` },
          { label: "Total Payment", value: `৳${result.totalPayment.toFixed(2)}` },
          { label: "Total Interest", value: `৳${result.totalInterest.toFixed(2)}` },
        ]} />
      ) : <InvalidInput>Enter a positive loan amount, a non-negative annual rate, and a whole number of years.</InvalidInput>}
    </div>
  );
};

const TipCalculator = () => {
  const [bill, setBill] = useState("500");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");
  const result = calculateTip(bill, tipPercent, people);

  return (
    <div className="space-y-4">
      <CalculatorInput label="Bill Amount (৳)" value={bill} onChange={setBill} min="0" step="any" />
      <CalculatorInput label="Tip (%)" value={tipPercent} onChange={setTipPercent} min="0" step="0.01" />
      <CalculatorInput label="Number of People" value={people} onChange={setPeople} min="1" step="1" />
      {result ? (
        <CalculatorResults items={[
          { label: "Tip Amount", value: `৳${result.tipAmount.toFixed(2)}` },
          { label: "Total with Tip", value: `৳${result.total.toFixed(2)}` },
          { label: "Per Person", value: `৳${result.perPerson.toFixed(2)}` },
        ]} />
      ) : <InvalidInput>Enter a non-negative bill and tip, and a positive whole number of people.</InvalidInput>}
    </div>
  );
};

const UnitConverter = () => {
  const [category, setCategory] = useState<UnitCategory>("Length");
  const [from, setFrom] = useState("Meter");
  const [to, setTo] = useState("Kilometer");
  const [value, setValue] = useState("1");
  const result = convertUnit(value, category, from, to);
  const options = Object.keys(units[category]);
  const categories = Object.keys(units) as UnitCategory[];

  const updateCategory = (nextCategory: UnitCategory) => {
    const nextUnits = Object.keys(units[nextCategory]);
    setCategory(nextCategory);
    setFrom(nextUnits[0]);
    setTo(nextUnits[1]);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="unit-category" className="mb-1 block text-sm font-medium">Category</label>
        <select
          id="unit-category"
          value={category}
          onChange={event => updateCategory(event.target.value as UnitCategory)}
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        >
          {categories.map(option => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="unit-from" className="mb-1 block text-sm font-medium">From</label>
          <select id="unit-from" value={from} onChange={event => setFrom(event.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3">
            {options.map(option => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="unit-to" className="mb-1 block text-sm font-medium">To</label>
          <select id="unit-to" value={to} onChange={event => setTo(event.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3">
            {options.map(option => <option key={option}>{option}</option>)}
          </select>
        </div>
      </div>
      <CalculatorInput label="Value" value={value} onChange={setValue} step="any" />
      {result !== null ? (
        <CalculatorResults items={[
          { label: from, value: Number(value).toLocaleString() },
          { label: to, value: Number(result.toFixed(6)).toLocaleString() },
        ]} />
      ) : <InvalidInput>Enter a valid number to convert.</InvalidInput>}
    </div>
  );
};

const renderCalculator = (toolId: string) => {
  switch (toolId) {
    case "basic": return <BasicCalculator />;
    case "gpa": return <GpaCalculator />;
    case "age": return <AgeCalculator />;
    case "emi": return <EmiCalculator />;
    case "vat-tax": return <VatCalculator />;
    case "bmi": return <BmiCalculator />;
    case "percentage": return <PercentageCalculator />;
    case "discount": return <DiscountCalculator />;
    case "loan": return <LoanCalculator />;
    case "tip": return <TipCalculator />;
    case "unit-converter": return <UnitConverter />;
    default: return null;
  }
};

const Calculators = () => {
  const { toolId } = useParams();
  const page = toolId ? calculatorPages[toolId] : undefined;
  if (!page || !toolId) return <Navigate to="/tools" replace />;
  const calculatorName = page.title.split(" - ")[0];

  const icon = (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
      <Calculator className="h-8 w-8 text-primary" aria-hidden="true" />
    </div>
  );

  return (
    <>
      <ToolSeo
        title={page.title}
        description={page.description}
        canonicalPath={`/tools/calculator/${toolId}`}
        keywords={page.keywords}
        faqs={page.faqs}
        features={page.features}
      />
      <ToolLayout title={calculatorName} description={page.description} icon={icon} toolCategory="Calculator">
        <div className="space-y-10">
          <section aria-label={`${calculatorName} form`} className="tool-card">
            {renderCalculator(toolId)}
          </section>
          <section aria-labelledby="calculator-guide" className="space-y-4 border-t border-border pt-8">
            <h2 id="calculator-guide" className="text-2xl font-semibold">About the {calculatorName}</h2>
            <p className="leading-7 text-muted-foreground">{page.description}</p>
          </section>
          <section aria-labelledby="calculator-faq" className="border-t border-border pt-8">
            <h2 id="calculator-faq" className="mb-2 text-2xl font-semibold">Frequently asked questions</h2>
            {page.faqs.map(({ question, answer }) => (
              <details key={question} className="border-b border-border py-4">
                <summary className="cursor-pointer font-medium">{question}</summary>
                <p className="pt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
              </details>
            ))}
          </section>
        </div>
      </ToolLayout>
    </>
  );
};

export default Calculators;
