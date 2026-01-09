# currency-fomatter

A React component for formatting currency, phone numbers, credit cards, and other numeric inputs with full TypeScript support.

## Screenshots

![Currency, Phone, Credit Card, Expiry Date, Percentage, Max Amount](https://raw.githubusercontent.com/nguyenduyhoang35/currency-fomatter/main/public/screenshot-1.png)

![Indian Format, Euro, Display Text, Negative Numbers, Custom Input, Custom Format](https://raw.githubusercontent.com/nguyenduyhoang35/currency-fomatter/main/public/screenshot-2.png)

## Installation

```bash
npm install currency-fomatter
# or
yarn add currency-fomatter
```

## Features

- Currency formatting with thousand separators
- Phone number and credit card masking
- Custom format patterns
- Support for multiple number systems (US, Indian, etc.)
- Prefix and suffix support
- Decimal scale control
- Negative number support
- Custom input component support
- Full TypeScript support
- **Standalone utility functions** (`formatCurrency`, `parseCurrency`)
- **Compact format** (`formatCompact` - 1K, 1M, 1B)
- **Locale presets** (en-US, vi-VN, de-DE, ja-JP, etc.)
- **React hook** (`useCurrencyFormat`) for easy state management
- **ref forwarding** for form library integration

## Basic Usage

```tsx
import { CurrencyFormat } from "currency-fomatter";

function App() {
  return (
    <CurrencyFormat
      value="1234567.89"
      thousandSeparator=","
      decimalSeparator="."
      prefix="$"
      decimalScale={2}
      fixedDecimalScale
      onValueChange={(values) => {
        console.log(values.formattedValue); // "$1,234,567.89"
        console.log(values.value);          // "1234567.89"
        console.log(values.floatValue);     // 1234567.89
      }}
    />
  );
}
```

## Examples

### Currency Format

```tsx
<CurrencyFormat
  value={1234.56}
  thousandSeparator=","
  prefix="$"
  decimalScale={2}
  fixedDecimalScale
/>
// Output: $1,234.56
```

### Phone Number Format

```tsx
<CurrencyFormat
  format="+1 (###) ###-####"
  mask="_"
  placeholder="+1 (___) ___-____"
/>
// Output: +1 (555) 123-4567
```

### Credit Card Format

```tsx
<CurrencyFormat
  format="#### #### #### ####"
  mask="_"
/>
// Output: 4111 1111 1111 1111
```

### Percentage with Validation

```tsx
<CurrencyFormat
  value="75.5"
  suffix="%"
  decimalScale={2}
  isAllowed={(values) => values.floatValue <= 100}
/>
// Output: 75.50%
```

### Indian Number System

```tsx
<CurrencyFormat
  value="1234567"
  thousandSeparator=","
  thousandSpacing="2s"
  prefix="₹"
/>
// Output: ₹12,34,567
```

### Display as Text (Read-only)

```tsx
<CurrencyFormat
  value={9999.99}
  displayType="text"
  thousandSeparator=","
  prefix="$"
/>
// Output: <span>$9,999.99</span>
```

### Custom Input Component

```tsx
const CustomInput = (props) => (
  <input {...props} className="custom-input" />
);

<CurrencyFormat
  value="1000"
  customInput={CustomInput}
  thousandSeparator=","
  prefix="$"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | - | Input value |
| `format` | `string \| Function` | - | Format pattern (e.g., `"+1 (###) ###-####"`) or custom format function |
| `decimalScale` | `number` | - | Maximum decimal places |
| `decimalSeparator` | `string` | `"."` | Decimal separator character |
| `thousandSeparator` | `string \| boolean` | `","` | Thousand separator (`true` = `","`) |
| `thousandSpacing` | `"2" \| "2s" \| "3" \| "4"` | `"3"` | Thousand grouping pattern |
| `mask` | `string \| string[]` | `" "` | Mask character for empty format positions |
| `prefix` | `string` | `""` | Text before the number (e.g., `"$"`) |
| `suffix` | `string` | `""` | Text after the number (e.g., `"%"`) |
| `allowNegative` | `boolean` | `true` | Allow negative values |
| `fixedDecimalScale` | `boolean` | `false` | Always show decimal places |
| `isNumericString` | `boolean` | `false` | Treat value as numeric string |
| `isAllowed` | `(values: ValueObject) => boolean` | - | Custom validation function |
| `onValueChange` | `(values: ValueObject) => void` | - | Callback when value changes |
| `type` | `"text" \| "tel"` | `"text"` | Input type |
| `displayType` | `"input" \| "text"` | `"input"` | Render as input or text |
| `customInput` | `React.ComponentType` | - | Custom input component |
| `renderText` | `(value, props) => ReactNode` | - | Custom text renderer |
| `name` | `string` | - | Field name (included in ValueObject) |
| `getInputRef` | `(el: HTMLInputElement) => void` | - | Callback to get input element ref |

### Thousand Spacing Options

| Value | Description | Example |
|-------|-------------|---------|
| `"3"` | Groups of 3 (US/EU) | `1,234,567` |
| `"2"` | Groups of 2 | `12,34,56,7` |
| `"2s"` | Indian system (Lakhs/Crores) | `12,34,567` |
| `"4"` | Groups of 4 | `123,4567` |

## Utility Functions

### formatCurrency

Format a number/string without rendering a component:

```tsx
import { formatCurrency } from "currency-fomatter";

// Basic usage
formatCurrency(1234567.89);
// Output: "1,234,567.89"

// With options
formatCurrency(1234567.89, {
  prefix: "$",
  decimalScale: 2,
  fixedDecimalScale: true,
  thousandSeparator: ",",
});
// Output: "$1,234,567.89"

// Indian format
formatCurrency(1234567, {
  prefix: "₹",
  thousandSpacing: "2s",
});
// Output: "₹12,34,567"
```

### parseCurrency

Parse a formatted currency string back to numeric values:

```tsx
import { parseCurrency } from "currency-fomatter";

const result = parseCurrency("$1,234.56", {
  prefix: "$",
  thousandSeparator: ",",
});
// result = {
//   value: "1234.56",
//   floatValue: 1234.56,
//   formattedValue: "$1,234.56"
// }

// Euro format
const euroResult = parseCurrency("1.234,56€", {
  suffix: "€",
  thousandSeparator: ".",
  decimalSeparator: ",",
});
// euroResult.floatValue = 1234.56
```

### formatCompact

Format large numbers in compact notation (1K, 1M, 1B):

```tsx
import { formatCompact } from "currency-fomatter";

// Basic usage
formatCompact(1234567);
// Output: "1.23M"

formatCompact(2500000000);
// Output: "2.5B"

// With currency prefix
formatCompact(1500000, { prefix: "$", decimalScale: 1 });
// Output: "$1.5M"

// Vietnamese format
formatCompact(1500000000, {
  compactDisplay: {
    thousand: " nghìn",
    million: " triệu",
    billion: " tỷ",
  },
  suffix: " ₫",
});
// Output: "1.5 tỷ ₫"

// Parse compact format back to number
import { parseCompact } from "currency-fomatter";

parseCompact("2.5M");
// Output: { value: "2500000", floatValue: 2500000 }
```

## Locale Support

### Dynamic Locale Detection (Recommended)

Uses browser's `Intl.NumberFormat` to auto-detect format for ANY locale:

```tsx
import {
  detectLocaleFormat,
  createLocaleConfig,
  getAutoLocaleConfig,
  formatWithIntl,
} from "currency-fomatter";

// Auto-detect user's browser locale
const autoConfig = getAutoLocaleConfig("USD");
// Automatically detects separators, prefix/suffix based on user's browser

// Detect format for any locale (no hardcoding!)
const thaiFormat = detectLocaleFormat("th-TH", "THB");
// { thousandSeparator: ",", decimalSeparator: ".", prefix: "฿", ... }

const arabicFormat = detectLocaleFormat("ar-SA", "SAR");
// Correctly detects Arabic number formatting

// Create complete config dynamically
const config = createLocaleConfig("es-MX", "MXN");
// Full config with compactDisplay labels from Intl

// Direct Intl formatting (most accurate)
formatWithIntl(1234567.89, "de-DE", { style: "currency", currency: "EUR" });
// Output: "1.234.567,89 €"
```

### Use with CurrencyFormat

```tsx
import { getFormatOptionsFromLocale, CurrencyFormat } from "currency-fomatter";

// Works with ANY locale - dynamic detection fallback
<CurrencyFormat
  value={1234567}
  {...getFormatOptionsFromLocale("th-TH", { currency: "THB" })}
/>

// Auto-detect from browser
import { getAutoLocaleConfig } from "currency-fomatter";

const { prefix, suffix, thousandSeparator, decimalSeparator } = getAutoLocaleConfig("USD");
<CurrencyFormat value={1234.56} prefix={prefix} suffix={suffix} ... />
```

### Static Presets (Fallback)

Pre-configured locales for common countries:

```tsx
import { localePresets, getLocaleConfig } from "currency-fomatter";

// Available presets: en-US, vi-VN, de-DE, ja-JP, en-IN, fr-FR, zh-CN, ko-KR, pt-BR, en-GB

const vnConfig = getLocaleConfig("vi-VN");
// Uses preset if available, falls back to dynamic detection

<CurrencyFormat
  value={1234567}
  {...getFormatOptionsFromLocale("vi-VN")}
/>
// Output: 1.234.567 ₫
```

### Custom Locale Registry

Register your own locale configurations:

```tsx
import { registerLocale, unregisterLocale, getLocaleConfig } from "currency-fomatter";

// Register custom locale
registerLocale("my-company", {
  locale: "my-company",
  prefix: "₿ ",
  thousandSeparator: " ",
  decimalSeparator: ",",
  decimalScale: 8,
});

// Use it
const config = getLocaleConfig("my-company");

// Unregister when done
unregisterLocale("my-company");
```

## useCurrencyFormat Hook

A React hook for easy currency state management:

```tsx
import { useCurrencyFormat, CurrencyFormat } from "currency-fomatter";

function PriceInput() {
  const {
    value,           // number: 1234.56
    formattedValue,  // string: "$1,234.56"
    setValue,        // (num: number | string) => void
    inputProps,      // Props to spread on CurrencyFormat
    reset,           // Reset to initial value
    clear,           // Clear value
  } = useCurrencyFormat({
    locale: "en-US",
    initialValue: 1000,
  });

  return (
    <div>
      <CurrencyFormat {...inputProps} />
      <p>Raw value: {value}</p>
      <p>Formatted: {formattedValue}</p>
      <button onClick={() => setValue(2000)}>Set $2000</button>
      <button onClick={reset}>Reset</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
```

### Hook with Custom Options

```tsx
const { inputProps, formattedValue } = useCurrencyFormat({
  locale: "vi-VN",
  initialValue: 1000000,
  decimalScale: 0,
});

// formattedValue = "1.000.000 ₫"
```

### Hook without Locale

```tsx
const { inputProps, value } = useCurrencyFormat({
  initialValue: 99.99,
  prefix: "$",
  decimalScale: 2,
  fixedDecimalScale: true,
});
```

## Using with Form Libraries

### react-hook-form

The component supports `ref` forwarding for seamless integration:

```tsx
import { useForm } from "react-hook-form";
import { CurrencyFormat } from "currency-fomatter";

function MyForm() {
  const { register, handleSubmit, setValue } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CurrencyFormat
        {...register("price")}
        name="price"
        thousandSeparator=","
        prefix="$"
        onValueChange={(values, sourceInfo) => {
          // Only update form when user interacts, not on prop changes
          if (sourceInfo?.source === "event") {
            setValue("price", values.floatValue);
          }
        }}
      />
    </form>
  );
}
```

### Multiple Fields

Use the `name` prop to identify fields in shared handlers:

```tsx
function PriceForm() {
  const [prices, setPrices] = useState({ min: 0, max: 0 });

  const handleValueChange = (values, sourceInfo) => {
    if (values.name) {
      setPrices(prev => ({
        ...prev,
        [values.name]: values.floatValue
      }));
    }
  };

  return (
    <>
      <CurrencyFormat
        name="min"
        value={prices.min}
        onValueChange={handleValueChange}
        prefix="$"
      />
      <CurrencyFormat
        name="max"
        value={prices.max}
        onValueChange={handleValueChange}
        prefix="$"
      />
    </>
  );
}
```

## TypeScript

The package includes full TypeScript support with exported types:

```tsx
import CurrencyFormat, {
  // Component props
  CurrencyFormatProps,
  ValueObject,
  ThousandSpacing,

  // Utility function types
  FormatCurrencyOptions,
  ParseCurrencyOptions,
  CompactDisplayOptions,
  FormatCompactOptions,

  // Hook types
  UseCurrencyFormatOptions,
  UseCurrencyFormatReturn,

  // Locale types
  LocaleConfig,

  // Callback types
  FormatFunction,
  IsAllowedFunction,
  OnValueChangeFunction,
} from "currency-fomatter";

// ValueObject type
interface ValueObject {
  formattedValue: string;  // Formatted display value
  value: string;           // Unformatted numeric string
  floatValue: number;      // Parsed float value
  name?: string;           // Field name (if provided)
}

// onValueChange callback signature
type OnValueChangeFunction = (
  values: ValueObject,
  sourceInfo?: {
    event?: ChangeEvent<HTMLInputElement>;
    source: "event" | "prop";  // "event" = user input, "prop" = value prop changed
  }
) => void;

// Locale config type
interface LocaleConfig {
  locale: string;
  currency?: string;
  currencySymbol?: string;
  prefix?: string;
  suffix?: string;
  thousandSeparator?: string | boolean;
  decimalSeparator?: string;
  thousandSpacing?: ThousandSpacing;
  decimalScale?: number;
  compactDisplay?: CompactDisplayOptions;
}
```

## Event Handlers

All standard input event handlers are supported:

```tsx
<CurrencyFormat
  onChange={(e) => console.log("onChange", e)}
  onKeyDown={(e) => console.log("onKeyDown", e)}
  onMouseUp={(e) => console.log("onMouseUp", e)}
  onFocus={(e) => console.log("onFocus", e)}
  onBlur={(e) => console.log("onBlur", e)}
/>
```

## License

MIT
