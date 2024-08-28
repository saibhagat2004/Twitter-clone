import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient= new QueryClient({
  defaultOptions:{
    refetchOnWindowFocus: false,//React Query will refetch data when the user returns to the tab/window where your application is running. Setting this to false prevents this behavior, which can be useful if you want to minimize unnecessary network requests or if your data does not change frequently.
    //whenever the new tab is open or seen it prevent from data refetching minimize unnecessary netwoek request
  }
})
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools/>
    </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

//by wraping App inside BrowserRouter  we can use any component come from react-router dom  inside app.js