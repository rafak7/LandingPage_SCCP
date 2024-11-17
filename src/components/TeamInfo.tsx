import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Team } from '../types';
import { Trophy, Star, Calendar, Users } from 'lucide-react';
import CountUp from 'react-countup';

const CORINTHIANS_ID = 65; // Updated to correct Corinthians ID

export function TeamInfo() {
  const { data: team, isLoading } = useQuery<Team>({
    queryKey: ['team'],
    queryFn: async () => {
      const { data } = await api.get(`/times/${CORINTHIANS_ID}`);
      return data;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
        <div className="h-6 w-48 bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-black to-white/10 p-8 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
      
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-shrink-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-white rounded-full opacity-25 group-hover:opacity-50 blur transition duration-500" />
            <img 
              src={team?.escudo} 
              alt="Corinthians" 
              className="relative w-40 h-40 object-contain"
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">{team?.nome_popular}</h1>
          <p className="text-gray-400 mb-6">Fundado em 1910{team?.fundacao}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Stat
              icon={<Trophy className="w-5 h-5" />}
              label="Títulos Brasileiros"
              value="7"
            />
            <Stat
              icon={<Star className="w-5 h-5" />}
              label="Libertadores"
              value="1"
            />
            <Stat
              icon={<Calendar className="w-5 h-5" />}
              label="Anos de História"
              value="114"
            />
            <Stat
              icon={<Users className="w-5 h-5" />}
              label="Milhões de Torcedores"
              value="30+"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  // Função para extrair o número do valor string
  const getNumericValue = (val: string) => {
    const num = parseFloat(val.replace('+', ''));
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="flex items-center space-x-3 bg-gradient-to-r from-black/50 to-white/10 rounded-lg p-4 transition-colors hover:bg-white/10">
      <div className="text-gray-300">{icon}</div>
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-xl font-bold">
          <CountUp
            end={getNumericValue(value)}
            duration={2.5}
            separator="."
            suffix={value.includes('+') ? '+' : ''}
          />
        </div>
      </div>
    </div>
  );
}