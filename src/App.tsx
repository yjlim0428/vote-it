import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { Header } from './pages/components';
import { Main, Setting } from './pages';
import { useState } from 'react';

// export type LoginProps = boolean;

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  return (
    <Router>
      <div className="App">
        <Header isLogin={isLogin} setIsLogin={setIsLogin} />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/setting" element={<Setting />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
