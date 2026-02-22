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
  omit,
  ValueObject,
  ThousandSpacing,
} from "./utils";

import { useFormatting } from "./useFormatting";
import { useCaretManagement } from "./useCaretManagement";

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
          case "none": return "3";
          case "thousand":
          default: return "3";
        }
      }
      return "3";
    }, [thousandSpacingProp, thousandsGroupStyle]);

    const isUncontrolled = valueProp === undefined && defaultValueProp !== undefined;

    // ── Formatting helpers ────────────────────────────────────────────────────
    const {
      getSeparators,
      getNumberRegex,
      splitDecimal,
      removeFormatting,
      formatNumString,
      formatInput,
      formatValueProp,
      applyLeadingZeroFix,
    } = useFormatting({
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
    });

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

    // ── Caret management ──────────────────────────────────────────────────────
    const {
      setPatchedCaretPosition,
      correctCaretPosition,
      getCaretPosition,
      correctInputValue,
    } = useCaretManagement({
      format,
      prefix,
      suffix,
      decimalScale,
      fixedDecimalScale,
      getSeparators,
      getNumberRegex,
      removeFormatting,
      splitDecimal,
      numAsString: state.numAsString,
      currentValue: state.value,
    });

    // ── IME composition handlers ──────────────────────────────────────────────
    const handleCompositionStart = useCallback((): void => {
      isComposingRef.current = true;
    }, []);

    const handleCompositionEnd = useCallback(
      (e: CompositionEvent<HTMLInputElement>): void => {
        isComposingRef.current = false;
        const changeEvent = new Event("input", { bubbles: true });
        e.target.dispatchEvent(changeEvent);
      },
      []
    );

    // ── Event handlers ────────────────────────────────────────────────────────
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>): void => {
        if (isComposingRef.current) return;
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
          numAsString = applyLeadingZeroFix(numAsString);
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
      [state, format, formatNumString, applyLeadingZeroFix, onValueChange, onBlurProp, name]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>): void => {
        const el = e.target as HTMLInputElement;
        const { key } = e;
        const { selectionEnd, value, selectionStart } = el;
        let expectedCaretPosition: number | undefined;

        if (
          allowedDecimalSeparators &&
          allowedDecimalSeparators.includes(key) &&
          key !== decimalSeparator
        ) {
          e.preventDefault();
          const pos = selectionStart || 0;
          const newValue = value.substring(0, pos) + decimalSeparator + value.substring(selectionEnd || pos);
          el.value = newValue;
          el.setSelectionRange(pos + 1, pos + 1);
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

        if (key === "Enter" && !format && !readOnly && !disabled) {
          let numAsString = state.numAsString || "";
          numAsString = applyLeadingZeroFix(numAsString);
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

        if (key === "Home" && selectionStart === selectionEnd) {
          e.preventDefault();
          setPatchedCaretPosition(el, leftBound, value);
          onKeyDownProp?.(e);
          return;
        }

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
        applyLeadingZeroFix,
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

        onFocusProp?.(e);

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

    // ── Effects ───────────────────────────────────────────────────────────────
    useEffect(() => {
      validateProps();
    }, [validateProps]);

    useEffect(() => {
      const prevProps = prevPropsRef.current;

      if (prevProps !== props) {
        if (isUncontrolled && valueProp === undefined) {
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

    useEffect(() => {
      if (getInputRef) {
        getInputRef(inputRef.current);
      }
    }, [getInputRef]);

    // ── Computed values ───────────────────────────────────────────────────────
    const otherProps = useMemo(
      () => omit(restProps as Record<string, unknown>, PROPS_TO_OMIT),
      [restProps]
    );

    const resolvedInputMode = useMemo(() => {
      if (inputModeProp) return inputModeProp;
      if (format) return undefined;
      if (decimalScale === 0) return "numeric" as const;
      return "decimal" as const;
    }, [inputModeProp, format, decimalScale]);

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

    // ── Render ────────────────────────────────────────────────────────────────
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
