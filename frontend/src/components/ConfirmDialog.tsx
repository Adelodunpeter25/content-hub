import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
  loading = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 disabled:opacity-50 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
