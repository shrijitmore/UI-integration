import React, { useEffect, useState } from "react";
import { Box, TextField, Autocomplete, Checkbox, Grid } from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";

import { useDispatch } from "react-redux";
import CustomAutocomplete from "../InprocessInspection/CustomAutocomplete";
import { purpleOutlinedInputFieldStyles } from "../InprocessInspection/config";
import { minWidth } from "@mui/system";
const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;
const CommonRmSection = ({
  data = [],
  activeView,
  setSelectedQcMachine,
  setSelectedItem,
  sectionOrMisNo,
  ioNoValue,
  setIoNoValue,
  setSectionOrMisNo,
  selectedQcMachines,
  setSelectedQcMachines,
  disable,
  activeView1,
  setActiveView,
  component,
}) => {
  const [lotQuantity, setLotQuantity] = useState("");

  const [updatedBy, setUpdatedBy] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [qcOptions, setQcOptions] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const foundItemRm = data?.find(
    (item) => item?.io_number === ioNoValue?.io_number
  );

  useEffect(() => {
    if (!ioNoValue || !foundItemRm) {
      setUpdatedBy("");
      setItemCode("");
      setSectionOrMisNo("");
      setSelectedItem("");
      setSelectedQcMachine("");
      setSelectedQcMachines([]);
      setLotQuantity("");
    }

    setUpdatedBy(ioNoValue?.user_name || "");
    // setItemCode( `${ioNoValue?.item_code}-(${ioNoValue?.item_desc})` || "")
    setItemCode(
      [
        ioNoValue?.item_code || "",
        ioNoValue?.item_desc ? `(${ioNoValue.item_desc})` : "",
      ]
        .filter(Boolean)
        .join("-")
    );

    setSectionOrMisNo(ioNoValue?.mis_no || "");
    setSelectedItem(ioNoValue);
    setQcOptions(ioNoValue?.qc_machine || []);
    setLotQuantity(ioNoValue?.lot_qty || "");
  }, [ioNoValue, data, activeView]);
  useEffect(() => {
    if (activeView1 == null) {
      setSelectedSection(null);
      setIoNoValue(null);
      setUpdatedBy("");
      setItemCode("");
      setLotQuantity("");
      setQcOptions([]);
      setSelectedQcMachines([]);
      setSectionOrMisNo("");
      setSelectedItem(null);
      setSelectedQcMachine(null);
      setActiveView("");
    }
  }, [activeView1]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4}>
        <CustomAutocomplete
          label="Section"
          value={selectedSection}
          onChange={(e, newValue) => {
            if (newValue) {
              setSelectedSection(newValue);
              setIoNoValue(null);
              setSelectedQcMachines([]);
              setUpdatedBy("");
              setItemCode("");
              setLotQuantity("");
            } else {
              setIoNoValue(null);
              setSelectedSection(null);
              setSelectedItem(null);
              setSectionOrMisNo("");
              setSelectedQcMachines([]);
              setUpdatedBy("");
              setItemCode("");
              setLotQuantity("");
              setQcOptions([]);
            }
          }}
          options={data || []}
          getOptionLabel={(option) => option?.section_name || ""}
          disabled={disable}
          fullWidth
          datatestid={"search-section_rm"}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        {activeView === 0 && (
          <CustomAutocomplete
            label="I/O No - Mis No"
            value={ioNoValue || null}
            onChange={(e, newValue) => {
              setSelectedQcMachines([]);
              setIoNoValue(newValue);
            }}
            disabled={disable || !selectedSection}
            getOptionLabel={(option) =>
              option ? `${option.io_number ?? ""} - ${option.mis_no ?? ""}` : ""
            }
            options={selectedSection?.io_numbers || []}
            fullWidth
            datatestid={"search-production-order-no_rm"}
          />
        )}
      </Grid>

      <Grid item xs={12} md={4} mt={1}>
        {/* <TextField
          size="small"
          label="Item Code"
          value={itemCode}
          disabled
          fullWidth
          sx={{
            ...purpleOutlinedInputFieldStyles,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
        /> */}
        <TextField
          size="small"
          label="User Name"
          value={updatedBy}
          disabled
          fullWidth
          sx={{
            ...purpleOutlinedInputFieldStyles,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
          InputLabelProps={{
            sx: {
              fontWeight: "bolder",
            },
          }}
        />
      </Grid>

      <Grid item xs={12} md={6} mt={1}>
        <TextField
          size="small"
          label="Lot Quantity"
          value={lotQuantity}
          disabled
          fullWidth
          sx={purpleOutlinedInputFieldStyles}
          InputLabelProps={{
            sx: {
              fontWeight: "bolder",
            },
          }}
        />
      </Grid>

      <Grid item xs={12} md={6} mt={1}>
        <TextField
          size="small"
          label="Item Code"
          value={itemCode}
          disabled
          fullWidth
          sx={{
            ...purpleOutlinedInputFieldStyles,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
          InputLabelProps={{
            sx: {
              fontWeight: "bolder",
            },
          }}
        />

        {/* <TextField
          size="small"
          label="User Name"
          value={updatedBy}
          disabled
          fullWidth
          sx={{
            ...purpleOutlinedInputFieldStyles,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
        /> */}
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <CustomAutocomplete
          multiple
          disableCloseOnSelect
          options={qcOptions}
          value={selectedQcMachines}
          onChange={(e, newValue) => setSelectedQcMachines(newValue)}
          getOptionLabel={(option) => option?.machine_name || ""}
          isOptionEqualToValue={(option, value) =>
            option.machine_id === value.machine_id
          }
          label="QC Machine"
          placeholder="Select QC Machines"
          fullWidth
          datatestid={"search-qc-machine_rm"}
        />
      </Grid> */}
      <Grid item xs={12} md={6} mt={1}>
        {component}
      </Grid>
    </Grid>
  );
};

export default CommonRmSection;
