import { describe, expect, it } from 'vitest';

import {
  addressSchema,
  createPasswordSchema,
  isValidNationalId,
  otpPhoneSchema,
  otpVerifySchema,
  phoneRegex,
  profileSchema,
  referralCodeSchema,
  toEnglishDigits,
} from '../../src/lib/validation';

describe('phone validation', () => {
  it('accepts common Iranian mobile formats', () => {
    expect(phoneRegex.test('09123456789')).toBe(true);
    expect(phoneRegex.test('+989123456789')).toBe(true);
    expect(phoneRegex.test('00123')).toBe(false);
  });

  it('validates OTP phone payloads', () => {
    expect(otpPhoneSchema.safeParse({ phone: '09123456789' }).success).toBe(true);
    expect(otpPhoneSchema.safeParse({ phone: '123' }).success).toBe(false);
  });
});

describe('OTP verification', () => {
  it('requires a 4-6 digit numeric code', () => {
    expect(otpVerifySchema.safeParse({ code: '1234' }).success).toBe(true);
    expect(otpVerifySchema.safeParse({ code: '12a4' }).success).toBe(false);
    expect(otpVerifySchema.safeParse({ code: '123' }).success).toBe(false);
  });
});

describe('address schema', () => {
  const valid = {
    recipientName: 'علی رضایی',
    phone: '09123456789',
    province: 'تهران',
    city: 'تهران',
    addressLine: 'خیابان ولیعصر پلاک ۱۰',
    postalCode: '1234567890',
  };

  it('accepts a complete address', () => {
    expect(addressSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a short address line', () => {
    expect(
      addressSchema.safeParse({ ...valid, addressLine: 'کوتاه' }).success,
    ).toBe(false);
  });

  it('rejects an invalid postal code', () => {
    expect(
      addressSchema.safeParse({ ...valid, postalCode: '123' }).success,
    ).toBe(false);
  });
});

describe('toEnglishDigits', () => {
  it('converts Persian and Arabic digits', () => {
    expect(toEnglishDigits('۰۹۱۲۳۴۵۶۷۸۹')).toBe('09123456789');
    expect(toEnglishDigits('٠٩١٢٣٤٥٦٧٨٩')).toBe('09123456789');
  });
});

describe('national id', () => {
  it('accepts a valid id', () => {
    expect(isValidNationalId('0499370899')).toBe(true);
  });

  it('rejects repeated or invalid ids', () => {
    expect(isValidNationalId('1111111111')).toBe(false);
    expect(isValidNationalId('1234567890')).toBe(false);
  });
});

describe('profile schema', () => {
  it('accepts Persian digits for phone and national id', () => {
    expect(
      profileSchema.safeParse({
        phone: '۰۹۱۲۳۴۵۶۷۸۹',
        nationalId: '۰۴۹۹۳۷۰۸۹۹',
      }).success,
    ).toBe(true);
  });

  it('rejects an invalid national id', () => {
    expect(
      profileSchema.safeParse({ nationalId: '1234567890' }).success,
    ).toBe(false);
  });
});

describe('referral code', () => {
  it('requires uppercase letters and digits', () => {
    expect(referralCodeSchema.safeParse('ABC123').success).toBe(true);
    expect(referralCodeSchema.safeParse('abc123').success).toBe(false);
  });
});

describe('password schema', () => {
  it('requires the current password when one exists', () => {
    const schema = createPasswordSchema(true);
    expect(
      schema.safeParse({
        newPassword: '123456',
        confirmPassword: '123456',
      }).success,
    ).toBe(false);
  });

  it('requires matching confirmation', () => {
    const schema = createPasswordSchema(false);
    expect(
      schema.safeParse({
        newPassword: '123456',
        confirmPassword: '654321',
      }).success,
    ).toBe(false);
  });

  it('accepts a valid change', () => {
    const schema = createPasswordSchema(false);
    expect(
      schema.safeParse({
        newPassword: '123456',
        confirmPassword: '123456',
      }).success,
    ).toBe(true);
  });
});