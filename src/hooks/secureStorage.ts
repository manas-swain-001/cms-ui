// utils/SecureStorage.ts
import secureLocalStorage from "react-secure-storage";

type ValueType = string | number | boolean | null | Record<string, unknown> | unknown[];

class SecureStorage {
    setItem(key: string, value: ValueType): void {
        try {
            const serialized = JSON.stringify(value);
            secureLocalStorage.setItem(key, serialized);
        } catch (error) {
            console.error(`Failed to set item in secureLocalStorage: ${error}`);
        }
    }

    getItem<T = ValueType>(key: string): T | null {
        try {
            const item = secureLocalStorage.getItem(key) as string;
            if (!item) return null;

            try {
                return JSON.parse(item) as T;
            } catch (parseError) {
                console.warn(`Item for key "${key}" is not JSON-parsable:`, parseError);
                return item as unknown as T;
            }
        } catch (error) {
            console.error(`Failed to get item from secureLocalStorage: ${error}`);
            return null;
        }
    }

    removeItem(key: string): void {
        try {
            secureLocalStorage.removeItem(key);
        } catch (error) {
            console.error(`Failed to remove item from secureLocalStorage: ${error}`);
        }
    }

    clear(): void {
        try {
            secureLocalStorage.clear();
        } catch (error) {
            console.error(`Failed to clear secureLocalStorage: ${error}`);
        }
    }

    hasItem(key: string): boolean {
        try {
            return secureLocalStorage.getItem(key) !== null;
        } catch {
            return false;
        }
    }
}

// Export a singleton instance
const secureStorage = new SecureStorage();
export default secureStorage;