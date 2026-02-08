import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVehicle extends Document {
    company: mongoose.Types.ObjectId;
    brand: string;
    vehicleModel: string;
    year: number;
    category: 'Luxury' | 'Sports' | 'SUV' | 'Sedan' | 'Economy' | 'Van' | 'Electric';
    transmission: 'Automatic' | 'Manual';
    fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
    seats: number;
    pricing: {
        daily: number;
        weekly?: number;
        monthly?: number;
    };
    images: {
        url: string;
        isPrimary: boolean;
    }[];
    features: string[];
    isFeatured: boolean;
    location: string;
    available: boolean;
    isApproved: boolean;
    quantity: number;
    specs: {
        origin: string;
        insurance: boolean;
        minRentalDays: number;
    };
    mileageLimits: {
        daily: number;
        monthly: number;
    };
    createdAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    vehicleModel: {
        type: String,
        required: [true, 'Please add a model']
    },
    year: {
        type: Number,
        required: [true, 'Please add a year']
    },
    category: {
        type: String,
        enum: ['Luxury', 'Sports', 'SUV', 'Sedan', 'Economy', 'Van', 'Electric'],
        required: true
    },
    transmission: {
        type: String,
        enum: ['Automatic', 'Manual'],
        default: 'Automatic'
    },
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        default: 'Petrol'
    },
    seats: {
        type: Number,
        default: 4
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    location: {
        type: String,
        default: 'Al Jaddaf',
    },
    specs: {
        origin: {
            type: String,
            enum: ['GCC', 'Import', 'American', 'European'],
            default: 'GCC',
        },
        insurance: {
            type: Boolean,
            default: true,
        },
        minRentalDays: {
            type: Number,
            default: 1,
        },
    },
    mileageLimits: {
        daily: {
            type: Number,
            default: 250,
        },
        monthly: {
            type: Number,
            default: 4500,
        },
    },
    pricing: {
        daily: { type: Number, required: true },
        weekly: Number,
        monthly: Number
    },
    images: [{
        url: String,
        isPrimary: { type: Boolean, default: false }
    }],
    features: [String],
    available: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;
