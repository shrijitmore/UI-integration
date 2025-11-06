import moment from "moment";

export const commonDateFormat = (isoDateStr) => {
  if (!isoDateStr) return "-";

  // Convert Date object to ISO string if needed
  const input =
    isoDateStr instanceof Date ? isoDateStr.toISOString() : isoDateStr;

  const momentDate = moment(input);
  if (!momentDate.isValid()) return "-";

  return momentDate.format("DD-MM-YYYY hh:mm A"); // Example: "19-06-2025 12:00 AM"
};

export const formatDateTime = (dateTimeStr) => {
  // Input format: "DD/MM/YY hh:mm AM/PM"
  const [datePart, timePart, meridian] = dateTimeStr.split(" ");
  const [day, month, year] = datePart.split("/");

  // Convert 2-digit year to 4-digit year (e.g., 25 -> 2025)
  const fullYear = year.length === 2 ? `20${year}` : year;

  // Create Date object
  const dateObj = new Date(
    `${fullYear}-${month}-${day} ${timePart} ${meridian}`
  );

  // Format date
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = dateObj.toLocaleDateString("en-GB", options);

  return `${formattedDate} ${timePart} ${meridian}`;
};
