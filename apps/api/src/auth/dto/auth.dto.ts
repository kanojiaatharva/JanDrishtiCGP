export class OfficerLoginDto {
  email!: string;
  password!: string;
}

export class CitizenLoginDto {
  phone!: string;
}

export class CitizenVerifyDto {
  phone!: string;
  otp!: string;
}

export class RefreshTokenDto {
  refreshToken!: string;
}

export class OfficerRegisterDto {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  designation!: string;
  districtId?: string;
}
