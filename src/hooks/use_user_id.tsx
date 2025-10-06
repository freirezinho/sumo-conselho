import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { printDebug } from "../utils/print_debug";
import useRemoteConfig from "./use_remote_config";

interface IdContextType {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  getIsPresidingOfficer: () => boolean;
  userName: string;
  getPresidencyCall: (user: string) => [x: string];
  highCouncilMembers: [x: string];
}

const IdContext = createContext<IdContextType|undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useUserId() {
  const context = useContext(IdContext);
  if (context === undefined) {
    throw new Error("useUserId must be used withn an IdProvider");
  }

  return context
}

export function IdProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const rcPresidencyCall = useRemoteConfig('presidency_call');
  const rcHcMembers = useRemoteConfig('high_council_members');

  const getIsPresidingOfficer = useCallback(() => {
    const presidingOfficerCodes = ["4496", "0385", "128A"];
    const user = userId || "";
    printDebug("Checking if user is presiding officer:", presidingOfficerCodes.includes(user));
    return presidingOfficerCodes.includes(user);
  }, [userId]);

  const getPresidencyCall: (user: string) => [x:  string] = useCallback((user: string) => {
    printDebug("Getting presidency call for user:", user);
    printDebug("Presidency call info retrieved from firebase:", rcPresidencyCall);
    printDebug("Parsed config: ", JSON.parse(rcPresidencyCall as string));
    return JSON.parse(rcPresidencyCall as string)[user] || null;
  }, [rcPresidencyCall]);

  const highCouncilMembers: [x: string] = useMemo(() => rcHcMembers ? JSON.parse(rcHcMembers as string) : {}, [rcHcMembers])
  const codeMap = new Map<string, string>(Object.entries(highCouncilMembers));
  const userName = userId ? codeMap.get(userId) || "Usuário Desconhecido" : "Desconhecido";

  const value = useMemo(() => ({
    userId,
    setUserId,
    getIsPresidingOfficer,
    userName,
    getPresidencyCall,
    highCouncilMembers 
  }), [
    userId,
    getIsPresidingOfficer,
    getPresidencyCall,
    userName,
    highCouncilMembers,
  ]);

  return (
    <IdContext.Provider value={value}>
      {children}
    </IdContext.Provider>
  )
}