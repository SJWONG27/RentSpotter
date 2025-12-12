import React, { useEffect, useState } from "react";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import {
  LeaseIntro,
  PropertyInfo,
  TermFour,
  TermOne,
  TermThree,
  TermTwo,
} from "../AgreementText";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import axios from "axios";
import { useParams } from "react-router-dom";

const TenantAgreementPage1 = () => {
  const { leaseAgreementId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    day: "",
    month: "",
    year: "",
    lessorName: "",
    lessorIc: "",
    lesseeName: "",
    lesseeIc: "",
    address: "",
    effectiveDate: "",
    expireDate: "",
    rentRmWord: "",
    rentRmNum: "",
    advanceDay: "",
    depositRmWord: "",
    depositRmNum: "",
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
          nextButtonHref={`/tenantLeaseAgreementPg2/${leaseAgreementId}`}
        >
          {LeaseIntro(
            data.day,
            data.month,
            data.year,
            data.lessorName,
            data.lessorIc,
            data.lesseeName,
            data.lesseeIc
          )}
          {PropertyInfo(data.address)}
          <AgreementTerm number="1" title="term">
            {TermOne(data.effectiveDate, data.expireDate)}
          </AgreementTerm>
          <AgreementTerm number="2" title="rent">
            {TermTwo(data.rentRmWord, data.rentRmNum, data.advanceDay)}
          </AgreementTerm>
          <AgreementTerm number="3" title="deposit">
            {TermThree(data.depositRmWord, data.depositRmNum)}
          </AgreementTerm>
          <AgreementTerm number="4" title="COVENANTS BY THE LESSEE">
            {TermFour()}
          </AgreementTerm>
        </AgreementWrapper>
      )}
    </>
  );
};

export default TenantAgreementPage1;
