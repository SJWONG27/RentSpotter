    package com.rentspotter.RentSpotter.ReviewApplicantManagement.repository;

    import com.rentspotter.RentSpotter.ReviewApplicantManagement.model.ApplicantReview;
    import org.springframework.data.mongodb.repository.MongoRepository;
    import org.springframework.stereotype.Repository;

    import java.util.List;
    import java.util.Optional;

    @Repository
    public interface ApplicantReviewRepository extends MongoRepository<ApplicantReview, String> {
        List<ApplicantReview> findByLandlordId(String landlordId);
        Optional<ApplicantReview> findByApplicationId(String applicationId);
        Optional<ApplicantReview> findByApplicationIdAndLandlordId(String applicationId, String landlordId);
    }
