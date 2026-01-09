// Types
export type ThousandSpacing = "2" | "2s" | "3" | "4";

export interface SplitDecimalResult {
  beforeDecimal: string;
  afterDecimal: string;
  hasNegation: boolean;
  addNegation: boolean;
}

export interface ValueObject {
  formattedValue: string;
  value: string;
  floatValue: number;
  name?: string;
}

export interface FormatCurrencyOptions {
  decimalScale?: number;
  decimalSeparator?: string;
  thousandSeparator?: string | boolean;
  thousandSpacing?: ThousandSpacing;
  prefix?: string;
  suffix?: string;
  fixedDecimalScale?: boolean;
  allowNegative?: boolean;
}

export interface ParseCurrencyOptions {
  decimalSeparator?: string;
  thousandSeparator?: string | boolean;
  prefix?: string;
  suffix?: string;
}

export interface CompactDisplayOptions {
  thousand?: string;
  million?: string;
  billion?: string;
  trillion?: string;
}

export interface FormatCompactOptions extends FormatCurrencyOptions {
  compactDisplay?: CompactDisplayOptions;
  compactThreshold?: number;
}

// Constants
export const thousandGroupSpacing: Record<string, ThousandSpacing> = {
  two: "2",
  twoScaled: "2s",
  three: "3",
  four: "4",
};

// Basic utility functions
export const charIsNumber = (char?: string): boolean => {
  return !!(char || "").match(/\d/);
};

export const escapeRegExp = (str: string): string => {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
};

export const fixLeadingZero = (numStr?: string): string | undefined => {
  if (!numStr) return numStr;

  const isNegative = numStr[0] === "-";
  if (isNegative) numStr = numStr.substring(1, numStr.length);

  const parts = numStr.split(".");
  const beforeDecimal = parts[0].replace(/^0+/, "") || "0";
  const afterDecimal = parts[1] || "";

  return `${isNegative ? "-" : ""}${beforeDecimal}${
    afterDecimal ? `.${afterDecimal}` : ""
  }`;
};

export const splitString = (str: string, index: number): [string, string] => {
  return [str.substring(0, index), str.substring(index)];
};

/**
 * Limit decimal numbers to given scale
 * Not using .toFixed because that will break with big numbers
 */
export const limitToScale = (
  numStr: string,
  scale: number,
  fixedDecimalScale: boolean
): string => {
  let str = "";
  const filler = fixedDecimalScale ? "0" : "";
  for (let i = 0; i <= scale - 1; i++) {
    str += numStr[i] || filler;
  }
  return str;
};

/**
 * Round prop value to given scale
 * Not using .round or .toFixed because that will break with big numbers
 */
export const roundToPrecision = (
  numStr: string,
  scale: number,
  fixedDecimalScale: boolean
): string => {
  const numberParts = numStr.split(".");
  const roundedDecimalParts = parseFloat(`0.${numberParts[1] || "0"}`)
    .toFixed(scale)
    .split(".");

  const intPart = numberParts[0]
    .split("")
    .reverse()
    .reduce((roundedStr, current, idx) => {
      if (roundedStr.length > idx) {
        return (
          (Number(roundedStr[0]) + Number(current)).toString() +
          roundedStr.substring(1, roundedStr.length)
        );
      }
      return current + roundedStr;
    }, roundedDecimalParts[0]);

  const decimalPart = limitToScale(
    roundedDecimalParts[1] || "",
    (numberParts[1] || "").length,
    fixedDecimalScale
  );

  return intPart + (decimalPart ? "." + decimalPart : "");
};

export const omit = <T extends Record<string, unknown>>(
  obj: T,
  keyMaps: string[]
): Partial<T> => {
  const keysToOmit = new Set(keyMaps);
  const filteredObj: Partial<T> = {};

  Object.keys(obj).forEach((key) => {
    if (!keysToOmit.has(key)) {
      (filteredObj as Record<string, unknown>)[key] = obj[key];
    }
  });

  return filteredObj;
};

/** Set the caret position in an input field */
export const setCaretPosition = (
  el: HTMLInputElement | null,
  caretPos: number
): boolean => {
  if (el === null) return false;

  // This is used to not only get "focus", but to make sure we don't have everything selected
  // (it causes an issue in chrome, and having it doesn't hurt any other browser)
  // eslint-disable-next-line no-self-assign
  el.value = el.value;

  // For older IE support
  if ((el as HTMLInputElement & { createTextRange?: () => Range }).createTextRange) {
    const range = (el as HTMLInputElement & { createTextRange: () => Range & { move: (unit: string, count: number) => void; select: () => void } }).createTextRange();
    range.move("character", caretPos);
    range.select();
    return true;
  }

  // Modern browsers (el.selectionStart === 0 added for Firefox bug)
  if (el.selectionStart || el.selectionStart === 0) {
    el.focus();
    el.setSelectionRange(caretPos, caretPos);
    return true;
  }

  // Fallback
  el.focus();
  return false;
};

/**
 * Format a number/string to currency format
 * Standalone utility function that doesn't require rendering a component
 */
export const formatCurrency = (
  value: string | number | null | undefined,
  options: FormatCurrencyOptions = {}
): string => {
  const {
    decimalScale,
    decimalSeparator = ".",
    thousandSeparator = ",",
    thousandSpacing = "3",
    prefix = "",
    suffix = "",
    fixedDecimalScale = false,
    allowNegative = true,
  } = options;

  if (value === null || value === undefined || value === "") {
    return "";
  }

  let numStr = typeof value === "number" ? value.toString() : value;

  // Handle negation
  const hasNegation = numStr[0] === "-";
  if (hasNegation) {
    numStr = numStr.substring(1);
  }
  const addNegation = hasNegation && allowNegative;

  // Remove non-numeric characters except decimal
  numStr = numStr.replace(/[^\d.]/g, "");

  // Handle multiple decimals - keep only first
  const decimalIndex = numStr.indexOf(".");
  if (decimalIndex !== -1) {
    numStr =
      numStr.substring(0, decimalIndex + 1) +
      numStr.substring(decimalIndex + 1).replace(/\./g, "");
  }

  // Apply decimal scale
  if (decimalScale !== undefined) {
    numStr = roundToPrecision(numStr, decimalScale, fixedDecimalScale);
  }

  // Split into parts
  const parts = numStr.split(".");
  let beforeDecimal = parts[0] || "0";
  let afterDecimal = parts[1] || "";

  // Apply decimal scale to afterDecimal
  if (decimalScale !== undefined) {
    afterDecimal = limitToScale(afterDecimal, decimalScale, fixedDecimalScale);
  }

  // Apply thousand separator
  if (thousandSeparator) {
    const sep =
      typeof thousandSeparator === "boolean" ? "," : thousandSeparator;
    let digitalGroup: RegExp;

    switch (thousandSpacing) {
      case "2":
        digitalGroup = /(\d)(?=(\d{2})+(?!\d))/g;
        break;
      case "2s":
        digitalGroup = /(\d)(?=(((\d{2})+)(\d{1})(?!\d)))/g;
        break;
      case "4":
        digitalGroup = /(\d)(?=(\d{4})+(?!\d))/g;
        break;
      default:
        digitalGroup = /(\d)(?=(\d{3})+(?!\d))/g;
    }

    beforeDecimal = beforeDecimal.replace(digitalGroup, "$1" + sep);
  }

  // Build result
  const hasDecimalPart =
    numStr.includes(".") || (decimalScale && fixedDecimalScale);
  let result = beforeDecimal;

  if (hasDecimalPart) {
    result += decimalSeparator + afterDecimal;
  }

  // Add prefix/suffix and negation
  if (addNegation) {
    result = "-" + prefix + result + suffix;
  } else {
    result = prefix + result + suffix;
  }

  return result;
};

/**
 * Parse a formatted currency string back to numeric values
 * Standalone utility function that doesn't require rendering a component
 */
export const parseCurrency = (
  formattedValue: string | null | undefined,
  options: ParseCurrencyOptions = {}
): { value: string; floatValue: number; formattedValue: string } => {
  const {
    decimalSeparator = ".",
    thousandSeparator = ",",
    prefix = "",
    suffix = "",
  } = options;

  if (
    formattedValue === null ||
    formattedValue === undefined ||
    formattedValue === ""
  ) {
    return { value: "", floatValue: NaN, formattedValue: "" };
  }

  let value = formattedValue;

  // Handle negation
  const isNegative = value[0] === "-";
  if (isNegative) {
    value = value.substring(1);
  }

  // Remove prefix
  if (prefix && value.startsWith(prefix)) {
    value = value.substring(prefix.length);
  }

  // Remove suffix
  if (suffix && value.endsWith(suffix)) {
    value = value.substring(0, value.length - suffix.length);
  }

  // Remove thousand separator
  const tSep = typeof thousandSeparator === "boolean" ? "," : thousandSeparator;
  if (tSep) {
    value = value.split(tSep).join("");
  }

  // Replace decimal separator with standard decimal point
  if (decimalSeparator !== ".") {
    value = value.replace(decimalSeparator, ".");
  }

  // Remove any remaining non-numeric characters except decimal and minus
  value = value.replace(/[^\d.]/g, "");

  // Add negation back
  if (isNegative) {
    value = "-" + value;
  }

  return {
    value,
    floatValue: parseFloat(value) || NaN,
    formattedValue,
  };
};

/**
 * Default compact display labels (English)
 */
export const defaultCompactDisplay: CompactDisplayOptions = {
  thousand: "K",
  million: "M",
  billion: "B",
  trillion: "T",
};

/**
 * Format a number in compact notation (1K, 1M, 1B, etc.)
 * Useful for displaying large numbers in a readable format
 *
 * @example
 * formatCompact(1234567);
 * // Output: "1.23M"
 *
 * formatCompact(1234567, { prefix: "$", decimalScale: 1 });
 * // Output: "$1.2M"
 *
 * formatCompact(1500000, {
 *   compactDisplay: { million: " triệu" },
 *   suffix: " ₫"
 * });
 * // Output: "1.5 triệu ₫"
 */
export const formatCompact = (
  value: string | number | null | undefined,
  options: FormatCompactOptions = {}
): string => {
  const {
    compactDisplay = defaultCompactDisplay,
    compactThreshold = 1000,
    prefix = "",
    suffix = "",
    decimalScale = 2,
    decimalSeparator = ".",
    allowNegative = true,
  } = options;

  if (value === null || value === undefined || value === "") {
    return "";
  }

  let num = typeof value === "number" ? value : parseFloat(value.toString().replace(/[^\d.-]/g, ""));

  if (isNaN(num)) {
    return "";
  }

  // Handle negation
  const isNegative = num < 0;
  if (isNegative) {
    num = Math.abs(num);
  }
  const addNegation = isNegative && allowNegative;

  // Determine the scale
  let scaled: number;
  let compactSuffix: string;

  if (num >= 1e12) {
    scaled = num / 1e12;
    compactSuffix = compactDisplay.trillion || "T";
  } else if (num >= 1e9) {
    scaled = num / 1e9;
    compactSuffix = compactDisplay.billion || "B";
  } else if (num >= 1e6) {
    scaled = num / 1e6;
    compactSuffix = compactDisplay.million || "M";
  } else if (num >= compactThreshold) {
    scaled = num / 1e3;
    compactSuffix = compactDisplay.thousand || "K";
  } else {
    // Below threshold, format normally
    return formatCurrency(addNegation ? -num : num, {
      prefix,
      suffix,
      decimalScale,
      decimalSeparator,
      allowNegative,
      thousandSeparator: options.thousandSeparator,
      thousandSpacing: options.thousandSpacing,
      fixedDecimalScale: options.fixedDecimalScale,
    });
  }

  // Format the scaled number
  let result = scaled.toFixed(decimalScale);

  // Remove trailing zeros after decimal
  if (result.includes(".")) {
    result = result.replace(/\.?0+$/, "");
  }

  // Replace decimal separator if needed
  if (decimalSeparator !== ".") {
    result = result.replace(".", decimalSeparator);
  }

  // Build final result
  if (addNegation) {
    return "-" + prefix + result + compactSuffix + suffix;
  }
  return prefix + result + compactSuffix + suffix;
};

/**
 * Parse a compact formatted string back to numeric value
 *
 * @example
 * parseCompact("1.5M");
 * // Output: { value: "1500000", floatValue: 1500000 }
 *
 * parseCompact("$2.5K", { prefix: "$" });
 * // Output: { value: "2500", floatValue: 2500 }
 */
export const parseCompact = (
  formattedValue: string | null | undefined,
  options: {
    compactDisplay?: CompactDisplayOptions;
    prefix?: string;
    suffix?: string;
    decimalSeparator?: string;
  } = {}
): { value: string; floatValue: number; formattedValue: string } => {
  const {
    compactDisplay = defaultCompactDisplay,
    prefix = "",
    suffix = "",
    decimalSeparator = ".",
  } = options;

  if (!formattedValue) {
    return { value: "", floatValue: NaN, formattedValue: "" };
  }

  let value = formattedValue;

  // Handle negation
  const isNegative = value.startsWith("-");
  if (isNegative) {
    value = value.substring(1);
  }

  // Remove prefix
  if (prefix && value.startsWith(prefix)) {
    value = value.substring(prefix.length);
  }

  // Remove suffix (before checking compact suffix)
  if (suffix && value.endsWith(suffix)) {
    value = value.substring(0, value.length - suffix.length);
  }

  // Detect and remove compact suffix, get multiplier
  let multiplier = 1;
  const compactSuffixes = [
    { suffix: compactDisplay.trillion || "T", multiplier: 1e12 },
    { suffix: compactDisplay.billion || "B", multiplier: 1e9 },
    { suffix: compactDisplay.million || "M", multiplier: 1e6 },
    { suffix: compactDisplay.thousand || "K", multiplier: 1e3 },
  ];

  for (const { suffix: cs, multiplier: mult } of compactSuffixes) {
    if (value.endsWith(cs)) {
      value = value.substring(0, value.length - cs.length);
      multiplier = mult;
      break;
    }
  }

  // Replace decimal separator
  if (decimalSeparator !== ".") {
    value = value.replace(decimalSeparator, ".");
  }

  // Parse the number
  const num = parseFloat(value.trim()) * multiplier;
  const finalValue = isNegative ? -num : num;

  return {
    value: isNaN(finalValue) ? "" : finalValue.toString(),
    floatValue: finalValue,
    formattedValue: formattedValue,
  };
};
