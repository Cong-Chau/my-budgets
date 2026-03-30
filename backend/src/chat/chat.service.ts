import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { SyncDataDto } from './dto/sync-data.dto';

@Injectable()
export class ChatService {
  private readonly clients: GoogleGenAI[];
  private currentIndex = 0;
  private readonly snapshots = new Map<number, SyncDataDto>();

  constructor(private readonly config: ConfigService) {
    const keys = [1, 2, 3, 4, 5]
      .map((i) => this.config.get<string>(`GEMINI_API_KEY_${i}`))
      .filter((k): k is string => !!k);

    if (keys.length === 0)
      throw new Error('No GEMINI_API_KEY_* keys configured');

    this.clients = keys.map((apiKey) => new GoogleGenAI({ apiKey }));
  }

  private nextClient(): GoogleGenAI {
    const client = this.clients[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.clients.length;
    return client;
  }

  syncData(userId: number, data: SyncDataDto) {
    this.snapshots.set(userId, data);
    return { synced: true };
  }

  async sendMessage(userId: number, message: string) {
    const snapshot = this.snapshots.get(userId);

    const contextBlock = snapshot
      ? `
User financial snapshot:
- Income: ${snapshot.summary.income.toLocaleString()} VND
- Expense: ${snapshot.summary.expense.toLocaleString()} VND
- Balance: ${snapshot.summary.balance.toLocaleString()} VND
- Categories: ${snapshot.categories.map((c: { name: string }) => c.name).join(', ')}
- Budgets: ${
          snapshot.budgets.length
            ? snapshot.budgets
                .map(
                  (b: {
                    category?: { name: string };
                    period: string;
                    totalSpent: number;
                    amount: number;
                    percentage: number;
                    status: string;
                  }) =>
                    `${b.category?.name} (${b.period}): spent ${b.totalSpent}/${b.amount} (${b.percentage}% - ${b.status})`,
                )
                .join('; ')
            : 'None set'
        }
- Recent transactions (last 10): ${snapshot.transactions
          .slice(0, 10)
          .map(
            (t: {
              type: string;
              amount: number;
              category?: { name: string };
              date: string | Date;
            }) =>
              `${t.type === 'EXPENSE' ? '-' : '+'}${t.amount} ${t.category?.name} on ${new Date(t.date).toLocaleDateString()}`,
          )
          .join('; ')}
`
      : 'No financial data available yet. Ask the user to sync their data.';

    const prompt = `You are a helpful personal finance assistant for the MyBudget app. Be concise, friendly, and give practical advice.
IMPORTANT RULES:
- Only reply in Vietnamese. Never use any other language.
- Only return plain text. Do not use markdown, bullet points, bold, or any formatting symbols.

${contextBlock}

User: ${message}
Assistant:`;
    try {
      const result = await this.nextClient().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return { reply: result.text ?? '' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gemini API error';
      throw new BadRequestException(`AI service error: ${message}`);
    }
  }
}
