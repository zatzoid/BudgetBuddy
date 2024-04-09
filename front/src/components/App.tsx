import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoutEl";
import { CurrentUserContext } from "./Context";
import Header from "./header/Header";
import Footer from "./footer/footer";
import SignIn from "./sign/SignIn";
import SignUp from "./sign/SignUp";
import LocalPosts from "./localPosts/LocalPosts";
import PublicPost from "./publicPosts/publicPosts";
import { useUser } from "../utils/customHooks/useUser";
import { useLocalPosts } from "../utils/customHooks/useLocalPosts";
import Notice from "./notice/Notice";
import EmailModal from "./EmailModal/EmailModal";
import { useEmailModal } from "../utils/customHooks/useEmailModal";
import Present from "./Present/Present";
import NotFoundPage from "./NotFoundPage/NotFoundPage";
import {  MetaData } from "../utils/types";



/* 

1. переписать на тс.
запуске✅
дебаг✅
2. рефакторинг мелкий
3. переделать notice  в монетку сбоку экрана
  с отображением статуса запроса 
  с динамической проверкий связи с базой
4. ОФФЛАЙН МОД 
  на локальном джсоне и фейк айпиай
5. компонент border переделать в canvas


*/
function App() {
  const { loggedIn, signUp, signIn, signOut, changeUserInfo, deleteUserMe, isLoadingUser, userData, auth } = useUser({ callBackResMsg: setResMsg });
  const { getLPList, createLPel, putCashDataLP, deleteCashDataLP, refreshPost, patchLPCashData, LPList, isLoadingLP } = useLocalPosts({ callBackResMsg: setResMsg });
  const { emailModalData, emailModalLodaing, submitEmailModal, openEmailModal } = useEmailModal({callBack: refreshPost});
  const [resMessage, setResMessage] = useState<MetaData | null>(null);

  useEffect(() => {
    auth();
  }, []);
  useEffect(() => {
    if (loggedIn) {
      getLPList()
    }
  }, [loggedIn]);



  function setResMsg(data: MetaData) {
    console.log('api response::', data);
    setResMessage(data);

  }



  return (
    <div className="App">
      <CurrentUserContext.Provider value={userData}>
        <Header loggedIn={loggedIn} signOut={signOut} deleteUserMe={deleteUserMe} />
        <Notice resMessage={resMessage} />
        {emailModalData !== null && <EmailModal submitForm={submitEmailModal} openEmailModal={openEmailModal} emailModalData={emailModalData} />}
        <Routes>
          <Route path="/" element={<Present loggedIn={loggedIn} />} />
          <Route path="/*" element={<NotFoundPage />} />
          {!loggedIn && <Route path="/sign-up" element={<SignUp submit={signUp} isLoading={isLoadingUser} />} />}
          {!loggedIn && <Route path="/sign-in" element={<SignIn submit={signIn} isLoading={isLoadingUser} />} />}
          <Route path="/local-posts"
            element={<ProtectedRouteElement
              element={LocalPosts}
              loggedIn={loggedIn}
              auth={auth}
              isLoading={isLoadingUser}
              changeUserInfo={changeUserInfo}
              localData={LPList}
              isLoadingLP={isLoadingLP}
              LPResMsg={resMessage}
              emailModalLodaing={emailModalLodaing}
              openEmailModal={openEmailModal}
              deleteCashDataLP={deleteCashDataLP}
              putCashDataLP={putCashDataLP}
              patchLPCashData={patchLPCashData}
              createPost={createLPel} />} />
          <Route path="/public-posts"
            element={<ProtectedRouteElement
              element={PublicPost}
              auth={auth}
              loggedIn={loggedIn} />} />

        </Routes>
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
