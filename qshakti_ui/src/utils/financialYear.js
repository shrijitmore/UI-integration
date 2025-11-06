function getFinancialYears() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  const currentFYStart = currentMonth >= 4 ? currentYear : currentYear - 1;

  const financialYears = [];

  for (let i = 4; i > 0; i--) {
    const start = currentFYStart - i;
    const end = start + 1;
    financialYears.push(`${start}-${end}`);
  }

  for (let i = 0; i <= 0; i++) {
    const start = currentFYStart + i;
    const end = start + 1;
    financialYears.push(`${start}-${end}`);
  }

  return financialYears;
}
export default getFinancialYears;
