import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { EventsModule } from './modules/events/events.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { MediaModule } from './modules/media/media.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { PagesModule } from './modules/pages/pages.module';
import { TeamModule } from './modules/team/team.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { PartnersModule } from './modules/partners/partners.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { HomepageModule } from './modules/homepage/homepage.module';
import { SubscribersModule } from './modules/subscribers/subscribers.module';
import { MailModule } from './mail/mail.module';
import { AuditModule } from './modules/audit/audit.module';
import { AdminModule } from './modules/admin/admin.module';
import { StoriesModule } from './modules/stories/stories.module';
import { EventRegistrationsModule } from './modules/event-registrations/event-registrations.module';
import { DonationsModule } from './modules/donations/donations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    EventsModule,
    ArticlesModule,
    MediaModule,
    EnquiriesModule,
    GalleryModule,
    PagesModule,
    TeamModule,
    ResourcesModule,
    PartnersModule,
    SettingsModule,
    NavigationModule,
    HomepageModule,
    SubscribersModule,
    MailModule,
    AuditModule,
    AdminModule,
    StoriesModule,
    EventRegistrationsModule,
    DonationsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
