import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import History from "./components/history";

 // Create a client
 const queryClient = new QueryClient();
function HistoryApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <History />
      </div>
    </QueryClientProvider>
  );
}

export default HistoryApp;
