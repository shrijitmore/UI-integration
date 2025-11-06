// hooks/useRowsManager.js
import { useState, useEffect } from "react";
// import { showToast } from "../utils/toast";
import { convertInspectionTypeToRows } from "./config";

export const useRowsManager = (operationList, LayoutKey, isdata) => {
  const [rows, setRows] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [inputErrors, setInputErrors] = useState({});

  // build rows when operationList changes
  useEffect(() => {
    const newRows = convertInspectionTypeToRows(
      operationList,
      LayoutKey,
      isdata
    );
    if (JSON.stringify(rows) !== JSON.stringify(newRows)) {
      setRows(newRows);
    }
  }, [operationList, LayoutKey, isdata]);

  const handleParameterChange = (rowId, field, value, index = null) => {
    setInputErrors({});
    if (field === "attachment_document") {
      if (!value) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  attachment_document: "",
                  preview_url: null,
                  file_name: "",
                  isExcel: false,
                  file_error: "",
                }
              : row
          )
        );
        showToast("Attachment removed successfully", "success");
        return;
      }

      const file = value;
      const fileSizeLimit = 10 * 1024 * 1024;
      const fileType = file?.type;

      if (file.size > fileSizeLimit) {
        showToast("File size should be less than 10MB", "error");
        return;
      }

      const isImage = fileType?.startsWith("image/");
      const isPdf = fileType === "application/pdf";
      const isExcel =
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileType === "application/vnd.ms-excel";

      const fileURL = isImage || isPdf ? URL.createObjectURL(file) : null;
      const fileName = file?.name || "";
      if (rows && rowId === "sample") {
        setRows((prev) => {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            attachment_document: file,
            preview_url: fileURL,
            file_name: fileName,
            isExcel: isExcel,
            file_error: "",
          };
          return updated;
        });
      } else {
        setRows((prev) =>
          prev.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  attachment_document: file,
                  preview_url: fileURL,
                  file_name: fileName,
                  isExcel: isExcel,
                  file_error: "",
                }
              : row
          )
        );
      }
    }
    if (field === "actualReadings") {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]: row[field].map((reading, i) =>
                  i === index ? { ...reading, r_value: value || "" } : reading
                ),
              }
            : row
        )
      );

      const isValid =
        value === "" || (/^\d+(\.\d+)?$/.test(value) && Number(value) >= 0);

      setInputErrors((prev) => ({
        ...prev,
        [`${rowId}-${index}`]: isValid
          ? ""
          : "Enter a valid non-negative number",
      }));

      return;
    }

    if (field === "accepted" || field === "rejected") {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                actualReadings: row?.actualReadings?.map((reading, i) =>
                  i === 0 && typeof reading === "object"
                    ? { ...reading, [field]: value }
                    : reading
                ),
              }
            : row
        )
      );
      return;
    }
    if (field === "comments") {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]: value,
              }
            : row
        )
      );
    }
  };
  const addReading = (rowId, type) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              actualReadings:
                type === "actual"
                  ? [...row.actualReadings, ""]
                  : row.actualReadings,
            }
          : row
      )
    );
  };

  const addReadingSampleRow = () => {
    setRows((prev) =>
      prev.map((row) => {
        const currentLen = row.actualReadings?.length || 0;
        const sampleSize = Number(row.sampleSize) || 0;
        if (currentLen >= sampleSize) return row;
        return { ...row, actualReadings: [...row.actualReadings, ""] };
      })
    );
  };

  const removeReadingSampleRow = () => {
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        actualReadings: (row.actualReadings || []).slice(0, -1),
      }))
    );
  };

  return {
    rows,
    setRows,
    rowId,
    setRowId,
    inputErrors,
    setInputErrors,
    handleParameterChange,
    addReading,
    addReadingSampleRow,
    removeReadingSampleRow,
  };
};
