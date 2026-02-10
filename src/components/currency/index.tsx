import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useImperativeHandle,
  forwardRef,
  ComponentType,
  InputHTMLAttributes,
  FocusEvent,
  KeyboardEvent,
  ChangeEvent,
  MouseEvent,
  CompositionEvent,
  ReactNode,
} from "react";

import {
  charIsNumber,
  escapeRegExp,
  fixLeadingZero,
  splitString,
  limitToScale,
  roundToPrecision,
  omit,
  setCaretPosition,
  thousandGroupSpacing,
  ThousandSpacing,
  ValueObject,
  SplitDecimalResult,
} from "./utils";

// Re-export types and utilities from utils
export type {
  ThousandSpacing,
  ValueObject,
  FormatCurrencyOptions,
  ParseCurrencyOptions,
  CompactDisplayOptions,
  FormatCompactOptions,
} from "./utils";
export {
  formatCurrency,
  parseCurrency,
  formatCompact,
  parseCompact,
  defaultCompactDisplay,
} from "./utils";

// Re-export PatternFormat
export { default as PatternFormat } from "./PatternFormat";
export type { PatternFormatProps } from "./PatternFormat";

// Re-export hooks
export { useCurrencyFormat, useCurrencyInput } from "./hooks";
export type {
  UseCurrencyFormatOptions,
  UseCurrencyFormatReturn,
  UseCurrencyInputOptions,
  UseCurrencyInputReturn,
} from "./hooks";

// Re-export locales
export {
  localePresets,
  getLocaleConfig,
  getFormatOptionsFromLocale,
  // Dynamic locale detection
  detectLocaleFormat,
  getCompactLabels,
  createLocaleConfig,
  getAutoLocaleConfig,
  formatWithIntl,
  // Custom locale registry
  registerLocale,
  unregisterLocale,
  // Currency database (ISO 4217)
  currencyDatabase,
  getCurrencyConfig,
} from "./locales";
export type { LocaleConfig, CurrencyInfo } from "./locales";

// Types
export type FormatFunction = (value: string) => string;
export type RemoveFormattingFunction = (value: string) => string;
export type IsAllowedFunction = (values: ValueObject) => boolean;
export type OnValueChangeFunction = (
  values: ValueObject,
  sourceInfo?: { event?: ChangeEvent<HTMLInputElement>; source: "event" | "prop" }
) => void;
export type RenderTextFunction = (
  value: string,
  otherProps: Record<string, unknown>
) => ReactNode;

export type ThousandsGroupStyle = "thousand" | "lakh" | "wan" | "none";

export interface CurrencyFormatProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "onKeyDown" | "onMouseUp" | "onFocus" | "onBlur"
  > {
  value?: string | number;
  defaultValue?: string | number;
  name?: string;
  format?: string | FormatFunction;
  decimalScale?: number;
  decimalSeparator?: string;
  allowedDecimalSeparators?: string[];
  thousandSpacing?: ThousandSpacing;
  thousandSeparator?: string | boolean;
  thousandsGroupStyle?: ThousandsGroupStyle;
  mask?: string | string[];
  allowNegative?: boolean;
  allowEmptyFormatting?: boolean;
  prefix?: string;
  suffix?: string;
  removeFormatting?: RemoveFormattingFunction;
  fixedDecimalScale?: boolean;
  isNumericString?: boolean;
  isAllowed?: IsAllowedFunction;
  onValueChange?: OnValueChangeFunction;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onMouseUp?: (e: MouseEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  type?: "text" | "tel";
  inputMode?: "numeric" | "decimal" | "text";
  displayType?: "input" | "text";
  customInput?: ComponentType<InputHTMLAttributes<HTMLInputElement>>;
  renderText?: RenderTextFunction;
  getInputRef?: (el: HTMLInputElement | null) => void;
}

interface Separators {
  decimalSeparator: string;
  thousandSeparator: string | boolean;
  thousandSpacing: ThousandSpacing;
}

// Props keys to omit when passing to DOM
const PROPS_TO_OMIT: string[] = [
  "value",
  "defaultValue",
  "format",
  "decimalScale",
  "decimalSeparator",
  "allowedDecimalSeparators",
  "thousandSpacing",
  "thousandSeparator",
  "thousandsGroupStyle",
  "mask",
  "allowNegative",
  "allowEmptyFormatting",
  "prefix",
  "suffix",
  "removeFormatting",
  "fixedDecimalScale",
  "isNumericString",
  "isAllowed",
  "onValueChange",
  "onChange",
  "onKeyDown",
  "onMouseUp",
  "onFocus",
  "onBlur",
  "type",
  "inputMode",
  "displayType",
  "customInput",
  "renderText",
  "getInputRef",
  "disabled",
  "readOnly",
];

const CurrencyFormat = forwardRef<HTMLInputElement, CurrencyFormatProps>(
  (props, ref): JSX.Element | null => {
    const {
      displayType = "input",
      decimalSeparator = ".",
      allowedDecimalSeparators,
      thousandSpacing: thousandSpacingProp,
      thousandSeparator = ",",
      thousandsGroupStyle,
      fixedDecimalScale = false,
      prefix = "",
      suffix = "",
      allowNegative = true,
      allowEmptyFormatting = false,
      isNumericString: isNumericStringProp = false,
      type = "text",
      name,
      onValueChange,
      onChange: onChangeProp,
      onKeyDown: onKeyDownProp,
      onMouseUp: onMouseUpProp,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      isAllowed,
      format,
      decimalScale,
      mask = " ",
      removeFormatting: removeFormattingProp,
      value: valueProp,
      defaultValue: defaultValueProp,
      customInput,
      renderText,
      getInputRef,
      inputMode: inputModeProp,
      className = "",
      placeholder = "",
      disabled,
      readOnly,
      ...restProps
    } = props;

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const prevPropsRef = useRef<CurrencyFormatProps>(props);
    const isComposingRef = useRef<boolean>(false);

    // Forward ref
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Resolve thousandSpacing from thousandsGroupStyle or direct prop
    const thousandSpacing = useMemo((): ThousandSpacing => {
      if (thousandSpacingProp) return thousandSpacingProp;
      if (thousandsGroupStyle) {
        switch (thousandsGroupStyle) {
          case "lakh": return "2s";
          case "wan": return "4";
          case "none": return "3"; // fallback, thousand separator handles "none"
          case "thousand":
          default: return "3";
        }
      }
      return "3";
    }, [thousandSpacingProp, thousandsGroupStyle]);

    // Track if component is uncontrolled (using defaultValue)
    const isUncontrolled = valueProp === undefined && defaultValueProp !== undefined;

  // Helper functions using useCallback for memoization
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

      // Remove negation for regex check
      const hasNegation = num[0] === "-";
      if (hasNegation) num = num.replace("-", "");

      num = (num.match(numRegex) || []).join("").replace(decSep, ".");

      // Remove extra decimals
      const firstDecimalIndex = num.indexOf(".");
      if (firstDecimalIndex !== -1) {
        num = `${num.substring(0, firstDecimalIndex)}.${num
          .substring(firstDecimalIndex + 1, num.length)
          .replace(new RegExp(escapeRegExp(decSep), "g"), "")}`;
      }

      // Add negation back
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

      // Ensure leading zero for decimal-only values (e.g., ".5" → "0.5")
      if (beforeDecimal === "" && hasDecimalSeparator) {
        beforeDecimal = "0";
      }

      // Apply decimal precision if defined
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

      // Add prefix and suffix
      if (prefix) beforeDecimal = prefix + beforeDecimal;
      if (suffix) afterDecimal = afterDecimal + suffix;

      // Restore negation sign
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

        // Remove negation sign
        if (isNegative) val = val.substring(1, val.length);

        // Remove prefix
        val =
          prefix && val.indexOf(prefix) === 0
            ? val.substring(prefix.length, val.length)
            : val;

        // Remove suffix
        const suffixLastIndex = val.lastIndexOf(suffix);
        val =
          suffix &&
          suffixLastIndex !== -1 &&
          suffixLastIndex === val.length - suffix.length
            ? val.substring(0, suffixLastIndex)
            : val;

        // Add negation sign back
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
          // Show prefix/suffix or pattern mask when empty
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
    // Use value prop, or defaultValue for initial render of uncontrolled component
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

  // Validate props
  const validateProps = useCallback((): void => {
    const { decimalSeparator: decSep, thousandSeparator: tSep } =
      getSeparators();

    if (decSep === tSep) {
      throw new Error(`
        Decimal separator can't be same as thousand separator.
        thousandSeparator: ${tSep} (thousandSeparator = {true} is same as thousandSeparator = ",")
        decimalSeparator: ${decSep} (default value for decimalSeparator is .)
      `);
    }

    if (mask) {
      const maskAsStr = typeof mask === "string" ? mask : mask.toString();
      if (maskAsStr.match(/\d/g)) {
        throw new Error(`Mask ${mask} should not contain numeric character;`);
      }
    }
  }, [getSeparators, mask]);

  // Initial state calculation
  const getInitialState = useCallback((): {
    value: string;
    numAsString: string;
  } => {
    const formattedValue = formatValueProp();
    return {
      value: formattedValue,
      numAsString: removeFormatting(formattedValue),
    };
  }, [formatValueProp, removeFormatting]);

  // State
  const [state, setState] = useState<{ value: string; numAsString: string }>(
    () => {
      validateProps();
      return getInitialState();
    }
  );

  // Caret position helpers
  const setPatchedCaretPosition = useCallback(
    (el: HTMLInputElement, caretPos: number, currentValue: string): void => {
      setCaretPosition(el, caretPos);
      setTimeout(() => {
        if (el.value === currentValue) setCaretPosition(el, caretPos);
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

      if (typeof format === "string" && !state.value) {
        j = formattedValue.length;
      }

      j = correctCaretPosition(formattedValue, j);

      return j;
    },
    [getNumberRegex, format, state.value, correctCaretPosition]
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
      const lastNumStr = state.numAsString || "";

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
      state.numAsString,
      format,
      checkIfFormatGotDeleted,
      removeFormatting,
      splitDecimal,
    ]
  );

  // IME composition handlers
  const handleCompositionStart = useCallback((): void => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(
    (e: CompositionEvent<HTMLInputElement>): void => {
      isComposingRef.current = false;
      // Trigger change after composition ends
      const changeEvent = new Event("input", { bubbles: true });
      e.target.dispatchEvent(changeEvent);
    },
    []
  );

  // Event handlers
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      // Skip formatting during IME composition
      if (isComposingRef.current) return;
      // Skip when disabled or readOnly
      if (disabled || readOnly) return;

      const el = e.target;
      let inputValue = el.value;
      const lastValue = state.value || "";

      const currentCaretPosition = Math.max(
        el.selectionStart || 0,
        el.selectionEnd || 0
      );

      inputValue = correctInputValue(
        currentCaretPosition,
        lastValue,
        inputValue
      );

      let formattedValue = formatInput(inputValue) || "";
      const numAsString = removeFormatting(formattedValue);

      const valueObj: ValueObject = {
        formattedValue,
        value: numAsString,
        floatValue: parseFloat(numAsString),
        name,
      };

      if (isAllowed && !isAllowed(valueObj)) {
        formattedValue = lastValue;
      }

      el.value = formattedValue;

      const caretPos = getCaretPosition(
        inputValue,
        formattedValue,
        currentCaretPosition
      );

      setPatchedCaretPosition(el, caretPos, formattedValue);

      if (formattedValue !== lastValue) {
        setState({ value: formattedValue, numAsString });
        onValueChange?.(valueObj, { event: e, source: "event" });
        onChangeProp?.(e);
      } else {
        onChangeProp?.(e);
      }
    },
    [
      state.value,
      correctInputValue,
      formatInput,
      removeFormatting,
      isAllowed,
      getCaretPosition,
      setPatchedCaretPosition,
      onValueChange,
      onChangeProp,
      name,
      disabled,
      readOnly,
    ]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>): void => {
      let { numAsString } = state;
      const lastValue = state.value;

      if (!format) {
        numAsString = fixLeadingZero(numAsString) || "";
        const formattedValue = formatNumString(numAsString);
        const valueObj: ValueObject = {
          formattedValue,
          value: numAsString,
          floatValue: parseFloat(numAsString),
          name,
        };

        if (formattedValue !== lastValue) {
          setState({ value: formattedValue, numAsString });
          onValueChange?.(valueObj, { event: e as unknown as ChangeEvent<HTMLInputElement>, source: "event" });
          onBlurProp?.(e);
          return;
        }
      }
      onBlurProp?.(e);
    },
    [state, format, formatNumString, onValueChange, onBlurProp, name]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>): void => {
      const el = e.target as HTMLInputElement;
      const { key } = e;
      const { selectionEnd, value, selectionStart } = el;
      let expectedCaretPosition: number | undefined;

      // allowedDecimalSeparators: replace alternate keys with the actual decimal separator
      if (
        allowedDecimalSeparators &&
        allowedDecimalSeparators.includes(key) &&
        key !== decimalSeparator
      ) {
        e.preventDefault();
        const pos = selectionStart || 0;
        // Insert the actual decimal separator at cursor position
        const newValue = value.substring(0, pos) + decimalSeparator + value.substring(selectionEnd || pos);
        el.value = newValue;
        el.setSelectionRange(pos + 1, pos + 1);
        // Trigger a synthetic input event so handleChange processes the new value
        el.dispatchEvent(new Event("input", { bubbles: true }));
        onKeyDownProp?.(e);
        return;
      }

      const ignoreDecimalSeparator =
        decimalScale !== undefined && fixedDecimalScale;
      const numRegex = getNumberRegex(false, ignoreDecimalSeparator);
      const negativeRegex = new RegExp("-");
      const isPatternFormat = typeof format === "string";

      const leftBound = isPatternFormat
        ? (format as string).indexOf("#")
        : prefix.length + (value[0] === "-" ? 1 : 0);
      const rightBound = isPatternFormat
        ? (format as string).lastIndexOf("#") + 1
        : value.length - suffix.length;

      // Handle Enter key: format value like blur (skip for readOnly/disabled)
      if (key === "Enter" && !format && !readOnly && !disabled) {
        let numAsString = state.numAsString || "";
        numAsString = fixLeadingZero(numAsString) || "";
        const formattedValue = formatNumString(numAsString);
        if (formattedValue !== state.value) {
          const valueObj: ValueObject = {
            formattedValue,
            value: numAsString,
            floatValue: parseFloat(numAsString),
            name,
          };
          setState({ value: formattedValue, numAsString });
          onValueChange?.(valueObj, { source: "event" });
          el.value = formattedValue;
        }
        onKeyDownProp?.(e);
        return;
      }

      // Handle Home key: move cursor after prefix
      if (key === "Home" && selectionStart === selectionEnd) {
        e.preventDefault();
        setPatchedCaretPosition(el, leftBound, value);
        onKeyDownProp?.(e);
        return;
      }

      // Handle End key: move cursor before suffix
      if (key === "End" && selectionStart === selectionEnd) {
        e.preventDefault();
        setPatchedCaretPosition(el, rightBound, value);
        onKeyDownProp?.(e);
        return;
      }

      if (key === "ArrowLeft" || key === "Backspace") {
        expectedCaretPosition = (selectionStart || 0) - 1;
      } else if (key === "ArrowRight") {
        expectedCaretPosition = (selectionStart || 0) + 1;
      } else if (key === "Delete") {
        expectedCaretPosition = selectionStart || 0;
      }

      if (
        expectedCaretPosition === undefined ||
        selectionStart !== selectionEnd
      ) {
        onKeyDownProp?.(e);
        return;
      }

      let newCaretPosition = expectedCaretPosition;

      if (key === "ArrowLeft" || key === "ArrowRight") {
        const direction = key === "ArrowLeft" ? "left" : "right";
        newCaretPosition = correctCaretPosition(
          value,
          expectedCaretPosition,
          direction
        );
      } else if (
        key === "Delete" &&
        !numRegex.test(value[expectedCaretPosition]) &&
        !negativeRegex.test(value[expectedCaretPosition])
      ) {
        while (
          !numRegex.test(value[newCaretPosition]) &&
          newCaretPosition < rightBound
        ) {
          newCaretPosition++;
        }
      } else if (
        key === "Backspace" &&
        !numRegex.test(value[expectedCaretPosition]) &&
        !negativeRegex.test(value[expectedCaretPosition])
      ) {
        while (
          !numRegex.test(value[newCaretPosition - 1]) &&
          newCaretPosition > leftBound
        ) {
          newCaretPosition--;
        }
        newCaretPosition = correctCaretPosition(
          value,
          newCaretPosition,
          "left"
        );
      }

      if (
        newCaretPosition !== expectedCaretPosition ||
        expectedCaretPosition < leftBound ||
        expectedCaretPosition > rightBound
      ) {
        e.preventDefault();
        setPatchedCaretPosition(el, newCaretPosition, value);
      }

      // For unit tests
      if (
        (e as KeyboardEvent<HTMLInputElement> & { isUnitTestRun?: boolean })
          .isUnitTestRun
      ) {
        setPatchedCaretPosition(el, newCaretPosition, value);
      }

      onKeyDownProp?.(e);
    },
    [
      decimalScale,
      fixedDecimalScale,
      getNumberRegex,
      format,
      prefix,
      suffix,
      correctCaretPosition,
      setPatchedCaretPosition,
      onKeyDownProp,
      state.numAsString,
      state.value,
      formatNumString,
      onValueChange,
      name,
      readOnly,
      disabled,
      allowedDecimalSeparators,
      decimalSeparator,
    ]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent<HTMLInputElement>): void => {
      const el = e.target as HTMLInputElement;
      const { selectionStart, selectionEnd, value } = el;

      if (selectionStart === selectionEnd) {
        const caretPosition = correctCaretPosition(value, selectionStart || 0);
        if (caretPosition !== selectionStart) {
          setPatchedCaretPosition(el, caretPosition, value);
        }
      }

      onMouseUpProp?.(e);
    },
    [correctCaretPosition, setPatchedCaretPosition, onMouseUpProp]
  );

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>): void => {
      const el = e.target as HTMLInputElement;

      // Fire onFocus immediately so consumers get synchronous feedback
      onFocusProp?.(e);

      // Defer caret correction to avoid interfering with focus behavior
      setTimeout(() => {
        const { selectionStart, value } = el;
        const caretPosition = correctCaretPosition(value, selectionStart || 0);

        if (caretPosition !== selectionStart) {
          setPatchedCaretPosition(el, caretPosition, value);
        }
      });
    },
    [correctCaretPosition, setPatchedCaretPosition, onFocusProp]
  );

  // Effect to validate props on mount and update
  useEffect(() => {
    validateProps();
  }, [validateProps]);

  // Effect to update value when props change
  useEffect(() => {
    const prevProps = prevPropsRef.current;

    if (prevProps !== props) {
      // For uncontrolled component (using defaultValue), only reformat
      // when format-related props change, not on every render
      if (isUncontrolled && valueProp === undefined) {
        // Re-format existing value with new format options
        const lastNumStr = state.numAsString || "";
        const formattedValue = formatNumString(lastNumStr);

        if (formattedValue !== state.value) {
          setState({
            value: formattedValue,
            numAsString: lastNumStr,
          });
        }
      } else {
        const lastNumStr = state.numAsString || "";

        const formattedValue =
          valueProp === undefined
            ? formatNumString(lastNumStr)
            : formatValueProp();

        if (formattedValue !== state.value) {
          const newNumAsString = removeFormatting(formattedValue);
          setState({
            value: formattedValue,
            numAsString: newNumAsString,
          });

          // Notify about prop-driven value change
          if (onValueChange) {
            const valueObj: ValueObject = {
              formattedValue,
              value: newNumAsString,
              floatValue: parseFloat(newNumAsString),
              name,
            };
            onValueChange(valueObj, { source: "prop" });
          }
        }
      }
    }

    prevPropsRef.current = props;
  }, [
    props,
    valueProp,
    isUncontrolled,
    state,
    formatNumString,
    formatValueProp,
    removeFormatting,
    onValueChange,
    name,
  ]);

  // Effect to call getInputRef callback
  useEffect(() => {
    if (getInputRef) {
      getInputRef(inputRef.current);
    }
  }, [getInputRef]);

  // Get other props to pass to input
  const otherProps = useMemo(
    () => omit(restProps as Record<string, unknown>, PROPS_TO_OMIT),
    [restProps]
  );

  // Compute inputMode: prefer explicit prop, else auto-detect
  const resolvedInputMode = useMemo(() => {
    if (inputModeProp) return inputModeProp;
    if (format) return undefined; // pattern format (phone, card) - let browser decide
    if (decimalScale === 0) return "numeric" as const;
    return "decimal" as const;
  }, [inputModeProp, format, decimalScale]);

  // Build input props
  const inputProps = useMemo(
    () => ({
      ...otherProps,
      type,
      inputMode: resolvedInputMode,
      name,
      value: state.value || "",
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onMouseUp: handleMouseUp,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
      placeholder,
      className,
      disabled,
      readOnly,
      ref: inputRef,
    }),
    [
      otherProps,
      type,
      resolvedInputMode,
      name,
      state.value,
      handleChange,
      handleKeyDown,
      handleMouseUp,
      handleFocus,
      handleBlur,
      handleCompositionStart,
      handleCompositionEnd,
      placeholder,
      className,
      disabled,
      readOnly,
    ]
  );

  // Render
  if (displayType === "text") {
    return renderText ? (
      <>{renderText(state.value || "", otherProps)}</>
    ) : (
      <span
        role="status"
        aria-live="polite"
        {...(otherProps as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {state.value}
      </span>
    );
  }

  if (customInput) {
    const CustomInput = customInput;
    return <CustomInput {...inputProps} />;
  }

  return <input {...inputProps} />;
  }
);

CurrencyFormat.displayName = "CurrencyFormat";

export default CurrencyFormat;
