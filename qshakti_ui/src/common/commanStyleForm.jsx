export const TextInputStyle= {
    "& .MuiFormLabel-root": {
      color: "rgba(0, 0, 0, 0.6)",
    },
    "& .MuiFormLabel-root.Mui-error": {
      color: "rgba(0, 0, 0, 0.6)",
    },
    "& .MuiFormHelperText-root": {
      color: "#cc4949",
      fontSize: "0.875rem",
    },
    "& .MuiInputBase-root": {
      height: "48px",  
    },
    "& .MuiInputBase-input": {
      padding: "8px", 
    },
    fontSize: "14px",
  }
  export const subTitleForm = {
    fontWeight: "bold",
    color: "#7a7a7a",
    marginBottom: "5px",
    paddingLeft: "16px",
  };
  
export const FieldLabel = ({ label, required }) => (
    <>
      {label}
      {required && <span style={{ color: "#cc4949" }}> *</span>}
    </>
  );
  export const AdminBtnStyle = { background: "#5C2D91" ,color:"white",fontWeight:600,}