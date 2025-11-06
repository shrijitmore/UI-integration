export const backgroundColor = "#1976d2";

export const apiDateRangeMap = {
  "24hours": "last_24_hours",
  "7days": "last_7_days",
  "15days": "last_15_days",
  "30days": "last_30_days",
  "3months": "last_3_months",
  "6months": "last_6_months",
  custom: "custom",
};

export const apiKeyMap = {
  inprocess: {
    barGraph: "operation-bargraph",
    lineGraph: "qc/inspection-results",
  },
  fai: {
    barGraph: "fai-operation-bargraph",
    lineGraph: "qc/fai-inspection-results",
  },
  rm: {
    barGraph: "rm_linegraph",
    lineGraph: "rm_linegraph",
  },
};

export const apiKeyMapTwo = {
  inprocess: {
    barGraph: "inspection",
    lineGraph: "inspection",
  },
  fai: {
    barGraph: "fai",
    lineGraph: "fai",
  },
  rm: {
    barGraph: "rm",
    lineGraph: "rm",
  },
};

// transform.js
export const transformLineData = (readings = []) =>
  readings.map((val, idx) => ({
    name: `S${idx + 1}`,
    value: Number(val),
  }));

export const transformInspectionResults = (data, source) => {
  const charts = [];
  if (!data) return charts;

  if (source === "inprocess" || source === "fai") {
    Object.entries(data || {}).forEach(([itemCode, inspections]) => {
      Object.entries(inspections || {}).forEach(
        ([inspectionType, measures]) => {
          Object.entries(measures || {}).forEach(([paramName, entries]) => {
            entries.forEach((entry) => {
              charts.push({
                itemCode,
                inspectionType,
                paramName,
                schedule_id: entry.schedule_id,
                qc_machine: entry.qc_machine,
                lsl: Number(entry.LSL),
                controlLimit: Number(entry.Target),
                usl: Number(entry.USL),
                chartData: transformLineData(entry.actual_readings),
              });
            });
          });
        }
      );
    });
  } else if (source === "rm") {
    Object.entries(data || {}).forEach(([itemCode, params]) => {
      Object.entries(params || {}).forEach(([paramName, entries]) => {
        entries.forEach((entry) => {
          charts.push({
            itemCode,
            paramName,
            schedule_id: entry.schedule_id,
            qc_machine: entry.qc_machine,
            lsl: Number(entry.LSL),
            controlLimit: Number(entry.Target),
            usl: Number(entry.USL),
            chartData: transformLineData(entry.actual_readings),
          });
        });
      });
    });
  }
  return charts;
};

export const transformBarData = (bins) =>
  Object.keys(bins || {}).map((key) => ({
    range: key,
    count: bins[key],
  }));
