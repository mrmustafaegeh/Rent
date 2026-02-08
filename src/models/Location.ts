import mongoose, { Document, Model } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  email: string;
  operatingHours: string;
  image?: string;
  isActive: boolean;
}

const locationSchema = new mongoose.Schema<ILocation>({
  name: {
    type: String,
    required: [true, 'Please add a location name'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email']
  },
  operatingHours: {
    type: String,
    default: '9:00 AM - 9:00 PM'
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

const Location: Model<ILocation> = mongoose.models.Location || mongoose.model<ILocation>('Location', locationSchema);

export default Location;
