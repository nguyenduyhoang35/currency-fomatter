import React, { useState } from "react";
import CurrencyFormat, { ValueObject } from "../currency";

// Example 1: Basic Currency Format
const BasicCurrencyExample = () => {
  const [value, setValue] = useState("1234567.89");

  const handleValueChange = (values: ValueObject) => {
    console.log("Basic:", values);
    setValue(values.value);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>1. Basic Currency Format</h3>
      <CurrencyFormat
        value={value}
        thousandSeparator=","
        decimalSeparator="."
        prefix="$"
        decimalScale={2}
        fixedDecimalScale
        onValueChange={handleValueChange}
        placeholder="Enter amount"
        style={{ padding: 8, fontSize: 16 }}
      />
      <p>Value: {value}</p>
    </div>
  );
};

// Example 2: Phone Number Format
const PhoneNumberExample = () => {
  const [value, setValue] = useState("");

  const handleValueChange = (values: ValueObject) => {
    console.log("Phone:", values);
    setValue(values.value);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>2. Phone Number Format</h3>
      <CurrencyFormat
        format="+1 (###) ###-####"
        mask="_"
        onValueChange={handleValueChange}
        placeholder="+1 (___) ___-____"
        style={{ padding: 8, fontSize: 16 }}
      />
      <p>Value: {value}</p>
    </div>
  );
};

// Example 3: Credit Card Format
const CreditCardExample = () => {
  const [value, setValue] = useState("");

  const handleValueChange = (values: ValueObject) => {
    console.log("Card:", values);
    setValue(values.value);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>3. Credit Card Format</h3>
      <CurrencyFormat
        format="#### #### #### ####"
        mask="_"
        onValueChange={handleValueChange}
        placeholder="____ ____ ____ ____"
        style={{ padding: 8, fontSize: 16 }}
      />
      <p>Value: {value}</p>
    </div>
  );
};

// Example 4: Percentage Format
const PercentageExample = () => {
  const [value, setValue] = useState("75.5");

  const handleValueChange = (values: ValueObject) => {
    console.log("Percentage:", values);
    setValue(values.value);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>4. Percentage Format</h3>
      <CurrencyFormat
        value={value}
        suffix="%"
        decimalScale={2}
        onValueChange={handleValueChange}
        isAllowed={(values) => {
          const { floatValue } = values;
          return floatValue <= 100;
        }}
        placeholder="Enter percentage"
        style={{ padding: 8, fontSize: 16 }}
      />
      <p>Value: {value}%</p>
    </div>
  );
};

// Example 5: Indian Number System (Lakhs/Crores)
const IndianFormatExample = () => {
  const [value, setValue] = useState("1234567");

  const handleValueChange = (values: ValueObject) => {
    console.log("Indian:", values);
    setValue(values.value);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>5. Indian Number System (12,34,567)</h3>
      <CurrencyFormat
        value={value}
        thousandSeparator=","
        thousandSpacing="2s"
        prefix="₹"
        onValueChange={handleValueChange}
        style={{ padding: 8, fontSize: 16 }}
      />
      <p>Value: {value}</p>
    </div>
  );
};

// Example 6: Display Type Text (Read-only)
const DisplayTextExample = () => {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3>6. Display Type Text (Read-only)</h3>
      <CurrencyFormat
        value={9999.99}
        displayType="text"
        thousandSeparator=","
        prefix="$"
        decimalScale={2}
        fixedDecimalScale
      />
    </div>
  );
};

// Example 7: Custom Input Component
const CustomInputExample = () => {
  const [value, setValue] = useState("500");

  const CustomInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      style={{
        padding: 12,
        fontSize: 18,
        border: "2px solid #007bff",
        borderRadius: 8,
        outline: "none",
      }}
    />
  );

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>7. Custom Input Component</h3>
      <CurrencyFormat
        value={value}
        customInput={CustomInput}
        thousandSeparator=","
        prefix="$"
        onValueChange={(values) => setValue(values.value)}
      />
      <p>Value: {value}</p>
    </div>
  );
};

// Example 8: Negative Numbers
const NegativeNumberExample = () => {
  const [value, setValue] = useState("-1234.56");

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>8. Negative Numbers Allowed</h3>
      <CurrencyFormat
        value={value}
        thousandSeparator=","
        prefix="$"
        allowNegative={true}
        decimalScale={2}
        onValueChange={(values) => setValue(values.value)}
        style={{ padding: 8, fontSize: 16 }}
      />
      <p>Value: {value}</p>
    </div>
  );
};

// Main Example Component
const CurrencyFormatExamples = () => {
  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>CurrencyFormat Component Examples</h1>
      <hr />
      <BasicCurrencyExample />
      <PhoneNumberExample />
      <CreditCardExample />
      <PercentageExample />
      <IndianFormatExample />
      <DisplayTextExample />
      <CustomInputExample />
      <NegativeNumberExample />
    </div>
  );
};

export default CurrencyFormatExamples;
