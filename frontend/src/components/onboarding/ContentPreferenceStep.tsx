import { Check } from '../../components/icons';

interface ContentPreferenceStepProps {
  contentPreference: 'tech' | 'general' | 'both';
  onContentPreferenceChange: (preference: 'tech' | 'general' | 'both') => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ContentPreferenceStep({
  contentPreference,
  onContentPreferenceChange,
  onNext,
  onBack
}: ContentPreferenceStepProps) {
  const options = [
    {
      id: 'tech' as const,
      title: 'Technology & Programming',
      description: 'Stay updated with the latest in tech, programming, AI, and software development',
      icon: '💻',
      sources: 'Ars Technica, Hacker News, MIT Tech Review, Engadget'
    },
    {
      id: 'general' as const,
      title: 'General News & Current Events',
      description: 'Get informed about world news, politics, and current affairs',
      icon: '🌍',
      sources: 'Reuters, BBC News, NPR, Associated Press'
    },
    {
      id: 'both' as const,
      title: 'Both Tech & General',
      description: 'Comprehensive coverage of technology and world events',
      icon: '📰',
      sources: 'All sources combined for complete coverage'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          What interests you?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your content preference to get personalized feeds
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onContentPreferenceChange(option.id)}
            className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              contentPreference === option.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{option.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {option.title}
                  </h3>
                  {contentPreference === option.id && (
                    <Check className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {option.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Sources: {option.sources}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
