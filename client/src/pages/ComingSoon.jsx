import { useLocation } from 'react-router-dom';
import { LayoutDashboard, IndianRupee, Megaphone, CreditCard, Tag, RotateCcw, GitCompare, Bot, FileText, Construction } from 'lucide-react';

const PAGE_META = {
  dashboard:      { label: 'Dashboard',      Icon: LayoutDashboard, desc: 'Business performance overview — GOV, orders, margin, and AI insights across all outlets.' },
  earnings:       { label: 'Earnings',       Icon: IndianRupee,     desc: 'Sales, order value trends, outlet performance table, and time-based analysis.' },
  advertisements: { label: 'Advertisements', Icon: Megaphone,       desc: 'Ad spend analysis, sales lift metrics, and ad vs non-ad period comparison.' },
  charges:        { label: 'Charges',        Icon: CreditCard,      desc: 'Commission, payment gateway, long-distance, and government charges breakdown.' },
  discounts:      { label: 'Discounts',      Icon: Tag,             desc: 'Coupon performance, burn rate analysis, and outlet x coupon breakdown.' },
  refunds:        { label: 'Refunds',        Icon: RotateCcw,       desc: 'Refund & cancellation trends, platform split, and outlet-wise refund table.' },
  compare:        { label: 'Compare',        Icon: GitCompare,      desc: 'Side-by-side comparison across outlets, brands, sub-brands, groups, and platforms.' },
  'ai-assistant': { label: 'AI Assistant',  Icon: Bot,             desc: 'Ask anything about your business performance. Text answers are free; tables & charts cost tokens.' },
  reports:        { label: 'Reports',        Icon: FileText,        desc: 'Generate, schedule, and download PDF/Excel reports. Email or WhatsApp delivery.' },
};

export default function ComingSoon() {
  const { pathname } = useLocation();
  const key = pathname.replace('/', '');
  const meta = PAGE_META[key];
  const Icon = meta?.Icon || Construction;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
        <Icon size={28} className="text-neutral-600" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{meta?.label || key}</h1>
      {meta?.desc && <p className="text-sm text-neutral-500 max-w-md mb-6 leading-relaxed">{meta.desc}</p>}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full">
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
        <span className="text-xs text-neutral-500">This section is coming soon</span>
      </div>
    </div>
  );
}
