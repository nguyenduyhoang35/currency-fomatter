import { useState, useCallback, useMemo } from "react";
import {
  formatCurrency,
  parseCurrency,
  FormatCurrencyOptions,
  ParseCurrencyOptions,
  ValueObject,
} from "./utils";
import { getFormatOptionsFromLocale, getCurrencyConfig, LocaleConfig } from "./locales";

export interface UseCurrencyFormatOptions extends FormatCurrencyOptions {
  locale?: string;
  initialValue?: number | string;
}

export interface UseCurrencyFormatReturn {
  /** Raw numeric value as number */
  value: number;
  /** Raw numeric value as string (preserves precision) */
  valueAsString: string;
  /** Formatted display value */
  formattedValue: string;
  /** Set value from number or string */
  setValue: (value: number | string) => void;
  /** Set value from formatted string (parses it first) */
  setFormattedValue: (formatted: string) => void;
  /** Format options derived from locale or props */
  formatOptions: FormatCurrencyOptions;
  /** Props to spread on CurrencyFormat component */
  inputProps: {
    value: number | string;
    onValueChange: (values: ValueObject) => void;
    decimalSeparator: string;
    thousandSeparator: string | boolean;
    prefix: string;
    suffix: string;
    decimalScale?: number;
    fixedDecimalScale?: boolean;
    allowNegative?: boolean;
    inputMode?: "numeric" | "decimal" | "text";
  };
  /** Reset to initial value */
  reset: () => void;
  /** Clear value */
  clear: () => void;
}

/**
 * Hook for managing currency format state
 * Makes it easy to use currency formatting in forms
 *
 * @example
 * ```tsx
 * const { value, formattedValue, inputProps } = useCurrencyFormat({
 *   locale: "en-US",
 *   initialValue: 1000,
 * });
 *
 * return <CurrencyFormat {...inputProps} />;
 * ```
 */
export function useCurrencyFormat(
  options: UseCurrencyFormatOptions = {}
): UseCurrencyFormatReturn {
  const {
    locale,
    initialValue = 0,
    decimalSeparator: decimalSeparatorProp,
    thousandSeparator: thousandSeparatorProp,
    prefix: prefixProp,
    suffix: suffixProp,
    decimalScale: decimalScaleProp,
    fixedDecimalScale: fixedDecimalScaleProp,
    allowNegative: allowNegativeProp,
    thousandSpacing: thousandSpacingProp,
  } = options;

  // Get locale config if locale is provided
  const localeOptions = useMemo(
    () => (locale ? getFormatOptionsFromLocale(locale) : undefined),
    [locale]
  );

  // Merge options: prop values override locale values
  const formatOptions = useMemo<FormatCurrencyOptions>(() => {
    const base = localeOptions || {};
    return {
      decimalSeparator: decimalSeparatorProp ?? base.decimalSeparator ?? ".",
      thousandSeparator: thousandSeparatorProp ?? base.thousandSeparator ?? ",",
      prefix: prefixProp ?? base.prefix ?? "",
      suffix: suffixProp ?? base.suffix ?? "",
      decimalScale: decimalScaleProp ?? base.decimalScale,
      fixedDecimalScale: fixedDecimalScaleProp ?? base.fixedDecimalScale,
      allowNegative: allowNegativeProp ?? base.allowNegative ?? true,
      thousandSpacing: thousandSpacingProp ?? base.thousandSpacing ?? "3",
    };
  }, [
    localeOptions,
    decimalSeparatorProp,
    thousandSeparatorProp,
    prefixProp,
    suffixProp,
    decimalScaleProp,
    fixedDecimalScaleProp,
    allowNegativeProp,
    thousandSpacingProp,
  ]);

  // Parse initial value
  const parseInitialValue = useCallback(
    (val: number | string): string => {
      if (typeof val === "number") {
        return isNaN(val) ? "" : val.toString();
      }
      return val;
    },
    []
  );

  // State
  const [valueAsString, setValueAsString] = useState<string>(() =>
    parseInitialValue(initialValue)
  );

  // Derived values
  const value = useMemo(
    () => (valueAsString === "" ? NaN : parseFloat(valueAsString)),
    [valueAsString]
  );

  const formattedValue = useMemo(
    () => formatCurrency(valueAsString, formatOptions),
    [valueAsString, formatOptions]
  );

  // Setters
  const setValue = useCallback(
    (newValue: number | string) => {
      if (typeof newValue === "number") {
        setValueAsString(isNaN(newValue) ? "" : newValue.toString());
      } else {
        // Parse if it looks formatted
        const parseOptions: ParseCurrencyOptions = {
          decimalSeparator: formatOptions.decimalSeparator,
          thousandSeparator: formatOptions.thousandSeparator,
          prefix: formatOptions.prefix,
          suffix: formatOptions.suffix,
        };
        const parsed = parseCurrency(newValue, parseOptions);
        setValueAsString(parsed.value);
      }
    },
    [formatOptions]
  );

  const setFormattedValue = useCallback(
    (formatted: string) => {
      const parseOptions: ParseCurrencyOptions = {
        decimalSeparator: formatOptions.decimalSeparator,
        thousandSeparator: formatOptions.thousandSeparator,
        prefix: formatOptions.prefix,
        suffix: formatOptions.suffix,
      };
      const parsed = parseCurrency(formatted, parseOptions);
      setValueAsString(parsed.value);
    },
    [formatOptions]
  );

  const reset = useCallback(() => {
    setValueAsString(parseInitialValue(initialValue));
  }, [initialValue, parseInitialValue]);

  const clear = useCallback(() => {
    setValueAsString("");
  }, []);

  // Handle value change from CurrencyFormat component
  const handleValueChange = useCallback((values: ValueObject) => {
    setValueAsString(values.value);
  }, []);

  // Compute inputMode based on decimalScale
  const resolvedInputMode = useMemo((): "numeric" | "decimal" => {
    if (formatOptions.decimalScale === 0) return "numeric";
    return "decimal";
  }, [formatOptions.decimalScale]);

  // Props to spread on CurrencyFormat
  const inputProps = useMemo(
    () => ({
      value: valueAsString === "" ? "" : parseFloat(valueAsString),
      onValueChange: handleValueChange,
      decimalSeparator: formatOptions.decimalSeparator || ".",
      thousandSeparator: formatOptions.thousandSeparator ?? ",",
      prefix: formatOptions.prefix || "",
      suffix: formatOptions.suffix || "",
      decimalScale: formatOptions.decimalScale,
      fixedDecimalScale: formatOptions.fixedDecimalScale,
      allowNegative: formatOptions.allowNegative,
      inputMode: resolvedInputMode,
    }),
    [valueAsString, handleValueChange, formatOptions, resolvedInputMode]
  );

  return {
    value,
    valueAsString,
    formattedValue,
    setValue,
    setFormattedValue,
    formatOptions,
    inputProps,
    reset,
    clear,
  };
}

export interface UseCurrencyInputOptions extends FormatCurrencyOptions {
  locale?: string;
  currency?: string;
  initialValue?: number | string;
  onValueChange?: (values: ValueObject) => void;
}

export interface UseCurrencyInputReturn {
  /** Raw numeric value as number */
  value: number;
  /** Raw numeric value as string (preserves precision) */
  valueAsString: string;
  /** Formatted display value */
  formattedValue: string;
  /** Set value programmatically */
  setValue: (value: number | string) => void;
  /** Reset to initial value */
  reset: () => void;
  /** Clear value */
  clear: () => void;
  /** Props to spread on any <input> element */
  getInputProps: () => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputMode: "numeric" | "decimal";
  };
}

/**
 * Headless hook for currency input — works with any <input> element
 * Unlike useCurrencyFormat (which returns props for CurrencyFormat component),
 * this hook manages formatting directly on a plain <input>.
 *
 * @example
 * ```tsx
 * const { value, formattedValue, getInputProps } = useCurrencyInput({
 *   currency: "USD",
 *   initialValue: 1234.56,
 * });
 *
 * return <input {...getInputProps()} />;
 * // Or with any UI library:
 * return <TextField {...getInputProps()} />;
 * ```
 */
export function useCurrencyInput(
  options: UseCurrencyInputOptions = {}
): UseCurrencyInputReturn {
  const {
    locale,
    currency,
    initialValue = 0,
    onValueChange: onValueChangeProp,
    decimalSeparator: decimalSeparatorProp,
    thousandSeparator: thousandSeparatorProp,
    prefix: prefixProp,
    suffix: suffixProp,
    decimalScale: decimalScaleProp,
    fixedDecimalScale: fixedDecimalScaleProp,
    allowNegative: allowNegativeProp,
    thousandSpacing: thousandSpacingProp,
  } = options;

  // Resolve format options from currency code, locale, or direct props
  const formatOptions = useMemo<FormatCurrencyOptions>(() => {
    // Priority: direct props > currency config > locale config > defaults
    let base: FormatCurrencyOptions = {};

    if (currency) {
      base = getCurrencyConfig(currency, { locale });
    } else if (locale) {
      base = getFormatOptionsFromLocale(locale);
    }

    return {
      decimalSeparator: decimalSeparatorProp ?? base.decimalSeparator ?? ".",
      thousandSeparator: thousandSeparatorProp ?? base.thousandSeparator ?? ",",
      prefix: prefixProp ?? base.prefix ?? "",
      suffix: suffixProp ?? base.suffix ?? "",
      decimalScale: decimalScaleProp ?? base.decimalScale,
      fixedDecimalScale: fixedDecimalScaleProp ?? base.fixedDecimalScale,
      allowNegative: allowNegativeProp ?? base.allowNegative ?? true,
      thousandSpacing: thousandSpacingProp ?? base.thousandSpacing ?? "3",
    };
  }, [
    currency,
    locale,
    decimalSeparatorProp,
    thousandSeparatorProp,
    prefixProp,
    suffixProp,
    decimalScaleProp,
    fixedDecimalScaleProp,
    allowNegativeProp,
    thousandSpacingProp,
  ]);

  // State
  const [valueAsString, setValueAsString] = useState<string>(() => {
    if (typeof initialValue === "number") {
      return isNaN(initialValue) ? "" : initialValue.toString();
    }
    return initialValue;
  });

  // Derived values
  const value = useMemo(
    () => (valueAsString === "" ? NaN : parseFloat(valueAsString)),
    [valueAsString]
  );

  const formattedValue = useMemo(
    () => formatCurrency(valueAsString, formatOptions),
    [valueAsString, formatOptions]
  );

  // Notify parent of value changes
  const notifyValueChange = useCallback(
    (numStr: string) => {
      if (onValueChangeProp) {
        const formatted = formatCurrency(numStr, formatOptions);
        onValueChangeProp({
          value: numStr,
          floatValue: parseFloat(numStr) || NaN,
          formattedValue: formatted,
        });
      }
    },
    [onValueChangeProp, formatOptions]
  );

  // Strip formatting from a display value back to raw numeric string
  const stripFormatting = useCallback(
    (displayValue: string): string => {
      const parsed = parseCurrency(displayValue, {
        decimalSeparator: formatOptions.decimalSeparator,
        thousandSeparator: formatOptions.thousandSeparator,
        prefix: formatOptions.prefix,
        suffix: formatOptions.suffix,
      });
      return parsed.value;
    },
    [formatOptions]
  );

  // Handle input change: strip formatting, update state, re-format
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;

      // Allow empty
      if (rawInput === "" || rawInput === formatOptions.prefix || rawInput === formatOptions.suffix) {
        setValueAsString("");
        notifyValueChange("");
        return;
      }

      // Allow typing just a minus sign
      if (rawInput === "-" && formatOptions.allowNegative !== false) {
        return;
      }

      const numStr = stripFormatting(rawInput);

      // Validate: must be a number (possibly partial like "123." during typing)
      if (numStr && !/^-?\d*\.?\d*$/.test(numStr)) {
        return; // reject invalid input
      }

      setValueAsString(numStr);
      notifyValueChange(numStr);

      // Re-format and update cursor
      const formatted = formatCurrency(numStr, formatOptions);
      e.target.value = formatted;
    },
    [formatOptions, stripFormatting, notifyValueChange]
  );

  // Handle blur: finalize formatting (fix leading zeros etc.)
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (valueAsString === "") return;

      // Fix leading zeros
      let numStr = valueAsString;
      const isNeg = numStr.startsWith("-");
      let abs = isNeg ? numStr.slice(1) : numStr;

      // Remove leading zeros (but keep "0" and "0.x")
      abs = abs.replace(/^0+(\d)/, "$1");
      if (abs === "" || abs === ".") abs = "0";

      numStr = (isNeg ? "-" : "") + abs;

      if (numStr !== valueAsString) {
        setValueAsString(numStr);
        notifyValueChange(numStr);
      }

      const formatted = formatCurrency(numStr, formatOptions);
      e.target.value = formatted;
    },
    [valueAsString, formatOptions, notifyValueChange]
  );

  // Handle key down: Enter to format, prevent invalid chars
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        // Format on Enter (like blur)
        (e.target as HTMLInputElement).blur();
        (e.target as HTMLInputElement).focus();
      }
    },
    []
  );

  // Setters
  const setValue = useCallback(
    (newValue: number | string) => {
      let numStr: string;
      if (typeof newValue === "number") {
        numStr = isNaN(newValue) ? "" : newValue.toString();
      } else {
        const parsed = parseCurrency(newValue, {
          decimalSeparator: formatOptions.decimalSeparator,
          thousandSeparator: formatOptions.thousandSeparator,
          prefix: formatOptions.prefix,
          suffix: formatOptions.suffix,
        });
        numStr = parsed.value;
      }
      setValueAsString(numStr);
      notifyValueChange(numStr);
    },
    [formatOptions, notifyValueChange]
  );

  const reset = useCallback(() => {
    const val = typeof initialValue === "number"
      ? (isNaN(initialValue) ? "" : initialValue.toString())
      : initialValue;
    setValueAsString(val);
    notifyValueChange(val);
  }, [initialValue, notifyValueChange]);

  const clear = useCallback(() => {
    setValueAsString("");
    notifyValueChange("");
  }, [notifyValueChange]);

  // inputMode auto-detection
  const resolvedInputMode = useMemo((): "numeric" | "decimal" => {
    if (formatOptions.decimalScale === 0) return "numeric";
    return "decimal";
  }, [formatOptions.decimalScale]);

  // getInputProps — spread on any <input>
  const getInputProps = useCallback(
    () => ({
      value: formattedValue,
      onChange: handleChange,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      inputMode: resolvedInputMode as "numeric" | "decimal",
    }),
    [formattedValue, handleChange, handleBlur, handleKeyDown, resolvedInputMode]
  );

  return {
    value,
    valueAsString,
    formattedValue,
    setValue,
    reset,
    clear,
    getInputProps,
  };
}

export type { LocaleConfig };
