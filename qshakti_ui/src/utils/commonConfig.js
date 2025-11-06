export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Accepts valid email addresses (e.g., john.doe@example.com)

export const MOBILE_REGEX = /^[6-9]\d{9}$/;
// Accepts Indian 10-digit mobile numbers starting from 6–9

export const GST_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
// Accepts valid GST numbers (15-digit, alphanumeric)

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
// Accepts valid PAN numbers (ABCDE1234F)

export const WEBADDRESS_REGEX =
  /^https:\/\/(?:[\w-]+\.)+[a-zA-Z]{2,}(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
// Accepts HTTPS URLs only (e.g., https://example.com/path)

export const GEM_REGISTRATION_12DIGIT_ALPHA_NUM_REGEX = /^[A-Za-z0-9]{16}$/;
// Accepts 12-character alphanumeric GeM registration IDs

export const GSTIN_NUMERIC_10DIGIT_REGEX = /^[A-Za-z0-9]{15}$/;
// Accepts 10-digit numeric GSTIN format

export const PIN_CODE_REGEX = /^[1-9][0-9]{5}$/;
// Accepts Indian 6-digit PIN codes

export const NAME_REGEX = /^[A-Za-z\s]+$/;
// Accepts only alphabets and spaces (e.g., John Doe)

export const UDYAM_REG_NUMBER = /^\d{19}$/;
// Accepts 10-digit numeric Udyam registration

export const UDYAM_REG_NUMBER_MSME = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character

export const AADHAAR_REGEX = /^\d{4}\s?\d{4}\s?\d{4}$/;
// Accepts Aadhaar numbers (123456789012 or 1234 5678 9012)

export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
// Accepts valid IFSC codes (e.g., SBIN0123456)

export const VEHICLE_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
// Accepts Indian vehicle numbers (e.g., MH12AB1234)

export const DL_REGEX = /^[A-Z]{2}[0-9]{2} ?[0-9]{11}$/;
// Accepts Driving License numbers (e.g., MH14 20110012345)

export const PASSPORT_REGEX = /^[A-PR-WY][0-9]{7}$/;
// Accepts Passport numbers (e.g., A1234567)

export const VOTER_ID_REGEX = /^[A-Z]{3}[0-9]{7}$/;
// Accepts Voter ID numbers (e.g., XYZ1234567)

export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9 ]+$/;

//validation messages
export const EMAIL_VALIDATION_MESSAGE = "Please enter a valid email address";
export const MOBILE_VALIDATION_MESSAGE =
  "Please enter a valid 10-digit phone number";
export const PAN_VALIDATION_MESSAGE = "Invalid PAN number";
export const GST_VALIDATION_MESSAGE = "Invalid GST number";
export const WEBADDRESS_VALIDATION_MESSAGE =
  "Please enter a valid Website Address starting with https://";
export const GSTIN_VALIDATION_MESSAGE =
  "Please enter GSTIN number it must be a 15-digit alphanumeric value";
export const PINCODE_VALIDATION_MESSAGE =
  "Please enter a valid 6-digit PIN Code";
export const GEM_REGISTRATION_NO_VALIDATION_MESSAGE =
  "Please enter correct GeM Reg. No. it must be a 16-digit alphanumeric value";
export const NAME_VALIDATION_MESSAGE = "Please enter correct name ";
export const UDYAM_REG_NUMBER_VALIDATION_MESSAGE = "Please enter 19 digit no";
export const UDYAM_REG_NUMBER_VALIDATION_MESSAGE_MSME =
  " Invalid Udyam Number. Format should be UDYAM-XX-00-0000000.";
export const ALPHANUMERIC_VALIDATION_MESSAGE =
  "Only alphanumeric characters are allowed.";
