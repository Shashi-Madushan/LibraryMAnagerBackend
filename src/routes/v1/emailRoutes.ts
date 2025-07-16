import { Router } from 'express';
import { sendReminderEmail } from '@/controllers/v1/email/sendReminder';
const router = Router();

router.post('/send-reminder', sendReminderEmail);

export default router;
