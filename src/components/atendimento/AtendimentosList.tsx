
import { MessageSquare, User, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AtendimentoCard } from './AtendimentoCard';

interface Atendimento {
  id: number;
  cliente: string;
  telefone: string;
  ultimaMensagem: string;
  tempo: string;
  setor: string;
  agente?: string;
  tags?: string[];
  status: 'novos' | 'em-atendimento' | 'pendentes' | 'finalizados';
  transferencia?: {
    de: string;
    motivo: string;
    dataTransferencia: string;
  };
}

interface AtendimentosListProps {
  atendimentos: Atendimento[];
  onSelectAtendimento: (atendimento: Atendimento) => void;
  selectedAtendimento?: Atendimento | null;
  isMobile?: boolean;
}

export function AtendimentosList({ 
  atendimentos, 
  onSelectAtendimento, 
  selectedAtendimento,
  isMobile = false
}: AtendimentosListProps) {
  const atendimentosAbertos = atendimentos.filter(a => a.status === 'novos' || a.status === 'em-atendimento');
  const atendimentosPendentes = atendimentos.filter(a => a.status === 'pendentes');

  // Separar transferências para destacar no topo
  const transferencias = atendimentosAbertos.filter(a => a.transferencia);
  const atendimentosNormais = atendimentosAbertos.filter(a => !a.transferencia);

  const handleSelectAtendimento = (atendimento: Atendimento) => {
    onSelectAtendimento(atendimento);
  };

  return (
    <div className="space-y-6">
      {/* Mensagens em Aberto */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
              Mensagens em Aberto
            </h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {atendimentosAbertos.length}
            </Badge>
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-4 space-y-3">
            {/* Transferências destacadas no topo */}
            {transferencias.map((atendimento) => (
              <div key={atendimento.id} className="relative">
                {/* Indicador de transferência */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-2">
                  <div className="flex items-center text-xs text-orange-700">
                    <ArrowRight className="w-3 h-3 mr-1" />
                    <span className="font-medium">Transferência</span>
                    <span className="mx-1">•</span>
                    <span>de {atendimento.transferencia?.de}</span>
                    <span className="mx-1">•</span>
                    <span>{atendimento.transferencia?.dataTransferencia}</span>
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    <strong>Motivo:</strong> {atendimento.transferencia?.motivo}
                  </div>
                </div>
                
                <div 
                  className={`cursor-pointer transition-all ${
                    selectedAtendimento?.id === atendimento.id 
                      ? 'ring-2 ring-orange-500 ring-opacity-50' 
                      : ''
                  }`}
                  onClick={() => handleSelectAtendimento(atendimento)}
                >
                  <AtendimentoCard {...atendimento} onClick={() => {}} />
                </div>
              </div>
            ))}

            {/* Atendimentos normais */}
            {atendimentosNormais.length > 0 ? (
              atendimentosNormais.map((atendimento) => (
                <div 
                  key={atendimento.id}
                  className={`cursor-pointer transition-all ${
                    selectedAtendimento?.id === atendimento.id 
                      ? 'ring-2 ring-blue-500 ring-opacity-50' 
                      : ''
                  }`}
                  onClick={() => handleSelectAtendimento(atendimento)}
                >
                  <AtendimentoCard {...atendimento} onClick={() => {}} />
                </div>
              ))
            ) : transferencias.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma mensagem em aberto</p>
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </div>

      {/* Atendimentos Pendentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              Atendimentos Pendentes
            </h3>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {atendimentosPendentes.length}
            </Badge>
          </div>
        </div>
        
        <ScrollArea className="h-80">
          <div className="p-4 space-y-3">
            {atendimentosPendentes.length > 0 ? (
              atendimentosPendentes.map((atendimento) => (
                <div 
                  key={atendimento.id}
                  className={`cursor-pointer transition-all ${
                    selectedAtendimento?.id === atendimento.id 
                      ? 'ring-2 ring-orange-500 ring-opacity-50' 
                      : ''
                  }`}
                  onClick={() => handleSelectAtendimento(atendimento)}
                >
                  <AtendimentoCard {...atendimento} onClick={() => {}} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhum atendimento pendente</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
