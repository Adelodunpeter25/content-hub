import { CheckCircle, TrendingUp, Bookmark, Sparkles } from 'lucide-react';

interface CompletionStepProps {
  tagCount: number;
  template: string;
}

export default function CompletionStep({ tagCount, template }: CompletionStepProps) {
  return (
    <div className="text-center space-y-8 py-8">
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle className="text-white" size={48} />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          You're All Set! 🎉
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your personalized feed is ready
        </p>
      </div>

      <div className="max-w-2xl mx-auto grid md:grid-cols-3 gap-4">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Sparkles className="mx-auto mb-3 text-blue-500" size={32} />
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-1">
            {tagCount}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-400">
            Interests Selected
          </div>
        </div>

        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <TrendingUp className="mx-auto mb-3 text-purple-500" size={32} />
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-1">
            {template === 'custom' ? 'Custom' : template}
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-400">
            Template Applied
          </div>
        </div>

        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <Bookmark className="mx-auto mb-3 text-green-500" size={32} />
          <div className="text-2xl font-bold text-green-900 dark:text-green-300 mb-1">
            Ready
          </div>
          <div className="text-sm text-green-700 dark:text-green-400">
            Feed Personalized
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-left">
            <li>✨ Explore your personalized feed with quality-scored articles</li>
            <li>🏷️ Articles are tagged based on your interests</li>
            <li>📊 Track your reading stats and streaks</li>
            <li>⚙️ Adjust preferences anytime in settings</li>
          </ul>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click below to start exploring! 🚀
        </p>
      </div>
    </div>
  );
}
