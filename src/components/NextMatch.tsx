import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Match } from '../types';
import { Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';

const CORINTHIANS_ID = 65; // Updated to correct Corinthians ID

interface ChampionshipMatches {
  [key: string]: Match[];
}

export function NextMatch() {
  const { data: nextMatches, isLoading } = useQuery<ChampionshipMatches>({
    queryKey: ['nextMatch'],
    queryFn: async () => {
      const { data } = await api.get(`/times/${CORINTHIANS_ID}/partidas/proximas`);
      return data;
    },
    staleTime: 1000 * 60 * 15,
  });

  const nextMatch = nextMatches 
    ? Object.values(nextMatches)
        .flat()
        .sort((a, b) => 
          new Date(a.data_realizacao).getTime() - 
          new Date(b.data_realizacao).getTime()
        )[0]
    : undefined;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 bg-black p-8 rounded-2xl">
        <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-8"></div>
        <div className="flex justify-between">
          <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
          <div className="w-32 h-32 bg-gray-700 rounded"></div>
          <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!nextMatch) {
    return (
      <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
        <div className="bg-black p-4">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-bold">Próxima Partida</h2>
          </div>
        </div>
        
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            Nenhuma partida agendada no momento
          </h3>
          <p className="text-gray-500">
            Fique ligado para informações sobre os próximos jogos do Timão
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
      <div className="bg-black p-4">
        <div className="flex items-center justify-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-bold">Próxima Partida</h2>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <TeamDisplay
            escudo={nextMatch.time_mandante.escudo}
            nome={nextMatch.time_mandante.nome_popular}
            isMandante={true}
          />

          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold mb-4">VS</div>
            <MatchInfo match={nextMatch} />
          </div>

          <TeamDisplay
            escudo={nextMatch.time_visitante.escudo}
            nome={nextMatch.time_visitante.nome_popular}
            isMandante={false}
          />
        </div>
      </div>
    </div>
  );
}

function TeamDisplay({ escudo, nome, isMandante }: { escudo: string; nome: string; isMandante: boolean }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-white rounded-full opacity-25 group-hover:opacity-50 blur transition duration-500" />
        <img 
          src={escudo} 
          alt={nome}
          className="relative w-24 h-24 object-contain"
        />
      </div>
      <div className="text-center">
        <span className="text-sm text-gray-400 block mb-1">
          {isMandante ? 'Mandante' : 'Visitante'}
        </span>
        <span className="font-medium block">{nome}</span>
      </div>
    </div>
  );
}

function MatchInfo({ match }: { match: Match }) {
  return (
    <div className="space-y-3 text-center">
      <div className="flex items-center justify-center space-x-2 text-gray-400">
        <Calendar className="w-4 h-4" />
        <span>{match.data_realizacao}</span>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-gray-400">
        <Clock className="w-4 h-4" />
        <span>{match.hora_realizacao}</span>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-gray-400">
        <MapPin className="w-4 h-4" />
        <span>{match.estadio.nome_popular}</span>
      </div>
    </div>
  );
}