export const normalizeForInprocess = (raw) => {
  const data = {};

  raw?.forEach((item) => {
    const itemCode = item.item_code;

    if (!data[itemCode]) data[itemCode] = {};

    item?.operations?.forEach((op, opIdx) => {
      const operationName = op.operation;

      if (!data[itemCode][operationName]) data[itemCode][operationName] = {};

      op?.inspection_parameters?.forEach((param, paramIdx) => {
        const paramName = param.inspection_parameter;

        if (!data[itemCode][operationName][paramName]) {
          data[itemCode][operationName][paramName] = [];
        }

        data[itemCode][operationName][paramName].push({
          schedule_id: `${opIdx + 1}-${paramIdx + 1}`, // composite id
          qc_machine: null, // optional, can map later
          LSL: param.limits["lower specification limit"],
          Target: param.limits["target limit"],
          USL: param.limits["upper specification limit"],
          actual_readings: param.readings,
        });
      });
    });
  });

  return data;
};

export const normalizeForRM = (raw) => {
  const data = {};

  raw?.forEach((item) => {
    const itemCode = item.item_code;

    if (!data[itemCode]) data[itemCode] = {};

    item?.inspection_parameters?.forEach((param, paramIdx) => {
      const paramName = param.inspection_parameter;

      if (!data[itemCode][paramName]) {
        data[itemCode][paramName] = [];
      }

      data[itemCode][paramName].push({
        schedule_id: `1-${paramIdx + 1}`,
        qc_machine: null,
        LSL: param.limits["lower_specification_limit"],
        Target: param.limits["target_limit"],
        USL: param.limits["upper_specification_limit"],
        actual_readings: param.readings,
      });
    });
  });

  return data;
};

export const transformLineData = (readings = []) =>
  readings.map((val, idx) => ({
    name: `S${idx + 1}`,
    value: Number(val),
  }));

export const transformInspectionResults2 = (data, source) => {
  const charts = [];
  if (!data) return charts;

  if (source === "inprocess" || source === "fai") {
    Object.entries(data || {}).forEach(([itemCode, operations]) => {
      Object.entries(operations || {}).forEach(([operation, measures]) => {
        Object.entries(measures || {}).forEach(([paramName, entries]) => {
          entries.forEach((entry) => {
            charts.push({
              itemCode,
              operation,
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
