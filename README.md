# صَفّ (Saff)

> منصة تشكيل فرق دقيقة قائمة على الوقت والمخرجات. واجهة عربية بالكامل (RTL).

**النسخة الحالية:** Lean MVP — Auth + Ventures + Applications فقط.

---

## الفكرة في سطر

> مكان يلتقي فيه أصحاب الأفكار بمساهمين يلتزمون **بساعات محددة أو مخرجات محددة**، عبر طلبات انضمام منظمة، لا بمحادثات مشتتة.

اقرأ التفاصيل الكاملة في [`docs/PRD.md`](docs/PRD.md) و[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## التشغيل المحلي

### المتطلبات
- Node.js ≥ 18.17
- حساب على [Supabase](https://supabase.com) (الباقة المجانية كافية للـ MVP)
- (اختياري) [Supabase CLI](https://supabase.com/docs/guides/cli) للتشغيل المحلي

### الخطوات

```bash
# 1. تثبيت الحزم
npm install

# 2. نسخ env
cp .env.example .env.local

# 3. عبّئ المتغيرات من Supabase dashboard
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. تشغيل الـ migrations على قاعدة بياناتك
# في Supabase Dashboard → SQL Editor:
# نفّذ supabase/migrations/0001_initial_schema.sql
# ثم supabase/migrations/0002_rls_policies.sql

# 5. تشغيل التطبيق
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

---

## بنية المشروع

```
saff/
├── docs/                        # PRD, ARCHITECTURE
├── supabase/migrations/         # SQL migrations
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # login, signup (بدون layout التطبيق)
│   │   ├── (app)/               # محمي بـ middleware
│   │   │   ├── ventures/        # discovery + new + [id]
│   │   │   ├── applications/    # طلباتي المقدمة
│   │   │   └── profile/
│   │   ├── auth/callback/       # OAuth/email callback
│   │   ├── globals.css
│   │   ├── layout.tsx           # dir="rtl" lang="ar"
│   │   └── page.tsx             # Landing
│   ├── components/{ui, venture, layout}/
│   ├── lib/{supabase, validations}/
│   ├── types/database.ts
│   └── middleware.ts
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## قواعد الأمان

- **RLS مفعّلة على كل الجداول** بمبدأ default deny.
- `SUPABASE_SERVICE_ROLE_KEY` يُستخدم فقط في Server Actions، لا في Client Components.
- كل Server Action يفحص الـ Auth قبل أي mutation.
- لا تخزن أسرارًا في الـ commit. الـ `.gitignore` يستثني `.env*`.

---

## خارطة الطريق

- [x] **MVP (الحالي):** Auth + Ventures + Applications
- [ ] **v0.2:** Profile completions + Email notifications للطلبات
- [ ] **v1:** Mission Canvas (tldraw) + Tasks + Time Entries + Ledger للقراءة
- [ ] **v2:** Climb Map (React Flow) + Voting & Governance + Realtime
- [ ] **v3:** Public Mission Board + Stripe Connect

التفاصيل في [`docs/PRD.md`](docs/PRD.md) قسم §8.

---

## الترخيص

سيتم تحديده — حاليًا All Rights Reserved.
