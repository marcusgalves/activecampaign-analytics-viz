
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import CampaignHeader from '@/components/CampaignHeader';
import CampaignStats from '@/components/CampaignStats';
import EngagementChart from '@/components/EngagementChart';
import { Campaign } from '@/types/campaign';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  // Fetch campaign metrics when a campaign ID is provided
  useEffect(() => {
    if (campaignId) {
      fetchCampaignMetrics(campaignId);
    } else {
      // If no campaign ID is provided, redirect to campaigns page
      navigate('/');
    }
  }, [campaignId]);

  const fetchCampaignMetrics = async (id: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://wk0.growanalytica.com/webhook/get-campaign-metrics?id=${id}`);
      
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

  const refreshCampaignData = () => {
    if (campaignId) {
      fetchCampaignMetrics(campaignId);
    }
  };

  // Loading state with skeleton UI
  if (isLoading && !campaign) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
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
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para campanhas
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={refreshCampaignData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar dados
          </Button>
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
            <h2 className="text-2xl font-bold text-gray-800">Campanha não encontrada</h2>
            <p className="mt-2 text-gray-600">
              A campanha solicitada não foi encontrada ou ocorreu um erro ao carregar os dados.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Voltar para a lista de campanhas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
