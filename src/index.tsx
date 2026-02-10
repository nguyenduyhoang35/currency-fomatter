import CurrencyFormat, {
  PatternFormat,
  formatCurrency,
  parseCurrency,
  formatCompact,
  parseCompact,
  defaultCompactDisplay,
  useCurrencyFormat,
  useCurrencyInput,
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
  currencyDatabase,
  getCurrencyConfig,
} from "./components/currency";

export {
  CurrencyFormat,
  PatternFormat,
  // Utility functions
  formatCurrency,
  parseCurrency,
  formatCompact,
  parseCompact,
  defaultCompactDisplay,
  // Hooks
  useCurrencyFormat,
  useCurrencyInput,
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
  // Currency database (ISO 4217)
  currencyDatabase,
  getCurrencyConfig,
};

export default CurrencyFormat;

export type {
  CurrencyFormatProps,
  ThousandsGroupStyle,
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
  UseCurrencyInputOptions,
  UseCurrencyInputReturn,
  LocaleConfig,
  CurrencyInfo,
  PatternFormatProps,
} from "./components/currency";