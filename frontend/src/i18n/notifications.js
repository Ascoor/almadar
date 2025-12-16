export const notificationDict = {
    ar: {
      'assignment.updated.title': '📌 تحديث الإسناد',
      'assignment.updated.message': ({ title, context }) =>
        context === 'contracts'
          ? `تم إسناد العقد رقم: ${title}`
          : `تم تحديث الإسناد: ${title}`,
  
      'permissions.updated.title': '🔐 صلاحيات جديدة',
      'permissions.updated.message': () => 'تم استلام صلاحيات جديدة.',
  
      'default.title': '🔔 إشعار جديد',
      'default.message': () => 'لديك إشعار جديد',
    },
  
    en: {
      'assignment.updated.title': '📌 Assignment Updated',
      'assignment.updated.message': ({ title, context }) =>
        context === 'contracts'
          ? `Assigned contract #: ${title}`
          : `Assignment updated: ${title}`,
  
      'permissions.updated.title': '🔐 New Permissions',
      'permissions.updated.message': () => 'Your permissions have been updated.',
  
      'default.title': '🔔 New Notification',
      'default.message': () => 'You have a new notification',
    },
  };
  