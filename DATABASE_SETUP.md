# إعداد قاعدة البيانات على Vercel (Neon)

SQLite لا يعمل على Vercel لأن الملفات لا تُحفظ. استخدم **Neon** (PostgreSQL مجاني):

## 1. إنشاء قاعدة بيانات Neon

1. اذهب إلى [neon.tech](https://neon.tech) وسجّل مجاناً
2. أنشئ مشروعاً جديداً (New Project)
3. بعد الإنشاء، اضغط **Connect** واختر **Prisma**
4. انسخ رابطين:
   - **DATABASE_URL** (للتطبيق، يحتوي `-pooler` في الرابط)
   - **DIRECT_URL** (للمigrations، بدون `-pooler`)

## 2. إضافة المتغيرات في Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com) → مشروعك
2. **Settings** → **Environment Variables**
3. أضف:
   - `DATABASE_URL` = الرابط المنسوخ (مع -pooler)
   - `DIRECT_URL` = الرابط المباشر (بدون -pooler)

## 3. إعادة النشر

Redeploy المشروع. عند البناء سيتم تشغيل migrations تلقائياً وإنشاء الجداول.

## 4. التطوير المحلي

أنشئ ملف `.env` في المشروع:
```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
ADMIN_PASSWORD="كلمة_سر_الأدمن"
```

ثم شغّل:
```bash
npx prisma migrate deploy
npm run dev
```
