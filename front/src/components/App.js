import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoutEl";
import { CurrentUserContext } from "./Context";
import Header from "./header/Header";
import Footer from "./footer/footer";
import SignIn from "./sign/SignIn";
import SignUp from "./sign/SignUp";
import LoaclPosts from "./localPosts/LocalPosts";
import PublicPost from "./publicPosts/publicPosts";
import { data } from "../utils/constants";
import { useUser } from "../utils/customHooks/useUser";
import { useLocalPosts } from "../utils/customHooks/useLocalPosts";
import Notice from "./notice/Notice";
import EmailModal from "./EmailModal/EmailModal";
import { localPostApi } from "../utils/api/apiLocal";



/* 
api
защитить роуты
кнопка изменения профиля
*/
/* 
диограмма
заглушка на локал пост 
статус публикации
форма для луза
публик пост

*/
function App() {
  const navigate = useNavigate();
  const { loggedIn, signUp, signIn, signOut, changeUserInfo, isLoadingUser, userResMsg, userData, auth } = useUser();
  const { getLPList, createLPel, putCashDataLP, deleteCashDataLP, refreshPost, LPList, isLoadingLP, LPResMsg } = useLocalPosts()
  const [resMessage, setResMessage] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailModalData, setEmailModalData] = useState(null);
  useEffect(() => {
    auth();
    getLPList()
  }, [])
  useEffect(() => {
    setResMessage(userResMsg);
  }, [userResMsg]);
  useEffect(() => {
    setResMessage(LPResMsg)
  }, [LPResMsg]);
  /* develop */
  async function submitEmailModal(data) {
    try {

      data.emailTo = userData.email
      const response = await localPostApi.mailReminder(data);
      refreshPost(response);
    }
    catch (e) {
      console.log(e)
    }

  }
  function openEmailModal({ show, data }) {
    if (data) {
      setEmailModalData(data)
    }
    setShowEmailModal(show)
  }
  return (
    <div className="App">
      <CurrentUserContext.Provider value={userData}>
        <Header loggedIn={loggedIn} signOut={signOut} />
        <Notice resMessage={resMessage} />
        {showEmailModal && <EmailModal submitForm={submitEmailModal} openEmailModal={openEmailModal} emailModalData={emailModalData} />}
        <Routes>
          <Route path="/sign-up" element={<SignUp submit={signUp} isLoading={isLoadingUser} />} />
          <Route path="/sign-in" element={<SignIn submit={signIn} isLoading={isLoadingUser} />} />
          <Route path="/local-posts"
            element={<ProtectedRouteElement
              element={LoaclPosts}
              loggedIn={loggedIn}
              auth={auth}
              isLoading={isLoadingUser}
              changeUserInfo={changeUserInfo}
              localData={LPList}
              isLoadingLP={isLoadingLP}
              LPResMsg={LPResMsg}
              openEmailModal={openEmailModal}
              deleteCashDataLP={deleteCashDataLP}
              putCashDataLP={putCashDataLP}
              createPost={createLPel} />} />
          <Route path="/public-posts"
            element={<ProtectedRouteElement
              element={PublicPost}
              localData={data}
              auth={auth}
              loggedIn={loggedIn} />} />
        </Routes>
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
