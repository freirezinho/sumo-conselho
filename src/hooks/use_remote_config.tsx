import { useEffect, useState } from "react";
import { remoteConfig } from "../infra/firebase/firebase.config";
import { fetchAndActivate, getValue } from "firebase/remote-config";
import { printDebug } from "../utils/print_debug";

const useRemoteConfig = (key: string) => {
  const [value, setValue] = useState<string | boolean | undefined>();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        printDebug('Fetching configs from Firebase')
        await fetchAndActivate(remoteConfig);
        printDebug('Configs fetched and activated')
        const fetchedValue = getValue(remoteConfig, key).asString() || getValue(remoteConfig, key).asBoolean();
        printDebug(`Fetched value for key "${key}":`, fetchedValue);
        setValue(fetchedValue);
      } catch (error) {
        console.error("Failed to fetch Remote Config", error);
      }
    };

    fetchConfig();
  }, [key]);

  return value;
};

export default useRemoteConfig;