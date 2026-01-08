import React, { useState } from "react";
import { CurrencyFormat, ValueObject } from "currency-fomatter";

// Example Card Component
interface ExampleCardProps {
  title: string;
  icon: string;
  badge: string;
  badgeClass: string;
  children: React.ReactNode;
}

const ExampleCard: React.FC<ExampleCardProps> = ({
  title,
  icon,
  badge,
  badgeClass,
  children,
}) => (
  <div className="example-card">
    <h3>
      <span>{icon}</span>
      {title}
      <span className={`badge ${badgeClass}`}>{badge}</span>
    </h3>
    {children}
  </div>
);

// 1. Basic Currency
const BasicCurrency = () => {
  const [value, setValue] = useState("1234567.89");

  return (
    <ExampleCard
      title="Basic Currency"
      icon="💵"
      badge="Currency"
      badgeClass="badge-currency"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          thousandSeparator=","
          decimalSeparator="."
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value}</code>
      </div>
    </ExampleCard>
  );
};

// 2. Phone Number
const PhoneNumber = () => {
  const [value, setValue] = useState("");

  return (
    <ExampleCard
      title="Phone Number"
      icon="📱"
      badge="Pattern"
      badgeClass="badge-pattern"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          format="+1 (###) ###-####"
          mask="_"
          placeholder="+1 (___) ___-____"
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value || "empty"}</code>
      </div>
    </ExampleCard>
  );
};

// 3. Credit Card
const CreditCard = () => {
  const [value, setValue] = useState("");

  return (
    <ExampleCard
      title="Credit Card"
      icon="💳"
      badge="Pattern"
      badgeClass="badge-pattern"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          format="#### #### #### ####"
          mask="_"
          placeholder="____ ____ ____ ____"
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value || "empty"}</code>
      </div>
    </ExampleCard>
  );
};

// 4. Expiry Date
const ExpiryDate = () => {
  const [value, setValue] = useState("");

  return (
    <ExampleCard
      title="Expiry Date"
      icon="📅"
      badge="Pattern"
      badgeClass="badge-pattern"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          format="##/##"
          mask={["M", "M", "Y", "Y"]}
          placeholder="MM/YY"
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value || "empty"}</code>
      </div>
    </ExampleCard>
  );
};

// 5. Percentage with Limit
const Percentage = () => {
  const [value, setValue] = useState("75");

  return (
    <ExampleCard
      title="Percentage (max 100%)"
      icon="📊"
      badge="Validation"
      badgeClass="badge-validation"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          suffix="%"
          decimalScale={2}
          isAllowed={(values: ValueObject) => {
            const { floatValue } = values;
            return !floatValue || floatValue <= 100;
          }}
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value}%</code>
      </div>
    </ExampleCard>
  );
};

// 6. Max Amount
const MaxAmount = () => {
  const [value, setValue] = useState("5000");

  return (
    <ExampleCard
      title="Max Amount ($10,000)"
      icon="🔒"
      badge="Validation"
      badgeClass="badge-validation"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          thousandSeparator=","
          prefix="$"
          isAllowed={(values: ValueObject) => {
            const { floatValue } = values;
            return !floatValue || floatValue <= 10000;
          }}
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>${value}</code>
      </div>
    </ExampleCard>
  );
};

// 7. Indian Format
const IndianFormat = () => {
  const [value, setValue] = useState("1234567");

  return (
    <ExampleCard
      title="Indian Format (Lakhs)"
      icon="🇮🇳"
      badge="Currency"
      badgeClass="badge-currency"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          thousandSeparator=","
          thousandSpacing="2s"
          prefix="₹"
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value}</code> (₹12,34,567)
      </div>
    </ExampleCard>
  );
};

// 8. Euro Format
const EuroFormat = () => {
  const [value, setValue] = useState("1234.56");

  return (
    <ExampleCard
      title="Euro Format"
      icon="🇪🇺"
      badge="Currency"
      badgeClass="badge-currency"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          thousandSeparator="."
          decimalSeparator=","
          suffix=" €"
          decimalScale={2}
          fixedDecimalScale
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value}</code>
      </div>
    </ExampleCard>
  );
};

// 9. Display Text
const DisplayText = () => {
  return (
    <ExampleCard
      title="Display as Text"
      icon="📝"
      badge="Display"
      badgeClass="badge-display"
    >
      <div className="text-display">
        <CurrencyFormat
          value={9999.99}
          displayType="text"
          thousandSeparator=","
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
        />
      </div>
      <div className="value-display">Renders as a {"<span>"} element</div>
    </ExampleCard>
  );
};

// 10. Negative Numbers
const NegativeNumbers = () => {
  const [value, setValue] = useState("-1234.56");

  return (
    <ExampleCard
      title="Negative Numbers"
      icon="➖"
      badge="Currency"
      badgeClass="badge-currency"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          thousandSeparator=","
          prefix="$"
          allowNegative={true}
          decimalScale={2}
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value}</code>
      </div>
    </ExampleCard>
  );
};

// 11. Custom Input
const CustomInputExample = () => {
  const [value, setValue] = useState("1000");

  const CustomInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
  >((props, ref) => <input {...props} ref={ref} className="custom-input" />);

  return (
    <ExampleCard
      title="Custom Input"
      icon="🎨"
      badge="Custom"
      badgeClass="badge-custom"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          customInput={CustomInput}
          thousandSeparator=","
          prefix="$"
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value}</code>
      </div>
    </ExampleCard>
  );
};

// 12. Custom Format Function
const CustomFormatFunction = () => {
  const [value, setValue] = useState("1234");

  const customFormat = (val: string): string => {
    if (!val) return "";
    const chars = val.split("");
    return chars.join(" - ");
  };

  return (
    <ExampleCard
      title="Custom Format Function"
      icon="⚙️"
      badge="Custom"
      badgeClass="badge-custom"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          format={customFormat}
          onValueChange={(values: ValueObject) => setValue(values.value)}
          placeholder="Type numbers..."
        />
      </div>
      <div className="value-display">
        Value: <code>{value}</code> → {customFormat(value)}
      </div>
    </ExampleCard>
  );
};

// Main App
const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Currency Formatter</h1>
      <p className="subtitle">
        A React component for formatting currency, phone numbers, and more
      </p>

      <div className="examples-grid">
        <BasicCurrency />
        <PhoneNumber />
        <CreditCard />
        <ExpiryDate />
        <Percentage />
        <MaxAmount />
        <IndianFormat />
        <EuroFormat />
        <DisplayText />
        <NegativeNumbers />
        <CustomInputExample />
        <CustomFormatFunction />
      </div>
    </div>
  );
};

export default App;
