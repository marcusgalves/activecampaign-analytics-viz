
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
  PaginationPrevious,
  PaginationEllipsis
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
  
  const viewCampaign = (campaignId: number) => {
    navigate(`/dashboard/${campaignId}`);
  };
  
  const openExternalReport = (campaignId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://hulisses.activehosted.com/report/#/campaign/${campaignId}/overview`, '_blank');
  };
  
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Rascunho';
      case 1: return 'Agendado';
      case 2: return 'Enviando';
      case 3: return 'Enviado';
      case 5: return 'Concluído';
      default: return 'Desconhecido';
    }
  };
  
  // Renderiza os números de página com elipses quando necessário
  const renderPaginationItems = () => {
    // Só mostraremos no máximo 7 itens na paginação (incluindo elipses)
    const maxVisiblePages = 3;
    const items = [];

    // Sempre mostra a primeira página
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          href="#" 
          isActive={currentPage === 1}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(1);
          }}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calcula o intervalo de páginas a mostrar ao redor da página atual
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Ajusta o startPage se estamos próximos do final
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - maxVisiblePages + 1);
    }

    // Adiciona elipse no início se necessário
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Adiciona as páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Adiciona elipse no final se necessário
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Sempre mostra a última página se totalPages > 1
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            href="#" 
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
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
              <TableHead className="hidden md:table-cell">Status</TableHead>
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
                <TableCell className="hidden md:table-cell">
                  {getStatusText(campaign.status)}
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
              
              {renderPaginationItems()}
              
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
