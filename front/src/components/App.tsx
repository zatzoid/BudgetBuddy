import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoutEl";
import Header from "./header/Header";
import Footer from "./footer/footer";
import Notice from "./notice/Notice";

const SignIn = lazy(() => import('./sign/SignIn'));
const SignUp = lazy(() => import('./sign/SignUp'));
const LocalPosts = lazy(() => import('./localPosts/LocalPosts'));
const PublicPost = lazy(() => import('./publicPosts/publicPosts'));
const Present = lazy(() => import('./Present/Present'));
const NotFoundPage = lazy(() => import('./NotFoundPage/NotFoundPage'));

/*
import SignIn from "./sign/SignIn";
import SignUp from "./sign/SignUp";
import LocalPosts from "./localPosts/LocalPosts";
import PublicPost from "./publicPosts/publicPosts";
import Present from "./Present/Present";
import NotFoundPage from "./NotFoundPage/NotFoundPage"; 
*/


import { CashData } from "../utils/types";
import { authUser } from "../utils/store/userMeSlice";
import { useAppDispatch, useAppSelector } from "../utils/store/hooks";
import { getLPList } from "../utils/store/localPostsSlice";
import { getAppModeFromLs } from "../utils/store/appModeSlice";







function App() {
  const dispatch = useAppDispatch();
  const userMe = useAppSelector(state => state.userMe);
  const [hardcoreRouting, setHardcoreRouting] = useState<boolean>(false);
  const navigate = useNavigate()



  function openEmailModal(data: CashData | null) {
    console.log('openEmailModal', data);
  }






  useEffect(() => {
    firstRender();
  }, []);

  async function firstRender() {

    await dispatch(getAppModeFromLs())
    await dispatch(authUser());
    setHardcoreRouting(true);

    if (userMe.isLoggedIn) {
      await dispatch(getLPList());
      navigate('/local-posts');
    }


  }







  return (
    <div className="App">

      <Header />
      <Notice />
      {/*  {emailModalData !== null && <EmailModal submitForm={submitEmailModal} openEmailModal={openEmailModal} emailModalData={emailModalData} />} */}
      <Suspense fallback={<> <p>loading ...</p></>}>
        {hardcoreRouting && <Routes>
          <Route path="/" element={<Present />} />
          <Route path="/*" element={<NotFoundPage />} />

          <Route path="/sign-up"
            element={<ProtectedRouteElement
              loggedIn={!userMe.isLoggedIn}
              redirect={'/local-posts'}
              element={SignUp} />} />

          <Route path="/sign-in"
            element={<ProtectedRouteElement
              loggedIn={!userMe.isLoggedIn}
              redirect={'/local-posts'}
              element={SignIn} />} />

          <Route path="/local-posts"
            element={<ProtectedRouteElement
              loggedIn={userMe.isLoggedIn}
              element={LocalPosts}
              openEmailModal={openEmailModal}
            />} />
          <Route path="/public-posts"
            element={<ProtectedRouteElement
              loggedIn={userMe.isLoggedIn}
              redirect={'/local-posts'}
              element={PublicPost}
            />} />

        </Routes>}
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
