import { Button } from "components/Button";
import { Cross } from "components/Icons";
import { useRef, useEffect } from "react";
import { styled } from "styled-components";
import { ThemedText } from "theme/components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  breakpoints?: { breakpoint: string; width: string }[];
  customHeader?: React.ReactNode;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 1, 3, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  @media (min-width: 768px) {
    justify-content: center;
  }
  z-index: 999;
`;

const Content = styled.div<{
  $breakpoints?: { breakpoint: string; width: string }[];
}>`
  background: ${({ theme }) => theme.surfacesAndElevation.elevation1};
  border: 1px solid ${({ theme }) => theme.borders.borders};
  width: 100%;
  min-height: 300px;
  border-radius: 24px;
  z-index: 1000;
  overflow: hidden;
  ${({ $breakpoints: breakpoints }) =>
    breakpoints &&
    breakpoints.map(
      (bp) => `
@media (min-width: ${bp.breakpoint}) {
  width: ${bp.width};
}
`
    )}
`;

const Header = styled.div`
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.borders.dividers};
`;

const CloseButton = styled.button`
  background: none;
  padding: 8px;
  border: none;
  color: ${({ theme }) => theme.components.icon.icon};
  cursor: pointer;
`;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  breakpoints,
  customHeader,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Backdrop>
      <Content ref={modalContentRef} $breakpoints={breakpoints}>
        {customHeader ? (
          customHeader
        ) : (
          <Header
            style={{
              justifyContent: title ? "space-between" : "flex-end",
            }}
          >
            <ThemedText.ParagraphRegular textColor="text.primary">
              {title}
            </ThemedText.ParagraphRegular>
            <Button
              size="small"
              type="ghost"
              onClick={onClose}
              leadingicon={<Cross />}
              icononly
            />
          </Header>
        )}
        {children}
      </Content>
    </Backdrop>
  );
};

export default Modal;
