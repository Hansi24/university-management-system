// ToastContext.tsx
import React, { createContext, useRef, ReactNode } from 'react';
import { Toast } from 'primereact/toast';

export interface ToastContextType {
    showErrorMessage: (body: string) => void;
    showSuccessMessage: (body: string) => void;
    showInfoMessage: (body: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const toast = useRef<Toast>(null);

    const showErrorMessage = (body: string) => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: body, life: 1500 });
    };

    const showSuccessMessage = (body: string) => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: body, life: 1500 });
    };

    const showInfoMessage = (body: string) => {
        toast.current?.show({ severity: 'info', summary: 'Info', detail: body, life: 1500 });
    };

    return (
        <ToastContext.Provider value={{ showErrorMessage, showSuccessMessage, showInfoMessage }}>
            {children}
            <Toast ref={toast} />
        </ToastContext.Provider>
    );
};

export default ToastContext;
