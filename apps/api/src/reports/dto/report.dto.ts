export class CreateReportDto {
  originalInput!: string;
  language?: string;
  channel?: 'WEB' | 'MOBILE' | 'VOICE' | 'WHATSAPP' | 'KIOSK';
  transcription?: string;
  normalizedText?: string;
  urgency?: number;
  severity?: number;
}
