import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const CustomPagination = ({
  page,
  totalPages,
  pageSize, // renamed from rowsPerPage
  totalRecords, // renamed from totalItems
  onPageChange,
}) => {
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalRecords);

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      p={1}
      gap={1}
    >
      <Typography variant="body2">
        {startItem}–{endItem} of {totalRecords}
      </Typography>
      <IconButton onClick={handlePrev} disabled={page === 1} size="small">
        <ArrowBackIos fontSize="small" />
      </IconButton>
      <IconButton
        onClick={handleNext}
        disabled={page === totalPages}
        size="small"
      >
        <ArrowForwardIos fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default CustomPagination;
