import { createAction } from '@reduxjs/toolkit'

export enum Field {
  CURRENCY_0 = 'CURRENCY_0',
  CURRENCY_1 = 'CURRENCY_1',
}

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export const typeInput = createAction<{ field: Field; typedValue: string; noLiquidity: boolean }>(
  'mintV4/typeInputMint'
)
export const typeStartPriceInput = createAction<{ typedValue: string }>('mintV4/typeStartPriceInput')
export const typeLeftRangeInput = createAction<{ typedValue: string }>('mintV4/typeLeftRangeInput')
export const typeRightRangeInput = createAction<{ typedValue: string }>('mintV4/typeRightRangeInput')
export const resetMintState = createAction<void>('mintV4/resetMintState')
export const setFullRange = createAction<void>('mintV4/setFullRange')