import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Notifications from './pages/Notifications.jsx';
import Billing from './pages/Billing.jsx';
import Settings from './pages/Settings.jsx';
import HelpSupport from './pages/HelpSupport.jsx';
import ComingSoon from './pages/ComingSoon.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/notifications" replace />} />
        {/* Implemented pages */}
        <Route path="notifications" element={<Notifications />} />
        <Route path="billing"       element={<Billing />} />
        <Route path="settings"      element={<Settings />} />
        <Route path="help"          element={<HelpSupport />} />
        {/* Coming soon pages */}
        <Route path="dashboard"      element={<ComingSoon />} />
        <Route path="earnings"       element={<ComingSoon />} />
        <Route path="advertisements" element={<ComingSoon />} />
        <Route path="charges"        element={<ComingSoon />} />
        <Route path="discounts"      element={<ComingSoon />} />
        <Route path="refunds"        element={<ComingSoon />} />
        <Route path="compare"        element={<ComingSoon />} />
        <Route path="ai-assistant"   element={<ComingSoon />} />
        <Route path="reports"        element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}
