import { useEffect } from 'react';
import Main_map from './pages/Main_map';
import Main_menu from './pages/Main_menu';
import Main_dis from './pages/Main_dis';

const { kakao } = window;

function App() {
  return (
    <div>
      <Main_map />
      {/* <Main_dis /> */}
    </div>
  );
}

export default App;