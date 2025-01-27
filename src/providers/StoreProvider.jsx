import React, { useEffect, useState } from 'react';
import { StoreContext } from '../hooks/useStores';
import { rootStore } from '../stores/RootStore';
import { useAuth } from '../stores/context/AuthContext';

export const StoreProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [store, setStore] = useState(null);

  useEffect(() => {
    const storeInstance = rootStore(currentUser);
    setStore(storeInstance);
  }, [currentUser]);

  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};