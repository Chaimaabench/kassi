'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteLogoPath } from '@/lib/site-assets';

type SiteLogoProps = {
  className?: string;
  href?: string;
  imageClassName?: string;
  textClassName?: string;
  priority?: boolean;
};

export function SiteLogo({
  className,
  href = '/',
  imageClassName = 'h-12 w-auto',
  textClassName = 'font-serif text-3xl tracking-tight font-medium text-charcoal',
  priority = false,
}: SiteLogoProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Link href={href} className={className} aria-label="Kassi home">
      {hasError ? (
        <span className={textClassName}>Kassi</span>
      ) : (
        <Image
          src={siteLogoPath}
          alt="Kassi logo"
          width={220}
          height={88}
          priority={priority}
          className={imageClassName}
          onError={() => setHasError(true)}
        />
      )}
    </Link>
  );
}
