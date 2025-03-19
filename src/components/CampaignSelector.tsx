
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CampaignItem } from '@/types/campaign';

interface CampaignSelectorProps {
  campaigns: CampaignItem[];
  selectedCampaignId: string | null;
  onSelectCampaign: (campaignId: string) => void;
  onRefreshCampaigns: () => void;
  isLoading: boolean;
}

const CampaignSelector: React.FC<CampaignSelectorProps> = ({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
  onRefreshCampaigns,
  isLoading
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2"
    >
      <Select
        value={selectedCampaignId || ""}
        onValueChange={onSelectCampaign}
        disabled={campaigns.length === 0 || isLoading}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Selecione uma campanha" />
        </SelectTrigger>
        <SelectContent>
          {campaigns.map((campaign) => (
            <SelectItem key={campaign.id} value={campaign.id}>
              {campaign.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onRefreshCampaigns}
        disabled={isLoading}
        className="relative"
        title="Atualizar lista de campanhas"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </motion.div>
  );
};

export default CampaignSelector;
