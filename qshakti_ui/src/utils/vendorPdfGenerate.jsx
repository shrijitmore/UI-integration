import jsPDF from "jspdf";
import config from "../config";

import { Typography, Tooltip } from "@mui/material";

export const generateVendorPDFTemplate = (vendorData) => {
  const pdf = new jsPDF();
  let y = 15;

  const drawSection = (title, entries) => {
    if (y > 260) {
      pdf.addPage();
      y = 15;
    }

    pdf.setFontSize(14);
    pdf.setTextColor("#0d6efd");
    pdf.text(title, 10, y);
    y += 6;

    pdf.setDrawColor(0);
    pdf.line(10, y, 200, y); // horizontal line
    y += 5;

    pdf.setFontSize(11);
    pdf.setTextColor("#000000");

    entries.forEach(({ label, value }) => {
      if (y > 270) {
        pdf.addPage();
        y = 15;
      }

      pdf.text(`${label}: ${value ?? "N/A"}`, 12, y);
      y += 6;
    });

    y += 8;
  };

  const companyRep = vendorData.company_reperesentative?.[0];
  drawSection("1. Company Representative", [
    { label: "Name", value: companyRep?.name },
    { label: "Designation", value: companyRep?.designation },
    { label: "Email", value: companyRep?.email_id },
    { label: "Mobile", value: companyRep?.mobile_no },
    { label: "Alternate Mobile", value: companyRep?.alternate_mobile_no },
  ]);

  const orgDetails = vendorData.organization_details?.[0];
  const orgAddress = orgDetails?.addresses?.[0];
  drawSection("2. Organization Details", [
    {
      label: "Company Name",
      value: orgDetails?.company_name || "Not Provided",
    },
    {
      label: "Business Type",
      value: orgDetails?.business_type || "Not Provided",
    },
    {
      label: "Business Email",
      value: orgDetails?.business_email || "Not Provided",
    },
    {
      label: "Business URL",
      value: orgDetails?.business_url || "Not Provided",
    },
    {
      label: "GEM Registration No",
      value: orgDetails?.gem_registration_no || "Not Provided",
    },
    { label: "GSTIN", value: orgAddress?.gstin || "Not Provided" },
    {
      label: "Registered Address",
      value: orgAddress
        ? `${orgAddress.flat_block_no || ""}, ${
            orgAddress.building_village || ""
          }, ${orgAddress.road_street || ""}, ${
            orgAddress.area_locallity || ""
          }, ${orgAddress.city || ""}, ${orgAddress.district || ""}, ${
            orgAddress.state || ""
          } - ${orgAddress.pincode || ""}`
        : "Not Provided",
    },
    {
      label: "Contact Number",
      value: orgAddress?.contact_number || "Not Provided",
    },
    {
      label: "Office Email",
      value: orgAddress?.office_email || "Not Provided",
    },
  ]);

  drawSection("3. Organization Overview", [
    {
      label: "PAN Number",
      value: vendorData.organization_overview?.[0]?.pan_no || "Not Provided",
    },
    {
      label: "Date of Incorporation",
      value:
        vendorData.organization_overview?.[0]?.date_of_incorporation ||
        "Not Provided",
    },
    {
      label: "GST Number",
      value: vendorData.organization_overview?.[0]?.gst_no || "Not Provided",
    },
    {
      label: "CIN",
      value: vendorData.organization_overview?.[0]?.cin || "Not Provided",
    },
    {
      label: "Geo Service Area (National)",
      value:
        vendorData.organization_overview?.[0]?.geo_service_area_national ||
        "Not Provided",
    },
    {
      label: "Geo Service Area (International)",
      value:
        vendorData.organization_overview?.[0]?.geo_service_area_international ||
        "Not Provided",
    },
    {
      label: "Key Customers",
      value: vendorData.organization_overview?.[0]?.key_customers
        ? Object.values(vendorData.organization_overview[0].key_customers).join(
            ", "
          )
        : "Not Provided",
    },
    {
      label: "Details of Services/Goods",
      value:
        vendorData.organization_overview?.[0]?.details_service_goods ||
        "Not Provided",
    },
    {
      label: "Quality Certificate",
      value: vendorData.organization_overview?.[0]?.quality_certification
        ? "Available"
        : "Not Provided",
    },
    {
      label: "Quality Certificate File Uploaded",
      value: vendorData.organization_overview?.[0]?.quality_certificate_path
        ? vendorData.organization_overview[0].quality_certificate_path
            .split("/")
            .pop()
        : "Not Provided",
    },

    {
      label: "NDA Document",
      value: vendorData.organization_overview?.[0]?.nda_path
        ? vendorData.organization_overview?.[0]?.nda_path.split("/").pop()
        : "Not Provided",
    },
  ]);
  const bank = vendorData.bank_details?.[0];
  drawSection("4. Organization Bank Details", [
    { label: "Bank Name", value: bank?.bank_name },
    { label: "Account Holder", value: bank?.account_holder_name },
    { label: "Account Number", value: bank?.bank_account_no },
    { label: "IFSC Code", value: bank?.ifsc_code },
    { label: "Bank Address", value: bank?.bank_address },
  ]);

  const msme = vendorData.msme_details?.[0];
  drawSection("5. MSME Details", [
    { label: "Udyam Reg. Number", value: msme?.udyam_reg_number },
    { label: "Mobile Number", value: msme?.mobile_number },
    { label: "Type of Activity", value: msme?.type_of_activity },
    { label: "Enterprise Type", value: msme?.enterprise_type },
    {
      label: "Eligible for MSE Benefit",
      value: msme?.eligible_mse_benefit ? "Yes" : "No",
    },
  ]);

  const checklistAnswers = vendorData.checklist_answers || [];
  let checklistItems = [];

  checklistAnswers.forEach((category) => {
    category.questions.forEach((question) => {
      const ans = question.answers;

      // Determine boolean-style answer
      const boolAnswer =
        ans?.que_bool_value === true
          ? "Yes"
          : ans?.que_bool_value === false
          ? "No"
          : "Not Answered";

      checklistItems.push({
        label: `(${category.category}) ${question.question || "Untitled"}`,
        value: `Answer: ${boolAnswer} | Weightage: ${question.weightage}`,
      });
    });
  });

  // 👇 Only checklist, no disclaimer
  drawSection("6. Checklist", checklistItems);

  const directors = vendorData.director_info || [];
  directors.forEach((director, index) => {
    drawSection(
      `7. Director Info ${directors.length > 1 ? `#${index + 1}` : ""}`,
      [
        { label: "Name", value: director?.name },
        { label: "DIN Number", value: director?.din_number },
        { label: "Mobile Number", value: director?.mobile_number },
        { label: "Email Address", value: director?.email_address },
        { label: "Is Primary", value: director?.is_primary ? "Yes" : "No" },
      ]
    );
  });

  const disclaimer = vendorData.disclaimer_info || [];
  disclaimer.forEach((disclaimer, index) => {
    drawSection(
      `8. Disclaimer Info ${disclaimer.length > 1 ? `#${index + 1}` : ""}`,
      [
        { label: "Name", value: disclaimer?.full_name || "N/A" },
        {
          label: "Disclaimer Date",
          value: disclaimer?.disclaimer_date || "N/A",
        },
        {
          label: "Terms And Conditions",
          value: (
            <Tooltip title={disclaimer?.terms_and_conditions || ""} arrow>
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 300,
                  cursor: "pointer",
                }}
              >
                {disclaimer?.terms_and_conditions || "N/A"}
              </Typography>
            </Tooltip>
          ),
        },
        {
          label: "Photo",
          value: disclaimer?.photo_path ? (
            <img
              src={`${config.apiUrl}${disclaimer.photo_path}`}
              alt="Vendor Photo"
              style={{ maxWidth: "150px", borderRadius: "8px" }}
            />
          ) : (
            "N/A"
          ),
        },
      ]
    );
  });

  pdf.save("vendor-details.pdf");
};
