import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { useTags } from '../hooks/useTags';
import WelcomeStep from '../components/onboarding/WelcomeStep';
import TemplateStep from '../components/onboarding/TemplateStep';
import TagSelector from '../components/TagSelector';
import CompletionStep from '../components/onboarding/CompletionStep';
import LoadingSpinner from '../components/LoadingSpinner';
import type { FeedTemplate } from '../types/onboarding';
import type { TagCategory } from '../types/tag';

const STEPS = [
  { id: 1, title: 'Welcome', description: 'Get started' },
  { id: 2, title: 'Template', description: 'Choose your path' },
  { id: 3, title: 'Interests', description: 'Select tags' },
  { id: 4, title: 'Complete', description: 'All set!' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const { getTemplates, completeOnboarding, skipOnboarding } = useOnboarding();
  const { getAllTags } = useTags();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data
  const [templates, setTemplates] = useState<FeedTemplate[]>([]);
  const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);

  // User selections
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesData, tagsData] = await Promise.all([
        getTemplates(),
        getAllTags(),
      ]);

      setTemplates(templatesData.templates);
      setTagCategories(tagsData.categories);
    } catch (err: any) {
      showToast(err.message || 'Failed to load onboarding data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    try {
      setSubmitting(true);
      await skipOnboarding();
      showToast('Onboarding skipped', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Failed to skip onboarding', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    try {
      setSubmitting(true);

      await completeOnboarding({
        template: selectedTemplate || 'custom',
        tag_ids: selectedTagIds,
      });

      showToast('Onboarding completed! Welcome aboard! 🎉', 'success');
      
      // Small delay to show completion step
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      showToast(err.message || 'Failed to complete onboarding', 'error');
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return selectedTemplate !== null;
      case 3:
        return selectedTagIds.length >= 3;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Content Hub Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Step {currentStep} of {STEPS.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                    ${
                      currentStep >= step.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 transition-all
                      ${
                        currentStep > step.id
                          ? 'bg-blue-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            {STEPS.map((step) => (
              <div key={step.id} className="text-center" style={{ width: '25%' }}>
                <div className="font-medium">{step.title}</div>
                <div>{step.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          {currentStep === 1 && <WelcomeStep userName={user?.name} />}
          
          {currentStep === 2 && (
            <TemplateStep
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          )}
          
          {currentStep === 3 && (
            <TagSelector
              categories={tagCategories}
              selectedTagIds={selectedTagIds}
              onTagToggle={handleTagToggle}
              minTags={3}
              maxTags={20}
            />
          )}
          
          {currentStep === 4 && (
            <CompletionStep
              tagCount={selectedTagIds.length}
              template={selectedTemplate || 'custom'}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={handleBack}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 4 && (
              <button
                onClick={handleSkip}
                disabled={submitting}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                Skip for now
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed() || submitting}
                className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {currentStep === 3 ? 'Finish' : 'Continue'}
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 font-medium shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Setting up...
                  </>
                ) : (
                  <>
                    Go to Dashboard
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
