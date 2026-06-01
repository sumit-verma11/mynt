let settings = {
  account: {
    companyName: 'Spice Junction Pvt. Ltd.',
    ownerName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul@spicejunction.in',
    gstNumber: '29AABCS1429B1ZS',
    billingAddress: '42, MG Road, Indiranagar\nBengaluru, Karnataka 560038',
  },
  emailIntegration: [
    { id: 'e1', email: 'rahul@spicejunction.in', platform: 'Zomato', status: 'Connected', lastSync: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
    { id: 'e2', email: 'rahul@spicejunction.in', platform: 'Swiggy', status: 'Connected', lastSync: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
  ],
  notifications: {
    missingData:        { inApp: true,  email: true,  push: true  },
    newOutletDetected:  { inApp: true,  email: false, push: true  },
    emailDisconnected:  { inApp: true,  email: true,  push: true  },
    columnChange:       { inApp: true,  email: true,  push: true  },
    processingFailed:   { inApp: true,  email: true,  push: true  },
    marginDrop:         { inApp: true,  email: false, push: false },
    refundSpike:        { inApp: true,  email: false, push: false },
  },
  reports: {
    defaultType: 'Business Summary',
    defaultFormat: 'PDF',
    defaultSendMethod: 'Email',
  },
  defaultFilters: {
    brand: 'All Brands',
    outlet: 'All Outlets',
    platform: 'All Platforms',
    dateRange: 'Last 7 Days',
  },
};

export const getSettings = () => settings;
export const updateAccount = (data) => { settings.account = { ...settings.account, ...data }; return settings.account; };
export const updateNotificationPrefs = (data) => { settings.notifications = { ...settings.notifications, ...data }; return settings.notifications; };
export const updateReports = (data) => { settings.reports = { ...settings.reports, ...data }; return settings.reports; };
export const updateFilters = (data) => { settings.defaultFilters = { ...settings.defaultFilters, ...data }; return settings.defaultFilters; };
export const reconnectEmail = (id) => {
  const email = settings.emailIntegration.find(e => e.id === id);
  if (email) email.lastSync = new Date().toISOString();
  return email;
};
