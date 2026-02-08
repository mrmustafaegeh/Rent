import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    slug: string;
    email: string;
    phone: string;
    website?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    description?: string;
    logo?: string;
    isActive: boolean;
    owner: mongoose.Types.ObjectId;
    commission?: {
        percentage: number;
    };
    createdAt: Date;
}

const companySchema = new mongoose.Schema<ICompany>({
    name: {
        type: String,
        required: [true, 'Please add a company name'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please add a company email']
    },
    phone: {
        type: String,
        required: [true, 'Please add a company phone']
    },
    website: String,
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    description: String,
    logo: String,
    isActive: {
        type: Boolean,
        default: false // Requires approval
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commission: {
        percentage: {
            type: Number,
            default: 10
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create slug from name
companySchema.pre('save', function() {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
});

const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema);

export default Company;
