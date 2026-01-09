import React, { useState } from "react";
import {
  CurrencyFormat,
  ValueObject,
  // Hook
  useCurrencyFormat,
  // Utility functions
  formatCurrency,
  parseCurrency,
  formatCompact,
  parseCompact,
  // Locale functions
  localePresets,
  getFormatOptionsFromLocale,
  detectLocaleFormat,
  getAutoLocaleConfig,
  formatWithIntl,
} from "currency-fomatter";

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

// Section Header
const SectionHeader: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="section-header">
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

// ============================================================
// BASIC EXAMPLES
// ============================================================

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

// ============================================================
// LOCALE EXAMPLES
// ============================================================

// 7. Locale Presets
const LocalePresets = () => {
  const [locale, setLocale] = useState("en-US");
  const [value, setValue] = useState("1234567.89");

  const localeOptions = Object.keys(localePresets);

  return (
    <ExampleCard
      title="Locale Presets"
      icon="🌍"
      badge="Locale"
      badgeClass="badge-locale"
    >
      <div className="input-wrapper">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="locale-select"
        >
          {localeOptions.map((loc) => (
            <option key={loc} value={loc}>
              {loc} ({localePresets[loc].currency})
            </option>
          ))}
        </select>
      </div>
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          {...getFormatOptionsFromLocale(locale)}
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value}</code>
      </div>
    </ExampleCard>
  );
};

// 8. Dynamic Locale Detection
const DynamicLocale = () => {
  const [locale, setLocale] = useState("th-TH");
  const [currency, setCurrency] = useState("THB");
  const [value, setValue] = useState("1234567.89");

  const formatOptions = detectLocaleFormat(locale, currency);

  return (
    <ExampleCard
      title="Dynamic Locale"
      icon="🔄"
      badge="Locale"
      badgeClass="badge-locale"
    >
      <div className="input-row">
        <input
          type="text"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          placeholder="Locale (e.g., th-TH)"
          className="small-input"
        />
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="Currency (e.g., THB)"
          className="small-input"
        />
      </div>
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          {...formatOptions}
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Detected: thousand=<code>{formatOptions.thousandSeparator}</code>{" "}
        decimal=<code>{formatOptions.decimalSeparator}</code> prefix=
        <code>{formatOptions.prefix}</code>
      </div>
    </ExampleCard>
  );
};

// 9. Auto Locale
const AutoLocale = () => {
  const autoConfig = getAutoLocaleConfig("USD");
  const [value, setValue] = useState("1234567.89");

  return (
    <ExampleCard
      title="Auto Browser Locale"
      icon="🌐"
      badge="Locale"
      badgeClass="badge-locale"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          thousandSeparator={autoConfig.thousandSeparator}
          decimalSeparator={autoConfig.decimalSeparator}
          prefix={autoConfig.prefix}
          suffix={autoConfig.suffix}
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Browser locale: <code>{autoConfig.locale}</code>
      </div>
    </ExampleCard>
  );
};

// ============================================================
// HOOK EXAMPLES
// ============================================================

// 10. useCurrencyFormat Hook
const HookExample = () => {
  const { value, formattedValue, setValue, inputProps, reset, clear } =
    useCurrencyFormat({
      locale: "en-US",
      initialValue: 1234.56,
    });

  return (
    <ExampleCard
      title="useCurrencyFormat Hook"
      icon="🪝"
      badge="Hook"
      badgeClass="badge-hook"
    >
      <div className="input-wrapper">
        <CurrencyFormat {...inputProps} />
      </div>
      <div className="value-display">
        Raw: <code>{value}</code> | Formatted: <code>{formattedValue}</code>
      </div>
      <div className="button-row">
        <button onClick={() => setValue(9999.99)}>Set $9,999.99</button>
        <button onClick={reset}>Reset</button>
        <button onClick={clear}>Clear</button>
      </div>
    </ExampleCard>
  );
};

// 11. Hook with Vietnam locale
const HookVietnam = () => {
  const { value, formattedValue, inputProps } = useCurrencyFormat({
    locale: "vi-VN",
    initialValue: 1500000,
  });

  return (
    <ExampleCard
      title="Hook with vi-VN"
      icon="🇻🇳"
      badge="Hook"
      badgeClass="badge-hook"
    >
      <div className="input-wrapper">
        <CurrencyFormat {...inputProps} />
      </div>
      <div className="value-display">
        Raw: <code>{value}</code> | Formatted: <code>{formattedValue}</code>
      </div>
    </ExampleCard>
  );
};

// ============================================================
// UTILITY FUNCTION EXAMPLES
// ============================================================

// 12. formatCurrency Utility
const FormatCurrencyUtil = () => {
  const [input, setInput] = useState("1234567.89");
  const formatted = formatCurrency(input, {
    prefix: "$",
    thousandSeparator: ",",
    decimalScale: 2,
    fixedDecimalScale: true,
  });

  return (
    <ExampleCard
      title="formatCurrency()"
      icon="🔧"
      badge="Utility"
      badgeClass="badge-utility"
    >
      <div className="input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter number..."
        />
      </div>
      <div className="value-display">
        Output: <code>{formatted}</code>
      </div>
      <div className="code-block">
        {`formatCurrency("${input}", { prefix: "$", thousandSeparator: ",", decimalScale: 2 })`}
      </div>
    </ExampleCard>
  );
};

// 13. parseCurrency Utility
const ParseCurrencyUtil = () => {
  const [input, setInput] = useState("$1,234.56");
  const parsed = parseCurrency(input, {
    prefix: "$",
    thousandSeparator: ",",
  });

  return (
    <ExampleCard
      title="parseCurrency()"
      icon="🔍"
      badge="Utility"
      badgeClass="badge-utility"
    >
      <div className="input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter formatted value..."
        />
      </div>
      <div className="value-display">
        value: <code>{parsed.value}</code> | floatValue:{" "}
        <code>{parsed.floatValue}</code>
      </div>
    </ExampleCard>
  );
};

// ============================================================
// COMPACT FORMAT EXAMPLES
// ============================================================

// 14. formatCompact Utility
const FormatCompactUtil = () => {
  const [input, setInput] = useState("1234567890");
  const compact = formatCompact(input, {
    prefix: "$",
    decimalScale: 2,
  });

  return (
    <ExampleCard
      title="formatCompact()"
      icon="📦"
      badge="Compact"
      badgeClass="badge-compact"
    >
      <div className="input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter large number..."
        />
      </div>
      <div className="text-display">{compact}</div>
      <div className="value-display">
        1K = 1,000 | 1M = 1,000,000 | 1B = 1,000,000,000
      </div>
    </ExampleCard>
  );
};

// 15. Compact Vietnamese
const FormatCompactVN = () => {
  const [input, setInput] = useState("1500000000");
  const compact = formatCompact(input, {
    compactDisplay: {
      thousand: " nghìn",
      million: " triệu",
      billion: " tỷ",
      trillion: " nghìn tỷ",
    },
    suffix: " ₫",
    decimalScale: 1,
  });

  return (
    <ExampleCard
      title="Compact Vietnamese"
      icon="🇻🇳"
      badge="Compact"
      badgeClass="badge-compact"
    >
      <div className="input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter amount..."
        />
      </div>
      <div className="text-display">{compact}</div>
      <div className="value-display">
        nghìn = K | triệu = M | tỷ = B
      </div>
    </ExampleCard>
  );
};

// 16. parseCompact Utility
const ParseCompactUtil = () => {
  const [input, setInput] = useState("$2.5M");
  const parsed = parseCompact(input, { prefix: "$" });

  return (
    <ExampleCard
      title="parseCompact()"
      icon="📊"
      badge="Compact"
      badgeClass="badge-compact"
    >
      <div className="input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., $2.5M, 1.5B"
        />
      </div>
      <div className="value-display">
        value: <code>{parsed.value}</code> | floatValue:{" "}
        <code>{parsed.floatValue.toLocaleString()}</code>
      </div>
    </ExampleCard>
  );
};

// ============================================================
// ADVANCED EXAMPLES
// ============================================================

// 17. formatWithIntl
const FormatWithIntlUtil = () => {
  const [locale, setLocale] = useState("de-DE");
  const [value] = useState(1234567.89);

  const formatted = formatWithIntl(value, locale, {
    style: "currency",
    currency: locale === "de-DE" ? "EUR" : locale === "ja-JP" ? "JPY" : "USD",
  });

  return (
    <ExampleCard
      title="formatWithIntl()"
      icon="🌏"
      badge="Intl"
      badgeClass="badge-locale"
    >
      <div className="input-wrapper">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="locale-select"
        >
          <option value="de-DE">de-DE (EUR)</option>
          <option value="ja-JP">ja-JP (JPY)</option>
          <option value="en-US">en-US (USD)</option>
          <option value="fr-FR">fr-FR (EUR)</option>
          <option value="zh-CN">zh-CN (CNY)</option>
        </select>
      </div>
      <div className="text-display">{formatted}</div>
      <div className="value-display">
        Uses native Intl.NumberFormat for accurate formatting
      </div>
    </ExampleCard>
  );
};

// 18. Display as Text
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

// 19. Indian Format
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

// 20. Negative Numbers
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

// Custom Input - defined outside to prevent re-mount
const CustomInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="custom-input" />
);

// 21. Custom Input Component
const CustomInputExample = () => {
  const [value, setValue] = useState("1000");

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
          //@ts-ignore
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

// Main App
const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Currency Formatter</h1>
      <p className="subtitle">
        A React component for formatting currency, phone numbers, and more
      </p>

      <SectionHeader
        title="Basic Examples"
        description="Currency formatting, phone numbers, credit cards, and validation"
      />
      <div className="examples-grid">
        <BasicCurrency />
        <PhoneNumber />
        <CreditCard />
        <ExpiryDate />
        <Percentage />
        <MaxAmount />
      </div>

      <SectionHeader
        title="Locale Support"
        description="Static presets, dynamic detection, and auto browser locale"
      />
      <div className="examples-grid">
        <LocalePresets />
        <DynamicLocale />
        <AutoLocale />
        <IndianFormat />
      </div>

      <SectionHeader
        title="useCurrencyFormat Hook"
        description="React hook for easy state management"
      />
      <div className="examples-grid">
        <HookExample />
        <HookVietnam />
      </div>

      <SectionHeader
        title="Utility Functions"
        description="Standalone functions without rendering components"
      />
      <div className="examples-grid">
        <FormatCurrencyUtil />
        <ParseCurrencyUtil />
      </div>

      <SectionHeader
        title="Compact Format"
        description="Display large numbers as 1K, 1M, 1B"
      />
      <div className="examples-grid">
        <FormatCompactUtil />
        <FormatCompactVN />
        <ParseCompactUtil />
      </div>

      <SectionHeader
        title="Advanced"
        description="Intl formatting, display mode, and custom components"
      />
      <div className="examples-grid">
        <FormatWithIntlUtil />
        <DisplayText />
        <NegativeNumbers />
        <CustomInputExample />
      </div>
    </div>
  );
};

export default App;
