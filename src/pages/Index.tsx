import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import MediaUpload from '@/components/MediaUpload';
import MediaGallery from '@/components/MediaGallery';

const sections = ['Главная', 'Блог', 'Видео', 'Музыка', 'Галерея', 'О проекте', 'Контакты'];

const contentCards = [
  {
    id: 1,
    type: 'video',
    title: 'Киноматографическое видео',
    description: 'Профессиональный монтаж и визуальные эффекты',
    image: 'https://cdn.poehali.dev/projects/97c8c9cb-8e5d-4699-ac13-1079cc3a81d5/files/41cabfec-2e6d-4b45-a3df-bbec0d9f6158.jpg',
    icon: 'Film'
  },
  {
    id: 2,
    type: 'music',
    title: 'Музыкальная коллекция',
    description: 'Лучшие треки и эксклюзивные релизы',
    image: 'https://cdn.poehali.dev/projects/97c8c9cb-8e5d-4699-ac13-1079cc3a81d5/files/7719a093-0e73-480b-ad5d-b80b9f7b49e0.jpg',
    icon: 'Music'
  },
  {
    id: 3,
    type: 'blog',
    title: 'Блог о творчестве',
    description: 'Статьи, идеи и вдохновение',
    image: 'https://cdn.poehali.dev/projects/97c8c9cb-8e5d-4699-ac13-1079cc3a81d5/files/e9583d44-a33e-49a0-8716-0e105fd9e739.jpg',
    icon: 'BookOpen'
  },
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('Главная');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const playHoverSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              MediaHub
            </div>
            <div className="hidden md:flex gap-6">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  onMouseEnter={playHoverSound}
                  className={`text-sm font-medium transition-all duration-300 hover:text-primary ${
                    activeSection === section ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        <section className="container mx-auto px-4 mb-20">
          <div className="relative overflow-hidden rounded-3xl p-12 md:p-20 glass-effect">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
            <div className="relative z-10 max-w-3xl animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Добро пожаловать в
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  мир медиа
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Видео, музыка и контент нового поколения с интерактивными эффектами
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 glow-effect"
                  onMouseEnter={playHoverSound}
                >
                  <Icon name="Play" size={20} className="mr-2" />
                  Начать просмотр
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/5"
                  onMouseEnter={playHoverSound}
                >
                  Узнать больше
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold animate-fade-in">
              Управление контентом
            </h2>
          </div>
          
          <Tabs defaultValue="videos" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="glass-effect border border-white/10">
                <TabsTrigger value="videos" className="data-[state=active]:bg-primary/20">
                  <Icon name="Film" size={16} className="mr-2" />
                  Видео
                </TabsTrigger>
                <TabsTrigger value="music" className="data-[state=active]:bg-primary/20">
                  <Icon name="Music" size={16} className="mr-2" />
                  Музыка
                </TabsTrigger>
                <TabsTrigger value="blog" className="data-[state=active]:bg-primary/20">
                  <Icon name="FileText" size={16} className="mr-2" />
                  Блог
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="videos" className="space-y-6">
              <div className="flex justify-end">
                <MediaUpload type="video" onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
              </div>
              <MediaGallery type="videos" refreshTrigger={refreshTrigger} />
            </TabsContent>

            <TabsContent value="music" className="space-y-6">
              <div className="flex justify-end">
                <MediaUpload type="music" onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
              </div>
              <MediaGallery type="music" refreshTrigger={refreshTrigger} />
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <div className="flex justify-end">
                <MediaUpload type="blog" onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
              </div>
              <MediaGallery type="blog" refreshTrigger={refreshTrigger} />
            </TabsContent>
          </Tabs>
        </section>

        <section className="container mx-auto px-4 mt-20">
          <div className="rounded-3xl p-12 glass-effect border border-white/10 text-center animate-scale-in">
            <h2 className="text-3xl font-bold mb-4">Готовы погрузиться?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Откройте для себя уникальные медиа-впечатления с интерактивными элементами и звуковыми эффектами
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 glow-effect"
              onMouseEnter={playHoverSound}
            >
              <Icon name="Sparkles" size={20} className="mr-2" />
              Начать исследование
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground">
              © 2024 MediaHub. Все права защищены.
            </div>
            <div className="flex gap-6">
              {['Instagram', 'Youtube', 'Twitter'].map((social) => (
                <button
                  key={social}
                  onMouseEnter={playHoverSound}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;