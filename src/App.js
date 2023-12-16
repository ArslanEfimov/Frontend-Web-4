import './App.css';
import Auth from "./UI/views/Auth";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./UI/views/Main";




function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path = "/auth" element={<Auth/>}/>
                <Route path="/main" element={<Main/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
