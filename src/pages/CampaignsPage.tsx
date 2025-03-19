
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

const ITEMS_PER_PAGE = 10;

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValue[]>([]);
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('all');
  
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
      
      // Transform API response to match our CampaignItem interface
      const campaignItems: CampaignItem[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        cdate: item.cdate,
        sdate: item.sdate,
        ldate: item.ldate,
        screenshot: item.screenshot,
        status: item.status,
        send_amt: item.send_amt,
        total_amt: item.total_amt,
        opens: item.opens,
        uniqueopens: item.uniqueopens,
        linkclicks: item.linkclicks,
        uniquelinkclicks: item.uniquelinkclicks,
        hardbounces: item.hardbounces,
        softbounces: item.softbounces,
        unsubscribes: item.unsubscribes,
        forwards: item.forwards,
        uniqueforwards: item.uniqueforwards,
        replies: item.replies,
        uniquereplies: item.uniquereplies,
        socialshares: item.socialshares,
        trackreads: item.trackreads,
        tracklinks: item.tracklinks,
        public: item.public,
        schedule: item.schedule,
        segmentid: item.segmentid,
        formid: item.formid,
        source: item.source,
      }));
      
      setCampaigns(campaignItems);
      
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
    
    // Apply view mode filtering
    if (viewMode === 'sent') {
      result = result.filter(campaign => 
        campaign.sdate && parseInt(campaign.send_amt) > 0
      );
    } else if (viewMode === 'draft') {
      result = result.filter(campaign => 
        !campaign.sdate || parseInt(campaign.send_amt) === 0
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(campaign => 
        campaign.name.toLowerCase().includes(query) ||
        campaign.id.toLowerCase().includes(query)
      );
    }
    
    // Apply other filters
    if (filters.length > 0) {
      result = result.filter(campaign => {
        return filters.every(filter => {
          const value = campaign[filter.field as keyof CampaignItem];
          
          if (value === undefined || value === null) return false;
          
          const stringValue = String(value).toLowerCase();
          const filterValue = String(filter.value).toLowerCase();
          
          switch (filter.operator) {
            case 'contains':
              return stringValue.includes(filterValue);
            case 'equals':
              return stringValue === filterValue;
            case 'greater':
              return Number(value) > Number(filter.value);
            case 'less':
              return Number(value) < Number(filter.value);
            case 'startsWith':
              return stringValue.startsWith(filterValue);
            case 'endsWith':
              return stringValue.endsWith(filterValue);
            case 'between':
              if (filter.valueEnd) {
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
    
    // Apply sorting
    if (sort) {
      result.sort((a, b) => {
        let fieldA = a[sort.field as keyof CampaignItem];
        let fieldB = b[sort.field as keyof CampaignItem];
        
        // Handle calculated fields
        if (sort.field === 'open_rate') {
          fieldA = parseInt(a.send_amt) > 0 ? parseInt(a.opens) / parseInt(a.send_amt) : 0;
          fieldB = parseInt(b.send_amt) > 0 ? parseInt(b.opens) / parseInt(b.send_amt) : 0;
        } else if (sort.field === 'click_rate') {
          fieldA = parseInt(a.opens) > 0 ? parseInt(a.linkclicks) / parseInt(a.opens) : 0;
          fieldB = parseInt(b.opens) > 0 ? parseInt(b.linkclicks) / parseInt(b.opens) : 0;
        } else if (sort.field === 'bounce_rate') {
          const totalBouncesA = parseInt(a.hardbounces) + parseInt(a.softbounces);
          const totalBouncesB = parseInt(b.hardbounces) + parseInt(b.softbounces);
          fieldA = parseInt(a.send_amt) > 0 ? totalBouncesA / parseInt(a.send_amt) : 0;
          fieldB = parseInt(b.send_amt) > 0 ? totalBouncesB / parseInt(b.send_amt) : 0;
        } else if (sort.field === 'unsubscribe_rate') {
          fieldA = parseInt(a.send_amt) > 0 ? parseInt(a.unsubscribes) / parseInt(a.send_amt) : 0;
          fieldB = parseInt(b.send_amt) > 0 ? parseInt(b.unsubscribes) / parseInt(b.send_amt) : 0;
        } else if (sort.field === 'bounces') {
          fieldA = parseInt(a.hardbounces) + parseInt(a.softbounces);
          fieldB = parseInt(b.hardbounces) + parseInt(b.softbounces);
        }
        
        // Handle dates (empty dates should be sorted last)
        if (sort.field === 'cdate' || sort.field === 'sdate' || sort.field === 'ldate') {
          if (!fieldA) return sort.direction === 'asc' ? 1 : -1;
          if (!fieldB) return sort.direction === 'asc' ? -1 : 1;
          fieldA = new Date(fieldA as string).getTime();
          fieldB = new Date(fieldB as string).getTime();
        }
        
        // Handle numeric fields
        if (typeof fieldA === 'string' && !isNaN(Number(fieldA))) {
          fieldA = Number(fieldA);
        }
        if (typeof fieldB === 'string' && !isNaN(Number(fieldB))) {
          fieldB = Number(fieldB);
        }
        
        // Determine sort order
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
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE));
  
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
              <CampaignsTable 
                campaigns={paginatedCampaigns}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="sent" className="mt-4">
              <CampaignsTable 
                campaigns={paginatedCampaigns}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="draft" className="mt-4">
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
