export enum UserAccountType {
  private = 'Private',
  public = 'Public',
}

export enum UserAccountStatus {
  active = 1,
  deactivated = 2,
  deleted = 0,
  disabled = 3,
}

export enum IpBlockReasons {
  MultipleFailedLoginAttempts = 'Multiple Failed Login Attempts',
  UnauthorizedAccessAttempts = 'Unauthorized Access Attempts',
  SuspiciousLoginActivity = 'Suspicious Login Activity',
  PasswordBruteForceAttempts = 'Password Brute Force Attempts',
  AccountLockout = 'Account Lockout',
}
