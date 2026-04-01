
'use client';

import { Alert, AlertColor, Grow, Snackbar, SnackbarCloseReason } from "@mui/material";

import { useContext, createContext, useState, SyntheticEvent } from "react";

type Toast = {
    id: string,
    message: string, 
    severity: AlertColor
}

type ToastContextType = {
    showError: (message: string) => void,
    showSuccess: (message: string) => void,
    showWarning: (message: string) => void,
    showInfo: (message: string) => void,
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const toastContext = useContext(ToastContext);

    if(!toastContext) {
        throw new Error("useToast must be used inside the toast provider");
    }

    return toastContext;
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toastList, setToastList] = useState<Toast[]>([]);

    const showError = (message: string) => {
        setToastList((prev) => {
            return [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    message,
                    severity: "error"
                }
            ]
        })    
    }

    const showSuccess = (message: string) => {
        setToastList((prev) => {
            return [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    message,
                    severity: "success"
                }
            ]
        })
    }

    const showInfo = (message: string) => {
        setToastList((prev) => {
            return [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    message,
                    severity: "info",
                }
            ]
        })
    }

    const showWarning = (message: string) => {
        setToastList((prev) => {
            return [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    message,
                    severity: "warning",
                }
            ]
        })
    }

    return (
        <ToastContext.Provider value={{
            showError,
            showSuccess,
            showWarning,
            showInfo
        }}>
            {children}
            {toastList.map((toast) => {
                const handleClose = (e?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
                    // Don't close the toast if they just click on a random part of the screen
                    if(reason === 'clickaway') {
                        return
                    }
                    setToastList((prev) => prev.filter((toastObject) => toastObject.id != toast.id))
                }

                return (
                    <Snackbar
                        key={toast.id}
                        slots={{ transition: Grow }}
                        open={true}
                        // Hide after 6 seconds
                        autoHideDuration={6000}
                        onClose={handleClose}
                    >
                        <Alert 
                            severity={toast.severity}
                            onClose={handleClose}
                            variant="filled"
                        >
                                {toast.message}
                        </Alert>
                    </Snackbar>
                )
            })}
        </ToastContext.Provider>
    )
}
