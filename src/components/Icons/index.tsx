import { HTMLAttributes } from "react";

function Switch(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        pointerEvents: "none",
      }}
      {...props}
    >
      <path
        d="M11.2001 2.1333L13.8667 4.79997M13.8667 4.79997L11.2001 7.46663M13.8667 4.79997H2.1333"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M2.1333 11.2001L4.79997 8.53345M2.1333 11.2001L4.79997 13.8668M2.1333 11.2001H13.8666"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  );
}

function Cross(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        pointerEvents: "none",
      }}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4869 4.22025C12.6822 4.02499 12.6822 3.70841 12.4869 3.51315C12.2917 3.31788 11.9751 3.31788 11.7798 3.51315L8.00003 7.29293L4.22025 3.51315C4.02499 3.31788 3.70841 3.31788 3.51315 3.51315C3.31788 3.70841 3.31788 4.02499 3.51315 4.22025L7.29293 8.00003L3.51315 11.7798C3.31788 11.9751 3.31788 12.2917 3.51315 12.4869C3.70841 12.6822 4.02499 12.6822 4.22025 12.4869L8.00003 8.70714L11.7798 12.4869C11.9751 12.6822 12.2917 12.6822 12.4869 12.4869C12.6822 12.2917 12.6822 11.9751 12.4869 11.7798L8.70714 8.00003L12.4869 4.22025Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Plus(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      style={{ pointerEvents: "none" }}
      {...props}
    >
      <path
        d="M11.5 5.5H6.5V0.5C6.5 0.224 6.276 0 6 0C5.724 0 5.5 0.224 5.5 0.5V5.5H0.5C0.224 5.5 0 5.724 0 6C0 6.276 0.224 6.5 0.5 6.5H5.5V11.5C5.5 11.776 5.724 12 6 12C6.276 12 6.5 11.776 6.5 11.5V6.5H11.5C11.776 6.5 12 6.276 12 6C12 5.724 11.776 5.5 11.5 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Minus(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      style={{ pointerEvents: "none" }}
      {...props}
    >
      <path
        d="M11.5 5.5H0.5C0.224 5.5 0 5.724 0 6C0 6.276 0.224 6.5 0.5 6.5H11.5C11.776 6.5 12 6.276 12 6C12 5.724 11.776 5.5 11.5 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowDown(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.64645 8.31307C5.84171 8.11781 6.15829 8.11781 6.35355 8.31307L10 11.9595L13.6464 8.31307C13.8417 8.11781 14.1583 8.11781 14.3536 8.31307C14.5488 8.50833 14.5488 8.82492 14.3536 9.02018L10.3536 13.0202C10.1583 13.2154 9.84171 13.2154 9.64645 13.0202L5.64645 9.02018C5.45118 8.82492 5.45118 8.50833 5.64645 8.31307Z"
        fill="currentColor"
      />
    </svg>
  );
}

export { Switch, Cross, Plus, Minus, ArrowDown };
