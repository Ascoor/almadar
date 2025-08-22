import { useEffect, useState } from 'react';
import fakeData from '../../Data';
import { CalendarClock, Clock10, ListChecks  } from 'lucide-react';

const cardStyle = `
  bg-gradient-to-br from-almadar-blue-light/20 to-almadar-blue/10 
  dark:bg-gradient-to-br dark:from-almadar-mint-dark/90 dark:to-almadar-blue-darker/80 
  p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
  transition-all duration-300
`;

const tableStyle = `
  w-full text-center border-collapse rounded-lg overflow-x-auto
`;

const theadStyle = `
  bg-almadar-blue text-white text-sm md:text-base
`;

const thTdStyle = `
  px-4 py-3 border-b border-gray-200 dark:border-gray-700 
  text-gray-700 dark:text-gray-200 text-center font-medium
`;

const rowHoverStyle = `
  hover:bg-almadar-blue/30 dark:hover:bg-almadar-blue/40 transition-all duration-300
`;

const CardWrapper = ({ title, icon, children }) => (
  <div className={cardStyle}>
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-almadar-mint-dark dark:text-yellow-400">
      {icon} {title}
    </h3>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

const ProceduresTable = () => {
  const [procedures, setProcedures] = useState([]);
  useEffect(() => setProcedures(fakeData.procedures), []);

  return (
    <CardWrapper title="قائمة الإجراءات" icon="📋">
      <table className={tableStyle}>
        <thead>
          <tr className={theadStyle}>
            <th className={thTdStyle}>العنوان</th>
            <th className={thTdStyle}>الوصف</th>
          </tr>
        </thead>
        <tbody>
          {procedures.length > 0 ? (
            procedures.map((procedure, index) => (
              <tr key={index} className={rowHoverStyle}>
                <td className={thTdStyle}>{procedure.title}</td>
                <td className={thTdStyle}>{procedure.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className={thTdStyle}>
                لا توجد بيانات متاحة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </CardWrapper>
  );
};

const AnnouncementsTable = () => (
  <CardWrapper title="مواعيد الإعلانات" icon={<CalendarClock />}>
    <table className={tableStyle}>
      <thead>
        <tr className={theadStyle}>
          <th className={thTdStyle}>التاريخ</th>
          <th className={thTdStyle}>الوصف</th>
        </tr>
      </thead>
      <tbody>
        {fakeData.announcement_dates.map((announcement, index) => (
          <tr key={index} className={rowHoverStyle}>
            <td className={thTdStyle}>{announcement.date}</td>
            <td className={thTdStyle}>{announcement.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </CardWrapper>
);

const SessionsTable = () => (
  <CardWrapper title="الجلسات القادمة" icon={<Clock10 />}>
    <table className={tableStyle}>
      <thead>
        <tr className={theadStyle}>
          <th className={thTdStyle}>التاريخ</th>
          <th className={thTdStyle}>الوقت</th>
          <th className={thTdStyle}>الوصف</th>
        </tr>
      </thead>
      <tbody>
        {fakeData.sessions.map((session, index) => (
          <tr key={index} className={rowHoverStyle}>
            <td className={thTdStyle}>{session.date}</td>
            <td className={thTdStyle}>{session.time}</td>
            <td className={thTdStyle}>{session.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </CardWrapper>
);

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => setTasks(fakeData.tasks), []);

  return (
    <CardWrapper title="المهام اليومية" icon={<ListChecks  />}>
      <table className={tableStyle}>
        <thead>
          <tr className={theadStyle}>
            <th className={thTdStyle}>المهمة</th>
            <th className={thTdStyle}>تاريخ الاستحقاق</th>
            <th className={thTdStyle}>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} className={rowHoverStyle}>
              <td className={thTdStyle}>{task.task}</td>
              <td className={thTdStyle}>{task.dueDate}</td>
              <td className={thTdStyle}>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardWrapper>
  );
};

export { ProceduresTable, AnnouncementsTable, SessionsTable, TasksTable };
