import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <>
      <div className="bg-destructive/10 text-destructive space-x-2 p-3 flex items-center text-sm rounded-md">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <p className="my-auto">{message}</p>
      </div>
    </>
  );
};
