
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS, SortOption } from '@/types/filters';
import { Badge } from '@/components/ui/badge';

interface SortDialogProps {
  sort: { field: string; direction: 'asc' | 'desc' } | null;
  setSort: (sort: { field: string; direction: 'asc' | 'desc' } | null) => void;
}

export function SortDialog({ sort, setSort }: SortDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(sort);
  
  const sortOptionsByCategory = SORT_OPTIONS.reduce<Record<string, SortOption[]>>((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {});
  
  const CATEGORIES: Record<string, string> = {
    time: 'Tempo',
    performance: 'Performance',
    engagement: 'Engajamento',
    size: 'Tamanho/Alcance',
    alphabetical: 'Alfabética',
    calculated: 'Métricas calculadas',
  };
  
  const handleApply = () => {
    setSort(currentSort);
    setOpen(false);
  };
  
  const handleClear = () => {
    setCurrentSort(null);
  };
  
  const handleCancel = () => {
    setCurrentSort(sort);
    setOpen(false);
  };
  
  const getOptionLabel = (key: string): string => {
    const option = SORT_OPTIONS.find(opt => opt.key === key);
    return option ? option.label : key;
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Ordenar
          {sort && (
            <Badge variant="secondary" className="ml-1">1</Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Ordenar campanhas</DialogTitle>
        </DialogHeader>
        
        <div className="my-4 space-y-4">
          {currentSort && (
            <div className="border rounded-md p-3">
              <h3 className="font-medium text-sm mb-2">Ordenação atual</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center">
                  {getOptionLabel(currentSort.field)}
                  {currentSort.direction === 'asc' ? ' (A-Z)' : ' (Z-A)'}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  Limpar
                </Button>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-medium text-sm mb-2">Ordenar por</h3>
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(sortOptionsByCategory).map(([category, options]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="text-sm font-medium">
                    {CATEGORIES[category]}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2 p-2">
                      {options.map(option => (
                        <div key={option.key} className="flex items-center justify-between">
                          <Button
                            variant={currentSort?.field === option.key ? "default" : "outline"}
                            className="justify-start h-auto py-1 px-2 w-[70%] text-left"
                            onClick={() => setCurrentSort({
                              field: option.key,
                              direction: currentSort?.direction || 'desc'
                            })}
                          >
                            {option.label}
                          </Button>
                          
                          {currentSort?.field === option.key && (
                            <RadioGroup
                              value={currentSort.direction}
                              onValueChange={(val: 'asc' | 'desc') => 
                                setCurrentSort({ ...currentSort, direction: val })
                              }
                              className="flex gap-2"
                            >
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="asc" id={`asc-${option.key}`} />
                                <Label htmlFor={`asc-${option.key}`}>A-Z</Label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="desc" id={`desc-${option.key}`} />
                                <Label htmlFor={`desc-${option.key}`}>Z-A</Label>
                              </div>
                            </RadioGroup>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleApply}>
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
