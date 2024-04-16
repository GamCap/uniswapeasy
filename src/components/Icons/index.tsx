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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.4869 4.22025C12.6822 4.02499 12.6822 3.70841 12.4869 3.51315C12.2917 3.31788 11.9751 3.31788 11.7798 3.51315L8.00003 7.29293L4.22025 3.51315C4.02499 3.31788 3.70841 3.31788 3.51315 3.51315C3.31788 3.70841 3.31788 4.02499 3.51315 4.22025L7.29293 8.00003L3.51315 11.7798C3.31788 11.9751 3.31788 12.2917 3.51315 12.4869C3.70841 12.6822 4.02499 12.6822 4.22025 12.4869L8.00003 8.70714L11.7798 12.4869C11.9751 12.6822 12.2917 12.6822 12.4869 12.4869C12.6822 12.2917 12.6822 11.9751 12.4869 11.7798L8.70714 8.00003L12.4869 4.22025Z"
        fill="currentColor"
      />
    </svg>
  );
}

export { Switch, Cross };
