import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
/**
 * Export any array of objects to PDF with dynamic columns
 * @param {string} title - PDF title and filename
 * @param {Array} data - Array of objects (rows)
 */
export const exportTableToPdf = (title = "Report", data = []) => {
  if (!data || data.length === 0) {
    alert("No data to export!");
    return;
  }
  const doc = new jsPDF();
  const columns = Object.keys(data[0]).map(key => ({
    header: key.charAt(0).toUpperCase() + key.slice(1),
    dataKey: key
  }));

  // Title
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  autoTable(doc, {
    startY: 30,
    columns: columns,
    body: data,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });
  doc.save(`${title}.pdf`);
};
