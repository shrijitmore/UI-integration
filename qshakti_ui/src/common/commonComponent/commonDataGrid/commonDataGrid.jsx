// import * as React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { Box } from "@mui/material";
// import NoDataFound from "../../NoDataFound";
// import { height } from "@mui/system";
// import { getCommonDatagridHeaderStyles } from "../../../utils/tableStyle";

// export const CustomNoRowsOverlay = () => {
//   return (
//     <Box
//       sx={{
//         height: "100%",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         p: 2,
//         flexDirection: "column",
//       }}
//     >
//       <NoDataFound message="Data Not Found" messagePosition="center" />
//     </Box>
//   );
// };

// const CommonDataGrid = ({
//   rows = [],
//   columns = [],
//   checkboxSelection = false,
//   loading = false,
//   getRowId = (row) => row.id,
//   onRowClick,
//   sx = {},
//   noDataMessage = "No Data Found",
//   pageSizeOptions = [5, 10, 20, 50],
//   initialPageSize = 10,
//   paginationModel,
//   onPaginationModelChange,
//   rowCount,
//   paginationMode,
//   enablePagination = false,
//   height = "90%",
// }) => {
//   const [pagination, setPagination] = React.useState({
//     pageSize: initialPageSize,
//     page: 0,
//   });

//   const handlePaginationChange =
//     onPaginationModelChange || ((model) => setPagination(model));

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: height, // Use 90% of parent
//         display: "flex",
//         flexDirection: "column",
//         ...sx,
//         mb: 2, // Optional margin-bottom for spacing
//         bgcolor: "#ffffff", // Ensure background is white
//         marginBottom: 9, // Add margin to the bottom
//         borderRadius: "8px", // Optional: add border radius for aesthetics
//       }}
//     >
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         rowCount={rowCount}
//         paginationMode={paginationMode}
//         checkboxSelection={checkboxSelection}
//         loading={loading}
//         getRowId={getRowId}
//         onRowClick={onRowClick}
//         autoHeight={false}
//         enablePagination={enablePagination}
//         pageSizeOptions={enablePagination ? pageSizeOptions : []}
//         pagination={enablePagination}
//         paginationModel={enablePagination ? paginationModel : undefined}
//         onPaginationModelChange={
//           enablePagination ? handlePaginationChange : undefined
//         }
//         slots={{ noRowsOverlay: CustomNoRowsOverlay }}
//         sx={{
//           ...getCommonDatagridHeaderStyles(),
//         }}
//       />
//     </Box>
//   );
// };

// export default CommonDataGrid;

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Tooltip, Typography } from "@mui/material";
import NoDataFound from "../../NoDataFound";
import { getCommonDatagridHeaderStyles } from "../../../utils/tableStyle";

// Custom no rows overlay
export const CustomNoRowsOverlay = () => (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
      flexDirection: "column",
    }}
  >
    <NoDataFound message="Data Not Found" messagePosition="center" />
  </Box>
);

// Tooltip cell component
const CellWithTooltip = ({ value, align = "left" }) => {
  const cellRef = React.useRef(null);
  const [isOverflowed, setIsOverflowed] = React.useState(false);

  React.useEffect(() => {
    if (cellRef.current) {
      setIsOverflowed(
        cellRef.current.scrollWidth > cellRef.current.clientWidth
      );
    }
  }, [value]);

  return (
    <Tooltip title={isOverflowed ? value : ""}>
      <Typography
        ref={cellRef}
        variant="body2"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: align,
          width: "100%",
        }}
      >
        {value}
      </Typography>
    </Tooltip>
  );
};

const CommonDataGrid = ({
  rows = [],
  columns = [],
  checkboxSelection = false,
  loading = false,
  getRowId = (row) => row.id,
  onRowClick,
  sx = {},
  pageSizeOptions = [5, 10, 20, 50],
  initialPageSize = 10,
  paginationModel,
  onPaginationModelChange,
  rowCount,
  paginationMode,
  enablePagination = false,
  height = "90%",
}) => {
  const [pagination, setPagination] = React.useState({
    pageSize: initialPageSize,
    page: 0,
  });

  const handlePaginationChange =
    onPaginationModelChange || ((model) => setPagination(model));

  const enhancedColumns = columns.map((col) => {
    const skipWrapping =
      col.renderCell || col.valueFormatter || col.type === "actions";

    if (skipWrapping) {
      return col;
    }

    return {
      ...col,
      renderCell: (params) => (
        <CellWithTooltip value={params.value} align={col.align || "left"} />
      ),
      headerAlign: col.align || "left",
      flex: col.flex,
      minWidth: col?.width || 100,
    };
  });

  return (
    <Box
      sx={{
        width: "100%",
        height,
        display: "flex",
        flexDirection: "column",
        ...sx,
        mb: 2,
        bgcolor: "#ffffff",
        borderRadius: "8px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={enhancedColumns}
        rowCount={rowCount}
        paginationMode={paginationMode}
        checkboxSelection={checkboxSelection}
        loading={loading}
        getRowId={getRowId}
        onRowClick={onRowClick}
        autoHeight={false}
        // pageSizeOptions={enablePagination ? pageSizeOptions : []}
        paginationModel={enablePagination ? paginationModel : undefined}
        onPaginationModelChange={
          enablePagination ? handlePaginationChange : undefined
        }
        // disableColumnMenu
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        sx={{
          ...getCommonDatagridHeaderStyles(),
        }}
      />
    </Box>
  );
};

export default CommonDataGrid;
