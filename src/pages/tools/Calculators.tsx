import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import ToolLayout from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { toast } from "sonner";

const toolMeta: Record<string, { title: string; desc: string }> = {
  "gpa": { title: "GPA Calculator", desc: "Calculate your Grade Point Average" },
  "age": { title: "Age Calculator", desc: "Calculate your exact age from date of birth" },
  "emi": { title: "EMI Calculator", desc: "Calculate Equated Monthly Installment" },
  "vat-tax": { title: "VAT/Tax Calculator", desc: "Calculate VAT or tax on any amount" },
  "bmi": { title: "BMI Calculator", desc: "Calculate your Body Mass Index" },
  "percentage": { title: "Percentage Calculator", desc: "Calculate percentages easily" },
  "discount": { title: "Discount Calculator", desc: "Calculate discount and final price" },
  "loan": { title: "Loan Calculator", desc: "Calculate loan payments and interest" },
  "tip": { title: "Tip Calculator", desc: "Calculate tip amount and split bills" },
  "unit-converter": { title: "Unit Converter", desc: "Convert between different units of measurement" },
};

const Input = ({ label, value, onChange, type = "number", ...props }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; [k: string]: unknown }) => (
  <div>
    <label className="text-sm font-medium mb-1 block">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
      {...props} />
  </div>
);

const Result = ({ items }: { items: { label: string; value: string | number }[] }) => (
  <div className="grid grid-cols-2 gap-4 mt-6">
    {items.map(i => (
      <div key={i.label} className="tool-card text-center">
        <p className="text-2xl font-bold text-primary">{i.value}</p>
        <p className="text-xs text-muted-foreground">{i.label}</p>
      </div>
    ))}
  </div>
);

// GPA Calculator
const GpaCalc = () => {
  const [courses, setCourses] = useState([{ grade: "4.0", credits: "3" }]);
  const addCourse = () => setCourses([...courses, { grade: "4.0", credits: "3" }]);
  const update = (i: number, field: string, val: string) => {
    const c = [...courses]; c[i] = { ...c[i], [field]: val }; setCourses(c);
  };
  const gpa = courses.reduce((sum, c) => sum + parseFloat(c.grade || "0") * parseFloat(c.credits || "0"), 0) /
    (courses.reduce((sum, c) => sum + parseFloat(c.credits || "0"), 0) || 1);
  return (
    <div className="space-y-4">
      {courses.map((c, i) => (
        <div key={i} className="grid grid-cols-2 gap-4">
          <Input label={`Course ${i + 1} Grade`} value={c.grade} onChange={v => update(i, "grade", v)} step="0.1" min="0" max="4" />
          <Input label="Credits" value={c.credits} onChange={v => update(i, "credits", v)} min="1" />
        </div>
      ))}
      <Button variant="outline" onClick={addCourse}>+ Add Course</Button>
      <Result items={[
        { label: "GPA", value: gpa.toFixed(2) },
        { label: "Total Credits", value: courses.reduce((s, c) => s + parseFloat(c.credits || "0"), 0) },
      ]} />
    </div>
  );
};

// Age Calculator
const AgeCalc = () => {
  const [dob, setDob] = useState("");
  const calc = () => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    return { years, months, days, totalDays: Math.floor((now.getTime() - birth.getTime()) / 86400000) };
  };
  const age = calc();
  return (
    <div className="space-y-4">
      <Input label="Date of Birth" value={dob} onChange={setDob} type="date" />
      {age && <Result items={[
        { label: "Years", value: age.years },
        { label: "Months", value: age.months },
        { label: "Days", value: age.days },
        { label: "Total Days", value: age.totalDays.toLocaleString() },
      ]} />}
    </div>
  );
};

// EMI Calculator
const EmiCalc = () => {
  const [p, setP] = useState("100000");
  const [r, setR] = useState("10");
  const [n, setN] = useState("12");
  const principal = parseFloat(p) || 0;
  const rate = (parseFloat(r) || 0) / 12 / 100;
  const tenure = parseFloat(n) || 1;
  const emi = rate > 0 ? principal * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1) : principal / tenure;
  const totalPayment = emi * tenure;
  return (
    <div className="space-y-4">
      <Input label="Loan Amount" value={p} onChange={setP} />
      <Input label="Interest Rate (% per year)" value={r} onChange={setR} step="0.1" />
      <Input label="Tenure (months)" value={n} onChange={setN} />
      <Result items={[
        { label: "Monthly EMI", value: `৳${emi.toFixed(0)}` },
        { label: "Total Payment", value: `৳${totalPayment.toFixed(0)}` },
        { label: "Total Interest", value: `৳${(totalPayment - principal).toFixed(0)}` },
      ]} />
    </div>
  );
};

// VAT/Tax Calculator
const VatCalc = () => {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("15");
  const a = parseFloat(amount) || 0;
  const r = parseFloat(rate) || 0;
  const tax = a * r / 100;
  return (
    <div className="space-y-4">
      <Input label="Amount" value={amount} onChange={setAmount} />
      <Input label="Tax Rate (%)" value={rate} onChange={setRate} step="0.1" />
      <Result items={[
        { label: "Tax Amount", value: `৳${tax.toFixed(2)}` },
        { label: "Total with Tax", value: `৳${(a + tax).toFixed(2)}` },
        { label: "Tax Rate", value: `${r}%` },
      ]} />
    </div>
  );
};

// BMI Calculator
const BmiCalc = () => {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const h = parseFloat(height) / 100 || 1;
  const w = parseFloat(weight) || 0;
  const bmi = w / (h * h);
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  return (
    <div className="space-y-4">
      <Input label="Height (cm)" value={height} onChange={setHeight} />
      <Input label="Weight (kg)" value={weight} onChange={setWeight} />
      <Result items={[
        { label: "BMI", value: bmi.toFixed(1) },
        { label: "Category", value: category },
      ]} />
    </div>
  );
};

// Percentage Calculator
const PercentCalc = () => {
  const [value, setValue] = useState("25");
  const [total, setTotal] = useState("200");
  const v = parseFloat(value) || 0;
  const t = parseFloat(total) || 1;
  return (
    <div className="space-y-4">
      <Input label="Value" value={value} onChange={setValue} />
      <Input label="Total" value={total} onChange={setTotal} />
      <Result items={[
        { label: "Percentage", value: `${(v / t * 100).toFixed(2)}%` },
        { label: "Fraction", value: `${v}/${t}` },
      ]} />
    </div>
  );
};

// Discount Calculator
const DiscountCalc = () => {
  const [price, setPrice] = useState("1000");
  const [discount, setDiscount] = useState("20");
  const p = parseFloat(price) || 0;
  const d = parseFloat(discount) || 0;
  const savings = p * d / 100;
  return (
    <div className="space-y-4">
      <Input label="Original Price" value={price} onChange={setPrice} />
      <Input label="Discount (%)" value={discount} onChange={setDiscount} />
      <Result items={[
        { label: "You Save", value: `৳${savings.toFixed(2)}` },
        { label: "Final Price", value: `৳${(p - savings).toFixed(2)}` },
        { label: "Discount", value: `${d}%` },
      ]} />
    </div>
  );
};

// Loan Calculator
const LoanCalc = () => {
  const [amount, setAmount] = useState("500000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");
  const a = parseFloat(amount) || 0;
  const r = (parseFloat(rate) || 0) / 12 / 100;
  const n = (parseFloat(years) || 1) * 12;
  const monthly = r > 0 ? a * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : a / n;
  return (
    <div className="space-y-4">
      <Input label="Loan Amount" value={amount} onChange={setAmount} />
      <Input label="Interest Rate (% per year)" value={rate} onChange={setRate} step="0.1" />
      <Input label="Loan Term (years)" value={years} onChange={setYears} />
      <Result items={[
        { label: "Monthly Payment", value: `৳${monthly.toFixed(0)}` },
        { label: "Total Payment", value: `৳${(monthly * n).toFixed(0)}` },
        { label: "Total Interest", value: `৳${(monthly * n - a).toFixed(0)}` },
      ]} />
    </div>
  );
};

// Tip Calculator
const TipCalc = () => {
  const [bill, setBill] = useState("500");
  const [tipPct, setTipPct] = useState("15");
  const [split, setSplit] = useState("1");
  const b = parseFloat(bill) || 0;
  const t = parseFloat(tipPct) || 0;
  const s = parseFloat(split) || 1;
  const tip = b * t / 100;
  return (
    <div className="space-y-4">
      <Input label="Bill Amount" value={bill} onChange={setBill} />
      <Input label="Tip (%)" value={tipPct} onChange={setTipPct} />
      <Input label="Split Between" value={split} onChange={setSplit} min="1" />
      <Result items={[
        { label: "Tip Amount", value: `৳${tip.toFixed(2)}` },
        { label: "Total", value: `৳${(b + tip).toFixed(2)}` },
        { label: "Per Person", value: `৳${((b + tip) / s).toFixed(2)}` },
      ]} />
    </div>
  );
};

// Unit Converter
const units: Record<string, Record<string, number>> = {
  Length: { Meter: 1, Kilometer: 0.001, Centimeter: 100, Millimeter: 1000, Mile: 0.000621371, Yard: 1.09361, Foot: 3.28084, Inch: 39.3701 },
  Weight: { Kilogram: 1, Gram: 1000, Milligram: 1e6, Pound: 2.20462, Ounce: 35.274, Ton: 0.001 },
  Temperature: { Celsius: 1, Fahrenheit: 1, Kelvin: 1 },
};

const UnitConv = () => {
  const [cat, setCat] = useState("Length");
  const [from, setFrom] = useState(Object.keys(units.Length)[0]);
  const [to, setTo] = useState(Object.keys(units.Length)[1]);
  const [value, setValue] = useState("1");
  const v = parseFloat(value) || 0;

  let result: number;
  if (cat === "Temperature") {
    let celsius: number;
    if (from === "Celsius") celsius = v;
    else if (from === "Fahrenheit") celsius = (v - 32) * 5 / 9;
    else celsius = v - 273.15;
    if (to === "Celsius") result = celsius;
    else if (to === "Fahrenheit") result = celsius * 9 / 5 + 32;
    else result = celsius + 273.15;
  } else {
    const baseValue = v / units[cat][from];
    result = baseValue * units[cat][to];
  }

  const unitOptions = Object.keys(units[cat]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Category</label>
        <select value={cat} onChange={e => { setCat(e.target.value); setFrom(Object.keys(units[e.target.value])[0]); setTo(Object.keys(units[e.target.value])[1]); }}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background">
          {Object.keys(units).map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-background">
            {unitOptions.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">To</label>
          <select value={to} onChange={e => setTo(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-background">
            {unitOptions.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <Input label="Value" value={value} onChange={setValue} />
      <Result items={[
        { label: `${from}`, value: v },
        { label: `${to}`, value: parseFloat(result.toFixed(6)) },
      ]} />
    </div>
  );
};

const Calculators = () => {
  const { toolId } = useParams();
  const meta = toolMeta[toolId!];
  if (!meta) return <Navigate to="/tools" replace />;

  const icon = <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20"><Calculator className="h-8 w-8 text-primary" /></div>;

  const renderCalc = () => {
    switch (toolId) {
      case "gpa": return <GpaCalc />;
      case "age": return <AgeCalc />;
      case "emi": return <EmiCalc />;
      case "vat-tax": return <VatCalc />;
      case "bmi": return <BmiCalc />;
      case "percentage": return <PercentCalc />;
      case "discount": return <DiscountCalc />;
      case "loan": return <LoanCalc />;
      case "tip": return <TipCalc />;
      case "unit-converter": return <UnitConv />;
      default: return null;
    }
  };

  return (
    <ToolLayout title={meta.title} description={meta.desc} icon={icon} toolCategory="Calculator">
      <div className="tool-card">{renderCalc()}</div>
    </ToolLayout>
  );
};

export default Calculators;
