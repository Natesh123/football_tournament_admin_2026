import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sponsor-banners',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-16 bg-navy-lighter overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h3 class="text-gold uppercase tracking-[0.2em] font-bold text-sm">Official Partners</h3>
          <div class="w-16 h-1 bg-gold mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <div class="group">
            <img src="/images/sponsors/sponsor1.png" alt="Nike" 
                 class="h-12 md:h-16 object-contain transition-transform group-hover:scale-110"
                 onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'">
          </div>
          <div class="group">
            <img src="/images/sponsors/sponsor2.png" alt="Adidas" 
                 class="h-12 md:h-16 object-contain transition-transform group-hover:scale-110"
                 onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg'">
          </div>
          <div class="group">
            <img src="/images/sponsors/sponsor3.png" alt="Emirates" 
                 class="h-12 md:h-16 object-contain transition-transform group-hover:scale-110"
                 onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg'">
          </div>
          <div class="group">
            <img src="/images/sponsors/sponsor4.png" alt="Coca-Cola" 
                 class="h-12 md:h-16 object-contain transition-transform group-hover:scale-110"
                 onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg'">
          </div>
          <div class="group">
            <img src="/images/sponsors/sponsor5.png" alt="Red Bull" 
                 class="h-12 md:h-16 object-contain transition-transform group-hover:scale-110"
                 onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/e/e3/Red_Bull_logo.svg'">
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class SponsorBannersComponent { }
