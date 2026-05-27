# دليل الإعداد الكامل خطوة بخطوة

هذا الدليل يأخذك من الصفر إلى تطبيق يعمل محليًا في 15 دقيقة.

---

## 1) المتطلبات

- Node.js 18.18+ ([nodejs.org](https://nodejs.org))
- حساب على [Supabase](https://supabase.com) (الباقة المجانية كافية)
- حساب على [GitHub](https://github.com)

---

## 2) إنشاء مشروع Supabase

1. اذهب إلى [supabase.com/dashboard](https://supabase.com/dashboard)
2. اضغط **New Project**
3. اختر اسمًا (مثلًا `saff-dev`) وكلمة سر قوية لـ Postgres
4. اختر منطقة قريبة (Frankfurt جيدة للمنطقة العربية)
5. انتظر دقيقتين حتى يتم الإعداد

---

## 3) تشغيل الـ Migrations

في لوحة Supabase:

1. اذهب إلى **SQL Editor** (يسار الشاشة)
2. افتح ملف `supabase/migrations/0001_initial_schema.sql` وانسخ محتواه
3. الصقه في SQL Editor واضغط **Run**
4. كرر نفس الخطوة لـ `supabase/migrations/0002_rls_policies.sql`

أو إذا تستخدم Supabase CLI:

```bash
npm install -g supabase
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

---

## 4) الحصول على المفاتيح

في **Project Settings → API**:

- انسخ `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- انسخ `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- انسخ `service_role` (سرّي!) → `SUPABASE_SERVICE_ROLE_KEY`

---

## 5) تشغيل التطبيق محليًا

```bash
# في مجلد المشروع
cp .env.example .env.local

# عبّئ القيم في .env.local

npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

---

## 6) دفع المشروع إلى GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "feat: Lean MVP scaffold — Auth + Ventures + Applications"

# أنشئ المستودع على GitHub (عبر الواجهة) ثم:
git branch -M main
git remote add origin https://github.com/<username>/saff.git
git push -u origin main
```

---

## 7) النشر على Vercel (اختياري)

1. اذهب إلى [vercel.com/new](https://vercel.com/new)
2. اربط مستودع GitHub
3. أضف نفس متغيرات البيئة من `.env.local`
4. غيّر `NEXT_PUBLIC_SITE_URL` إلى رابط Vercel
5. في Supabase **Authentication → URL Configuration**: أضف رابط Vercel إلى الـ Redirect URLs

---

## 8) اختبار يدوي سريع

بعد التشغيل، جرّب هذه السيناريوهات:

- [ ] صفحة الرئيسية تفتح بدون أخطاء
- [ ] التسجيل ببريد جديد → استلام رابط التأكيد
- [ ] الضغط على الرابط → تحويل إلى /ventures
- [ ] إنشاء Venture جديدة
- [ ] الخروج من الحساب → التسجيل بحساب آخر
- [ ] التقديم على الـ Venture (capacity ثم outcome)
- [ ] العودة للحساب الأول → رؤية الطلبات في /ventures/[slug]/applications
- [ ] قبول طلب وكتابة ملاحظة
- [ ] تسجيل الدخول بالحساب المتقدم → رؤية الطلب كـ "مقبول"

---

## 9) عند ظهور أخطاء

**خطأ في الـ Auth callback؟** تأكد أن `NEXT_PUBLIC_SITE_URL` في `.env.local` يطابق العنوان الذي تفتح منه التطبيق (مع/بدون trailing slash).

**خطأ "permission denied for table"؟** الـ RLS policies لم تُطبّق. كرّر الخطوة 3.

**التطبيق لا يعرف نوع `Database`؟** شغّل:
```bash
npm run db:types
```

---

## 10) الخطوات التالية

اقرأ [`docs/PRD.md`](docs/PRD.md) للمستقبل (v0.2, v1, v2).
