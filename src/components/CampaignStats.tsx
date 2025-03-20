
import React from 'react';
import { motion } from 'framer-motion';
import { Campaign, CampaignStat } from '@/types/campaign';
import MetricsCard from './MetricsCard';

interface CampaignStatsProps {
  campaign: Campaign['campaign'];
}

const CampaignStats: React.FC<CampaignStatsProps> = ({ campaign }) => {
  // Calcular métricas principais
  const sent = parseInt(campaign.send_amt || '0');
  const opens = parseInt(campaign.opens || '0');
  const uniqueOpens = parseInt(campaign.uniqueopens || '0');
  const clicks = parseInt(campaign.linkclicks || '0');
  const uniqueClicks = parseInt(campaign.uniquelinkclicks || '0');
  const bounces = parseInt(campaign.hardbounces || '0') + parseInt(campaign.softbounces || '0');
  const unsubscribes = parseInt(campaign.unsubscribes || '0');
  const replies = parseInt(campaign.uniquereplies || '0');

  // Calcular percentuais
  const openRate = sent > 0 ? (uniqueOpens / sent) * 100 : 0;
  const clickRate = uniqueOpens > 0 ? (uniqueClicks / uniqueOpens) * 100 : 0;
  const bounceRate = sent > 0 ? (bounces / sent) * 100 : 0;
  const unsubRate = sent > 0 ? (unsubscribes / sent) * 100 : 0;

  // Formatar para casas decimais apropriadas
  const formatPercent = (value: number): number => {
    return Math.round(value * 10) / 10;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  // Preparar array de estatísticas
  const stats: CampaignStat[] = [
    {
      label: 'Entregues',
      value: formatNumber(sent - bounces),
      percentage: formatPercent(((sent - bounces) / sent) * 100),
      icon: 'mail',
      helpText: `${formatNumber(sent)} emails enviados com ${formatNumber(bounces)} devoluções. As entregas representam a quantidade de emails que chegaram às caixas de entrada dos destinatários.`
    },
    {
      label: 'Aberturas Únicas',
      value: formatNumber(uniqueOpens),
      percentage: formatPercent(openRate),
      positive: true,
      change: 0, // Dados anteriores não disponíveis
      icon: 'mail',
      helpText: `${formatNumber(opens)} aberturas totais (alguns destinatários abriram várias vezes). A taxa de abertura é um indicador fundamental da eficácia do assunto do email.`
    },
    {
      label: 'Cliques Únicos',
      value: formatNumber(uniqueClicks),
      percentage: formatPercent(clickRate),
      positive: true,
      change: 0, // Dados anteriores não disponíveis
      icon: 'clicks',
      helpText: `${formatNumber(clicks)} cliques totais de ${formatNumber(uniqueClicks)} clicadores únicos. A taxa de cliques mostra o engajamento com o conteúdo do email.`
    },
    {
      label: 'Devoluções',
      value: formatNumber(bounces),
      percentage: formatPercent(bounceRate),
      icon: 'bounces',
      helpText: `${formatNumber(parseInt(campaign.hardbounces || '0'))} devoluções permanentes, ${formatNumber(parseInt(campaign.softbounces || '0'))} devoluções temporárias. Devoluções permanentes indicam problemas como endereços inexistentes, enquanto devoluções temporárias podem indicar caixas cheias ou problemas temporários.`
    },
    {
      label: 'Cancelamentos',
      value: formatNumber(unsubscribes),
      percentage: formatPercent(unsubRate),
      icon: 'unsubscribes',
      helpText: `${formatNumber(parseInt(campaign.unsubreasons || '0'))} forneceram motivos para o cancelamento. Uma taxa de cancelamento elevada pode indicar problemas com a relevância do conteúdo ou frequência de envios.`
    },
    {
      label: 'Respostas',
      value: formatNumber(replies),
      icon: 'subscribers',
      helpText: 'Respostas diretas dos destinatários da campanha. As respostas são um excelente indicador de engajamento e podem fornecer feedback valioso.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Desempenho da Campanha</h2>
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
