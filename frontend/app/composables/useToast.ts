export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export const useToast = () => {
  const toasts = useState<ToastItem[]>('prism-toasts', () => []);

  const dismiss = (id: string) => {
    toasts.value = toasts.value.filter((item) => item.id !== id);
  };

  const push = (toast: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const duration = toast.duration ?? 4200;
    toasts.value.push({ ...toast, id, duration });

    if (import.meta.client && duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
    return id;
  };

  return {
    toasts,
    push,
    dismiss,
    success: (title: string, description?: string) =>
      push({ type: 'success', title, description }),
    error: (title: string, description?: string) =>
      push({ type: 'error', title, description, duration: 5500 }),
    warning: (title: string, description?: string) =>
      push({ type: 'warning', title, description }),
    info: (title: string, description?: string) =>
      push({ type: 'info', title, description }),
  };
};
