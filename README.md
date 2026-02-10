# kurrency-kit

**The currency toolkit for React** — format, parse, and input currencies with zero config.

Unlike other formatting libraries that only give you a component, `kurrency-kit` gives you **3 layers** you can use independently:

| Layer | What | Use case |
|-------|------|----------|
| `formatCurrency()` / `parseCurrency()` | Standalone functions | Node.js, SSR, any JS — no React needed |
| `useCurrencyInput()` / `useCurrencyFormat()` | React hooks | Headless — bring your own UI |
| `<CurrencyFormat />` / `<PatternFormat />` | React components | Drop-in input with full formatting |

**[Live Demo](https://dist-wine-psi.vercel.app)**

```bash
npm install kurrency-kit
```

## Why kurrency-kit?

| Feature | kurrency-kit | react-number-format | react-currency-input-field |
|---------|:-:|:-:|:-:|
| Standalone utils (no React) | **Yes** | No | No |
| Format + Parse symmetry | **Yes** | No | No |
| Compact format (1K, 1M, 1B) | **Yes** | No | No |
| ISO 4217 currency database | **Yes** | No | No |
| Auto locale detection (Intl) | **Yes** | No | Partial |
| React hook (headless) | **Yes** | No | No |
| IME support (CJK input) | **Yes** | No | No |
| Mobile keyboard (`inputMode`) | **Auto** | Manual | Manual |
| Accessibility (ARIA) | **Built-in** | No | No |
| Pattern format (phone, card) | **Yes** | Yes | No |
| Custom input component | **Yes** | Yes | Yes |
| TypeScript | **Yes** | Yes | Yes |
| Bundle size | ~8KB | ~7KB | ~10KB |

## Quick Start

### Just format a number (no React)

```ts
import { formatCurrency, parseCurrency } from "kurrency-kit";

formatCurrency(1234567.89, { prefix: "$", thousandSeparator: "," });
// → "$1,234,567.89"

parseCurrency("$1,234,567.89", { prefix: "$", thousandSeparator: "," });
// → { value: "1234567.89", floatValue: 1234567.89 }
```

### Auto-config from currency code (ISO 4217)

```ts
import { getCurrencyConfig, formatCurrency } from "kurrency-kit";

const usd = getCurrencyConfig("USD"); // { prefix: "$", decimalScale: 2, ... }
const jpy = getCurrencyConfig("JPY"); // { prefix: "¥", decimalScale: 0, ... }
const vnd = getCurrencyConfig("VND"); // { suffix: " ₫", decimalScale: 0, ... }

formatCurrency(1234567, getCurrencyConfig("EUR"));
// → "1,234,567.00 €"
```

50+ currencies built-in. Unknown currencies fall back to `Intl.NumberFormat`.

### React component

```tsx
import { CurrencyFormat } from "kurrency-kit";

<CurrencyFormat
  value={1234.56}
  prefix="$"
  thousandSeparator=","
  decimalScale={2}
  fixedDecimalScale
  onValueChange={(values) => {
    console.log(values.floatValue); // 1234.56
  }}
/>
```

### React hook — headless, works with ANY input

```tsx
import { useCurrencyInput } from "kurrency-kit";

function PriceInput() {
  const { value, formattedValue, getInputProps } = useCurrencyInput({
    currency: "USD",     // Auto-configures $, 2 decimals
    initialValue: 1234.56,
  });

  // Works with plain <input>, Material UI, Chakra, Ant Design — anything
  return <input {...getInputProps()} />;
}
```

### Pattern format (phone, card, date)

```tsx
import { PatternFormat } from "kurrency-kit";

<PatternFormat format="+1 (###) ###-####" mask="_" />
// → +1 (555) 123-4567

<PatternFormat format="#### #### #### ####" mask="_" />
// → 4111 1111 1111 1111
```

## Standalone Utilities

### formatCurrency

```ts
import { formatCurrency } from "kurrency-kit";

// Basic
formatCurrency(1234567.89);
// → "1,234,567.89"

// With options
formatCurrency(1234567.89, {
  prefix: "$",
  decimalScale: 2,
  fixedDecimalScale: true,
  thousandSeparator: ",",
});
// → "$1,234,567.89"

// Indian number system
formatCurrency(1234567, { prefix: "₹", thousandSpacing: "2s" });
// → "₹12,34,567"
```

### parseCurrency

Round-trip parsing — the inverse of `formatCurrency`:

```ts
import { parseCurrency } from "kurrency-kit";

parseCurrency("$1,234.56", { prefix: "$", thousandSeparator: "," });
// → { value: "1234.56", floatValue: 1234.56, formattedValue: "$1,234.56" }

// Euro format
parseCurrency("1.234,56€", {
  suffix: "€",
  thousandSeparator: ".",
  decimalSeparator: ",",
});
// → { floatValue: 1234.56 }
```

### formatCompact / parseCompact

Compact number notation (1K, 1M, 1B) with full round-trip support:

```ts
import { formatCompact, parseCompact } from "kurrency-kit";

formatCompact(1234567);          // → "1.23M"
formatCompact(2500000000);       // → "2.5B"
formatCompact(1500000, { prefix: "$", decimalScale: 1 }); // → "$1.5M"

// Vietnamese
formatCompact(1500000000, {
  compactDisplay: { thousand: " nghìn", million: " triệu", billion: " tỷ" },
  suffix: " ₫",
});
// → "1.5 tỷ ₫"

// Parse back
parseCompact("2.5M"); // → { value: "2500000", floatValue: 2500000 }
```

### getCurrencyConfig

Auto-configure formatting from ISO 4217 currency codes:

```ts
import { getCurrencyConfig } from "kurrency-kit";

getCurrencyConfig("USD");
// → { prefix: "$", decimalScale: 2, fixedDecimalScale: true, thousandSeparator: ",", decimalSeparator: "." }

getCurrencyConfig("JPY");
// → { prefix: "¥", decimalScale: 0, ... }

getCurrencyConfig("VND");
// → { suffix: " ₫", decimalScale: 0, ... }

// Use with component
<CurrencyFormat value={1234.56} {...getCurrencyConfig("GBP")} />
// → £1,234.56
```

## Locale Support

### Auto-detect from browser

```ts
import { getAutoLocaleConfig } from "kurrency-kit";

// Detects user's browser locale automatically
const config = getAutoLocaleConfig("USD");
<CurrencyFormat value={1234.56} {...config} />
```

### Any locale via Intl.NumberFormat

```ts
import { detectLocaleFormat, createLocaleConfig, formatWithIntl } from "kurrency-kit";

// Thai
detectLocaleFormat("th-TH", "THB");
// → { thousandSeparator: ",", decimalSeparator: ".", prefix: "฿", ... }

// Arabic
detectLocaleFormat("ar-SA", "SAR");

// Direct Intl formatting
formatWithIntl(1234567.89, "de-DE", { style: "currency", currency: "EUR" });
// → "1.234.567,89 €"
```

### Static presets

Pre-configured: `en-US`, `vi-VN`, `de-DE`, `ja-JP`, `en-IN`, `fr-FR`, `zh-CN`, `ko-KR`, `pt-BR`, `en-GB`

```ts
import { getLocaleConfig, getFormatOptionsFromLocale } from "kurrency-kit";

<CurrencyFormat value={1234567} {...getFormatOptionsFromLocale("vi-VN")} />
// → 1.234.567 ₫
```

### Custom locale registry

```ts
import { registerLocale, unregisterLocale } from "kurrency-kit";

registerLocale("bitcoin", {
  locale: "bitcoin",
  prefix: "₿ ",
  thousandSeparator: " ",
  decimalSeparator: ".",
  decimalScale: 8,
});

// Use it anywhere
<CurrencyFormat value={0.00123456} {...getFormatOptionsFromLocale("bitcoin")} />

unregisterLocale("bitcoin");
```

## Hooks

### useCurrencyInput (Headless)

A truly headless hook that works with **any** `<input>` element. No dependency on `<CurrencyFormat />`.

```tsx
import { useCurrencyInput } from "kurrency-kit";

function PriceInput() {
  const { value, formattedValue, getInputProps, setValue, reset, clear } = useCurrencyInput({
    currency: "USD",         // Auto-configures prefix, decimals from ISO 4217
    initialValue: 1000,
    onValueChange: (values) => console.log(values.floatValue),
  });

  return (
    <div>
      <input {...getInputProps()} />
      <p>Raw: {value} | Display: {formattedValue}</p>
      <button onClick={() => setValue(2000)}>Set $2000</button>
      <button onClick={reset}>Reset</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
```

Works with any UI library:

```tsx
// Material UI
<TextField {...getInputProps()} label="Price" />

// Chakra UI
<Input {...getInputProps()} />

// Ant Design
<AntInput {...getInputProps()} />
```

Options: `currency`, `locale`, `initialValue`, `onValueChange`, plus all `FormatCurrencyOptions` (prefix, suffix, decimalScale, etc.). Direct props override currency/locale defaults.

### useCurrencyFormat

Higher-level hook that returns props for the `<CurrencyFormat />` component:

```tsx
import { useCurrencyFormat, CurrencyFormat } from "kurrency-kit";

function PriceInput() {
  const { value, formattedValue, inputProps, reset, clear } = useCurrencyFormat({
    locale: "en-US",
    initialValue: 1000,
  });

  return (
    <div>
      <CurrencyFormat {...inputProps} />
      <p>Raw: {value} | Display: {formattedValue}</p>
    </div>
  );
}
```

## PatternFormat

A focused component for pattern-based formatting (phone, card, date). Cleaner API than using `CurrencyFormat` with `format` prop.

```tsx
import { PatternFormat } from "kurrency-kit";

// Phone number
<PatternFormat format="+1 (###) ###-####" mask="_" />

// Credit card
<PatternFormat format="#### #### #### ####" mask="_" />

// Date with per-position masks
<PatternFormat format="##/##/####" mask={["D","D","M","M","Y","Y","Y","Y"]} />

// Show mask on empty
<PatternFormat format="+1 (###) ###-####" mask="_" allowEmptyFormatting />
// → +1 (___) ___-____
```

PatternFormat accepts: `format`, `mask`, `allowEmptyFormatting`, `value`, `defaultValue`, `onValueChange`, `displayType`, `customInput`, and all standard input props.

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | — | Controlled input value |
| `defaultValue` | `string \| number` | — | Uncontrolled initial value |
| `format` | `string \| Function` | — | Pattern (`"+1 (###) ###-####"`) or custom format function |
| `decimalScale` | `number` | — | Max decimal places |
| `decimalSeparator` | `string` | `"."` | Decimal separator |
| `thousandSeparator` | `string \| boolean` | `","` | Thousand separator (`true` = `","`) |
| `thousandSpacing` | `"2" \| "2s" \| "3" \| "4"` | `"3"` | Grouping pattern |
| `thousandsGroupStyle` | `"thousand" \| "lakh" \| "wan" \| "none"` | — | Human-readable grouping alias |
| `mask` | `string \| string[]` | `" "` | Mask for empty format positions |
| `prefix` | `string` | `""` | Text before number (`"$"`) |
| `suffix` | `string` | `""` | Text after number (`"%"`) |
| `allowNegative` | `boolean` | `true` | Allow negative values |
| `allowEmptyFormatting` | `boolean` | `false` | Show prefix/suffix when empty |
| `allowedDecimalSeparators` | `string[]` | — | Extra keys treated as decimal separator |
| `fixedDecimalScale` | `boolean` | `false` | Always show decimal places |
| `isNumericString` | `boolean` | `false` | Treat value as numeric string |
| `isAllowed` | `(values) => boolean` | — | Custom validation |
| `onValueChange` | `(values, sourceInfo) => void` | — | Value change callback |
| `inputMode` | `"numeric" \| "decimal" \| "text"` | auto | Mobile keyboard type (auto-detected) |
| `displayType` | `"input" \| "text"` | `"input"` | Render mode |
| `customInput` | `ComponentType` | — | Custom input component |
| `renderText` | `(value, props) => ReactNode` | — | Custom text renderer |
| `type` | `"text" \| "tel"` | `"text"` | Input type |
| `name` | `string` | — | Field name |
| `getInputRef` | `(el) => void` | — | Get input element ref |

### thousandsGroupStyle

Human-readable alias for `thousandSpacing`:

| Style | Equivalent | Example |
|-------|-----------|---------|
| `"thousand"` | `"3"` | `1,234,567` |
| `"lakh"` | `"2s"` | `12,34,567` |
| `"wan"` | `"4"` | `123,4567` |
| `"none"` | — | `1234567` |

### allowedDecimalSeparators

Accept multiple keys as decimal input (useful for European keyboards):

```tsx
<CurrencyFormat
  decimalSeparator=","
  allowedDecimalSeparators={[",", "."]}
  // User can press either . or , to type a decimal
/>
```

### ValueObject

```ts
interface ValueObject {
  formattedValue: string;  // "$1,234.56"
  value: string;           // "1234.56"
  floatValue: number;      // 1234.56
  name?: string;           // Field name if provided
}
```

### onValueChange sourceInfo

```ts
onValueChange={(values, sourceInfo) => {
  // sourceInfo.source: "event" (user typed) | "prop" (value prop changed)
  // sourceInfo.event: the original DOM event (when source is "event")
  if (sourceInfo?.source === "event") {
    // Only react to user input, not programmatic changes
  }
}}
```

## Examples

### Phone number

```tsx
<PatternFormat format="+1 (###) ###-####" mask="_" />
// → +1 (555) 123-4567
```

### Credit card

```tsx
<PatternFormat format="#### #### #### ####" mask="_" />
// → 4111 1111 1111 1111
```

### Percentage with max

```tsx
<CurrencyFormat
  suffix="%"
  decimalScale={2}
  isAllowed={(values) => (values.floatValue ?? 0) <= 100}
/>
```

### Display as text

```tsx
<CurrencyFormat
  value={9999.99}
  displayType="text"
  thousandSeparator=","
  prefix="$"
/>
// Renders: <span role="status" aria-live="polite">$9,999.99</span>
```

### Custom input (Material UI, etc.)

```tsx
<CurrencyFormat
  value={1000}
  customInput={TextField}
  thousandSeparator=","
  prefix="$"
/>
```

## Form Library Integration

### react-hook-form

```tsx
import { useForm } from "react-hook-form";
import { CurrencyFormat } from "kurrency-kit";

function MyForm() {
  const { register, handleSubmit, setValue } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CurrencyFormat
        {...register("price")}
        thousandSeparator=","
        prefix="$"
        onValueChange={(values, sourceInfo) => {
          if (sourceInfo?.source === "event") {
            setValue("price", values.floatValue);
          }
        }}
      />
    </form>
  );
}
```

## Accessibility

- `inputMode` auto-detected for mobile keyboards (numeric/decimal)
- `displayType="text"` renders with `role="status"` and `aria-live="polite"`
- All `aria-*` props passed through to the input element
- IME composition support for CJK (Chinese, Japanese, Korean) input
- Home/End keys respect prefix/suffix boundaries
- Disabled/readOnly states properly handled

## TypeScript

Full type exports available:

```ts
import type {
  CurrencyFormatProps,
  PatternFormatProps,
  ThousandsGroupStyle,
  ValueObject,
  ThousandSpacing,
  FormatCurrencyOptions,
  ParseCurrencyOptions,
  CompactDisplayOptions,
  FormatCompactOptions,
  UseCurrencyFormatOptions,
  UseCurrencyFormatReturn,
  UseCurrencyInputOptions,
  UseCurrencyInputReturn,
  LocaleConfig,
  CurrencyInfo,
  FormatFunction,
  RemoveFormattingFunction,
  IsAllowedFunction,
  OnValueChangeFunction,
  RenderTextFunction,
} from "kurrency-kit";
```

## License

MIT
