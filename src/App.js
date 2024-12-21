import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom';
import EmployeeProvider from './components/Employee';
import HeaderComponent from './components/Header';
import MainComponent from './components/Main';
import FooterComponent from './components/Footer';



function App() {
  return (
    <div className="user-select-none">
      <BrowserRouter>
        <EmployeeProvider>
          <HeaderComponent/>
          <MainComponent/>
          <FooterComponent/>
        </EmployeeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
