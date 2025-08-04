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
import UploadGame from "./views/Admin/UploadGame";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRoute from "./components/AdminRoute";
import EditGame from "./views/Admin/EditGame";

function App() {

  return (
      <>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Main />} />
                <Route path="my" element={<MyPage />} />
                <Route path="admin">
                    <Route path="upload" element={
                        <AdminRoute>
                            <UploadGame />
                        </AdminRoute>
                    } />
                    {/* ✅ 수정 페이지를 위한 새로운 라우트 추가 */}
                    <Route path="edit" element={
                        <AdminRoute>
                            <EditGame />
                        </AdminRoute>
                    } />
                </Route>
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
              position="bottom-center"
              autoClose={2000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme="light"
          />
      </>
  );
}

export default App;
