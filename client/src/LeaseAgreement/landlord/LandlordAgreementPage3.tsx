import { lessorSignatureUrl } from "@/component/AgreementComponents/agreement-signals";
import axios from "axios";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import { TermEighteen, TermSeventeen } from "LeaseAgreement/AgreementText";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LandlordAgreementPage3 = () => {
  const { leaseAgreementId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    lessorSignature: "",
    lessorDesignation: "",
    lessorIc: "",
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
  const dialogLandlordText = `Your Lease Agreement had been submitted to the system and sent to your tenant, please be patient to wait for him/her to check and sign for this lease agreement, you might track your lease agreement status at ${(
    <a href="/landlordApplicant">applicant page</a>
  )}.`;

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <AgreementWrapper
          title="Lease Agreement"
          dialogCloseText="OK"
          dialogDescription={dialogLandlordText}
          dialogTitle="Submitted Successfully"
          dialogTriggerText="Save and Submit"
          landlordLastPage={true}
        >
          <AgreementTerm number="17" title="no partnership">
            {TermSeventeen()}
          </AgreementTerm>
          <AgreementTerm number="18" title="SUCCESSORS BOUND ">
            {TermEighteen(
              data.lessorSignature,
              data.lessorDesignation,
              data.lessorIc
            )}
          </AgreementTerm>
        </AgreementWrapper>
      )}
    </>
  );
};

export default LandlordAgreementPage3;
