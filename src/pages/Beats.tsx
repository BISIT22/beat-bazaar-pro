import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { BeatCard } from '@/components/beats/BeatCard';
import { BeatFilters } from '@/components/beats/BeatFilters';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Music } from 'lucide-react';

export default function Beats() {
  const { beats, getCollaborations } = useData();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [selectedTonalityType, setSelectedTonalityType] = useState<'major' | 'minor' | 'any'>('any');
  const [sortBy, setSortBy] = useState('newest');

  const filteredBeats = useMemo(() => {
    let result = [...beats];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        beat =>
          beat.title.toLowerCase().includes(query) ||
          beat.sellerName.toLowerCase().includes(query) ||
          beat.description?.toLowerCase().includes(query) ||
          beat.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Genre filter
    if (selectedGenre && selectedGenre !== 'all') {
      result = result.filter(beat => beat.genre === selectedGenre);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      result = result.filter(beat =>
        selectedTags.some(tag => beat.tags.includes(tag))
      );
    }

    // Key filter
    if (selectedKey) {
      result = result.filter(beat => beat.key === selectedKey);
    }

    // Tonality type filter
    if (selectedTonalityType && selectedTonalityType !== 'any') {
      if (selectedTonalityType === 'major') {
        result = result.filter(beat => beat.key.endsWith('m') === false);
      } else if (selectedTonalityType === 'minor') {
        result = result.filter(beat => beat.key.endsWith('m'));
      }
    }

    // Include collaboration beats if user is logged in
    if (user) {
      const userCollaborations = getCollaborations(user.id);
      const collaborationBeatIds = userCollaborations.map(c => c.beatId);
      
      // Get collaboration beats that aren't already in the result
      const collaborationBeats = beats.filter(beat => 
        collaborationBeatIds.includes(beat.id) && 
        !result.some(r => r.id === beat.id) // Don't duplicate beats
      );
      
      // Add collaboration beats to the result
      result = [...result, ...collaborationBeats];
    }

    // Sorting
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.priceRub - b.priceRub);
        break;
      case 'price-high':
        result.sort((a, b) => b.priceRub - a.priceRub);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.plays - a.plays);
        break;
    }

    return result;
  }, [beats, searchQuery, selectedGenre, selectedTags, sortBy]);

  return (
    <Layout>
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Каталог битов</h1>
            <p className="text-muted-foreground">
              Найдите идеальный бит для своего трека
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <BeatFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              selectedKey={selectedKey}
              onKeyChange={setSelectedKey}
              selectedTonalityType={selectedTonalityType}
              onTonalityTypeChange={setSelectedTonalityType}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            Найдено: {filteredBeats.length} {filteredBeats.length === 1 ? 'бит' : 'битов'}
          </p>

          {/* Beats grid */}
          {filteredBeats.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBeats.map((beat, index) => (
                <div key={beat.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <BeatCard beat={beat} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Music className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Биты не найдены</h3>
              <p className="text-muted-foreground">
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
