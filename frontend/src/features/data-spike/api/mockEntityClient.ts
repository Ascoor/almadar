type DemoComment = {
  id: string;
  author: string;
  createdAt: string;
  body: string;
};

type DemoEntity = {
  id: string;
  title: string;
  owner: string;
  status: 'open' | 'in-progress' | 'closed';
  summary: string;
  lastUpdated: string;
  commentCount: number;
  comments: DemoComment[];
};

type DemoPayload = {
  author: string;
  body: string;
};

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const randomId = () => Math.random().toString(36).slice(2, 8);

const demoEntities: Record<string, DemoEntity> = {
  'case-1042': {
    id: 'case-1042',
    title: 'ملف استشارة عقود مع شركة المقاولات المتحدة',
    owner: 'مكتب الاستشارات القانونية',
    status: 'in-progress',
    summary:
      'متابعة عقد صيانة طويل الأجل يتطلب تحديث شروط الجزاءات وضمانات الأداء.',
    lastUpdated: '2024-12-04T10:00:00Z',
    commentCount: 3,
    comments: [
      {
        id: 'c1',
        author: 'إسراء',
        createdAt: '2024-12-02T11:00:00Z',
        body: 'راجعنا مسودة البنود المالية وتم إرسالها للمراجعة النهائية.',
      },
      {
        id: 'c2',
        author: 'أحمد',
        createdAt: '2024-12-01T18:30:00Z',
        body: 'تم الاتفاق مع العميل على تسليم النسخة المحدثة قبل نهاية الأسبوع.',
      },
      {
        id: 'c3',
        author: 'نهى',
        createdAt: '2024-11-28T14:10:00Z',
        body: 'نحتاج تأكيد صلاحية الضمان البنكي قبل توقيع العقد.',
      },
    ],
  },
  'case-2077': {
    id: 'case-2077',
    title: 'نزاع تحكيم تجاري',
    owner: 'قسم المنازعات',
    status: 'open',
    summary: 'تجهيز مذكرة الرد الأولى وتنسيق جلسة الاستماع مع هيئة التحكيم.',
    lastUpdated: '2024-12-03T09:00:00Z',
    commentCount: 1,
    comments: [
      {
        id: 'c4',
        author: 'جلال',
        createdAt: '2024-12-03T09:30:00Z',
        body: 'تم رفع الطلبات العاجلة وننتظر رد الخصم.',
      },
    ],
  },
};

export const demoQueryKeys = {
  entity: (entityId: string) => ['demo-entity', entityId] as const,
  comments: (entityId: string) => ['demo-entity', entityId, 'comments'] as const,
};

export async function fetchDemoEntity(entityId: string): Promise<DemoEntity> {
  await delay();
  const entity = demoEntities[entityId];

  if (!entity) {
    const notFoundError = new Error('Entity not found');
    (notFoundError as Error & { status?: number }).status = 404;
    throw notFoundError;
  }

  return structuredClone(entity);
}

export async function fetchDemoComments(
  entityId: string,
): Promise<DemoComment[]> {
  await delay(180);
  const entity = demoEntities[entityId];

  if (!entity) {
    const notFoundError = new Error('Entity not found');
    (notFoundError as Error & { status?: number }).status = 404;
    throw notFoundError;
  }

  return structuredClone(entity.comments);
}

export async function addDemoComment(
  entityId: string,
  payload: DemoPayload,
): Promise<DemoComment> {
  await delay(220);

  if (payload.body.toLowerCase().includes('مرفوض')) {
    const forbiddenError = new Error('Forbidden');
    (forbiddenError as Error & { status?: number }).status = 403;
    throw forbiddenError;
  }

  const entity = demoEntities[entityId];
  if (!entity) {
    const notFoundError = new Error('Entity not found');
    (notFoundError as Error & { status?: number }).status = 404;
    throw notFoundError;
  }

  const newComment: DemoComment = {
    id: randomId(),
    author: payload.author,
    body: payload.body,
    createdAt: new Date().toISOString(),
  };

  entity.comments = [newComment, ...entity.comments];
  entity.commentCount += 1;
  entity.lastUpdated = new Date().toISOString();

  return structuredClone(newComment);
}
