import Bycycle_rent_main_map from './site/bicycle_rent/Biycycle_rent_main_map'
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/bicycle_rent' element={<Bycycle_rent_main_map/>} />
    </Routes>
  );
}

export default App;