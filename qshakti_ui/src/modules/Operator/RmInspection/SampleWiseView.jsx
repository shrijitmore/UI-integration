import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  InputBase,
} from "@mui/material";
import CommonDataGrid from "../../../common/commonComponent/commonDataGrid/commonDataGrid";

const SampleWiseView = () => {
  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parameters",
      headerName: "Parameters",
      flex: 1,
    },
    {
      field: "limits",
      headerName: "Dimensional Limits",
      width: 180,
      renderCell: () => (
        <Box display="flex" gap={1}>
          <InputBase
            defaultValue="1.09mm"
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              px: 1,
              width: "70px",
            }}
          />
          <InputBase
            defaultValue="1.24mm"
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              px: 1,
              width: "70px",
            }}
          />
        </Box>
      ),
    },
    {
      field: "frequency",
      headerName: "Frequency",
      width: 160,
      renderCell: () => (
        <TextField value="Once per m/c" size="small" fullWidth disabled />
      ),
    },
    {
      field: "sampleSize",
      headerName: "Sample Size",
      width: 130,
      renderCell: () => (
        <InputBase
          defaultValue="6"
          sx={{
            border: "1px solid #ccc",
            borderRadius: 1,
            px: 1,
            width: 40,
          }}
        />
      ),
    },
    {
      field: "readings",
      headerName: "Actual Readings",
      width: 180,
      renderCell: () => (
        <Box display="flex" gap={1}>
          <InputBase
            defaultValue="10"
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              px: 1,
              width: 40,
            }}
          />
          <InputBase
            defaultValue="10"
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              px: 1,
              width: 40,
            }}
          />
        </Box>
      ),
    },
    {
      field: "comments",
      headerName: "Comments",
      flex: 1,
      renderCell: () => (
        <TextField value="Lorem Ipsum" size="small" fullWidth />
      ),
    },
  ];

  const rows = [
    "Wall thickness at 2.24mm from inside dome",
    "Wall thickness at 9.24mm from inside dome",
    "Wall thickness at 28.24mm from inside dome",
    "Wall thickness at 37mm from inside dome",
    "Wall thickness at 2.24mm from inside dome",
    "Wall thickness at 9.24mm from inside dome",
  ].map((param, i) => ({
    id: i,
    srNo: `${String.fromCharCode(97 + i)})`,
    parameters: param,
  }));

  return (
    <Box>
      <Paper variant="outlined" sx={{ mt: 2, p: 1 }}>
        <Box mt={3} style={{ height: 500, width: "100%" }}>
          <CommonDataGrid
            rows={rows}
            columns={columns}
            pageSize={rows.length}
            hideFooter
            disableColumnMenu
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>

      <Box
        mt={3}
        display="flex"
        justifyContent="flex-end"
        flexWrap="wrap"
        gap={2}
      >
        <Button variant="contained" color="primary">
          &lt; Previous
        </Button>
        <Button variant="contained" color="primary">
          Next Sample &gt;
        </Button>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default SampleWiseView;
