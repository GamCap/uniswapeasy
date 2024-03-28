import { AppState } from "../reducer";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
    updateValue,
    initializeValues,
    resetForm
} from "./actions";
import { useCallback } from "react";
import { InputField } from "components/DynamicFeatureForm/types";
import { isTuple } from "components/DynamicFeatureForm/utils";

function createInitialValues(fields: InputField[]): Record<string, any> {
    let initialValues: Record<string, any> = {};
  
    fields.forEach((field) => {
      if (isTuple(field)) {
        initialValues[field.name] = createInitialValues(field.fields);
      } else {
        initialValues[field.name] = field.defaultValue ?? '';
      }
    });
  
    return initialValues;
  }
  

export function useFormState() : AppState['form'] {
    return useAppSelector(state => state.form);
}

export function useFormActionHandlers() {
    const dispatch = useAppDispatch();
    const wrappedUpdateValue = useCallback((path: string, value: any) => {
        dispatch(updateValue({ path, value }));
    }, [dispatch]);

    const wrappedInitializeValues = useCallback((fields: InputField[]) => {
        const initialValues = createInitialValues(fields);
        dispatch(initializeValues({ values: initialValues }));
    }, [dispatch]);

    const wrappedResetForm = useCallback(() => {
        dispatch(resetForm());
    }, [dispatch]);

    return {
        updateValue: wrappedUpdateValue,
        initializeValues: wrappedInitializeValues,
        resetForm: wrappedResetForm
    }; 
}