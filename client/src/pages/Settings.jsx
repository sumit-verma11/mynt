import { useEffect, useRef, useState } from 'react';
import { Settings as SettingsIcon, User, Mail, Bell, FileText, Shield, SlidersHorizontal, RefreshCw, Eye, EyeOff, CheckCircle, Smartphone, Copy, X, ChevronDown, LogOut } from 'lucide-react';

/* ── 2FA Setup Modal ─────────────────────────────────────────────── */
function TwoFAModal({ onClose, onEnable }) {
  const [step, setStep] = useState(1); // 1=scan, 2=verify, 3=done
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const secretKey = 'MYNT-SPJN-2FA7-X9KL';

  const copyKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verify = () => {
    if (code.length !== 6 || !/^\d+$/.test(code)) { setError('Enter a valid 6-digit code'); return; }
    setError('');
    setStep(3);
    setTimeout(() => { onEnable(); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-neutral-700 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-emerald-400" />
            <h2 className="text-base font-bold text-white">Enable Two-Factor Auth</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300 p-1"><X size={18} /></button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-5">
          {[1,2,3].map(s => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${step >= s ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <p className="text-sm text-neutral-300 mb-4">Scan this QR code with <span className="text-white font-medium">Google Authenticator</span> or <span className="text-white font-medium">Authy</span>.</p>
            {/* Mock QR code */}
            <div className="bg-white p-3 rounded-xl mb-4 mx-auto w-36 h-36 flex items-center justify-center">
              <div className="grid grid-cols-7 gap-0.5 w-full h-full">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} className={`rounded-[1px] ${[0,1,2,3,4,5,6,7,14,21,28,35,42,43,44,45,46,47,48,8,15,6,13,20,27,34,41,12,19,26,33,24].includes(i) ? 'bg-black' : 'bg-white'}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-neutral-500 text-center mb-3">Or enter this key manually:</p>
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 mb-5">
              <code className="text-xs text-emerald-400 flex-1 font-mono">{secretKey}</code>
              <button onClick={copyKey} className="text-neutral-500 hover:text-neutral-300">
                {copied ? <CheckCircle size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-2.5 bg-emerald-500 text-black rounded-lg text-sm font-semibold hover:bg-emerald-400 transition-colors">
              I've scanned the code →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-neutral-300 mb-4">Enter the 6-digit code from your authenticator app to confirm setup.</p>
            {error && <p className="text-xs text-red-400 mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[#171717] border border-neutral-700 text-neutral-200 text-2xl font-mono text-center rounded-lg px-3 py-3 focus:outline-none focus:border-emerald-500 mb-4 tracking-[0.5em]"
            />
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-sm hover:bg-neutral-700 transition-colors">Back</button>
              <button onClick={verify} disabled={code.length !== 6} className="flex-1 py-2.5 bg-emerald-500 text-black rounded-lg text-sm font-semibold hover:bg-emerald-400 disabled:opacity-40 transition-colors">Verify</button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
            <p className="text-white font-semibold">2FA Enabled!</p>
            <p className="text-xs text-neutral-500 mt-1">Your account is now more secure.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const tabs = [
  { id: 'account',   label: 'Account',          sub: 'Account Details',    Icon: User },
  { id: 'email',     label: 'Email Integration', sub: 'Email Connection',   Icon: Mail },
  { id: 'notifs',    label: 'Notifications',     sub: 'Notification Preferences', Icon: Bell },
  { id: 'reports',   label: 'Reports',           sub: 'Report Defaults',    Icon: FileText },
  { id: 'security',  label: 'Security',          sub: 'Password & Login',   Icon: Shield },
  { id: 'filters',   label: 'Default Filters',   sub: 'Dashboard Defaults', Icon: SlidersHorizontal },
];

const ALERT_LABELS = {
  missingData:       'Missing Data',
  newOutletDetected: 'New Outlet Detected',
  emailDisconnected: 'Email Disconnected',
  columnChange:      'Column Change',
  processingFailed:  'Processing Failed',
  marginDrop:        'Margin Drop',
  refundSpike:       'Refund Spike',
};

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-neutral-700'}`}
    >
      <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Select({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between bg-[#171717] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none hover:border-neutral-600 transition-colors"
      >
        <span>{value}</span>
        <ChevronDown size={13} className={`text-neutral-500 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 w-full mt-1 bg-[#171717] border border-neutral-700 rounded-lg shadow-2xl overflow-hidden">
          {options.map(o => (
            <button
              key={o}
              type="button"
              onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors ${o === value ? 'bg-emerald-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'}`}
            >
              {o === value ? <CheckCircle size={13} className="flex-shrink-0" /> : <span className="w-[13px] flex-shrink-0" />}
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Toast({ msg }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-neutral-200 shadow-2xl animate-fade-in">
      <CheckCircle size={14} className="text-emerald-400" />
      {msg}
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [textAuthEnabled, setTextAuthEnabled] = useState(false);

  const showMsg = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { setSettings(d); setLoading(false); });
  }, []);

  const save = async (endpoint, data) => {
    setSaving(true);
    const res = await fetch(`/api/settings/${endpoint}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const updated = await res.json();
    setSaving(false);
    showMsg('Changes saved successfully');
    return updated;
  };

  const reconnect = async (id) => {
    await fetch(`/api/settings/email/${id}/reconnect`, { method: 'POST' });
    setSettings(prev => ({
      ...prev,
      emailIntegration: prev.emailIntegration.map(e =>
        e.id === id ? { ...e, lastSync: new Date().toISOString() } : e
      ),
    }));
    showMsg('Email reconnected');
  };

  const changePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    setPwError('');
    const res = await fetch('/api/settings/security/password', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    });
    if (res.ok) {
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMsg('Password updated successfully');
    }
  };

  const toggleNotif = async (key, channel) => {
    const updated = {
      ...settings.notifications,
      [key]: { ...settings.notifications[key], [channel]: !settings.notifications[key][channel] },
    };
    setSettings(prev => ({ ...prev, notifications: updated }));
    await fetch('/api/settings/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
  };

  const timeAgo = (iso) => {
    const h = Math.floor((Date.now() - new Date(iso)) / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
    return `${Math.floor(h / 24)} day${Math.floor(h / 24) > 1 ? 's' : ''} ago`;
  };

  if (loading) return <div className="flex items-center justify-center h-full text-neutral-600">Loading...</div>;

  const { account, emailIntegration, notifications: notifPrefs, reports, defaultFilters } = settings;

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Account Details</h2>
            <p className="text-xs text-neutral-500 mb-5">Manage your business and contact information</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Company Name', key: 'companyName', type: 'text' },
                { label: 'Account Owner Name', key: 'ownerName', type: 'text' },
                { label: 'Phone Number', key: 'phone', type: 'tel' },
                { label: 'Email ID', key: 'email', type: 'email' },
                { label: 'GST Number', key: 'gstNumber', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs text-neutral-500 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={account[key]}
                    onChange={e => setSettings(prev => ({ ...prev, account: { ...prev.account, [key]: e.target.value } }))}
                    className="w-full bg-[#171717] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-600"
                  />
                </div>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-xs text-neutral-500 mb-1.5">Billing Address</label>
              <textarea
                rows={3}
                value={account.billingAddress}
                onChange={e => setSettings(prev => ({ ...prev, account: { ...prev.account, billingAddress: e.target.value } }))}
                className="w-full bg-[#171717] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-600 resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => save('account', account)}
                disabled={saving}
                className="px-5 py-2.5 bg-emerald-500 text-black rounded-lg text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        );

      case 'email':
        return (
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Email Integration</h2>
            <p className="text-xs text-neutral-500 mb-5">Payout emails are the core data source. Manage your Gmail connection here.</p>
            <h3 className="text-sm font-medium text-neutral-300 mb-3">Connected Emails</h3>
            <div className="border border-neutral-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-900/50 text-[11px] text-neutral-500 uppercase">
                    <th className="text-left px-4 py-2.5">Email</th>
                    <th className="text-left px-4 py-2.5">Platform</th>
                    <th className="text-left px-4 py-2.5">Status</th>
                    <th className="text-left px-4 py-2.5">Last Sync</th>
                    <th className="text-left px-4 py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {emailIntegration.map(e => (
                    <tr key={e.id} className="border-t border-neutral-800">
                      <td className="px-4 py-3 text-neutral-300 font-mono text-xs">{e.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${e.platform === 'Zomato' ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400'}`}>{e.platform}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {e.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 text-xs">{timeAgo(e.lastSync)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => reconnect(e.id)} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-emerald-400 transition-colors">
                          <RefreshCw size={12} /> Reconnect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'notifs':
        return (
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Notification Preferences</h2>
            <p className="text-xs text-neutral-500 mb-5">Choose where you receive each type of alert</p>
            <div className="border border-neutral-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-900/50 text-[11px] text-neutral-500 uppercase">
                    <th className="text-left px-4 py-3">Alert Type</th>
                    <th className="text-center px-4 py-3">In-App</th>
                    <th className="text-center px-4 py-3">Email</th>
                    <th className="text-center px-4 py-3">Push</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(notifPrefs).map(([key, val]) => (
                    <tr key={key} className="border-t border-neutral-800">
                      <td className="px-4 py-3 text-neutral-300">{ALERT_LABELS[key]}</td>
                      <td className="px-4 py-3 text-center"><Toggle checked={val.inApp} onChange={() => toggleNotif(key, 'inApp')} /></td>
                      <td className="px-4 py-3 text-center"><Toggle checked={val.email} onChange={() => toggleNotif(key, 'email')} /></td>
                      <td className="px-4 py-3 text-center"><Toggle checked={val.push} onChange={() => toggleNotif(key, 'push')} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Report Defaults</h2>
            <p className="text-xs text-neutral-500 mb-5">Set defaults for scheduled reports</p>
            <div className="bg-[#171717] border border-neutral-700 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-2">Default Report Type</label>
                  <Select
                    value={reports.defaultType}
                    onChange={v => setSettings(prev => ({ ...prev, reports: { ...prev.reports, defaultType: v } }))}
                    options={['Business Summary','Earnings Summary','Charges Summary','Refund Summary','Platform Comparison','Full Report']}
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-2">Default Format</label>
                  <Select
                    value={reports.defaultFormat}
                    onChange={v => setSettings(prev => ({ ...prev, reports: { ...prev.reports, defaultFormat: v } }))}
                    options={['PDF','Excel','CSV']}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-2">Default Send Method</label>
                <Select
                  value={reports.defaultSendMethod}
                  onChange={v => setSettings(prev => ({ ...prev, reports: { ...prev.reports, defaultSendMethod: v } }))}
                  options={['Email','WhatsApp','Download']}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => save('reports', reports)} disabled={saving} className="px-5 py-2.5 bg-emerald-500 text-black rounded-lg text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : 'Save Defaults'}
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Security Settings</h2>
            <p className="text-xs text-neutral-500 mb-5">Manage password, 2FA, and active sessions</p>
            <div className="bg-[#171717] border border-neutral-700 rounded-xl p-5 mb-4">
              <h3 className="text-sm font-semibold text-white mb-4">Change Password</h3>
              {pwError && <p className="text-xs text-red-400 mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{pwError}</p>}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPw.current ? 'text' : 'password'}
                      value={pwForm.currentPassword}
                      onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                      className="w-full bg-[#111111] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:border-neutral-600"
                    />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                      {showPw.current ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['new','confirm'].map(field => (
                    <div key={field}>
                      <label className="block text-xs text-neutral-500 mb-1.5">{field === 'new' ? 'New Password' : 'Confirm New Password'}</label>
                      <div className="relative">
                        <input
                          type={showPw[field] ? 'text' : 'password'}
                          value={pwForm[`${field}Password`]}
                          onChange={e => setPwForm(p => ({ ...p, [`${field}Password`]: e.target.value }))}
                          className="w-full bg-[#111111] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:border-neutral-600"
                        />
                        <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                          {showPw[field] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={changePassword} className="px-5 py-2.5 bg-emerald-500 text-black rounded-lg text-sm font-semibold hover:bg-emerald-400 transition-colors">
                Update Password
              </button>
            </div>
            <div className="bg-[#171717] border border-neutral-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Authentication</h3>

              {/* 2FA */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                <div>
                  <p className="text-sm text-neutral-300">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-neutral-600 mt-0.5">Add an extra layer of security</p>
                </div>
                <Toggle checked={twoFAEnabled} onChange={v => { if (v) setShow2FA(true); else { setTwoFAEnabled(false); showMsg('2FA disabled'); }}} />
              </div>

              {/* Text / SMS Auth */}
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm text-neutral-300">Text Message (SMS)</p>
                  <p className="text-xs text-neutral-600 mt-0.5">One-time password at each login</p>
                </div>
                <Toggle checked={textAuthEnabled} onChange={v => { setTextAuthEnabled(v); showMsg(v ? 'Text authentication enabled' : 'Text authentication disabled'); }} />
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-[#171717] border border-neutral-700 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">Active Sessions</h3>
                  <p className="text-xs text-neutral-500">Sign out from all other devices</p>
                </div>
                <button
                  onClick={() => showMsg('Logged out of all other devices')}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-700 text-neutral-300 rounded-lg text-xs hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  <LogOut size={12} />
                  Logout All Devices
                </button>
              </div>
            </div>
          </div>
        );

      case 'filters':
        return (
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Default Dashboard Filters</h2>
            <p className="text-xs text-neutral-500 mb-5">Applied automatically when you open any dashboard page</p>
            <div className="bg-[#171717] border border-neutral-700 rounded-xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-2">Default Brand</label>
                  <Select
                    value={defaultFilters.brand}
                    onChange={v => setSettings(prev => ({ ...prev, defaultFilters: { ...prev.defaultFilters, brand: v } }))}
                    options={['All Brands','Spice Junction','Curry Leaf','Tandoori Tales']}
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-2">Default Outlet</label>
                  <Select
                    value={defaultFilters.outlet}
                    onChange={v => setSettings(prev => ({ ...prev, defaultFilters: { ...prev.defaultFilters, outlet: v } }))}
                    options={['All Outlets','Koramangala','Indiranagar','HSR Layout','Whitefield','JP Nagar']}
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-2">Default Platform</label>
                  <Select
                    value={defaultFilters.platform}
                    onChange={v => setSettings(prev => ({ ...prev, defaultFilters: { ...prev.defaultFilters, platform: v } }))}
                    options={['All Platforms','Zomato','Swiggy']}
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-2">Default Date Range</label>
                  <Select
                    value={defaultFilters.dateRange}
                    onChange={v => setSettings(prev => ({ ...prev, defaultFilters: { ...prev.defaultFilters, dateRange: v } }))}
                    options={['Today','Yesterday','Last 7 Days','Last 30 Days','This Month','Last Month']}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => save('filters', defaultFilters)} disabled={saving} className="px-5 py-2.5 bg-emerald-500 text-black rounded-lg text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                <CheckCircle size={14} />
                {saving ? 'Saving...' : 'Save Defaults'}
              </button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="p-6">
      {show2FA && <TwoFAModal onClose={() => setShow2FA(false)} onEnable={() => { setTwoFAEnabled(true); showMsg('Two-factor authentication enabled!'); }} />}

      {toast && <Toast msg={toast} />}
      <div className="flex items-center gap-2 mb-2">
        <SettingsIcon size={20} className="text-emerald-400" />
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>
      <p className="text-sm text-neutral-500 ml-7 mb-6">Manage your account, integrations, and preferences</p>

      <div className="flex gap-6">
        {/* Tab Nav */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {tabs.map(({ id, label, sub, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${activeTab === id ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-300'}`}
            >
              <Icon size={16} className={activeTab === id ? 'text-emerald-400' : ''} />
              <div>
                <p className="text-sm font-medium leading-tight">{label}</p>
                <p className="text-[11px] text-neutral-600 leading-tight">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#111111] border border-neutral-800 rounded-2xl p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
