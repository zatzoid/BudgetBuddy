import React, { useCallback } from "react";

export default function useFormWithValidation() {
    const [values, setValues] = React.useState({});
    const [errors, setErrors] = React.useState({});
    const [isValid, setIsValid] = React.useState(false);


    const handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setValues({ ...values, [name]: value });
        if (name === 'email') {
            const emailReg = /^[A-Za-z0-9]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            const isValidEmail = emailReg.test(value);
            setErrors({ ...errors, [name]: !isValidEmail ? `Введен некорректный email ${values.email}` : target.validationMessage });
            setIsValid(target.closest("form").checkValidity() && !errors.email);
            return
        }

        setErrors({ ...errors, [name]: target.validationMessage });
        setIsValid(target.closest("form").checkValidity() && !errors.email);
    };



    return { values, handleChange, errors, isValid };
}