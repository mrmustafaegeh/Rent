'use client';

import { useState, useEffect, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'; 
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSwitcher() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return (
    <div className="flex items-center gap-1 opacity-50 px-2">
       <Globe className="h-4 w-4" />
       <span className="uppercase text-sm">{locale}</span>
       <ChevronDown className="h-3 w-3 opacity-50" />
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1 hover:text-white transition-colors outline-none px-2"
          aria-label={t('changeLanguage')}
          disabled={isPending}
        >
          <Globe className="h-4 w-4" />
          <span className="uppercase text-sm">{currentLocale.code}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border-white/10 text-popover-foreground min-w-[150px] shadow-2xl">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => onSelectChange(l.code)}
            className={`cursor-pointer transition-colors focus:bg-white/10 focus:text-white ${
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
