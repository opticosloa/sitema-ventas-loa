import { useEffect, useMemo, useState } from 'react';

export const useForm = <T extends Record<string, any>>(initialForm: T, formValidations: Record<string, [(value: any) => boolean, string]> = {}) => {

  const [formState, setFormState] = useState<T>(initialForm);
  const [formValidation, setFormValidation] = useState<Record<string, string | null>>({});

  useEffect(() => {
    createValidators();
  }, [formState])

  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm])


  const isFormValid = useMemo(() => {

    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }

    return true;
  }, [formValidation])


  const onInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;

    let parsedValue: any = value;

    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value);
    }

    if (type === "date" || type === "datetime-local") {
      parsedValue = value === "" ? "" : new Date(value);
    }

    setFormState({
      ...formState,
      [name]: parsedValue,
    });
  };


  const onResetForm = () => {
    setFormState(initialForm);
  }

  const createValidators = () => {

    const formCheckedValues: Record<string, string | null> = {};

    for (const formField of Object.keys(formValidations)) {
      const [fn, errorMessage] = formValidations[formField];

      formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
    }

    setFormValidation(formCheckedValues);
  }

  const setFieldValue = (name: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    setFormState,
    setFieldValue,

    ...formValidation,
    isFormValid
  }
}
