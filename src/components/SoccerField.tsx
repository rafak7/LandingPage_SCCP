import React, { useState } from 'react';

interface Player {
  id: string;
  number: string;
  name: string;
  position: string;
  starter: boolean;
}

const positions: Record<string, { x: number; y: number }> = {
  'GK':  { x: 10, y: 50 },
  'LB':  { x: 25, y: 15 },
  'CB1': { x: 25, y: 35 },
  'CB2': { x: 30, y: 65 },
  'RB':  { x: 24, y: 87 },
  'DM':  { x: 55, y: 35 },
  'LM':  { x: 70, y: 75 },
  'CM':  { x: 55, y: 64 },
  'RM':  { x: 60, y: 75 },
  'AM':  { x: 60, y: 50 },
  'RW':  { x: 80, y: 25 },
  'ST':  { x: 80, y: 35 },
  'CF':  { x: 84, y: 50 },
  'LW':  { x: 80, y: 75 },
};

export function SoccerField({ lineup: initialLineup }: { lineup: Player[] }) {
  const [lineup, setLineup] = useState(initialLineup);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const starters = lineup.filter(player => player.starter);
  const bench = lineup.filter(player => !player.starter);

  const handlePlayerClick = (player: Player) => {
    if (!selectedPlayer) {
      setSelectedPlayer(player);
      return;
    }

    // Se clicou no mesmo jogador, desseleciona
    if (selectedPlayer.id === player.id) {
      setSelectedPlayer(null);
      return;
    }

    // Troca os jogadores e suas posições
    const updatedLineup = lineup.map(p => {
      if (p.id === selectedPlayer.id) {
        return { 
          ...p, 
          position: player.position,
          // Mantém o status de titular/reserva original do jogador selecionado
          starter: player.starter ? true : false 
        };
      }
      if (p.id === player.id) {
        return { 
          ...p, 
          position: selectedPlayer.position,
          // Mantém o status de titular/reserva original do outro jogador
          starter: selectedPlayer.starter ? true : false 
        };
      }
      return p;
    });

    setLineup(updatedLineup);
    setSelectedPlayer(null);
  };

  const handleDragStart = (player: Player, e: React.DragEvent) => {
    setDraggedPlayer(player);
    // Define uma imagem transparente para o drag
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const field = e.currentTarget;
    const rect = field.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDragPosition({ x, y });
  };

  const handleDragEnd = () => {
    setDraggedPlayer(null);
    setDragPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedPlayer || !dragPosition) return;

    const updatedLineup = lineup.map(p => {
      if (p.id === draggedPlayer.id) {
        return { 
          ...p, 
          position: `CUSTOM_${dragPosition.x.toFixed(0)}_${dragPosition.y.toFixed(0)}`,
          starter: true 
        };
      }
      return p;
    });

    setLineup(updatedLineup);
    handleDragEnd();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Campo */}
        <div className="flex-1 min-w-0">
          <div 
            className="relative w-full aspect-[16/10] bg-gradient-to-b from-green-800 to-green-600 rounded-lg overflow-hidden"
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
          >
            {/* Linhas do campo */}
            <div className="absolute inset-0 border-2 border-white/50" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/50" />
            <div className="absolute w-36 h-36 border-2 border-white/50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            
            {/* Áreas */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-24 h-48 border-2 border-white/50" />
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-24 h-48 border-2 border-white/50" />
            
            {/* Jogadores titulares */}
            {starters.map((player) => {
              let position = { x: 50, y: 50 };
              
              // Se este é o jogador sendo arrastado e temos uma posição de drag
              if (draggedPlayer?.id === player.id && dragPosition) {
                position = dragPosition;
              } else if (player.position.startsWith('CUSTOM_')) {
                const [_, x, y] = player.position.split('_');
                position = { x: Number(x), y: Number(y) };
              } else {
                position = positions[player.position] || { x: 50, y: 50 };
              }

              return (
                <div
                  key={player.id}
                  className={`absolute cursor-move transition-all duration-75 ${
                    draggedPlayer?.id === player.id ? 'opacity-50' : ''
                  } scale-[0.85] md:scale-100`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(player, e)}
                  onClick={() => handlePlayerClick(player)}
                >
                  <PlayerToken 
                    player={player} 
                    isSelected={selectedPlayer?.id === player.id}
                  />
                </div>
              );
            })}

            {/* Visualização do drag */}
            {draggedPlayer && dragPosition && (
              <div
                className="absolute pointer-events-none z-10"
                style={{
                  left: `${dragPosition.x}%`,
                  top: `${dragPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <PlayerToken 
                  player={draggedPlayer}
                  isSelected={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Reservas - ajustando para layout horizontal em mobile */}
        <div className="w-full lg:w-64 bg-black/30 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Reservas</h3>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {bench.map((player) => (
              <div
                key={player.id}
                className="flex-shrink-0 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(player, e)}
                onClick={() => handlePlayerClick(player)}
              >
                <PlayerToken 
                  player={player} 
                  isSelected={selectedPlayer?.id === player.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerToken({ player, isSelected }: { player: Player; isSelected?: boolean }) {
  return (
    <div className={`flex items-center space-x-2 ${isSelected ? 'ring-2 ring-yellow-400 rounded-lg p-1' : ''}`}>
      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${
        isSelected ? 'bg-yellow-400' : 'bg-white/90'
      } flex items-center justify-center text-black font-bold text-sm md:text-base`}>
        {player.number}
      </div>
      <div className="text-xs md:text-sm text-white font-medium">
        {player.name}
      </div>
    </div>
  );
}

