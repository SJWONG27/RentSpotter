import starOnClick from "./Rental_Icon//rating_star_onClick.svg";
import starDefault from "./Rental_Icon/rating_star_default.svg";

const StarsGroup = ({ rating }) => {

    return (
        <div className="tenantRatingStarsGroup">
            {Array.from({ length: rating }).map((_, i) => (
                <img
                    key={i}
                    src={starOnClick}
                    alt="Rating Star"
                    width="75"
                    height="75"
                    className="tenant-rating-star"
                />
            ))}

            {Array.from({ length: 5 - rating }).map((_, i) => (
                <img
                    key={i}
                    src={starDefault}
                    alt="Rating Star"
                    width="75"
                    height="75"
                    className="rating-star"
                />
            ))}
        </div>
    );
};


export default StarsGroup;