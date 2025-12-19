import arBase from '../locales/ar.json';
import enBase from '../locales/en.json';

type TranslationRecord = Record<string, any>;

const nestTranslations = (flat: TranslationRecord) => {
  const result: TranslationRecord = {};
  Object.entries(flat || {}).forEach(([key, value]) => {
    const parts = key.split('.');
    let current = result;
    parts.forEach((part, idx) => {
      if (idx === parts.length - 1) {
        current[part] = value;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  });
  return result;
};

const deepMerge = (target: TranslationRecord, source: TranslationRecord) => {
  const output = { ...target };
  Object.entries(source || {}).forEach(([key, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof output[key] === 'object'
    ) {
      output[key] = deepMerge(output[key], value);
    } else {
      output[key] = value;
    }
  });
  return output;
};

const landingEn: TranslationRecord = {
  nav: {
    brand: 'Almadar Legal',
    features: 'Features',
    how: 'How it works',
    screens: 'Product',
    pricing: 'Pricing',
    testimonials: 'Testimonials',
    faq: 'FAQ',
    contact: 'Contact',
    login: 'Login',
    getStarted: 'Get started',
  },
  hero: {
    badge: 'Enterprise legal intelligence',
    title: 'Modern legal operations, streamlined for scale',
    description:
      'Manage cases, contracts, and compliance in one place with AI assistance, smart automation, and actionable analytics.',
    primaryCta: 'Start free trial',
    secondaryCta: 'View product',
    metrics: {
      cases: 'Active cases',
      savings: 'Hours saved monthly',
      approvals: 'Automated approvals',
      reliability: 'SLA reliability',
    },
  },
  features: {
    title: 'Purpose-built for legal and compliance teams',
    subtitle: 'Connected workflows, powerful automation, and enterprise-grade governance.',
    items: [
      {
        title: 'Case & matter hub',
        description: 'Timeline views, assignments, and evidence tracking with instant context.',
      },
      {
        title: 'Contract automation',
        description: 'Versioned templates, smart reviews, and approval routing in a few clicks.',
      },
      {
        title: 'Investigations',
        description: 'Centralize findings, notes, and regulatory responses with audit-ready logs.',
      },
      {
        title: 'Litigation readiness',
        description: 'Brief builders, deadline tracking, and document bundles for every hearing.',
      },
      {
        title: 'Security by default',
        description: 'Role-based access, encryption, and detailed audit trails across your org.',
      },
      {
        title: 'Insights & reporting',
        description: 'KPIs, trends, and utilization dashboards tailored for leadership.',
      },
    ],
  },
  how: {
    title: 'From intake to insight — in three steps',
    subtitle: 'Launch fast with guided setup and ready-to-use workflows.',
    steps: [
      {
        title: 'Connect',
        description: 'Import matters, contracts, and stakeholders from your existing tools.',
      },
      {
        title: 'Automate',
        description: 'Configure approvals, reminders, and escalations with no code needed.',
      },
      {
        title: 'Monitor',
        description: 'Track SLAs, risks, and progress with real-time dashboards.',
      },
    ],
  },
  screens: {
    title: 'A cohesive workspace for every team',
    subtitle: 'Timeline, kanban, and document-first views adapt to the way you work.',
  },
  pricing: {
    title: 'Flexible plans for growing teams',
    subtitle: 'Choose the tier that fits your governance needs today and tomorrow.',
    plans: [
      {
        name: 'Core',
        price: '$29',
        period: 'per user / mo',
        features: [
          'Matter & contract workspace',
          'Automated reminders',
          'Secure file storage',
          'Email notifications',
        ],
      },
      {
        name: 'Growth',
        price: '$59',
        period: 'per user / mo',
        features: [
          'All Core features',
          'Advanced approvals',
          'Team workspaces',
          'Analytics dashboards',
        ],
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: 'Tailored plan',
        features: [
          'Dedicated success partner',
          'SSO & SCIM',
          'On-prem or cloud',
          'Priority support',
        ],
      },
    ],
  },
  testimonials: {
    title: 'Trusted by modern legal departments',
    subtitle: 'Teams deliver faster responses with complete oversight.',
    items: [
      {
        quote:
          'The automation playbooks reduced our intake-to-approval cycle from days to hours.',
        name: 'Maha Al-Sharif',
        role: 'Head of Legal Operations',
      },
      {
        quote:
          'Having matters, documents, and analytics in one hub changed how we collaborate.',
        name: 'Omar Haddad',
        role: 'Chief Legal Officer',
      },
      {
        quote: 'Security reviews are now audit-ready with zero manual exports.',
        name: 'Sara Ibrahim',
        role: 'Compliance Lead',
      },
    ],
  },
  faq: {
    title: 'Answers to common questions',
    subtitle: 'Everything you need to know before getting started.',
    items: [
      {
        question: 'Can we deploy in a self-hosted environment?',
        answer: 'Yes, we offer both cloud and on-prem options with the same governance controls.',
      },
      {
        question: 'Do you integrate with our existing tools?',
        answer: 'We support SSO, calendar sync, and document storage integrations out of the box.',
      },
      {
        question: 'How does onboarding work?',
        answer: 'Guided setup, migration assistance, and role-based training are included.',
      },
      {
        question: 'Is the platform available in Arabic and English?',
        answer: 'Both languages are supported across the interface with RTL/LTR layouts.',
      },
    ],
  },
  contact: {
    title: 'Ready to see Almadar in action?',
    subtitle: 'Book a demo or start with the interactive preview.',
    cta: 'Talk to an expert',
  },
  login: {
    title: 'Welcome back',
    subtitle: 'Securely access your workspace',
    email: 'Email address',
    password: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    show: 'Show',
    hide: 'Hide',
    submit: 'Sign in',
    success: 'Signed in successfully.',
    error: 'Check your credentials and try again.',
  },
};

const landingAr: TranslationRecord = {
  nav: {
    brand: 'المدار القانونية',
    features: 'المزايا',
    how: 'كيف يعمل',
    screens: 'المنتج',
    pricing: 'الأسعار',
    testimonials: 'آراء العملاء',
    faq: 'الأسئلة الشائعة',
    contact: 'تواصل معنا',
    login: 'تسجيل الدخول',
    getStarted: 'ابدأ الآن',
  },
  hero: {
    badge: 'ذكاء قانوني للمؤسسات',
    title: 'عمليات قانونية حديثة جاهزة للتوسع',
    description:
      'أدر القضايا والعقود والامتثال في مكان واحد مع مساعدين بالذكاء الاصطناعي وأتمتة ذكية ولوحات تحليلات فورية.',
    primaryCta: 'ابدأ الفترة التجريبية',
    secondaryCta: 'استعرض المنتج',
    metrics: {
      cases: 'قضايا نشطة',
      savings: 'ساعات يتم توفيرها شهرياً',
      approvals: 'موافقات مؤتمتة',
      reliability: 'موثوقية الالتزام بالاتفاقيات',
    },
  },
  features: {
    title: 'مصمم لفرق الشؤون القانونية والامتثال',
    subtitle: 'تدفقات عمل مترابطة وأتمتة قوية وحوكمة بمعايير المؤسسات.',
    items: [
      {
        title: 'مركز القضايا والملفات',
        description: 'خط زمني للتكليفات وتتبع الأدلة مع سياق جاهز.',
      },
      {
        title: 'أتمتة العقود',
        description: 'قوالب بإصدارات متعددة ومراجعات ذكية ومسارات موافقات سريعة.',
      },
      {
        title: 'التحقيقات',
        description: 'تجميع النتائج والملاحظات والردود التنظيمية مع سجلات تدقيق جاهزة.',
      },
      {
        title: 'الجاهزية للتقاضي',
        description: 'إعداد المذكرات وتتبع المواعيد وتجميع الملفات لكل جلسة.',
      },
      {
        title: 'الأمان أولاً',
        description: 'صلاحيات وصول مشروطة وتشفير كامل وسجلات تدقيق مفصلة.',
      },
      {
        title: 'التحليلات والتقارير',
        description: 'مؤشرات أداء واتجاهات ولوحات استخدام موجهة للإدارة.',
      },
    ],
  },
  how: {
    title: 'من الاستقبال إلى الرؤية — في ثلاث خطوات',
    subtitle: 'انطلق سريعاً بإعداد موجه وتدفقات عمل جاهزة.',
    steps: [
      {
        title: 'اتصال',
        description: 'استيراد القضايا والعقود وأصحاب المصلحة من الأدوات الحالية.',
      },
      {
        title: 'أتمتة',
        description: 'تهيئة الموافقات والتذكيرات والتصعيدات بدون كود.',
      },
      {
        title: 'مراقبة',
        description: 'متابعة مؤشرات الأداء والمخاطر والتقدم بلوحات لحظية.',
      },
    ],
  },
  screens: {
    title: 'مساحة عمل متكاملة لكل فريق',
    subtitle: 'طرق عرض خط زمني وكانبان ووثائق تتكيف مع أسلوب عملك.',
  },
  pricing: {
    title: 'باقات مرنة للفرق المتنامية',
    subtitle: 'اختر الخطة التي تناسب احتياجات الحوكمة الحالية والقادمة.',
    plans: [
      {
        name: 'الأساسية',
        price: '$29',
        period: 'للمستخدم / شهرياً',
        features: [
          'مساحة عمل للقضايا والعقود',
          'تذكيرات مؤتمتة',
          'تخزين ملفات آمن',
          'تنبيهات عبر البريد',
        ],
      },
      {
        name: 'النمو',
        price: '$59',
        period: 'للمستخدم / شهرياً',
        features: [
          'كل مميزات الأساسية',
          'موافقات متقدمة',
          'مساحات عمل للفرق',
          'لوحات تحليلات',
        ],
      },
      {
        name: 'المؤسسات',
        price: 'مخصص',
        period: 'خطة حسب الطلب',
        features: [
          'مدير نجاح مخصص',
          'دعم SSO و SCIM',
          'سحابي أو داخل المنشأة',
          'دعم أولوية',
        ],
      },
    ],
  },
  testimonials: {
    title: 'موثوق من فرق قانونية حديثة',
    subtitle: 'الفرق تستجيب أسرع مع رقابة كاملة.',
    items: [
      {
        quote: 'قلصت مسارات الأتمتة مدة الموافقات من أيام إلى ساعات.',
        name: 'مها الشريف',
        role: 'رئيس عمليات الشؤون القانونية',
      },
      {
        quote: 'وجود القضايا والملفات والتحليلات في مركز واحد غير طريقة تعاوننا.',
        name: 'عمر حداد',
        role: 'المدير القانوني التنفيذي',
      },
      {
        quote: 'أصبحت مراجعات الأمان جاهزة للتدقيق بدون صادرات يدوية.',
        name: 'سارة إبراهيم',
        role: 'مسؤولة الامتثال',
      },
    ],
  },
  faq: {
    title: 'إجابات لأهم الأسئلة',
    subtitle: 'كل ما تحتاج معرفته قبل البدء.',
    items: [
      {
        question: 'هل يمكن النشر في بيئة ذاتية الاستضافة؟',
        answer: 'نعم، نقدم خيار السحابة أو الاستضافة الداخلية مع نفس ضوابط الحوكمة.',
      },
      {
        question: 'هل تتكاملون مع أدواتنا الحالية؟',
        answer: 'ندعم تسجيل الدخول الموحد، ومزامنة التقويم، وتكامل التخزين مباشرة.',
      },
      {
        question: 'كيف تتم عملية الإعداد؟',
        answer: 'إعداد موجه ومساعدة في الترحيل وتدريب حسب الصلاحيات مشمول.',
      },
      {
        question: 'هل المنصة متاحة بالعربية والإنجليزية؟',
        answer: 'نعم، الواجهات تدعم اللغتين مع تخطيطات RTL/LTR.',
      },
    ],
  },
  contact: {
    title: 'جاهز لاستكشاف المدار؟',
    subtitle: 'احجز عرضاً توضيحياً أو ابدأ بالمعاينة التفاعلية.',
    cta: 'تحدث مع خبير',
  },
  login: {
    title: 'مرحباً بعودتك',
    subtitle: 'دخول آمن إلى مساحة عملك',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    remember: 'تذكرني',
    forgot: 'نسيت كلمة المرور؟',
    show: 'إظهار',
    hide: 'إخفاء',
    submit: 'تسجيل الدخول',
    success: 'تم تسجيل الدخول بنجاح.',
    error: 'تحقق من البيانات وحاول مرة أخرى.',
  },
};

const buildTranslations = (
  base: TranslationRecord,
  overrides: TranslationRecord,
): TranslationRecord => {
  const nestedBase = nestTranslations(base);
  return deepMerge(nestedBase, overrides);
};

export const translations: Record<'ar' | 'en', TranslationRecord> = {
  en: buildTranslations(enBase as TranslationRecord, landingEn),
  ar: buildTranslations(arBase as TranslationRecord, landingAr),
};
