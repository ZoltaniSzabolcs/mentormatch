import { Link, useLocation } from 'react-router-dom';
import { Users, MessageSquare } from 'lucide-react';

import { useChatPanel } from './ChatPanel';
import { LogoutButton } from './LogoutButton';

export type NavbarLink = {
  to: string;
  label: string;
};

type NavbarVariant = 'app' | 'landing';

type NavbarAccent = 'blue' | 'indigo';

interface NavbarProps {
  variant: NavbarVariant;
  links?: NavbarLink[];
  accent?: NavbarAccent;
  userInitials?: string;
  showChat?: boolean;
}

const accentMap = {
  blue: {
    text: 'text-blue-600',
    hoverText: 'hover:text-blue-700',
    bg: 'bg-blue-600',
  },
  indigo: {
    text: 'text-indigo-600',
    hoverText: 'hover:text-indigo-700',
    bg: 'bg-indigo-600',
  },
};

export function Navbar({
  variant,
  links = [],
  accent = 'blue',
  userInitials = 'AI',
  showChat = true,
}: NavbarProps) {
  const { pathname } = useLocation();
  const { openChat, ChatPortal } = useChatPanel();
  const accentClasses = accentMap[accent];
  const ctaHoverClass = accent === 'indigo' ? 'hover:bg-indigo-700' : 'hover:bg-blue-700';

  if (variant === 'landing') {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Users className={`w-8 h-8 ${accentClasses.text}`} />
              <span className="text-xl font-bold text-slate-900">MentorMatch</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className={`px-4 py-2 ${accentClasses.bg} ${ctaHoverClass} text-white rounded-lg transition-colors`}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Users className={`w-6 h-6 ${accentClasses.text}`} />
              <span className="text-lg font-bold text-slate-900">MentorMatch</span>
            </Link>
            {links.length > 0 && (
              <div className="hidden md:flex items-center gap-6">
                {links.map((link) => {
                  const isActive = pathname === link.to || pathname.startsWith(`${link.to}/`);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={
                        isActive
                          ? `${accentClasses.text} font-medium`
                          : 'text-slate-600 hover:text-slate-900'
                      }
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {showChat && (
              <button onClick={() => openChat()} className="p-2 text-slate-600 hover:text-slate-900 relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            )}
            <LogoutButton className="text-slate-600 hover:text-slate-900" />
            <div
              className={`w-8 h-8 ${accentClasses.bg} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
            >
              {userInitials}
            </div>
          </div>
        </div>
      </div>
      {showChat && <ChatPortal />}
    </nav>
  );
}
