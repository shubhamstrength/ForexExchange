import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import Forex from "./components/forex";

 // Create a client
 const queryClient = new QueryClient();

function ForexApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Forex />
      </div>
    </QueryClientProvider>
  );
}

export default ForexApp;
