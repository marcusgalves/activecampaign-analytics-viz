
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignsTable } from "@/components/CampaignsTable";
import { FilterDialog } from "@/components/FilterDialog";
import { SortDialog } from "@/components/SortDialog";
import { CampaignItem } from '@/types/campaign';
import { FilterValue } from '@/types/filters';
import { RefreshCw, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Fetch all campaigns on initial load
  useEffect(() => {
    fetchCampaigns();
  }, []);
  
  // Apply filters, sorting and search whenever they change
  useEffect(() => {
    applyFiltersAndSort();
  }, [campaigns, filters, sort, searchQuery, viewMode]);
  
  const fetchCampaigns = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://wk0.growanalytica.com/webhook/get-all-campaigns');
      
      if (!response.ok) {
        throw new Error('Falha ao obter campanhas');
      }
      
      const data = await response.json();
      
      // Transformar a resposta da API para corresponder à nossa interface CampaignItem
      setCampaigns(data);
      
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
      setIsLoading(false);
    }
  };
  
  const applyFiltersAndSort = () => {
    setCurrentPage(1);
    let result = [...campaigns];
    
    // Aplicar filtragem por modo de visualização
    if (viewMode === 'sent') {
      result = result.filter(campaign => 
        campaign.sdate !== null && campaign.sdate !== undefined && campaign.sdate !== ''
      );
    } else if (viewMode === 'draft') {
      result = result.filter(campaign => 
        !campaign.sdate || campaign.sdate === '' || campaign.sdate === null
      );
    }
    
    // Aplicar consulta de pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(campaign => 
        (campaign.name && campaign.name.toLowerCase().includes(query)) ||
        (campaign.id && campaign.id.toString().includes(query))
      );
    }
    
    // Aplicar outros filtros
    if (filters.length > 0) {
      result = result.filter(campaign => {
        return filters.every(filter => {
          const value = campaign[filter.field as keyof CampaignItem];
          
          // Skip if value is undefined or null (unless we're looking for emptiness)
          if (value === undefined || value === null) {
            // If operator is equals and filter value is empty, consider it a match
            return filter.operator === 'equals' && 
                  (filter.value === null || filter.value === '' || filter.value === '0');
          }
          
          // Convert to string for easier comparison
          const stringValue = String(value).toLowerCase();
          const filterValue = String(filter.value).toLowerCase();
          
          // Handle different filter operators
          switch (filter.operator) {
            case 'contains':
              return stringValue.includes(filterValue);
            case 'equals':
              return stringValue === filterValue;
            case 'greater':
              // For dates
              if (filter.field.includes('date') || filter.field.includes('timestamp')) {
                const dateValue = new Date(value as string).getTime();
                const filterDate = new Date(filter.value as string).getTime();
                return dateValue > filterDate;
              }
              // For numbers
              return Number(value) > Number(filter.value);
            case 'less':
              // For dates
              if (filter.field.includes('date') || filter.field.includes('timestamp')) {
                const dateValue = new Date(value as string).getTime();
                const filterDate = new Date(filter.value as string).getTime();
                return dateValue < filterDate;
              }
              // For numbers
              return Number(value) < Number(filter.value);
            case 'startsWith':
              return stringValue.startsWith(filterValue);
            case 'endsWith':
              return stringValue.endsWith(filterValue);
            case 'between':
              if (filter.valueEnd) {
                // For dates
                if (filter.field.includes('date') || filter.field.includes('timestamp')) {
                  const dateValue = new Date(value as string).getTime();
                  const startDate = new Date(filter.value as string).getTime();
                  const endDate = new Date(filter.valueEnd as string).getTime();
                  return dateValue >= startDate && dateValue <= endDate;
                }
                // For numbers
                const num = Number(value);
                return num >= Number(filter.value) && num <= Number(filter.valueEnd);
              }
              return false;
            default:
              return true;
          }
        });
      });
    }
    
    // Aplicar ordenação
    if (sort) {
      result.sort((a, b) => {
        let fieldA = a[sort.field as keyof CampaignItem];
        let fieldB = b[sort.field as keyof CampaignItem];
        
        // Handle undefined/null values - always put them at the bottom
        if (fieldA === undefined || fieldA === null) {
          return sort.direction === 'asc' ? 1 : -1;
        }
        if (fieldB === undefined || fieldB === null) {
          return sort.direction === 'asc' ? -1 : 1;
        }
        
        // Lidar com campos calculados
        if (sort.field === 'open_rate') {
          const opensA = parseInt(a.opens || '0');
          const opensB = parseInt(b.opens || '0');
          const sendAmtA = parseInt(a.send_amt || '1');
          const sendAmtB = parseInt(b.send_amt || '1');
          
          fieldA = sendAmtA > 0 ? parseInt(a.uniqueopens || '0') / sendAmtA : 0;
          fieldB = sendAmtB > 0 ? parseInt(b.uniqueopens || '0') / sendAmtB : 0;
        } else if (sort.field === 'click_rate') {
          const opensA = parseInt(a.opens || '0');
          const opensB = parseInt(b.opens || '0');
          
          fieldA = opensA > 0 ? parseInt(a.linkclicks || '0') / opensA : 0;
          fieldB = opensB > 0 ? parseInt(b.linkclicks || '0') / opensB : 0;
        } else if (sort.field === 'bounce_rate') {
          const totalBouncesA = parseInt(a.hardbounces || '0') + parseInt(a.softbounces || '0');
          const totalBouncesB = parseInt(b.hardbounces || '0') + parseInt(b.softbounces || '0');
          const sendAmtA = parseInt(a.send_amt || '1');
          const sendAmtB = parseInt(b.send_amt || '1');
          
          fieldA = sendAmtA > 0 ? totalBouncesA / sendAmtA : 0;
          fieldB = sendAmtB > 0 ? totalBouncesB / sendAmtB : 0;
        } else if (sort.field === 'unsubscribe_rate') {
          const sendAmtA = parseInt(a.send_amt || '1');
          const sendAmtB = parseInt(b.send_amt || '1');
          
          fieldA = sendAmtA > 0 ? parseInt(a.unsubscribes || '0') / sendAmtA : 0;
          fieldB = sendAmtB > 0 ? parseInt(b.unsubscribes || '0') / sendAmtB : 0;
        } else if (sort.field === 'bounces') {
          fieldA = parseInt(a.hardbounces || '0') + parseInt(a.softbounces || '0');
          fieldB = parseInt(b.hardbounces || '0') + parseInt(b.softbounces || '0');
        }
        
        // Lidar com datas
        if (sort.field === 'cdate' || sort.field === 'sdate' || sort.field === 'ldate' || 
            sort.field === 'mdate' || sort.field.includes('timestamp')) {
          if (!fieldA) return sort.direction === 'asc' ? 1 : -1;
          if (!fieldB) return sort.direction === 'asc' ? -1 : 1;
          
          fieldA = new Date(fieldA as string).getTime();
          fieldB = new Date(fieldB as string).getTime();
        }
        
        // Lidar com campos numéricos
        if (typeof fieldA === 'string' && !isNaN(Number(fieldA))) {
          fieldA = Number(fieldA);
        }
        if (typeof fieldB === 'string' && !isNaN(Number(fieldB))) {
          fieldB = Number(fieldB);
        }
        
        // Determinar ordem de classificação
        if (fieldA < fieldB) {
          return sort.direction === 'asc' ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return sort.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredCampaigns(result);
  };
  
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / itemsPerPage));
  
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Resetar para a primeira página ao mudar a quantidade de itens
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Campanhas
              </h1>
              <p className="text-gray-600">
                Gerencie e analise as campanhas de email marketing
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={fetchCampaigns}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar campanhas por nome ou ID..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <FilterDialog filters={filters} setFilters={setFilters} />
              <SortDialog sort={sort} setSort={setSort} />
            </div>
          </div>
          
          <Tabs defaultValue="all" value={viewMode} onValueChange={setViewMode}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="sent">Enviadas</TabsTrigger>
              <TabsTrigger value="draft">Rascunhos</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Itens por página:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CampaignsTable 
                campaigns={paginatedCampaigns}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="sent" className="mt-4">
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Itens por página:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CampaignsTable 
                campaigns={paginatedCampaigns}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="draft" className="mt-4">
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Itens por página:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CampaignsTable 
                campaigns={paginatedCampaigns}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignsPage;
