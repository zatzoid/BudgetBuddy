
import SignForm from "./signform/SignForm";
import { UserSign } from "../../utils/types";

interface props {
    isLoading: boolean
    submit: (data: UserSign) => void
}

export default function SignIn(props: props) {
    return (
        <>
            <SignForm
                isLoading={props.isLoading}
                submit={props.submit}
                signUp={false} />
        </>
    )
}