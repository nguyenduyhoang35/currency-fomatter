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

### Thousand Spacing Options

| Value | Description | Example |
|-------|-------------|---------|
| `"3"` | Groups of 3 (US/EU) | `1,234,567` |
| `"2"` | Groups of 2 | `12,34,56,7` |
| `"2s"` | Indian system (Lakhs/Crores) | `12,34,567` |
| `"4"` | Groups of 4 | `123,4567` |

## TypeScript

The package includes full TypeScript support with exported types:

```tsx
import CurrencyFormat, {
  CurrencyFormatProps,
  ValueObject,
  ThousandSpacing,
  FormatFunction,
  IsAllowedFunction,
  OnValueChangeFunction,
} from "currency-fomatter";

// ValueObject type
interface ValueObject {
  formattedValue: string;  // Formatted display value
  value: string;           // Unformatted numeric string
  floatValue: number;      // Parsed float value
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
