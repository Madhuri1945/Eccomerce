import { Role } from "@prisma/client";

export {};

declare global {
  interface CustomJwtSessionClaims {
    dbId?: Int;
    role?: Role;
  }
  interface UserPublicMetadata {
    dbId?: Int;
    role?: Role;
  }
}
