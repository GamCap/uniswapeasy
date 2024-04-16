import React, { HTMLAttributes } from "react";
import { styled } from "styled-components";
import { Colors } from "../../theme/theme";

type ButtonType = keyof Colors["components"]["button"];

type ButtonSize = "xsmall" | "small" | "medium";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  type: ButtonType;
  size: ButtonSize;
  label?: string;
  icononly?: boolean;
  leadingicon?: JSX.Element;
  trailingicon?: JSX.Element;
}

interface StyledButtonProps {
  type: ButtonType;
  size: ButtonSize;
  icononly: boolean;
}

const ButtonStyled = styled.button<StyledButtonProps>`
  background-color: ${({ theme, type }) =>
    type === "ghost"
      ? "transparent"
      : theme.components.button[type].background};
  color: ${({ theme, type }) =>
    type === "ghost"
      ? theme.components.button[type].background
      : theme.components.button[type].foreground};
  border: ${({ theme, type }) =>
    type === "secondary" &&
    `1px solid ${theme.components.button[type].border}`};
  border-radius: 1000px;
  padding: ${({ size, icononly }) => {
    switch (size) {
      case "medium":
        return icononly ? "12px" : "12px 16px";
      case "small":
        return icononly ? "8px" : "8px 12px";
      case "xsmall":
        return icononly ? "4px" : "4px 8px";
    }
  }};
  cursor: pointer;
  appearance: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme, type }) =>
      theme.components.button[type].hoverAndFocusBackground};
    color: ${({ theme, type }) =>
      theme.components.button[type].hoverAndFocusForeground};
    border: ${({ theme, type }) =>
      type === "secondary" &&
      `1px solid ${theme.components.button[type].hoverAndFocusBorder}`};
  }

  &:focus {
    ring: 1;
    ringcolor: ${({ theme }) => theme.components.focusRing.focusRing};
  }

  &:disabled {
    background-color: ${({ theme, type }) =>
      type === "secondary" || type === "ghost"
        ? "transparent"
        : theme.components.button[type].disabledBackground};
    color: ${({ theme, type }) =>
      type === "ghost"
        ? theme.components.button[type].disabledBackground
        : theme.components.button[type].disabledForeground};
    border: ${({ theme, type }) =>
      type === "secondary" &&
      `1px solid ${theme.components.button[type].disabledBorder}`};
    cursor: not-allowed;
  }

  font-size: ${({ size }) => {
    switch (size) {
      case "medium":
        return "16px";
      case "small":
      case "xsmall":
        return "12px";
    }
  }};

  font-weight: ${({ size }) => {
    switch (size) {
      case "medium":
        return "600";
      case "small":
      case "xsmall":
        return "500";
    }
  }};

  line-height: ${({ size }) => {
    switch (size) {
      case "medium":
        return "24px";
      case "small":
      case "xsmall":
        return "16px";
    }
  }};

  svg {
    width: ${({ size }) => {
      switch (size) {
        case "medium":
          return "20px";
        case "small":
          return "16px";
        case "xsmall":
          return "12px";
      }
    }};
    height: ${({ size }) => {
      switch (size) {
        case "medium":
          return "20px";
        case "small":
          return "16px";
        case "xsmall":
          return "12px";
      }
    }};
  }
`;

export function Button({
  type,
  size,
  label,
  icononly = false,
  leadingicon,
  trailingicon,
  ...rest
}: ButtonProps) {
  return (
    <ButtonStyled type={type} size={size} icononly={icononly} {...rest}>
      {leadingicon}
      {label}
      {trailingicon}
    </ButtonStyled>
  );
}
