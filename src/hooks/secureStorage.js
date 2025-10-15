// utils/SecureStorage.js
import secureLocalStorage from "react-secure-storage";

class SecureStorage {
    setItem(key, value) {
        try {
            const serialized = JSON.stringify(value);
            secureLocalStorage.setItem(key, serialized);
        } catch (error) {
            console.error(`Failed to set item in secureLocalStorage: ${error}`);
        }
    }

    getItem(key) {
        try {
            const item = secureLocalStorage.getItem(key);
           
            if (!item) return null;

            try {
                return JSON.parse(item);
            } catch (parseError) {
                console.warn(`Item for key "${key}" is not JSON-parsable:`, parseError);
                return item;
            }
        } catch (error) {
            console.error(`Failed to get item from secureLocalStorage: ${error}`);
            return null;
        }
    }

    removeItem(key) {
        try {
            secureLocalStorage.removeItem(key);
        } catch (error) {
            console.error(`Failed to remove item from secureLocalStorage: ${error}`);
        }
    }

    clear() {
        try {
            secureLocalStorage.clear();
        } catch (error) {
            console.error(`Failed to clear secureLocalStorage: ${error}`);
        }
    }

    hasItem(key) {
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