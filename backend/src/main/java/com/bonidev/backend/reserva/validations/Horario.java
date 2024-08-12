package com.bonidev.backend.reserva.validations;

import com.bonidev.backend.errors.ValidationException;
import com.bonidev.backend.reserva.dto.AgregarReservaDTO;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class Horario implements ValidadorAgregarReserva {

    private static final LocalTime WEEKDAY_START_TIME = LocalTime.of(9, 0);
    private static final LocalTime WEEKDAY_END_TIME = LocalTime.of(19, 0);
    private static final LocalTime SATURDAY_START_TIME = LocalTime.of(10, 0);
    private static final LocalTime SATURDAY_END_TIME = LocalTime.of(17, 0);

    // Metodo que se utilizara en el endpoint para verificar la disponibilidad de una reserva directamente
    public boolean noAvailable(Long barberId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (barberId == null || startDateTime == null || endDateTime == null) { return true; }

        if (startDateTime.isBefore(LocalDateTime.now())) { return true; }

        if (endDateTime.isBefore(startDateTime)) { return true; }

        LocalTime reservationTime = startDateTime.toLocalTime();
        DayOfWeek dayOfWeek = startDateTime.getDayOfWeek();

        if (isWeekDay(dayOfWeek)) {
            return reservationTime.isBefore(WEEKDAY_START_TIME) || reservationTime.isAfter(WEEKDAY_END_TIME);
        } else if (isSaturday(dayOfWeek)) {
            return reservationTime.isBefore(SATURDAY_START_TIME) || reservationTime.isAfter(SATURDAY_END_TIME);
        } else {
            // Es dominingo y por defecto no esta disponible
            return true;
        }
    }

    @Override
    public void validar(AgregarReservaDTO datos) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reservationDateTime = datos.dateTime();

        if (reservationDateTime.isBefore(now)) {
            throw new ValidationException("La fecha y hora de la reserva debe ser en el futuro.");
        }

        LocalTime reservationTime = reservationDateTime.toLocalTime();
        DayOfWeek dayOfWeek = reservationDateTime.getDayOfWeek();

        if (isWeekDay(dayOfWeek)) {
            validateWeekday(reservationTime);
        } else if (isSaturday(dayOfWeek)) {
            validateSaturday(reservationTime);
        } else {
            throw new ValidationException("La barbería no labora los domingos.");
        }
    }

    private boolean isWeekDay(DayOfWeek dayOfWeek) {
        return dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY;
    }

    private boolean isSaturday(DayOfWeek dayOfWeek) {
        return dayOfWeek == DayOfWeek.SATURDAY;
    }

    private void validateWeekday(LocalTime reservationTime) {
        if (reservationTime.isBefore(WEEKDAY_START_TIME)) {
            throw new ValidationException("Los días de semana no se aceptan citas para antes de las 9:00 A.M.");
        } else if (reservationTime.isAfter(WEEKDAY_END_TIME)) {
            throw new ValidationException("Los días de semana no se aceptan citas para después de las 7:00 P.M.");
        }
    }

    private void validateSaturday(LocalTime reservationTime) {
        if (reservationTime.isBefore(SATURDAY_START_TIME)) {
            throw new ValidationException("Los sábados no se aceptan citas para antes de las 10:00 A.M.");
        } else if (reservationTime.isAfter(SATURDAY_END_TIME)) {
            throw new ValidationException("Los sábados no se aceptan citas para después de las 5:00 P.M.");
        }
    }
}
