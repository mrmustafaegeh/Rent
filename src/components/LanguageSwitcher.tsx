'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'; // Assuming these exist, if not I'll check ui folder
import { Globe, ChevronDown } from 'lucide-react';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const locales = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  ];

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1 hover:text-white transition-colors outline-none"
          aria-label={t('changeLanguage')}
          disabled={isPending}
        >
          <Globe className="h-4 w-4" />
          <span className="uppercase">{currentLocale.code}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#0A1628] border-white/10 text-white min-w-[150px]">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => onSelectChange(l.code)}
            className={`cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white ${
              locale === l.code ? 'text-gold font-bold bg-white/5' : 'text-white/80'
            }`}
          >
            <span className="mr-2 text-lg">{l.flag}</span>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
