import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Bell, Settings, Database, TrendingUp, AlertTriangle, MapPin, RefreshCw,
  Mail, X, CheckCircle, Download, Wifi, ChevronRight, CreditCard, Building2,
  Store, Sparkles, Plus, Clock,
} from 'lucide-react';
import { useSocket } from '../context/SocketContext.jsx';

const PRIORITY_ICON_BG = {
  HIGH:   'bg-red-500',
  MEDIUM: 'bg-orange-500',
  LOW:    'bg-emerald-500',
};

const PRIORITY_BADGE = {
  HIGH:   'bg-red-500/15 text-red-400 border border-red-500/20',
  MEDIUM: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
  LOW:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
};

const TYPE_ICON = {
  System:   Settings,
  Data:     Database,
  Business: TrendingUp,
};

const PLATFORM_COLORS = {
  Zomato: 'bg-red-500/15 text-red-400',
  Swiggy: 'bg-orange-500/15 text-orange-400',
  Gmail:  'bg-blue-500/15 text-blue-400',
};

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 shadow-2xl max-w-sm">
      <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      <p className="text-sm text-neutral-200">{message}</p>
      <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300 ml-2"><X size={14} /></button>
    </div>
  );
}

/* ── Custom select used in modals ───────────────────────────────── */
function MSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const opts = options.map(o => typeof o === 'string' ? { value: o, label: o, icon: null } : o);
  const sel = opts.find(o => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between bg-neutral-900 border border-neutral-600 text-sm rounded-xl px-4 py-3.5 hover:border-neutral-500 transition-colors focus:outline-none">
        <div className="flex items-center gap-2">
          {sel?.icon && <sel.icon size={14} className="text-neutral-300 flex-shrink-0" />}
          <span className={sel ? 'text-white font-semibold' : 'text-neutral-400'}>{sel ? sel.label : placeholder}</span>
        </div>
        <ChevronDown size={14} className={`text-neutral-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
          {opts.map((o, i) => o.special ? (
            <button key={i} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left text-emerald-400 hover:bg-neutral-800 transition-colors border-t border-neutral-800">
              <Plus size={13} className="flex-shrink-0" />
              {o.label}
            </button>
          ) : (
            <button key={i} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left transition-colors ${o.value === value ? 'bg-emerald-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'}`}>
              {o.icon && <o.icon size={14} className={o.value === value ? 'text-white' : 'text-neutral-400'} />}
              {!o.icon && o.value === value && <CheckCircle size={13} className="flex-shrink-0" />}
              {!o.icon && o.value !== value && <span className="w-[13px]" />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Map & Configure 3-step modal ───────────────────────────────── */
const BRANDS = ['Burger Junction', 'Pizza Palace', 'Wok & Roll', 'South Spice', 'Café Mocha'];
const GROUPS = ['Bangalore South', 'Bangalore North', 'All Outlets', 'Premium Outlets'];
const PLANS = [
  { id: 'Starter', price: 499, features: ['Basic analytics', 'Email reports', '30-day data retention'] },
  { id: 'Growth',  price: 999, features: ['Advanced analytics', 'AI insights', '90-day retention', 'Compare module'], popular: true },
  { id: 'Pro',    price: 1999, features: ['Everything in Growth', 'Unlimited retention', 'Priority support', 'Custom reports'] },
];

function Stepper({ step }) {
  const steps = [
    { label: 'Review',        Icon: Store },
    { label: 'Map Outlet',    Icon: MapPin },
    { label: 'Activate Plan', Icon: CreditCard },
  ];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={s.label} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={13} className="text-neutral-600 flex-shrink-0" />}
            {done ? (
              <span className="flex items-center gap-1 text-xs text-neutral-200">
                <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" /> {s.label}
              </span>
            ) : active ? (
              <span className="flex items-center gap-1.5 bg-emerald-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                <s.Icon size={12} /> {s.label}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                <s.Icon size={12} /> {s.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MapConfigureModal({ notification: notif, onClose }) {
  const [step, setStep] = useState(1);
  const restaurantId = notif.description.match(/Restaurant ID: (\d+)/)?.[1] || '458721';
  const platform = notif.platform || 'Zomato';
  const [outletName, setOutletName] = useState(`Outlet ${restaurantId}`);
  const [brand, setBrand] = useState('');
  const [group, setGroup] = useState('');
  const [plan, setPlan] = useState('Growth');

  const brandOpts = [
    ...BRANDS.map(b => ({ value: b, label: b, icon: Building2 })),
    { value: '__new__', label: 'Create new brand', special: true },
  ];
  const groupOpts = GROUPS.map(g => ({ value: g, label: g }));
  const selectedPlan = PLANS.find(p => p.id === plan) || PLANS[1];

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <Stepper step={step} />
          {step < 4 && (
            <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300 flex-shrink-0 -mt-1"><X size={18} /></button>
          )}
        </div>

        {/* Step 1 — Review */}
        {step === 1 && (
          <div>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <Sparkles size={26} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">New Outlet Detected</h3>
              <p className="text-sm text-neutral-400">A new restaurant was found in your {platform} emails</p>
            </div>
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden mb-4">
              {[
                { label: 'Restaurant ID', value: restaurantId },
                { label: 'Platform', value: <span className={`text-xs px-2.5 py-1 rounded-full ${platform === 'Zomato' ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400'}`}>{platform}</span> },
                { label: 'Detected On', value: 'March 15, 2024' },
                { label: 'Location', value: 'HSR Layout, Bangalore' },
                { label: 'Estimated Revenue', value: <span className="text-emerald-400 font-semibold flex items-center gap-1"><TrendingUp size={13} /> ₹2.4L / month</span> },
              ].map(({ label, value }, i) => (
                <div key={label} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-neutral-800' : ''}`}>
                  <span className="text-sm text-neutral-500">{label}</span>
                  <span className="text-sm text-white">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-6">
              <p className="text-sm text-emerald-300">
                <span className="font-semibold">💡 Revenue opportunity:</span> Mapping this outlet enables payout tracking, margin analysis, and refund insights. Most users see ROI within 2 weeks.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button onClick={onClose} className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Decide Later</button>
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
                Continue <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Map Outlet */}
        {step === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={18} className="text-emerald-400" />
              <h3 className="text-base font-bold text-white">Map Outlet</h3>
            </div>
            <p className="text-sm text-neutral-500 mb-5">Assign this outlet to a brand and group for organized tracking</p>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Outlet Name</label>
                <input value={outletName} onChange={e => setOutletName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-600 text-white font-semibold text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-neutral-500 placeholder-neutral-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Brand <span className="text-red-400">*</span></label>
                <MSelect value={brand} onChange={setBrand} options={brandOpts} placeholder="Select a brand" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Group <span className="text-neutral-500 font-normal text-xs">(optional)</span></label>
                <MSelect value={group} onChange={setGroup} options={groupOpts} placeholder="Select a group" />
              </div>
            </div>
            <div className="flex items-center justify-between bg-neutral-900 border border-neutral-600 rounded-xl px-4 py-3.5 mb-6">
              <span className="text-sm text-neutral-400">Restaurant ID</span>
              <span className="text-sm text-white font-semibold">{restaurantId} · <span className={`text-xs px-2 py-0.5 rounded-full ${platform === 'Zomato' ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400'}`}>{platform}</span></span>
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => setStep(1)} className="text-sm text-neutral-300 hover:text-white transition-colors font-medium">Back</button>
              <button onClick={() => setStep(3)} disabled={!brand}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 disabled:opacity-40 transition-colors">
                Continue to Plan <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Activate Plan */}
        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard size={18} className="text-emerald-400" />
              <h3 className="text-base font-bold text-white">Activate Plan for This Outlet</h3>
            </div>
            <p className="text-sm text-neutral-500 mb-5">Each outlet requires an active plan to enable data processing</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PLANS.map(p => (
                <button key={p.id} onClick={() => setPlan(p.id)}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all ${plan === p.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'}`}>
                  {p.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">POPULAR</span>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-white">{p.id}</span>
                    {plan === p.id && <CheckCircle size={14} className="text-emerald-400" />}
                  </div>
                  <p className="text-lg font-bold text-white mb-3">₹{p.price.toLocaleString('en-IN')}<span className="text-xs text-neutral-400 font-normal">/mo</span></p>
                  <ul className="space-y-1.5">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-neutral-400">
                        <CheckCircle size={11} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden mb-6">
              {[
                { label: 'Outlet',           value: outletName },
                { label: 'Brand · Group',    value: `${brand}${group ? ' · ' + group : ''}` },
                { label: <span className="font-semibold text-white">Today's charge</span>, value: <span className="text-emerald-400 font-semibold">₹{selectedPlan.price.toLocaleString('en-IN')}/mo</span> },
              ].map(({ label, value }, i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-neutral-800' : ''}`}>
                  <span className="text-sm text-neutral-500">{label}</span>
                  <span className="text-sm text-neutral-300">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => setStep(2)} className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">Back</button>
              <button onClick={() => setStep(4)}
                className="px-5 py-2.5 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
                Activate Plan
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
              <CheckCircle size={32} className="text-black" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Outlet Activated</h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-xs mx-auto">
              Outlet {restaurantId} has been mapped to{' '}
              <span className="text-emerald-400 font-semibold">{brand}</span> on the{' '}
              <span className="text-emerald-400 font-semibold">{plan}</span> plan. Data ingestion will begin within 24 hours.
            </p>
            <button onClick={onClose}
              className="px-6 py-2.5 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Contact Support modal ──────────────────────────────────────── */
function ContactSupportModal({ notification: notif, onClose }) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!message.trim()) return;
    setSent(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white mb-0.5">Contact Support</h3>
            <p className="text-xs text-neutral-500">We'll respond within 4–8 business hours</p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300"><X size={18} /></button>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
            <p className="text-white font-semibold">Message Sent</p>
            <p className="text-xs text-neutral-500 mt-1">Our team will reach out shortly.</p>
          </div>
        ) : (
          <>
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-neutral-500 mb-0.5">Regarding</p>
              <p className="text-sm text-neutral-300 font-medium">{notif.title}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{notif.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { Icon: Mail,  label: 'Email',     value: 'support@mynt.in' },
                { Icon: Wifi,  label: 'WhatsApp',  value: '+91 98765 00000' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="bg-neutral-900 border border-neutral-700 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                    <Icon size={14} className="text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wide">{label}</p>
                    <p className="text-xs text-neutral-300">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-xs text-neutral-500 mb-1.5">Describe your issue</label>
              <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Tell us more about the problem..."
                className="w-full bg-neutral-900 border border-neutral-700 text-neutral-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-neutral-600 resize-none placeholder-neutral-700" />
            </div>
            <button onClick={send} disabled={!message.trim()}
              className="w-full py-2.5 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 disabled:opacity-40 transition-colors">
              Send Message
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Action button ──────────────────────────────────────────────── */
function ActionButton({ action, onClick }) {
  const configs = {
    map_configure:   { label: 'Map & Configure', className: 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30', Icon: MapPin },
    retry_fetch:     { label: 'Retry Fetch',     className: 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30', Icon: RefreshCw },
    contact_support: { label: 'Contact Support', className: 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 border border-neutral-600',       Icon: Mail },
    ignore:          { label: 'Ignore',          className: 'bg-transparent text-neutral-500 hover:text-neutral-300 border border-neutral-700',         Icon: X },
    acknowledge:     { label: 'Acknowledge',     className: 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30', Icon: CheckCircle },
    reconnect_gmail: { label: 'Reconnect Gmail', className: 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30', Icon: RefreshCw },
    download:        { label: 'Download',        className: 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30', Icon: Download },
  };
  const { label, className, Icon } = configs[action] || {};
  if (!label) return null;
  return (
    <button onClick={() => onClick(action)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${className}`}>
      <Icon size={12} />
      {label}
    </button>
  );
}

/* ── Notification card ──────────────────────────────────────────── */
function NotificationCard({ notification: n, onAction }) {
  const IconComp = TYPE_ICON[n.type] || Bell;
  const iconBg   = PRIORITY_ICON_BG[n.priority]  || 'bg-neutral-600';
  const badge    = PRIORITY_BADGE[n.priority]     || PRIORITY_BADGE.LOW;

  return (
    <div className={`bg-[#1a1a1a] border rounded-xl p-5 transition-all ${n.read ? 'border-neutral-800 opacity-70' : 'border-neutral-700/60'}`}>
      <div className="flex items-start gap-4">
        {/* Colored icon square */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <IconComp size={18} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {!n.read && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${iconBg}`} />}
            <span className="text-sm font-semibold text-neutral-100">{n.title}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${badge}`}>{n.priority}</span>
          </div>
          <p className="text-sm text-neutral-400 mb-2 leading-relaxed">{n.description}</p>
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-neutral-500">
            <Clock size={11} className="flex-shrink-0" />
            <span>{timeAgo(n.createdAt)}</span>
            {n.type && <><span className="text-neutral-700">·</span><span>{n.type}</span></>}
            {n.platform && <><span className="text-neutral-700">·</span><span>{n.platform}</span></>}
          </div>
          {n.actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {n.actions.map(a => <ActionButton key={a} action={a} onClick={(act) => onAction(n.id, act, n)} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────── */
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [readFilter, setReadFilter]       = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter]       = useState('All');
  const [search, setSearch]               = useState('');
  const [toast, setToast]                 = useState(null);
  const [mapModal, setMapModal]           = useState(null);
  const [contactModal, setContactModal]   = useState(null);
  const { socket } = useSocket();

  const showToast = useCallback((msg) => setToast(msg), []);

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => { setNotifications(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew     = (n) => { setNotifications(p => [n, ...p]); showToast(`New: ${n.title}`); };
    const onUpdate  = (n) => setNotifications(p => p.map(x => x.id === n.id ? n : x));
    const onAllRead = ()  => setNotifications(p => p.map(n => ({ ...n, read: true })));
    const onDeleted = (id)=> setNotifications(p => p.filter(n => n.id !== id));
    socket.on('notification:new',      onNew);
    socket.on('notification:update',   onUpdate);
    socket.on('notification:all-read', onAllRead);
    socket.on('notification:deleted',  onDeleted);
    return () => {
      socket.off('notification:new',      onNew);
      socket.off('notification:update',   onUpdate);
      socket.off('notification:all-read', onAllRead);
      socket.off('notification:deleted',  onDeleted);
    };
  }, [socket, showToast]);

  const markRead = async (id) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'PUT' });
    setNotifications(p => p.map(n => ({ ...n, read: true })));
  };

  const handleAction = async (id, action, notif) => {
    if (action === 'map_configure') { setMapModal(notif); await markRead(id); return; }
    if (action === 'contact_support') { setContactModal(notif); await markRead(id); return; }
    if (action === 'ignore') {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(p => p.filter(n => n.id !== id)); return;
    }
    await markRead(id);
    showToast(`Done: ${action.replace(/_/g, ' ')}`);
  };

  const filtered = notifications.filter(n => {
    if (readFilter === 'Unread' && n.read)   return false;
    if (readFilter === 'Read'   && !n.read)  return false;
    if (priorityFilter !== 'All' && n.priority !== priorityFilter.toUpperCase()) return false;
    if (typeFilter !== 'All'    && n.type !== typeFilter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) &&
        !n.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unread = notifications.filter(n => !n.read).length;
  const stats = [
    { label: 'Total',         value: notifications.length,                                  Icon: Bell },
    { label: 'High Priority', value: notifications.filter(n => n.priority === 'HIGH').length, Icon: AlertTriangle },
    { label: 'Business',      value: notifications.filter(n => n.type === 'Business').length, Icon: TrendingUp },
    { label: 'System',        value: notifications.filter(n => n.type === 'System').length,   Icon: Settings },
  ];

  const FilterChip = ({ value, current, onChange }) => (
    <button onClick={() => onChange(value)}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${current === value ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-300'}`}>
      {value}
    </button>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast        && <Toast message={toast} onClose={() => setToast(null)} />}
      {mapModal     && <MapConfigureModal notification={mapModal} onClose={() => setMapModal(null)} />}
      {contactModal && <ContactSupportModal notification={contactModal} onClose={() => setContactModal(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={20} className="text-emerald-400" />
            <h1 className="text-xl font-bold text-white">Notifications</h1>
          </div>
          <p className="text-sm text-neutral-500">Business alerts, data updates, and system events</p>
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && (
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-neutral-700/60 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-neutral-400" />
              <span className="text-xs text-neutral-300 font-medium">{unread} unread</span>
            </div>
          )}
          <button onClick={markAllRead}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-neutral-700/60 text-sm text-neutral-300 hover:bg-neutral-700 transition-colors">
            <CheckCircle size={14} /> Mark all read
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="bg-[#1a1a1a] border border-neutral-700/60 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-700/40 flex items-center justify-center">
              <Icon size={16} className="text-neutral-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-neutral-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-neutral-700/60 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1 bg-neutral-900 rounded-full p-1">
            {['All','Unread','Read'].map(v => <FilterChip key={v} value={v} current={readFilter} onChange={setReadFilter} />)}
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>PRIORITY:</span>
            <div className="flex items-center gap-1 bg-neutral-900 rounded-full p-1">
              {['All','High','Medium','Low'].map(v => <FilterChip key={v} value={v} current={priorityFilter} onChange={setPriorityFilter} />)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>TYPE:</span>
            <div className="flex items-center gap-1 bg-neutral-900 rounded-full p-1">
              {['All','Business','Data','System'].map(v => <FilterChip key={v} value={v} current={typeFilter} onChange={setTypeFilter} />)}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <input type="text" placeholder="Search notifications..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-600" />
        </div>
      </div>

      {/* List */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-neutral-300">
          {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>
      {loading ? (
        <div className="text-center py-16 text-neutral-600">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={32} className="text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500">No notifications match your filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => (
            <NotificationCard key={n.id} notification={n} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  );
}
