import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import {
  LeaseIntro,
  PropertyInfo,
  TermOne,
  TermTwo,
  TermThree,
  TermFour,
  TermFive,
  TermSix,
  TermSeven,
  TermSevenA,
  TermEight,
  TermNine,
  TermTen,
  TermEleven,
  TermTwelve,
  TermThirteen,
  TermFourteen,
  TermFifteen,
  TermSixteen,
  TermSeventeen,
  TermEighteen,
} from "./AgreementText";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTimeout } from "usehooks-ts";
import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import axios from "axios";
import { PDFViewer } from "@react-pdf/renderer";
var Buffer = require("buffer/").Buffer;

const AgreementFull = () => {
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
    lessorAdd: "",
    lessorTel: "",
    lessorFax: "",
    lesseeAdd: "",
    lesseeTel: "",
    lesseeFax: "",
    lessorSignature: "",
    lessorDesignation: "",
    lesseeSignature: "",
    lesseeDesignation: "",
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

  const pdfExportComponent = useRef<PDFExport | null>(null);

  // const exportPDFWithMethod = () => {
  //   const element = document.body;
  //   savePDF(element, {
  //     paperSize: "A4",
  //   });
  // };

  const exportPDFWithMethod = () => {
    let gridElement = document.body;
    drawDOM(gridElement, {
      paperSize: "A4",
    })
      .then((group) => {
        return exportPDF(group);
      })
      .then(async (dataUri) => {
        // const pdfBuffer = Buffer.from(dataUri.split(";base64,")[1], "base64");
        const pdfBase64 = dataUri.split(";base64,")[1];
        const pdfRes = await axios.post(
          `/api/leaseAgreement/savePDFToDB/${leaseAgreementId}`,
          { pdfBase64: pdfBase64 }
        );
        console.log(dataUri.split(";base64,")[1]);
      });
  };

  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  const navigate = useNavigate();
  useTimeout(() => {
    exportPDFWithMethod();
    navigate("/tenantLeaseAgreementHome");
  }, 100);

  return (
    <>
      {loading ? (
        <> </>
      ) : (
        <PDFExport ref={pdfExportComponent} paperSize="A4">
          <AgreementWrapper title="Lease Agreement">
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
        </PDFExport>
      )}
    </>
  );
};

export default AgreementFull;