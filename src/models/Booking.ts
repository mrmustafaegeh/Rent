import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBooking extends Document {
    bookingNumber: string;
    customer: mongoose.Types.ObjectId;
    vehicle: mongoose.Types.ObjectId;
    company: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
    paymentMethod?: string;
    pickupLocation: string;
    dropoffLocation: string;
    notes?: {
        text: string;
        addedBy: mongoose.Types.ObjectId;
        date: Date;
    }[];
    assignedStaff?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>({
    bookingNumber: {
        type: String,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date']
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'pending_payment'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed', 'pay_at_pickup'],
        default: 'pending'
    },
    pickupLocation: {
        type: String,
        required: true
    },
    dropoffLocation: {
        type: String,
        required: true
    },
    paymentMethod: String,
    notes: [{
        text: String,
        addedBy: {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'User'
        },
        date: {
             type: Date,
             default: Date.now
        }
    }],
    assignedStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Generate booking number
bookingSchema.pre('save', function() {
    if (!this.bookingNumber) {
        this.bookingNumber = 'BK-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
});

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
