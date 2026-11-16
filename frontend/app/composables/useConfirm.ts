export interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

interface ConfirmModalState extends ConfirmModalOptions {
  isOpen: boolean;
  resolve: ((confirmed: boolean) => void) | null;
}

export const useConfirm = () => {
  const state = useState<ConfirmModalState>('prism-confirm-modal', () => ({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'danger',
    resolve: null,
  }));

  const ask = (options: ConfirmModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      state.value = {
        isOpen: true,
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel || 'Delete Permanently',
        cancelLabel: options.cancelLabel || 'Cancel',
        variant: options.variant || 'danger',
        resolve,
      };
    });
  };

  const confirm = () => {
    if (state.value.resolve) {
      state.value.resolve(true);
    }
    state.value.isOpen = false;
    state.value.resolve = null;
  };

  const cancel = () => {
    if (state.value.resolve) {
      state.value.resolve(false);
    }
    state.value.isOpen = false;
    state.value.resolve = null;
  };

  return {
    state,
    ask,
    confirm,
    cancel,
  };
};
