import { useCallback } from "react";
import { charIsNumber, setCaretPosition, splitString } from "./utils";
import type { FormatFunction } from "./index";
import type { Separators } from "./useFormatting";
import type { SplitDecimalResult } from "./utils";

interface UseCaretManagementProps {
  format?: string | FormatFunction;
  prefix: string;
  suffix: string;
  decimalScale?: number;
  fixedDecimalScale: boolean;
  // Formatting helpers from useFormatting
  getSeparators: () => Separators;
  getNumberRegex: (g: boolean, ignoreDecimalSeparator?: boolean) => RegExp;
  removeFormatting: (val: string) => string;
  splitDecimal: (numStr: string) => SplitDecimalResult;
  // State passed in from the component
  numAsString: string;
  currentValue: string;
}

export function useCaretManagement({
  format,
  prefix,
  suffix,
  decimalScale,
  fixedDecimalScale,
  getSeparators,
  getNumberRegex,
  removeFormatting,
  splitDecimal,
  numAsString,
  currentValue,
}: UseCaretManagementProps) {
  const setPatchedCaretPosition = useCallback(
    (el: HTMLInputElement, caretPos: number, value: string): void => {
      setCaretPosition(el, caretPos);
      setTimeout(() => {
        if (el.value === value) setCaretPosition(el, caretPos);
      }, 0);
    },
    []
  );

  const correctCaretPosition = useCallback(
    (value: string, caretPos: number, direction?: string): number => {
      if (!format) {
        const hasNegation = value[0] === "-";
        return Math.min(
          Math.max(caretPos, prefix.length + (hasNegation ? 1 : 0)),
          value.length - suffix.length
        );
      }

      if (typeof format === "function") return caretPos;

      if (typeof format === "string") {
        if (format[caretPos] === "#" && charIsNumber(value[caretPos])) {
          return caretPos;
        }

        if (format[caretPos - 1] === "#" && charIsNumber(value[caretPos - 1])) {
          return caretPos;
        }

        const firstHashPosition = format.indexOf("#");
        const lastHashPosition = format.lastIndexOf("#");

        caretPos = Math.min(
          Math.max(caretPos, firstHashPosition),
          lastHashPosition + 1
        );

        const nextPos = format.substring(caretPos, format.length).indexOf("#");
        let caretLeftBound = caretPos;
        const caretRightBound = caretPos + (nextPos === -1 ? 0 : nextPos);

        while (
          caretLeftBound > firstHashPosition &&
          (format[caretLeftBound] !== "#" ||
            !charIsNumber(value[caretLeftBound]))
        ) {
          caretLeftBound -= 1;
        }

        const goToLeft =
          !charIsNumber(value[caretRightBound]) ||
          (direction === "left" && caretPos !== firstHashPosition) ||
          caretPos - caretLeftBound < caretRightBound - caretPos;

        return goToLeft ? caretLeftBound + 1 : caretRightBound;
      }

      return caretPos;
    },
    [format, prefix, suffix]
  );

  const getCaretPosition = useCallback(
    (inputValue: string, formattedValue: string, caretPos: number): number => {
      const numRegex = getNumberRegex(true);
      const inputNumber = (inputValue.match(numRegex) || []).join("");
      const formattedNumber = (formattedValue.match(numRegex) || []).join("");
      let j = 0;

      for (let i = 0; i < caretPos; i++) {
        const currentInputChar = inputValue[i] || "";
        const currentFormatChar = formattedValue[j] || "";

        if (
          !currentInputChar.match(numRegex) &&
          currentInputChar !== currentFormatChar
        ) {
          continue;
        }

        if (
          currentInputChar === "0" &&
          currentFormatChar.match(numRegex) &&
          currentFormatChar !== "0" &&
          inputNumber.length !== formattedNumber.length
        ) {
          continue;
        }

        while (
          currentInputChar !== formattedValue[j] &&
          j < formattedValue.length
        ) {
          j++;
        }
        j++;
      }

      if (typeof format === "string" && !currentValue) {
        j = formattedValue.length;
      }

      j = correctCaretPosition(formattedValue, j);

      return j;
    },
    [getNumberRegex, format, currentValue, correctCaretPosition]
  );

  const isCharacterAFormat = useCallback(
    (caretPos: number, value: string): boolean => {
      const { decimalSeparator: decSep } = getSeparators();

      if (typeof format === "string" && format[caretPos] !== "#") return true;

      if (
        !format &&
        (caretPos < prefix.length ||
          caretPos >= value.length - suffix.length ||
          (decimalScale && fixedDecimalScale && value[caretPos] === decSep))
      ) {
        return true;
      }

      return false;
    },
    [format, prefix, suffix, decimalScale, fixedDecimalScale, getSeparators]
  );

  const checkIfFormatGotDeleted = useCallback(
    (start: number, end: number, value: string): boolean => {
      for (let i = start; i < end; i++) {
        if (isCharacterAFormat(i, value)) return true;
      }
      return false;
    },
    [isCharacterAFormat]
  );

  const correctInputValue = useCallback(
    (caretPos: number, lastValue: string, value: string): string => {
      const lastNumStr = numAsString || "";

      if (value.length >= lastValue.length || !value.length) {
        return value;
      }

      const start = caretPos;
      const lastValueParts = splitString(lastValue, caretPos);
      const newValueParts = splitString(value, caretPos);
      const deletedIndex = lastValueParts[1].lastIndexOf(newValueParts[1]);
      const diff =
        deletedIndex !== -1 ? lastValueParts[1].substring(0, deletedIndex) : "";
      const end = start + diff.length;

      if (checkIfFormatGotDeleted(start, end, lastValue)) {
        value = lastValue;
      }

      if (!format) {
        const numericString = removeFormatting(value);
        const { beforeDecimal, afterDecimal, addNegation } =
          splitDecimal(numericString);

        if (
          numericString.length < lastNumStr.length &&
          beforeDecimal === "" &&
          !parseFloat(afterDecimal)
        ) {
          return addNegation ? "-" : "";
        }
      }

      return value;
    },
    [
      numAsString,
      format,
      checkIfFormatGotDeleted,
      removeFormatting,
      splitDecimal,
    ]
  );

  return {
    setPatchedCaretPosition,
    correctCaretPosition,
    getCaretPosition,
    isCharacterAFormat,
    checkIfFormatGotDeleted,
    correctInputValue,
  };
}
