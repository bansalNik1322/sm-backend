import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import slugify from 'slugify';
import { Document } from 'mongoose';
import { IUser } from '../interface';
import { UserAccountStatus, UserAccountType } from 'src/common/constants/enum';
import { encryptText } from 'src/common/utils/helper';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User implements IUser {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: false, unique: true })
  email: string;

  @Prop({ required: false })
  country_code: string;

  @Prop({ required: false, unique: true })
  phone: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  profile_image: string;

  @Prop({ type: [String], default: [] })
  old_passwords: string[];

  @Prop({
    required: true,
    enum: UserAccountType,
    default: UserAccountType.public,
  })
  account_type: UserAccountType;

  @Prop({ required: true, default: new Date() })
  last_password_updated_at: Date;

  @Prop({ required: true, default: new Date() })
  last_login: Date;

  @Prop({ required: true })
  slug: string;

  @Prop({
    type: [
      { location: String, state: String, country: String, postal_code: String },
    ],
    required: false,
  })
  address: {
    location: string;
    state: string;
    country: string;
    postal_code?: string;
  }[];

  @Prop({ required: false })
  date_of_birth: Date;

  @Prop({ required: false })
  bio: string;

  @Prop({ required: false })
  website: string;

  @Prop({ type: Object, required: false, default: {} })
  social_links: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };

  @Prop({ type: [String], required: false, default: [] })
  interests: string[];

  @Prop({
    type: Object,
    require: false,
    default: { email_notifications: true, push_notifications: true },
  })
  notification_settings: {
    email_notifications: boolean;
    push_notifications: boolean;
  };

  @Prop({
    type: Object,
    default: {
      profile_visibility: 'public',
      post_visibility: 'public',
      story_visibility: 'public',
    },
  })
  privacy_settings: {
    profile_visibility: 'public' | 'friends' | 'private';
    post_visibility: 'public' | 'friends' | 'private';
    story_visibility: 'public' | 'friends' | 'private';
  };

  @Prop({ required: false, enum: ['email', 'google', 'facebook', 'twitter'] })
  sign_up_method: 'email' | 'google' | 'facebook' | 'twitter';

  @Prop({ required: false, default: false })
  multi_factor_authentication: boolean;

  @Prop({
    required: false,
    enum: UserAccountStatus,
    default: UserAccountStatus.active,
  })
  status: UserAccountStatus;

  @Prop({ required: false })
  email_verified_at: Date;

  @Prop({ required: false })
  phone_verified_at: Date;

  @Prop({ required: false, default: [] })
  otps: { otp_hash: string; otp_expiry_time: Date; type: 'email' | 'phone' }[];

  @Prop({
    required: false,
    type: [{ question: String, answer: String }],
    default: [],
  })
  security_questions: {
    question: string;
    answer: string;
  }[];

  @Prop({
    required: false,
    default: null,
  })
  deleted_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<UserDocument>('save', async function (next) {
  this.password = await encryptText(this.password);

  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

UserSchema.methods.softDelete = function () {
  this.status = UserAccountStatus.deleted;
  this.deletedAt = new Date();
  return this.save();
};

UserSchema.methods.restoreRecord = function () {
  this.status = UserAccountStatus.active;
  this.deletedAt = null;
  return this.save();
};

UserSchema.virtual('tokens', {
  ref: 'Token',
  localField: '_id',
  foreignField: 'userid',
});

UserSchema.virtual('login_attempts', {
  ref: 'LoginAttempt',
  localField: '_id',
  foreignField: 'userid',
});
