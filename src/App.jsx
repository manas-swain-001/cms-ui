import React from "react";
import Routes from "./Routes";
import { GlobalContextProvider } from "context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  })

  return (
    <GlobalContextProvider>
      <QueryClientProvider client={queryClient}>
        <Routes />
        <ToastContainer />
      </QueryClientProvider>
    </GlobalContextProvider>
  );
}

export default App;
