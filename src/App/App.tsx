import { HashRouter, Routes, Route } from 'react-router-dom'
// import styles from './App.module.scss'
import MainPage from '../pages/MainPage';
import DetaliedPage from '../pages/IdPage';
//import RegistrationPage from 'pages/RegistrationPage';
//import LoginPage from 'pages/LoginPage';
import { ROUTES } from "./Routes";

function App() {
    return (
      <div className='app'>
        <HashRouter>
            <Routes>
                <Route path={ROUTES.HOME} element={<MainPage />} />

                <Route path="categorys">
                  <Route path=":id" element={<DetaliedPage />} />
                </Route>

            </Routes>
        </HashRouter>
      </div>
    );
  }
  
export default App;