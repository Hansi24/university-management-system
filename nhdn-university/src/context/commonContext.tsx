import React, { createContext, useMemo, useState } from 'react';


// Define the shape of your context value
interface CommonContextValue {
    spinnerOpen: boolean;
    setSpinnerOpen: (state: boolean) => void;
}

// Create the initial context value
const initialContextValue: CommonContextValue = {
    spinnerOpen: true,
    setSpinnerOpen: () => { },
};

// Create the context
export const CommonContext = createContext<CommonContextValue>(initialContextValue);

type CommonProviderProps = {
    children: React.ReactNode
};

// Create the context provider component
export const CommonProvider: React.FC<CommonProviderProps> = ({ children }) => {
    const [spinnerOpen, setSpinnerOpen] = useState(false);


    const contextValue = useMemo(() => ({
        spinnerOpen,
        setSpinnerOpen,
    }), [
        spinnerOpen,
        setSpinnerOpen,
    ]);
    return (
        <CommonContext.Provider value={contextValue}>
            {children}
        </CommonContext.Provider>
    );
};