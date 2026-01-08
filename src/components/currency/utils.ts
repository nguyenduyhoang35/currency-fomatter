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
}

// Constants
export const thousandGroupSpacing: Record<string, ThousandSpacing> = {
  two: "2",
  twoScaled: "2s",
  three: "3",
  four: "4",
};

// Basic utility functions
export const noop = (): void => {};

export const returnTrue = (): boolean => true;

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
