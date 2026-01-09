import CurrencyFormat, {
  formatCurrency,
  parseCurrency,
  formatCompact,
  parseCompact,
  defaultCompactDisplay,
  useCurrencyFormat,
  localePresets,
  getLocaleConfig,
  getFormatOptionsFromLocale,
  detectLocaleFormat,
  getCompactLabels,
  createLocaleConfig,
  getAutoLocaleConfig,
  formatWithIntl,
  registerLocale,
  unregisterLocale,
} from "./components/currency";

export {
  CurrencyFormat,
  // Utility functions
  formatCurrency,
  parseCurrency,
  formatCompact,
  parseCompact,
  defaultCompactDisplay,
  // Hooks
  useCurrencyFormat,
  // Locales (static presets)
  localePresets,
  getLocaleConfig,
  getFormatOptionsFromLocale,
  // Dynamic locale detection (uses Intl.NumberFormat)
  detectLocaleFormat,
  getCompactLabels,
  createLocaleConfig,
  getAutoLocaleConfig,
  formatWithIntl,
  // Custom locale registry
  registerLocale,
  unregisterLocale,
};

export default CurrencyFormat;

export type {
  CurrencyFormatProps,
  ValueObject,
  ThousandSpacing,
  FormatFunction,
  RemoveFormattingFunction,
  IsAllowedFunction,
  OnValueChangeFunction,
  RenderTextFunction,
  FormatCurrencyOptions,
  ParseCurrencyOptions,
  CompactDisplayOptions,
  FormatCompactOptions,
  UseCurrencyFormatOptions,
  UseCurrencyFormatReturn,
  LocaleConfig,
} from "./components/currency";