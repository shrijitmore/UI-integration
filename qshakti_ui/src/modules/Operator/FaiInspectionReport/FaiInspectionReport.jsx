import { GET_FAI_INSPECTION_REPORT } from "../../../utils/endpoints";
import InprocessInspectionReport from "../inprocessInspectionReport/inprocessInspectionReport";

const FaiInspectionReport = () => {
  return (
    <InprocessInspectionReport
      title="FAI Inspection Report"
      url={GET_FAI_INSPECTION_REPORT}
    />
  );
};
export default FaiInspectionReport;
