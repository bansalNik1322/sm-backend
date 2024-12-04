import { Injectable } from '@nestjs/common';
import { ContentManagerRepository } from 'src/Shared/Repositories/content-manager.repo';
import { EmailTemplateRepository } from 'src/Shared/Repositories/email-template';
import { UserRepository } from 'src/Shared/Repositories/user.repo';

@Injectable()
export class SeederService {
  constructor(
    private readonly _userModel: UserRepository,
    private readonly _emailTemplateModel: EmailTemplateRepository,
    private readonly _contentManagerModel: ContentManagerRepository,
  ) {}
  dummyUsers = [
    {
      email: 'admin@yopmail.com',
      password: '123456',
      username: 'silent_knight',
      name: 'Nikhil Bansal',
      email_verified_at: new Date(),
    },
    {
      email: 'user1@yopmail.com',
      password: 'password1',
      username: 'cool_user1',
      name: 'John Doe',
      email_verified_at: new Date(),
    },
    {
      email: 'user2@yopmail.com',
      password: 'password2',
      username: 'cool_user2',
      name: 'Jane Smith',
      email_verified_at: new Date(),
    },
    {
      email: 'user3@yopmail.com',
      password: 'password3',
      username: 'awesome_user3',
      name: 'Alice Johnson',
      email_verified_at: new Date(),
    },
    {
      email: 'user4@yopmail.com',
      password: 'password4',
      username: 'awesome_user4',
      name: 'Bob Brown',
      email_verified_at: new Date(),
    },
  ];

  emailTemplates = [
    {
      title: 'Welcome Email',
      slug: 'welcome-email',
      template: '<p>Welcome, {{name}}! Thank you for joining us.</p>',
      subject: 'Welcome to Our Platform',
    },
    {
      title: 'Password Reset',
      slug: 'password-reset',
      template:
        '<p>Hi {{name}}, click <a href="{{resetLink}}">here</a> to reset your password.</p>',
      subject: 'Reset Your Password',
    },
    {
      title: 'Order Confirmation',
      slug: 'order-confirmation',
      template:
        '<p>Hi {{name}}, your order #{{orderId}} has been confirmed.</p>',
      subject: 'Your Order Confirmation',
    },
    {
      title: 'Account Verification',
      slug: 'account-verification',
      template:
        '<p>Please verify your account by clicking <a href="{{verificationLink}}">here</a>.</p>',
      subject: 'Verify Your Account',
    },
    {
      title: 'Newsletter Subscription',
      slug: 'newsletter-subscription',
      template:
        '<p>Hi {{name}}, thank you for subscribing to our newsletter!</p>',
      subject: 'Subscription Confirmed',
    },
    {
      title: 'Promotional Offer',
      slug: 'promotional-offer',
      template:
        '<p>Hi {{name}}, enjoy 20% off your next purchase with code {{promoCode}}.</p>',
      subject: 'Exclusive Offer Just for You!',
    },
    {
      title: 'Feedback Request',
      slug: 'feedback-request',
      template:
        '<p>Hi {{name}}, we value your feedback! Please take our short survey <a href="{{surveyLink}}">here</a>.</p>',
      subject: 'We Value Your Feedback',
    },
    {
      title: 'Account Deactivation',
      slug: 'account-deactivation',
      template:
        '<p>Hi {{name}}, your account has been deactivated. If this was a mistake, contact support.</p>',
      subject: 'Account Deactivation Notice',
    },
    {
      title: 'Event Invitation',
      slug: 'event-invitation',
      template:
        '<p>Hi {{name}}, you’re invited to our upcoming event on {{eventDate}}. RSVP <a href="{{rsvpLink}}">here</a>.</p>',
      subject: 'You’re Invited!',
    },
    {
      title: 'Service Reminder',
      slug: 'service-reminder',
      template:
        '<p>Hi {{name}}, this is a reminder for your upcoming service appointment on {{appointmentDate}}.</p>',
      subject: 'Service Appointment Reminder',
    },
  ];

  contentManager = [
    {
      title: 'How to Start a Blog',
      slug: 'how-to-start-a-blog',
      metaDescription:
        'Learn the basics of starting a successful blog in 2024.',
      content:
        '<p>Blogging is a great way to share your knowledge with the world...</p>',
      metaKeywords: 'blogging, how to blog, start a blog',
      description: 'Step-by-step guide to help beginners start blogging.',
      metaTitle: 'Beginner’s Guide to Blogging',
    },
    {
      title: 'SEO Best Practices',
      slug: 'seo-best-practices',
      metaDescription:
        'Discover the best SEO practices to improve website ranking.',
      content: '<p>SEO is essential for online success...</p>',
      metaKeywords: 'SEO, best practices, search engine optimization',
      description:
        'Tips and tricks for optimizing your website for search engines.',
      metaTitle: 'Mastering SEO: Best Practices',
    },
    {
      title: '10 Easy Recipes for Beginners',
      slug: 'easy-recipes-for-beginners',
      metaDescription: 'Quick and easy recipes anyone can make.',
      content: '<p>Cooking can be fun and simple...</p>',
      metaKeywords: 'easy recipes, beginner cooking, quick meals',
      description: 'A collection of simple and delicious recipes.',
      metaTitle: 'Quick Recipes for Starters',
    },
    {
      title: 'Guide to Remote Work',
      slug: 'guide-to-remote-work',
      metaDescription: 'How to succeed in a remote work environment.',
      content: '<p>Remote work has become the new normal...</p>',
      metaKeywords: 'remote work, work from home, productivity',
      description: 'Strategies and tips for effective remote work.',
      metaTitle: 'Thriving While Working Remotely',
    },
    {
      title: 'Travel Tips for 2024',
      slug: 'travel-tips-2024',
      metaDescription: 'Plan your next adventure with these travel tips.',
      content: '<p>Traveling is an enriching experience...</p>',
      metaKeywords: 'travel tips, 2024 travel, adventure',
      description: 'Essential travel tips for the upcoming year.',
      metaTitle: 'Your Travel Guide for 2024',
    },
    {
      title: 'Fitness for Busy Professionals',
      slug: 'fitness-for-busy-professionals',
      metaDescription:
        'Stay fit with these simple exercises for busy schedules.',
      content: '<p>Fitness doesn’t have to take hours...</p>',
      metaKeywords: 'fitness, exercise, busy professionals',
      description: 'Quick workouts tailored for busy lifestyles.',
      metaTitle: 'Fitness Hacks for the Busy Professional',
    },
    {
      title: 'The History of AI',
      slug: 'the-history-of-ai',
      metaDescription:
        'Explore the fascinating evolution of artificial intelligence.',
      content: '<p>Artificial Intelligence (AI) has come a long way...</p>',
      metaKeywords: 'AI history, artificial intelligence, technology',
      description: 'An in-depth look at the history of AI.',
      metaTitle: 'Understanding AI’s Evolution',
    },
    {
      title: 'Mental Health Awareness',
      slug: 'mental-health-awareness',
      metaDescription: 'Promoting mental health awareness in daily life.',
      content: '<p>Mental health is as important as physical health...</p>',
      metaKeywords: 'mental health, awareness, self-care',
      description: 'Guidelines for improving mental health awareness.',
      metaTitle: 'Mental Health: A Priority',
    },
    {
      title: 'Top 5 Coding Practices',
      slug: 'top-5-coding-practices',
      metaDescription: 'Enhance your coding skills with these top practices.',
      content: '<p>Writing clean and efficient code is crucial...</p>',
      metaKeywords: 'coding practices, programming, best practices',
      description: 'Tips to improve code quality and maintainability.',
      metaTitle: 'Best Practices in Coding',
    },
    {
      title: 'Financial Planning Basics',
      slug: 'financial-planning-basics',
      metaDescription: 'Manage your finances with these basic planning steps.',
      content: '<p>Financial planning helps secure your future...</p>',
      metaKeywords: 'financial planning, budgeting, personal finance',
      description: 'A beginner’s guide to financial planning.',
      metaTitle: 'Smart Financial Planning',
    },
  ];

  async seed() {
    for (const user of this.dummyUsers) {
      const existingUser = await this._userModel.getUser({
        email: user.email,
      });

      if (!existingUser) {
        await this._userModel.createUser(user);
      }
    }

    for (const email of this.emailTemplates) {
      console.log('🚀 ~ SeederService ~ seed ~ email.slug:', email.slug);
      const existingEmail = await this._emailTemplateModel.getEmailTemplate({
        slug: email.slug,
      });

      if (!existingEmail) {
        await this._emailTemplateModel.createEmailTemplate(email);
      }
    }

    for (const cms of this.contentManager) {
      const existingcms = await this._contentManagerModel.getCMS({
        slug: cms.slug,
      });

      if (!existingcms) {
        await this._contentManagerModel.createCMS(cms);
      }
    }
  }
}
