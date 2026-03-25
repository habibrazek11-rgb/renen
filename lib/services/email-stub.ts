// Email Service — stub implementation using console output
// To swap to Resend/SendGrid: implement IEmailService and replace emailService export

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  segmentName?: string;
  submissionId?: string;
}

export interface IEmailService {
  sendResultEmail(payload: EmailPayload): Promise<void>;
  sendAbandonEmail(payload: EmailPayload): Promise<void>;
  sendTestEmail(payload: EmailPayload): Promise<void>;
}

// Console implementation — swap this for Resend/SendGrid later
class ConsoleEmailService implements IEmailService {
  async sendResultEmail(payload: EmailPayload): Promise<void> {
    console.log('[EMAIL:result]', {
      to: payload.to,
      subject: payload.subject,
      segment: payload.segmentName,
      submissionId: payload.submissionId,
      preview: payload.body.slice(0, 100) + '...',
    });
  }

  async sendAbandonEmail(payload: EmailPayload): Promise<void> {
    console.log('[EMAIL:abandon]', {
      to: payload.to,
      subject: payload.subject,
      preview: payload.body.slice(0, 100) + '...',
    });
  }

  async sendTestEmail(payload: EmailPayload): Promise<void> {
    console.log('[EMAIL:test]', {
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
    });
  }
}

// Singleton — replace with: export const emailService: IEmailService = new ResendEmailService();
export const emailService: IEmailService = new ConsoleEmailService();
