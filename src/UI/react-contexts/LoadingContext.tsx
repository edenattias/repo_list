import {createContext, Dispatch, SetStateAction} from 'react';

// create the context
const LoadingContext = createContext<{loading: boolean; setLoading: Dispatch<SetStateAction<boolean>>}>({} as any);

// export Provider, Consumer & Context
export const LoadingProvider = LoadingContext.Provider;
export const LoadingConsumer = LoadingContext.Consumer;
export default LoadingContext;
