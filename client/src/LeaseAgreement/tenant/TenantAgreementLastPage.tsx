import { lessorSignatureUrl } from "@/component/AgreementComponents/agreement-signals";
import axios from "axios";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import { TermEighteen, TermSeventeen } from "LeaseAgreement/AgreementText";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TenantAgreementLastPage = () => {
  const { leaseAgreementId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    lessorSignature: "",
    lessorDesignation: "",
    lessorIc: "",
    lesseeSignature: "",
    lesseeDesignation: "",
    lesseeIc: "",
  });
  useEffect(() => {
    setLoading(true);
    async function fetchLease() {
      const response = await axios.get(
        `/api/leaseAgreement/getLeaseAgreement/${leaseAgreementId}`
      );
      setData(response.data.leaseAgreement);
    }

    fetchLease();
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <AgreementWrapper
          title="Lease Agreement"
          dialogCloseText="OK"
          dialogDescription="You have agreed and submitted the lease agreement to the landlord."
          dialogTitle="Submitted Successfully"
          dialogTriggerText="Save and Submit"
          leaseAgreementId={leaseAgreementId}
        >
          <AgreementTerm number="17" title="no partnership">
            {TermSeventeen()}
          </AgreementTerm>
          <AgreementTerm number="18" title="SUCCESSORS BOUND ">
            {TermEighteen(
              data.lessorSignature,
              data.lessorDesignation,
              data.lessorIc,
              data.lesseeSignature,
              data.lesseeDesignation,
              data.lesseeIc
            )}
          </AgreementTerm>
        </AgreementWrapper>
      )}
    </>
  );
};

export default TenantAgreementLastPage;
