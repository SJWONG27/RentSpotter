import { Button } from "components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AgreementDialog } from "./agreement-dialog";

interface AgreementWrapperProps {
  title: string;
  nextButtonText?: string;
  nextButtonHref?: string;
  dialogTriggerText?: string;
  dialogTitle?: string;
  dialogCloseText?: string;
  dialogDescription?: string;
  landlordLastPage?: boolean;
  leaseAgreementId?: string;
  children: React.ReactNode;
}

export const AgreementWrapper = ({
  title,
  nextButtonText,
  nextButtonHref,
  dialogTriggerText,
  dialogTitle,
  dialogCloseText,
  dialogDescription,
  landlordLastPage,
  leaseAgreementId,
  children,
}: AgreementWrapperProps) => {
  const navigate = useNavigate();
  return (
    <>
      <main className="m-6 px-24 py-4 text-xl leading-10">
        <h1 className="underline text-center mb-12">{title}</h1>
        {children}
        <div className="flex justify-end">
          {nextButtonText && nextButtonHref && (
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate(nextButtonHref);
              }}
              className="my-12 px-16 py-8 font-semibold rounded-lg text-2xl text-white bg-dark-orange hover:shadow-standardisedHoverShadow hover:opacity-70"
            >
              {nextButtonText}
            </Button>
          )}
          {dialogTitle && dialogTriggerText && dialogCloseText && (
            <AgreementDialog
              aboveTitleChildren={
                <div className="w-full flex justify-center my-4">
                  <img src="/Images/tick.png" alt="tick" className="w-20 " />
                </div>
              }
              title={dialogTitle}
              triggerText={dialogTriggerText}
              closeText={dialogCloseText}
              description={dialogDescription}
              closeHref="/"
              landlordLastPage={landlordLastPage}
              leaseAgreementId={leaseAgreementId}
            ></AgreementDialog>
          )}
        </div>
      </main>
    </>
  );
};
