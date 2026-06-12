import { Component } from '@angular/core';
import { LegalPageComponent, LegalSection } from '../legal-page.component';

@Component({
  selector: 'app-cookie',
  standalone: true,
  imports: [LegalPageComponent],
  template: `<app-legal-page title="Cookie Policy" [sections]="sections"></app-legal-page>`
})
export class CookieComponent {
  sections: LegalSection[] = [
    {
      heading: 'What Are Cookies',
      body: [
        'Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.'
      ]
    },
    {
      heading: 'How We Use Cookies',
      body: [
        'We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how the platform is used so we can improve it.'
      ]
    },
    {
      heading: 'Types of Cookies We Use',
      body: [
        'Essential cookies are required for the platform to function, such as authentication tokens. Preference cookies remember your settings, and analytics cookies help us measure usage.'
      ]
    },
    {
      heading: 'Managing Cookies',
      body: [
        'You can control or delete cookies through your browser settings. Please note that disabling essential cookies may affect the functionality of the platform.'
      ]
    },
    {
      heading: 'Contact Us',
      body: [
        'If you have questions about our use of cookies, contact us at support@atbsport.com.'
      ]
    }
  ];
}
