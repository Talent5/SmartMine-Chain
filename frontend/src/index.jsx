import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SmartMineDashboard from './SmartMineDashboard.jsx';
import LandingPage from './components/LandingPage.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  return showLanding
    ? <LandingPage onEnter={() => setShowLanding(false)} />
    : <SmartMineDashboard />;
};
export default App;
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
