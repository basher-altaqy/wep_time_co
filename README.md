# صَفّ (Saff)

> نظام تشغيل لتشكيل وتشغيل فرق تنفيذية صغيرة (Venture OS). واجهة عربية بالكامل (RTL).

**النسخة الحالية:** Lean MVP — Auth + Ventures + Applications فقط.
**الرؤية الكاملة:** [`docs/VISION.md`](docs/VISION.md) — نظام تشغيل متكامل من اكتشاف الفكرة إلى التسوية النهائية.

---

## الفكرة في سطر

> مكان يلتقي فيه أصحاب الأفكار بمساهمين يلتزمون **بساعات محددة أو مخرجات محددة**، عبر طلبات انضمام منظمة، لا بمحادثات مشتتة.

---

## الوثائق

كل وثيقة تخدم قارئًا مختلفًا وغرضًا مختلفًا. اقرأها بهذا الترتيب لتفهم المشروع كاملًا:

[`docs/VISION.md`](docs/VISION.md) — الرؤية الاستراتيجية الكاملة لـ Venture OS. تشرح المشكلة التي نحلّها، التموضع، النموذج الكياني الكامل (Venture, Studio, Mission, Canvas, Climb Map)، وكيف ستبدو التجربة عند نضج المنصّة.

[`docs/ROADMAP.md`](docs/ROADMAP.md) — خارطة الطريق التفصيلية من v0.1 إلى v4. كل إصدار له فرضية يَختبرها، نطاق محدّد، ومعايير خروج صريحة قبل الانتقال للذي يليه.

[`docs/PRD.md`](docs/PRD.md) — متطلبات المنتج التفصيلية للنسخة الحالية (v0.1). يحوي 12 user story، 4 sprints، 20 مهمّة، ومقاييس النجاح الدقيقة.

[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — المعمارية التقنية للنسخة الحالية. تدفّقات Auth، RLS، Server Actions، وكيف يتكامل كل شيء.

[`docs/GOVERNANCE.md`](docs/GOVERNANCE.md) — تصميم نظام الحوكمة المُستقبلي (سيُنفَّذ في v2). مصفوفة القرارات الطبقية الأربعة، آلية التصويت، وحالات الحافّة المُعالَجة.

[`docs/LEDGER.md`](docs/LEDGER.md) — تصميم سجلّ المساهمة ووحدات المساهمة المُستقبلية (سيُنفَّذ في v3). يشرح كيف نُحاسب الجهد بعدالة، والفصل القانوني بين السجلّ والـ CUs وطبقة التعويض.

[`docs/SETUP.md`](docs/SETUP.md) — دليل الإعداد خطوة بخطوة لمن يريد تشغيل المشروع محليًّا.

---

## التشغيل المحلي السريع

```bash
npm install
cp .env.example .env.local   # عبّئ المتغيرات من Supabase
# طبّق supabase/migrations/*.sql في SQL Editor
npm run dev
```

التفاصيل الكاملة في [`docs/SETUP.md`](docs/SETUP.md).

---

## بنية المشروع

```
saff/
├── docs/                        # كل الوثائق (VISION, ROADMAP, PRD, ...)
├── supabase/migrations/         # SQL migrations
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # login, signup
│   │   ├── (app)/               # محمي بـ middleware
│   │   │   ├── ventures/
│   │   │   ├── applications/
│   │   │   └── profile/
│   │   ├── auth/callback/
│   │   ├── globals.css
│   │   └── layout.tsx           # dir="rtl" lang="ar"
│   ├── components/{ui, venture, layout}/
│   ├── lib/{supabase, validations}/
│   └── middleware.ts
└── package.json
```

---

## المكدّس التقني الحالي

Next.js 15 (App Router) + React 19 + TypeScript للواجهة والمنطق. Supabase (Postgres + Auth + RLS) للبيانات والمصادقة. Tailwind CSS مع `tailwindcss-rtl` للتصميم العربي. Zod للتحقّق المتزامن على الخادم والعميل. nanoid لتوليد slugs فريدة.

طبقات v1 و v2 و v3 ستُضيف: tldraw للـ Canvas، React Flow للـ Climb Map، Yjs أو Liveblocks للتعاون المتزامن. التفاصيل في [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## قواعد الأمان

RLS مفعّلة على كل الجداول بمبدأ default deny. `SUPABASE_SERVICE_ROLE_KEY` يُستخدم فقط في Server Actions، لا في Client Components. كل Server Action يفحص الـ Auth قبل أي mutation. لا تُخزَّن أسرار في الـ commit؛ الـ `.gitignore` يستثني `.env*`.

---

## الترخيص

سيتم تحديده في v0.2 — حاليًا All Rights Reserved.
