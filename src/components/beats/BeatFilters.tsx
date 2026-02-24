import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { genres, popularTags, majorKeys, minorKeys, musicalKeys } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface BeatFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  selectedKey: string;
  onKeyChange: (key: string) => void;
  selectedTonalityType: 'major' | 'minor' | 'any';
  onTonalityTypeChange: (type: 'major' | 'minor' | 'any') => void;
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
  selectedKey,
  onKeyChange,
  selectedTonalityType,
  onTonalityTypeChange,
  sortBy,
  onSortChange,
}: BeatFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

  const hasActiveFilters = searchQuery || selectedGenre || selectedTags.length > 0 || selectedKey || (selectedTonalityType && selectedTonalityType !== 'any');

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
          variant={showAdvancedFilters ? "secondary" : "outline"}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Расширенные
        </Button>

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

      {/* Advanced filters */}
      {showAdvancedFilters && (
        <div className="glass-card rounded-xl p-4 animate-slide-up">
          <p className="text-sm text-muted-foreground mb-3">Расширенные фильтры:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Тип тональности</Label>
              <Select value={selectedTonalityType} onValueChange={(v: any) => onTonalityTypeChange(v as 'major' | 'minor' | 'any')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Любой тип</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Тональность</Label>
              <Select value={selectedKey} onValueChange={onKeyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тональность" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedTonalityType === 'major' 
                    ? majorKeys 
                    : selectedTonalityType === 'minor' 
                      ? minorKeys 
                      : musicalKeys
                  ).map(key => (
                    <SelectItem key={key} value={key}>{key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          {(selectedKey || (selectedTonalityType && selectedTonalityType !== 'any')) && (
            <Badge variant="secondary" className="gap-1">
              {selectedTonalityType !== 'any' && selectedTonalityType.charAt(0).toUpperCase() + selectedTonalityType.slice(1)}
              {selectedKey && `: ${selectedKey}`}
              <X className="w-3 h-3 cursor-pointer" onClick={() => { onKeyChange(''); onTonalityTypeChange('any'); }} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
