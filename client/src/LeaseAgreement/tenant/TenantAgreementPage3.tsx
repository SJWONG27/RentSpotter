import axios from "axios";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import { TermEighteen, TermSeventeen } from "LeaseAgreement/AgreementText";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const parseLocalStorage = (key: string): any => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error(`Error parsing ${key} from localStorage:`, err);
    return null;
  }
};

const TenantAgreementPage3 = () => {
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

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <AgreementWrapper
          title="Lease Agreement"
          nextButtonText="Sign Now"
          nextButtonHref={`/tenantLeaseAgreementForm/${leaseAgreementId}`}
        >
          <AgreementTerm number="17" title="no partnership">
            {TermSeventeen()}
          </AgreementTerm>
          <AgreementTerm number="18" title="SUCCESSORS BOUND">
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

export default TenantAgreementPage3;
