import React from "react";
import SignForm from "./signform/SignForm";

export default function SignUp(props) {
    return (
        <>
            <SignForm
            isLoading={props.isLoading}
                submit={props.submit}
                signUp={true}

            />
        </>
    )
}