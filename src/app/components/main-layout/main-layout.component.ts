import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, TopBarComponent, FooterComponent],
    template: `
    <div class="min-h-screen flex flex-col bg-neutral-950 text-gold-100 font-['Inter',sans-serif]">
      <app-top-bar></app-top-bar>
      <main class="flex-grow p-4 md:p-6 lg:p-8">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `
})
export class MainLayoutComponent { }
