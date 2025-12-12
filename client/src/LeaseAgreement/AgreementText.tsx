import {
  lessorSignature,
  lessorSignatureUrl,
} from "component/AgreementComponents/agreement-signals";
import { text } from "@fortawesome/fontawesome-svg-core";
import { effect } from "@preact/signals";

const PartToFillIn = (info: string) => {
  return <span className="font-bold underline">{info}</span>;
};

const BoldText = (text: string) => {
  return <span className="font-bold">{text}</span>;
};

export const LeaseIntro = (
  day: string,
  month: string,
  year: string,
  lessorName: string,
  lessorIc: string,
  lesseeName: string,
  lesseIc: string
) => {
  return (
    <p>
      {BoldText("THIS LEASE AGREEMENT")} (hereinafter referred to as the "
      {BoldText("Agreement")}") is made and entered into this{" "}
      {PartToFillIn(day)} day of {PartToFillIn(month)}, 20{PartToFillIn(year)},
      by and between {PartToFillIn(lessorName)} with NRIC No.
      {PartToFillIn(lessorIc)} (hereinafter referred to as the “
      {BoldText("Lessor")}”) and {lesseeName} with NRIC No.{" "}
      {PartToFillIn(lesseIc)} (hereinafter referred to as the “
      {BoldText("Lessee")}”). <br />
      <br />
      The Lessor and Lessee shall hereinafter be referred to in this Agreement
      as the “{BoldText("Parties")}” or individually as a “{BoldText("Party")}”
      as the context may require. <br />
    </p>
  );
};

export const PropertyInfo = (address: string) => {
  return (
    <p>
      {BoldText("WHEREAS:-")} <br />
      <br /> A. The Lessor is the registered proprietor/beneficial owner of the
      premise having its address at {PartToFillIn(address)} which is held under
      the document of title appended in Schedule 1 (Land/ Premise Title)
      (hereinafter referred to as the "{BoldText("Premise")}"). <br />
      <br /> B. The Lessor is desirous of leasing the Premise and the Lessee is
      desirous of leasing the Premise from Lessor, in order to develop a
      renewable energy installation under a feed-in approval pursuant to the
      Renewable Energy Act 2011 (hereinafter referred to as the “
      {BoldText("Project")}”), on the terms and conditions as contained herein.
      The plans of the Project are set out and appended in Schedule 2 (Project
      Plans) herein.
      <br />
      <br /> {BoldText("NOW IT IS HEREBY AGREED as follows")} <br />
    </p>
  );
};

export const TermOne = (effectiveDate: string, expireDate: string) => {
  return (
    <p>
      The Lessor hereby agrees to lease the Premise to the Lessee and the Lessee
      hereby accepts from the Lessor the lease of the Premise for a period
      commencing from {PartToFillIn(effectiveDate)} (hereinafter referred to as
      the “{BoldText("Effective Date")}”) to {PartToFillIn(expireDate)}{" "}
      (hereinafter referred to as the “{BoldText("Lease Expiry Date")}”) upon
      the terms and conditions of this Agreement (hereinafter referred to as the
      “{BoldText("Term")}”). This Agreement shall be terminated upon the Lease
      Expiry Date unless otherwise extended in accordance with clause 15 hereof.
      Notwithstanding the Term, this Agreement may be terminated in accordance
      with the provision of this Agreement
    </p>
  );
};

export const TermTwo = (
  rentRmWord: string,
  rentRmNum: string,
  advanceDay: string
) => {
  return (
    <p>
      (a) The rent for the use of the Premise for the Term shall be an amount
      equal to Ringgit Malaysia {PartToFillIn(rentRmWord)} only (RM
      {PartToFillIn(rentRmNum)}) (hereinafter referred to as the “
      {BoldText("Rent")}”) payable monthly in advance on the{" "}
      {PartToFillIn(advanceDay)} day of each month of the Term (hereinafter
      referred to as the “{BoldText("Due Date")}”). The first payment for the
      rent shall be made on the Effective Date. All such payments shall be made
      by cheque or bank draft payable to the Lessor on or before the Due Date
      and without demand. <br />
      <br /> (b) If the Rent is not paid within the Due Date, the Lessee shall
      be liable to pay to the Lessor a late payment interest at the rate of 8%
      per annum calculated on a daily 2 LeaseAgmt090413rev1 basis from the first
      day of the amount due for payment until the outstanding amount is paid in
      full, in addition to the Rent due and owing to the Lessee under sub-clause
      2(a).
    </p>
  );
};
export const TermThree = (depositRmWord: string, depositRmNum: string) => {
  return (
    <p>
      (a) Upon the due execution of this Agreement, the Lessee shall deposit
      with the Lessor the sum of Ringgit Malaysia {PartToFillIn(depositRmWord)}{" "}
      only (RM{PartToFillIn(depositRmNum)}) (hereinafter referred to as the “
      {BoldText("Deposit")}”) receipt of which is hereby acknowledged by the
      Lessor, as security to be set off for any damage caused to the Premise,
      and/or any failure of the Lessee to perform the covenants under clause 4
      hereof, during the Term. Such deposit shall be returned to the Lessee,
      without interest, and less any set off for damages to the Premise upon the
      termination of this Agreement. For avoidance of doubt, the setting off of
      the deposit in accordance with this clause, does not discharge the Lessee
      of his/her obligations under this Agreement, and this Agreement may be
      terminated in accordance with the provision of this Agreement. <br />
      <br />
      (b) In the event that a setting off of Deposit occurs pursuant to
      sub-clause 3(a), the Lessee shall reimburse with the Lessor a sum to
      ensure that the deposit sum is equal or more than the Deposit.
    </p>
  );
};

export const TermFour = () => {
  return (
    <p>
      The Lessee covenants and undertakes with the Lessor as follow: <br />
      <br />
      (a) to pay the Rent to the Lessor in the amount and in the manner
      stipulated in clause 2;
      <br />
      <br />
      (b) to use the Premise solely for the purpose of the Project upon the
      terms and conditions contained in this Agreement and the relevant form of
      renewable energy power purchase agreement (hereinafter referred to as the
      “REPPA”);
      <br />
      <br />
      (c) to not create mortgage, charge, lien or in any way create any
      encumbrance on the rights and interests of the Premise, without the prior
      written approval of the Lessor; <br />
      <br />
      (d) shall procure the payment of all electricity, water, telephone and all
      future quit rent, assessments, rates, other outgoings whatsoever assessed,
      charged or imposed by the relevant authority in respect of the Premise;
      (e) to keep the Premise in good tenantable repair and condition (fair wear
      and tear excepted) throughout the Term at its own costs and expense;{" "}
      <br />
      <br />
      (f) shall reasonably maintain the Premise free from all undergrowth,
      weeds, pests and other obstructions which may occur during the passage of
      time and shall bear the cost of such maintenance; <br />
      <br />
      (g) to comply with the provisions of all laws, ordinances, by-laws,
      regulations and rules for the time being in force affecting the Premise on
      any improvements, installations, additions or alterations, thereon or the
      Lessee’s occupation thereof and forthwith to satisfy all requirements of
      the local authority or any other authorities with respect to the Premise;{" "}
      <br />
      <br />
      (h) shall indemnify, protect and hold harmless the Lessor from and against
      suits, actions, claims, demands, damages, losses, expenses and costs of
      every kind and description to which the Lessor may be subjected to by
      reason of injury to or death of persons or damage to property of any
      person, firm or corporation whatsoever in any manner due to, arising out
      of or in connection with the occupation and use of the Premise by the
      Lessee under this Agreement, regardless of whether such suits, 3
      LeaseAgmt090413rev1 actions, claims, damages, losses, expenses or costs be
      against or sustained by the Lessor, or sustained by others to whom the
      Lessor may become liable. Upon request by the Lessor, the Lessee shall
      undertake to defend in connection with the matters under this clause;{" "}
      <br />
      <br />
      (i) shall adopt every reasonable precaution which may be necessary or
      expedient to prevent fire and pollution and shall adhere to all
      environment requirements, terms and conditions pertaining to pollution
      control, discharge of effluent, and like matters which are required by any
      statute, ordinance, by-laws regulations and to comply with any regulation
      of the relevant authorities from time to time; <br />
      <br />
      (j) shall not carry on or permit or cause to be carried on upon any part
      of the Premise, any trade or business of an immoral or illegal nature;{" "}
      <br />
      <br />
      (k) shall not permit or cause anything to be done in or upon the Premise
      or any part thereof which may be or become a nuisance or annoyance or
      cause damage or inconvenience to the Lessee or the tenants or occupiers of
      lands neighbouring the Premise; <br />
      <br />
      (l) shall take measures in order to ensure that there shall be no illegal
      occupation on any part of the Premise. The Lessee shall be responsible for
      all costs and expenses necessary for the eviction of any illegal occupiers
      and/or for the demolition of any illegal structures erected thereon;{" "}
      <br />
      <br />
      (m) at any time before the expiration or sooner determination of the Term
      to detach, remove and take away at its own cost any machinery, plant,
      equipment or such other items belonging to the Lessee which is capable of
      being removed without causing any damage to the Premise or any buildings
      or structures thereon and which may at any time have been placed by the
      Lessee upon the Premise; <br />
      <br />
      (n) shall insure and shall at all times during the Term hereby created
      maintain a valid insurance policy against any damage, malicious damage,
      loss or injury which may occur to the Premise by or arising out of and/or
      in carrying out the Project, copies of which shall be produced and shown
      to the Lessor upon request, and not to do or allow or permit to be done
      any act or thing which may render the terms of any policy of insurance
      taken out pursuant to this Agreement, to become void or liable to be set
      aside or insurance premium to be increased; and <br />
      <br />
      (o) not to place or permit to be placed on the fences, walls, buildings or
      other structures on the Premise any advertisement, nor to erect any
      hoarding or other structure for placing such advertisements thereon,
      unless with the prior written approval of the Lessor.
    </p>
  );
};

export const TermFive = () => {
  return (
    <p>
      Neither the Lessor nor the Lessee shall assign this Agreement, or sub-let
      or grant any license to use the Premise or any part thereof to any third
      party. An assignment, sub-letting or license to any third party or an
      assignment or sub-letting by operation of law shall be absolutely null and
      void.{" "}
    </p>
  );
};

export const TermSix = () => {
  return (
    <p>
      (a) the Lessor shall provide all necessary assistance to the Lessee to
      effect the registration of the Lease in accordance with the provision of
      the National Land Code 1965; and <br />
      <br />
      (b) the Lessee shall peaceably and exclusively hold the Premise for the
      purposes of the Project including but not limited to use and occupy the
      Premise for the purposes of carrying out the Project, without any
      disturbance or interruption by the Lessor or any person claiming through
      the Lessor provided that the Lessee pays the Rent, observes and performs
      the covenants on its part herein contained.
    </p>
  );
};

export const TermSeven = () => {
  return (
    <p>
      This Agreement may be terminated by either Party giving to the other
      thirty (30) days prior written notice in any of the following situations:{" "}
      <br />
      <br />
      (a) any breach by either Party of any material terms or conditions of this
      Agreement, subject to a prior written notice being given by the other
      Party to such Party to remedy any such breach within thirty (30) days;{" "}
      <br />
      <br />
      (b) the termination of the REPPA; <br />
      <br />
      (c) the assignment, novation, and/or transfer of the Project, and/or the
      assignment, novation, and/or transfer of the Feed-In Approval to any party
      due to the occurrence of an event of default under the REPPA; <br />
      <br />
      (d) any bankruptcy or insolvency proceeding initiated against the Party by
      any third party which is not dismissed within thirty (30) days from the
      date of service of summons on that Party by the court; or <br />
      <br />
      (e) the commission of any crime, breach of regulation by either Party in
      connection with this Agreement or any act or omission which seriously
      affects the interest of the other Party.
    </p>
  );
};

export const TermSevenA = () => {
  return (
    <p>
      In the event that this Agreement is terminated pursuant to clause 7
      herein: <br />
      <br />
      (a) the Premise and/or any interest therein shall revert to or be vested
      in the Lessor at no cost and expense to the Lessor; <br />
      <br />
      (b) the Lessor may at any time re-enter the Premise or any part thereof
      and take possession of the Premise; <br />
      <br />
      (c) the Deposit shall be returned to the Lessee, without interest, and
      less any set off for damages to the Premise and/or any failure of the
      Lessee to perform the covenants under clause 4; and <br />
      <br />
      (d) the termination of this Agreement shall not affect the rights and
      liabilities of the Parties which have accrued as at the date of the
      termination.
    </p>
  );
};

export const TermEight = () => {
  return (
    <p>
      Failure or neglect by either Party to enforce at any time any of the
      provisions hereof shall not be construed, nor shall be deemed to be, a
      waiver of that Party's rights hereunder, nor in any way affect the
      validity of the whole or any part of this Agreement, nor prejudice that
      Party's rights to take subsequent action.{" "}
    </p>
  );
};

export const TermNine = () => {
  return (
    <p>
      This Agreement constitutes the entire agreement between the Parties in
      relation to its subject matter and supersedes all prior agreements and
      understandings whether oral or written with respect to that subject matter
      and no variation of this Agreement shall be effective unless reduced to
      writing signed by or on behalf of a duly authorised representative of each
      of the Parties hereto.
    </p>
  );
};

export const TermTen = () => {
  return (
    <p>
      The invalidity or unenforceability of any portion or terms and conditions
      of this Agreement shall in no way affect the validity or enforceability of
      any other portion or terms and conditions hereof. Any invalid or
      unenforceable portion or terms and conditions shall be deemed severed from
      this Agreement, and the Lessor and the Lessee shall negotiate in good
      faith to agree to a similar portion or terms and conditions which legally
      sets forth the original intent of the Parties, and the balance of this
      Agreement shall be construed and enforced as if this Agreement did not
      contain such invalid or unenforceable terms and conditions.{" "}
    </p>
  );
};

export const TermEleven = () => {
  return (
    <p>
      The Parties hereby agree that this Agreement shall be construed in
      accordance with the laws of Malaysia and both Parties agree to submit to
      the jurisdiction of Malaysian courts.
    </p>
  );
};

export const TermTwelve = (
  lessorAdd: string,
  lessorTel: string,
  lessorFax: string,
  lesseeAdd: string,
  lesseeTel: string,
  lesseeFax: string
) => {
  return (
    <p>
      (a) Except where otherwise provided herein, each communication (whether a
      demand, notice, request or otherwise) under or in relation to this
      Agreement shall be in writing and shall be sent by prepaid registered post
      or personal delivery. Each such communication to be given by a Party to
      the other Party under or in relation to this Agreement shall be sent to
      that other Party by registered post or personal delivery to that other
      Party's address as set out below or such other address as that other Party
      shall have notified the first-mentioned Party in writing or such usual
      address of that other Party last known to the first-mentioned Party:{" "}
      <br />
      {BoldText("LESSOR")} <br />
      <br />
      Adress: {PartToFillIn(lessorAdd)} <br />
      Tel No: {PartToFillIn(lessorTel)}
      <br />
      Fax No: {PartToFillIn(lessorFax)}
      <br />
      <br />
      {BoldText("LESSEE")} <br />
      <br />
      Adress: {PartToFillIn(lesseeAdd)} <br />
      Tel No: {PartToFillIn(lesseeTel)}
      <br />
      Fax No: {PartToFillIn(lesseeFax)}
      <br />
    </p>
  );
};

export const TermThirteen = () => {
  return (
    <p>
      No modification, variation or amendment of this Agreement, the schedules
      or the appendices hereof shall have any legal effect and force unless such
      modification, variation or amendment is in writing, consented and executed
      by the Parties.{" "}
    </p>
  );
};

export const TermFourteen = () => {
  return (
    <p>
      The Lessee shall bear the stamp duty payable on this Agreement and all the
      registration fees, stamp duty and other costs payable in respect of the
      lease, the presentation of documentation in relation to the Agreement and
      the preparation and submission of the prescribed form pertaining to the
      lease. Each Party hereto shall pay their own costs and expenses incidental
      to the negotiation, preparation and execution of this Agreement.
    </p>
  );
};

export const TermFifteen = () => {
  return (
    <p>
      Any date or period mentioned in this Agreement may be extended by
      agreement between the Parties hereto, failing which, in relation to any
      such date or period, time shall be of the essence of this Lease Agreement.{" "}
    </p>
  );
};

export const TermSixteen = () => {
  return (
    <p>
      The Parties hereto agree that the obligations of the Parties under clauses
      8, 11, 12, 13, and 14 shall continue and survive the termination of this
      Agreement and be enforceable at law and equity at all times.{" "}
    </p>
  );
};

export const TermSeventeen = () => {
  return (
    <p>
      Nothing in this Agreement shall constitute or be deemed to constitute a
      partnership between any of the Parties hereto and none of them shall have
      any authority to bind the other in any way.{" "}
    </p>
  );
};

export const TermEighteen = (
  lessorSignatureUrl: string,
  lessorDesignation: string,
  lessorIc: string,
  lesseeSignatureUrl?: string,
  lesseeDesignation?: string,
  lesseeIc?: string
) => {
  return (
    <p>
      This Agreement shall bind the Parties hereto and their successors in
      title. <br />
      <br />
      {BoldText("IN WITNESS WHEREOF")} the Parties have caused these presents to
      be duly executed: <br />
      <br />
      <section className="my-4">
        <div className=" flex items-center ">
          <div className="w-[100px] sm:w-[300px] md:w-[500px]">
            Signed by <br />
            For and on behalf of the Lessor
          </div>
          <div>
            <span>: </span>
            {lessorSignatureUrl && (
              <img
                src={lessorSignatureUrl}
                alt="sign"
                className="object-cover max-w-32 max-h-28"
              />
            )}
          </div>
        </div>
        <br />
        <div className="flex items-center">
          <div className="w-[100px] sm:w-[300px] md:w-[500px]">Designation</div>
          <div>
            <span>: </span>
            <span>{lessorDesignation}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-[100px] sm:w-[300px] md:w-[500px]">NRIC No.</div>
          <div>
            <span>: </span>
            <span>{lessorIc}</span>
          </div>
        </div>
        <br />
        <section>
          <div className=" flex items-center ">
            <div className="w-[100px] sm:w-[300px] md:w-[500px]">
              Signed by <br />
              For and on behalf of the Lessee
            </div>
            <div>
              <span>: </span>
              {lesseeSignatureUrl && (
                <img
                  src={lesseeSignatureUrl}
                  alt="sign"
                  className="object-cover max-w-32 max-h-28"
                />
              )}
            </div>
          </div>
          <br />
          <div className="flex items-center">
            <div className="w-[100px] sm:w-[300px] md:w-[500px]">
              Designation
            </div>
            <div>
              <span>: </span>
              <span>{lesseeDesignation ? lesseeDesignation : ""}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-[100px] sm:w-[300px] md:w-[500px]">NRIC No.</div>
            <div>
              <span>: </span>
              <span>{lesseeIc ? lesseeIc : ""}</span>
            </div>
          </div>
        </section>
      </section>
    </p>
  );
};
