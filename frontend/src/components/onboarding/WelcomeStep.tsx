import { Sparkles } from 'lucide-react';

interface WelcomeStepProps {
  userName?: string;
}

export default function WelcomeStep({ userName }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="text-white" size={48} />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Let's personalize your content feed
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 text-left">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            🎯 What we'll do:
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
            <li>• Choose a template that matches your role (or go custom)</li>
            <li>• Select topics and technologies you're interested in</li>
            <li>• Customize your content sources</li>
            <li>• Get a personalized feed tailored just for you</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
            ⚡ Takes less than 2 minutes
          </h3>
          <p className="text-sm text-green-800 dark:text-green-400">
            You can always change your preferences later in settings
          </p>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ready to get started? Let's go! 🚀
        </p>
      </div>
    </div>
  );
}
