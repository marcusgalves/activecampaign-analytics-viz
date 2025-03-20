
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Filter, X } from 'lucide-react';
import { FILTER_FIELDS, FilterValue, FilterCategory } from '@/types/filters';
import { Badge } from '@/components/ui/badge';

interface FilterDialogProps {
  filters: FilterValue[];
  setFilters: (filters: FilterValue[]) => void;
}

// Base operators for all field types
const BASE_OPERATORS = [
  { value: 'equals', label: 'Igual a' },
];

// Get operators based on field type
const getOperatorsByFieldType = (fieldType: string) => {
  const operators = [...BASE_OPERATORS];
  
  if (fieldType === 'text') {
    operators.push(
      { value: 'contains', label: 'Contém' },
      { value: 'startsWith', label: 'Começa com' },
      { value: 'endsWith', label: 'Termina com' }
    );
  }
  
  if (fieldType === 'number' || fieldType === 'date') {
    operators.push(
      { value: 'greater', label: fieldType === 'date' ? 'Após' : 'Maior que' },
      { value: 'less', label: fieldType === 'date' ? 'Antes' : 'Menor que' },
      { value: 'between', label: 'Entre' }
    );
  }
  
  return operators;
};

const CATEGORIES: Record<FilterCategory, string> = {
  identification: 'Identificação',
  time: 'Tempo',
  performance: 'Performance',
  engagement: 'Engajamento',
  configuration: 'Configuração',
  segmentation: 'Segmentação',
};

export function FilterDialog({ filters, setFilters }: FilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [editingFilters, setEditingFilters] = useState<FilterValue[]>(filters);
  const [currentField, setCurrentField] = useState('');
  const [currentOperator, setCurrentOperator] = useState<string>('equals');
  const [currentValue, setCurrentValue] = useState<string>('');
  const [currentValueEnd, setCurrentValueEnd] = useState<string>('');
  
  // Get the type of the currently selected field
  const getCurrentFieldType = (): string => {
    const field = FILTER_FIELDS.find(f => f.key === currentField);
    return field?.type || 'text';
  };
  
  // Get operators for the current field
  const getOperatorsForCurrentField = () => {
    return getOperatorsByFieldType(getCurrentFieldType());
  };
  
  const handleAddFilter = () => {
    if (!currentField || !currentValue) return;
    
    const field = FILTER_FIELDS.find(f => f.key === currentField);
    if (!field) return;
    
    let processedValue = currentValue;
    let processedValueEnd = currentValueEnd;
    
    // Process the value based on field type
    if (field.type === 'number') {
      processedValue = isNaN(Number(currentValue)) ? '0' : currentValue;
      if (currentOperator === 'between' && currentValueEnd) {
        processedValueEnd = isNaN(Number(currentValueEnd)) ? '0' : currentValueEnd;
      }
    }
    
    const newFilter: FilterValue = {
      field: currentField,
      operator: currentOperator,
      value: processedValue,
      ...(currentOperator === 'between' && { valueEnd: processedValueEnd })
    };
    
    setEditingFilters([...editingFilters, newFilter]);
    resetForm();
  };
  
  const handleRemoveFilter = (index: number) => {
    const newFilters = [...editingFilters];
    newFilters.splice(index, 1);
    setEditingFilters(newFilters);
  };
  
  const resetForm = () => {
    setCurrentField('');
    setCurrentOperator('equals');
    setCurrentValue('');
    setCurrentValueEnd('');
  };
  
  const handleApply = () => {
    setFilters(editingFilters);
    setOpen(false);
  };
  
  const handleCancel = () => {
    setEditingFilters(filters);
    setOpen(false);
  };
  
  const fieldsByCategory = FILTER_FIELDS.reduce<Record<FilterCategory, typeof FILTER_FIELDS>>((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<FilterCategory, typeof FILTER_FIELDS>);
  
  // Function to get a human-readable description of an operator for display
  const getOperatorDescription = (operator: string, fieldType: string): string => {
    const operatorItem = getOperatorsByFieldType(fieldType).find(op => op.value === operator);
    return operatorItem?.label || operator;
  };
  
  // Get input type based on field type
  const getInputType = (fieldType: string): string => {
    switch (fieldType) {
      case 'number': return 'number';
      case 'date': return 'date';
      default: return 'text';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtrar
          {filters.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {filters.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Filtrar campanhas</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          {/* Existing filters */}
          {editingFilters.length > 0 && (
            <div className="border rounded-md p-3 space-y-2">
              <h3 className="font-medium text-sm">Filtros aplicados</h3>
              <div className="flex flex-wrap gap-2">
                {editingFilters.map((filter, index) => {
                  const field = FILTER_FIELDS.find(f => f.key === filter.field);
                  if (!field) return null;
                  
                  return (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <span>
                        {field.label} 
                        {' '}
                        {getOperatorDescription(filter.operator, field.type)}
                        {' '}
                        <strong>{String(filter.value)}</strong>
                        {filter.valueEnd && ` e ${String(filter.valueEnd)}`}
                      </span>
                      <button onClick={() => handleRemoveFilter(index)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Add filter form */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="field">Campo</Label>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(fieldsByCategory).map(([category, fields]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-sm font-medium">
                      {CATEGORIES[category as FilterCategory]}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2 p-2">
                        {fields.map(field => (
                          <Button
                            key={field.key}
                            variant={currentField === field.key ? "default" : "outline"}
                            className="justify-start h-auto py-1 px-2"
                            onClick={() => {
                              setCurrentField(field.key);
                              // Reset operator based on field type
                              setCurrentOperator(field.type === 'text' ? 'contains' : 'equals');
                            }}
                          >
                            {field.label}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            {currentField && (
              <>
                <div>
                  <Label htmlFor="operator">Operador</Label>
                  <Select
                    value={currentOperator}
                    onValueChange={setCurrentOperator}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um operador" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOperatorsForCurrentField().map(op => (
                        <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="value">Valor</Label>
                  <Input
                    id="value"
                    type={getInputType(getCurrentFieldType())}
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="Digite o valor"
                  />
                </div>
                
                {currentOperator === 'between' && (
                  <div>
                    <Label htmlFor="valueEnd">Valor final</Label>
                    <Input
                      id="valueEnd"
                      type={getInputType(getCurrentFieldType())}
                      value={currentValueEnd}
                      onChange={(e) => setCurrentValueEnd(e.target.value)}
                      placeholder="Digite o valor final"
                    />
                  </div>
                )}
                
                <Button 
                  onClick={handleAddFilter} 
                  className="w-full"
                  disabled={!currentValue || (currentOperator === 'between' && !currentValueEnd)}
                >
                  Adicionar filtro
                </Button>
              </>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleApply}>
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
