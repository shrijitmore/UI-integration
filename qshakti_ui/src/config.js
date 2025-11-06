const dev = {
  // apiUrl: process.env.REACT_APP_API_URL || 'https://qshakti-dev.indi4.io/api',

  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:8000/",

  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:8000",

};
const prod = {
  apiUrl: process.env.REACT_APP_API_URL || "https://demo-qshakti.c4i4.org/api",
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default config;
