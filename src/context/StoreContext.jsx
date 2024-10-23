/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

function StoreContextProvider({ children }) {
  const apiUrl = "http://localhost:4000/api";
  const [popupConfirmState, setPopupConfirmState] = useState({
    show: false,
    message: "",
    question: "",
    onConfirm: null,
    onCancel: null,
  });

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("adminJwtToken="))
    ?.split("=")[1] || '';

  const authenticationAdmin = async () => {
    if(!token) {
      return false;
    }

    try {
      const response = await axios.get(`${apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        const result = response.data;
        
        if (result.success && result.data) {
          
          const user = result.data;
          
          if (user?.isAdmin) {
            return true;
          }

          return false;
        }
      }
    } catch (error) {
      alert("Cannot authenticate admin");
      window.location.href = "http://localhost:5173";
    }
  };

  const contextValue = {
    popupConfirmState,
    setPopupConfirmState,
    token,
    authenticationAdmin,
    apiUrl,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

export default StoreContextProvider;
