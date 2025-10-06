export const printDebug = (message: string, ...optionalParams: unknown[]): void => {
    if (import.meta.env.DEV) {
        console.log(".: DEV LOG :.")
        console.log(message, ...optionalParams);
    }
}