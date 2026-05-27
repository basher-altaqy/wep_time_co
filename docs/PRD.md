# متطلبات المنتج — Lean MVP

> **اسم المشروع المؤقت:** Saff (صَفّ)
> **المدة المستهدفة:** 3–4 أسابيع
> **النطاق:** Auth + Ventures + Applications فقط
> **اللغة:** عربية بالكامل (RTL)

---

## 1. الفرضية والهدف

نختبر فرضية واحدة في هذه النسخة:

> **هل يستطيع مؤسس أن ينشر فكرة مشروع، ويستقبل طلبات انضمام منظمة بنمط Capacity/Outcome، ويقبلها أو يرفضها — كل ذلك في تجربة واحدة متماسكة بالعربية؟**

كل ما يخرج عن هذا السؤال **خارج النطاق** في هذه المرحلة. لا Canvas، لا Climb Map، لا Tasks، لا Ledger، لا Payments، لا Realtime collaboration. هذه الميزات تأتي في v1 وv2 لاحقًا.

---

## 2. المستخدمون المستهدفون

| المستخدم | الهدف من المنصة |
|---|---|
| **المؤسس** (Founder) | ينشر Venture، يكتب الأطروحة، يستقبل الطلبات، يقبل/يرفض |
| **المساهم المحتمل** (Contributor) | يكتشف Ventures، يقدم طلب انضمام بنمط Capacity أو Outcome |

في هذه النسخة لا يوجد فرق بين "صاحب فكرة" و"مساهم"؛ كل مستخدم يستطيع لعب الدورين.

---

## 3. الكيانات الأساسية

### 3.1 `User` (المستخدم)
- معرّف من Supabase Auth
- بريد إلكتروني (مفتاح)
- تم إنشاؤه في

### 3.2 `Profile` (الملف الشخصي)
| الحقل | النوع | إلزامي | الوصف |
|---|---|---|---|
| `user_id` | UUID (FK→User) | ✅ | |
| `display_name` | string | ✅ | الاسم الظاهر |
| `headline` | string | ❌ | المسمى المختصر (مثال: "مصمم منتج") |
| `bio` | text | ❌ | نبذة |
| `skills` | text[] | ❌ | مصفوفة مهارات |
| `timezone` | string | ❌ | المنطقة الزمنية |
| `weekly_hours_available` | int | ❌ | الساعات الأسبوعية المتاحة |
| `hourly_value` | numeric | ❌ | قيمة الساعة المرجعية |
| `links` | jsonb | ❌ | روابط (linkedin, portfolio, github…) |

### 3.3 `Venture` (الفكرة/الفرصة)
| الحقل | النوع | إلزامي | الوصف |
|---|---|---|---|
| `id` | UUID | ✅ | |
| `slug` | string (unique) | ✅ | للروابط النظيفة |
| `founder_id` | UUID (FK→User) | ✅ | المنشئ |
| `title` | string (≤120) | ✅ | عنوان الفكرة |
| `thesis` | text | ✅ | الأطروحة المختصرة (≤500 حرف) |
| `problem` | text | ❌ | المشكلة |
| `target_outcome` | text | ❌ | النتيجة المستهدفة |
| `stage` | enum | ✅ | `idea` / `validation` / `building` / `launched` |
| `team_size_target` | int | ❌ | الحجم المستهدف للفريق |
| `weekly_hours_expected` | int | ❌ | الساعات المتوقعة لكل عضو |
| `compensation_mode` | enum | ✅ | `equity` / `cash` / `hybrid` / `volunteer` |
| `required_skills` | text[] | ❌ | المهارات المطلوبة |
| `status` | enum | ✅ | `draft` / `open` / `closed` / `archived` |
| `created_at` | timestamptz | ✅ | |
| `updated_at` | timestamptz | ✅ | |

### 3.4 `Application` (طلب الانضمام)
| الحقل | النوع | إلزامي | الوصف |
|---|---|---|---|
| `id` | UUID | ✅ | |
| `venture_id` | UUID (FK→Venture) | ✅ | |
| `applicant_id` | UUID (FK→User) | ✅ | |
| `mode` | enum | ✅ | `capacity` / `outcome` |
| **Capacity mode** | | | |
| `role` | string | ⚠️ | إلزامي إذا `mode=capacity` |
| `weekly_hours` | int | ⚠️ | إلزامي إذا `mode=capacity` |
| `availability_start` | date | ❌ | |
| `hourly_rate_ref` | numeric | ❌ | |
| **Outcome mode** | | | |
| `deliverable` | text | ⚠️ | إلزامي إذا `mode=outcome` |
| `target_date` | date | ⚠️ | إلزامي إذا `mode=outcome` |
| `requested_amount` | numeric | ❌ | المقابل |
| `acceptance_criteria` | text | ⚠️ | إلزامي إذا `mode=outcome` |
| **مشترك** | | | |
| `what_i_offer` | text | ✅ | ماذا أستطيع أن أقدم |
| `links` | jsonb | ❌ | روابط أعمالي |
| `status` | enum | ✅ | `pending` / `accepted` / `rejected` / `withdrawn` |
| `founder_note` | text | ❌ | ملاحظة المؤسس عند القبول/الرفض |
| `created_at` | timestamptz | ✅ | |
| `updated_at` | timestamptz | ✅ | |

**قيد مهم:** لا يحق للمستخدم تقديم أكثر من طلب نشط (`pending`) واحد لنفس الـ Venture.

---

## 4. قصص المستخدم وقبولها (User Stories & Acceptance Criteria)

### Epic 1: المصادقة (Auth)

#### US-1.1: التسجيل بالبريد الإلكتروني
**كمستخدم جديد، أريد التسجيل ببريدي الإلكتروني لأبدأ استخدام المنصة.**

معايير القبول:
- [ ] صفحة `/signup` بحقل بريد + كلمة سر (≥8 حروف)
- [ ] التحقق من صحة البريد بنمط email
- [ ] إرسال رابط تأكيد عبر Supabase
- [ ] بعد التأكيد، تحويل تلقائي إلى `/profile` لإكمال الملف
- [ ] إنشاء صف في جدول `profiles` تلقائيًا عبر trigger
- [ ] الواجهة بالعربية كاملة مع RTL

#### US-1.2: تسجيل الدخول
**كمستخدم مسجّل، أريد تسجيل الدخول بسرعة.**

معايير القبول:
- [ ] صفحة `/login` بحقل بريد + كلمة سر
- [ ] رسائل خطأ واضحة بالعربية
- [ ] رابط "نسيت كلمة السر؟"
- [ ] إعادة التوجيه إلى `/ventures` بعد النجاح

#### US-1.3: تسجيل الخروج
**كمستخدم، أريد إنهاء جلستي بأمان.**

معايير القبول:
- [ ] زر تسجيل الخروج في الشريط العلوي
- [ ] إنهاء الجلسة في Supabase وتحويل إلى `/`

### Epic 2: الملف الشخصي

#### US-2.1: إكمال الملف
**كمستخدم، أريد تعبئة ملفي الشخصي حتى يتمكن المؤسسون من معرفتي.**

معايير القبول:
- [ ] صفحة `/profile` بنموذج كامل
- [ ] حقول: الاسم، المسمى، النبذة، المهارات، الساعات المتاحة، قيمة الساعة، الروابط
- [ ] حفظ تلقائي عند الخروج من الحقل (blur) أو زر صريح
- [ ] رسائل تحقق بالعربية
- [ ] صورة شخصية (Avatar) بـ initials في v0، رفع لاحقًا

### Epic 3: Ventures

#### US-3.1: استعراض الـ Ventures (الاكتشاف)
**كزائر مسجّل، أريد استعراض الـ Ventures المفتوحة وتصفيتها.**

معايير القبول:
- [ ] صفحة `/ventures` تعرض بطاقات Ventures
- [ ] كل بطاقة تُظهر: العنوان، الأطروحة (مختصرة لـ 150 حرف)، المرحلة، نمط التعويض، عدد الطلبات، الساعات المتوقعة
- [ ] فلاتر: المرحلة، نمط التعويض، المهارات
- [ ] ترتيب: الأحدث أولًا
- [ ] حالة فارغة بالعربية: "لا توجد Ventures مفتوحة. كن أول من ينشر فكرة."
- [ ] Pagination كل 12 بطاقة

#### US-3.2: إنشاء Venture جديدة
**كمؤسس، أريد نشر فكرتي بسرعة.**

معايير القبول:
- [ ] صفحة `/ventures/new` بنموذج
- [ ] حقول إلزامية: العنوان، الأطروحة، المرحلة، نمط التعويض
- [ ] حقول اختيارية: المشكلة، النتيجة المستهدفة، حجم الفريق، المهارات
- [ ] خيار حفظ كـ `draft` أو نشر `open`
- [ ] إنشاء `slug` تلقائي من العنوان (مع معالجة العربي والفريد)
- [ ] التحويل إلى `/ventures/[slug]` بعد الإنشاء

#### US-3.3: عرض تفاصيل Venture
**كأي مستخدم، أريد قراءة تفاصيل Venture كاملة.**

معايير القبول:
- [ ] صفحة `/ventures/[slug]` تعرض كل التفاصيل
- [ ] قسم: العنوان والأطروحة
- [ ] قسم: المشكلة والنتيجة المستهدفة
- [ ] قسم: الأدوار المفتوحة (المهارات المطلوبة) ونمط التعويض
- [ ] قسم: معلومات المؤسس (بطاقة صغيرة)
- [ ] زر "قدّم طلبًا" بارز (مخفي للمؤسس نفسه)
- [ ] إذا كان المستخدم قد قدم طلبًا سابقًا: عرض حالة الطلب بدلًا من الزر

#### US-3.4: تعديل Venture
**كمؤسس، أريد تعديل Venture التي أنشأتها.**

معايير القبول:
- [ ] زر "تعديل" يظهر فقط للمؤسس
- [ ] إمكانية تغيير الحالة بين `draft`/`open`/`closed`
- [ ] لا يمكن حذف Venture بها طلبات مقبولة (في v1 لاحقًا)
- [ ] أرشفة بدلًا من الحذف

### Epic 4: Applications

#### US-4.1: تقديم طلب انضمام
**كمساهم محتمل، أريد تقديم طلب انضمام منظم.**

معايير القبول:
- [ ] صفحة `/ventures/[slug]/apply`
- [ ] السؤال الأول: "كيف تريد أن تنضم؟" (Capacity / Outcome)
- [ ] النموذج يتكيف بناءً على الاختيار
- [ ] **Capacity:** الدور، الساعات الأسبوعية، البدء، السعر المرجعي
- [ ] **Outcome:** المخرج، تاريخ التسليم، معيار القبول، المقابل
- [ ] حقل مشترك إلزامي: "ماذا تستطيع أن تقدم؟"
- [ ] روابط أعمال (اختياري، حتى 5 روابط)
- [ ] منع التكرار: إذا كان للمستخدم طلب pending، عرض رسالة
- [ ] لا يمكن للمؤسس تقديم طلب لـ Venture خاصته
- [ ] التحويل إلى `/applications` بعد الإرسال

#### US-4.2: عرض طلباتي المقدمة
**كمستخدم، أريد رؤية كل طلباتي وحالتها.**

معايير القبول:
- [ ] صفحة `/applications` (تبويب "طلباتي المقدمة")
- [ ] قائمة الطلبات مع: اسم الـ Venture، النمط، الحالة، التاريخ
- [ ] فلتر بالحالة
- [ ] إمكانية سحب طلب `pending` (تحويله إلى `withdrawn`)

#### US-4.3: عرض الطلبات الواردة كمؤسس
**كمؤسس، أريد إدارة الطلبات الواردة لـ Ventures التي أنشأتها.**

معايير القبول:
- [ ] صفحة `/ventures/[slug]/applications` تظهر فقط للمؤسس
- [ ] قائمة الطلبات مع تفاصيل المتقدم
- [ ] فلتر بالحالة (افتراضي: `pending`)
- [ ] لكل طلب: تفاصيل المتقدم، التزامه، روابطه، أزرار `قبول` / `رفض` / `طلب معلومات`
- [ ] عند القبول/الرفض: حقل ملاحظة اختياري
- [ ] إشعار للمتقدم عبر البريد (في v0: trigger في DB يكفي للسجل، إرسال البريد لاحقًا)

---

## 5. معمارية تقنية مختصرة

### Stack
- **Framework:** Next.js 14+ (App Router) + TypeScript
- **Styling:** Tailwind CSS مع تخصيص RTL ودعم الخطوط العربية
- **Database:** Postgres عبر Supabase
- **Auth:** Supabase Auth (email + password)
- **Storage:** Supabase Storage (للصور لاحقًا)
- **Validation:** Zod
- **Forms:** React Hook Form
- **UI Components:** مكونات مخصصة (لا shadcn حتى لا نعتمد على CLI خاصة بـ ltr)

### Folders
```
src/
├── app/
│   ├── (auth)/login, signup       # صفحات مصادقة بدون layout للتطبيق
│   ├── (app)/...                   # layout متشارك (شريط علوي + حماية)
│   ├── auth/callback                # OAuth/magic link callback
│   └── api/...
├── components/{ui, venture, layout}
├── lib/{supabase, validations, utils.ts}
└── types/database.ts                 # مولّد من supabase gen types
```

### الأمان (مهم جدًا)
- **RLS (Row-Level Security):** مفعّل على كل الجداول. لا جدول مكشوف بدون policy.
- **Default deny:** أي جدول بلا policy → لا وصول.
- **Service role key:** **ممنوع** استخدامه في الواجهة. يُستخدم فقط في Server Actions موثوقة.
- **Auth context:** كل query على الجداول يمر عبر JWT المُمرّر من المستخدم.

### Policies الرئيسية
| الجدول | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | الجميع | المستخدم نفسه | المستخدم نفسه | — |
| `ventures` | الجميع (إذا `status≠draft`) أو المؤسس | مستخدم مصادق | المؤسس | المؤسس |
| `applications` | المتقدم + المؤسس | مستخدم مصادق (ليس المؤسس) | المتقدم (sw withdraw) + المؤسس (status) | — |

---

## 6. Backlog مرتبة حسب الأولوية

### Sprint 1 (الأسبوع 1): الأساس
1. **INFRA-1**: إعداد Next.js + Tailwind + RTL + الخطوط العربية
2. **INFRA-2**: إعداد Supabase + ملفات env + types generation
3. **DB-1**: migrations للجداول الأساسية (`profiles`, `ventures`, `applications`)
4. **DB-2**: RLS policies + triggers لإنشاء profile تلقائيًا
5. **AUTH-1**: صفحات `/signup` و `/login` و `/logout`
6. **AUTH-2**: middleware للحماية وإعادة التوجيه

### Sprint 2 (الأسبوع 2): الـ Ventures
7. **PROFILE-1**: صفحة `/profile` كاملة (عرض + تعديل)
8. **VENT-1**: صفحة `/ventures/new` (إنشاء)
9. **VENT-2**: صفحة `/ventures` (الاكتشاف + الفلاتر)
10. **VENT-3**: صفحة `/ventures/[slug]` (تفاصيل)
11. **VENT-4**: تعديل/أرشفة من قِبَل المؤسس

### Sprint 3 (الأسبوع 3): الـ Applications
12. **APP-1**: صفحة `/ventures/[slug]/apply` بنمط Capacity/Outcome
13. **APP-2**: صفحة `/applications` (طلباتي)
14. **APP-3**: صفحة `/ventures/[slug]/applications` (إدارة كمؤسس)
15. **APP-4**: منطق القبول/الرفض + الملاحظات

### Sprint 4 (الأسبوع 4): الصقل والإطلاق
16. **UX-1**: حالات الفراغ والأخطاء بكل صفحة
17. **UX-2**: Loading states و Skeleton components
18. **A11Y-1**: مراجعة لوحة المفاتيح والـ ARIA
19. **TEST-1**: اختبارات يدوية شاملة + Playwright لأهم 3 سيناريوهات
20. **DEPLOY-1**: نشر على Vercel + اتصال Supabase production

---

## 7. مقاييس النجاح للـ MVP

- **تقني:** صفر تسريبات أمنية (كل تجربة على RLS تنجح)، p95 صفحة < 1.5 ثانية
- **منتج:** 5 ventures حقيقية أنشأها 5 مؤسسين مختلفين، 20 طلب انضمام، 10 طلبات وصلت لحالة `accepted`/`rejected`
- **تجربة:** زمن من Signup إلى نشر أول Venture < 5 دقائق

---

## 8. خارج النطاق (v1 وما بعدها)

- Mission Canvas (tldraw)
- Climb Map (React Flow)
- Tasks & WIP Board
- Time Entries & Ledger
- Voting & Governance
- Realtime collaboration (Liveblocks/Yjs)
- Payments (Stripe Connect)
- Public Mission Board (مهام خارجية)
- Notifications (إشعارات Real-time)
- إشعارات بالبريد (سترسل في v1)
- AI Features (تلخيص، تجميع، توليد)
- Mobile app

---

## 9. المخاطر الرئيسية للـ MVP

| الخطر | الاحتمالية | الأثر | التخفيف |
|---|---|---|---|
| RLS policy غير مكتملة → تسريب بيانات | متوسطة | عالٍ جدًا | اختبار يدوي + سيناريوهات + مراجعة من اثنين |
| نموذج Application معقد للمستخدم | عالية | متوسط | دمج Capacity/Outcome في صفحة واحدة بانتقال تدريجي |
| تعقيد slug العربي | منخفضة | منخفض | استخدام nanoid + transliteration بسيط |
| تأخير في تكامل Supabase Auth | منخفضة | متوسط | استخدام المثال الرسمي مباشرة |

---

## 10. القرارات المعمارية الموثقة (ADR-lite)

1. **App Router لا Pages Router** — لأن Server Actions تبسط الكثير.
2. **Server Components افتراضيًا** — Client Components فقط حيث نحتاج تفاعل.
3. **Supabase SSR helpers** — لا client-side fetching للبيانات الحساسة.
4. **لا shadcn/ui** — لأن CLI الخاص بها يفترض LTR. نبني مكوناتنا.
5. **لا i18n framework** — العربية فقط في MVP، نضيف next-intl في v1.
6. **Zod للتحقق على الخادم + العميل** — نفس الـ schema في الجهتين.
