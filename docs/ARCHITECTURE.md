# المعمارية التقنية

## نظرة عامة

```
┌─────────────────────────────────────────────┐
│         المتصفح (Browser)                    │
│    Next.js Client + RTL UI                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Next.js Server (Vercel)             │
│   - Server Components                        │
│   - Server Actions                           │
│   - Route Handlers (/api/*)                  │
│   - Middleware (auth gate)                   │
└──────────────────┬──────────────────────────┘
                   │ JWT (المُمرّر من المستخدم)
                   ▼
┌─────────────────────────────────────────────┐
│           Supabase                          │
│   ┌──────────────────────────────────────┐  │
│   │  Auth (email/password)               │  │
│   ├──────────────────────────────────────┤  │
│   │  Postgres                            │  │
│   │  - profiles                          │  │
│   │  - ventures                          │  │
│   │  - applications                      │  │
│   │  + RLS Policies (default deny)       │  │
│   ├──────────────────────────────────────┤  │
│   │  Storage (لاحقًا للصور)               │  │
│   └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## مبادئ معمارية

### 1. الأمان عبر RLS لا الكود
- كل جدول مفعّل عليه RLS مع **default deny**.
- لا نعتمد على فحوصات في الـ middleware للأمان (نعتمد عليها لتحسين UX فقط).
- لو سرّب مهاجم API key للعميل، RLS تحمي البيانات.

### 2. Server-first
- استخدام Server Components افتراضيًا.
- Client Components فقط للنماذج التفاعلية واللوحات الحية.
- Server Actions لجميع mutations.

### 3. Type safety من DB إلى UI
```
Postgres → supabase gen types → types/database.ts
                                       ▼
                                  Zod schemas
                                       ▼
                              React Hook Form
```

### 4. لا حالة عالمية في الـ client
- لا Redux/Zustand.
- استخدام `useState` المحلية + React Query لاحقًا عند الحاجة.
- في MVP الحالي: Server Actions + revalidation تكفي.

## تدفق المصادقة

```
1. المستخدم يدخل /signup
2. Supabase Auth ينشئ user
3. Trigger يُنشئ profile مرتبط
4. رسالة تأكيد ترسل
5. المستخدم يضغط الرابط
6. /auth/callback يُعالج الكود
7. Cookies تُحفظ
8. Redirect إلى /ventures
```

## تدفق إنشاء Venture

```
1. POST /ventures/new (Server Action)
2. التحقق من Auth في الـ Action
3. Zod validation
4. Insert في ventures (RLS تتحقق founder_id = auth.uid())
5. Insert في venture_skills إن وُجدت
6. revalidatePath('/ventures')
7. redirect إلى /ventures/[slug]
```

## تدفق Application

```
1. المستخدم على /ventures/[slug]
2. يضغط "قدّم طلبًا" → /ventures/[slug]/apply
3. يختار Capacity أو Outcome
4. يملأ النموذج → Submit Server Action
5. الـ Action يفحص:
   - المستخدم ليس المؤسس
   - لا يوجد طلب pending سابق
   - Zod validation
6. Insert في applications
7. (لاحقًا) إرسال إشعار بريدي للمؤسس
8. redirect إلى /applications
```

## قرارات Slug

استخدام `slugify` مع:
- تحويل العربية إلى حروف لاتينية (تقريبية)
- إضافة `nanoid(6)` للتفرّد المضمون
- مثال: "منصة التعاون" → `mnst-altan-x9f2k1`

## الأخطاء والاستجابة

| الكود | الحالة | الاستجابة بالعربية |
|---|---|---|
| 401 | غير مصادق | "تحتاج لتسجيل الدخول" |
| 403 | غير مخول | "ليست لديك صلاحية" |
| 404 | غير موجود | "الـ Venture غير موجودة" |
| 409 | تعارض (Conflict) | "لديك طلب نشط لهذه الـ Venture بالفعل" |
| 422 | Validation | حقول محددة بالأخطاء |
| 500 | خطأ في الخادم | "حدث خطأ. حاول لاحقًا." |
