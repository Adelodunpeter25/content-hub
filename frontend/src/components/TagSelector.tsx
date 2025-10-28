import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import type { TagCategory } from '../types/tag';
import TagBadge from './TagBadge';

interface TagSelectorProps {
  categories: TagCategory[];
  selectedTagIds: number[];
  onTagToggle: (tagId: number) => void;
  minTags?: number;
  maxTags?: number;
}

export default function TagSelector({
  categories,
  selectedTagIds,
  onTagToggle,
  minTags = 3,
  maxTags = 20,
}: TagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allTags = useMemo(() => {
    return categories.flatMap((cat) => cat.tags);
  }, [categories]);

  const filteredCategories = useMemo(() => {
    let filtered = categories;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = categories.filter((cat) => cat.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered
        .map((cat) => ({
          ...cat,
          tags: cat.tags.filter(
            (tag) =>
              tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tag.description.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((cat) => cat.tags.length > 0);
    }

    return filtered;
  }, [categories, selectedCategory, searchQuery]);

  const categoryNames = useMemo(() => {
    return ['all', ...categories.map((cat) => cat.category)];
  }, [categories]);

  const canSelectMore = selectedTagIds.length < maxTags;
  const hasMinimum = selectedTagIds.length >= minTags;

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold dark:text-white">
            Select Your Interests
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose {minTags}-{maxTags} tags that match your interests
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold dark:text-white">{selectedTagIds.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {hasMinimum ? `${maxTags - selectedTagIds.length} more` : `${minTags - selectedTagIds.length} minimum`}
          </div>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Selected tags */}
      {selectedTagIds.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Selected Tags ({selectedTagIds.length})
            </h4>
            <button
              onClick={() => selectedTagIds.forEach((id) => onTagToggle(id))}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags
              .filter((tag) => selectedTagIds.includes(tag.id))
              .map((tag) => (
                <TagBadge
                  key={tag.id}
                  tag={tag}
                  selected
                  onClick={() => onTagToggle(tag.id)}
                  size="sm"
                />
              ))}
          </div>
        </div>
      )}

      {/* Tag grid by category */}
      <div className="space-y-6 max-h-96 overflow-y-auto">
        {filteredCategories.map((category) => (
          <div key={category.category}>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {category.category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                const canSelect = canSelectMore || isSelected;

                return (
                  <TagBadge
                    key={tag.id}
                    tag={tag}
                    selected={isSelected}
                    onClick={canSelect ? () => onTagToggle(tag.id) : undefined}
                    showDescription
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Validation message */}
      {!hasMinimum && (
        <div className="text-sm text-orange-600 dark:text-orange-400">
          Please select at least {minTags} tags to continue
        </div>
      )}
      {!canSelectMore && (
        <div className="text-sm text-blue-600 dark:text-blue-400">
          Maximum {maxTags} tags selected
        </div>
      )}
    </div>
  );
}
