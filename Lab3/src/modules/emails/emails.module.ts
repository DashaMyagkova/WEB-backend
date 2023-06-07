import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import nmg from "nodemailer-mailgun-transport";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { resolve } from "path";
import { EmailsService } from "./services";
import { environment } from "../../environments/environment";

@Module({
    imports: [
        MailerModule.forRoot({
                transport: nmg({
                    auth: {
                        api_key: environment.MAILGUN_API_KEY,
                        domain: environment.DOMAIN
                    },
                    host: environment.MAILGUN_HOST
                }),
                defaults: { from: `Lab    <no-reply@${environment.DOMAIN}>` },
                template: {
                    dir: resolve(__dirname, "templates"),
                    adapter: new HandlebarsAdapter(undefined, {
                        inlineCssEnabled: true,
                        inlineCssOptions: {
                            url: " ",
                            preserveMediaQueries: true
                        }
                    }),
                    options: { strict: true }
                }
            }
        )
    ],
    providers: [
        EmailsService
    ],
    exports: [
        EmailsService
    ]
})
export class EmailsModule {
}
