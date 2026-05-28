import type { ReactNode } from 'react';

import { Footer } from './Footer';
import { Navbar, type NavbarLink } from './Navbar';

type LayoutVariant = 'app' | 'landing';

type LayoutAccent = 'blue' | 'indigo';

interface AppLayoutProps {
  children: ReactNode;
  variant: LayoutVariant;
  navLinks?: NavbarLink[];
  accent?: LayoutAccent;
  userInitials?: string;
  showNavbar?: boolean;
}

export function AppLayout({
  children,
  variant,
  navLinks,
  accent,
  userInitials,
  showNavbar = true,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && (
        <Navbar
          variant={variant}
          links={navLinks}
          accent={accent}
          userInitials={userInitials}
          showChat={variant === 'app'}
        />
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
