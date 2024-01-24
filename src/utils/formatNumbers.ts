import { Currency, CurrencyAmount, Fraction } from '@uniswap/sdk-core'
import { DEFAULT_LOCALE, SupportedLocale } from 'constants/locales'
import JSBI from 'jsbi'
import formatLocaleNumber from './formatLocaleNumber'

//for now we only support USD
export const SUPPORTED_LOCAL_CURRENCIES = [
    'USD',
  ] as const
  
export type SupportedLocalCurrency = (typeof SUPPORTED_LOCAL_CURRENCIES)[number]

export const DEFAULT_LOCAL_CURRENCY: SupportedLocalCurrency = 'USD'

export function useFormatterLocales(): {
    formatterLocale: SupportedLocale
    formatterLocalCurrency: SupportedLocalCurrency
  } {
    //TODO
    //add support for other locales
    return {
      formatterLocale: DEFAULT_LOCALE,
      formatterLocalCurrency: DEFAULT_LOCAL_CURRENCY,
    }
  }
  
export function formatCurrencyAmount(
amount: CurrencyAmount<Currency> | undefined,
sigFigs: number,
locale: SupportedLocale = DEFAULT_LOCALE,
fixedDecimals?: number
): string {
if (!amount) {
    return '-'
}

if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
    return '0'
}

if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
    return `<${formatLocaleNumber({ number: 0.00001, locale })}`
}

return formatLocaleNumber({ number: amount, locale, sigFigs, fixedDecimals })
}