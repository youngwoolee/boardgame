import './App.css';
import {Routes, Route} from "react-router-dom";
import SignUp from "./views/Authentication/SignUp";
import SignIn from "./views/Authentication/SignIn";
import OAuth from "./views/Authentication/OAuth";
import Main from "./views/Main";
import AdditionalInfo from "./views/Authentication/AdditionalInfo";
import MyReservations from "./views/My/MyReservations";
import MyReservationDetail from "./views/My/MyReservationDetailModal";
import AppLayout from "./views/AppLayout";
import MyPage from "./views/My/MyPage";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Admin from "./views/UploadImage";
import UploadImage from "./views/UploadImage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
      <>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Main />} />
                <Route path="my" element={<MyPage />} />
                <Route path="upload" element={<UploadImage />} />
            </Route>
            {/* 인증 관련 페이지는 공통 레이아웃 없이 별도 처리 */}
            <Route path="/auth">
                <Route path="sign-up" element={<SignUp />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="oauth-response/:token/:expirationTime" element={<OAuth />} />
                <Route path="additional-info/:token/:expirationTime" element={<AdditionalInfo />} />
            </Route>
        </Routes>
          <ToastContainer
              position="bottom-center" // 알림 위치
              autoClose={2000}     // 자동으로 닫히는 시간 (2초)
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
          />
      </>
  );
}

export default App;
