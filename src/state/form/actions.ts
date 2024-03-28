import { createAction } from '@reduxjs/toolkit';

export const updateValue = createAction<{ path: string; value: any }>('form/updateValue');
export const initializeValues = createAction<{ values: any }>('form/initializeValues');
export const resetForm = createAction('form/resetForm');
