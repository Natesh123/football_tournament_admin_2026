import { Component } from '@angular/core';
import { LegalPageComponent, LegalSection } from '../legal-page.component';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [LegalPageComponent],
  template: `<app-legal-page title="Support" [sections]="sections"></app-legal-page>`
})
export class SupportComponent {
  sections: LegalSection[] = [
    {
      heading: 'Need Help?',
      body: [
        'Our support team is here to help you get the most out of the ATB Sport platform. Whether you are setting up your first tournament or managing teams, we have you covered.'
      ]
    },
    {
      heading: 'Contact Support',
      body: [
        'For any questions, issues, or feedback, email us at support@atbsport.com. We aim to respond within one business day.'
      ]
    },
    {
      heading: 'Common Topics',
      body: [
        'Account and login issues, creating and managing tournaments, adding teams and players, recording match results, and managing roles and permissions.'
      ]
    },
    {
      heading: 'Feature Requests',
      body: [
        'We love hearing how we can make the platform better. Send your ideas to support@atbsport.com and our team will review them.'
      ]
    }
  ];
}
