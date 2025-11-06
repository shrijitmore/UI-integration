import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Export data to Excel with dynamic columns
 * @param {Array} data - Array of objects
 * @param {string} fileName - Name of the Excel file
 */
export const exportTableToExcel = (data = [], fileName = "Report") => {
  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const fileData = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(fileData, `${fileName}.xlsx`);
};
