import { darken } from "polished";
import { forwardRef } from "react";
// import { Check, ChevronDown } from 'react-feather'
import {
  Button as RebassButton,
  ButtonProps as ButtonPropsOriginal,
} from "rebass/styled-components";
import styled, { DefaultTheme, useTheme } from "styled-components";

import { RowBetween } from "../Row";

// export { default as LoadingButtonSpinner } from './LoadingButtonSpinner'

type ButtonProps = Omit<ButtonPropsOriginal, "css">;

const ButtonOverlay = styled.div`
  background-color: transparent;
  bottom: 0;
  border-radius: inherit;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: 150ms ease background-color;
  width: 100%;
`;

type BaseButtonProps = {
  padding?: string;
  width?: string;
  $borderRadius?: string;
  altDisabledStyle?: boolean;
} & ButtonProps;

export const BaseButton = styled(RebassButton)<BaseButtonProps>`
  padding: ${({ padding }) => padding ?? "16px"};
  width: ${({ width }) => width ?? "100%"};
  line-height: 24px;
  font-weight: 535;
  text-align: center;
  border-radius: ${({ $borderRadius }) => $borderRadius ?? "16px"};
  outline: none;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    opacity: 50%;
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
`;

export const ButtonPrimary = styled(BaseButton)<BaseButtonProps>`
  background-color: ${({ theme }) => theme.primary};
  font-size: 20px;
  font-weight: 535;
  padding: 16px;
  color: ${({ theme }) => theme.white};
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary)};
    background-color: ${({ theme }) => darken(0.05, theme.primary)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary)};
    background-color: ${({ theme }) => darken(0.1, theme.primary)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle
        ? disabled
          ? theme.primary
          : theme.primary
        : theme.primary};
    color: ${({ altDisabledStyle, disabled, theme }) =>
      altDisabledStyle
        ? disabled
          ? theme.primary
          : theme.secondary
        : theme.secondary};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
  }
`;

export const SmallButtonPrimary = styled(ButtonPrimary)<BaseButtonProps>`
  width: auto;
  font-size: 16px;
  padding: ${({ padding }) => padding ?? "8px 12px"};

  border-radius: 12px;
`;

const BaseButtonLight = styled(BaseButton)`
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.primary};
  font-size: 20px;
  font-weight: 535;

  &:focus {
    box-shadow: 0 0 0 1pt
      ${({ theme, disabled }) => !disabled && theme.secondary};
    background-color: ${({ theme, disabled }) => !disabled && theme.secondary};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.secondary};
  }
  &:active {
    box-shadow: 0 0 0 1pt
      ${({ theme, disabled }) => !disabled && theme.secondary};
    background-color: ${({ theme, disabled }) => !disabled && theme.secondary};
  }

  :hover {
    ${ButtonOverlay} {
      background-color: ${({ theme }) => theme.background};
    }
  }

  :active {
    ${ButtonOverlay} {
      background-color: ${({ theme }) => theme.background};
    }
  }

  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: transparent;
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

export const ButtonGray = styled(BaseButton)`
  background-color: ${({ theme }) => theme.surface1};
  color: ${({ theme }) => theme.secondary};
  border: 1px solid ${({ theme }) => theme.primary};
  font-size: 16px;
  font-weight: 535;

  &:hover {
    background-color: ${({ theme, disabled }) =>
      !disabled && darken(0.05, theme.secondary)};
  }
  &:active {
    background-color: ${({ theme, disabled }) =>
      !disabled && darken(0.1, theme.secondary)};
  }
`;

export const ButtonSecondary = styled(BaseButton)<BaseButtonProps>`
  border: 1px solid ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.primary};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : "10px")};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.secondary};
    border: 1px solid ${({ theme }) => theme.primary};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.secondary};
    border: 1px solid ${({ theme }) => theme.primary};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`;

export const ButtonOutlined = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.primary};
  background-color: transparent;
  color: ${({ theme }) => theme.neutral1};
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.primary};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.neutral3};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.primary};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonEmpty = styled(BaseButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonText = styled(BaseButton)`
  padding: 0;
  width: fit-content;
  background: none;
  text-decoration: none;
  &:focus {
    text-decoration: underline;
  }
  &:hover {
    opacity: 0.9;
  }
  &:active {
    text-decoration: underline;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

const ButtonConfirmedStyle = styled(BaseButton)`
  background-color: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.neutral1};
  /* border: 1px solid ${({ theme }) => theme.success}; */

  &:disabled {
    opacity: 50%;
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.secondary};
    cursor: auto;
  }
`;

const ButtonErrorStyle = styled(BaseButton)`
  background-color: ${({ theme }) => theme.seconary};
  border: 1px solid ${({ theme }) => theme.seconary};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.seconary)};
    background-color: ${({ theme }) => darken(0.05, theme.seconary)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.seconary)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.seconary)};
    background-color: ${({ theme }) => darken(0.1, theme.seconary)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.seconary};
    border: 1px solid ${({ theme }) => theme.seconary};
  }
`;

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />;
  }
}

export function ButtonError({
  error,
  ...rest
}: { error?: boolean } & BaseButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} />;
  }
}

export function ButtonDropdown({
  disabled = false,
  children,
  ...rest
}: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
        {/* <ChevronDown size={24} /> */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#FFFFFF"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "flex", alignItems: "center" }}
        >
          <path
            d="M12 15L7 10L8.41 8.59L12 12.17L15.59 8.59L17 10L12 15Z"
            fill="#FFFFFF"
          />
        </svg>
      </RowBetween>
    </ButtonPrimary>
  );
}

export function ButtonDropdownLight({
  disabled = false,
  children,
  ...rest
}: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
        {/* <ChevronDown size={24} /> */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="#FFFFFF"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "flex", alignItems: "center" }}
        >
          <path
            d="M12 15L7 10L8.41 8.59L12 12.17L15.59 8.59L17 10L12 15Z"
            fill="#FFFFFF"
          />
        </svg>
      </RowBetween>
    </ButtonOutlined>
  );
}

const ActiveOutlined = styled(ButtonOutlined)`
  border: 1px solid;
  border-color: ${({ theme }) => theme.primary};
`;

const Circle = styled.div`
  height: 17px;
  width: 17px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckboxWrapper = styled.div`
  width: 20px;
  padding: 0 10px;
  position: absolute;
  top: 11px;
  right: 15px;
`;

// const ResponsiveCheck = styled(Check)`
//   size: 13px;
// `

export function ButtonRadioChecked({
  active = false,
  children,
  ...rest
}: { active?: boolean } & ButtonProps) {
  const theme = useTheme();

  if (!active) {
    return (
      <ButtonOutlined $borderRadius="12px" padding="12px 8px" {...rest}>
        <RowBetween>{children}</RowBetween>
      </ButtonOutlined>
    );
  } else {
    return (
      <ActiveOutlined {...rest} padding="12px 8px" $borderRadius="12px">
        <RowBetween>
          {children}
          <CheckboxWrapper>
            <Circle>
              {/* <ResponsiveCheck size={13} stroke={theme.white} /> */}
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="#FFFFFF"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 11L1 7.5L2.41 6.09L4.5 8.17L10.09 2.58L11.5 4L4.5 11Z"
                  fill="#FFFFFF"
                />
              </svg>
            </Circle>
          </CheckboxWrapper>
        </RowBetween>
      </ActiveOutlined>
    );
  }
}

export enum ButtonSize {
  small,
  medium,
  large,
}
export enum ButtonEmphasis {
  high,
  promotional,
  highSoft,
  medium,
  low,
  warning,
  destructive,
  failure,
}
interface BaseThemeButtonProps {
  size: ButtonSize;
  emphasis: ButtonEmphasis;
}

function pickThemeButtonBackgroundColor({
  theme,
  emphasis,
}: {
  theme: DefaultTheme;
  emphasis: ButtonEmphasis;
}) {
  switch (emphasis) {
    case ButtonEmphasis.high:
      return theme.primary;
    case ButtonEmphasis.promotional:
    case ButtonEmphasis.highSoft:
      return theme.secondary;
    case ButtonEmphasis.low:
      return "transparent";
    case ButtonEmphasis.warning:
      return theme.primary;
    case ButtonEmphasis.destructive:
      return theme.secondary;
    case ButtonEmphasis.failure:
      return theme.primary;
    case ButtonEmphasis.medium:
    default:
      return theme.primary;
  }
}
function pickThemeButtonFontSize({ size }: { size: ButtonSize }) {
  switch (size) {
    case ButtonSize.large:
      return "20px";
    case ButtonSize.medium:
      return "16px";
    case ButtonSize.small:
      return "14px";
    default:
      return "16px";
  }
}
function pickThemeButtonLineHeight({ size }: { size: ButtonSize }) {
  switch (size) {
    case ButtonSize.large:
      return "24px";
    case ButtonSize.medium:
      return "20px";
    case ButtonSize.small:
      return "16px";
    default:
      return "20px";
  }
}
function pickThemeButtonPadding({ size }: { size: ButtonSize }) {
  switch (size) {
    case ButtonSize.large:
      return "16px";
    case ButtonSize.medium:
      return "10px 12px";
    case ButtonSize.small:
      return "8px";
    default:
      return "10px 12px";
  }
}
function pickThemeButtonTextColor({
  theme,
  emphasis,
}: {
  theme: DefaultTheme;
  emphasis: ButtonEmphasis;
}) {
  switch (emphasis) {
    case ButtonEmphasis.high:
    case ButtonEmphasis.promotional:
      return theme.primary;
    case ButtonEmphasis.highSoft:
      return theme.primary;
    case ButtonEmphasis.low:
      return theme.secondary;
    case ButtonEmphasis.warning:
      return theme.secondary;
    case ButtonEmphasis.destructive:
      return theme.primary;
    case ButtonEmphasis.failure:
      return theme.secondary;
    case ButtonEmphasis.medium:
    default:
      return theme.primary;
  }
}

const BaseThemeButton = styled.button<BaseThemeButtonProps>`
  align-items: center;
  background-color: ${pickThemeButtonBackgroundColor};
  border-radius: 16px;
  border: 0;
  color: ${pickThemeButtonTextColor};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: ${pickThemeButtonFontSize};
  font-weight: 535;
  gap: 12px;
  justify-content: center;
  line-height: ${pickThemeButtonLineHeight};
  padding: ${pickThemeButtonPadding};
  position: relative;
  transition: 150ms ease opacity;
  user-select: none;

  :active {
    ${ButtonOverlay} {
      background-color: ${({ theme }) => theme.background};
    }
  }
  :focus {
    ${ButtonOverlay} {
      background-color: ${({ theme }) => theme.background};
    }
  }
  :hover {
    ${ButtonOverlay} {
      background-color: ${({ theme }) => theme.background};
    }
  }
  :disabled {
    cursor: default;
    opacity: 0.6;
  }
  :disabled:active,
  :disabled:focus,
  :disabled:hover {
    ${ButtonOverlay} {
      background-color: transparent;
    }
  }
`;

interface ThemeButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    BaseThemeButtonProps {}
type ThemeButtonRef = HTMLButtonElement;

export const ThemeButton = forwardRef<ThemeButtonRef, ThemeButtonProps>(
  function ThemeButton({ children, ...rest }, ref) {
    return (
      <BaseThemeButton {...rest} ref={ref}>
        <ButtonOverlay />
        {children}
      </BaseThemeButton>
    );
  }
);

export const ButtonLight = ({ children, ...rest }: BaseButtonProps) => {
  return (
    <BaseButtonLight {...rest}>
      <ButtonOverlay />
      {children}
    </BaseButtonLight>
  );
};
