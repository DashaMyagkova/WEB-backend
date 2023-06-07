import {Injectable} from '@nestjs/common';
import {MailerService, ISendMailOptions} from '@nestjs-modules/mailer';

@Injectable()
export class EmailsService {
    constructor(
        private readonly mailerService: MailerService,
    ) {
    }

    public send(options: ISendMailOptions) {
        return this.mailerService.sendMail(options);
    }
}
