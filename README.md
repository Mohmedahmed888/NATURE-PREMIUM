# Natural Premium (Next.js + Prisma) — جاهز لـ Vercel

## 1) تشغيل محليًا
```bash
npm i
cp .env.example .env
# حط DATABASE_URL + ADMIN_PASSWORD
npx prisma migrate dev --name init
npm run dev
```

## 2) Deploy على Vercel
1) ارفع المشروع على GitHub.
2) في Vercel: Import Project.
3) ضيف Environment Variables زي `.env.example` (خصوصًا `DATABASE_URL` و `ADMIN_PASSWORD`).
4) Deploy.

> **مهم:** لازم قاعدة بيانات Postgres خارجية (Neon / Supabase). السيرفرلس بتاع Vercel مفيهوش تخزين دائم.

## Automation
- عند إنشاء Order: بيتم استدعاء `/api/automation/order-confirmation` لإرسال إيميل (اختياري لو حطيت SMTP).
- Cron يومي على `/api/cron/daily` (محدد في `vercel.json`) لعمل check بسيط (مثال).

## Admin
- `/login` ثم `/admin`
- كلمة السر من `ADMIN_PASSWORD`
