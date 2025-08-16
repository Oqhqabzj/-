export function detectLang(text: string): 'ar' | 'en' | 'other' {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  if (hasArabic) return 'ar';
  const hasLatin = /[A-Za-z]/.test(text);
  return hasLatin ? 'en' : 'other';
}
