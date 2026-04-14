import { Component, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="relative pt-24 pb-10 bg-navy-lighter overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-t from-navy to-navy-lighter"></div>
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
      
      <!-- Decorative Orbs -->
      <div class="absolute top-20 left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-20 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          <!-- Brand Column -->
          <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center space-x-3">
              <img src="images/logo-gold.png" alt="ATB Sport Logo" class="h-14 w-14 object-contain mix-blend-screen">
              <span class="text-4xl font-black gradient-text italic tracking-tighter uppercase">ATB SPORTS</span>
            </div>
            <p class="text-gray-500 leading-relaxed max-w-md">
              The premier platform for regional football competitions. Bringing together the passion, the glory, and the champion inside you.
            </p>
            <div class="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="group w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gold hover:text-navy transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/20">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="group w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gold hover:text-navy transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/20">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="group w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gold hover:text-navy transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/20">
                 <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.132 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.584-.072-4.85c-.052-1.17-.247-1.803-.413-2.227-.217-.562-.477-.96-.896-1.382-.419-.419-.824-.679-1.38-.896-.42-.164-1.057-.36-2.227-.413-1.266-.057-1.646-.07-4.85-.07zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="group w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gold hover:text-navy transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/20">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div class="space-y-6">
            <h5 class="text-white font-bold uppercase tracking-widest text-sm">Quick Links</h5>
            <ul class="space-y-4">
              <li><a href="#hero" class="text-gray-500 hover:text-gold transition-colors flex items-center group">
                <svg class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Home
              </a></li>
              <li><a href="#about" class="text-gray-500 hover:text-gold transition-colors flex items-center group">
                <svg class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                About
              </a></li>
              <li><a href="#schedule" class="text-gray-500 hover:text-gold transition-colors flex items-center group">
                <svg class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Schedule
              </a></li>
              <li><a href="#register" class="text-gray-500 hover:text-gold transition-colors flex items-center group">
                <svg class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Register
              </a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="space-y-6">
            <h5 class="text-white font-bold uppercase tracking-widest text-sm">Support</h5>
            <ul class="space-y-4">
              <li><a (click)="$event.preventDefault()" href="#" class="text-gray-500 hover:text-gold transition-colors flex items-center group cursor-pointer">
                <svg class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Help Center
              </a></li>
              <li><a (click)="$event.preventDefault()" href="#" class="text-gray-500 hover:text-gold transition-colors flex items-center group cursor-pointer">
                <svg class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Privacy Policy
              </a></li>
              <li><a (click)="$event.preventDefault()" href="#" class="text-gray-500 hover:text-gold transition-colors flex items-center group cursor-pointer">
                <svg class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Official Rules
              </a></li>
              <li><a (click)="$event.preventDefault()" href="#" class="text-gray-500 hover:text-gold transition-colors flex items-center group cursor-pointer">
                <svg class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Contact Us
              </a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div class="space-y-6">
            <h5 class="text-white font-bold uppercase tracking-widest text-sm">Newsletter</h5>
            <p class="text-gray-500 text-sm">Get the latest updates and exclusive content delivered to your inbox.</p>
            <div class="flex">
              <input type="email" placeholder="Your email" 
                     class="flex-1 bg-white/5 border-2 border-white/10 rounded-l-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors">
              <button class="bg-gradient-to-r from-gold to-gold-light text-navy px-6 py-4 rounded-r-xl font-bold hover:shadow-lg hover:shadow-gold/30 transition-all">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Bottom Bar -->
        <div class="pt-10 border-t border-white/10">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
             <div class="flex items-center space-x-4">
               <span class="text-gray-600 text-xs tracking-widest font-bold">© 2026 ATB SPORTS. ALL RIGHTS RESERVED.</span>
             </div>
             <div class="text-gray-500 text-xs flex items-center space-x-2">
                <span>Made with</span>
                <svg class="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
                <span>for World-Class Football</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .gradient-text {
      background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `]
})
export class FooterComponent implements OnInit, OnDestroy {
  private el: ElementRef;
  private renderer: Renderer2;
  private observer: IntersectionObserver | null = null;

  constructor(el: ElementRef, renderer: Renderer2) {
    this.el = el;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.initScrollReveal();
  }

  private initScrollReveal() {
    const options: IntersectionObserverInit = {
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'revealed');
          this.renderer.addClass(entry.target, 'animate-fadeInUp');
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    const elements = this.el.nativeElement.querySelectorAll('.scroll-reveal');
    elements.forEach((el: Element, index: number) => {
      this.renderer.setStyle(el, 'transition-delay', `${index * 0.1}s`);
      this.observer?.observe(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
