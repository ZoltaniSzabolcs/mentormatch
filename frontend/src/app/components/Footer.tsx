import { Users } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            <span className="text-lg font-semibold">MentorMatch</span>
          </div>
          <div className="text-slate-400">© 2026 MentorMatch. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
