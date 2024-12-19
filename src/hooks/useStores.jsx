import React from 'react';
import { rootStore } from '../stores/RootStore';

export const StoreContext = React.createContext(rootStore);

export const useStores = () => {
  return React.useContext(StoreContext);
};