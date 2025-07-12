import './App.css';
import {Routes, Route} from "react-router-dom";
import SignUp from "./views/Authentication/SignUp";
import SignIn from "./views/Authentication/SignIn";
import OAuth from "./views/Authentication/OAuth";
import Main from "./views/Main";

function App() {

  return (
    <Routes>
        <Route path="/" element={<Main />} />  {/* ✅ 메인페이지 추가 */}
        <Route path={'/auth'}>
            <Route path={'sign-up'} element={<SignUp />} />
            <Route path={'sign-in'} element={<SignIn />} />
            <Route path={'oauth-response/:token/:expirationTime'} element={<OAuth />} />
        </Route>
    </Routes>
  );
}

export default App;
