import { createReducer } from '@reduxjs/toolkit';
import { updateValue, resetForm, initializeValues } from './actions';

export interface FormState {
  values: any;
}

const initialState: FormState = {
  values: {},
};

export default createReducer<FormState>(initialState, (builder) => {
  builder
    .addCase(updateValue, (state, action) => {
      const { path, value } = action.payload;
      const pathParts = path.split('.');
      let current = state.values;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part] || typeof current[part] !== 'object') {
          current[part] = {};
        }
        current = current[part];
      }
      current[pathParts[pathParts.length - 1]] = value;
    })
    .addCase(initializeValues, (state, action) => {
        state.values = action.payload.values;
      })
    .addCase(resetForm, () => initialState);
});

