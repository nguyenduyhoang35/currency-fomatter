import { FormatCurrencyOptions, CompactDisplayOptions } from "./utils";

export interface LocaleConfig extends FormatCurrencyOptions {
  locale: string;
  currency?: string;
  currencySymbol?: string;
  compactDisplay?: CompactDisplayOptions;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  decimalDigits: number;
  symbolPosition: "prefix" | "suffix";
  name: string;
}

/**
 * ISO 4217 currency database
 * Knows decimal places, symbol, and position for each currency
 */
export const currencyDatabase: Record<string, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", decimalDigits: 2, symbolPosition: "prefix", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", decimalDigits: 2, symbolPosition: "suffix", name: "Euro" },
  GBP: { code: "GBP", symbol: "£", decimalDigits: 2, symbolPosition: "prefix", name: "British Pound" },
  JPY: { code: "JPY", symbol: "¥", decimalDigits: 0, symbolPosition: "prefix", name: "Japanese Yen" },
  CNY: { code: "CNY", symbol: "¥", decimalDigits: 2, symbolPosition: "prefix", name: "Chinese Yuan" },
  KRW: { code: "KRW", symbol: "₩", decimalDigits: 0, symbolPosition: "prefix", name: "South Korean Won" },
  INR: { code: "INR", symbol: "₹", decimalDigits: 2, symbolPosition: "prefix", name: "Indian Rupee" },
  VND: { code: "VND", symbol: "₫", decimalDigits: 0, symbolPosition: "suffix", name: "Vietnamese Dong" },
  BRL: { code: "BRL", symbol: "R$", decimalDigits: 2, symbolPosition: "prefix", name: "Brazilian Real" },
  RUB: { code: "RUB", symbol: "₽", decimalDigits: 2, symbolPosition: "suffix", name: "Russian Ruble" },
  THB: { code: "THB", symbol: "฿", decimalDigits: 2, symbolPosition: "prefix", name: "Thai Baht" },
  IDR: { code: "IDR", symbol: "Rp", decimalDigits: 0, symbolPosition: "prefix", name: "Indonesian Rupiah" },
  MYR: { code: "MYR", symbol: "RM", decimalDigits: 2, symbolPosition: "prefix", name: "Malaysian Ringgit" },
  SGD: { code: "SGD", symbol: "S$", decimalDigits: 2, symbolPosition: "prefix", name: "Singapore Dollar" },
  PHP: { code: "PHP", symbol: "₱", decimalDigits: 2, symbolPosition: "prefix", name: "Philippine Peso" },
  TWD: { code: "TWD", symbol: "NT$", decimalDigits: 0, symbolPosition: "prefix", name: "Taiwan Dollar" },
  HKD: { code: "HKD", symbol: "HK$", decimalDigits: 2, symbolPosition: "prefix", name: "Hong Kong Dollar" },
  AUD: { code: "AUD", symbol: "A$", decimalDigits: 2, symbolPosition: "prefix", name: "Australian Dollar" },
  CAD: { code: "CAD", symbol: "C$", decimalDigits: 2, symbolPosition: "prefix", name: "Canadian Dollar" },
  NZD: { code: "NZD", symbol: "NZ$", decimalDigits: 2, symbolPosition: "prefix", name: "New Zealand Dollar" },
  CHF: { code: "CHF", symbol: "CHF", decimalDigits: 2, symbolPosition: "prefix", name: "Swiss Franc" },
  SEK: { code: "SEK", symbol: "kr", decimalDigits: 2, symbolPosition: "suffix", name: "Swedish Krona" },
  NOK: { code: "NOK", symbol: "kr", decimalDigits: 2, symbolPosition: "prefix", name: "Norwegian Krone" },
  DKK: { code: "DKK", symbol: "kr", decimalDigits: 2, symbolPosition: "prefix", name: "Danish Krone" },
  PLN: { code: "PLN", symbol: "zł", decimalDigits: 2, symbolPosition: "suffix", name: "Polish Zloty" },
  CZK: { code: "CZK", symbol: "Kč", decimalDigits: 2, symbolPosition: "suffix", name: "Czech Koruna" },
  HUF: { code: "HUF", symbol: "Ft", decimalDigits: 0, symbolPosition: "suffix", name: "Hungarian Forint" },
  TRY: { code: "TRY", symbol: "₺", decimalDigits: 2, symbolPosition: "prefix", name: "Turkish Lira" },
  ZAR: { code: "ZAR", symbol: "R", decimalDigits: 2, symbolPosition: "prefix", name: "South African Rand" },
  MXN: { code: "MXN", symbol: "$", decimalDigits: 2, symbolPosition: "prefix", name: "Mexican Peso" },
  ARS: { code: "ARS", symbol: "$", decimalDigits: 2, symbolPosition: "prefix", name: "Argentine Peso" },
  CLP: { code: "CLP", symbol: "$", decimalDigits: 0, symbolPosition: "prefix", name: "Chilean Peso" },
  COP: { code: "COP", symbol: "$", decimalDigits: 0, symbolPosition: "prefix", name: "Colombian Peso" },
  PEN: { code: "PEN", symbol: "S/", decimalDigits: 2, symbolPosition: "prefix", name: "Peruvian Sol" },
  AED: { code: "AED", symbol: "د.إ", decimalDigits: 2, symbolPosition: "suffix", name: "UAE Dirham" },
  SAR: { code: "SAR", symbol: "﷼", decimalDigits: 2, symbolPosition: "suffix", name: "Saudi Riyal" },
  EGP: { code: "EGP", symbol: "E£", decimalDigits: 2, symbolPosition: "prefix", name: "Egyptian Pound" },
  NGN: { code: "NGN", symbol: "₦", decimalDigits: 2, symbolPosition: "prefix", name: "Nigerian Naira" },
  KES: { code: "KES", symbol: "KSh", decimalDigits: 2, symbolPosition: "prefix", name: "Kenyan Shilling" },
  ILS: { code: "ILS", symbol: "₪", decimalDigits: 2, symbolPosition: "prefix", name: "Israeli Shekel" },
  PKR: { code: "PKR", symbol: "₨", decimalDigits: 0, symbolPosition: "prefix", name: "Pakistani Rupee" },
  BDT: { code: "BDT", symbol: "৳", decimalDigits: 2, symbolPosition: "prefix", name: "Bangladeshi Taka" },
  UAH: { code: "UAH", symbol: "₴", decimalDigits: 2, symbolPosition: "suffix", name: "Ukrainian Hryvnia" },
  RON: { code: "RON", symbol: "lei", decimalDigits: 2, symbolPosition: "suffix", name: "Romanian Leu" },
  BGN: { code: "BGN", symbol: "лв", decimalDigits: 2, symbolPosition: "suffix", name: "Bulgarian Lev" },
  HRK: { code: "HRK", symbol: "kn", decimalDigits: 2, symbolPosition: "suffix", name: "Croatian Kuna" },
  ISK: { code: "ISK", symbol: "kr", decimalDigits: 0, symbolPosition: "prefix", name: "Icelandic Krona" },
  BHD: { code: "BHD", symbol: "BD", decimalDigits: 3, symbolPosition: "prefix", name: "Bahraini Dinar" },
  KWD: { code: "KWD", symbol: "KD", decimalDigits: 3, symbolPosition: "prefix", name: "Kuwaiti Dinar" },
  OMR: { code: "OMR", symbol: "OMR", decimalDigits: 3, symbolPosition: "prefix", name: "Omani Rial" },
};

/**
 * Get format options from a currency code (ISO 4217)
 * Automatically configures decimal places, symbol, and position
 *
 * @example
 * getCurrencyConfig("JPY")  // → { prefix: "¥", decimalScale: 0, ... }
 * getCurrencyConfig("EUR")  // → { suffix: " €", decimalScale: 2, ... }
 * getCurrencyConfig("BHD")  // → { prefix: "BD", decimalScale: 3, ... }
 */
export const getCurrencyConfig = (
  currencyCode: string,
  options?: { locale?: string }
): FormatCurrencyOptions => {
  const code = currencyCode.toUpperCase();
  const info = currencyDatabase[code];

  if (info) {
    return {
      prefix: info.symbolPosition === "prefix" ? info.symbol : "",
      suffix: info.symbolPosition === "suffix" ? " " + info.symbol : "",
      decimalScale: info.decimalDigits,
      fixedDecimalScale: true,
      thousandSeparator: ",",
      decimalSeparator: ".",
    };
  }

  // Fallback: try Intl.NumberFormat for unknown currencies
  if (options?.locale) {
    return detectLocaleFormat(options.locale, code);
  }

  return {
    prefix: code + " ",
    decimalScale: 2,
    fixedDecimalScale: true,
    thousandSeparator: ",",
    decimalSeparator: ".",
  };
};

/**
 * Detect locale format options from browser's Intl.NumberFormat
 * This provides dynamic locale support without hardcoding
 */
export const detectLocaleFormat = (
  locale?: string,
  currency?: string
): FormatCurrencyOptions => {
  // Use browser locale if not specified
  const resolvedLocale = locale ||
    (typeof navigator !== "undefined" ? navigator.language : "en-US");

  try {
    // Use Intl.NumberFormat to detect separators
    const formatter = new Intl.NumberFormat(resolvedLocale, {
      style: currency ? "currency" : "decimal",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Format a test number to detect separators
    const parts = formatter.formatToParts(1234567.89);

    let thousandSeparator = ",";
    let decimalSeparator = ".";
    let prefix = "";
    let suffix = "";

    for (const part of parts) {
      switch (part.type) {
        case "group":
          thousandSeparator = part.value;
          break;
        case "decimal":
          decimalSeparator = part.value;
          break;
        case "currency": {
          // Detect if currency is prefix or suffix
          const currencyIndex = parts.findIndex(p => p.type === "currency");
          const integerIndex = parts.findIndex(p => p.type === "integer");
          if (currencyIndex < integerIndex) {
            prefix = part.value;
          } else {
            suffix = part.value;
          }
          break;
        }
        case "literal": {
          // Handle spacing around currency
          const litIndex = parts.indexOf(part);
          const currIdx = parts.findIndex(p => p.type === "currency");
          if (currIdx !== -1) {
            if (litIndex === currIdx + 1 && !suffix) {
              // Space after prefix currency
              prefix = prefix + part.value;
            } else if (litIndex === currIdx - 1 && !prefix) {
              // Space before suffix currency
              suffix = part.value + suffix;
            }
          }
          break;
        }
      }
    }

    // Detect thousand spacing (check if Indian format)
    const thousandSpacing = detectThousandSpacing(resolvedLocale);

    return {
      thousandSeparator: thousandSeparator || false,
      decimalSeparator,
      prefix,
      suffix,
      thousandSpacing,
    };
  } catch {
    // Fallback for environments without Intl support
    return {
      thousandSeparator: ",",
      decimalSeparator: ".",
      prefix: currency ? "$" : "",
      suffix: "",
      thousandSpacing: "3",
    };
  }
};

/**
 * Detect thousand spacing pattern based on locale
 */
const detectThousandSpacing = (locale: string): "2" | "2s" | "3" | "4" => {
  // Indian locales use 2s spacing (lakhs/crores)
  if (locale.startsWith("en-IN") || locale.startsWith("hi") ||
      locale.startsWith("bn") || locale.startsWith("ta") ||
      locale.startsWith("te") || locale.startsWith("mr")) {
    return "2s";
  }
  // Chinese/Japanese/Korean sometimes use 4-digit grouping
  // but modern usage is mostly 3-digit
  return "3";
};

/**
 * Get compact display labels for a locale using Intl
 */
export const getCompactLabels = (
  locale?: string
): CompactDisplayOptions => {
  const resolvedLocale = locale ||
    (typeof navigator !== "undefined" ? navigator.language : "en-US");

  try {
    const formatCompactNumber = (num: number): string => {
      const formatter = new Intl.NumberFormat(resolvedLocale, {
        notation: "compact",
        compactDisplay: "short",
      });
      const parts = formatter.formatToParts(num);
      const compactPart = parts.find(p => p.type === "compact");
      return compactPart?.value || "";
    };

    return {
      thousand: formatCompactNumber(1000).replace(/[\d.,\s]/g, "") || "K",
      million: formatCompactNumber(1000000).replace(/[\d.,\s]/g, "") || "M",
      billion: formatCompactNumber(1000000000).replace(/[\d.,\s]/g, "") || "B",
      trillion: formatCompactNumber(1000000000000).replace(/[\d.,\s]/g, "") || "T",
    };
  } catch {
    return {
      thousand: "K",
      million: "M",
      billion: "B",
      trillion: "T",
    };
  }
};

/**
 * Create a complete locale config dynamically from browser's Intl
 */
export const createLocaleConfig = (
  locale?: string,
  currency?: string
): LocaleConfig => {
  const resolvedLocale = locale ||
    (typeof navigator !== "undefined" ? navigator.language : "en-US");

  const formatOptions = detectLocaleFormat(resolvedLocale, currency);
  const compactDisplay = getCompactLabels(resolvedLocale);

  return {
    locale: resolvedLocale,
    currency,
    ...formatOptions,
    compactDisplay,
  };
};

// Custom locale registry for user-defined locales
const customLocales: Record<string, LocaleConfig> = {}

/**
 * Register a custom locale configuration
 */
export const registerLocale = (name: string, config: LocaleConfig): void => {
  customLocales[name] = config;
};

/**
 * Unregister a custom locale
 */
export const unregisterLocale = (name: string): void => {
  delete customLocales[name];
};

export const localePresets: Record<string, LocaleConfig> = {
  "en-US": {
    locale: "en-US",
    currency: "USD",
    currencySymbol: "$",
    prefix: "$",
    thousandSeparator: ",",
    decimalSeparator: ".",
    thousandSpacing: "3",
    compactDisplay: {
      thousand: "K",
      million: "M",
      billion: "B",
      trillion: "T",
    },
  },
  "vi-VN": {
    locale: "vi-VN",
    currency: "VND",
    currencySymbol: "₫",
    suffix: " ₫",
    thousandSeparator: ".",
    decimalSeparator: ",",
    thousandSpacing: "3",
    decimalScale: 0,
    compactDisplay: {
      thousand: " nghìn",
      million: " triệu",
      billion: " tỷ",
      trillion: " nghìn tỷ",
    },
  },
  "de-DE": {
    locale: "de-DE",
    currency: "EUR",
    currencySymbol: "€",
    suffix: " €",
    thousandSeparator: ".",
    decimalSeparator: ",",
    thousandSpacing: "3",
    compactDisplay: {
      thousand: " Tsd",
      million: " Mio",
      billion: " Mrd",
      trillion: " Bio",
    },
  },
  "ja-JP": {
    locale: "ja-JP",
    currency: "JPY",
    currencySymbol: "¥",
    prefix: "¥",
    thousandSeparator: ",",
    decimalSeparator: ".",
    thousandSpacing: "3",
    decimalScale: 0,
    compactDisplay: {
      thousand: "千",
      million: "百万",
      billion: "十億",
      trillion: "兆",
    },
  },
  "en-IN": {
    locale: "en-IN",
    currency: "INR",
    currencySymbol: "₹",
    prefix: "₹",
    thousandSeparator: ",",
    decimalSeparator: ".",
    thousandSpacing: "2s",
    compactDisplay: {
      thousand: "K",
      million: "L", // Lakh
      billion: "Cr", // Crore
      trillion: "T",
    },
  },
  "fr-FR": {
    locale: "fr-FR",
    currency: "EUR",
    currencySymbol: "€",
    suffix: " €",
    thousandSeparator: " ",
    decimalSeparator: ",",
    thousandSpacing: "3",
    compactDisplay: {
      thousand: " k",
      million: " M",
      billion: " Md",
      trillion: " Bn",
    },
  },
  "zh-CN": {
    locale: "zh-CN",
    currency: "CNY",
    currencySymbol: "¥",
    prefix: "¥",
    thousandSeparator: ",",
    decimalSeparator: ".",
    thousandSpacing: "3",
    compactDisplay: {
      thousand: "千",
      million: "万",
      billion: "亿",
      trillion: "万亿",
    },
  },
  "ko-KR": {
    locale: "ko-KR",
    currency: "KRW",
    currencySymbol: "₩",
    prefix: "₩",
    thousandSeparator: ",",
    decimalSeparator: ".",
    thousandSpacing: "3",
    decimalScale: 0,
    compactDisplay: {
      thousand: "천",
      million: "백만",
      billion: "십억",
      trillion: "조",
    },
  },
  "pt-BR": {
    locale: "pt-BR",
    currency: "BRL",
    currencySymbol: "R$",
    prefix: "R$ ",
    thousandSeparator: ".",
    decimalSeparator: ",",
    thousandSpacing: "3",
    compactDisplay: {
      thousand: " mil",
      million: " mi",
      billion: " bi",
      trillion: " tri",
    },
  },
  "en-GB": {
    locale: "en-GB",
    currency: "GBP",
    currencySymbol: "£",
    prefix: "£",
    thousandSeparator: ",",
    decimalSeparator: ".",
    thousandSpacing: "3",
    compactDisplay: {
      thousand: "K",
      million: "M",
      billion: "B",
      trillion: "T",
    },
  },
};

/**
 * Get locale configuration by locale code
 * Priority: custom locales > presets > dynamic detection
 */
export const getLocaleConfig = (
  locale: string,
  options?: { currency?: string; useDynamic?: boolean }
): LocaleConfig => {
  // 1. Check custom locales first
  if (customLocales[locale]) {
    return customLocales[locale];
  }

  // 2. Check presets
  if (localePresets[locale]) {
    return localePresets[locale];
  }

  // 3. Use dynamic detection (Intl.NumberFormat)
  if (options?.useDynamic !== false) {
    return createLocaleConfig(locale, options?.currency);
  }

  // 4. Fallback to en-US
  return localePresets["en-US"];
};

/**
 * Get format options from locale (without locale-specific metadata)
 * Priority: custom locales > presets > dynamic detection
 */
export const getFormatOptionsFromLocale = (
  locale: string,
  options?: { currency?: string; useDynamic?: boolean }
): FormatCurrencyOptions => {
  const config = getLocaleConfig(locale, options);

  // Extract only format-related options, excluding metadata
  const {
    decimalScale,
    decimalSeparator,
    thousandSeparator,
    thousandSpacing,
    prefix,
    suffix,
    fixedDecimalScale,
    allowNegative,
  } = config;

  return {
    decimalScale,
    decimalSeparator,
    thousandSeparator,
    thousandSpacing,
    prefix,
    suffix,
    fixedDecimalScale,
    allowNegative,
  };
};

/**
 * Auto-detect user's locale and return format options
 * Uses browser's navigator.language
 */
export const getAutoLocaleConfig = (currency?: string): LocaleConfig => {
  const browserLocale =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  return getLocaleConfig(browserLocale, { currency, useDynamic: true });
};

/**
 * Format a number using browser's Intl.NumberFormat directly
 * Most accurate but returns a string only (not parsed)
 */
export const formatWithIntl = (
  value: number,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string => {
  const resolvedLocale = locale ||
    (typeof navigator !== "undefined" ? navigator.language : "en-US");

  try {
    return new Intl.NumberFormat(resolvedLocale, options).format(value);
  } catch {
    return value.toString();
  }
};
