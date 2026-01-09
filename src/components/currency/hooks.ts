import { useState, useCallback, useMemo } from "react";
import {
  formatCurrency,
  parseCurrency,
  FormatCurrencyOptions,
  ParseCurrencyOptions,
  ValueObject,
} from "./utils";
import { getFormatOptionsFromLocale, LocaleConfig } from "./locales";

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
    }),
    [valueAsString, handleValueChange, formatOptions]
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

export type { LocaleConfig };
