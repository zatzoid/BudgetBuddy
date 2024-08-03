
import SignForm from "./signform/SignForm";
import { UserSign } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import { signIn } from "../../utils/store/userMeSlice";


export default function SignIn() {

    const dispatch = useAppDispatch()
    const apiStatus = useAppSelector(store => store.apiStatus);
    function handleSignIn(data: UserSign) {
        dispatch(signIn(data))
    }
    return (
        <>
            <SignForm
                isLoading={apiStatus.isLoading}
                submit={handleSignIn}
                signUp={false} />
        </>
    )
}