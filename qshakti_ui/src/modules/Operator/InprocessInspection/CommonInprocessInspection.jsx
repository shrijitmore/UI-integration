import React, { useEffect, useState } from "react";
import { Box, TextField, Autocomplete, Typography, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  machineDropDawn,
  machineRMDropDawn,
} from "../../../store/slices/operator/CommonIOSectionSlice";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import {
  purpleOutlinedInputFieldStyles,
  purpleOutlinedTextFieldStyles,
} from "./config";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CustomAutocomplete from "./CustomAutocomplete.jsx";

// Icons for checkboxes
const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;
const CommonInprocessInspection = ({
  setSelectedMachines,
  data = [],
  activeView,
  selectedProductionMachine,
  setSelectedProductionMachine,
  selectedQcMachine,
  setSelectedQcMachine,
  setSelectedItem,
  selectedItem,
  sectionOrMisNo,
  setSectionOrMisNo,
  selectedOperationValue,
  setSelectedOperationValue,
  selectedOperationList,
  ioNo,
  setIoNo,
  keyName,
  ioNoValue,
  setIoNoValue,
  selectedMachines,
  selectedQcMachines,
  setSelectedQcMachines,
  disable,
}) => {
  const dispatch = useDispatch();
  const [lotQuantity, setLotQuantity] = useState("");

  const [updatedBy, setUpdatedBy] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [productionOptions, setProductionOptions] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const [qcOptions, setQcOptions] = useState([]);
  const [hovered, setHovered] = useState(false);

  const foundItem = data?.find((item) => item?.order_number === ioNo);
  const foundItemRm = data?.find(
    (item) => item?.io_number === ioNoValue?.io_number
  );
  const [productionError, setProductionError] = useState(false);
  const [qcError, setQcError] = useState(false);
  const isValidMachineList = (list) =>
    Array.isArray(list) &&
    list.length > 0 &&
    list.every((item) => item?.machine_id);
  // useEffect(() => {
  //   if (!ioNo || !foundItem) {
  //     setUpdatedBy("");
  //     setItemCode("");
  //     setSectionOrMisNo("");
  //     setSelectedItem("");
  //     setSelectedQcMachine("");
  //     setSelectedProductionMachine("");
  //     setSelectedOperationValue("");
  //   }

  //   const sectionOrMis = foundItem?.section || "";
  //   setSectionOrMisNo(sectionOrMis);
  //   setUpdatedBy(foundItem?.user_name || "");
  //   setItemCode(foundItem?.item_code || "");
  //   setSelectedItem(foundItem);
  //   setProductionOptions(foundItem?.production_machines || []);
  //   setQcOptions(foundItem?.qc_machine || []);
  // }, [ioNo, data, activeView]);

  return (
    <>
      <Grid container spacing={1}>
        {/* First Row */}
        {/* <Grid item md={4} xs={12}>
          <CustomAutocomplete
            label="Section"
            value={selectedSection}
            onChange={(e, newValue) => {
              if (newValue) {
                setSelectedSection(newValue);
                setIoNo(""); // reset order when section changes
                setSelectedQcMachines([]);
                setSelectedMachines([]);
              } else {
                setSelectedSection(null); // ✅ clear selectedSection
                setSelectedItem(null);
                setSectionOrMisNo("");
                setSelectedQcMachines([]);
                setSelectedMachines([]);
                setUpdatedBy("");
                setItemCode("");
                setLotQuantity("");
                setIoNo(""); // ✅ better as "" instead of []
                setProductionOptions([]);
                setQcOptions([]);
                setProductionError(false);
                setQcError(false);
              }
            }}
            options={data?.map((item) => item?.section_name) || []}
            disabled={disable}
          />
        </Grid> */}
        <Grid item md={4} xs={12}>
          <CustomAutocomplete
            label="Section"
            value={selectedSection}
            onChange={(e, newValue) => {
              if (newValue) {
                setSelectedSection(newValue);
                setIoNo(""); // reset order when section changes
                setSelectedQcMachines([]);
                setSelectedMachines([]);
                setUpdatedBy("");
                setItemCode("");
                setLotQuantity("");
              } else {
                setSelectedSection(null);
                setSelectedItem(null);
                setSectionOrMisNo("");
                setSelectedQcMachines([]);
                setSelectedMachines([]);
                setUpdatedBy("");
                setItemCode("");
                setLotQuantity("");
                setIoNo("");
                setProductionOptions([]);
                setQcOptions([]);
                setProductionError(false);
                setQcError(false);
              }
            }}
            options={data || []} // ✅ pass whole section object
            getOptionLabel={(option) => option?.section_name || ""}
            datatestid={"autocomplete-section"}
            disabled={disable}
          />
        </Grid>

        <Grid item md={4} xs={12}>
          {activeView !== 0 && (
            <CustomAutocomplete
              label="Production Order No."
              value={ioNo}
              onChange={(e, newValue) => {
                setIoNo(newValue);
                setSelectedQcMachines([]);

                if (newValue && selectedSection) {
                  const foundOrder = selectedSection?.orders?.find(
                    (order) => order.order_number === newValue
                  );

                  setSelectedItem(foundOrder);
                  setSectionOrMisNo(foundOrder?.section || "");
                  setUpdatedBy(foundOrder?.user_name || "");
                  setItemCode(
                    `${foundOrder?.item_code}-(${foundOrder?.item_desc})` || ""
                  );
                  setLotQuantity(foundOrder?.lot_qty || "");
                  setProductionOptions(
                    (foundOrder?.qc_machine || []).filter(
                      (m) => m.machine_type === "Production"
                    )
                  );
                  setQcOptions(
                    (foundOrder?.qc_machine || []).filter(
                      (m) => m.machine_type === "QC"
                    )
                  );

                  const valid = isValidMachineList(
                    foundOrder?.qc_machine || []
                  );
                  setProductionError(!valid);
                  setQcError(!valid);
                } else {
                  setSelectedItem(null);
                  setSectionOrMisNo("");
                  setUpdatedBy("");
                  setItemCode("");
                  setLotQuantity("");
                  setProductionOptions([]);
                  setQcOptions([]);
                  setProductionError(false);
                  setQcError(false);
                }
              }}
              options={
                selectedSection?.orders?.map((order) => order.order_number) ||
                []
              }
              disabled={disable || !selectedSection} // ✅ disable until section chosen
              datatestid={"autocomplete-order-no"}
            />
          )}
        </Grid>

        {/* <Grid item md={4} xs={12}>
          {activeView !== 0 && ( // ✅ only show if section selected
            <CustomAutocomplete
              label="Production Order No."
              value={ioNo}
              onChange={(e, newValue) => {
                setIoNo(newValue);
                setSelectedQcMachines([]);

                if (newValue) {
                  // find selected order object only inside selected section
                  const foundOrder = selectedSection.orders.find(
                    (order) => order.order_number === newValue
                  );

                  setSelectedItem(foundOrder);
                  setSectionOrMisNo(foundOrder?.section || "");
                  setUpdatedBy(foundOrder?.user_name || "");
                  setItemCode(foundOrder?.item_code || "");
                  setLotQuantity(foundOrder?.lot_qty || "");
                  setProductionOptions(foundOrder?.production_machines || []);
                  setQcOptions(foundOrder?.qc_machine || []);

                  const valid = isValidMachineList(
                    foundOrder?.qc_machine || []
                  );
                  setProductionError(!valid);
                  setQcError(!valid);
                } else {
                  setSelectedItem(null);
                  setSectionOrMisNo("");
                  setUpdatedBy("");
                  setItemCode("");
                  setLotQuantity("");
                  setProductionOptions([]);
                  setQcOptions([]);
                  setProductionError(false);
                  setQcError(false);
                }
              }}
              options={
                selectedSection?.orders.map((order) => order.order_number) || []
              } // ✅ filter by section
              disabled={disable}
            />
          )}

          {activeView === 0 && (
            <Autocomplete
              size="small"
              options={data || []}
              value={
                data?.find(
                  (item) =>
                    item.io_number === ioNoValue?.io_number &&
                    item.mis_no === ioNoValue?.mis_no
                ) || null
              }
              onChange={(e, newValue) => setIoNoValue(newValue)}
              getOptionLabel={(option) =>
                `${option.io_number} - MIS ${option.mis_no}`
              }
              sx={{ minWidth: 150 }}
              renderInput={(params) => (
                <TextField {...params} label="I/O NO. with MIS" required />
              )}
            />
          )}
        </Grid> */}

        <Grid item md={4} xs={12} mt={1}>
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

        <Grid item md={8} xs={12} mt={1}>
          <TextField
            size="small"
            label="Item Code"
            value={itemCode}
            disabledfoundItem
            disabled={true}
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
          />{" "}
        </Grid>
        <Grid item md={4} xs={12} mt={1}>
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
        {/* <Grid item md={6} xs={12}>
          <CustomAutocomplete
            multiple
            disableCloseOnSelect
            options={Array.isArray(qcOptions) ? qcOptions : []}
            value={selectedQcMachines}
            onChange={(e, newValue) => {
              setSelectedQcMachines(newValue);
              const isValid = isValidMachineList(newValue);
              setQcError(!isValid); // ❗ show error if not valid

              // Also revalidate Production side (to possibly clear its error)
              setProductionError(!isValidMachineList(selectedMachines));
            }}
            getOptionLabel={(option) => option?.machine_name || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            label="QC Machine"
            placeholder="Select QC Machines"
            // required
            sx={{ minWidth: 215 }}
            textFieldProps={{
              error: qcError,
              helperText: qcError
                ? "Please select at least one valid QC Machine."
                : "",
            }}
            disabled={disable}
            datatestid={"autocomplete-qc-machine"}
          />{" "}
        </Grid> */}

        <Grid item md={4} xs={12}>
          {activeView !== null && keyName !== "rm" && (
            <CustomAutocomplete
              label="Operation"
              value={selectedOperationValue}
              onChange={(e, newValue) => setSelectedOperationValue(newValue)}
              options={
                Array.isArray(selectedOperationList)
                  ? selectedOperationList
                  : []
              }
              getOptionLabel={(option) => option?.operation?.toString() || ""}
              disabled={activeView !== null && keyName !== "rm"}
              datatestid={"autocomplete-operation"}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CommonInprocessInspection;
