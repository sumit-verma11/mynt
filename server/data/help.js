export const categories = [
  { id: 'c1', name: 'Getting Started',     description: 'Setup, email connection',     count: 6 },
  { id: 'c2', name: 'Email Integration',   description: 'Gmail connection, sync issues', count: 8 },
  { id: 'c3', name: 'Outlet Mapping',      description: 'Mapping help',                count: 5 },
  { id: 'c4', name: 'Dashboard & Metrics', description: 'Understanding metrics',       count: 9 },
  { id: 'c5', name: 'Reports',             description: 'Scheduling reports',          count: 4 },
  { id: 'c6', name: 'Tokens',              description: 'Token usage',                 count: 3 },
  { id: 'c7', name: 'Billing',             description: 'Plans, invoices',             count: 7 },
  { id: 'c8', name: 'Data Issues',         description: 'Missing data',               count: 6 },
  { id: 'c9', name: 'Security',            description: 'Login, password',            count: 4 },
];

export const articles = [
  { id: 'a1', categoryId: 'c1', title: 'How to connect Gmail',                   description: 'Step-by-step guide to authorise Mynt to read your payout emails.',             popular: true },
  { id: 'a2', categoryId: 'c3', title: 'How outlets are counted',               description: 'Each Restaurant ID on Zomato or Swiggy counts as 1 outlet.',                    popular: true },
  { id: 'a3', categoryId: 'c4', title: 'How charges are calculated',            description: 'Commission, payment gateway, packaging, and platform fees broken down.',         popular: true },
  { id: 'a4', categoryId: 'c4', title: 'Why dashboard numbers differ from bank', description: 'Bank deposits net out TDS, refunds, and adjustments.',                          popular: true },
  { id: 'a5', categoryId: 'c4', title: 'How refund is calculated',              description: 'Refunds are deducted from gross sales and may include penalty charges.',          popular: true },
  { id: 'a6', categoryId: 'c5', title: 'How to schedule reports',               description: 'Set up daily, weekly, or monthly reports.',                                      popular: true },
  { id: 'a7', categoryId: 'c6', title: 'How tokens work',                       description: 'Tokens power AI Assistant queries and exports.',                                  popular: true },
  { id: 'a8', categoryId: 'c8', title: 'What to do if data is missing',         description: 'Most often caused by Gmail re-auth needed.',                                     popular: true },
  { id: 'a9', categoryId: 'c1', title: 'Getting started with Mynt',             description: 'Complete guide to setting up your Mynt account.',                               popular: false },
  { id: 'a10',categoryId: 'c2', title: 'Reconnecting Gmail',                    description: 'How to fix Gmail connection issues and re-authorize access.',                    popular: false },
  { id: 'a11',categoryId: 'c7', title: 'Understanding billing plans',           description: 'Difference between Monthly, Quarterly, and Yearly plans.',                      popular: false },
  { id: 'a12',categoryId: 'c9', title: 'Setting up 2FA',                        description: 'Enable two-factor authentication to secure your account.',                       popular: false },
];

let systemStatus = [
  { id: 's1', name: 'Email Fetch',        status: 'Working' },
  { id: 's2', name: 'Zomato Processing',  status: 'Delayed' },
  { id: 's3', name: 'Swiggy Processing',  status: 'Working' },
  { id: 's4', name: 'Report Generation',  status: 'Working' },
  { id: 's5', name: 'Notifications',      status: 'Working' },
  { id: 's6', name: 'AI Assistant',       status: 'Working' },
];

export const getSystemStatus = () => {
  // Simulate real-time changes on Zomato processing
  const z = systemStatus.find(s => s.id === 's2');
  if (z) z.status = Math.random() > 0.4 ? 'Delayed' : 'Working';
  return systemStatus;
};

export const submitTicket = (data) => ({
  id: `TKT-${Date.now()}`,
  ...data,
  status: 'Open',
  createdAt: new Date().toISOString(),
});
