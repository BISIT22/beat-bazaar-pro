import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { genres, popularTags } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface BeatFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function BeatFilters({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedTags,
  onTagsChange,
  sortBy,
  onSortChange,
}: BeatFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onGenreChange('');
    onTagsChange([]);
    onSortChange('newest');
  };

  const hasActiveFilters = searchQuery || selectedGenre || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search and main controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Поиск битов..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedGenre} onValueChange={onGenreChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Жанр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все жанры</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Сначала новые</SelectItem>
            <SelectItem value="oldest">Сначала старые</SelectItem>
            <SelectItem value="price-low">Цена: по возрастанию</SelectItem>
            <SelectItem value="price-high">Цена: по убыванию</SelectItem>
            <SelectItem value="rating">По рейтингу</SelectItem>
            <SelectItem value="popular">По популярности</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showFilters ? "secondary" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Теги
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Tags filter */}
      {showFilters && (
        <div className="glass-card rounded-xl p-4 animate-slide-up">
          <p className="text-sm text-muted-foreground mb-3">Фильтр по тегам:</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedTags.includes(tag) && "gradient-primary border-0"
                )}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Активные фильтры:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Поиск: {searchQuery}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onSearchChange('')} />
            </Badge>
          )}
          {selectedGenre && selectedGenre !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {selectedGenre}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onGenreChange('')} />
            </Badge>
          )}
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              #{tag}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTag(tag)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
