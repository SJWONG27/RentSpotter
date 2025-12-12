import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <>
      <div className="bg-emerald-500/10 text-emerald-500 space-x-2 p-4 flex items-center text-sm rounded-md">
        <CheckCircledIcon className="h-4 w-4" />
        <p>{message}</p>
      </div>
    </>
  );
};
