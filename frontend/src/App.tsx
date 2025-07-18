import './App.css';
import {Routes, Route} from "react-router-dom";
import SignUp from "./views/Authentication/SignUp";
import SignIn from "./views/Authentication/SignIn";
import OAuth from "./views/Authentication/OAuth";
import Main from "./views/Main";
import AdditionalInfo from "./views/Authentication/AdditionalInfo";
import MyReservations from "./views/My/MyReservations";
import MyReservationDetail from "./views/My/MyReservationDetail";
import AppLayout from "./views/AppLayout";

function App() {

  return (
    <Routes>
        <Route path="/" element={<AppLayout />}>
            <Route index element={<Main />} />
            <Route path="reservations" element={<MyReservations />} />
            <Route path="reservations/:reservationId" element={<MyReservationDetail />} />
        </Route>
        {/* 인증 관련 페이지는 공통 레이아웃 없이 별도 처리 */}
        <Route path="/auth">
            <Route path="sign-up" element={<SignUp />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="oauth-response/:token/:expirationTime" element={<OAuth />} />
            <Route path="additional-info/:token/:expirationTime" element={<AdditionalInfo />} />
        </Route>
    </Routes>
  );
}

export default App;
