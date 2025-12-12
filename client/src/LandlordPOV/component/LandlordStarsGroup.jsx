import starOnClick from "./Rental_Icon/rating_star_onClick.svg";
import starDefault from "./Rental_Icon/rating_star_default.svg";

const LandlordStarsGroup = ({ rating }) => {

    return (
        <div className="ratingStarsGroup">
            {Array.from({ length: rating }).map((_, i) => (
                <img
                    key={i}
                    src={starOnClick}
                    alt="Rating Star"
                    width="75"
                    height="75"
                    className="rating-star"
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


export default LandlordStarsGroup;