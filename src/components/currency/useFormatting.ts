import { useCallback } from "react";
import {
  escapeRegExp,
  fixLeadingZero,
  limitToScale,
  roundToPrecision,
  thousandGroupSpacing,
  ThousandSpacing,
  SplitDecimalResult,
} from "./utils";
import type { FormatFunction, RemoveFormattingFunction } from "./index";

export interface Separators {
  decimalSeparator: string;
  thousandSeparator: string | boolean;
  thousandSpacing: ThousandSpacing;
}

interface UseFormattingProps {
  decimalSeparator: string;
  thousandSeparator: string | boolean;
  thousandSpacing: ThousandSpacing;
  decimalScale?: number;
  fixedDecimalScale: boolean;
  format?: string | FormatFunction;
  mask: string | string[];
  prefix: string;
  suffix: string;
  allowNegative: boolean;
  allowEmptyFormatting: boolean;
  removeFormattingProp?: RemoveFormattingFunction;
  isNumericStringProp: boolean;
  valueProp?: string | number;
  defaultValueProp?: string | number;
}

export function useFormatting({
  decimalSeparator,
  thousandSeparator,
  thousandSpacing,
  decimalScale,
  fixedDecimalScale,
  format,
  mask,
  prefix,
  suffix,
  allowNegative,
  allowEmptyFormatting,
  removeFormattingProp,
  isNumericStringProp,
  valueProp,
  defaultValueProp,
}: UseFormattingProps) {
  const getSeparators = useCallback((): Separators => {
    let separator = thousandSeparator;
    if (separator === true) {
      separator = ",";
    }
    return {
      decimalSeparator,
      thousandSeparator: separator,
      thousandSpacing,
    };
  }, [decimalSeparator, thousandSeparator, thousandSpacing]);

  const getMaskAtIndex = useCallback(
    (index: number): string => {
      if (typeof mask === "string") {
        return mask;
      }
      return mask[index] || " ";
    },
    [mask]
  );

  const getNumberRegex = useCallback(
    (g: boolean, ignoreDecimalSeparator?: boolean): RegExp => {
      const { decimalSeparator: decSep } = getSeparators();
      return new RegExp(
        "\\d" +
          (decSep && decimalScale !== 0 && !ignoreDecimalSeparator && !format
            ? "|" + escapeRegExp(decSep)
            : ""),
        g ? "g" : undefined
      );
    },
    [getSeparators, decimalScale, format]
  );

  const splitDecimal = useCallback(
    (numStr: string): SplitDecimalResult => {
      const hasNegation = numStr[0] === "-";
      const addNegation = hasNegation && allowNegative;
      numStr = numStr.replace("-", "");

      const parts = numStr.split(".");
      const beforeDecimal = parts[0];
      const afterDecimal = parts[1] || "";

      return {
        beforeDecimal,
        afterDecimal,
        hasNegation,
        addNegation,
      };
    },
    [allowNegative]
  );

  const getFloatString = useCallback(
    (num = ""): string => {
      const { decimalSeparator: decSep } = getSeparators();
      const numRegex = getNumberRegex(true);

      const hasNegation = num[0] === "-";
      if (hasNegation) num = num.replace("-", "");

      num = (num.match(numRegex) || []).join("").replace(decSep, ".");

      const firstDecimalIndex = num.indexOf(".");
      if (firstDecimalIndex !== -1) {
        num = `${num.substring(0, firstDecimalIndex)}.${num
          .substring(firstDecimalIndex + 1, num.length)
          .replace(new RegExp(escapeRegExp(decSep), "g"), "")}`;
      }

      if (hasNegation) num = "-" + num;

      return num;
    },
    [getSeparators, getNumberRegex]
  );

  const formatThousand = useCallback(
    (
      beforeDecimal: string,
      separator: string | boolean,
      spacing: ThousandSpacing = "3"
    ): string => {
      let digitalGroup: RegExp;
      switch (spacing) {
        case thousandGroupSpacing.two:
          digitalGroup = /(\d)(?=(\d{2})+(?!\d))/g;
          break;
        case thousandGroupSpacing.twoScaled:
          digitalGroup = /(\d)(?=(((\d{2})+)(\d{1})(?!\d)))/g;
          break;
        case thousandGroupSpacing.four:
          digitalGroup = /(\d)(?=(\d{4})+(?!\d))/g;
          break;
        default:
          digitalGroup = /(\d)(?=(\d{3})+(?!\d))/g;
      }
      return beforeDecimal.replace(digitalGroup, "$1" + separator);
    },
    []
  );

  const formatWithPattern = useCallback(
    (numStr: string): string => {
      if (typeof format !== "string") return numStr;

      let hashCount = 0;
      const formattedNumberAry = format.split("");
      for (let i = 0, ln = format.length; i < ln; i++) {
        if (format[i] === "#") {
          formattedNumberAry[i] =
            numStr[hashCount] || getMaskAtIndex(hashCount);
          hashCount += 1;
        }
      }
      return formattedNumberAry.join("");
    },
    [format, getMaskAtIndex]
  );

  const formatAsNumber = useCallback(
    (numStr: string): string => {
      const {
        thousandSeparator: tSep,
        decimalSeparator: decSep,
        thousandSpacing: tSpacing,
      } = getSeparators();

      const hasDecimalSeparator =
        numStr.indexOf(".") !== -1 || (decimalScale && fixedDecimalScale);
      let { beforeDecimal, afterDecimal } = splitDecimal(numStr);
      const { addNegation } = splitDecimal(numStr);

      if (beforeDecimal === "" && hasDecimalSeparator) {
        beforeDecimal = "0";
      }

      if (decimalScale !== undefined) {
        afterDecimal = limitToScale(
          afterDecimal,
          decimalScale,
          fixedDecimalScale
        );
      }

      if (tSep) {
        beforeDecimal = formatThousand(beforeDecimal, tSep, tSpacing);
      }

      if (prefix) beforeDecimal = prefix + beforeDecimal;
      if (suffix) afterDecimal = afterDecimal + suffix;

      if (addNegation) beforeDecimal = "-" + beforeDecimal;

      return (
        beforeDecimal + ((hasDecimalSeparator && decSep) || "") + afterDecimal
      );
    },
    [
      getSeparators,
      decimalScale,
      fixedDecimalScale,
      splitDecimal,
      formatThousand,
      prefix,
      suffix,
    ]
  );

  const removePrefixAndSuffix = useCallback(
    (val: string): string => {
      if (!format && val) {
        const isNegative = val[0] === "-";

        if (isNegative) val = val.substring(1, val.length);

        val =
          prefix && val.indexOf(prefix) === 0
            ? val.substring(prefix.length, val.length)
            : val;

        const suffixLastIndex = val.lastIndexOf(suffix);
        val =
          suffix &&
          suffixLastIndex !== -1 &&
          suffixLastIndex === val.length - suffix.length
            ? val.substring(0, suffixLastIndex)
            : val;

        if (isNegative) val = "-" + val;
      }
      return val;
    },
    [format, prefix, suffix]
  );

  const removePatternFormatting = useCallback(
    (val: string): string => {
      if (typeof format !== "string") return val;

      const formatArray = format.split("#").filter((str: string) => str !== "");
      let start = 0;
      let numStr = "";

      for (let i = 0, ln = formatArray.length; i <= ln; i++) {
        const part = formatArray[i] || "";
        const index = i === ln ? val.length : val.indexOf(part, start);

        if (index === -1) {
          numStr = val;
          break;
        } else {
          numStr += val.substring(start, index);
          start = index + part.length;
        }
      }

      return (numStr.match(/\d/g) || []).join("");
    },
    [format]
  );

  const removeFormatting = useCallback(
    (val: string): string => {
      if (!val) return val;

      if (!format) {
        val = removePrefixAndSuffix(val);
        val = getFloatString(val);
      } else if (typeof format === "string") {
        val = removePatternFormatting(val);
      } else if (typeof removeFormattingProp === "function") {
        val = removeFormattingProp(val);
      } else {
        val = (val.match(/\d/g) || []).join("");
      }
      return val;
    },
    [
      format,
      removePrefixAndSuffix,
      getFloatString,
      removePatternFormatting,
      removeFormattingProp,
    ]
  );

  const formatNumString = useCallback(
    (value = ""): string => {
      let formattedValue = value;

      if (value === "") {
        if (allowEmptyFormatting) {
          if (typeof format === "string") {
            formattedValue = formatWithPattern("");
          } else if (!format) {
            formattedValue = prefix + suffix;
          }
        } else {
          formattedValue = "";
        }
      } else if (value === "-" && !format) {
        formattedValue = "-";
      } else if (typeof format === "string") {
        formattedValue = formatWithPattern(formattedValue);
      } else if (typeof format === "function") {
        formattedValue = format(formattedValue);
      } else {
        formattedValue = formatAsNumber(formattedValue);
      }

      return formattedValue;
    },
    [format, formatWithPattern, formatAsNumber, allowEmptyFormatting, prefix, suffix]
  );

  const formatNegation = useCallback(
    (value = ""): string => {
      const negationRegex = new RegExp("(-)");
      const doubleNegationRegex = new RegExp("(-)(.)*(-)");

      const hasNegation = negationRegex.test(value);
      const removeNegationFlag = doubleNegationRegex.test(value);

      value = value.replace(/-/g, "");

      if (hasNegation && !removeNegationFlag && allowNegative) {
        value = "-" + value;
      }

      return value;
    },
    [allowNegative]
  );

  const formatInput = useCallback(
    (value = ""): string => {
      if (!format) {
        value = formatNegation(value);
      }
      value = removeFormatting(value);
      return formatNumString(value);
    },
    [format, formatNegation, removeFormatting, formatNumString]
  );

  const formatValueProp = useCallback((): string => {
    let value = valueProp ?? defaultValueProp;
    let isNumericString = isNumericStringProp;

    if (value === undefined) return "";

    if (typeof value === "number") {
      value = value.toString();
      isNumericString = true;
    }

    if (isNumericString && !format && typeof decimalScale === "number") {
      value = roundToPrecision(
        value as string,
        decimalScale,
        fixedDecimalScale
      );
    }

    return isNumericString
      ? formatNumString(value as string)
      : formatInput(value as string);
  }, [
    valueProp,
    defaultValueProp,
    isNumericStringProp,
    format,
    decimalScale,
    fixedDecimalScale,
    formatNumString,
    formatInput,
  ]);

  // fixLeadingZero is needed by handleBlur in the component; expose it here
  const applyLeadingZeroFix = useCallback(
    (numStr: string): string => fixLeadingZero(numStr) || "",
    []
  );

  return {
    getSeparators,
    getMaskAtIndex,
    getNumberRegex,
    splitDecimal,
    getFloatString,
    formatThousand,
    formatWithPattern,
    formatAsNumber,
    removePrefixAndSuffix,
    removePatternFormatting,
    removeFormatting,
    formatNumString,
    formatNegation,
    formatInput,
    formatValueProp,
    applyLeadingZeroFix,
  };
}
