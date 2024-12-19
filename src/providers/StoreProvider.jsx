import React from 'react';
import { StoreContext } from '../hooks/useStores';
import { rootStore } from '../stores/RootStore';

export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};
