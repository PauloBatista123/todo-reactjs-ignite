import { ToastContainer } from 'react-toastify';
import { Header } from './components/Header';
import { ToDo } from './components/ToDo';
import './styles/global.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div>
      <Header />
      <ToDo />
      <ToastContainer />
    </div>
  )
}

export default App
