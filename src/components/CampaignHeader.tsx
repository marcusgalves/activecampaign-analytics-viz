
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Mail, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { Button } from '@/components/ui/button';

interface CampaignHeaderProps {
  campaign: Campaign['campaign'];
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ campaign }) => {
  // Format dates nicely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy • h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <div className="flex flex-col space-y-2 md:items-center md:flex-row md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              <Mail className="w-3 h-3 mr-1" />
              Campaign ID: {campaign.id}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => window.open(`https://hulisses.activehosted.com/report/#/campaign/${campaign.id}/overview`, '_blank')}
            >
              Ver relatório
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {campaign.name}
          </h1>
        </div>
        
        {campaign.screenshot && (
          <div className="mt-2 md:mt-0 flex-shrink-0">
            <img 
              src={campaign.screenshot.replace('//hulisses', 'https://hulisses')} 
              alt="Campaign preview" 
              className="h-16 w-auto rounded border border-gray-200 shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          <span>Created: {formatDate(campaign.cdate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          <span>Sent: {formatDate(campaign.sdate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span>Last activity: {formatDate(campaign.ldate)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignHeader;
