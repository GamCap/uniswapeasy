import { InputField, Tuple } from "./types";

const isTuple = (field: InputField): field is Tuple => {
    return "fields" in field;
  };

export { isTuple };