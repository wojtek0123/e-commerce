import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ description: 'Send email' })
  async sendMail(@Body() body: SendEmailDto) {
    await this.emailService.sendEmail(body);

    return { message: 'Email send successfully' };
  }
}
