import { Component } from '@angular/core';
import { LegalPageComponent, LegalSection } from '../legal-page.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [LegalPageComponent],
  template: `<app-legal-page title="Terms of Service" [sections]="sections"></app-legal-page>`
})
export class TermsComponent {
  sections: LegalSection[] = [
    {
      heading: 'Acceptance of Terms',
      body: [
        'By accessing or using the ATB Sport platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the platform.'
      ]
    },
    {
      heading: 'Use of the Platform',
      body: [
        'You agree to use the platform only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.'
      ]
    },
    {
      heading: 'User Content',
      body: [
        'You retain ownership of the content you submit, such as team information, match data, and media. By submitting content, you grant us a license to use it as necessary to operate and provide the platform.'
      ]
    },
    {
      heading: 'Prohibited Conduct',
      body: [
        'You may not misuse the platform, attempt to gain unauthorized access, interfere with its operation, or use it to distribute harmful or unlawful content.'
      ]
    },
    {
      heading: 'Limitation of Liability',
      body: [
        'The platform is provided "as is" without warranties of any kind. To the fullest extent permitted by law, ATB Sport shall not be liable for any indirect or consequential damages arising from your use of the platform.'
      ]
    },
    {
      heading: 'Changes to These Terms',
      body: [
        'We may update these Terms of Service from time to time. Continued use of the platform after changes constitutes acceptance of the revised terms.'
      ]
    }
  ];
}
