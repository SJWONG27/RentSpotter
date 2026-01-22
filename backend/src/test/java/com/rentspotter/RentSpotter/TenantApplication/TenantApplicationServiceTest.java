package com.rentspotter.RentSpotter.TenantApplication;

import com.rentspotter.RentSpotter.TenantApplication.model.Application;
import com.rentspotter.RentSpotter.TenantApplication.repository.TenantApplicationRepository;
import com.rentspotter.RentSpotter.TenantApplication.service.TenantApplicationService;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyService;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TenantApplicationServiceTest {

    @Mock
    private TenantApplicationRepository tenantApplicationRepository;

    @Mock
    private PropertyService propertyService;

    @InjectMocks
    private TenantApplicationService tenantApplicationService;

    // --- UC-3: Submit Application ---

    @Test
    void submitApplication_Success() {
        String tenantId = "T1";
        String propertyId = "P1";
        Application savedApp = new Application(tenantId, propertyId, 5000.0, "Eng", "Hi");
        savedApp.setId("APP1");

        when(propertyService.getPropertyDetails(propertyId)).thenReturn(Optional.of(new Property()));
        when(tenantApplicationRepository.findByTenantId(tenantId)).thenReturn(Collections.emptyList());
        when(tenantApplicationRepository.save(any(Application.class))).thenReturn(savedApp);

        Application result = tenantApplicationService.submitApplication(tenantId, propertyId, 5000.0, "Eng", "Hi");

        assertNotNull(result);
        assertEquals("APP1", result.getId());
        verify(tenantApplicationRepository).save(any(Application.class));
    }

    @Test
    void submitApplication_DuplicatePending_ThrowsError() {
        String tenantId = "T1";
        String propertyId = "P1";
        Application existingApp = new Application(tenantId, propertyId, 5000.0, "Eng", "Hi");
        existingApp.setStatus(Application.ApplicationStatus.PENDING);

        when(propertyService.getPropertyDetails(propertyId)).thenReturn(Optional.of(new Property()));
        when(tenantApplicationRepository.findByTenantId(tenantId)).thenReturn(List.of(existingApp));

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
            tenantApplicationService.submitApplication(tenantId, propertyId, 6000.0, "Doc", "Hello")
        );

        assertEquals("You already have a pending application for this property.", exception.getMessage());
        verify(tenantApplicationRepository, never()).save(any(Application.class));
    }

    @Test
    void submitApplication_InvalidIncome_ThrowsError() {
        when(propertyService.getPropertyDetails("P1")).thenReturn(Optional.of(new Property()));
        assertThrows(IllegalArgumentException.class, () ->
            tenantApplicationService.submitApplication("T1", "P1", -100.0, "Eng", "Hi")
        );
    }

    @Test
    void submitApplication_InvalidTenantId_ThrowsError() {
        assertThrows(IllegalArgumentException.class, () ->
            tenantApplicationService.submitApplication("", "P1", 5000.0, "Eng", "Hi")
        );
    }

    @Test
    void submitApplication_InvalidPropertyId_ThrowsError() {
        assertThrows(IllegalArgumentException.class, () ->
            tenantApplicationService.submitApplication("T1", "", 5000.0, "Eng", "Hi")
        );
    }

    @Test
    void submitApplication_InvalidOccupation_ThrowsError() {
        when(propertyService.getPropertyDetails("P1")).thenReturn(Optional.of(new Property()));
        assertThrows(IllegalArgumentException.class, () ->
            tenantApplicationService.submitApplication("T1", "P1", 5000.0, "", "Hi")
        );
    }

    @Test
    void submitApplication_InvalidMessage_ThrowsError() {
        when(propertyService.getPropertyDetails("P1")).thenReturn(Optional.of(new Property()));
        assertThrows(IllegalArgumentException.class, () ->
            tenantApplicationService.submitApplication("T1", "P1", 5000.0, "Eng", "")
        );
    }

    @Test
    void submitApplication_PropertyNotFound_ThrowsError() {
        when(propertyService.getPropertyDetails("P_INVALID")).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () ->
            tenantApplicationService.submitApplication("T1", "P_INVALID", 5000.0, "Eng", "Hi")
        );

        assertEquals("Property not found", exception.getMessage());
    }

    // --- UC-4: View History ---

    @Test
    void getTenantApplications_ReturnsList() {
        String tenantId = "T1";
        when(tenantApplicationRepository.findByTenantId(tenantId)).thenReturn(List.of(new Application(), new Application()));

        List<Application> apps = tenantApplicationService.getTenantApplications(tenantId);

        assertEquals(2, apps.size());
    }

    // --- UC-5: Cancel Application ---

    @Test
    void cancelApplication_Success() {
        String appId = "APP1";
        String tenantId = "T1";
        Application app = new Application(tenantId, "P1", 5000.0, "Eng", "Hi");
        app.setId(appId);
        app.setStatus(Application.ApplicationStatus.PENDING);

        when(tenantApplicationRepository.findById(appId)).thenReturn(Optional.of(app));
        when(tenantApplicationRepository.save(any(Application.class))).thenReturn(app);

        Application cancelledApp = tenantApplicationService.cancelApplication(appId, tenantId);

        assertEquals(Application.ApplicationStatus.CANCELLED, cancelledApp.getStatus());
        verify(tenantApplicationRepository).save(app);
    }

    @Test
    void cancelApplication_NotPending_ThrowsError() {
        String appId = "APP1";
        String tenantId = "T1";
        Application app = new Application(tenantId, "P1", 5000.0, "Eng", "Hi");
        app.setId(appId);
        app.setStatus(Application.ApplicationStatus.REJECTED); // Not PENDING

        when(tenantApplicationRepository.findById(appId)).thenReturn(Optional.of(app));

        Exception exception = assertThrows(RuntimeException.class, () ->
            tenantApplicationService.cancelApplication(appId, tenantId)
        );

        assertEquals("Cannot cancel non-pending application", exception.getMessage());
    }

    @Test
    void cancelApplication_Unauthorized_ThrowsError() {
        String appId = "APP1";
        String tenantId = "T1";
        Application app = new Application("OTHER_TENANT", "P1", 5000.0, "Eng", "Hi");
        app.setId(appId);

        when(tenantApplicationRepository.findById(appId)).thenReturn(Optional.of(app));

        Exception exception = assertThrows(RuntimeException.class, () ->
            tenantApplicationService.cancelApplication(appId, tenantId)
        );

        assertEquals("Unauthorized", exception.getMessage());
    }

    // --- UC-5: Delete Application ---

    @Test
    void deleteApplication_Success() {
        String appId = "APP1";
        String tenantId = "T1";
        Application app = new Application(tenantId, "P1", 5000.0, "Eng", "Hi");
        app.setId(appId);
        app.setStatus(Application.ApplicationStatus.REJECTED);

        when(tenantApplicationRepository.findById(appId)).thenReturn(Optional.of(app));

        tenantApplicationService.deleteApplication(appId, tenantId);

        verify(tenantApplicationRepository).delete(app);
    }

    @Test
    void deleteApplication_NotRejected_ThrowsError() {
        String appId = "APP1";
        String tenantId = "T1";
        Application app = new Application(tenantId, "P1", 5000.0, "Eng", "Hi");
        app.setId(appId);
        app.setStatus(Application.ApplicationStatus.PENDING); // Not REJECTED

        when(tenantApplicationRepository.findById(appId)).thenReturn(Optional.of(app));

        Exception exception = assertThrows(RuntimeException.class, () ->
            tenantApplicationService.deleteApplication(appId, tenantId)
        );

        assertEquals("Only rejected applications can be removed from history", exception.getMessage());
    }
}
