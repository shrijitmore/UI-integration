import React, { useState } from "react";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";

const DisplayListWithTooltip = ({ label, data = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? data : data.slice(0, 5);

  return (
    <Box mb={2}>
      <Typography variant="subtitle1" sx={{ mb: 0 }}>
        {label}
      </Typography>

      <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mt={0}>
        {visibleItems.map((item, idx) => (
          <Chip key={idx} label={item} variant="outlined" />
        ))}

        {data.length > 5 && (
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{
              textTransform: "none",
              minWidth: "unset",
              padding: "4px 8px",
            }}
          >
            {expanded ? "Show Less" : `+${data.length - 5} more`}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DisplayListWithTooltip;
