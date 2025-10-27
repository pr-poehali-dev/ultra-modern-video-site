import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: number;
  title: string;
  description?: string;
  video_url?: string;
  audio_url?: string;
  thumbnail_url?: string;
  cover_url?: string;
  artist?: string;
  album?: string;
  views?: number;
  plays?: number;
  created_at: string;
}

interface MediaGalleryProps {
  type: 'videos' | 'music' | 'blog';
  refreshTrigger?: number;
}

const MediaGallery = ({ type, refreshTrigger }: MediaGalleryProps) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/6d2452b6-ac66-4c07-8cb8-021876305c9c?type=${type}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить контент',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type, refreshTrigger]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/6d2452b6-ac66-4c07-8cb8-021876305c9c?type=${type.slice(0, -1)}&id=${id}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
        toast({
          title: 'Удалено',
          description: 'Контент успешно удален',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin">
          <Icon name="Loader2" size={40} className="text-primary" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 glass-effect rounded-2xl border border-white/10">
        <Icon name="Inbox" size={64} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-xl text-muted-foreground">Контент пока не добавлен</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden border-white/10 bg-card/50 backdrop-blur-sm hover-lift cursor-pointer"
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.thumbnail_url || item.cover_url || 'https://cdn.poehali.dev/projects/97c8c9cb-8e5d-4699-ac13-1079cc3a81d5/files/e9583d44-a33e-49a0-8716-0e105fd9e739.jpg'}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            
            {type === 'videos' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-4 rounded-full bg-primary/90 glow-effect">
                  <Icon name="Play" size={32} className="text-white" />
                </div>
              </div>
            )}
            
            {type === 'music' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-4 rounded-full bg-primary/90 glow-effect">
                  <Icon name="Music" size={32} className="text-white" />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-2 line-clamp-1">{item.title}</h3>
            
            {type === 'music' && item.artist && (
              <p className="text-sm text-muted-foreground mb-2">{item.artist}</p>
            )}
            
            {item.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex gap-3 text-sm text-muted-foreground">
                {type === 'videos' && (
                  <span className="flex items-center gap-1">
                    <Icon name="Eye" size={16} />
                    {item.views || 0}
                  </span>
                )}
                {type === 'music' && (
                  <span className="flex items-center gap-1">
                    <Icon name="Play" size={16} />
                    {item.plays || 0}
                  </span>
                )}
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MediaGallery;
