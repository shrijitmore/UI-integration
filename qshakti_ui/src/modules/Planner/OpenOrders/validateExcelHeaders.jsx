import * as XLSX from "xlsx";

/**
 * Validates Excel file headers.
 * @param {File} file - The uploaded Excel file
 * @param {Array<string>} expectedHeaders - Array of expected column headers
 * @returns {Promise<{ valid: boolean, headers?: Array<string>, missingHeaders?: Array<string> }>}
 */
export const validateExcelHeaders = (file, expectedHeaders) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const fileHeaders = rows[0].map((h) => h?.trim?.());

        const missingHeaders = expectedHeaders.filter(
          (header) => !fileHeaders.includes(header)
        );

        if (missingHeaders.length > 0) {
          resolve({
            valid: false,
            headers: fileHeaders,
            missingHeaders,
          });
        } else {
          resolve({
            valid: true,
            headers: fileHeaders,
          });
        }
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
