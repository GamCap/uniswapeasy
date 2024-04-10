import styled from "styled-components";
import { ThemedText } from "../../theme/components";
import Row from "components/Row";

const HeaderWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 20px 32px 20px 32px;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  border-bottom: ${({ theme }) => `1px solid ${theme.borders.dividers}`};
`;

const Actions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

const QuestionMarkPath = styled.path`
  fill: ${({ theme }) => theme.components.button.secondary.foreground};
`;
export default function Header({
  title,
  children,
  info,
}: {
  title: string;
  children?: React.ReactNode;
  info?: string;
}) {
  return (
    <HeaderWrapper>
      <Row $gap="sm">
        <ThemedText.ParagraphRegular textColor="text.primary">
          {title}
        </ThemedText.ParagraphRegular>
        {info && (
          <div
            title={info}
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
      {children && <Actions>{children}</Actions>}
    </HeaderWrapper>
  );
}
