'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, localizePath, stripLocalePrefix } from '@/lib/i18n';

type LanguageSwitcherProps = {
  className?: string;
  light?: boolean;
};

export function LanguageSwitcher({ className, light = false }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const pathWithoutLocale = stripLocalePrefix(pathname || '/');

  const linkClassName = (targetLocale: 'en' | 'fr') =>
    `rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
      locale === targetLocale
        ? light
          ? 'bg-white text-charcoal'
          : 'bg-charcoal text-white'
        : light
          ? 'bg-white/10 text-white hover:bg-white/20'
          : 'bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10'
    }`;

  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ''}`.trim()}>
      <Link href={localizePath(pathWithoutLocale, 'en')} className={linkClassName('en')}>
        EN
      </Link>
      <Link href={localizePath(pathWithoutLocale, 'fr')} className={linkClassName('fr')}>
        FR
      </Link>
    </div>
  );
}
