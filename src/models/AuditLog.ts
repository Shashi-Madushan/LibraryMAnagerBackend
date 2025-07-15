import { Schema, model, Types } from "mongoose";

export type ActionType = 'LEND' | 'RETURN' | 'CREATE_BOOK' | 'UPDATE_BOOK' | 'DELETE_BOOK' | 'CREATE_USER' | 'UPDATE_USER' | 'DELETE_USER';
export type TargetType = 'Book' | 'User' | 'Lending';

export interface IAuditLog {
    action: ActionType;
    performedBy: Types.ObjectId;
    targetId: Types.ObjectId;
    targetType: TargetType;
    details?: string;
    timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
    {
        action: {
            type: String,
            required: [true, 'Action is required'],
            enum: ['LEND', 'RETURN', 'CREATE_BOOK', 'UPDATE_BOOK', 'DELETE_BOOK', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER']
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User who performed the action is required']
        },
        targetId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Target ID is required']
        },
        targetType: {
            type: String,
            required: [true, 'Target type is required'],
            enum: ['Book', 'User', 'Lending']
        },
        details: {
            type: String
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false // Using custom timestamp field
    }
);

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
