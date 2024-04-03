import React from "react";
import styled from "styled-components";
import { ThemedText } from "../../theme/components";

const Content = styled.div`
  display: flex;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
`;

const Symbol = styled.div`
  border-radius: 1000px;
  background: ${({ theme }) => theme.surfacesAndElevation.elevation2};
  display: flex;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const Button = styled.button`
  display: flex;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-radius: 1000px;
  background: ${({ theme }) => theme.components.button.primary.background};
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.borders.dividers};
`;

interface TransactionModalContentProps {
  icon: React.ReactNode;
  title: string;
  info: string;
  children: React.ReactNode;
  buttonText: string;
  buttonAction: () => void;
}
export default function TransactionModalContent(
  props: TransactionModalContentProps
) {
  return (
    <Content>
      <Symbol>{props.icon}</Symbol>
      <Body>
        <Title>
          <ThemedText.ParagraphLeading textColor="text.primary">
            {props.title}
          </ThemedText.ParagraphLeading>
          <ThemedText.SmallText textColor="text.secondary">
            {props.info}
          </ThemedText.SmallText>
        </Title>
        <Divider />
        {props.children}
      </Body>
      <Button onClick={props.buttonAction}>
        <ThemedText.ParagraphRegular
          textColor="components.button.primary.foreground"
          fontWeight={600}
        >
          {props.buttonText}
        </ThemedText.ParagraphRegular>
      </Button>
    </Content>
  );
}
