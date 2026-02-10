import React, { useState } from "react";
import {
  CurrencyFormat,
  PatternFormat,
  ValueObject,
  // Hooks
  useCurrencyFormat,
  useCurrencyInput,
  // Utility functions
  formatCurrency,
  parseCurrency,
  formatCompact,
  parseCompact,
  // Currency database (ISO 4217)
  getCurrencyConfig,
  // Locale functions
  localePresets,
  getFormatOptionsFromLocale,
  detectLocaleFormat,
  getAutoLocaleConfig,
  formatWithIntl,
} from "kurrency-kit";

// ============================================================
// Shared Components
// ============================================================

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
// LAYER 1: STANDALONE UTILITIES (No React needed)
// ============================================================

const FormatCurrencyDemo = () => {
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
      <div className="text-display">{formatted}</div>
      <div className="code-block">
        {`formatCurrency("${input}", { prefix: "$", thousandSeparator: ",", decimalScale: 2 })`}
      </div>
    </ExampleCard>
  );
};

const ParseCurrencyDemo = () => {
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
      <div className="code-block">
        {`parseCurrency("${input}", { prefix: "$", thousandSeparator: "," })`}
      </div>
    </ExampleCard>
  );
};

const GetCurrencyConfigDemo = () => {
  const [currency, setCurrency] = useState("USD");
  const config = getCurrencyConfig(currency);
  const formatted = formatCurrency(1234567.89, config);

  const currencies = ["USD", "EUR", "GBP", "JPY", "VND", "INR", "CNY", "KRW", "THB", "BRL"];

  return (
    <ExampleCard
      title="getCurrencyConfig()"
      icon="🏦"
      badge="ISO 4217"
      badgeClass="badge-iso"
    >
      <div className="input-wrapper">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="locale-select"
        >
          {currencies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="text-display">{formatted}</div>
      <div className="value-display">
        prefix: <code>{config.prefix || '""'}</code> | suffix: <code>{config.suffix || '""'}</code> | decimals: <code>{config.decimalScale}</code>
      </div>
    </ExampleCard>
  );
};

const FormatCompactDemo = () => {
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

const ParseCompactDemo = () => {
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

const CompactVietnameseDemo = () => {
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

// ============================================================
// LAYER 2: REACT HOOKS (Headless — bring your own UI)
// ============================================================

const UseCurrencyInputDemo = () => {
  const { value, formattedValue, getInputProps, setValue, reset, clear } =
    useCurrencyInput({
      currency: "USD",
      initialValue: 1234.56,
    });

  return (
    <ExampleCard
      title="useCurrencyInput (USD)"
      icon="🪝"
      badge="Headless"
      badgeClass="badge-headless"
    >
      <div className="input-wrapper">
        <input {...getInputProps()} />
      </div>
      <div className="value-display">
        Raw: <code>{value}</code> | Display: <code>{formattedValue}</code>
      </div>
      <div className="button-row">
        <button onClick={() => setValue(9999.99)}>Set $9,999.99</button>
        <button onClick={reset}>Reset</button>
        <button onClick={clear}>Clear</button>
      </div>
    </ExampleCard>
  );
};

const UseCurrencyInputJPYDemo = () => {
  const { value, formattedValue, getInputProps } = useCurrencyInput({
    currency: "JPY",
    initialValue: 150000,
  });

  return (
    <ExampleCard
      title="useCurrencyInput (JPY)"
      icon="🇯🇵"
      badge="Headless"
      badgeClass="badge-headless"
    >
      <div className="input-wrapper">
        <input {...getInputProps()} />
      </div>
      <div className="value-display">
        Raw: <code>{value}</code> | Display: <code>{formattedValue}</code>
      </div>
      <div className="code-block">
        {`useCurrencyInput({ currency: "JPY" }) → auto ¥, 0 decimals`}
      </div>
    </ExampleCard>
  );
};

const UseCurrencyFormatDemo = () => {
  const { value, formattedValue, setValue, inputProps, reset, clear } =
    useCurrencyFormat({
      locale: "en-US",
      initialValue: 1234.56,
    });

  return (
    <ExampleCard
      title="useCurrencyFormat"
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

const UseCurrencyFormatVNDemo = () => {
  const { value, formattedValue, inputProps } = useCurrencyFormat({
    locale: "vi-VN",
    initialValue: 1500000,
  });

  return (
    <ExampleCard
      title="useCurrencyFormat (vi-VN)"
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
// LAYER 3: REACT COMPONENTS — CurrencyFormat
// ============================================================

const BasicCurrencyDemo = () => {
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

const ThousandsGroupStyleDemo = () => {
  const [style, setStyle] = useState<string>("thousand");
  const [value, setValue] = useState("1234567");

  const labels: Record<string, string> = {
    thousand: "1,234,567 (Western)",
    lakh: "12,34,567 (Indian)",
    wan: "123,4567 (Chinese)",
    none: "1234567 (No grouping)",
  };

  return (
    <ExampleCard
      title="thousandsGroupStyle"
      icon="🔢"
      badge="New"
      badgeClass="badge-new"
    >
      <div className="input-wrapper">
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="locale-select"
        >
          {Object.entries(labels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          thousandSeparator=","
          thousandsGroupStyle={style as any}
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

const AllowedDecimalSeparatorsDemo = () => {
  const [value, setValue] = useState("1234.56");

  return (
    <ExampleCard
      title="allowedDecimalSeparators"
      icon="⌨️"
      badge="New"
      badgeClass="badge-new"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          value={value}
          thousandSeparator="."
          decimalSeparator=","
          allowedDecimalSeparators={[",", "."]}
          prefix="€"
          decimalScale={2}
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Press <code>.</code> or <code>,</code> for decimal — Value: <code>{value}</code>
      </div>
    </ExampleCard>
  );
};

const DefaultValueDemo = () => {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <ExampleCard
      title="defaultValue (Uncontrolled)"
      icon="📋"
      badge="New"
      badgeClass="badge-new"
    >
      <div className="input-wrapper">
        <CurrencyFormat
          defaultValue={1000}
          thousandSeparator=","
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        onValueChange: <code>{value ?? "waiting..."}</code>
      </div>
    </ExampleCard>
  );
};

const AllowEmptyFormattingDemo = () => (
  <ExampleCard
    title="allowEmptyFormatting"
    icon="✨"
    badge="New"
    badgeClass="badge-new"
  >
    <div className="input-wrapper">
      <CurrencyFormat
        prefix="$"
        suffix=" USD"
        thousandSeparator=","
        allowEmptyFormatting
        decimalScale={2}
        fixedDecimalScale
      />
    </div>
    <div className="value-display">
      Shows <code>$  USD</code> even when empty
    </div>
  </ExampleCard>
);

const PercentageDemo = () => {
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

const NegativeNumbersDemo = () => {
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
          allowNegative
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

const DisplayTextDemo = () => (
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
    <div className="value-display">
      Renders as <code>{"<span>"}</code> with <code>role="status"</code> and <code>aria-live="polite"</code>
    </div>
  </ExampleCard>
);

// Custom Input - defined outside to prevent re-mount
const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="custom-input" />
);

const CustomInputDemo = () => {
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
          customInput={StyledInput}
          thousandSeparator=","
          prefix="$"
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Works with Material UI, Chakra, Ant Design, etc.
      </div>
    </ExampleCard>
  );
};

// ============================================================
// LAYER 3: REACT COMPONENTS — PatternFormat
// ============================================================

const PhoneNumberDemo = () => {
  const [value, setValue] = useState("");

  return (
    <ExampleCard
      title="Phone Number"
      icon="📱"
      badge="Pattern"
      badgeClass="badge-pattern"
    >
      <div className="input-wrapper">
        <PatternFormat
          format="+1 (###) ###-####"
          mask="_"
          allowEmptyFormatting
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value || "empty"}</code>
      </div>
    </ExampleCard>
  );
};

const CreditCardDemo = () => {
  const [value, setValue] = useState("");

  return (
    <ExampleCard
      title="Credit Card"
      icon="💳"
      badge="Pattern"
      badgeClass="badge-pattern"
    >
      <div className="input-wrapper">
        <PatternFormat
          format="#### #### #### ####"
          mask="_"
          allowEmptyFormatting
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value || "empty"}</code>
      </div>
    </ExampleCard>
  );
};

const ExpiryDateDemo = () => {
  const [value, setValue] = useState("");

  return (
    <ExampleCard
      title="Expiry Date"
      icon="📅"
      badge="Pattern"
      badgeClass="badge-pattern"
    >
      <div className="input-wrapper">
        <PatternFormat
          format="##/##"
          mask={["M", "M", "Y", "Y"]}
          allowEmptyFormatting
          onValueChange={(values: ValueObject) => setValue(values.value)}
        />
      </div>
      <div className="value-display">
        Value: <code>{value || "empty"}</code>
      </div>
    </ExampleCard>
  );
};

// ============================================================
// LOCALE SUPPORT
// ============================================================

const LocalePresetsDemo = () => {
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

const DynamicLocaleDemo = () => {
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

const AutoLocaleDemo = () => {
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

const FormatWithIntlDemo = () => {
  const [locale, setLocale] = useState("de-DE");
  const [value] = useState(1234567.89);

  const currencyMap: Record<string, string> = {
    "de-DE": "EUR",
    "ja-JP": "JPY",
    "en-US": "USD",
    "fr-FR": "EUR",
    "zh-CN": "CNY",
  };

  const formatted = formatWithIntl(value, locale, {
    style: "currency",
    currency: currencyMap[locale] || "USD",
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

// ============================================================
// MAIN APP
// ============================================================

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>kurrency-kit</h1>
      <p className="subtitle">
        The currency toolkit for React — format, parse, and input currencies with zero config.
      </p>
      <div className="layer-badges">
        <span className="layer-badge layer-1">Layer 1: Standalone Utils</span>
        <span className="layer-badge layer-2">Layer 2: React Hooks</span>
        <span className="layer-badge layer-3">Layer 3: React Components</span>
      </div>

      {/* LAYER 1 */}
      <SectionHeader
        title="Layer 1: Standalone Utilities"
        description="Pure functions — no React needed. Works in Node.js, SSR, Deno, anywhere."
      />
      <div className="examples-grid">
        <FormatCurrencyDemo />
        <ParseCurrencyDemo />
        <GetCurrencyConfigDemo />
        <FormatCompactDemo />
        <ParseCompactDemo />
        <CompactVietnameseDemo />
      </div>

      {/* LAYER 2 */}
      <SectionHeader
        title="Layer 2: React Hooks (Headless)"
        description="Bring your own UI — works with plain <input>, Material UI, Chakra, Ant Design, anything."
      />
      <div className="examples-grid">
        <UseCurrencyInputDemo />
        <UseCurrencyInputJPYDemo />
        <UseCurrencyFormatDemo />
        <UseCurrencyFormatVNDemo />
      </div>

      {/* LAYER 3: CurrencyFormat */}
      <SectionHeader
        title="Layer 3: CurrencyFormat Component"
        description="Drop-in input with full formatting, validation, and accessibility."
      />
      <div className="examples-grid">
        <BasicCurrencyDemo />
        <ThousandsGroupStyleDemo />
        <AllowedDecimalSeparatorsDemo />
        <DefaultValueDemo />
        <AllowEmptyFormattingDemo />
        <PercentageDemo />
        <NegativeNumbersDemo />
        <DisplayTextDemo />
        <CustomInputDemo />
      </div>

      {/* LAYER 3: PatternFormat */}
      <SectionHeader
        title="Layer 3: PatternFormat Component"
        description="Focused component for pattern-based formatting — phone, card, date."
      />
      <div className="examples-grid">
        <PhoneNumberDemo />
        <CreditCardDemo />
        <ExpiryDateDemo />
      </div>

      {/* LOCALE */}
      <SectionHeader
        title="Locale Support"
        description="Static presets, dynamic detection via Intl, and auto browser locale."
      />
      <div className="examples-grid">
        <LocalePresetsDemo />
        <DynamicLocaleDemo />
        <AutoLocaleDemo />
        <FormatWithIntlDemo />
      </div>
    </div>
  );
};

export default App;
