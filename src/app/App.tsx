import { BrowserRouter } from 'react-router';
import { AppRouter } from './routing/app-router';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="content">
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
