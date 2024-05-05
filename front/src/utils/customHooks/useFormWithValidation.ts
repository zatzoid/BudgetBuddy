import React, { useCallback, useEffect, useState } from "react";
import { Input } from "../types";

interface props {
    values?: defaultValues
}
type defaultValues = { name: string, value: string }[]


export default function useFormWithValidation(props?: props) {
    const [values, setValues] = useState<Input>({});
    const [errors, setErrors] = useState<Input>({});
    const [isValid, setIsValid] = useState<boolean>(false);

    useEffect(() => {
       
        if (props && props.values) {
            props.values.forEach((val) => {
                values[val.name] = val.value;
                console.log(values);
            })
        }

    }, [])


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
        } else if (name === 'name') {

            setErrors({ ...errors, [name]: value.length < 2 ? `Имя должно содержать минимум 2 символа ` : target.validationMessage });
            setIsValid(form.checkValidity() && !errors.name);
            return
        }

        setErrors({ ...errors, [name]: target.validationMessage });
        setIsValid(form.checkValidity() && !errors.email);
    };

    const resetForm = useCallback(() => {
        setValues({})
        setIsValid(false)
    }, [])

    return { values, handleChange, resetForm, errors, isValid };
}