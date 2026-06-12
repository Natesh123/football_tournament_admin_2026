import { Component } from '@angular/core';
import { LegalPageComponent, LegalSection } from '../legal-page.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [LegalPageComponent],
  template: `<app-legal-page title="Privacy Policy" [sections]="sections"></app-legal-page>`
})
export class PrivacyComponent {
  sections: LegalSection[] = [
    {
      heading: 'Overview',
      body: [
        'ATB Sport ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our tournament management platform.'
      ]
    },
    {
      heading: 'Information We Collect',
      body: [
        'We collect information you provide directly, such as your name, email address, and team or tournament details when you register and use the platform.',
        'We also collect usage data automatically, including device information, log data, and activity within the application, to help us improve our services.'
      ]
    },
    {
      heading: 'How We Use Your Information',
      body: [
        'We use the information we collect to operate, maintain, and improve the platform, to communicate with you, to provide customer support, and to ensure the security of your account.'
      ]
    },
    {
      heading: 'Data Sharing',
      body: [
        'We do not sell your personal information. We may share data with trusted service providers who help us operate the platform, subject to confidentiality obligations, or where required by law.'
      ]
    },
    {
      heading: 'Your Rights',
      body: [
        'You may access, update, or request deletion of your personal information at any time by contacting us at support@atbsport.com.'
      ]
    },
    {
      heading: 'Contact Us',
      body: [
        'If you have questions about this Privacy Policy, please reach out to us at support@atbsport.com.'
      ]
    }
  ];
}
