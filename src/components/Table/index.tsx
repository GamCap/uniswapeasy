import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
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
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.borders.dividers};
  td {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  td:first-child {
    padding-left: 32px;
  }

  td:last-child {
    padding-right: 32px;
  }

  th {
    padding-bottom: 20px;
  }

  th:first-child {
    padding-left: 32px;
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

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const SearchInput = styled.input`
  padding: 8px;
  width: 98%;
  box-sizing: border-box;
`;

const PaginationWrapper = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
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
  onSelect?: (item: any) => void;
}

const TableComponent: React.FC<TableProps> = ({
  data,
  columns,
  pageSize,
  renderers,
  onSelect,
}) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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
    ? genericFilterer(data, searchTerm, columns)
    : data;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const currentData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRowClick = (item: any) => {
    if (onSelect) {
      onSelect(item);
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <TableWrapper>
      <SearchInput
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
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
            <StyledTr
              key={index}
              onClick={() => {
                handleRowClick(item);
              }}
            >
              {columns.map((column) => (
                <StyledTd key={column.key}>
                  {renderers[column.key]
                    ? renderers[column.key](item[column.key])
                    : item[column.key]}
                </StyledTd>
              ))}
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
      <PaginationWrapper>
        <button
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
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.35355 0.646447C5.54882 0.841709 5.54882 1.15829 5.35355 1.35355L2.20711 4.5H11C11.2761 4.5 11.5 4.72386 11.5 5C11.5 5.27614 11.2761 5.5 11 5.5H2.20711L5.35355 8.64645C5.54882 8.84171 5.54882 9.15829 5.35355 9.35355C5.15829 9.54882 4.84171 9.54882 4.64645 9.35355L0.646447 5.35355C0.451184 5.15829 0.451184 4.84171 0.646447 4.64645L4.64645 0.646447C4.84171 0.451184 5.15829 0.451184 5.35355 0.646447Z"
              fill={theme.components.icon.icon}
            />
          </svg>
        </button>
        <ThemedText.ParagraphExtraSmall textColor="text.primary">
          Page {currentPage} of {totalPages}
        </ThemedText.ParagraphExtraSmall>
        <button
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
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.35355 0.646447C5.54882 0.841709 5.54882 1.15829 5.35355 1.35355L2.20711 4.5H11C11.2761 4.5 11.5 4.72386 11.5 5C11.5 5.27614 11.2761 5.5 11 5.5H2.20711L5.35355 8.64645C5.54882 8.84171 5.54882 9.15829 5.35355 9.35355C5.15829 9.54882 4.84171 9.54882 4.64645 9.35355L0.646447 5.35355C0.451184 5.15829 0.451184 4.84171 0.646447 4.64645L4.64645 0.646447C4.84171 0.451184 5.15829 0.451184 5.35355 0.646447Z"
              fill={theme.components.icon.icon}
            />
          </svg>
        </button>
      </PaginationWrapper>
    </TableWrapper>
  );
};

export default TableComponent;
