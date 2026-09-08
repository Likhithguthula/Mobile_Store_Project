import { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState([]);
  const { addToast } = useToast();

  const toggleCompare = (mobile) => {
    setCompareItems((prev) => {
      const exists = prev.some((item) => item.id === mobile.id);
      if (exists) {
        addToast(`Removed ${mobile.name} from comparison`, "info");
        return prev.filter((item) => item.id !== mobile.id);
      } else {
        if (prev.length >= 4) {
          addToast("You can compare up to 4 smartphones at a time", "error");
          return prev;
        }
        addToast(`Added ${mobile.name} to comparison`, "success");
        return [...prev, mobile];
      }
    });
  };

  const removeFromCompare = (id) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isComparing = (id) => {
    return compareItems.some((item) => item.id === id);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
