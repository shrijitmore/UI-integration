// utils/formatUtils.js
// export const formatDate = (date) => {
//   if (!date) return "";
//   const d = new Date(date);
//   return d?.toISOString()?.split("T")[0];
// };
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    console.warn("Invalid date:", date);
    return "";
  }
  return d.toISOString().split("T")[0];
};

export const FormatDataAndHeaders = (data = []) => {
  if (!data || data?.length === 0) return { data: [], headers: {} };

  const headers = {};
  const formattedData = data?.map((item, index) => {
    const formattedItem = {
      "Sr.No": index + 1,
    };

    if (!("Sr.No" in headers)) {
      headers["Sr.No"] = "Sr. No";
    }

    Object.entries(item)?.forEach(([key, value]) => {
      const displayKey = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char?.toUpperCase());

      headers[key] = displayKey;

      formattedItem[key] = key.toLowerCase()?.includes("date")
        ? formatDate(value)
        : value;
    });

    return formattedItem;
  });

  return { data: formattedData, headers };
};

export function filterDataByKeys(dataArray, keysToKeep) {
  if (keysToKeep?.length > 0) {
    return dataArray?.map((item) => {
      const filteredItem = {};
      keysToKeep?.forEach((key) => {
        const value = key
          .split(".")
          .reduce((obj, k) => (obj ? obj[k] : undefined), item);
        filteredItem[key] = value !== undefined ? value : null;
      });
      return filteredItem;
    });
  } else {
    return dataArray;
  }
}
