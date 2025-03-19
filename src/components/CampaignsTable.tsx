
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { CampaignItem } from '@/types/campaign';
import { Button } from '@/components/ui/button';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface CampaignsTableProps {
  campaigns: CampaignItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function CampaignsTable({ 
  campaigns, 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading
}: CampaignsTableProps) {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy • HH:mm', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  const viewCampaign = (campaignId: string) => {
    navigate(`/dashboard/${campaignId}`);
  };
  
  const openExternalReport = (campaignId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://hulisses.activehosted.com/report/#/campaign/${campaignId}/overview`, '_blank');
  };
  
  if (isLoading) {
    return (
      <div className="w-full rounded-md border">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-full mb-1"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded w-full mb-1"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!campaigns.length) {
    return (
      <div className="w-full rounded-md border p-8 text-center">
        <p className="text-gray-500">Nenhuma campanha encontrada.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Campanha</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Data de criação</TableHead>
              <TableHead className="hidden md:table-cell">Data de envio</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow 
                key={campaign.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => viewCampaign(campaign.id)}
              >
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{campaign.id}</TableCell>
                <TableCell>
                  <span className="capitalize">{campaign.type}</span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(campaign.cdate)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(campaign.sdate)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 gap-1"
                      onClick={(e) => openExternalReport(campaign.id, e)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">Relatório</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 gap-1"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="hidden sm:inline">Visualizar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
