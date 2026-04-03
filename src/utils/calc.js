export const INVESTMENT = 6000;

export function formatSoles(n) {
  const rounded = Math.round(n);
  return 'S/ ' + Math.abs(rounded).toLocaleString('es-PE');
}

export function computeCalc({ servicePrice, margin, clientsPerMonth }) {
  const price = parseFloat(servicePrice) || 0;
  const marginFrac = parseFloat(margin) / 100;
  const clients = parseInt(clientsPerMonth, 10) || 0;

  const profitPerClient = price * marginFrac;
  const monthlyProfit = profitPerClient * clients;
  const yearOneProfit = monthlyProfit * 12 - INVESTMENT;

  let breakEvenMonth = null;
  if (monthlyProfit > 0) {
    const raw = Math.ceil(INVESTMENT / monthlyProfit);
    breakEvenMonth = raw <= 12 ? raw : null;
  }

  const cumMonth6 = monthlyProfit * 6 - INVESTMENT;
  const qualifiesCTA = cumMonth6 >= 0;

  const projection = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const cumulative = monthlyProfit * month - INVESTMENT;
    return { month, clients, monthlyProfit, cumulative };
  });

  return {
    profitPerClient,
    monthlyProfit,
    yearOneProfit,
    breakEvenMonth,
    qualifiesCTA,
    projection,
  };
}
