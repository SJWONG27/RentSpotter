package com.rentspotter.RentSpotter.LandlordPropertyManagement;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.multipart.MultipartFile;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.repository.PropertyRepository;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyService;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private PropertyService propertyService;

    //UC-8 Upload new property
    @Test
    void createProperty_Success() throws IOException {
        Property property = new Property();
        property.setLandlordId("L1");

        // Mock 2 files (Minimum requirement)
        MultipartFile file1 = mock(MultipartFile.class);
        MultipartFile file2 = mock(MultipartFile.class);
        when(file1.getOriginalFilename()).thenReturn("img1.jpg");
        when(file2.getOriginalFilename()).thenReturn("img2.jpg");

        when(file1.getInputStream()).thenReturn(new ByteArrayInputStream("test content".getBytes()));
        when(file2.getInputStream()).thenReturn(new ByteArrayInputStream("test content".getBytes()));

        List<MultipartFile> files = List.of(file1, file2);

        when(propertyRepository.save(any(Property.class))).thenReturn(property);

        Property result = propertyService.createProperty(property, files);

        assertNotNull(result);
        verify(propertyRepository).save(any(Property.class));
    }

    @Test
    void createProperty_LessThanTwoPhotos_ThrowsError() {
        Property property = new Property();
        MultipartFile file1 = mock(MultipartFile.class);
        List<MultipartFile> files = List.of(file1); // Only 1 photo

        Exception exception = assertThrows(IllegalArgumentException.class, ()
                -> propertyService.createProperty(property, files)
        );

        assertEquals("Requirement not met: You must upload at least 2 photos.", exception.getMessage());
        verify(propertyRepository, never()).save(any(Property.class));
    }

    // UC-6 View uploaded property list
    @Test
    void getPropertiesByLandlord_ReturnsList() {
        String landlordId = "L1";
        when(propertyRepository.findByLandlordId(landlordId)).thenReturn(List.of(new Property(), new Property()));

        List<Property> properties = propertyService.getPropertiesByLandlord(landlordId);

        assertEquals(2, properties.size());
        verify(propertyRepository).findByLandlordId(landlordId);
    }

    // UC-9 View and edit existing property details (view)
    @Test
    void getPropertyDetail_Success() {
        String landlordId = "L1";
        String propertyId = "P1";
        Property property = new Property();
        property.setId(propertyId);
        property.setLandlordId(landlordId);

        when(propertyRepository.findByIdAndLandlordId(propertyId, landlordId)).thenReturn(Optional.of(property));

        Property result = propertyService.getPropertyDetail(landlordId, propertyId);

        assertNotNull(result);
        assertEquals(propertyId, result.getId());
    }

    @Test
    void getPropertyDetail_NotFound_ThrowsError() {
        when(propertyRepository.findByIdAndLandlordId("P1", "L1")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, ()
                -> propertyService.getPropertyDetail("L1", "P1")
        );

        assertEquals("Property not found or access denied.", exception.getMessage());
    }

    // UC-9 View and edit existing property details (edit)
    @Test
    void updatePropertyDetails_Success() {
        String propertyId = "P1";
        Property existing = new Property();
        existing.setId(propertyId);
        existing.setName("Old Name");

        Property updates = new Property();
        updates.setName("New Name");
        updates.setPrice(2000.0);

        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(existing));
        when(propertyRepository.save(existing)).thenReturn(existing);

        Property result = propertyService.updatePropertyDetails(propertyId, updates);

        assertEquals("New Name", result.getName());
        assertEquals(2000.0, result.getPrice());
        verify(propertyRepository).save(existing);
    }

    // UC-10 Manage photos (Set Cover)
    @Test
    void setCoverPhoto_Success() {
        String propertyId = "P1";
        String fileName = "photo1.jpg";
        Property property = new Property();
        property.setPhotos(List.of("photo1.jpg", "photo2.jpg"));

        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        when(propertyRepository.save(property)).thenReturn(property);

        propertyService.setCoverPhoto(propertyId, fileName);

        assertEquals(fileName, property.getCoverPhoto());
    }

    @Test
    void setCoverPhoto_PhotoNotExist_ThrowsError() {
        String propertyId = "P1";
        Property property = new Property();
        property.setPhotos(List.of("photo1.jpg")); // photo2.jpg is missing

        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));

        Exception exception = assertThrows(RuntimeException.class, ()
                -> propertyService.setCoverPhoto(propertyId, "photo2.jpg")
        );

        assertEquals("This photo does not exist in this property.", exception.getMessage());
    }

    // UC-10 Manage Photos (Delete Photo)
    @Test
    void deletePropertyPhoto_Success() throws IOException {
        String propertyId = "P1";
        String fileToDelete = "photo3.jpg";
        Property property = new Property();
        // Start with 3 photos so we can safely delete 1
        List<String> photos = new ArrayList<>(List.of("photo1.jpg", "photo2.jpg", "photo3.jpg"));
        property.setPhotos(photos);

        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));
        when(propertyRepository.save(property)).thenReturn(property);

        propertyService.deletePropertyPhoto(propertyId, fileToDelete);

        assertEquals(2, property.getPhotos().size());
        assertFalse(property.getPhotos().contains(fileToDelete));
    }

    @Test
    void deletePropertyPhoto_MinLimitReached_ThrowsError() {
        String propertyId = "P1";
        Property property = new Property();
        // Only 2 photos
        property.setPhotos(List.of("photo1.jpg", "photo2.jpg"));

        when(propertyRepository.findById(propertyId)).thenReturn(Optional.of(property));

        Exception exception = assertThrows(RuntimeException.class, ()
                -> propertyService.deletePropertyPhoto(propertyId, "photo1.jpg")
        );

        assertTrue(exception.getMessage().contains("must maintain at least 2 photos"));
    }

    // UC-11 Delete property 
    @Test
    void deleteProperty_Success() throws IOException {
        String propertyId = "P1";
        String landlordId = "L1";
        Property property = new Property();
        property.setPhotos(new ArrayList<>()); // Empty photos to skip file deletion logic

        when(propertyRepository.findByIdAndLandlordId(propertyId, landlordId)).thenReturn(Optional.of(property));

        propertyService.deleteProperty(landlordId, propertyId);

        verify(propertyRepository).delete(property);
    }

    // UC-7 Filter properties
    @Test
    void filterProperties_ExecutesQuery() {
        when(mongoTemplate.find(any(Query.class), eq(Property.class))).thenReturn(Collections.emptyList());

        propertyService.filterProperties("L1", "Condo", "KL", 1000.0, 2000.0, "Pool");

        verify(mongoTemplate).find(any(Query.class), eq(Property.class));
    }
}
