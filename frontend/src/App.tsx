import './App.css';
import {Routes, Route} from "react-router-dom";
import SignUp from "./views/Authentication/SignUp";
import SignIn from "./views/Authentication/SignIn";
import OAuth from "./views/Authentication/OAuth";
import Main from "./views/Main";
import AdditionalInfo from "./views/Authentication/AdditionalInfo";
import MyReservations from "./views/My/MyReservations";
import MyReservationDetail from "./views/My/MyReservationDetail";

function App() {

  return (
    <Routes>
        <Route path="/" element={<Main />} />  {/* ✅ 메인페이지 추가 */}
        <Route path={'/auth'}>
            <Route path={'sign-up'} element={<SignUp />} />
            <Route path={'sign-in'} element={<SignIn />} />
            <Route path={'oauth-response/:token/:expirationTime'} element={<OAuth />} />
            <Route path={'additional-info/:token/:expirationTime'} element={<AdditionalInfo />} />
            <Route path="/reservations" element={<MyReservations />} />
            <Route path="/reservations/:reservationId" element={<MyReservationDetail />} />
        </Route>
    </Routes>
  );
}

export default App;
