import { Box, Tooltip, Typography } from "@mui/material";

export const breakLongWords = (text, maxLength = 12) => {
  if (!text) return "";

  return text
    .split(" ")
    .map((word) =>
      word.length > maxLength
        ? word.match(new RegExp(`.{1,${maxLength}}`, "g"))?.join("\n")
        : word
    )
    .join(" ");
};

export const renderFilePreviewActions = (row, isView = false) => {
  if (!row.attachment_document) return null;

  const resolveFileName = () => {
    if (row?.file_name) return row.file_name;
    if (typeof row?.attachment_document === "string") {
      const parts = row.attachment_document.split("/");
      return parts[parts.length - 1] || "file";
    }
    if (row?.attachment_document?.name) return row.attachment_document.name;
    return "Unknown File";
  };
  const fullName = resolveFileName();
  const displayName =
    fullName.length > 15 ? `${fullName.slice(0, 12)}...` : fullName;
  const disallowedExtensions = [".xls", ".xlsx"];
  const isNotExcel = (nameOrUrl) =>
    !disallowedExtensions.some((ext) => nameOrUrl.toLowerCase().endsWith(ext));
  const canPreview = Boolean(row.preview_url) && isNotExcel(fullName);
  const handleDownload = async (e, file) => {
    e.stopPropagation();
    let url = "";
    if (typeof file === "string") {
      let normalizedFile = file.trim();
      if (normalizedFile.startsWith("http://")) {
        normalizedFile = normalizedFile.replace("http://", "https://");
      }
      if (
        normalizedFile.startsWith("https://") ||
        normalizedFile.startsWith("http://")
      ) {
        url = normalizedFile;
      } else {
        url = `${config.apiUrl}/${normalizedFile.replace(/^\/+/, "")}`;
      }
    } else {
      url = URL.createObjectURL(file);
    }
    try {
      const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
      const isImageUrl = (nameOrUrl) =>
        allowedExtensions.some((ext) => nameOrUrl.toLowerCase().endsWith(ext));
      let urlnew = isImageUrl(url) ? `${url}/` : url;
      const response = await fetch(urlnew);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const filename =
        typeof file === "string"
          ? file.split("/").pop()
          : file.name || "downloaded_file";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
      <Tooltip title={fullName}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            maxWidth: 240,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
          }}
        >
          {displayName}
        </Typography>
      </Tooltip>

      <Box display="flex" gap={1.5} alignItems="center" justifyContent="center">
        {/* {canPreview && (
            <Tooltip title="Preview">
              <IconButton
                color="primary"
                onClick={() =>
                  setPreviewModal({
                    open: true,
                    fileUrl: row.preview_url,
                    fileType: row.attachment_document?.type,
                  })
                }
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  backgroundColor: "#E3F2FD",
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )} */}
        <Tooltip title="Download">
          <IconButton
            color="success"
            onClick={(e) => handleDownload(e, row.attachment_document)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              backgroundColor: "#E8F5E9",
            }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {!isView && (
          <Tooltip title="Remove">
            <IconButton
              color="error"
              disabled={isView}
              onClick={() =>
                handleParameterChange(row.id, "attachment_document", null)
              }
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: "#FFEBEE",
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
export const groupedRows = (rows = []) => {
  return rows.reduce((acc, row) => {
    const type = row.machine_type || "Unknown";
    if (!acc[type]) acc[type] = [];
    acc[type].push(row);
    return acc;
  }, {});
};
export const groupedRowsmachine = (rows = []) => {
  return rows.reduce((acc, row) => {
    const type = row.machine_type || "Unknown";
    const id = row.id;
    if (!acc[type]) {
      acc[type] = {
        machine_type: type,
        machineData: [], 
        groupRows: [], 
      };
    }

    acc[type].groupRows.push(row);
    if (Array.isArray(row.machine_ids)) {
      row.machine_ids.forEach((m) => {
        const exists = acc[type].machineData.some(
          (existing) => existing.machine_id === m.machine_id
        );
        if (!exists) {
          acc[type].machineData.push({
            ...m,
            machine_label: `${m.machine_id}-${type}`, 
            machine_type: type,
            id, 
          });
        }
      });
    }

    return acc;
  }, {});
};
