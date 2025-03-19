
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Campaign, ChartData } from '@/types/campaign';

interface EngagementChartProps {
  campaign: Campaign['campaign'];
}

const EngagementChart: React.FC<EngagementChartProps> = ({ campaign }) => {
  // State for active index (for hover effects)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Parse campaign data
  const sent = parseInt(campaign.send_amt);
  const uniqueOpens = parseInt(campaign.uniqueopens);
  const uniqueClicks = parseInt(campaign.uniquelinkclicks);
  const unopened = sent - uniqueOpens;

  // Calculate percentages
  const openRate = sent > 0 ? (uniqueOpens / sent) * 100 : 0;
  const clickRate = sent > 0 ? (uniqueClicks / sent) * 100 : 0;
  const unopenedRate = 100 - openRate - clickRate;

  // Format percentage with 1 decimal place
  const formatPercent = (value: number): number => {
    return Math.round(value * 10) / 10;
  };

  // Prepare chart data
  const data: ChartData[] = [
    {
      name: 'Opened & Clicked',
      value: uniqueClicks,
      percentage: formatPercent(clickRate),
      color: '#3b82f6' // blue
    },
    {
      name: 'Opened (No Click)',
      value: uniqueOpens - uniqueClicks,
      percentage: formatPercent(openRate - clickRate),
      color: '#93c5fd' // light blue
    },
    {
      name: 'Not Opened',
      value: unopened,
      percentage: formatPercent(unopenedRate),
      color: '#e5e7eb' // gray
    }
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-700">Count: {new Intl.NumberFormat().format(item.value)}</p>
          <p className="text-sm text-gray-700">Percentage: {item.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div 
            key={`legend-${index}`}
            className="flex items-center cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-sm mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className={`text-sm ${activeIndex === index ? 'font-medium' : ''}`}>
              {entry.value}: {data[index].percentage}% 
              ({new Intl.NumberFormat().format(data[index].value)})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Recipient Engagement</h2>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="h-64 chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationBegin={300}
                animationDuration={1000}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                    strokeWidth={activeIndex === index ? 2 : 1}
                    stroke={activeIndex === index ? '#fff' : 'none'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default EngagementChart;
