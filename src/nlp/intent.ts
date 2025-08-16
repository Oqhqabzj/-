export type IntentRule = { intent: string; test: (t: string) => boolean };

export const INTENT_RULES: IntentRule[] = [
  { intent: 'order.track', test: (t) => /(track|order|pedido|طلب|اوردر).*(status|where|فين|حالة)/i.test(t) },
  { intent: 'faq.shipping_time', test: (t) => /(shipping|delivery|شحن|توصيل|ميعاد)/i.test(t) },
  { intent: 'faq.return_policy', test: (t) => /(return|refund|policy|استرجاع|مرتجع|رجوع)/i.test(t) },
  { intent: 'product.info', test: (t) => /(spec|detail|price|مواصفات|سعر|مقاس|اللون)/i.test(t) },
  { intent: 'complaint.report', test: (t) => /(broken|damaged|bad|تالف|مكسور|غلط|تأخير)/i.test(t) },
  { intent: 'greeting', test: (t) => /\b(hello|hi|hey|السلام عليكم|ازيك|مرحبا)\b/i.test(t) },
];

export function chooseIntent(text: string): string {
  const hit = INTENT_RULES.find((r) => r.test(text));
  return hit ? hit.intent : 'clarify.request';
}
