import { Outlet } from 'react-router-dom';

export function Root() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Outlet />
    </div>
  );
}
