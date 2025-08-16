import type { Customer } from './types';

export const TPL: Record<string, (c: Customer, e?: any) => string> = {
  'faq.shipping_time:en': (c) => `Hi ${c.name}, standard shipping takes 2–5 business days. You'll get tracking via WhatsApp/SMS.`,
  'faq.shipping_time:ar': (c) => `أهلًا ${c.name}، الشحن القياسي بياخد من ٢ لـ ٥ أيام عمل. هيوصلك رقم التتبع على واتساب/رسالة.`,
  'faq.return_policy:en': () => `You can return within 14 days if items are unused and in original packaging. Need a pickup label?`,
  'faq.return_policy:ar': () => `تقدر ترجع خلال 14 يوم طالما المنتج بحالته الأصلية ولم يُستخدم. تحب أبعتلك لابل الشحن؟`,
  'product.info:en': (_c, e) => `Here are the details${e?.product ? ` for ${e.product}` : ''}: ${e?.details ?? 'Available sizes: S–XL, 1‑year warranty.'}`,
  'product.info:ar': (_c, e) => `تفاصيل المنتج${e?.product ? ` ${e.product}` : ''}: ${e?.details ?? 'المقاسات المتاحة: S–XL وضمان سنة.'}`,
  'order.track:en': (c, e) => e?.status ? `Order ${e.orderId}: ${e.status}` : `Got it ${c.name}. Please share your order ID to check live status.`,
  'order.track:ar': (c, e) => e?.status ? `طلبك ${e.orderId}: ${e.status}` : `تمام يا ${c.name}. ابعتلي رقم الطلب علشان أتابع حالته لحظيًا.`,
  'complaint.report:en': () => `I'm really sorry about this. I've logged your issue and can arrange a replacement or refund—what do you prefer?`,
  'complaint.report:ar': () => `آسف جدًا على اللي حصل. سجلّت البلاغ ونقدر نبدّل المنتج أو نرجّع الفلوس—تحب أي خيار؟`,
  'greeting:en': (c) => `Hey ${c.name}! How can I help today?`,
  'greeting:ar': (c) => `أهلاً ${c.name}! أقدر أساعدك في إيه؟`,
  'clarify.request:en': () => `Could you share a bit more so I can help right away?`,
  'clarify.request:ar': () => `ممكن توضح أكتر طلبك؟ جاهز أساعدك حالًا.`,
};

export function translateKey(intent: string, lang: string) {
  return `${intent}:${lang.startsWith('ar') ? 'ar' : 'en'}`;
}
