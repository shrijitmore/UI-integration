import { GET_RM_INSPECTION_REPORT } from "../../../utils/endpoints";
import InprocessInspectionReport from "../inprocessInspectionReport/inprocessInspectionReport";

const RmInspectionReport = () => {
  return (
    <InprocessInspectionReport
      title="RM Inspection Report"
      url={GET_RM_INSPECTION_REPORT}
      keyLable={true}
    />
  );
};
export default RmInspectionReport;
