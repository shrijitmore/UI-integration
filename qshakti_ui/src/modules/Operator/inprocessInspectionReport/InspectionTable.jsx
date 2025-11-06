import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
} from "@mui/material";
import { renderFormattedReadings } from "./renderFormattedReadings";
import CustomPagination from "../common/CustomPagination";
import NoDataFound from "../../../common/NoDataFound";
import dayjs from "dayjs";
const InspectionTable = ({
  data,
  page,
  totalPages,
  setPage,
  totalRecords,
  pageSize,
  setPageSize,
}) => {
  const groupedData = data?.reduce((acc, row) => {
    const key = row.inspection_parameter_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        overflowX: "auto",
        backgroundColor: "#ffffff",
        borderRadius: 1,
        p: 1.5,
      }}
    >
      {Object.keys(groupedData || {}).length === 0 ? (
        <NoDataFound message="No data found." />
      ) : (
        Object?.entries(groupedData || {}).map(
          ([paramName, rows], paramIndex) => (
            <Box key={paramName} sx={{ mb: 1 }}>
              {/* Section Heading */}
              <Typography
                // variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.6rem",
                  // backgroundColor: "#58b0ebff",
                  p: 0.5,
                  borderRadius: "1px",
                  mb: 0.5,
                }}
              >
                {/* {paramName} */}
                {paramIndex + 1}. {paramName}
              </Typography>

              {/* Table for this parameter */}
              <Table
                size="small"
                stickyHeader
                sx={{
                  borderCollapse: "collapse",
                  "& th, & td": {
                    border: "1px solid #dcdcdc",
                    fontSize: "0.65rem", // smaller text
                    color: "#333",
                    verticalAlign: "middle",
                    padding: "2px 4px", // reduce padding
                  },
                  "& thead th": {
                    backgroundColor: "#f1f1f1",
                    fontWeight: 600,
                    fontSize: "0.68rem", // smaller header text
                    color: "#000",
                    verticalAlign: "middle",
                    padding: "2px 4px", // reduce header cell padding
                    wordBreak: "break-word",
                  },

                  "& tbody tr:nth-of-type(odd)": {
                    backgroundColor: "#FFFFFF", //Light Pink
                  },
                  "& tbody tr:nth-of-type(even)": {
                    backgroundColor: "#f0e6ef4e", //Light Cyan
                  },

                  "& tbody tr:hover": {
                    backgroundColor: "#605d5d45",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell rowSpan={2} align="center" sx={{ width: "5%" }}>
                      Sr
                    </TableCell>
                    <TableCell sx={{ width: "10%" }} rowSpan={2}>
                      User Name
                    </TableCell>
                    <TableCell rowSpan={2} sx={{ width: "15%" }}>
                      Transaction Date
                    </TableCell>
                    {/* <TableCell rowSpan={2} sx={{ width: "15%" }}>
                      USL - LSL
                    </TableCell>{" "} */}
                    <TableCell rowSpan={2} sx={{ width: "30%" }}>
                      Actual Readings
                    </TableCell>
                    <TableCell colSpan={3} sx={{ width: "20%" }} align="center">
                      Reading Analysis
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="center" sx={{ width: "6%" }}>
                      Accepted
                    </TableCell>
                    <TableCell align="center" sx={{ width: "6%" }}>
                      Rejected
                    </TableCell>
                    <TableCell align="center" sx={{ width: "6%" }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell align="center" sx={{ width: "5%" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        {row.user_name}
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        {/* {dayjs(.format("DD/MM/YYYY HH:mm:ss")} */}
                        {row.updated_at}
                      </TableCell>
                      {/* <TableCell sx={{ width: "15%" }}>
                        {`${row?.USL || "-"} - ${row?.LSL || "-"}`}
                      </TableCell> */}
                      {/* <TableCell
                        sx={{ backgroundColor: "#fafafa", width: "30%" }}
                      >
                        {row.actual_readings?.length === 0 ? (
                          <Typography sx={{ fontSize: "0.7rem" }}>
                            No Data
                          </Typography>
                        ) : (
                          renderFormattedReadings(row)
                        )}
                      </TableCell> */}

                      <TableCell
                        sx={{ width: "30%" }} // ❌ removed backgroundColor: "#fafafa"
                      >
                        {row.actual_readings?.length === 0 ? (
                          <Typography sx={{ fontSize: "0.7rem" }}>
                            No Data
                          </Typography>
                        ) : (
                          renderFormattedReadings(row)
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ width: "6%" }}>
                        {row?.accept_count ?? "0"}
                      </TableCell>
                      <TableCell align="center" sx={{ width: "6%" }}>
                        {row?.reject_count ?? "0"}
                      </TableCell>
                      <TableCell align="center" sx={{ width: "6%" }}>
                        {row?.total_count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )
        )
      )}
      {data?.length > 0 && (
        <CustomPagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      )}
    </Paper>
  );
};

export default InspectionTable;
