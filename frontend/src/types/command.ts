export interface Command {
  id: string;
  label: string;
  action: () => void;
  icon: string;
  category: string;
}
