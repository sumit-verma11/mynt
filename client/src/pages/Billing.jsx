import { useEffect, useRef, useState } from 'react';
import { CreditCard, Plus, Minus, Download, CheckCircle, Calendar, Zap,
         Building2, Clock, X, MapPin, AlertCircle, ExternalLink, Link2,
         ChevronDown, RotateCcw } from 'lucide-react';
import { useSocket } from '../context/SocketContext.jsx';

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: n % 1 !== 0 ? 1 : 0 })}`;

function BSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const opts = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);
  const sel = opts.find(o => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between bg-[#171717] border border-neutral-700 text-sm rounded-lg px-3 py-2.5 hover:border-neutral-600 transition-colors focus:outline-none">
        <span className={sel ? 'text-neutral-200' : 'text-neutral-600'}>{sel ? sel.label : placeholder}</span>
        <ChevronDown size={13} className={`text-neutral-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 w-full mt-1 bg-[#171717] border border-neutral-700 rounded-lg shadow-2xl overflow-hidden">
          {placeholder && <button type="button" onClick={() => { onChange(''); setOpen(false); }} className="w-full px-3 py-2.5 text-sm text-left text-neutral-600 hover:bg-neutral-800 transition-colors">{placeholder}</button>}
          {opts.map(o => (
            <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors ${o.value === value ? 'bg-emerald-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'}`}>
              {o.value === value ? <CheckCircle size={13} className="flex-shrink-0" /> : <span className="w-[13px] flex-shrink-0" />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Shared Payment Modal ─────────────────────────────────────── */
function PaymentModal({ title, subtitle, boxLabel, amount, onClose, onSuccess }) {
  const [step, setStep]         = useState(1); // 1=method 2=details 3=processing 4=success
  const [payMethod, setPayMethod] = useState('UPI');
  const [upiId, setUpiId]       = useState('');
  const [cardNo, setCardNo]     = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv]   = useState('');
  const [bank, setBank]         = useState('');
  const [error, setError]       = useState('');

  const methods = [
    { id: 'UPI',        label: 'UPI',                 sub: 'GPay, PhonePe, Paytm',   Icon: Zap },
    { id: 'Card',       label: 'Credit / Debit Card',  sub: 'Visa, Mastercard, Rupay', Icon: CreditCard },
    { id: 'NetBanking', label: 'Net Banking',          sub: 'All major banks',         Icon: Building2 },
    { id: 'AutoDebit',  label: 'Auto Debit',           sub: 'Recurring mandate',       Icon: RotateCcw },
  ];
  const banks = ['HDFC Bank','ICICI Bank','SBI','Axis Bank','Kotak Mahindra','Yes Bank'];

  const validate = () => {
    setError('');
    if (payMethod === 'UPI'  && !upiId.includes('@'))                      { setError('Enter a valid UPI ID (e.g. user@okhdfc)'); return false; }
    if (payMethod === 'Card' && cardNo.replace(/\s/g,'').length < 16)      { setError('Enter a valid 16-digit card number'); return false; }
    if (payMethod === 'Card' && !cardExpiry.match(/^\d{2}\/\d{2}$/))       { setError('Enter expiry as MM/YY'); return false; }
    if (payMethod === 'Card' && cardCvv.length < 3)                        { setError('Enter a valid CVV'); return false; }
    if (payMethod === 'NetBanking' && !bank)                               { setError('Please select a bank'); return false; }
    return true;
  };

  const pay = async () => {
    if (!validate()) return;
    setStep(3);
    await new Promise(r => setTimeout(r, 2200));
    setStep(4);
    onSuccess?.();
  };

  const AmountBox = () => (
    <div className="bg-[#1a1a1a] border border-neutral-700 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-0.5">{boxLabel}</p>
        <p className="text-sm font-medium text-neutral-300">Amount due</p>
      </div>
      <p className="text-2xl font-bold text-white">₹ {fmt(amount)}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#171717] border border-neutral-700 rounded-2xl p-5 w-full max-w-md shadow-2xl relative">
        {step !== 3 && (
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-300 p-1 z-10"><X size={18} /></button>
        )}

        {/* Header */}
        {step !== 4 && (
          <div className="mb-1">
            <div className="flex items-center gap-2 mb-0.5">
              <CreditCard size={16} className="text-emerald-400" />
              <h2 className="text-base font-bold text-white">{title}</h2>
            </div>
            <p className="text-xs text-neutral-500">{subtitle}</p>
          </div>
        )}

        {/* Step 1 — Payment method */}
        {step === 1 && (
          <div className="mt-4">
            <AmountBox />
            <p className="text-sm font-medium text-neutral-300 mb-3">Choose payment method</p>
            <div className="space-y-2 mb-5">
              {methods.map(m => (
                <button key={m.id} onClick={() => setPayMethod(m.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${payMethod === m.id ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'}`}>
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <m.Icon size={16} className={payMethod === m.id ? 'text-emerald-400' : 'text-neutral-400'} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">{m.label}</p>
                    <p className="text-xs text-neutral-500">{m.sub}</p>
                  </div>
                  {payMethod === m.id && <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">
              Continue
            </button>
          </div>
        )}

        {/* Step 2 — Payment details */}
        {step === 2 && (
          <div className="mt-4">
            <AmountBox />
            {error && <p className="text-xs text-red-400 mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}

            {payMethod === 'UPI' && (
              <div className="mb-4">
                <label className="block text-xs text-neutral-500 mb-2 uppercase tracking-wide">UPI ID</label>
                <input type="text" placeholder="user@okhdfc" value={upiId} onChange={e => setUpiId(e.target.value)} autoFocus
                  className="w-full bg-neutral-900 border border-neutral-600 text-neutral-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 placeholder-neutral-600" />
              </div>
            )}

            {payMethod === 'Card' && (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" value={cardNo}
                    onChange={e => setCardNo(e.target.value.replace(/[^\d\s]/g,'').slice(0,19))}
                    className="w-full bg-neutral-900 border border-neutral-600 text-neutral-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 placeholder-neutral-600" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">Expiry (MM/YY)</label>
                    <input type="text" maxLength={5} placeholder="08/27" value={cardExpiry}
                      onChange={e => { const v=e.target.value.replace(/\D/g,''); setCardExpiry(v.length>2?v.slice(0,2)+'/'+v.slice(2):v); }}
                      className="w-full bg-neutral-900 border border-neutral-600 text-neutral-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 placeholder-neutral-600" />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">CVV</label>
                    <input type="password" maxLength={4} placeholder="•••" value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g,''))}
                      className="w-full bg-neutral-900 border border-neutral-600 text-neutral-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 placeholder-neutral-600" />
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'NetBanking' && (
              <div className="mb-4">
                <label className="block text-xs text-neutral-500 mb-2">Select Bank</label>
                <div className="grid grid-cols-3 gap-2">
                  {banks.map(b => (
                    <button key={b} onClick={() => setBank(b)}
                      className={`px-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${bank===b?'border-emerald-500/60 bg-emerald-500/10 text-emerald-400':'border-neutral-700 text-neutral-400 hover:border-neutral-600'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {payMethod === 'AutoDebit' && (
              <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <p className="text-sm text-neutral-300 mb-1">Set up recurring mandate</p>
                <p className="text-xs text-neutral-500">You'll be redirected to your bank to authorise the auto-debit mandate.</p>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={10} className="text-emerald-400" />
              </div>
              <p className="text-xs text-neutral-600">Secured by 256-bit encryption · PCI-DSS compliant</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setStep(1); setError(''); }} className="flex-1 py-3 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors">Back</button>
              <button onClick={pay} className="flex-1 py-3 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Pay ₹{fmt(amount)}</button>
            </div>
          </div>
        )}

        {/* Step 3 — Processing */}
        {step === 3 && (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold mb-1">Processing payment…</p>
            <p className="text-xs text-neutral-500">Please do not close this window</p>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === 4 && (
          <div className="text-center py-6">
            <div className="flex items-center gap-2 mb-4 text-left">
              <CreditCard size={16} className="text-emerald-400" />
              <h2 className="text-base font-bold text-white">{title}</h2>
            </div>
            <AmountBox />
            <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              <CheckCircle size={28} className="text-black" />
            </div>
            <p className="text-lg font-bold text-white mb-1">Payment Successful</p>
            <p className="text-xs text-neutral-500 mb-6">Your purchase has been confirmed.</p>
            <button onClick={onClose} className="w-full py-3 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Add Outlet Modal ────────────────────────────────────────── */
function AddOutletModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ restaurantId: '', platform: 'Zomato', name: '' });
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!form.restaurantId || !form.name) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onAdd(form);
    setLoading(false);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-neutral-700 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">Add New Outlet</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300 p-1"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">Restaurant ID</label>
            <input placeholder="e.g. 458721" value={form.restaurantId}
              onChange={e => setForm(p => ({ ...p, restaurantId: e.target.value }))}
              className="w-full bg-[#171717] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-600" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">Platform</label>
            <BSelect value={form.platform} onChange={v => setForm(p => ({ ...p, platform: v }))} options={['Zomato', 'Swiggy']} />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1.5">Outlet Name</label>
            <input placeholder="e.g. Spice Junction - BTM Layout" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-[#171717] border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-600" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-sm hover:bg-neutral-700 transition-colors">Cancel</button>
          <button onClick={submit} disabled={loading || !form.restaurantId || !form.name}
            className="flex-1 py-2.5 bg-emerald-500 text-black rounded-lg text-sm font-semibold hover:bg-emerald-400 disabled:opacity-40 transition-colors">
            {loading ? 'Adding…' : 'Add Outlet'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Remove Outlet Modal ─────────────────────────────────────── */
function RemoveOutletModal({ outlets, onClose, onRemove }) {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!selected) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onRemove(selected);
    setLoading(false);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-neutral-700 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">Remove Outlet</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-300 p-1"><X size={18} /></button>
        </div>
        <div className="mb-3 flex items-start gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2.5">
          <AlertCircle size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-orange-300">Removing an outlet stops data collection and cannot be undone without re-activating.</p>
        </div>
        <div className="mb-5">
          <label className="block text-xs text-neutral-500 mb-1.5">Select Outlet to Remove</label>
          <BSelect
            value={selected}
            onChange={setSelected}
            options={outlets.map(o => ({ value: o.id, label: `${o.name} (${o.platform})` }))}
            placeholder="Select an outlet…"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-sm hover:bg-neutral-700 transition-colors">Cancel</button>
          <button onClick={submit} disabled={loading || !selected}
            className="flex-1 py-2.5 bg-red-500/80 text-white rounded-lg text-sm font-semibold hover:bg-red-500 disabled:opacity-40 transition-colors">
            {loading ? 'Removing…' : 'Remove Outlet'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Billing Page ─────────────────────────────────────────── */
export default function Billing() {
  const [billing, setBilling]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [showAddOutlet, setShowAddOutlet]  = useState(false);
  const [showRemoveOutlet, setShowRemove]  = useState(false);
  const [payModal, setPayModal]           = useState(null); // { title, subtitle, boxLabel, amount, onSuccess }
  const [savingPlan, setSavingPlan]       = useState(false);
  const [confirmingPlan, setConfirming]   = useState(false);
  const [toast, setToast]                 = useState(null);
  const tokenRef = useRef(null);
  const { socket } = useSocket();

  const showMsg = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    fetch('/api/billing')
      .then(r => r.json())
      .then(d => { setBilling(d); setLoading(false); })
      .catch(() => { setError('Failed to load billing data'); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onPlan  = (plan) => setBilling(prev => ({ ...prev, plan }));
    const onToken = ({ balance }) => setBilling(prev => prev ? { ...prev, plan: { ...prev.plan, tokenBalance: balance } } : prev);
    socket.on('billing:plan-update', onPlan);
    socket.on('billing:token-update', onToken);
    return () => { socket.off('billing:plan-update', onPlan); socket.off('billing:token-update', onToken); };
  }, [socket]);

  const changePlan = async (type) => {
    setSavingPlan(type);
    try {
      const res = await fetch('/api/billing/plan', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({type}) });
      const plan = await res.json();
      setBilling(prev => ({ ...prev, plan }));
      showMsg(`Switched to ${type} billing`);
    } catch { showMsg('Failed to update plan','error'); }
    setSavingPlan(false);
  };

  const confirmPlan = async () => {
    setConfirming(true);
    await new Promise(r => setTimeout(r, 900));
    setConfirming(false);
    showMsg('Plan confirmed! Your next invoice will reflect these changes.');
  };

  const changeHistoric = async (months) => {
    try {
      const res = await fetch('/api/billing/historic-data', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({months}) });
      const plan = await res.json();
      setBilling(prev => ({ ...prev, plan }));
      showMsg(`Historic data set to ${months} months`);
    } catch { showMsg('Failed to update','error'); }
  };

  const purchaseTokens = async (packId) => {
    const res = await fetch('/api/billing/tokens/purchase', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({packId}) });
    const { balance } = await res.json();
    setBilling(prev => prev ? { ...prev, plan: { ...prev.plan, tokenBalance: balance } } : prev);
  };

  const activateOutlet = async (id) => {
    await fetch(`/api/billing/outlets/${id}/activate`, { method:'PUT' });
    setBilling(prev => ({ ...prev, newOutlets: prev.newOutlets.map(o => o.id===id ? {...o,status:'Active'} : o) }));
    showMsg('Outlet activated successfully!');
  };

  const addOutlet = (form) => {
    setBilling(prev => ({
      ...prev,
      outlets: [...prev.outlets, { id:`o${Date.now()}`, ...form, status:'active', mappedAt: new Date().toISOString().split('T')[0] }],
      plan: { ...prev.plan, outlets: prev.plan.outlets + 1 },
    }));
    showMsg(`Outlet "${form.name}" added!`);
  };

  const removeOutlet = (id) => {
    setBilling(prev => ({
      ...prev,
      outlets: prev.outlets.filter(o => o.id!==id),
      plan: { ...prev.plan, outlets: Math.max(0, prev.plan.outlets-1) },
    }));
    showMsg('Outlet removed.');
  };

  const openTokenPay = (pack) => {
    setPayModal({
      title: 'Token Purchase',
      subtitle: `${pack.tokens} tokens will be added to your balance`,
      boxLabel: `${pack.name} Pack · ${pack.tokens} Tokens`,
      amount: pack.price,
      onSuccess: async () => {
        await purchaseTokens(pack.id);
        showMsg(`${pack.tokens} tokens added to your account!`);
      },
    });
  };

  const openUpgradePay = () => {
    setPayModal({
      title: 'Upgrade Plan',
      subtitle: 'Pro-rata charge for the remainder of your billing cycle',
      boxLabel: 'Plan Upgrade · Yearly',
      amount: 82717,
      onSuccess: () => {
        changePlan('Yearly');
        showMsg('Plan upgraded to Yearly!');
      },
    });
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-neutral-600">Loading billing…</div>;
  if (error)   return <div className="flex items-center justify-center h-64 text-red-400">{error}</div>;

  const { plan, outlets, newOutlets, tokenPacks, invoices } = billing;
  const finalPrice = plan.basePrice * (1 - plan.discount / 100);
  const historicMultiplier = { 3:'1x', 6:'1.5x', 12:'2x', 24:'3x' };
  const planDurations = [
    { type:'Monthly',   desc:'No discount',        sub:'Billed every 1 month',   save:null },
    { type:'Quarterly', desc:'10% off vs monthly', sub:'Billed every 3 months',  save:'Save 10%' },
    { type:'Yearly',    desc:'20% off vs monthly', sub:'Billed every 12 months', save:'Save 20%' },
  ];

  return (
    <div className="p-6">
      {/* Modals */}
      {payModal && (
        <PaymentModal
          {...payModal}
          onClose={() => setPayModal(null)}
          onSuccess={async () => { await payModal.onSuccess?.(); }}
        />
      )}
      {showAddOutlet  && <AddOutletModal onClose={() => setShowAddOutlet(false)} onAdd={addOutlet} />}
      {showRemoveOutlet && <RemoveOutletModal outlets={outlets} onClose={() => setShowRemove(false)} onRemove={removeOutlet} />}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-lg border text-sm shadow-2xl animate-fade-in ${toast.type==='error' ? 'bg-red-900/80 border-red-700 text-red-200' : 'bg-neutral-800 border-neutral-700 text-neutral-200'}`}>
          <CheckCircle size={14} className={toast.type==='error' ? 'text-red-400' : 'text-emerald-400'} />
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <CreditCard size={20} className="text-emerald-400" />
        <h1 className="text-xl font-bold text-white">Billing & Subscription</h1>
      </div>
      <p className="text-sm text-neutral-500 ml-7 mb-6">Manage your plan, outlets, historic data, and tokens.</p>

      <div className="grid grid-cols-3 gap-6">
        {/* ── Main column ───────────────────────────────────────── */}
        <div className="col-span-2 space-y-5">

          {/* Active Plan Card */}
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">Active</span>
                <span className="text-sm text-neutral-500">Started {plan.startedAt} · Next billing {plan.nextBilling}</span>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <button onClick={openUpgradePay}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-black rounded-lg text-xs font-semibold hover:bg-emerald-400 transition-colors">
                  <Plus size={12} /> Upgrade Plan
                </button>
                <button onClick={() => setShowAddOutlet(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-xs hover:bg-neutral-700 transition-colors">
                  <Plus size={12} /> Add Outlet
                </button>
                <button onClick={() => tokenRef.current?.scrollIntoView({ behavior:'smooth' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-xs hover:bg-neutral-700 transition-colors">
                  <Zap size={12} /> Buy Tokens
                </button>
                <button onClick={() => showMsg('Downloading latest invoice…')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-xs hover:bg-neutral-700 transition-colors">
                  <Download size={12} /> Invoice
                </button>
              </div>
            </div>
            <div className="mb-5">
              <span className="text-3xl font-bold text-white">{fmt(finalPrice)}</span>
              <span className="text-neutral-500 text-sm ml-1">/ {plan.type.toLowerCase()}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label:'PLAN',           value:plan.type,                          Icon:Calendar },
                { label:'ACTIVE OUTLETS', value:plan.outlets,                       Icon:Building2 },
                { label:'HISTORIC DATA',  value:`${plan.historicDataMonths} Months`, Icon:Clock },
                { label:'TOKEN BALANCE',  value:plan.tokenBalance,                  Icon:Zap },
              ].map(({ label, value, Icon }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Icon size={13} className="text-neutral-500" />
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{label}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Duration */}
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-1">Plan Duration</h2>
            <p className="text-xs text-neutral-500 mb-4">Choose how often you want to be billed. Longer commitments save more.</p>
            <div className="grid grid-cols-3 gap-3">
              {planDurations.map(({ type, desc, sub, save }) => (
                <button key={type} onClick={() => changePlan(type)} disabled={!!savingPlan}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all ${plan.type===type ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'}`}>
                  {save && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">{save}</span>
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-white">{type}</span>
                    {plan.type===type && <CheckCircle size={14} className="text-emerald-400" />}
                  </div>
                  <p className="text-xs text-neutral-400">{desc}</p>
                  <p className="text-xs text-neutral-600 mt-0.5">{sub}</p>
                  {savingPlan===type && <p className="text-xs text-emerald-400 mt-1">Saving…</p>}
                </button>
              ))}
            </div>
          </div>

          {/* Outlet Management */}
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Outlet Management</h2>
                <p className="text-xs text-neutral-500">Manage your active outlets and activate new ones</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddOutlet(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-black rounded-lg text-xs font-semibold hover:bg-emerald-400 transition-colors">
                  <Plus size={12} /> Add Outlet
                </button>
                <button onClick={() => setShowRemove(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-xs hover:bg-neutral-700 transition-colors">
                  <Minus size={12} /> Remove
                </button>
                <button onClick={() => showMsg('Opening outlet mapping…')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-xs hover:bg-neutral-700 transition-colors">
                  <MapPin size={12} /> View Mapping
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label:'OUTLETS PAID FOR', value:plan.outlets },
                { label:'OUTLETS MAPPED',   value:outlets.length },
                { label:'NEW DETECTED',     value:newOutlets.length },
                { label:'EXTRA OUTLETS',    value:Math.max(0, outlets.length - plan.outlets) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-neutral-900 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wide mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            {newOutlets.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xs font-semibold text-neutral-300">Newly Detected Outlets</h3>
                  <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{newOutlets.filter(o=>o.status!=='Active').length} pending</span>
                </div>
                <div className="border border-neutral-700 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-neutral-900/50 text-[11px] text-neutral-500 uppercase">
                      <th className="text-left px-4 py-2.5">Restaurant ID</th>
                      <th className="text-left px-4 py-2.5">Platform</th>
                      <th className="text-left px-4 py-2.5">Detected</th>
                      <th className="text-left px-4 py-2.5">Status</th>
                      <th className="text-left px-4 py-2.5">Action</th>
                    </tr></thead>
                    <tbody>
                      {newOutlets.map(o => (
                        <tr key={o.id} className="border-t border-neutral-800">
                          <td className="px-4 py-3 text-neutral-200">{o.restaurantId}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${o.platform==='Zomato'?'bg-red-500/15 text-red-400':'bg-orange-500/15 text-orange-400'}`}>{o.platform}</span></td>
                          <td className="px-4 py-3 text-neutral-400 text-xs">{o.detectedAt}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${o.status==='Active'?'bg-emerald-500/15 text-emerald-400':'bg-neutral-700 text-neutral-400'}`}>{o.status}</span></td>
                          <td className="px-4 py-3">
                            {o.status !== 'Active' && (
                              <button onClick={() => activateOutlet(o.id)}
                                className="text-xs px-3 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/25 transition-colors">
                                Activate & Purchase
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Historic Data */}
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-1">Historic Data Fetching</h2>
            <p className="text-xs text-neutral-500 mb-4">How far back should we pull your past data?</p>
            <div className="grid grid-cols-4 gap-3">
              {[{m:3},{m:6},{m:12},{m:24}].map(({ m }) => (
                <button key={m} onClick={() => changeHistoric(m)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${plan.historicDataMonths===m ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'}`}>
                  <p className="text-sm font-semibold text-white">{m} Months</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{historicMultiplier[m]} base price</p>
                  {plan.historicDataMonths===m && <CheckCircle size={14} className="text-emerald-400 mx-auto mt-2" />}
                </button>
              ))}
            </div>
          </div>

          {/* ── Token Purchase (inline) ──────────────────────────── */}
          <div ref={tokenRef} className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Link2 size={15} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Token Purchase</h2>
            </div>
            <p className="text-xs text-neutral-500 mb-5">Tokens power AI Assistant queries, exports, and notifications.</p>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {tokenPacks.map(p => (
                <div key={p.id}
                  className={`relative border rounded-xl p-4 flex flex-col ${p.popular ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-neutral-700 bg-neutral-900/40'}`}>
                  {p.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                      <Zap size={9} /> POPULAR
                    </div>
                  )}
                  <p className="text-sm font-semibold text-white mb-0.5">{p.name}</p>
                  <div className="flex items-baseline gap-1 mb-0.5">
                    <span className={`text-3xl font-bold ${p.popular ? 'text-emerald-400' : 'text-white'}`}>{p.tokens}</span>
                    <span className="text-xs text-neutral-500">tokens</span>
                  </div>
                  <p className="text-base font-bold text-white mb-0.5">{fmt(p.price)}</p>
                  <p className="text-xs text-neutral-500 mb-4">₹{p.pricePerToken}/token</p>
                  <button
                    onClick={() => openTokenPay(p)}
                    className={`mt-auto w-full py-2 rounded-lg text-sm font-semibold transition-colors ${p.popular ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-neutral-700 text-white hover:bg-neutral-600'}`}>
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-neutral-600">Payment via UPI, Credit Card, or Net Banking — completes in under 30 seconds</p>
          </div>

          {/* Invoices */}
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Invoices & Payment History</h2>
                <p className="text-xs text-neutral-500">Download past invoices and review payment activity</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>ACCEPTED:</span>
                {['UPI','Credit Card','Net Banking','Auto Debit'].map(m => (
                  <span key={m} className="bg-neutral-800 border border-neutral-700 text-neutral-400 px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
            </div>
            <div className="border border-neutral-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-neutral-900/50 text-[11px] text-neutral-500 uppercase">
                  <th className="text-left px-4 py-2.5">Date</th>
                  <th className="text-left px-4 py-2.5">Plan</th>
                  <th className="text-left px-4 py-2.5">Outlets</th>
                  <th className="text-left px-4 py-2.5">Amount</th>
                  <th className="text-left px-4 py-2.5">Invoice</th>
                  <th className="text-left px-4 py-2.5">Status</th>
                  <th className="text-left px-4 py-2.5">Actions</th>
                </tr></thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-t border-neutral-800 hover:bg-neutral-900/30">
                      <td className="px-4 py-3 text-neutral-300 text-xs">{inv.date}</td>
                      <td className="px-4 py-3 text-neutral-400 text-xs">{inv.plan}</td>
                      <td className="px-4 py-3 text-neutral-400 text-xs">{inv.outlets}</td>
                      <td className="px-4 py-3 font-semibold text-white">{fmt(inv.amount)}</td>
                      <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{inv.invoiceNo}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">{inv.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button onClick={() => showMsg(`Viewing ${inv.invoiceNo}…`)}
                            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-emerald-400 transition-colors">
                            <ExternalLink size={11} /> View
                          </button>
                          <button onClick={() => showMsg(`Downloading ${inv.invoiceNo}.pdf…`)}
                            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-emerald-400 transition-colors">
                            <Download size={11} /> PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Price Summary Sidebar ─────────────────────────────── */}
        <div>
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={15} className="text-neutral-400" />
              <h3 className="text-sm font-semibold text-white">Price Summary</h3>
            </div>
            <div className="space-y-3 text-sm mb-4">
              {[
                { label:'Outlets',       value:plan.outlets },
                { label:'Plan',          value:plan.type },
                { label:'Historic data', value:`${plan.historicDataMonths} Months` },
                { label:'Subtotal',      value:fmt(plan.basePrice) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-neutral-500">{label}</span>
                  <span className="text-neutral-300">{value}</span>
                </div>
              ))}
              {plan.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1"><Zap size={11} /> Discount ({plan.discount}%)</span>
                  <span>-{fmt(plan.basePrice * plan.discount / 100)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-neutral-700 pt-4 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-neutral-300">Total</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{fmt(finalPrice)}</p>
                  <p className="text-xs text-neutral-500">per {plan.type==='Monthly'?'month':plan.type==='Quarterly'?'qtr':'year'}</p>
                </div>
              </div>
            </div>
            <button onClick={confirmPlan} disabled={confirmingPlan}
              className="w-full bg-emerald-500 text-black py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {confirmingPlan
                ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Confirming…</>
                : <><CheckCircle size={14} /> Confirm Plan</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
