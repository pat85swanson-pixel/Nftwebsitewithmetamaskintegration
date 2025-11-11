import { Button } from './ui/button';
import { Twitter, Github, MessageCircle, Send } from 'lucide-react';

export function SocialLinks() {
  const handleTwitterClick = () => {
    window.open('https://x.com/HUNGRYLUCHADORS', '_blank');
  };

  const handleDiscordClick = () => {
    window.open('https://discord.gg/JPrgqHt8', '_blank');
  };

  const handleTelegramClick = () => {
    // Add Telegram link when available
    console.log('Telegram link coming soon!');
  };

  const handleGithubClick = () => {
    window.open('https://github.com/HungryLuchadors', '_blank');
  };

  return (
    <div className="flex items-center space-x-2 backdrop-blur-xl bg-black/20 p-2 rounded-2xl border border-white/10 shadow-2xl">
      <Button
        onClick={handleTwitterClick}
        size="sm"
        variant="ghost"
        className="h-10 w-10 p-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-cyan-400 hover:from-purple-400/40 hover:to-cyan-400/40 hover:text-cyan-300 hover:scale-110 border-0 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg"
      >
        <Twitter className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={handleDiscordClick}
        size="sm"
        variant="ghost"
        className="h-10 w-10 p-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-cyan-400 hover:from-purple-400/40 hover:to-cyan-400/40 hover:text-cyan-300 hover:scale-110 border-0 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg"
      >
        <MessageCircle className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={handleTelegramClick}
        size="sm"
        variant="ghost"
        className="h-10 w-10 p-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-cyan-400 hover:from-purple-400/40 hover:to-cyan-400/40 hover:text-cyan-300 hover:scale-110 border-0 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg"
      >
        <Send className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={handleGithubClick}
        size="sm"
        variant="ghost"
        className="h-10 w-10 p-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-cyan-400 hover:from-purple-400/40 hover:to-cyan-400/40 hover:text-cyan-300 hover:scale-110 border-0 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg"
      >
        <Github className="w-4 h-4" />
      </Button>
    </div>
  );
}