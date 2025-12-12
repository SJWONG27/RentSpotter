import "TenantPOV/tenantapplication.css";
import axios from "axios";
import PropertyCard, {
 PropertyCardProps,
} from "component/AgreementComponents/property-card";
import { set } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


interface IToken {
 token: string;
 userId: string;
}


interface ILeaseAgreement {
 _id: string;
 tenantId: string;
 landlordId: string;
 propertyId: string;
 applicationId: string;
 leaseStatus: string;
 day: string;
 month: string;
 year: string;
 lessorName: string;
 lessorIc: string;
 lesseeName: string;
 address: string;
 effectiveDate: string;
 expireDate: string;
 rentRmWord: string;
 rentRmNum: string;
 advanceDay: string;
 depositRmWord: string;
 depositRmNum: string;
 lessorAdd: string;
 lessorTel: string;
 lessorFax: string;
 lesseeAdd: string;
 lesseeTel: string;
 lesseeFax: string;
 lessorDesignation: string;
 lessorSignature: string;
 lesseeIc: string;
 lesseeDesignation: string;
 lesseeSignature: string;
 completed: boolean;
 PDF: string;
}


interface IProperty {
 landlordId: string;
 name: string;
 type: string;
 address: string;
 location: string;
 postcode: string;
 bedroom: number;
 bathroom: number;
 furnishing: string;
 parking: number;
 floorLevel: number;
 buildUpSize: string;
 facilities: string;
 accessibility: string;
 price: string;
 description: string;
 coverPhoto: string;
 photos: string[];
}


interface ICombination {
 property: IProperty;
 leaseAgreement: ILeaseAgreement;
 locationOwner: string;
}


const TenantAgreementHome = () => {
 const [leaseAgreementList, setLeaseAgreementList] = useState<
   ILeaseAgreement[] | []
 >([]);
 const [activePropertyListingInfo, setActivePropertyListingInfo] = useState<
   ICombination[] | []
 >([]);
 const [expiredPropertyListingInfo, setExpiredPropertyListingInfo] = useState<
   ICombination[] | []
 >([]);
 const [loading, setLoading] = useState(false);


 useEffect(() => {
   const token = localStorage.getItem("token");
   if (!token) {
     return;
   }
   const decodedToken = jwtDecode<IToken>(token);
   const userId = decodedToken.userId;
   async function fetchLeaseAgreements() {
     setLoading(true);
     try {
       const response = await axios.get(
         `/api/leaseAgreement/getLeaseAgreements/${userId}`,
         {
           headers: { Authorization: `Bearer ${token}` },
         }
       );
       console.log("Lease agreements fetched:", response.data);
       setLeaseAgreementList(response.data);
     } catch (err) {
       console.error("Error fetching applications data:", err);
       Swal.fire({
         icon: "error",
         title: "Oops...",
         text: "Failed to load application data!",
         confirmButtonColor: "#FF8C22",
       });
     } finally {
       setLoading(false);
     }
   }
   fetchLeaseAgreements();
 }, []);


 useEffect(() => {
   setLoading(true);
   async function fetchPropertyInfo() {
     try {
       const promises = leaseAgreementList.map(async (leaseAgreement) => {
         const response = await axios.get(
           `/api/applications/ViewProperty/${leaseAgreement.propertyId}`
         );
         const property: IProperty = response.data;
         const landlordName = await axios.get(
           `/api/users/${response.data.landlordId}`
         );
         console.log(
           "Property fetched for application:",
           leaseAgreement,
           property,
           landlordName
         );
         const element: ICombination = {
           leaseAgreement: leaseAgreement,
           property: property,
           locationOwner: landlordName as unknown as string,
         };
         return {
           property: response.data,
           leaseAgreement,
           locationOwner: landlordName.data.data.username,
         };
       });
       const activePropertyList: ICombination[] = [];
       const expiredPropertyList: ICombination[] = [];


       const propertyData: ICombination[] = await Promise.all(promises);
       propertyData.forEach((element: ICombination) => {
         if (element.leaseAgreement.leaseStatus === "Effective") {
           activePropertyList.push(element);
         } else if (element.leaseAgreement.leaseStatus === "Expired") {
           expiredPropertyList.push(element);
         }
       });


       setActivePropertyListingInfo(activePropertyList);
       setExpiredPropertyListingInfo(expiredPropertyList);
     } catch (err) {
       console.error("Error fetching property data:", err);
       Swal.fire({
         icon: "error",
         title: "Oops...",
         text: "Failed to load property data!",
         confirmButtonColor: "#FF8C22",
         customClass: {
           confirmButton: "my-confirm-button-class",
         },
       });
     } finally {
       setLoading(false);
     }
   }
   if (leaseAgreementList.length > 0) {
     fetchPropertyInfo();
   } else {
     setActivePropertyListingInfo([]);
     setExpiredPropertyListingInfo([]);
     setLoading(false);
   }
   fetchPropertyInfo();
 }, [leaseAgreementList]);


 return (
   <>
     {loading ? (
       <></>
     ) : (
       <main>
         <div className="pageMainContainer">
           <h1 className="pageMainTitle">Lease Agreements</h1>
           {activePropertyListingInfo.length > 0 && (
             <>
               <h2 className="applicationSubTitle">Active</h2>
               {activePropertyListingInfo.map((info, index) => (
                 <PropertyCard
                   key={index}
                   leaseAgreementId={info.leaseAgreement._id}
                   imageUrl={`http://localhost:5000/uploads/${info.property.coverPhoto}`}
                   title={info.property.name}
                   // `${property.location} | ${property.type} rented out by ${property.landlordUsername}`,
                   locationOwner={`${info.property.location} | ${info.property.type} rented out by ${info.locationOwner}`}
                   bedroom={info.property.bedroom}
                   bathroom={info.property.bathroom}
                   sqft= {`${info.property.buildUpSize} Sqft`}
                   price={`RM ${info.property.price}`}
                   status={info.leaseAgreement.leaseStatus}
                 />
               ))}
             </>
           )}
           {expiredPropertyListingInfo.length > 0 && (
             <>
               <h2 className="applicationSubTitle">Expired</h2>
               {expiredPropertyListingInfo.map((info, index) => (
                 <PropertyCard
                   key={index}
                   leaseAgreementId={info.leaseAgreement._id}
                   imageUrl={`http://localhost:5000/uploads/${info.property.coverPhoto}`}
                   title={info.property.name}
                   // `${property.location} | ${property.type} rented out by ${property.landlordUsername}`,
                   locationOwner={`${info.property.location} | ${info.property.type} rented out by ${info.locationOwner}`}
                   bedroom={info.property.bedroom}
                   bathroom={info.property.bathroom}
                   sqft= {`${info.property.buildUpSize} Sqft`}
                   price={`RM ${info.property.price}`}
                   status={info.leaseAgreement.leaseStatus}
                 />
               ))}
             </>
           )}
         </div>
       </main>
     )}
   </>
 );
};


export default TenantAgreementHome;



