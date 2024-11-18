export default function Team() {
  const teamMembers = [
    {
      id: 1,
      name: 'Ana Silva',
      role: 'CEO',
      image: '/images/placeholder.jpg',
    },
    {
      id: 2,
      name: 'João Santos',
      role: 'CTO',
      image: '/images/placeholder.jpg',
    },
    // Adicione mais membros conforme necessário
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Nossa Equipe</h1>
      
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-gray-600">
          Conheça os profissionais dedicados que fazem parte do nosso time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div 
            key={member.id}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
            <p className="text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 