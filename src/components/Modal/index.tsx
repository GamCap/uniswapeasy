import { useRef, useEffect } from "react";
import { styled } from "styled-components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  width: 400px;
  height: 400px;
  border-radius: 24px;
  z-index: 1000;
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
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
        <button onClick={onClose}>Close</button>
        {children}
      </Content>
    </Backdrop>
  );
};

export default Modal;
