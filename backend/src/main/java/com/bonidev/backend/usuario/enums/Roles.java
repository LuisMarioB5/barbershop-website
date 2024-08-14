package com.bonidev.backend.usuario.enums;

import java.util.Objects;

public enum Roles {
    ROLE_ADMIN,
    ROLE_BARBER,
    ROLE_USER;

    public static Roles parseStr(String string) {
        Roles roles = null;
        if (Objects.equals(string, "ROLE_ADMIN")) {
            roles = Roles.ROLE_ADMIN;
        } else if (Objects.equals(string, "ROLE_BARBER")) {
            roles = Roles.ROLE_BARBER;
        } else if (Objects.equals(string, "ROLE_USER")) {
            roles = Roles.ROLE_USER;
        }

        return roles;
    }
}
