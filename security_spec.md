# Firebase Security Specification

## Data Invariants
1. A user document must have a document ID matching the user's authentic Firebase Authentication UID.
2. A user's profile role and verification status can only be modified by administrative interfaces or initialized securely during signup.
3. Every user document must contain a valid name, email, phone, and role.
4. Timestamps (`createdAt` and `updatedAt`) must be strictly synchronized with the database server time.

## The Dirty Dozen Payloads (Targeting users/{userId})
1. **Identity Spoofing**: Attempt to create/update a document under `users/attacker_uid` where the `id` field is set to `victim_uid`.
2. **Role Escalation**: Attempt to update a user's own `role` field from `'client'` to `'admin'`.
3. **Ghost Fields Injection**: Attempt to write arbitrary fields to the user document (e.g. `isPremium: true` or `shadowField: "malicious"`).
4. **ID Poisoning**: Attempt to write a user document using a massive 500-character gibberish document ID.
5. **PII Exfiltration**: Attempt to read/scrape another client's private profile document (containing phone/email) as a different authenticated non-admin user.
6. **Time Spoofing (Create)**: Attempt to set `createdAt` to a historical or future date on document creation.
7. **Time Spoofing (Update)**: Attempt to bypass `updatedAt` server validation on modifying details.
8. **Invalid Role Choice**: Attempt to set `role` to `'super_manager_of_barbme'`.
9. **Invalid Type Injection**: Attempt to set `isVerified` to a string instead of a boolean value.
10. **Bypassing Size Limits**: Attempt to upload a 5MB payload into the `fullName` field.
11. **Immutability Breach**: Attempt to change the immutable `createdAt` field on update.
12. **Anonymous Write Attack**: Attempt to write to `users/{userId}` without a valid Firebase Auth session.

## Test Runner Specification
The rules must return `PERMISSION_DENIED` for all malicious actions, protecting user identity and data.
