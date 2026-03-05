# إعداد رفع الصور على Vercel

لتفعيل رفع الصور في لوحة الأدمن، اتبع الخطوات التالية:

## 1. إنشاء Blob Store

1. افتح [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع **nature-premium**
3. اذهب إلى تبويب **Storage**
4. اضغط **Create Database** أو **Create Store**
5. اختر **Blob**
6. أدخل اسماً (مثل `natural-premium-uploads`) واضغط **Create**
7. اختر **Connect Project** واربطه بمشروعك
8. تأكد أن `BLOB_READ_WRITE_TOKEN` يُضاف للمتغيرات البيئية تلقائياً

## 2. إعادة النشر

بعد ربط Blob بالمشروع، أعد نشر التطبيق (Redeploy) من Vercel.

## 3. التحقق

جرّب رفع صورة من لوحة الأدمن → إضافة منتج. يجب أن يعمل الرفع بدون أخطاء.

---

**ملاحظة:** يمكنك دائماً استخدام وضع «رابط» لإدخال رابط صورة من الإنترنت (مثل Unsplash أو Imgur) بدون إعداد Blob.
