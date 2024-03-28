interface InputRestrictions {
    min?: string;
    max?: string;
    pattern?: string; // Regular expression pattern for validation
    required?: boolean;
  }
  
  
  interface BaseProps {
    name: string;
    description?: string;
  }
  
  interface BaseInputField extends BaseProps {
    type: string;
    defaultValue?: string;
    restrictions?: InputRestrictions;
  }
  
  interface Tuple extends BaseProps {
    fields: InputField[];
  }
  
  type InputField = BaseInputField | Tuple;

  export type { InputField, Tuple, BaseInputField };