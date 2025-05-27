import React, { useEffect, useState } from 'react';
import { ServiceIcon, ContractSection, MainLegalCases } from '../../assets/icons'; 
import DashCard from '../common/DashCard';
import { getDashboardCounts } from '../../services/api/dashboard';

const DashboardStats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardCounts();
        const { contracts, litigations, investigations, legal_advices } = response.data;

        setStats([
          {
            title: 'التعاقدات',
            count: contracts.length,
            imageSrc: ContractSection,
            subcategories: [
              { title: 'دولي', count: contracts.filter(c => c.scope === 'local').length },
              { title: 'محلي', count: contracts.filter(c => c.scope === 'international').length },
            ],
          },
          {
            title: 'الرأي والفتوى',
            count: legal_advices.length,
            imageSrc: ServiceIcon,
            subcategories: [
              { title: 'تحقيقات', count: investigations.length },
              { title: 'مشورة', count: legal_advices.length },
            ],
          },
          {
            title: 'القضايا',
            count: litigations.length,
            imageSrc: MainLegalCases,
            subcategories: [
              { title: 'من الشركة', count: litigations.filter(l => l.scope === 'from').length },
              { title: 'ضد الشركة', count: litigations.filter(l => l.scope === 'against').length },
            ],
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {stats.map((stat) => (
        <DashCard
          key={stat.title}
          title={stat.title}
          count={stat.count}
          imageSrc={stat.imageSrc}
          subcategories={stat.subcategories}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
