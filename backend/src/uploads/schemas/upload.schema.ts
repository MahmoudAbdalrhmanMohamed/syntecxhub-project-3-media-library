import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UploadDocument = HydratedDocument<UploadFile>;

@Schema({
  collection: 'uploads',
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = String(ret._id);
      return ret;
    },
  },
})
export class UploadFile {
  @Prop({ required: true, trim: true, index: true })
  originalName: string;

  @Prop({ required: true, unique: true, trim: true, index: true })
  storedName: string;

  @Prop({ required: true, trim: true, index: true })
  mimeType: string;

  @Prop({ required: true, min: 1 })
  size: number;

  @Prop({ required: true, trim: true })
  filePath: string;

  @Prop({ required: true, trim: true })
  publicUrl: string;

  @Prop({ default: '', trim: true })
  altText: string;

  @Prop({ type: Date, default: () => new Date(), index: true })
  uploadDate: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UploadFileSchema = SchemaFactory.createForClass(UploadFile);
