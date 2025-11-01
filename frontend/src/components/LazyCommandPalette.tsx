import { lazy, Suspense } from 'react';

const CommandPalette = lazy(() => import('./CommandPalette'));

interface LazyCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LazyCommandPalette(props: LazyCommandPaletteProps) {
  if (!props.isOpen) return null;
  
  return (
    <Suspense fallback={null}>
      <CommandPalette {...props} />
    </Suspense>
  );
}
