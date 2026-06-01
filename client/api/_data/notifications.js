import { v4 as uuidv4 } from 'uuid';

let notifications = [
  {
    id: '1',
    title: 'New Outlet Detected',
    description: 'New outlet detected in Zomato emails — Restaurant ID: 458721',
    priority: 'HIGH',
    type: 'System',
    platform: 'Zomato',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    actions: ['map_configure'],
  },
  {
    id: '2',
    title: 'Missing Data',
    description: 'Data not received for Swiggy — Outlet ID 458721 — 12 March',
    priority: 'HIGH',
    type: 'Data',
    platform: 'Swiggy',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    actions: ['retry_fetch', 'contact_support', 'ignore'],
  },
  {
    id: '3',
    title: 'Column Change Detected',
    description: 'Zomato payout email format changed. Data processing may be delayed.',
    priority: 'HIGH',
    type: 'Data',
    platform: 'Zomato',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    actions: ['acknowledge'],
  },
  {
    id: '4',
    title: 'Email Disconnected',
    description: 'Gmail access lost for business@restaurant.com. Reconnect to resume data ingestion.',
    priority: 'HIGH',
    type: 'System',
    platform: 'Gmail',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actions: ['reconnect_gmail'],
  },
  {
    id: '5',
    title: 'Margin Drop Alert',
    description: "Outlet 'HSR Layout' margin dropped by 8.2% compared to last week on Zomato.",
    priority: 'MEDIUM',
    type: 'Business',
    platform: 'Zomato',
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    actions: [],
  },
  {
    id: '6',
    title: 'Refund Spike Detected',
    description: 'Refunds for Koramangala outlet spiked to 12.3% — above 8% threshold.',
    priority: 'MEDIUM',
    type: 'Business',
    platform: 'Zomato',
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    actions: ['acknowledge'],
  },
  {
    id: '7',
    title: 'Processing Failed',
    description: 'Failed to process payout email from Swiggy for outlet 672819.',
    priority: 'HIGH',
    type: 'System',
    platform: 'Swiggy',
    read: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    actions: ['retry_fetch'],
  },
  {
    id: '8',
    title: 'New Outlet Detected',
    description: 'New outlet detected in Swiggy emails — Restaurant ID: 672819',
    priority: 'HIGH',
    type: 'System',
    platform: 'Swiggy',
    read: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    actions: ['map_configure'],
  },
  {
    id: '9',
    title: 'Weekly Report Ready',
    description: 'Your weekly Business Summary report is ready for download.',
    priority: 'LOW',
    type: 'System',
    platform: null,
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actions: ['download'],
  },
  {
    id: '10',
    title: 'AOV Drop Alert',
    description: 'Average Order Value dropped 5.2% across Indiranagar outlets this week.',
    priority: 'MEDIUM',
    type: 'Business',
    platform: 'Zomato',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    actions: [],
  },
];

const pool = [
  { title: 'New Order Milestone', description: 'Koramangala outlet crossed 500 orders this week on Zomato.', priority: 'LOW', type: 'Business', platform: 'Zomato', actions: [] },
  { title: 'Missing Data', description: 'Data not received for Zomato — Outlet ID 891023.', priority: 'HIGH', type: 'Data', platform: 'Zomato', actions: ['retry_fetch', 'contact_support', 'ignore'] },
  { title: 'Margin Drop Alert', description: "Outlet 'JP Nagar' margin dropped by 5.1% on Swiggy.", priority: 'MEDIUM', type: 'Business', platform: 'Swiggy', actions: [] },
  { title: 'Refund Spike Detected', description: 'Whitefield outlet refunds spiked to 9.8% — above 8% threshold.', priority: 'HIGH', type: 'Business', platform: 'Zomato', actions: ['acknowledge'] },
  { title: 'Column Change Detected', description: 'Swiggy payout email format updated. Processing may be delayed.', priority: 'HIGH', type: 'Data', platform: 'Swiggy', actions: ['acknowledge'] },
  { title: 'Email Reconnected', description: 'Gmail successfully reconnected for rahul@spicejunction.in.', priority: 'LOW', type: 'System', platform: 'Gmail', actions: [] },
];

export const getNotifications = () => notifications;

export const markRead = (id) => {
  const n = notifications.find(n => n.id === id);
  if (n) n.read = true;
  return n;
};

export const markAllRead = () => {
  notifications.forEach(n => (n.read = true));
  return notifications;
};

export const deleteNotification = (id) => {
  notifications = notifications.filter(n => n.id !== id);
};

export const addNotification = (n) => {
  notifications.unshift(n);
  if (notifications.length > 30) notifications = notifications.slice(0, 30);
  return n;
};

export const generateRandomNotification = () => {
  const tpl = pool[Math.floor(Math.random() * pool.length)];
  return addNotification({ ...tpl, id: uuidv4(), read: false, createdAt: new Date().toISOString() });
};
