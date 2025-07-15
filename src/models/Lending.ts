import { Schema, model, Types } from "mongoose";

export interface ILending {
    userId: Types.ObjectId;
    bookId: Types.ObjectId;
    borrowedAt: Date;
    dueDate: Date;
    returnedAt?: Date;
    isReturned: boolean;
}

const lendingSchema = new Schema<ILending>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required']
        },
        bookId: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: [true, 'Book ID is required']
        },
        borrowedAt: {
            type: Date,
            default: Date.now
        },
        dueDate: {
            type: Date,
            required: true,
            default: function() {
                const date = new Date();
                return new Date(date.setDate(date.getDate() + 14)); // 14 days from borrowing
            }
        },
        returnedAt: {
            type: Date,
            default: null
        },
        isReturned: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Lending = model<ILending>('Lending', lendingSchema);
