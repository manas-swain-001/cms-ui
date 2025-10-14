import React from "react";
import Routes from "./Routes";
import { GlobalContextProvider } from "context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slide, ToastContainer } from "react-toastify";
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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          transition={Slide}
        />
      </QueryClientProvider>
    </GlobalContextProvider>
  );
}

export default App;
