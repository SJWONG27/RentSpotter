import React from "react";

interface AgreementTermProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export const AgreementTerm = ({
  number,
  title,
  children,
}: AgreementTermProps) => {
  return (
    <>
      <p className="font-bold my-4">
        {number}. {title.toUpperCase()}
      </p>
      {children}
    </>
  );
};
