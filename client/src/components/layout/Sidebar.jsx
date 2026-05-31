import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, IndianRupee, Megaphone, CreditCard, Tag, RotateCcw,
  GitCompare, Bot, FileText, Bell, Receipt, Settings, HelpCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';

const mainNav = [
  { to: '/dashboard',      label: 'Dashboard',      Icon: LayoutDashboard },
  { to: '/earnings',       label: 'Earnings',       Icon: IndianRupee },
  { to: '/advertisements', label: 'Advertisements', Icon: Megaphone },
  { to: '/charges',        label: 'Charges',        Icon: CreditCard },
  { to: '/discounts',      label: 'Discounts',      Icon: Tag },
  { to: '/refunds',        label: 'Refunds',        Icon: RotateCcw },
  { to: '/compare',        label: 'Compare',        Icon: GitCompare },
  { to: '/ai-assistant',   label: 'AI Assistant',   Icon: Bot },
  { to: '/reports',        label: 'Reports',        Icon: FileText },
];

const accountNav = [
  { to: '/notifications', label: 'Notifications',  Icon: Bell,       badge: true },
  { to: '/billing',       label: 'Billing',        Icon: Receipt,    badge: false },
  { to: '/settings',      label: 'Settings',       Icon: Settings,   badge: false },
  { to: '/help',          label: 'Help & Support', Icon: HelpCircle, badge: false },
];

const navCls = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
    isActive ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
  }`;

export default function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => setUnreadCount(data.filter(n => !n.read).length))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew    = ()  => setUnreadCount(c => c + 1);
    const onAllRead = () => setUnreadCount(0);
    const onUpdate = (n) => { if (n.read) setUnreadCount(c => Math.max(0, c - 1)); };
    socket.on('notification:new',     onNew);
    socket.on('notification:all-read', onAllRead);
    socket.on('notification:update',  onUpdate);
    return () => {
      socket.off('notification:new',     onNew);
      socket.off('notification:all-read', onAllRead);
      socket.off('notification:update',  onUpdate);
    };
  }, [socket]);

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0a0a0a] border-r border-neutral-800 flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-neutral-800">
        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-sm">m</div>
        <span className="text-white font-semibold text-lg tracking-tight">mynt</span>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-4">
        {/* MAIN */}
        <div>
          <p className="px-2 mb-1 text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">Main</p>
          {mainNav.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={navCls}>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* ACCOUNT */}
        <div>
          <p className="px-2 mb-1 text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">Account</p>
          {accountNav.map(({ to, label, Icon, badge }) => (
            <NavLink key={to} to={to} className={navCls}>
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {badge && unreadCount > 0 && (
                <span className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-semibold">R</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-200 truncate">Rahul Sharma</p>
            <p className="text-[10px] text-neutral-500 truncate">rahul@spicejunction.in</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
