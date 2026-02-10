import React, { forwardRef } from "react";
import CurrencyFormat from "./index";
import type { CurrencyFormatProps } from "./index";

export interface PatternFormatProps
  extends Omit<
    CurrencyFormatProps,
    | "format"
    | "thousandSeparator"
    | "thousandSpacing"
    | "thousandsGroupStyle"
    | "prefix"
    | "suffix"
    | "decimalSeparator"
    | "decimalScale"
    | "fixedDecimalScale"
    | "allowNegative"
    | "allowEmptyFormatting"
    | "allowedDecimalSeparators"
    | "isNumericString"
  > {
  /** Pattern string using # as digit placeholder (e.g., "+1 (###) ###-####") */
  format: string;
  /** Mask character(s) for unfilled positions */
  mask?: string | string[];
  /** Allow empty positions to show the mask */
  allowEmptyFormatting?: boolean;
}

/**
 * PatternFormat — a focused component for pattern-based formatting
 * (phone numbers, credit cards, dates, etc.)
 *
 * This is a convenience wrapper around CurrencyFormat that only exposes
 * pattern-relevant props, providing a cleaner API for non-currency use cases.
 *
 * @example
 * ```tsx
 * // Phone number
 * <PatternFormat format="+1 (###) ###-####" mask="_" />
 *
 * // Credit card
 * <PatternFormat format="#### #### #### ####" mask="_" />
 *
 * // Date
 * <PatternFormat format="##/##/####" mask={["D","D","M","M","Y","Y","Y","Y"]} />
 * ```
 */
const PatternFormat = forwardRef<HTMLInputElement, PatternFormatProps>(
  (props, ref) => {
    const { format, mask = " ", allowEmptyFormatting = false, ...rest } = props;

    return (
      <CurrencyFormat
        ref={ref}
        format={format}
        mask={mask}
        allowEmptyFormatting={allowEmptyFormatting}
        {...rest}
      />
    );
  }
);

PatternFormat.displayName = "PatternFormat";

export default PatternFormat;
