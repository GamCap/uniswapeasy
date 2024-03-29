import { useRef, useEffect } from "react";
import { styled } from "styled-components";
import { ThemedText } from "theme/components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
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
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Content = styled.div`
  background: ${({ theme }) => theme.surfacesAndElevation.elevation1};
  border: 1px solid ${({ theme }) => theme.borders.borders};
  min-width: 640px;
  min-height: 300px;
  border-radius: 24px;
  z-index: 1000;
  overflow: hidden;
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

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
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

  useEffect(() => {
    console.log("Modal is open: ", isOpen);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Backdrop>
      <Content ref={modalContentRef}>
        <Header
          style={{
            justifyContent: title ? "space-between" : "flex-end",
          }}
        >
          <ThemedText.ParagraphRegular textColor="text.primary">
            {title}
          </ThemedText.ParagraphRegular>
          <CloseButton onClick={onClose}>X</CloseButton>
        </Header>
        {children}
      </Content>
    </Backdrop>
  );
};

export default Modal;
