export interface Team {
  time_id: number;
  nome_popular: string;
  sigla: string;
  escudo: string;
  nome: string;
  fundacao: string;
}

export interface Match {
  partida_id: number;
  placar: string;
  data_realizacao: string;
  hora_realizacao: string;
  estadio: {
    nome_popular: string;
  };
  time_mandante: {
    nome_popular: string;
    escudo: string;
  };
  time_visitante: {
    nome_popular: string;
    escudo: string;
  };
}