import { Button } from './ui/button';
import { Twitter, Github, MessageCircle, Send } from 'lucide-react';

export function SocialLinksUnderLogo() {
  const handleTwitterClick = () => {
    window.open('https://x.com/HUNGRYLUCHADORS', '_blank');
  };

  const handleDiscordClick = () => {
    window.open('https://discord.gg/JPrgqHt8', '_blank');
  };

  const handleTelegramClick = () => {
    console.log('Telegram link coming soon!');
  };

  const handleGithubClick = () => {
    window.open('https://github.com/HungryLuchadors', '_blank');
  };

  return (
    <div className="flex items-center justify-center space-x-3 mt-6 mb-8">
      <Button
        onClick={handleTwitterClick}
        size="sm"
        variant="ghost"
        className="h-12 w-12 p-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-cyan-400 hover:from-purple-400/40 hover:to-cyan-400/40 hover:text-cyan-300 hover:scale-110 border-0 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg"
      >
        <Twitter className="w-5 h-5" />
      </Button>
      
      <Button
        onClick={handleDiscordClick}
        size="sm"
        variant="ghost"
        className="h-12 w-12 p-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-cyan-400 hover:from-purple-400/40 hover:to-cyan-400/40 hover:text-cyan-300 hover:scale-110 border-0 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
      
      <Button
        onClick={handleTelegramClick}
        size="sm"
        variant="ghost"
        className="h-12 w-12 p-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-cyan-400 hover:from-purple-400/40 hover:to-cyan-400/40 hover:text-cyan-300 hover:scale-110 border-0 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg"
      >
        <Send className="w-5 h-5" />
      </Button>
      
      <Button
        onClick={handleGithubClick}
        size="sm"
        variant="ghost"
        className="h-12 w-12 p-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-cyan-400 hover:from-purple-400/40 hover:to-cyan-400/40 hover:text-cyan-300 hover:scale-110 border-0 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg"
      >
        <Github className="w-5 h-5" />
      </Button>
    </div>
  );
}