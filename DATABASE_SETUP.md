# إعداد قاعدة البيانات (PostgreSQL)

المشروع يستخدم **PostgreSQL** — SQLite لا يعمل على Vercel. استخدم **Supabase** أو **Neon**:

## الخيار أ: Supabase

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ مشروعاً
2. **Settings** → **Database** → انسخ **Connection string** (URI)
3. تأكد أن المشروع **نشط** (ليس Paused) — المشاريع المجانية تتوقف بعد 7 أيام
4. في Vercel: **Settings** → **Environment Variables** → أضف `DATABASE_URL`

## الخيار ب: Neon

1. اذهب إلى [neon.tech](https://neon.tech) وأنشئ مشروعاً
2. **Connect** → **Prisma** → انسخ الرابط المباشر (بدون -pooler)
3. في Vercel: أضف `DATABASE_URL`

## 3. إعادة النشر

Redeploy المشروع. عند البناء سيتم تشغيل migrations تلقائياً وإنشاء الجداول.

## 4. التطوير المحلي

أنشئ ملف `.env` في المشروع:
```
DATABASE_URL="postgresql://..."
ADMIN_PASSWORD="كلمة_سر_الأدمن"
```

ثم شغّل:
```bash
npx prisma migrate deploy
npm run dev
```

---

## حل خطأ "Unable to open the database file"

هذا الخطأ يعني أن التطبيق يحاول استخدام SQLite. تأكد من:

1. **ملف `.env`** يحتوي على `DATABASE_URL` برابط Postgres (يبدأ بـ `postgresql://`)
2. **إعادة بناء نظيفة** محلياً:
   ```bash
   # احذف .next و node_modules/.prisma ثم:
   npx prisma generate
   npm run dev
   ```
3. على **Vercel**: تحقق أن `DATABASE_URL` مضبوط وأنك نشرت آخر تحديث
