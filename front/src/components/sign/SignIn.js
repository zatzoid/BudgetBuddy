import React from "react";
import SignForm from "./signform/SignForm";

export default function SignIn(props) {
    return (
        <>
            <SignForm
                submit={props.submit}
                signUp={false} />
        </>
    )
}