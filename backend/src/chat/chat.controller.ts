import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ChatService } from './chat.service';
import { SyncDataDto } from './dto/sync-data.dto';
import { SendMessageDto } from './dto/send-message.dto';

interface AuthUser {
  id: number;
  email: string;
}

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post('sync')
  sync(@Request() req: { user: AuthUser }, @Body() dto: SyncDataDto) {
    return this.service.syncData(req.user.id, dto);
  }

  @Post('message')
  sendMessage(@Request() req: { user: AuthUser }, @Body() dto: SendMessageDto) {
    return this.service.sendMessage(req.user.id, dto.message);
  }
}
