
import React from 'react';
import { motion } from 'framer-motion';
import { Campaign, CampaignStat } from '@/types/campaign';
import MetricsCard from './MetricsCard';

interface CampaignStatsProps {
  campaign: Campaign['campaign'];
}

const CampaignStats: React.FC<CampaignStatsProps> = ({ campaign }) => {
  // Calculate key metrics
  const sent = parseInt(campaign.send_amt);
  const opens = parseInt(campaign.opens);
  const uniqueOpens = parseInt(campaign.uniqueopens);
  const clicks = parseInt(campaign.linkclicks);
  const uniqueClicks = parseInt(campaign.uniquelinkclicks);
  const bounces = parseInt(campaign.hardbounces) + parseInt(campaign.softbounces);
  const unsubscribes = parseInt(campaign.unsubscribes);
  const replies = parseInt(campaign.uniquereplies);

  // Calculate percentages
  const openRate = sent > 0 ? (uniqueOpens / sent) * 100 : 0;
  const clickRate = uniqueOpens > 0 ? (uniqueClicks / uniqueOpens) * 100 : 0;
  const bounceRate = sent > 0 ? (bounces / sent) * 100 : 0;
  const unsubRate = sent > 0 ? (unsubscribes / sent) * 100 : 0;

  // Format to proper decimal places
  const formatPercent = (value: number): number => {
    return Math.round(value * 10) / 10;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  // Prepare stats array
  const stats: CampaignStat[] = [
    {
      label: 'Delivered',
      value: formatNumber(sent - bounces),
      percentage: formatPercent(((sent - bounces) / sent) * 100),
      icon: 'mail',
      helpText: `${formatNumber(sent)} emails sent with ${formatNumber(bounces)} bounces`
    },
    {
      label: 'Unique Opens',
      value: formatNumber(uniqueOpens),
      percentage: formatPercent(openRate),
      positive: true,
      change: 0, // No previous data available
      icon: 'mail',
      helpText: `${formatNumber(opens)} total opens (some recipients opened multiple times)`
    },
    {
      label: 'Unique Clicks',
      value: formatNumber(uniqueClicks),
      percentage: formatPercent(clickRate),
      positive: true,
      change: 0, // No previous data available
      icon: 'clicks',
      helpText: `${formatNumber(clicks)} total clicks from ${formatNumber(uniqueClicks)} unique clickers`
    },
    {
      label: 'Bounces',
      value: formatNumber(bounces),
      percentage: formatPercent(bounceRate),
      icon: 'bounces',
      helpText: `${formatNumber(parseInt(campaign.hardbounces))} hard bounces, ${formatNumber(parseInt(campaign.softbounces))} soft bounces`
    },
    {
      label: 'Unsubscribes',
      value: formatNumber(unsubscribes),
      percentage: formatPercent(unsubRate),
      icon: 'unsubscribes',
      helpText: `${formatNumber(parseInt(campaign.unsubreasons))} provided reasons for unsubscribing`
    },
    {
      label: 'Replies',
      value: formatNumber(replies),
      icon: 'subscribers',
      helpText: 'Direct replies from campaign recipients'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Campaign Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <MetricsCard 
            key={stat.label} 
            stat={stat}
            delay={index} 
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CampaignStats;
