import React, { useCallback } from "react";
import { Input } from "../types";


export default function useFormWithValidation() {
    const [values, setValues] = React.useState<Input>({});
    const [errors, setErrors] = React.useState<Input>({});
    const [isValid, setIsValid] = React.useState<boolean>(false);
   /*  target.closest("form") */

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, form: HTMLFormElement) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setValues({ ...values, [name]: value });
        if (name === 'email') {
            const emailReg = /^[A-Za-z0-9]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            const isValidEmail = emailReg.test(value);
            setErrors({ ...errors, [name]: !isValidEmail ? `Введен некорректный email ${values.email}` : target.validationMessage });
            setIsValid(form.checkValidity() && !errors.email);
            return
        }
        setErrors({ ...errors, [name]: target.validationMessage });
        setIsValid(form.checkValidity() && !errors.email);
    };

    const resetForm = useCallback(() => {
        setValues({})
    }, [])

    return { values, handleChange, resetForm, errors, isValid };
}