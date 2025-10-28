import { useState } from 'react';
import type { FeedTemplate } from '../../types/onboarding';

interface TemplateStepProps {
  templates: FeedTemplate[];
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
}

export default function TemplateStep({ templates, selectedTemplate, onSelectTemplate }: TemplateStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Path
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a template that matches your role, or start from scratch
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`
              p-6 rounded-xl border-2 text-left transition-all duration-200
              ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
              }
            `}
          >
            <div className="text-4xl mb-3">{template.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {template.description}
            </p>
            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span>📌 {template.tag_count} tags</span>
              <span>📰 {template.source_count} sources</span>
            </div>
          </button>
        ))}

        {/* Custom option */}
        <button
          onClick={() => onSelectTemplate('custom')}
          className={`
            p-6 rounded-xl border-2 text-left transition-all duration-200
            ${
              selectedTemplate === 'custom'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md'
            }
          `}
        >
          <div className="text-4xl mb-3">✨</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Custom
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Build your own personalized feed from scratch
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            🎨 Full customization
          </div>
        </button>
      </div>

      {selectedTemplate && (
        <div className="text-center text-sm text-green-600 dark:text-green-400">
          ✓ Template selected! Continue to customize your interests
        </div>
      )}
    </div>
  );
}
