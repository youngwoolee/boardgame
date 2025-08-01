import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import SignUp from "./views/Authentication/SignUp";
import SignIn from "./views/Authentication/SignIn";
import OAuth from "./views/Authentication/OAuth";
import Main from "./views/Main";
import AdditionalInfo from "./views/Authentication/AdditionalInfo";
import AppLayout from "./views/AppLayout";
import MyPage from "./views/My/MyPage";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import UploadGame from "./views/UploadGame";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRoute from "./components/AdminRoute";

function App() {

  return (
      <>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Main />} />
                <Route path="my" element={<MyPage />} />
                <Route path="upload" element={
                    <AdminRoute>
                        <UploadGame />
                    </AdminRoute>
                } />
            </Route>
            {/* 인증 관련 페이지는 공통 레이아웃 없이 별도 처리 */}
            <Route path="/auth">
                <Route path="sign-up" element={<SignUp />} />
                <Route path="sign-in" element={<SignIn />} />
                <Route path="oauth-response/:token/:expirationTime" element={<OAuth />} />
                <Route path="additional-info/:token/:expirationTime" element={<AdditionalInfo />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          <ToastContainer
              position="bottom-center" // 알림 위치
              autoClose={2000}     // 자동으로 닫히는 시간 (2초)
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              theme="light"
          />
      </>
  );
}

export default App;
