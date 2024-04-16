import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import Column from "components/Column";
import Row, { RowBetween } from "components/Row";
import { useFormState } from "state/form/hooks";
import styled from "styled-components";
import { ThemedText } from "theme/components";
import { Tuple, InputField, BaseInputField } from "./types";
import { isTuple } from "./utils";

const StyledInput = styled.input<{
  $error?: boolean;
  $fontSize?: string;
  $align?: string;
}>`
  color: ${({ disabled, $error: error, theme }) =>
    disabled
      ? theme.components.inputFieldCurrencyField.disabledForeground
      : error
      ? theme.components.inputFieldCurrencyField.foreground
      : theme.components.inputFieldCurrencyField.filledForeground};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  width: 0;
  max-width: 25%;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) =>
    theme.components.inputFieldCurrencyField.filledBackground};
  font-size: ${({ $fontSize: fontSize }) => fontSize ?? "16px"};
  text-align: ${({ $align: align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 12px;
  border-radius: 8px;
  -webkit-appearance: textfield;
  text-align: right;

  &::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

const BigNumberInput = ({
  field,
  value,
  path,
  onChange,
  disabled = false,
}: {
  field: BaseInputField;
  value: any;
  path: string;
  onChange: (path: string, value: any) => void;
  disabled?: boolean;
}) => (
  <RowBetween>
    <Column
      $gap="sm"
      style={{
        alignItems: "flex-start",
      }}
    >
      <ThemedText.ParagraphSmall textColor="text.primary">
        {field.name}
      </ThemedText.ParagraphSmall>
      <ThemedText.ParagraphExtraSmall textColor="text.tertiary">
        {field.description}
      </ThemedText.ParagraphExtraSmall>
    </Column>
    <StyledInput
      type="number"
      inputMode="numeric"
      name={field.name}
      value={value}
      min={field.restrictions?.min}
      max={field.restrictions?.max}
      required={field.restrictions?.required}
      pattern={field.restrictions?.pattern}
      onChange={(e) => onChange(path, e.target.value)}
      disabled={disabled}
    />
  </RowBetween>
);

const BooleanInput = ({
  field,
  value,
  path,
  onChange,
  disabled = false,
}: {
  field: BaseInputField;
  value: any;
  path: string;
  onChange: (path: string, value: any) => void;
  disabled?: boolean;
}) => (
  <RowBetween>
    <Column
      $gap="sm"
      style={{
        alignItems: "flex-start",
      }}
    >
      <ThemedText.ParagraphSmall textColor="text.primary">
        {field.name}
      </ThemedText.ParagraphSmall>
      <ThemedText.ParagraphExtraSmall textColor="text.tertiary">
        {field.description}
      </ThemedText.ParagraphExtraSmall>
    </Column>
    <label>{field.description}</label>
    <input
      type="checkbox"
      name={field.name}
      checked={value}
      required={field.restrictions?.required}
      onChange={(e) => onChange(path, e.target.checked)}
      disabled={disabled}
    />
  </RowBetween>
);

const TextInput = ({
  field,
  value,
  path,
  onChange,
  disabled = false,
}: {
  field: BaseInputField;
  value: any;
  path: string;
  onChange: (path: string, value: any) => void;
  disabled?: boolean;
}) => (
  <RowBetween>
    <Column
      $gap="sm"
      style={{
        alignItems: "flex-start",
      }}
    >
      <ThemedText.ParagraphSmall textColor="text.primary">
        {field.name}
      </ThemedText.ParagraphSmall>
      <ThemedText.ParagraphExtraSmall textColor="text.tertiary">
        {field.description}
      </ThemedText.ParagraphExtraSmall>
    </Column>
    <StyledInput
      type="text"
      name={field.name}
      value={value ?? ""}
      pattern={field.restrictions?.pattern}
      required={field.restrictions?.required}
      onChange={(e) => onChange(path, e.target.value)}
      disabled={disabled}
    />
  </RowBetween>
);

const ByteArrayInput = ({
  field,
  value,
  path,
  onChange,
  disabled = false,
}: {
  field: BaseInputField;
  value: any;
  path: string;
  onChange: (path: string, value: any) => void;
  disabled?: boolean;
}) => (
  <RowBetween>
    <Column
      $gap="sm"
      style={{
        alignItems: "flex-start",
      }}
    >
      <ThemedText.ParagraphSmall textColor="text.primary">
        {field.name}
      </ThemedText.ParagraphSmall>
      <ThemedText.ParagraphExtraSmall textColor="text.tertiary">
        {field.description}
      </ThemedText.ParagraphExtraSmall>
    </Column>
    <StyledInput
      type="text"
      name={field.name}
      value={value}
      required={field.restrictions?.required}
      onChange={(e) => onChange(path, e.target.value)}
      disabled={disabled}
    />
  </RowBetween>
);

const QuestionMarkPath = styled.path`
  fill: ${({ theme }) => theme.components.button.secondary.foreground};
`;

const TupleInput = ({
  tuple,
  path,
  onChange,
  disabled = false,
}: {
  tuple: Tuple;
  path: string;
  onChange: (path: string, value: any) => void;
  disabled?: boolean;
}) => {
  return (
    <Column $gap="sm">
      <Row
        $gap="md"
        style={{
          alignItems: "flex-start",
        }}
      >
        <ThemedText.ParagraphSmall textColor="text.primary">
          {tuple.name}
        </ThemedText.ParagraphSmall>
        {tuple.description && (
          <div
            title={tuple.description}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
            >
              <QuestionMarkPath
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.852051 7.99964C0.852051 4.32815 3.82839 1.35181 7.49988 1.35181C11.1713 1.35181 14.1477 4.32815 14.1477 7.99964C14.1477 11.6711 11.1713 14.6475 7.49988 14.6475C3.82839 14.6475 0.852051 11.6711 0.852051 7.99964ZM7.49988 2.35181C4.38068 2.35181 1.85205 4.88043 1.85205 7.99964C1.85205 11.1188 4.38068 13.6475 7.49988 13.6475C10.6191 13.6475 13.1477 11.1188 13.1477 7.99964C13.1477 4.88043 10.6191 2.35181 7.49988 2.35181ZM8.2499 10.9999C8.2499 11.4141 7.91412 11.7499 7.4999 11.7499C7.08569 11.7499 6.7499 11.4141 6.7499 10.9999C6.7499 10.5857 7.08569 10.2499 7.4999 10.2499C7.91412 10.2499 8.2499 10.5857 8.2499 10.9999ZM6.00001 6.74991C6.00001 6.04274 6.60917 5.37491 7.50001 5.37491C8.39085 5.37491 9.00001 6.04274 9.00001 6.74991C9.00001 7.26894 8.70909 7.53286 8.24041 7.81759C8.18657 7.8503 8.1253 7.88588 8.06027 7.92365L8.06026 7.92366C7.87773 8.02966 7.66562 8.15285 7.5052 8.27785C7.26784 8.46279 7.00001 8.75456 7.00001 9.19991C7.00001 9.47606 7.22387 9.69991 7.50001 9.69991C7.77615 9.69991 8.00001 9.47606 8.00001 9.19991L8.00001 9.1994C8 9.19328 8 9.18956 8.0083 9.17645C8.02116 9.15616 8.05162 9.11981 8.11982 9.06667C8.22399 8.9855 8.34126 8.91753 8.49416 8.8289L8.4942 8.82887C8.57236 8.78356 8.65983 8.73286 8.75961 8.67224C9.29093 8.34947 10 7.82589 10 6.74991C10 5.45709 8.90917 4.37491 7.50001 4.37491C6.09085 4.37491 5.00001 5.45709 5.00001 6.74991C5.00001 7.02606 5.22387 7.24991 5.50001 7.24991C5.77615 7.24991 6.00001 7.02606 6.00001 6.74991Z"
              />
            </svg>
          </div>
        )}
      </Row>
      <Column $gap="xl" style={{ paddingLeft: "12px" }}>
        {tuple.fields.map((nestedField, index) => (
          <InputFactory
            key={index}
            field={nestedField}
            path={path}
            onChange={onChange}
            disabled={disabled}
          />
        ))}
      </Column>
    </Column>
  );
};

const InputFactory = ({
  field,
  path = "",
  onChange,
  disabled = false,
}: {
  field: InputField;
  path: string;
  onChange: (path: string, value: any) => void;
  disabled?: boolean;
}) => {
  const currentPath = path ? `${path}.${field.name}` : field.name;

  if (isTuple(field)) {
    return (
      <TupleInput
        tuple={field}
        path={currentPath}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  const fieldType = field.type.toLowerCase();
  const { values } = useFormState();
  const value = getNestedValue(values, currentPath);

  if (fieldType.startsWith("uint") || fieldType.startsWith("int")) {
    return (
      <BigNumberInput
        field={field}
        value={value}
        path={currentPath}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (fieldType.startsWith("bytes")) {
    return (
      <ByteArrayInput
        field={field}
        value={value}
        path={currentPath}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (fieldType === "string" || fieldType === "address") {
    return (
      <TextInput
        field={field}
        value={value}
        path={currentPath}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  if (fieldType === "bool") {
    return (
      <BooleanInput
        field={field}
        value={value}
        path={currentPath}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  console.error("Unsupported field type: ", fieldType);
  return <div>Unsupported field type: {fieldType}</div>;
};

function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((current, segment) => {
    return current ? current[segment] : undefined;
  }, obj);
}

export { InputFactory };
