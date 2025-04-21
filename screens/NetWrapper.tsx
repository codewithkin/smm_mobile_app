import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import OfflineScreen from "../screens/OfflineScreen";

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const checkConnection = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected ?? true);
  };

  useEffect(() => {
    checkConnection();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return <OfflineScreen onRetry={checkConnection} />;
  }

  return <>{children}</>;
};

export default Wrapper;
