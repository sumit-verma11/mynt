import { Outlet } from 'react-router-dom';
import { PanelLeft } from 'lucide-react';
import Sidebar from './Sidebar.jsx';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top nav bar */}
        <header className="h-11 flex items-center justify-between px-4 border-b border-neutral-800 flex-shrink-0 bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
              <PanelLeft size={16} />
            </button>
            <span className="text-sm text-neutral-400">'s Business</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold select-none">
            R
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
