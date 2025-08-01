package com.project.boardgame.common;

public interface ResponseMessage {
    String SUCCESS = "Success.";
    String VALIDATION_FAIL = "Validation failed.";
    String DUPLICATE_ID = "Duplicate Id.";

    String SING_IN_FAIL ="Login information mismatch.";
    String CERTIFICATION_FAIL= "Certification failed.";

    String MAIL_FAIL="Mail send failed.";
    String DATABASE_ERROR="Database error.";
    String ALREADY_RESERVATION="Already reservation.";
    String NOT_FOUND="Not found.";
}
