import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoutEl";
import { CurrentContext } from "./Context";
import Header from "./header/Header";
import Footer from "./footer/footer";
import SignIn from "./sign/SignIn";
import SignUp from "./sign/SignUp";
import LocalPosts from "./localPosts/LocalPosts";
import PublicPost from "./publicPosts/publicPosts";
import { useUser } from "../utils/customHooks/useUser";
import { useLocalPosts } from "../utils/customHooks/useLocalPosts";
import Notice from "./notice/Notice";
import EmailModal from "./localPosts/EmailModal/EmailModal";
import { useEmailModal } from "../utils/customHooks/useEmailModal";
import Present from "./Present/Present";
import NotFoundPage from "./NotFoundPage/NotFoundPage";
import { AppSettings, MetaData, appMode } from "../utils/types";
import { apiReq } from "../utils/api/apiReq";







function App() {
  const [appSettings, setAppSettings] = useState<AppSettings>(getAppSettingsFromLS())
  const { loggedIn, signUp, signIn, signOut, changeUserInfo, deleteUserMe, isLoadingUser, userData, switchAppModeUser, auth } = useUser({ callBackResMsg: setResMsg, startAppSettings: appSettings });
  const { getLPList, createLPel, putCashDataLP, deleteCashDataLP, refreshPost, patchLPCashData, switchAppModeLp, LPList, isLoadingLP } = useLocalPosts({ callBackResMsg: setResMsg, startAppSettings: appSettings });
  const { emailModalData, emailModalLodaing, submitEmailModal, openEmailModal } = useEmailModal({callBackResMsg: setResMsg, callBack: refreshPost });
  const [resMessage, setResMessage] = useState<MetaData | null>(null);
  const [hardcoreRouting, setHardcoreRouting] = useState<boolean>(false);

  const [appMode, setAppMode] = useState<appMode>({ mode: appSettings.startAppMode })

  async function switchAppMode(mode: appMode) {
    setResMsg({ message: 'загрузка', statusCode: 102 })
    try {

      if (mode.mode === 'online') {
        const { metaData } = await apiReq.checkStatus();
        setResMsg(metaData)


      } else if (mode.mode === 'offline') {

        setResMsg({ message: `Приложение запущенно в ${mode.mode} моде.`, statusCode: 200 })
      }

      setAppMode(mode);
      switchAppModeLp(mode);
      switchAppModeUser(mode);



    } catch (error: unknown) {

      setResMsg({ message: 'Сервер не отвечает', statusCode: 500 })

    }


  }


  function getAppSettingsFromLS(): AppSettings {
    const settings = localStorage.getItem('settings') || null;
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      return parsedSettings

    } else {
      return {
        statsMustOpen: false,
        startAppMode: 'online',
        profitHideComplited: false,
        profitSorting: '',
        loseHideComplited: false,
        loseSorting: '',
        noticeMustOpen: false
      }
    }

  }




  function updateAppSettings(event: React.ChangeEvent<HTMLInputElement>) {

    const newSettings = { ...appSettings } as AppSettings;
    const settingsName = event.target.name
    if (settingsName in newSettings) {

      const keyName = settingsName as keyof AppSettings;

      const settingsValue = typeof newSettings[keyName] === "boolean" ? event.target.checked : event.target.value
      const target = { [keyName]: settingsValue } as Partial<AppSettings>

      if (typeof settingsValue === typeof newSettings[keyName]) {


        (newSettings[keyName] as AppSettings[typeof keyName]) = target[keyName] as AppSettings[typeof keyName]
      }
    }

    setAppSettings(newSettings);
    putAppSettingIntoLs(newSettings);

  }

  function putAppSettingIntoLs(data: AppSettings) {
    const settings = localStorage.getItem('settings') || null;
    if (settings) {
      localStorage.removeItem('settings')
    }
    const lsData = JSON.stringify(data);
    localStorage.setItem('settings', lsData)
  }



  useEffect(() => {
    firstRender();
  }, []);

  async function firstRender() {

    await auth();
    setHardcoreRouting(true);



  }
  useEffect(() => {
    if (loggedIn) {
      getLPList()
    }
  }, [loggedIn]);



  function setResMsg(data: MetaData) {
    setResMessage(data);
  }





  return (
    <div className="App">
      <CurrentContext.Provider value={{
        userData, appMode, appSettings
      }}>
        <Header loggedIn={loggedIn} signOut={signOut} deleteUserMe={deleteUserMe} updateAppSettings={updateAppSettings} />
        <Notice resMessage={resMessage} switchMode={switchAppMode} />
        {emailModalData !== null && <EmailModal submitForm={submitEmailModal} openEmailModal={openEmailModal} emailModalData={emailModalData} />}
        {hardcoreRouting && <Routes>
          <Route path="/" element={<Present loggedIn={loggedIn} />} />
          <Route path="/*" element={<NotFoundPage />} />

          <Route path="/sign-up"
            element={<ProtectedRouteElement
              loggedIn={!loggedIn}
              redirect={'/local-posts'}
              element={SignUp}
              submit={signUp}
              isLoading={isLoadingUser} />} />
          <Route path="/sign-in"
            element={<ProtectedRouteElement
              loggedIn={!loggedIn}
              redirect={'/local-posts'}
              element={SignIn}
              submit={signIn}
              isLoading={isLoadingUser} />} />
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

        </Routes>}
        <Footer />
      </CurrentContext.Provider>
    </div>
  );
}

export default App;
