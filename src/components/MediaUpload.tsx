import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadProps {
  type: 'video' | 'music' | 'blog';
  onSuccess?: () => void;
}

const MediaUpload = ({ type, onSuccess }: MediaUploadProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    audio_url: '',
    cover_url: '',
    artist: '',
    album: '',
    content: '',
    author: '',
    duration: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = { type };
      
      if (type === 'video') {
        payload.title = formData.title;
        payload.description = formData.description;
        payload.video_url = formData.video_url;
        payload.thumbnail_url = formData.thumbnail_url;
        payload.duration = formData.duration;
      } else if (type === 'music') {
        payload.title = formData.title;
        payload.artist = formData.artist;
        payload.album = formData.album;
        payload.audio_url = formData.audio_url;
        payload.cover_url = formData.cover_url;
        payload.duration = formData.duration;
      } else if (type === 'blog') {
        payload.title = formData.title;
        payload.content = formData.content;
        payload.cover_url = formData.cover_url;
        payload.author = formData.author;
      }

      const response = await fetch('https://functions.poehali.dev/6d2452b6-ac66-4c07-8cb8-021876305c9c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Контент добавлен',
        });
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          video_url: '',
          thumbnail_url: '',
          audio_url: '',
          cover_url: '',
          artist: '',
          album: '',
          content: '',
          author: '',
          duration: 0
        });
        onSuccess?.();
      } else {
        throw new Error('Upload failed');
      }
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

  const renderForm = () => {
    if (type === 'video') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Название видео</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Описание видео"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video_url">URL видео</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://example.com/video.mp4"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">URL превью</Label>
            <Input
              id="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://example.com/thumb.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Длительность (сек)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              placeholder="120"
            />
          </div>
        </>
      );
    }

    if (type === 'music') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="title">Название трека</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist">Исполнитель</Label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              placeholder="Имя исполнителя"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="album">Альбом</Label>
            <Input
              id="album"
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
              placeholder="Название альбома"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audio_url">URL аудио</Label>
            <Input
              id="audio_url"
              value={formData.audio_url}
              onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
              placeholder="https://example.com/audio.mp3"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover_url">URL обложки</Label>
            <Input
              id="cover_url"
              value={formData.cover_url}
              onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
              placeholder="https://example.com/cover.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Длительность (сек)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              placeholder="180"
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="title">Заголовок статьи</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Введите заголовок"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Автор</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Имя автора"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Контент</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Текст статьи"
            className="min-h-32"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cover_url">URL обложки</Label>
          <Input
            id="cover_url"
            value={formData.cover_url}
            onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
            placeholder="https://example.com/cover.jpg"
          />
        </div>
      </>
    );
  };

  const getIcon = () => {
    if (type === 'video') return 'Video';
    if (type === 'music') return 'Music';
    return 'FileText';
  };

  const getTitle = () => {
    if (type === 'video') return 'Добавить видео';
    if (type === 'music') return 'Добавить музыку';
    return 'Добавить статью';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="glass-effect hover:bg-primary/20">
          <Icon name={getIcon() as any} size={18} className="mr-2" />
          {getTitle()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-effect border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {renderForm()}
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
            {loading ? 'Загрузка...' : 'Добавить'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUpload;
