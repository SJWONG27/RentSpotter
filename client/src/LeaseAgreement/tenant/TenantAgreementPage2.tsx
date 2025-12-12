import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import {
  TermEight,
  TermEleven,
  TermFifteen,
  TermFive,
  TermFourteen,
  TermNine,
  TermSeven,
  TermSevenA,
  TermSix,
  TermSixteen,
  TermTen,
  TermThirteen,
  TermTwelve,
} from "../AgreementText";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const TenantAgreementPage2 = () => {
  const { leaseAgreementId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    lessorAdd: "",
    lessorTel: "",
    lessorFax: "",
    lesseeAdd: "",
    lesseeTel: "",
    lesseeFax: "",
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
          nextButtonText="Next"
          nextButtonHref={`/tenantLeaseAgreementPg3/${leaseAgreementId}`}
        >
          <AgreementTerm number="5" title="ASSIGNMENT AND SUB-LETTING">
            {TermFive()}
          </AgreementTerm>
          <AgreementTerm
            number="6"
            title="COVENANTS BY THE LESSOR The Lessor covenants and undertakes with the Lessee that: "
          >
            {TermSix()}
          </AgreementTerm>
          <AgreementTerm number="7" title="termination">
            {TermSeven()}
          </AgreementTerm>
          <AgreementTerm number="7A" title="CONSEQUENCES OF TERMINATION ">
            {TermSevenA()}
          </AgreementTerm>
          <AgreementTerm number="8" title="waiver">
            {TermEight()}
          </AgreementTerm>
          <AgreementTerm number="9" title="entire agreement">
            {TermNine()}
          </AgreementTerm>
          <AgreementTerm number="10" title="severability">
            {TermTen()}
          </AgreementTerm>
          <AgreementTerm number="11" title="law">
            {TermEleven()}
          </AgreementTerm>
          <AgreementTerm number="12" title="notice">
            {TermTwelve(
              data.lessorAdd,
              data.lessorTel,
              data.lessorFax,
              data.lesseeAdd,
              data.lesseeTel,
              data.lesseeFax
            )}
          </AgreementTerm>
          <AgreementTerm number="13" title="modification">
            {TermThirteen()}
          </AgreementTerm>
          <AgreementTerm number="14" title="costs">
            {TermFourteen()}
          </AgreementTerm>
          <AgreementTerm number="15" title="time">
            {TermFifteen()}
          </AgreementTerm>
          <AgreementTerm number="16" title="survival of clauses">
            {TermSixteen()}
          </AgreementTerm>
        </AgreementWrapper>
      )}
    </>
  );
};

export default TenantAgreementPage2;
