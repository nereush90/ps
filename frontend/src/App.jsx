import { useState } from 'react';
import UploadView from './views/UploadView';
import ResultView from './views/ResultView';
import HistoryView from './views/HistoryView';

export default function App() {
  const [view, setView] = useState('upload');
  const [result, setResult] = useState(null);

  function handleSuccess(doc) {
    setResult(doc);
    setView('result');
  }

  function handleReset() {
    setResult(null);
    setView('upload');
  }

  return (
    <div className="app">
      <header>
        <h1>Document Scanner</h1>
        <nav>
          <button
            onClick={() => setView('upload')}
            className={view === 'upload' || view === 'result' ? 'active' : ''}
          >
            Scan
          </button>
          <button
            onClick={() => setView('history')}
            className={view === 'history' ? 'active' : ''}
          >
            History
          </button>
        </nav>
      </header>
      <main>
        {view === 'upload' && <UploadView onSuccess={handleSuccess} />}
        {view === 'result' && result && <ResultView document={result} onReset={handleReset} />}
        {view === 'history' && <HistoryView />}
      </main>
    </div>
  );
}
