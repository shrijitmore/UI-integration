import React, { useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CustomPagination from "../../Operator/common/CustomPagination";
// Utility function to format headers
const sanitizeHeader = (key) => {
  return key
    .replace(/[_\-]/g, " ") // replace _ and - with space
    .replace(/\s+/g, " ") // remove extra spaces
    .trim()
    .split(" ") // split words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // capitalize each word
    .join(" ");
};

// const CustomTable = ({ data, setPage, page }) => {
const CustomTable = ({
  data,
  page,
  setPage,
  pageSize,
  setPageSize,
  totalRecords,
  totalPages,
}) => {
  //   const [page, setPage] = useState(1);
  //   const [totalPages, setTotalPages] = useState(2);
  //   const [pageSize, setPageSize] = useState(10); // ✅ define pageSize
  //   const [totalRecords, setTotalRecords] = useState(20); // ✅ define totalRecords

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body1">No records found.</Typography>
      </Paper>
    );
  }

  const headers = Object.keys(data[0]);
  const showHeaders = ["Sr No", ...headers];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        textAlign: "left",
        maxWidth: "100%",
        borderRadius: 3,
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 500,
          maxWidth: 800,
          overflow: "auto",
        }}
      >
        <Table stickyHeader sx={{ minWidth: 700 }} aria-label="custom table">
          <TableHead>
            <TableRow
              sx={{
                height: 36,
                "& th": { paddingTop: "4px", paddingBottom: "4px" },
              }}
            >
              {showHeaders.map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#28304E",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  {key === "Sr No" ? "Sr No" : sanitizeHeader(key)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  height: 36,
                  "& td": { paddingTop: "4px", paddingBottom: "4px" },
                }}
              >
                {/* Sr No column */}
                <TableCell
                  sx={{
                    border: "1px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  {(page - 1) * pageSize + rowIndex + 1}
                </TableCell>

                {/* Data columns */}
                {headers.map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      border: "1px solid #ccc",
                      textAlign: "left",
                    }}
                  >
                    {row[key] !== null ? row[key].toString() : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <CustomPagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1); // reset to first page when page size changes
          }}
        />
      </TableContainer>
    </Paper>
  );
};
export default CustomTable;
