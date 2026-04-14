import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-promo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="app-promo" class="py-24 relative overflow-hidden bg-navy-dark">
      <!-- Decorative Background Elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px]"></div>
        <div class="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gold-dark/10 rounded-full blur-[120px]"></div>
        <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.2) 1px, transparent 1px); background-size: 50px 50px;"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="bg-gradient-to-br from-navy-lighter via-navy to-navy-dark rounded-[3rem] p-8 md:p-16 border border-gold/20 shadow-2xl overflow-hidden relative">
          <!-- Glass effect overlay -->
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <!-- Content -->
            <div class="space-y-8">
               <div class="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20">
                <span class="text-gold text-sm font-semibold tracking-wider uppercase">Official App</span>
              </div>
              
              <h2 class="text-4xl md:text-6xl font-black text-white leading-tight">
                Take the Game <br/>
                <span class="gradient-text">Anywhere.</span>
              </h2>
              
              <p class="text-gray-400 text-lg leading-relaxed max-w-lg">
                The ultimate companion for players and fans. Track live scores, manage your team roster, and register for tournaments seamlessly from your mobile device. Your journey to the championship is now in your pocket.
              </p>
              
              <div class="space-y-6 pt-4">
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold border border-gold/20">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-white font-bold text-lg">Instant Registration</h4>
                    <p class="text-gray-400 text-sm">Sign up your team for tournaments in seconds with just a few taps.</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-4">
                  <div class="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold border border-gold/20">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-white font-bold text-lg">Real-time Updates</h4>
                    <p class="text-gray-400 text-sm">Get live notifications on match schedules, scores, and standings.</p>
                  </div>
                </div>
              </div>

              <!-- App Store Buttons -->
              <div class="flex flex-wrap gap-4 pt-6">
                <!-- App Store Button -->
                <button class="flex items-center space-x-3 px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-2xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                  <svg class="w-8 h-8" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  <div class="text-left leading-tight">
                    <div class="text-[10px] text-gray-600 font-semibold uppercase">Download on the</div>
                    <div class="text-base font-bold">App Store</div>
                  </div>
                </button>
                
                <!-- Google Play Button -->
                <button class="flex items-center space-x-3 px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-2xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                  <svg class="w-8 h-8" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                  <div class="text-left leading-tight">
                    <div class="text-[10px] text-gray-600 font-semibold uppercase">GET IT ON</div>
                    <div class="text-base font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Image Side -->
            <div class="relative mt-12 lg:mt-0 flex justify-center perspective-1000">
              <!-- Glow behind phones -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] bg-gold/30 blur-[100px] rounded-full z-0"></div>
              
              <!-- First Phone Mockup -->
              <div class="relative z-10 w-[200px] md:w-[240px] transform -rotate-12 translate-y-8 animate-float shadow-2xl rounded-[2.5rem] border-4 border-gray-800 bg-gray-900 overflow-hidden">
                <img src="/assets/images/auth-bg.jpg" alt="App Screen" class="w-full h-[480px] object-cover opacity-80 mix-blend-screen" onerror="this.src='https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400&h=800'">
                <!-- Top Notch -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-black rounded-b-2xl"></div>
                <!-- UI Overlay Mockup -->
                <div class="absolute inset-0 p-4 pt-10 flex flex-col pointer-events-none">
                  <div class="h-10 w-10 rounded-full bg-gold/80 mb-6"></div>
                  <div class="h-6 w-3/4 rounded bg-white/20 mb-3"></div>
                  <div class="h-4 w-1/2 rounded bg-white/10 mb-8"></div>
                  <div class="flex-1 space-y-3">
                    <div class="h-16 rounded-xl bg-white/10 border border-white/5"></div>
                    <div class="h-16 rounded-xl bg-white/10 border border-white/5"></div>
                    <div class="h-16 rounded-xl bg-white/10 border border-white/5"></div>
                  </div>
                </div>
              </div>
              
              <!-- Second Phone Mockup -->
              <div class="relative z-20 w-[220px] md:w-[260px] transform translate-x-[-20%] rotate-6 animate-float shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] border-4 border-gray-800 bg-navy-dark overflow-hidden" style="animation-delay: -2s;">
                <img src="/assets/images/hero-player.jpg" alt="App Dashboard" class="w-full h-[520px] object-cover opacity-60" onerror="this.src='https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=400&h=800'">
                <div class="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/50 to-transparent"></div>
                <!-- Top Notch -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-black rounded-b-2xl"></div>
                <!-- Dashboard UI Mockup -->
                 <div class="absolute bottom-0 left-0 right-0 p-5 from-navy-dark to-transparent bg-gradient-to-t">
                    <div class="w-full h-12 rounded-xl bg-gold text-navy font-bold flex items-center justify-center text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                       Register Team
                    </div>
                 </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .gradient-text {
      background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(var(--tw-rotate)); }
      50% { transform: translateY(-15px) rotate(calc(var(--tw-rotate) + 2deg)); }
    }
    .perspective-1000 {
      perspective: 1000px;
    }
  `]
})
export class MobilePromoComponent {}
