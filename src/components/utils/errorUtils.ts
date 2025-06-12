import { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";

export function getErrorMessage(error: any, property?: string): string {
  return (
    (property && error?.response?.data?.errors?.[property]?.[0]) ||
    error?.response?.data?.errors?.generalErrors?.[0] ||
    ""
  );
}

export function setFormErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>
): void {
  const errors = error?.response?.data?.errors;

  if (!errors) return;

  // Set field-specific errors
  Object.keys(errors).forEach((fieldName) => {
    if (fieldName !== "generalErrors" && Array.isArray(errors[fieldName])) {
      setError(fieldName as FieldPath<T>, {
        type: "server",
        message: errors[fieldName][0],
      });
    }
  });

  // Set general errors as root error
  if (errors.generalErrors && Array.isArray(errors.generalErrors)) {
    setError("root", {
      type: "server",
      message: errors.generalErrors[0],
    });
  }
}
