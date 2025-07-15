import { Schema, model } from "mongoose";

export interface IBook {
    title: string;
    author: string;
    isbn?: string;
    category: string;
    available: boolean;
    totalCopies: number;
}

const bookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true
        },
        isbn: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        available: {
            type: Boolean,
            default: true
        },
        totalCopies: {
            type: Number,
            required: [true, 'Total copies is required'],
            min: [0, 'Total copies cannot be negative']
        }
    },
    {
        timestamps: true
    }
);

export const Book = model<IBook>('Book', bookSchema);
