import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const excelDownload = (
  data,
  fileName = "data",
  sheetName = "Sheet1"
) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No data to download");
    return;
  }

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Save the file
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};
