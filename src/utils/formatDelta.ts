import { DEFAULT_LOCALE, SupportedLocale } from "../constants/locales"

type Nullish<T> = T | null | undefined

export default function formatDelta(delta: Nullish<number>, locale: SupportedLocale = DEFAULT_LOCALE) {
    if (delta === null || delta === undefined || delta === Infinity || isNaN(delta)) {
      return '-'
    }
  
    return `${Number(Math.abs(delta).toFixed(2)).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    })}%`
  }