import React, { useEffect, useState } from "react";

import { InputFactory } from "./InputFactory";
import { InputField } from "./types";
import { useFormActionHandlers } from "../../state/form/hooks";
import Column from "../Column";
interface DynamicFeatureFormProps {
  fields: InputField[];
}

const DynamicFeatureForm: React.FC<DynamicFeatureFormProps> = ({ fields }) => {
  const { updateValue, initializeValues, resetForm } = useFormActionHandlers();

  useEffect(() => {
    resetForm();
    initializeValues(fields);
    return () => {
      resetForm();
    };
  }, [fields, initializeValues, resetForm]);

  return (
    <Column
      gap="xl"
      style={{
        padding: "0 24px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {fields.map((field, idx) => (
        <InputFactory key={idx} field={field} path="" onChange={updateValue} />
      ))}
    </Column>
  );
};

export default DynamicFeatureForm;
