// export const createAttachmentObjects = (files) => {
//   return files.map((file) => ({
//     id: Date.now() + Math.random(),
//     name: file.name,
//     url: URL.createObjectURL(file),
//     file,
//   }));
// };

// export const createAttachmentObjects = (files) =>
//   files.map((file, index) => ({
//     id: Date.now() + index,
//     file,
//     name: file.name,
//     url: URL.createObjectURL(file),
//   }));
export const createAttachmentObjects = (files) =>
  files.map((file, index) => {
    const originalName = file.name;
    const dotIndex = originalName.lastIndexOf(".");
    const base = originalName.substring(0, dotIndex);
    const ext = originalName.substring(dotIndex);
    const truncatedBase = base?.length > 20 ? base?.slice(0, 20) : base;
    const truncatedName = `${truncatedBase}${ext}`;
    return {
      id: Date.now() + index,
      file,
      name: truncatedName,
      url: URL.createObjectURL(file),
    };
  });


// Utility to revoke one or many file URLs
export const revokeAttachmentUrls = (attachments) => {
  attachments.forEach((attachment) => {
    if (attachment?.url) URL.revokeObjectURL(attachment.url);
  });
};
