// hooks/useSaveInspection.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "../../../common/ShowToast";
import {
  acceptAndReject,
  actualReading,
  buildInspectionFormData,
  OkAndNotOK,
} from "./config";
export const useSaveInspection = ({
  LayoutKey,
  keyName,
  POIONUMBER,
  isEdit,
  operation_id,
  setActiveView,
  addReadingSampleRow,
  setVisibleCount,
  setInputErrors,
}) => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const handleSave = async (rows, final_key) => {
    const newErrors = {};

    rows.forEach((row) => {
      if (actualReading(row)) {
        row?.actualReadings.forEach((val, idx) => {
          const reading = val?.r_value;
          if (!reading && reading !== 0) {
            newErrors[`${row.id}-${idx}`] = "Required";
          } else if (!/^\d+(\.\d+)?$/.test(reading)) {
            newErrors[`${row.id}-${idx}`] = "Numbers only";
          }
        });
      } else if (acceptAndReject(row)) {
        if (isEmptyValue(row.actualReadings[0]?.accepted)) {
          newErrors[`${row.id}-accepted`] = "Required";
        }
        if (isEmptyValue(row.actualReadings[0]?.rejected)) {
          newErrors[`${row.id}-rejected`] = "Required";
        }
      } else if (OkAndNotOK(row)) {
        row.actualReadings.forEach((val, idx) => {
          if (isEmptyValue(val.r_value)) {
            newErrors[`${row.id}-${idx}`] = "Required";
          }
        });
      }
    });
    console.log(newErrors, "newErrorsnewErrorsnewErrors");

    if (Object.keys(newErrors).length > 0) {
      setInputErrors(newErrors);
      showToast("Please fill all required fields", "error");
      return;
    }

    if (!final_key) {
      if (LayoutKey !== "sample") {
        setVisibleCount((prev) => Math.min(prev + 1, rows.length));
      } else {
        addReadingSampleRow();
      }
    }

    const formData = buildInspectionFormData(
      rows,
      POIONUMBER,
      LayoutKey,
      isEdit,
      final_key,
      operation_id
    );

    try {
      setLoader(true);
      const url =
        keyName === "inprocess"
          ? IN_PROCESS_INSPECTION_SAVE
          : keyName === "fai"
          ? FAI_INSPECTION_SAVE
          : RM_INSPECTION_SAVE;

      const action = isEdit
        ? updateInProcessInspection
        : inProcessInspectionSave;

      const res = await dispatch(action({ data: formData, url })).unwrap();

      if (res?.is_success) {
        showToast(res?.message, "success");
        if (final_key) {
          setVisibleCount(1);
          setActiveView(null);
        }
      }
    } catch (err) {
      console.error("API call failed:", err);
      showToast("Something went wrong", "error");
    } finally {
      setLoader(false);
    }
  };

  return { loader, handleSave };
};
