import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoutEl";
import { CurrentUserContext } from "./Context";
import Header from "./header/Header";
import Footer from "./footer/footer";

import SignIn from "./sign/SignIn";
import SignUp from "./sign/SignUp";
import LoaclPosts from "./localPosts/LocalPosts";
import { data } from "../utils/constants";



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
  const [loggedIn, setLoggedIn] = useState(true);
  const [userData, setUserData] = useState({ name: 'statqw1eeqwic', email: 'staqweqwasdastic@email.com' });
  const [localPostsList, setLocalPostsList] = useState(data);
  useEffect(() => {
    setLocalPostsList(data)
  }, [])
  function log() {
    if (!loggedIn) {
      return setLoggedIn(true)
    }
    setLoggedIn(false)
  };
  function signOut() {
    navigate('/sign-in')
  };
  return (
    <div className="App">
      <CurrentUserContext.Provider value={userData}>
        <Header loggedIn={loggedIn} signOut={signOut} />
        <Routes>
          <Route path="/sign-up" element={<SignUp submit={log} />} />
          <Route path="/sign-in" element={<SignIn submit={log} />} />
          <Route path="/local-posts" element={<LoaclPosts localData={localPostsList} />} />
        </Routes>
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
