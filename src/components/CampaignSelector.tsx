
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CampaignItem } from '@/types/campaign';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CampaignSelectorProps {
  campaigns: CampaignItem[];
  selectedCampaignId: number | null;
  onSelectCampaign: (campaignId: number) => void;
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
  const [open, setOpen] = useState(false);
  
  // Find selected campaign name to display in the trigger
  const selectedCampaign = campaigns.find(
    (campaign) => campaign.id === selectedCampaignId
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
            disabled={campaigns.length === 0 || isLoading}
          >
            {selectedCampaign ? selectedCampaign.name : "Selecione uma campanha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Buscar campanha..." className="h-9" />
            <CommandEmpty>Nenhuma campanha encontrada.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {campaigns.map((campaign) => (
                  <CommandItem
                    key={campaign.id}
                    value={campaign.name}
                    onSelect={() => {
                      onSelectCampaign(campaign.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${selectedCampaignId === campaign.id ? "opacity-100" : "opacity-0"}`}
                    />
                    {campaign.name}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
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
