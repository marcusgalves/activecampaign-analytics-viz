
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import CampaignHeader from '@/components/CampaignHeader';
import CampaignStats from '@/components/CampaignStats';
import EngagementChart from '@/components/EngagementChart';
import CampaignSelector from '@/components/CampaignSelector';
import { Campaign, CampaignItem } from '@/types/campaign';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Fetch all campaigns on initial load
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Fetch campaign metrics when a campaign is selected
  useEffect(() => {
    if (selectedCampaignId) {
      fetchCampaignMetrics(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  const fetchCampaigns = async () => {
    setIsLoadingCampaigns(true);
    
    try {
      const response = await fetch('https://wk0.growanalytica.com/webhook/get-all-campaigns');
      
      if (!response.ok) {
        throw new Error('Falha ao obter campanhas');
      }
      
      const data = await response.json();
      
      // Transform API response to match our CampaignItem interface
      const campaignItems: CampaignItem[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        cdate: item.cdate,
        sdate: item.sdate,
        ldate: item.ldate,
        screenshot: item.screenshot,
        status: item.status
      }));
      
      setCampaigns(campaignItems);
      
      // Auto-select the first campaign if none is selected yet
      if (campaignItems.length > 0 && !selectedCampaignId) {
        setSelectedCampaignId(campaignItems[0].id);
      }
      
      toast({
        description: "Lista de campanhas atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as campanhas. Tente novamente.",
      });
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const fetchCampaignMetrics = async (campaignId: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://wk0.growanalytica.com/webhook/get-campaign-metrics?id=${campaignId}`);
      
      if (!response.ok) {
        throw new Error('Falha ao obter métricas da campanha');
      }
      
      const data = await response.json();
      setCampaign(data[0]);
    } catch (error) {
      console.error('Erro ao buscar métricas da campanha:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as métricas da campanha. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
  };

  // Loading state with skeleton UI
  if (isLoading && !campaign) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-end mb-6">
          <div className="h-10 bg-gray-200 rounded w-[280px]"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6 h-40">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          
          <div className="h-80 bg-gray-100 rounded-xl p-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex justify-end mb-6">
          <CampaignSelector 
            campaigns={campaigns}
            selectedCampaignId={selectedCampaignId}
            onSelectCampaign={handleSelectCampaign}
            onRefreshCampaigns={fetchCampaigns}
            isLoading={isLoadingCampaigns}
          />
        </div>
        
        {campaign ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <CampaignHeader campaign={campaign.campaign} />
            
            <CampaignStats campaign={campaign.campaign} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <EngagementChart campaign={campaign.campaign} />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-4">Campaign Overview</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="space-y-4">
                    <div className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Campaign Type</span>
                      <span className="font-medium">{campaign.campaign.type.charAt(0).toUpperCase() + campaign.campaign.type.slice(1)}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Recipients</span>
                      <span className="font-medium">{new Intl.NumberFormat().format(parseInt(campaign.campaign.send_amt))}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Unique Opens</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat().format(parseInt(campaign.campaign.uniqueopens))} 
                        <span className="text-xs text-gray-500 ml-1">
                          ({((parseInt(campaign.campaign.uniqueopens) / parseInt(campaign.campaign.send_amt)) * 100).toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Unique Clicks</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat().format(parseInt(campaign.campaign.uniquelinkclicks))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({((parseInt(campaign.campaign.uniquelinkclicks) / parseInt(campaign.campaign.uniqueopens)) * 100).toFixed(1)}% of opens)
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Bounces</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat().format(parseInt(campaign.campaign.hardbounces) + parseInt(campaign.campaign.softbounces))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({((parseInt(campaign.campaign.hardbounces) + parseInt(campaign.campaign.softbounces)) / parseInt(campaign.campaign.send_amt) * 100).toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unsubscribes</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat().format(parseInt(campaign.campaign.unsubscribes))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({((parseInt(campaign.campaign.unsubscribes) / parseInt(campaign.campaign.send_amt)) * 100).toFixed(2)}%)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Selecione uma campanha para visualizar as métricas</h2>
            <p className="mt-2 text-gray-600">Ou atualize a lista de campanhas clicando no botão de atualizar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
