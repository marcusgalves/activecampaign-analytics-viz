
export type FilterCategory = 
  | 'identification' 
  | 'time' 
  | 'performance' 
  | 'engagement' 
  | 'configuration' 
  | 'segmentation';

export type FilterField = {
  key: string;
  label: string;
  category: FilterCategory;
  type: 'text' | 'date' | 'number' | 'boolean' | 'select';
  options?: {value: string, label: string}[];
};

export type FilterValue = {
  field: string;
  operator: 'contains' | 'equals' | 'greater' | 'less' | 'between' | 'startsWith' | 'endsWith';
  value: string | number | boolean | Date | null;
  valueEnd?: string | number | Date | null;
};

export type SortOption = {
  key: string;
  label: string;
  category: 'time' | 'performance' | 'engagement' | 'size' | 'alphabetical' | 'calculated';
};

export const FILTER_FIELDS: FilterField[] = [
  // Identification
  { key: 'name', label: 'Nome da campanha', category: 'identification', type: 'text' },
  { key: 'type', label: 'Tipo de campanha', category: 'identification', type: 'select', options: [
    {value: 'single', label: 'Single'},
    {value: 'split', label: 'Split'}
  ]},
  { key: 'id', label: 'ID da campanha', category: 'identification', type: 'text' },
  { key: 'source', label: 'Origem', category: 'identification', type: 'text' },
  
  // Time
  { key: 'cdate', label: 'Data de criação', category: 'time', type: 'date' },
  { key: 'mdate', label: 'Data de modificação', category: 'time', type: 'date' },
  { key: 'sdate', label: 'Data de envio', category: 'time', type: 'date' },
  { key: 'created_timestamp', label: 'Timestamp de criação', category: 'time', type: 'date' },
  { key: 'updated_timestamp', label: 'Timestamp de atualização', category: 'time', type: 'date' },
  
  // Performance
  { key: 'status', label: 'Status', category: 'performance', type: 'number' },
  { key: 'opens', label: 'Aberturas', category: 'performance', type: 'number' },
  { key: 'uniqueopens', label: 'Aberturas únicas', category: 'performance', type: 'number' },
  { key: 'linkclicks', label: 'Cliques em links', category: 'performance', type: 'number' },
  { key: 'uniquelinkclicks', label: 'Cliques únicos', category: 'performance', type: 'number' },
  { key: 'subscriberclicks', label: 'Cliques por assinantes', category: 'performance', type: 'number' },
  { key: 'unsubscribes', label: 'Cancelamentos', category: 'performance', type: 'number' },
  { key: 'hardbounces', label: 'Rejeições permanentes', category: 'performance', type: 'number' },
  { key: 'softbounces', label: 'Rejeições temporárias', category: 'performance', type: 'number' },
  
  // Engagement
  { key: 'replies', label: 'Respostas', category: 'engagement', type: 'number' },
  { key: 'uniquereplies', label: 'Respostas únicas', category: 'engagement', type: 'number' },
  { key: 'forwards', label: 'Encaminhamentos', category: 'engagement', type: 'number' },
  { key: 'uniqueforwards', label: 'Encaminhamentos únicos', category: 'engagement', type: 'number' },
  { key: 'socialshares', label: 'Compartilhamentos sociais', category: 'engagement', type: 'number' },
  
  // Configuration
  { key: 'trackreads', label: 'Rastreamento de leituras', category: 'configuration', type: 'select', options: [
    {value: '0', label: 'Desativado'},
    {value: '1', label: 'Ativado'}
  ]},
  { key: 'tracklinks', label: 'Rastreamento de links', category: 'configuration', type: 'select', options: [
    {value: 'all', label: 'Todos'},
    {value: 'mime', label: 'MIME'},
    {value: 'none', label: 'Nenhum'}
  ]},
  { key: 'public', label: 'Pública', category: 'configuration', type: 'select', options: [
    {value: '0', label: 'Não'},
    {value: '1', label: 'Sim'}
  ]},
  { key: 'schedule', label: 'Agendada', category: 'configuration', type: 'select', options: [
    {value: '0', label: 'Não'},
    {value: '1', label: 'Sim'}
  ]},
  
  // Segmentation
  { key: 'segmentid', label: 'ID do segmento', category: 'segmentation', type: 'text' },
  { key: 'formid', label: 'ID do formulário', category: 'segmentation', type: 'text' },
];

export const SORT_OPTIONS: SortOption[] = [
  // Time
  { key: 'cdate', label: 'Data de criação', category: 'time' },
  { key: 'mdate', label: 'Data de modificação', category: 'time' },
  { key: 'sdate', label: 'Data de envio', category: 'time' },
  { key: 'ldate', label: 'Última atividade', category: 'time' },
  { key: 'created_timestamp', label: 'Timestamp de criação', category: 'time' },
  { key: 'updated_timestamp', label: 'Timestamp de atualização', category: 'time' },
  
  // Performance
  { key: 'opens', label: 'Total de aberturas', category: 'performance' },
  { key: 'uniqueopens', label: 'Aberturas únicas', category: 'performance' },
  { key: 'linkclicks', label: 'Total de cliques', category: 'performance' },
  { key: 'uniquelinkclicks', label: 'Cliques únicos', category: 'performance' },
  { key: 'unsubscribes', label: 'Cancelamentos', category: 'performance' },
  { key: 'bounces', label: 'Total de rejeições', category: 'performance' },
  
  // Engagement
  { key: 'replies', label: 'Respostas', category: 'engagement' },
  { key: 'forwards', label: 'Encaminhamentos', category: 'engagement' },
  { key: 'socialshares', label: 'Compartilhamentos', category: 'engagement' },
  
  // Size
  { key: 'send_amt', label: 'Quantidade de envios', category: 'size' },
  { key: 'total_amt', label: 'Quantidade total', category: 'size' },
  
  // Alphabetical
  { key: 'name', label: 'Nome da campanha', category: 'alphabetical' },
  { key: 'id', label: 'ID da campanha', category: 'alphabetical' },
  
  // Calculated
  { key: 'open_rate', label: 'Taxa de abertura', category: 'calculated' },
  { key: 'click_rate', label: 'Taxa de cliques', category: 'calculated' },
  { key: 'bounce_rate', label: 'Taxa de rejeição', category: 'calculated' },
  { key: 'unsubscribe_rate', label: 'Taxa de cancelamento', category: 'calculated' },
];
