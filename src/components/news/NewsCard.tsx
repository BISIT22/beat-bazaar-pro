import { useState } from 'react';
import { NewsItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface NewsCardProps {
  news: NewsItem;
  size?: 'small' | 'large';
  isExpanded?: boolean;
  onToggle?: (id: string) => void;
}

export function NewsCard({ news, size = 'small', isExpanded = false, onToggle }: NewsCardProps) {
  const formattedDate = format(new Date(news.createdAt), 'd MMMM yyyy', { locale: ru });
  const fullText = news.text || news.description;
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = onToggle ? isExpanded : localExpanded;

  const handleClick = () => {
    if (onToggle) {
      onToggle(news.id);
    } else {
      setLocalExpanded((prev) => !prev);
    }
  };

  if (size === 'large') {
    return (
      <article
        className="group glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-video md:aspect-auto overflow-hidden">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50 hidden md:block" />
          </div>
          
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <Badge variant="secondary" className="w-fit mb-4">
              {news.category}
            </Badge>
            
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 group-hover:text-primary transition-colors">
              {news.title}
            </h2>
            
            <p className={`text-muted-foreground mb-6 transition-all duration-300 ${expanded ? '' : 'line-clamp-3'}`}>
              {news.description}
            </p>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{news.author}</span>
              <span>•</span>
              <time dateTime={news.createdAt}>{formattedDate}</time>
            </div>

            {expanded && news.text && (
              <div className="mt-6 text-sm text-foreground leading-relaxed">
                {news.text}
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group glass-card rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 animate-fade-in cursor-pointer ${isExpanded ? 'shadow-lg shadow-primary/10' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        
        <Badge className="absolute top-3 left-3 bg-background/50 backdrop-blur-sm text-foreground border-0">
          {news.category}
        </Badge>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        
        <div
          className={`text-sm text-muted-foreground transition-all duration-300 ${expanded ? 'line-clamp-none' : 'line-clamp-2'}`}
        >
          {news.description}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{news.author}</span>
          <span>•</span>
          <time dateTime={news.createdAt}>{formattedDate}</time>
        </div>

        {expanded && (
          <div className="space-y-2 pt-3 border-t border-border/50 text-sm text-muted-foreground">
            <p>Категория: {news.category}</p>
            <p>Автор: {news.author}</p>
            <p>
              Дата: <time dateTime={news.createdAt}>{formattedDate}</time>
            </p>
            {news.text && (
              <div className="pt-2 text-foreground leading-relaxed">
                {news.text}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
