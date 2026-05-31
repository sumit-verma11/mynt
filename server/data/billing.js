let billing = {
  plan: {
    status: 'active',
    type: 'Quarterly',
    startedAt: '2024-01-01',
    nextBilling: '2024-04-01',
    basePrice: 71928,
    discount: 10,
    outlets: 12,
    historicDataMonths: 12,
    tokenBalance: 182,
    tokenUsedMonth: 48,
    tokenRenewalDate: '1 Apr',
    tokenRenewalAmount: 50,
  },
  outlets: [
    { id: 'o1', restaurantId: '458721', platform: 'Zomato', name: 'Spice Junction - Koramangala', status: 'active', mappedAt: '2023-06-01' },
    { id: 'o2', restaurantId: '458722', platform: 'Swiggy', name: 'Spice Junction - Koramangala', status: 'active', mappedAt: '2023-06-01' },
    { id: 'o3', restaurantId: '458723', platform: 'Zomato', name: 'Spice Junction - Indiranagar', status: 'active', mappedAt: '2023-06-15' },
    { id: 'o4', restaurantId: '458724', platform: 'Swiggy', name: 'Spice Junction - Indiranagar', status: 'active', mappedAt: '2023-06-15' },
    { id: 'o5', restaurantId: '458725', platform: 'Zomato', name: 'Spice Junction - HSR', status: 'active', mappedAt: '2023-07-01' },
    { id: 'o6', restaurantId: '458726', platform: 'Swiggy', name: 'Spice Junction - HSR', status: 'active', mappedAt: '2023-07-01' },
    { id: 'o7', restaurantId: '672810', platform: 'Zomato', name: 'Curry Leaf - MG Road', status: 'active', mappedAt: '2023-08-01' },
    { id: 'o8', restaurantId: '672811', platform: 'Swiggy', name: 'Curry Leaf - MG Road', status: 'active', mappedAt: '2023-08-01' },
    { id: 'o9', restaurantId: '672812', platform: 'Zomato', name: 'Curry Leaf - Whitefield', status: 'active', mappedAt: '2023-09-01' },
    { id: 'o10', restaurantId: '672813', platform: 'Swiggy', name: 'Curry Leaf - Whitefield', status: 'active', mappedAt: '2023-09-01' },
    { id: 'o11', restaurantId: '672814', platform: 'Zomato', name: 'Tandoori Tales - JP Nagar', status: 'active', mappedAt: '2023-10-01' },
    { id: 'o12', restaurantId: '672815', platform: 'Swiggy', name: 'Tandoori Tales - JP Nagar', status: 'active', mappedAt: '2023-10-01' },
  ],
  newOutlets: [
    { id: 'n1', restaurantId: '458721', platform: 'Zomato', detectedAt: '2024-03-15', status: 'Not Active' },
    { id: 'n2', restaurantId: '672819', platform: 'Swiggy', detectedAt: '2024-03-12', status: 'Not Active' },
  ],
  tokenPacks: [
    { id: 'starter', name: 'Starter', tokens: 50, price: 500, pricePerToken: 10, popular: false },
    { id: 'growth', name: 'Growth', tokens: 150, price: 1200, pricePerToken: 8, popular: true },
    { id: 'pro', name: 'Pro', tokens: 400, price: 3000, pricePerToken: 7.5, popular: false },
    { id: 'business', name: 'Business', tokens: 1000, price: 6000, pricePerToken: 6, popular: false },
  ],
  invoices: [
    { id: 'inv1', date: '2024-01-01', plan: 'Quarterly · 12 mo data', outlets: 12, amount: 71928, invoiceNo: 'INV-2024-003', status: 'Paid' },
    { id: 'inv2', date: '2023-10-01', plan: 'Quarterly · 12 mo data', outlets: 11, amount: 65934, invoiceNo: 'INV-2023-014', status: 'Paid' },
    { id: 'inv3', date: '2023-07-01', plan: 'Quarterly · 6 mo data', outlets: 10, amount: 44955, invoiceNo: 'INV-2023-009', status: 'Paid' },
    { id: 'inv4', date: '2023-04-01', plan: 'Quarterly · 6 mo data', outlets: 8, amount: 38200, invoiceNo: 'INV-2023-005', status: 'Paid' },
  ],
};

export const getBilling = () => billing;

export const updatePlanType = (type) => {
  const discounts = { Monthly: 0, Quarterly: 10, Yearly: 20 };
  billing.plan.type = type;
  billing.plan.discount = discounts[type] ?? 0;
  return billing.plan;
};

export const updateHistoricData = (months) => {
  billing.plan.historicDataMonths = months;
  return billing.plan;
};

export const purchaseTokens = (packId) => {
  const pack = billing.tokenPacks.find(p => p.id === packId);
  if (pack) billing.plan.tokenBalance += pack.tokens;
  return billing.plan.tokenBalance;
};

export const activateOutlet = (id) => {
  const outlet = billing.newOutlets.find(o => o.id === id);
  if (outlet) outlet.status = 'Active';
  return outlet;
};
