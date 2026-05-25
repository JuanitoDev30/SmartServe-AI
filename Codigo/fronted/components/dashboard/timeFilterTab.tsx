type TimeFilter = 'hoy' | 'semana' | 'mes';

const timeFilterLabels: Record<TimeFilter, string> = {
  hoy: 'Hoy',
  semana: 'Esta semana',
  mes: 'Este mes',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const Filters = () => {
  return <div>filters</div>;
};
