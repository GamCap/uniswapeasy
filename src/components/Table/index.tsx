import { ArrowDown } from "components/Icons";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ThemedText } from "theme/components";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTh = styled.th`
  text-align: left;
  box-sizing: border-box;
  background-color: transparent;
`;

const StyledTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.borders.dividers};
  &:hover {
    background-color: ${({ theme }) => theme.surfacesAndElevation.elevation2};
  }
  td {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 20px;
    width: min-content;
  }

  td:first-child {
    padding-left: 32px;
    width: 100%;
  }

  td:last-child {
    padding-right: 32px;
  }

  th {
    padding-bottom: 20px;
    padding-right: 20px;
    width: min-content;
  }

  th:first-child {
    padding-left: 32px;
    width: 100%;
  }

  th:last-child {
    padding-right: 32px;
  }

  box-sizing: border-box;
`;

const StyledTd = styled.td`
  box-sizing: border-box;
  text-align: left;
`;

const TableWrapper = styled.div``;

//top-bottom 12px left-right 8px padding
const SearchBoxWrapper = styled.div`
  padding: 12px 8px;
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1 1 auto;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme.components.inputFieldCurrencyField.border};
  background-color: ${({ theme }) =>
    theme.components.inputFieldCurrencyField.background};
  box-sizing: border-box;
`;

const StyledIcon = styled.svg`
  flex: 1 0 auto;
  color: ${({ theme }) => theme.components.icon.icon};
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  background-color: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) =>
    theme.components.inputFieldCurrencyField.typeAndActiveForeground};
  &:placeholder: {
    color: ${({ theme }) =>
      theme.components.inputFieldCurrencyField.foreground};
  }
  outline: none;
  box-sizing: border-box;
  &:focus {
    outline: none;
  }
`;

const PaginationWrapper = styled.div`
  padding: 28px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
`;

const PageButton = styled.button`
  background-color: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
  color: ${({ theme }) => theme.components.icon.icon};
  &:disabled {
    color: ${({ theme }) => theme.components.icon.icon};
    background-color: transparent;
    opacity: 0;
  }
`;

const IconPath = styled.path`
  fill: ${({ theme }) => theme.components.icon.icon};
`;

const SearchContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px 24px;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SearchDropdowns = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  width: 100%;
  gap: 16px;
  align-items: center;
`;

interface Column {
  key: string;
  filterMethod?: (item: any, searchTerm: string) => boolean;
}

interface TableProps {
  data: any[];
  columns: Column[];
  pageSize: number;
  renderers: { [key: string]: (data: any) => JSX.Element };
  searchPlaceholder?: string;
  tokenList?: Record<string, any>;
}

const TableComponent: React.FC<TableProps> = ({
  data,
  columns,
  pageSize,
  renderers,
  searchPlaceholder,
  tokenList,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");

  //filter data by first column (Pool) using token0 and token1
  const filteredByToken = useMemo(() => {
    if (token0 === "" && token1 === "") {
      return data;
    }
    return data.filter((item) => {
      if (token0 === "" && token1 === "") return true;
      const p = item["Pool"];
      const itemString = p?.currency0?.symbol + " / " + p?.currency1?.symbol;
      return (
        (token0 === "" ||
          itemString.toLowerCase().includes(token0.toLowerCase())) &&
        (token1 === "" ||
          itemString.toLowerCase().includes(token1.toLowerCase()))
      );
    });
  }, [data, token0, token1]);

  const genericFilterer = (
    data: any[],
    searchTerm: string,
    columns: Column[]
  ) => {
    return data.filter((item) =>
      columns.some((column) => {
        if (column.filterMethod) {
          return column.filterMethod(item, searchTerm);
        }
        if (typeof item[column.key] !== "object") {
          return item[column.key]
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );
  };

  const filteredData = searchTerm
    ? genericFilterer(filteredByToken, searchTerm, columns)
    : filteredByToken;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const currentData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <TableWrapper>
      <SearchContainer>
        <SearchDropdowns>
          <CustomDropdown
            tokens={tokenList ?? {}}
            setToken={setToken0}
            selectedToken={token0}
            otherToken={token1}
          />
          <CustomDropdown
            tokens={tokenList ?? {}}
            setToken={setToken1}
            selectedToken={token1}
            otherToken={token0}
          />
        </SearchDropdowns>
        <SearchBoxWrapper>
          <StyledIcon
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
              stroke="currentColor"
              strokeWidth="1.66"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </StyledIcon>

          <SearchInput
            type="text"
            placeholder={searchPlaceholder || "Search"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBoxWrapper>
      </SearchContainer>
      <StyledTable>
        <thead>
          <StyledTr>
            {columns.map((column) => (
              <StyledTh key={column.key}>
                <ThemedText.ParagraphExtraSmall textColor="text.tertiary">
                  {column.key}
                </ThemedText.ParagraphExtraSmall>
              </StyledTh>
            ))}
          </StyledTr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <StyledTr key={index}>
              {columns.map((column) => (
                <StyledTd key={column.key}>
                  {renderers[column.key] ? (
                    renderers[column.key](item[column.key])
                  ) : (
                    <ThemedText.ParagraphExtraSmall textColor="text.primary">
                      {item[column.key]}
                    </ThemedText.ParagraphExtraSmall>
                  )}
                </StyledTd>
              ))}
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
      <PaginationWrapper>
        <PageButton
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
          >
            <IconPath
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.35355 0.646447C5.54882 0.841709 5.54882 1.15829 5.35355 1.35355L2.20711 4.5H11C11.2761 4.5 11.5 4.72386 11.5 5C11.5 5.27614 11.2761 5.5 11 5.5H2.20711L5.35355 8.64645C5.54882 8.84171 5.54882 9.15829 5.35355 9.35355C5.15829 9.54882 4.84171 9.54882 4.64645 9.35355L0.646447 5.35355C0.451184 5.15829 0.451184 4.84171 0.646447 4.64645L4.64645 0.646447C4.84171 0.451184 5.15829 0.451184 5.35355 0.646447Z"
            />
          </svg>
        </PageButton>
        <ThemedText.ParagraphExtraSmall textColor="text.primary">
          Page {currentPage} of {totalPages}
        </ThemedText.ParagraphExtraSmall>
        <PageButton
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage >= totalPages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            style={{ transform: "rotate(180deg)" }}
          >
            <IconPath
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.35355 0.646447C5.54882 0.841709 5.54882 1.15829 5.35355 1.35355L2.20711 4.5H11C11.2761 4.5 11.5 4.72386 11.5 5C11.5 5.27614 11.2761 5.5 11 5.5H2.20711L5.35355 8.64645C5.54882 8.84171 5.54882 9.15829 5.35355 9.35355C5.15829 9.54882 4.84171 9.54882 4.64645 9.35355L0.646447 5.35355C0.451184 5.15829 0.451184 4.84171 0.646447 4.64645L4.64645 0.646447C4.84171 0.451184 5.15829 0.451184 5.35355 0.646447Z"
            />
          </svg>
        </PageButton>
      </PaginationWrapper>
    </TableWrapper>
  );
};

export default TableComponent;

const Option = styled.button`
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-start;
  padding: 12px;
  background-color: ${({ theme }) => theme.components.dropdown.background};
  color: ${({ theme }) => theme.components.dropdown.foreground};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) =>
      theme.components.dropdown.hoverBackground};
    color: ${({ theme }) => theme.components.dropdown.hoverForeground};
  }

  img {
    width: 16px;
    height: 16px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  overflow: hidden;
  overflow-y: auto;
  max-height: 163px;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.components.dropdown.background};
  border-radius: 0 0 8px 8px;
  z-index: 100;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 8px;
    padding-right: 12px;
    background: transparent;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.surfacesAndElevation.elevation3};
    border-radius: 50px;
    background-clip: padding-box;
  }
`;

const SelectButton = styled.button<{ $isOpen?: boolean }>`
  white-space: nowrap;
  appearance: none;
  border: none;
  background-color: ${({ theme }) =>
    theme.components.inputFieldCurrencyField.background};
  border-radius: ${({ $isOpen }) => ($isOpen ? "8px 8px 0 0" : "8px")};
  box-sizing: border-box;
  padding: 12px;
  color: ${({ theme }) => theme.components.inputFieldCurrencyField.foreground};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    color: ${({ theme }) =>
      theme.components.inputFieldCurrencyField.filledForeground};

    img {
      width: 20px;
      height: 20px;
    }
  }

  svg {
    color: ${({ theme }) => theme.components.icon.icon};
    width: 20px;
    height: 20px;
  }

  flex: 1 0 auto;
  width: 100%;
  @media (min-width: 768px) {
    min-width: 180px;
  }
`;
const CustomDropdown: React.FC<{
  tokens: Record<string, any>;
  setToken: (token: string) => void;
  selectedToken: string;
  otherToken: string;
}> = ({ tokens, setToken, selectedToken, otherToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const allOptions = useMemo(() => Object.keys(tokens), [tokens]);
  const filteredOptions = useMemo(
    () =>
      allOptions.filter(
        (token) => token !== otherToken && token !== selectedToken
      ),
    [allOptions, otherToken, selectedToken]
  );
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "100%",
      }}
    >
      <SelectButton onClick={() => setIsOpen((prev) => !prev)} $isOpen={isOpen}>
        {selectedToken === "" ? (
          <span>Select a token</span>
        ) : (
          <div>
            <img src={tokens[selectedToken]} alt={selectedToken} />
            <span>{selectedToken}</span>
          </div>
        )}
        <ArrowDown />
      </SelectButton>
      {isOpen && (
        <DropdownContainer>
          <Option
            style={{
              display: selectedToken === "" ? "none" : "flex",
            }}
            onClick={() => {
              setToken("");
              setIsOpen(false);
            }}
          >
            Select a token
          </Option>
          {filteredOptions.map((token) => (
            <Option
              key={token}
              onClick={() => {
                setToken(token);
                setIsOpen(false);
              }}
            >
              <img src={tokens[token]} alt={token} />
              <span>{token}</span>
            </Option>
          ))}
        </DropdownContainer>
      )}
    </div>
  );
};
