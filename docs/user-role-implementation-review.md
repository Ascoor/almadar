# مراجعة شاملة لتطوير إدارة المستخدمين والدرجات الوظيفية

## ملخص سريع
- تم بناء الأساسيات (نماذج Eloquent، الميجريشن للكيانات الأساسية، ملف صلاحيات مركزي، Seeder تنظيمي، وصف صفحات الواجهة الأمامية).
- ما زالت طبقة الـAPI والسياسات والأحداث والاختبارات غير مكتملة، والواجهة الأمامية تعتمد على مسارات غير موجودة بعد في الـBackend.

## ما هو منفّذ حاليًا
- **نماذج Laravel**: إضافة النماذج `Department`, `JobGrade`, `StaffProfile` مع الحقول القابلة للتعبئة والعلاقات الأساسية (رئيس القسم، الدرجات، الملف الوظيفي).【F:backend/app/Models/Department.php†L1-L25】【F:backend/app/Models/JobGrade.php†L1-L20】【F:backend/app/Models/StaffProfile.php†L1-L34】
- **علاقة المستخدم بالملف الوظيفي**: تعريف علاقة `hasOne staffProfile` في نموذج المستخدم مع تحميل الأدوار والصلاحيات تلقائيًا.【F:backend/app/Models/User.php†L1-L45】
- **ميجريشن الكيانات الأساسية**: إنشاء جداول الأقسام والدرجات الوظيفية والملفات الوظيفية مع القيود والفهارس المناسبة، بما في ذلك `softDeletes` للأقسام و`unique` للـ `user_id` في الملف الوظيفي.【F:backend/database/migrations/2025_12_13_000000_create_departments_table.php†L1-L32】【F:backend/database/migrations/2025_12_13_000001_create_job_grades_table.php†L1-L32】【F:backend/database/migrations/2025_12_13_000002_create_staff_profiles_table.php†L1-L33】
- **تكوين الصلاحيات**: ملف `config/permissions.php` يعرّف الأدوار الأربعة وقوائم الصلاحيات مع خريطة الربط الافتراضي بينها.【F:backend/config/permissions.php†L1-L96】
- **Seeder تنظيمي**: `SetupOrgSeeder` ينشئ الأقسام والدرجات، يهيئ أدوار/صلاحيات Spatie، ويولّد حسابات تجريبية مع ملفات وظيفية ويضبط رؤساء الأقسام (مع إعادة ضبط للبيانات ذات الصلة قبل الإنشاء).【F:backend/database/seeders/SetupOrgSeeder.php†L1-L109】
- **صفحات وخدمات الواجهة الأمامية**: 
  - خدمة `staff.ts` تغطي طلبات الموظفين والأقسام والدرجات ونقاط إسناد الإجراءات (contracts/investigations/litigations/legal-advices).【F:frontend/src/services/staff.ts†L1-L71】
  - صفحة قائمة الموظفين مع بحث وتصفية وعرض الأدوار والحالة، محمية بصلاحية `staff.manage`.【F:frontend/src/pages/Staff/List.tsx†L1-L198】
  - نموذج إنشاء/تعديل الموظف، إدارة الأقسام، مكوّن اختيار المكلَّف (AssigneePicker)، وحارس المسارات في `AppRouter` لاستخدام صلاحيات الإدارة.【F:frontend/src/pages/Staff/Form.tsx†L1-L200】【F:frontend/src/pages/Departments/index.tsx†L1-L200】【F:frontend/src/components/Assignment/AssigneePicker.tsx†L1-L120】【F:frontend/src/router/AppRouter.jsx†L1-L86】

## الثغرات والنواقص الحالية
- **طبقة الـAPI الناقصة**: لا توجد Controllers أو Requests أو Routes لـ CRUD الموظفين/الأقسام، نقاط إسناد الإجراءات، أو سياسات الوصول المذكورة في خطة التطوير؛ الواجهة الأمامية تستدعي مسارات غير متاحة بعد (مثل `/api/staff`, `/api/departments`, `/api/job-grades`, مسارات الإسناد).【F:frontend/src/services/staff.ts†L1-L71】
- **عدم إضافة أعمدة الإسناد والجداول المشتركة**: الميجريشن الحالية لا تتضمن أعمدة `assigned_user_id`/`assigned_department_id` في جداول الإجراءات ولا جدول `assignments` المتعدد الأدوار، وبالتالي لا يوجد Audit لتغييرات الإسناد أو Event/Listener مرتبط بها.
- **اختبارات وحوكمة مفقودة**: لا توجد اختبارات Feature أو Policies لضبط الوصول أو للتحقق من تدفق الإسناد؛ مسارات الحماية في الواجهة الأمامية تعتمد على صلاحيات غير مدعومة بخلفية فعليّة.
- **مخاطر Seeder**: `SetupOrgSeeder` يقوم بعمل `truncate` على جداول المستخدمين والصلاحيات والموظفين والأقسام دون حماية بيئة الإنتاج أو التفاف بمعاملة، مما قد يمحو بيانات قائمة إذا شُغّل خارج بيئة التطوير.【F:backend/database/seeders/SetupOrgSeeder.php†L15-L37】
- **نقاط تكامل الواجهة الخلفية/الأمامية**: صفحات الإدارة تعتمد على `JobGrade` و`Department` APIs، لكن لا توجد Endpoints حالية لتزويد البيانات أو استلام الحفظ، ما يجعل الواجهة الأمامية غير قابلة للاستخدام حتى يُستكمل الـBackend.

## توصيات الإكمال السريع
1. **إكمال طبقة الـAPI**: إنشاء Controllers وFormRequests وRoutes لـ `/api/staff`, `/api/departments`, `/api/job-grades`، ومسارات الإسناد للأحداث (contracts/investigations/litigations/legal-advices) مع إطلاق Event `ResponsibilityChanged` وتسجيله في جدول `responsibility_audits`.
2. **تحديث قاعدة البيانات**: إضافة ميجريشن لأعمدة الإسناد في جداول الإجراءات وجدول `assignments` المتعدد الأدوار، وتطبيق القيود والفهارس مع دعم rollback.
3. **سياسات واختبارات**: تفعيل Policies لكل نموذج (Contract, Investigation, Litigation, LegalAdvice)، وكتابة اختبارات Feature لتدفق الإسناد حسب الدور (employee/department head/admin) وتوليد سجل التدقيق.
4. **تحسين Seeder**: حماية عمليات `truncate` بتحقق من البيئة (`app()->environment('local')`) أو استخدام معاملات، وإتاحة خيار تعبئة بيانات تجريبية دون حذف كامل.
5. **توحيد الاستجابات للواجهة الأمامية**: اعتماد Resources في Laravel لتنسيق إخراج الأقسام/الدرجات/الموظفين بما يتوافق مع توقعات الواجهة (حقول `department`, `job_grade`, `roles`, `status`).
