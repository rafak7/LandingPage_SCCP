import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

interface Player {
  id: string;
  number: string;
  name: string;
  position: string;
  starter: boolean;
}

interface NextMatch {
  partida_id: number;
  time_mandante: {
    nome_popular: string;
  };
  time_visitante: {
    nome_popular: string;
  };
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nextMatch, setNextMatch] = useState<NextMatch | null>(null);

  const starters = lineup.filter(player => player.starter);
  const bench = lineup.filter(player => !player.starter);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

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

    // Se está tentando colocar um reserva em campo, verifica o limite de 11 jogadores
    if (!selectedPlayer.starter && player.starter) {
      const currentStarters = lineup.filter(p => p.starter).length;
      if (currentStarters >= 11) {
        showError('Máximo de 11 jogadores em campo atingido!');
        setSelectedPlayer(null);
        return;
      }
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

    // Se o jogador não é titular e está sendo arrastado para o campo
    if (!draggedPlayer.starter) {
      const currentStarters = lineup.filter(p => p.starter).length;
      if (currentStarters >= 11) {
        showError('Máximo de 11 jogadores em campo atingido!');
        handleDragEnd();
        return;
      }
    }

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

  const fetchNextMatch = async () => {
    try {
      const response = await axios.get(
        'https://api.api-futebol.com.br/v1/times/702/partidas/proximas',
        {
          headers: {
            'Authorization': 'Bearer live_2d128aee9853eda80ea32f84798a38'
          }
        }
      );
      
      if (response.data && response.data.length > 0) {
        setNextMatch(response.data[0]); // Pega o primeiro jogo da lista
        console.log('Próximo jogo:', response.data[0]); // Para debug
      }
    } catch (error) {
      console.error('Erro ao buscar próximo jogo:', error);
      showError('Erro ao buscar informações do próximo jogo');
    }
  };

  useEffect(() => {
    fetchNextMatch();
  }, []);

  const handlePrint = () => {
    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.style.width = '1200px';
    printContainer.style.height = '630px';
    printContainer.style.background = 'linear-gradient(to bottom, #000000, #18181b)';
    printContainer.style.padding = '20px';
    printContainer.style.display = 'flex';
    printContainer.style.flexDirection = 'column';
    printContainer.style.alignItems = 'center';
    printContainer.style.gap = '16px';

    // Adicionar o título
    const title = document.createElement('h1');
    title.textContent = `ESSA É MINHA ESCALAÇÃO PARA O JOGO CONTRA ${
      nextMatch ? 
        (nextMatch.time_mandante.nome_popular === 'Seu Time' ? 
          nextMatch.time_visitante.nome_popular.toUpperCase() : 
          nextMatch.time_mandante.nome_popular.toUpperCase()) :
        'O PRÓXIMO ADVERSÁRIO'
    }`;
    title.style.color = '#ffffff';
    title.style.fontSize = '28px';
    title.style.fontWeight = 'bold';
    title.style.textAlign = 'center';
    title.style.fontFamily = 'Arial, sans-serif';
    title.style.marginBottom = '10px';
    title.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
    title.style.padding = '0 20px';
    printContainer.appendChild(title);

    // Criar um novo container para o campo
    const fieldContainer = document.createElement('div');
    fieldContainer.style.width = '1100px';
    fieldContainer.style.height = '500px';
    fieldContainer.style.position = 'relative';
    fieldContainer.style.margin = '0 auto';
    
    // Criar o campo diretamente (em vez de clonar)
    const field = document.createElement('div');
    field.style.width = '100%';
    field.style.height = '100%';
    field.style.position = 'relative';
    field.style.backgroundColor = 'black';
    field.style.backgroundImage = 'linear-gradient(to bottom, #18181b, #000000)';
    field.style.borderRadius = '12px';
    field.style.overflow = 'hidden';

    // Adicionar as linhas do campo
    field.innerHTML = `
      <div style="position: absolute; inset: 0; border: 2px solid rgba(255,255,255,0.5);"></div>
      <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.5);"></div>
      <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 144px; height: 144px; border: 2px solid rgba(255,255,255,0.5); border-radius: 50%;"></div>
      <div style="position: absolute; top: 50%; transform: translateY(-50%); left: 0; width: 96px; height: 192px; border: 2px solid rgba(255,255,255,0.5);"></div>
      <div style="position: absolute; top: 50%; transform: translateY(-50%); right: 0; width: 96px; height: 192px; border: 2px solid rgba(255,255,255,0.5);"></div>
    `;

    // Adicionar os jogadores
    starters.forEach(player => {
      let position = { x: 50, y: 50 };
      
      if (player.position.startsWith('CUSTOM_')) {
        const [, x, y] = player.position.split('_');
        position = { x: Number(x), y: Number(y) };
      } else {
        position = positions[player.position] || { x: 50, y: 50 };
      }

      const playerElement = document.createElement('div');
      playerElement.style.position = 'absolute';
      playerElement.style.left = `${position.x}%`;
      playerElement.style.top = `${position.y}%`;
      playerElement.style.transform = 'translate(-50%, -50%)';
      
      const playerToken = document.createElement('div');
      playerToken.style.display = 'flex';
      playerToken.style.alignItems = 'center';
      playerToken.style.gap = '8px';

      const numberCircle = document.createElement('div');
      numberCircle.style.width = '32px';
      numberCircle.style.height = '32px';
      numberCircle.style.borderRadius = '50%';
      numberCircle.style.backgroundColor = 'white';
      numberCircle.style.display = 'flex';
      numberCircle.style.alignItems = 'center';
      numberCircle.style.justifyContent = 'center';
      numberCircle.style.fontWeight = 'bold';
      numberCircle.style.color = 'black';
      numberCircle.textContent = player.number;

      const playerName = document.createElement('div');
      playerName.style.color = 'white';
      playerName.style.fontSize = '14px';
      playerName.style.fontWeight = '500';
      playerName.textContent = player.name;

      playerToken.appendChild(numberCircle);
      playerToken.appendChild(playerName);
      playerElement.appendChild(playerToken);
      field.appendChild(playerElement);
    });

    fieldContainer.appendChild(field);
    printContainer.appendChild(fieldContainer);

    // Adicionar marca d'água
    const watermark = document.createElement('div');
    watermark.textContent = 'selectsccp.com';
    watermark.style.color = 'rgba(255,255,255,0.5)';
    watermark.style.fontSize = '16px';
    watermark.style.position = 'absolute';
    watermark.style.bottom = '10px';
    watermark.style.right = '20px';
    watermark.style.fontFamily = 'Arial, sans-serif';
    printContainer.appendChild(watermark);

    // Adicionar ao body temporariamente
    document.body.appendChild(printContainer);

    // Usar html2canvas para criar a imagem
    html2canvas(printContainer, {
      backgroundColor: '#000000',
      scale: 2,
      logging: false,
      width: 1200,
      height: 630,
      allowTaint: true,
      useCORS: true,
    }).then(canvas => {
      // Remover o container temporário
      document.body.removeChild(printContainer);

      // Criar o modal para preview
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
      modal.style.display = 'flex';
      modal.style.flexDirection = 'column';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.padding = '20px';
      modal.style.zIndex = '9999';

      // Adicionar preview da imagem
      const preview = canvas;
      preview.style.maxWidth = '90%';
      preview.style.maxHeight = '80vh';
      preview.style.borderRadius = '12px';
      preview.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
      modal.appendChild(preview);

      // Container para os botões
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '12px';
      buttonContainer.style.marginTop = '20px';

      // Botão de download
      const downloadButton = document.createElement('button');
      downloadButton.textContent = 'Baixar Imagem';
      downloadButton.style.backgroundColor = '#18181b';
      downloadButton.style.color = 'white';
      downloadButton.style.padding = '12px 24px';
      downloadButton.style.border = '1px solid #27272a';
      downloadButton.style.borderRadius = '8px';
      downloadButton.style.cursor = 'pointer';
      downloadButton.style.fontSize = '16px';
      downloadButton.style.fontWeight = 'bold';
      downloadButton.onclick = () => {
        const link = document.createElement('a');
        link.download = 'minha-escalacao.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };

      // Botão de fechar
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Fechar';
      closeButton.style.backgroundColor = '#27272a';
      closeButton.style.color = 'white';
      closeButton.style.padding = '12px 24px';
      closeButton.style.border = '1px solid #3f3f46';
      closeButton.style.borderRadius = '8px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.fontSize = '16px';
      closeButton.style.fontWeight = 'bold';
      closeButton.onclick = () => document.body.removeChild(modal);

      buttonContainer.appendChild(downloadButton);
      buttonContainer.appendChild(closeButton);
      modal.appendChild(buttonContainer);
      document.body.appendChild(modal);

      // Adicionar hover effects nos botões
      [downloadButton, closeButton].forEach(button => {
        button.addEventListener('mouseover', () => {
          button.style.opacity = '0.9';
          button.style.transform = 'translateY(-1px)';
          button.style.backgroundColor = '#27272a';
        });
        button.addEventListener('mouseout', () => {
          button.style.opacity = '1';
          button.style.transform = 'translateY(0)';
          button.style.backgroundColor = button === downloadButton ? '#18181b' : '#27272a';
        });
        button.style.transition = 'all 0.2s ease';
      });
    });
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          {errorMessage}
        </div>
      )}
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrint}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg 
                   shadow-lg transition-colors border border-zinc-800 hover:border-zinc-700"
        >
          Compartilhar Escalação
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Campo */}
        <div className="flex-1 min-w-0 soccer-field-container">
          <div 
            className="relative w-full aspect-[16/10] bg-gradient-to-b from-zinc-900 to-black rounded-lg overflow-hidden"
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
                const [, x, y] = player.position.split('_');
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

        {/* Reservas */}
        <div className="w-full lg:w-72 bg-black rounded-lg p-4 shadow-xl">
          <h3 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Reservas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
            {bench.map((player) => (
              <div
                key={player.id}
                className="flex-shrink-0 bg-zinc-900 rounded-lg p-2 hover:bg-zinc-800 transition-colors cursor-move border border-zinc-800 hover:border-zinc-700"
                draggable
                onDragStart={(e) => handleDragStart(player, e)}
                onClick={() => handlePlayerClick(player)}
              >
                <PlayerToken 
                  player={player} 
                  isSelected={selectedPlayer?.id === player.id}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerToken({ player, isSelected, compact }: { player: Player; isSelected?: boolean; compact?: boolean }) {
  return (
    <div className={`flex items-center space-x-2 ${isSelected ? 'ring-2 ring-yellow-400 rounded-lg p-1' : ''}`}>
      <div className={`${compact ? 'w-6 h-6' : 'w-6 h-6 md:w-8 md:h-8'} rounded-full ${
        isSelected ? 'bg-yellow-400' : 'bg-white/90'
      } flex items-center justify-center text-black font-bold ${compact ? 'text-sm' : 'text-sm md:text-base'}`}>
        {player.number}
      </div>
      <div className={`${compact ? 'text-xs' : 'text-xs md:text-sm'} text-white font-medium truncate`}>
        {player.name}
      </div>
    </div>
  );
}