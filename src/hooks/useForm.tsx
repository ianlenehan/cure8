import { useState, useEffect, FormEvent } from 'react';

export const useForm = (
  onSubmitCallback: (values: any) => any,
  validate: (values: any) => any
) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({} as any);
  const [hasErrors, setHasErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * In this useEffect hook, we are watching the errors object for changes.
   * If the `isSubmitting` boolean is `true` and there are no errors, we call the
   * `onSubmitCallback` passed in by the component.
   */
  useEffect(() => {
    const noErrors = !hasErrors;
    if (noErrors && isSubmitting) {
      onSubmitCallback(values);
      setValues({});
    }
  }, [errors, isSubmitting]);

  /**
   * Here we are checking for the presence of errors in a passed in errors object.
   * We set the result in state so we can pass this to the component if it needs it.
   * We are also returning the boolean so it can be used immediately if necessary.
   */
  const checkForErrors = (errorsObject: {}) => {
    const errorsExist =
      Object.keys(errorsObject).length > 0 &&
      errorsObject.constructor === Object;
    setHasErrors(errorsExist);
    return errorsExist;
  };

  /**
   * When `handleSubmit` is called, we validate the form, and if there are no errors, we trigger
   * the `onSubmitCallback` by setting the `isSubmitting` boolean to `true` (see `useEffect`).
   */
  const handleSubmit = () => {
    const newErrors = validate(values);
    const noErrorsExist = !checkForErrors(newErrors);
    if (noErrorsExist) setIsSubmitting(true);

    setErrors(validate(values));
  };

  /**
   * `handleChange` takes an object with a field name and a new value and sets that value into the values object.
   * If there is an existing error for that field, we re-validate the form. This ensures the
   * validation error appearing on the form disappears as soon as the user fixes the error.
   * We do this so the user does not have to wait until they press the submit button to remove
   * any validation warnings.
   */
  const handleChange = (name: string, value: string) => {
    const newValues = { ...values, [name]: value };

    if (errors[name]) {
      const newErrors = validate(newValues);
      checkForErrors(newErrors);
      setErrors(validate(newValues));
    }

    setValues(newValues);
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    hasErrors
  };
};

export default useForm;
