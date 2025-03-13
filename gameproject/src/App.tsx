import { useState, useEffect } from 'react';
import { Sword, Clock, Sparkles, Ghost } from 'lucide-react';
import { Game } from './components/Game';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="animate-pulse text-pink-500 text-4xl font-['Press_Start_2P']">
          Loading...
        </div>
      </div>
    );
  }

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center p-8">
        <Game />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 text-white font-['Inter'] overflow-hidden">
      
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1600')] bg-cover bg-center opacity-10" />
      
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-['Press_Start_2P'] bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-200 mb-4 animate-glow">
            Reverse RPG
          </h1>
          <p className="text-xl text-pink-200 max-w-2xl mx-auto">
            Begin as the final boss. Lose power. Fight heroes. Survive chaos.
          </p>
        </header>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Sword, name: 'Pixel Warrior', desc: 'Attacks with a glowing sword' },
            { icon: Sparkles, name: 'Mage of Reversal', desc: 'Steals your strength' },
            { icon: Clock, name: 'Time Knight', desc: 'Speeds up your power loss' },
            { icon: Ghost, name: 'Glitch Rogue', desc: 'Disables your abilities' }
          ].map((hero) => (
            <div 
              key={hero.name}
              className="group bg-purple-900/50 backdrop-blur-sm rounded-lg p-6 border border-pink-500/20 hover:border-pink-500/60 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
            >
              <hero.icon className="w-12 h-12 text-pink-400 mb-4 group-hover:text-pink-300 transition-colors" />
              <h3 className="text-xl font-['Press_Start_2P'] text-pink-300 mb-2">{hero.name}</h3>
              <p className="text-pink-200/80">{hero.desc}</p>
            </div>
          ))}
        </div>

        
        <div className="text-center">
          <button 
            className="px-8 py-4 text-2xl font-['Press_Start_2P'] bg-gradient-to-r from-pink-600 to-purple-600 rounded-full 
                     hover:from-pink-500 hover:to-purple-500 transform transition-all duration-300
                     hover:scale-110 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]
                     focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-purple-900"
            onClick={() => setGameStarted(true)}
          >
            Enter the Chaos
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;