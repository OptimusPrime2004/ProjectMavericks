'use client';

import Link from 'next/link';
import { Hexagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/ar-dashboard', label: 'AR Dashboard' },
    { href: '/recruiter-admin', label: 'Recruiter Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Hexagon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">Profile Ranker</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
