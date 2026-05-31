import { useEffect, useRef, useState } from 'react';
import { HelpCircle, Search, Mail, MessageCircle, Phone, Clock, CheckCircle, AlertTriangle,
         ChevronRight, ChevronDown, Send, X, ExternalLink, BookOpen } from 'lucide-react';
import { useSocket } from '../context/SocketContext.jsx';

const STATUS_CONFIG = {
  Working:  { color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20', dot: 'bg-emerald-500' },
  Delayed:  { color: 'text-yellow-400',  bg: 'bg-yellow-500/15 border-yellow-500/20',   dot: 'bg-yellow-500 animate-pulse' },
  Down:     { color: 'text-red-400',     bg: 'bg-red-500/15 border-red-500/20',          dot: 'bg-red-500' },
};

const overallStatus = (statuses) => {
  if (statuses.some(s => s.status === 'Down'))    return { label: 'Major Outage',          color: 'text-red-400 bg-red-500/15 border-red-500/20' };
  if (statuses.some(s => s.status === 'Delayed')) return { label: 'Partial Disruption',    color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/20' };
  return                                                  { label: 'All Systems Operational', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' };
};

const ISSUE_TYPES = ['Account Access','Billing & Payment','Data Not Loading','Email Integration','Outlet Mapping','Report Generation','Other'];

const ARTICLE_CONTENT = {
  a1: 'Go to Settings → Email Integration → click "Connect Gmail". Authorise Mynt to read emails from Zomato and Swiggy. Mynt only reads payout-related emails and never sends or deletes anything.',
  a2: 'Each unique Restaurant ID on Zomato or Swiggy is counted as one outlet. If you have the same restaurant on both platforms, that is 2 outlets (one per platform). Brand sub-groups do not count separately.',
  a3: 'Platform charges include: Commission (18–22% of GOV), Payment Gateway fee (2%), Long Distance fee (if applicable), Government charges (GST/TDS), and Packaging fee. Effective charge % = Total Charges / GOV.',
  a4: 'Bank deposits = GOV − TDS − Refunds − Cancellations − Platform charges. Mynt shows GOV (gross order value) while your bank shows net settlement. Use the Earnings page to reconcile.',
  a5: 'Refunds = order value returned to customer. These are deducted from your GOV. Penalty charges may apply for high refund rates. View per-outlet refund rates on the Refunds page.',
  a6: 'Go to Reports → Add Schedule. Choose report type, format (PDF/Excel), frequency (daily/weekly/monthly), and delivery method (Email or WhatsApp). Token cost = 1 for email, 2 for WhatsApp.',
  a7: 'Tokens are used for AI Assistant queries that return tables or charts (text answers are free), and for report delivery via Email (1 token) or WhatsApp (2 tokens). Tokens renew monthly.',
  a8: 'Most missing data is caused by Gmail access expiring. Go to Settings → Email Integration → Reconnect your Gmail to restore data flow. Data will backfill within 2–4 hours.',
  a9: '1. Sign up at mynt.in  2. Connect Gmail (Settings → Email Integration)  3. Map your outlet IDs (Billing → View Mapping)  4. Wait 2–4 hours for initial data sync.',
  a10: 'Go to Settings → Email Integration → click "Reconnect" next to the disconnected email. Complete the Google OAuth flow. If issues persist, revoke Mynt access in Google Account settings and reconnect.',
  a11: 'Monthly: no discount, billed each month. Quarterly: 10% off, billed every 3 months. Yearly: 20% off, billed annually. You can switch plans anytime — changes take effect on your next billing date.',
  a12: 'Go to Settings → Security → Enable 2FA. Scan the QR code with Google Authenticator or Authy. Enter the 6-digit code to confirm. Once enabled, 2FA is required at every login.',
};

function CustomSelect({ value, onChange, options, placeholder }) {
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
        className="w-full flex items-center justify-between bg-[#171717] border border-neutral-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none hover:border-neutral-600 transition-colors"
      >
        <span className={value ? 'text-neutral-200' : 'text-neutral-600'}>{value || placeholder}</span>
        <ChevronDown size={13} className={`text-neutral-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
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

export default function HelpSupport() {
  const [categories, setCategories]       = useState([]);
  const [systemStatus, setSystemStatus]   = useState([]);
  const [allArticles, setAllArticles]     = useState([]);
  const [search, setSearch]               = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedCat, setSelectedCat]     = useState(null);
  const [catArticles, setCatArticles]     = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [ticket, setTicket] = useState({ name: 'Rahul Sharma', email: 'rahul@spicejunction.in', issueType: '', priority: 'Medium', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    Promise.all([
      fetch('/api/help/categories').then(r => r.json()),
      fetch('/api/help/status').then(r => r.json()),
      fetch('/api/help/articles').then(r => r.json()),
    ]).then(([cats, status, all]) => {
      setCategories(cats);
      setSystemStatus(status);
      setAllArticles(all);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (status) => setSystemStatus(status);
    socket.on('system:status', handler);
    return () => socket.off('system:status', handler);
  }, [socket]);

  useEffect(() => {
    if (!search.trim()) { setSearchResults(null); return; }
    const q = search.toLowerCase();
    setSearchResults(allArticles.filter(a =>
      a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    ));
  }, [search, allArticles]);

  const selectCategory = async (id) => {
    setSelectedCat(prev => (prev === id ? null : id));
    if (!catArticles[id]) {
      try {
        const arts = await fetch(`/api/help/articles?categoryId=${id}`).then(r => r.json());
        setCatArticles(prev => ({ ...prev, [id]: arts }));
      } catch {}
    }
  };

  const submitTicket = async () => {
    if (!ticket.issueType || !ticket.description.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/help/ticket', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ticket),
      });
      const data = await res.json();
      setSubmitted(data);
      setTicket(prev => ({ ...prev, issueType: '', description: '' }));
    } catch {}
    setSubmitting(false);
  };

  const overall = overallStatus(systemStatus);

  const contactItems = [
    { Icon: Mail,          label: 'EMAIL',    value: 'support@mynt.in',   href: 'mailto:support@mynt.in',             color: 'text-blue-400',    bg: 'bg-blue-500/10' },
    { Icon: MessageCircle, label: 'WHATSAPP', value: '+91 98765 00000',   href: 'https://wa.me/919876500000',         color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { Icon: Phone,         label: 'CALL',     value: '+91 98765 11111',   href: 'tel:+919876511111',                  color: 'text-purple-400',  bg: 'bg-purple-500/10' },
    { Icon: Clock,         label: 'HOURS',    value: '10 AM – 7 PM IST',  href: null,                                 color: 'text-orange-400',  bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="p-6">
      {/* Article modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedArticle(null)}>
          <div className="bg-[#111111] border border-neutral-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-4">
                <h3 className="text-base font-bold text-white leading-snug">{selectedArticle.title}</h3>
                <p className="text-sm text-neutral-400 mt-1">{selectedArticle.description}</p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white flex-shrink-0 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            {ARTICLE_CONTENT[selectedArticle.id] && (
              <p className="text-sm text-neutral-400 leading-relaxed">{ARTICLE_CONTENT[selectedArticle.id]}</p>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <HelpCircle size={20} className="text-emerald-400" />
        <h1 className="text-xl font-bold text-white">Help & Support</h1>
      </div>
      <p className="text-sm text-neutral-500 ml-7 mb-6">Find answers fast or reach out to our team.</p>

      {/* Knowledge Base Search */}
      <div className="bg-gradient-to-br from-neutral-900 to-[#0d1a12] border border-neutral-800 rounded-2xl p-6 mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> KNOWLEDGE BASE
        </span>
        <h2 className="text-xl font-bold text-white mb-4">How can we help you today?</h2>
        <div className="relative max-w-lg mx-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder='Try "refund", "email", "report"...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-neutral-600 placeholder-neutral-600"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
              <X size={14} />
            </button>
          )}
        </div>
        {searchResults !== null && (
          <div className="max-w-lg mx-auto mt-3 bg-[#111111] border border-neutral-700 rounded-xl overflow-hidden text-left shadow-2xl">
            {searchResults.length === 0 ? (
              <p className="px-4 py-4 text-sm text-neutral-500 text-center">No articles found for "{search}"</p>
            ) : (
              searchResults.map(a => (
                <div
                  key={a.id}
                  onClick={() => { setSearch(''); setSelectedArticle(a); }}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-800 cursor-pointer border-b border-neutral-800 last:border-0"
                >
                  <BookOpen size={14} className="text-neutral-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-200">{a.title}</p>
                    <p className="text-xs text-neutral-500">{a.description}</p>
                  </div>
                  <ExternalLink size={12} className="text-neutral-700 flex-shrink-0 mt-0.5" />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Help Categories */}
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-neutral-400" />
              <h3 className="text-sm font-semibold text-white">Help Categories</h3>
            </div>
            {selectedCat && (
              <button onClick={() => setSelectedCat(null)} className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Clear</button>
            )}
          </div>
          <div className="space-y-0.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
                  selectedCat === cat.id ? 'bg-neutral-800' : 'hover:bg-neutral-800/60'
                }`}
              >
                <div>
                  <p className={`text-sm ${selectedCat === cat.id ? 'text-white' : 'text-neutral-200'}`}>{cat.name}</p>
                  <p className="text-xs text-neutral-600">{cat.description}</p>
                </div>
                <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full flex-shrink-0">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Matching Articles */}
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Matching Articles</h3>
          {!selectedCat ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-neutral-700">Select a category to see articles</p>
            </div>
          ) : !catArticles[selectedCat] ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-neutral-600">Loading...</p>
            </div>
          ) : catArticles[selectedCat].length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-neutral-700">No articles found</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {catArticles[selectedCat].map(art => (
                <button
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="w-full flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-neutral-800 text-left transition-colors"
                >
                  <BookOpen size={14} className="text-neutral-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-200">{art.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{art.description}</p>
                  </div>
                  <ChevronRight size={14} className="text-neutral-600 flex-shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Contact Support */}
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={15} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Contact Support</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {contactItems.map(({ Icon, label, value, href, color, bg }) => {
              const inner = (
                <div className={`${bg} border border-neutral-800 rounded-xl p-3 flex items-center gap-3 h-full`}>
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className={color} />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wide">{label}</p>
                    <p className="text-xs text-neutral-300 font-medium">{value}</p>
                  </div>
                  {href && <ExternalLink size={11} className="text-neutral-700 ml-auto flex-shrink-0" />}
                </div>
              );
              return href ? (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  {inner}
                </a>
              ) : (
                <div key={label}>{inner}</div>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h3 className="text-sm font-semibold text-white">System Status</h3>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${overall.color}`}>
              {overall.label}
            </span>
          </div>
          <div className="space-y-2.5">
            {systemStatus.map(s => {
              const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.Working;
              return (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-300">{s.name}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-neutral-700 mt-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 animate-pulse" />
            Updates every 15 seconds
          </p>
        </div>
      </div>

      {/* Raise a Ticket */}
      <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Send size={15} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Raise a Ticket</h3>
        </div>
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
            <p className="text-white font-semibold mb-1">Ticket Submitted!</p>
            <p className="text-sm text-neutral-400 mb-1">Ticket ID: <span className="font-mono text-emerald-400">{submitted.id}</span></p>
            <p className="text-xs text-neutral-600 mb-4">Our team will respond within 4–8 business hours.</p>
            <button onClick={() => setSubmitted(null)} className="text-xs text-neutral-400 hover:text-neutral-200 underline">Submit another ticket</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">Name</label>
              <input value={ticket.name} onChange={e => setTicket(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-[#171717] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-600" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">Email</label>
              <input value={ticket.email} onChange={e => setTicket(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-[#171717] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-600" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">Issue Type <span className="text-red-400">*</span></label>
              <CustomSelect
                value={ticket.issueType}
                onChange={v => setTicket(p => ({ ...p, issueType: v }))}
                options={ISSUE_TYPES}
                placeholder="Select issue type"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1.5">Priority</label>
              <CustomSelect
                value={ticket.priority}
                onChange={v => setTicket(p => ({ ...p, priority: v }))}
                options={['Low', 'Medium', 'High']}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-neutral-500 mb-1.5">Description <span className="text-red-400">*</span></label>
              <textarea rows={4} placeholder="Describe the issue in detail..." value={ticket.description}
                onChange={e => setTicket(p => ({ ...p, description: e.target.value }))}
                className="w-full bg-[#171717] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-600 resize-none placeholder-neutral-700" />
            </div>
            <div className="col-span-2 flex justify-end">
              <button
                onClick={submitTicket}
                disabled={submitting || !ticket.issueType || !ticket.description.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-black rounded-lg text-sm font-semibold hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
                {submitting ? 'Submitting…' : 'Submit Ticket'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
