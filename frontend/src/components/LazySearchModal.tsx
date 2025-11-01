import { lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

const SearchModal = lazy(() => import('./SearchModal'));

interface LazySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LazySearchModal(props: LazySearchModalProps) {
  if (!props.isOpen) return null;
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchModal {...props} />
    </Suspense>
  );
}
