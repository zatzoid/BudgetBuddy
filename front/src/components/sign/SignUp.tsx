
import SignForm from "./signform/SignForm";
import { UserSign } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import { signUp } from "../../utils/store/userMeSlice";

export default function SignUp() {
    
    const dispatch = useAppDispatch()
    const  apiStatus  = useAppSelector(store => store.apiStatus);
    function handleSignUp(data: UserSign) {
        dispatch(signUp(data))
    }
    
    return (
        <>
            <SignForm
                isLoading={apiStatus.isLoading}
                submit={handleSignUp}
                signUp={true}

            />
        </>
    )
}