import Swal from 'sweetalert2';
import downloadPdfIcon from './Rental_Icon/downloadPDF_icon.png';
import './Alert.css'; 

const Alert = () => {
    Swal.fire({
        text: 'Your Lease Agreement download has begun !',
        imageUrl: downloadPdfIcon,
        imageWidth: 120,
        imageHeight: 160,
        imageAlt: "downloadPdf",
        confirmButtonText: 'OK',
        confirmButtonColor: "#FF8C22",
        width: '40em', 
        customClass: {
          confirmButton: 'my-confirm-button-class',
          image: 'my-custom-image-class'   
        }
      });
    };
    
    export default Alert;