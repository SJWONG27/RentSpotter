import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { useNavigate } from "react-router-dom";

interface AgreementDialogProps {
  aboveTitleChildren?: React.ReactNode;
  triggerText: string;
  title: string;
  description?: string;
  labelTextArr?: string[];
  closeText: string;
  closeHref?: string;
  leaseAgreementId?: string;
  landlordLastPage?: boolean;
}

export function AgreementDialog({
  triggerText,
  title,
  description,
  labelTextArr,
  closeText,
  closeHref,
  aboveTitleChildren,
  leaseAgreementId,
  landlordLastPage,
}: AgreementDialogProps) {
  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="my-12 px-16 py-8 font-semibold rounded-lg text-2xl text-white bg-dark-orange hover:shadow-standardisedHoverShadow hover:opacity-70">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {aboveTitleChildren}
          <DialogTitle className="mb-2">{title}</DialogTitle>
          {landlordLastPage ? (
            <DialogDescription>
              <p>
                Your Lease Agreement had been submitted to the system and sent
                to your tenant, please be patient to wait for him/her to check
                and sign for this lease agreement, you might track your lease
                agreement status at{" "}
                <a href="/landlordApplicant">applicant page</a>
              </p>
            </DialogDescription>
          ) : (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        {labelTextArr &&
          labelTextArr.map((labelText, index) => (
            <div className="grid gap-4 py-4" key={index}>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={labelText} className="text-right">
                  {labelText}
                </Label>
                <Input
                  id={labelText}
                  defaultValue="Pedro Duarte"
                  className="col-span-3"
                />
              </div>
            </div>
          ))}

        <DialogFooter>
          <div className="flex justify-center w-full">
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                landlordLastPage
                  ? navigate("/landlordApplicant")
                  : navigate(`/fullAgreement/${leaseAgreementId}`);
              }}
              className=" px-8 py-4 font-semibold text-xl rounded-lg text-white bg-dark-orange hover:shadow-standardisedHoverShadow hover:opacity-70"
              type="submit"
            >
              {closeText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
