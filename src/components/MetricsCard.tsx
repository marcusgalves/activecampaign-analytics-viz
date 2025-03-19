
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  MousePointer, 
  UserCheck, 
  AlertTriangle, 
  UserX 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CampaignStat } from '@/types/campaign';

interface MetricsCardProps {
  stat: CampaignStat;
  className?: string;
  delay?: number;
}

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export const MetricsCard: React.FC<MetricsCardProps> = ({ 
  stat, 
  className,
  delay = 0 
}) => {
  // Get the appropriate icon based on stat type
  const getIcon = () => {
    switch(stat.icon) {
      case 'mail':
        return <Mail className="h-5 w-5 text-primary/80" />;
      case 'clicks':
        return <MousePointer className="h-5 w-5 text-blue-600/80" />;
      case 'subscribers':
        return <UserCheck className="h-5 w-5 text-green-600/80" />;
      case 'bounces':
        return <AlertTriangle className="h-5 w-5 text-amber-500/80" />;
      case 'unsubscribes':
        return <UserX className="h-5 w-5 text-rose-600/80" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: delay * 0.1 }}
      className={cn(
        "metrics-card flex flex-col card-highlight",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="subtle-text">{stat.label}</span>
        {getIcon()}
      </div>
      
      <div className="mt-1">
        <div className="flex items-baseline">
          <h3 className="text-2xl font-semibold tracking-tight">{stat.value}</h3>
          {stat.percentage && (
            <span className="ml-2 text-sm font-medium text-gray-600">
              ({stat.percentage}%)
            </span>
          )}
        </div>
        
        {stat.change !== undefined && (
          <div className="flex items-center mt-1">
            {stat.positive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-500 mr-1" />
            )}
            <span className={cn(
              "text-xs font-medium",
              stat.positive ? "text-green-500" : "text-rose-500"
            )}>
              {stat.change > 0 ? '+' : ''}{stat.change}%
            </span>
          </div>
        )}
      </div>
      
      {stat.helpText && (
        <div className="mt-auto pt-3 text-xs text-gray-500">
          {stat.helpText}
        </div>
      )}
    </motion.div>
  );
};

export default MetricsCard;
