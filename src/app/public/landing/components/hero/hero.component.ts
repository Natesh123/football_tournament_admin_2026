import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tournament } from '../../../../models/portal.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hero" class="relative overflow-hidden min-h-screen flex items-center pt-20">
      <!-- Background Decorations -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[60%] bg-gold/10 blur-[150px] rounded-full"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-[70%] bg-gold/5 blur-[120px] rounded-full"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="text-left space-y-8 animate-fade-in">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              <span>Registrations Open</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
              Ultimate <span class="text-gold-gradient italic">Champions</span> League 2026
            </h1>
            
            <p class="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">
              Join the most prestigious regional football tournament. Experience the thrill, the passion, and the glory. Your journey to the top starts here.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#register" class="btn btn-primary btn-lg border-none text-navy font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
                Register Your Team
              </a>
              <a href="#schedule" class="btn btn-outline border-gold text-gold hover:bg-gold/10 hover:text-gold px-8 py-3 rounded-xl transition-all duration-300">
                View Schedule
              </a>
            </div>

            <div class="flex items-center space-x-8 pt-8">
              <div>
                <span class="block text-2xl font-bold text-white">32+</span>
                <span class="text-gray-500 text-sm uppercase tracking-wider">TEAMS</span>
              </div>
              <div class="w-px h-10 bg-gray-800"></div>
              <div>
                <span class="block text-2xl font-bold text-white">120+</span>
                <span class="text-gray-500 text-sm uppercase tracking-wider">MATCHES</span>
              </div>
              <div class="w-px h-10 bg-gray-800"></div>
              <div>
                <span class="block text-2xl font-bold text-white">$5,000+</span>
                <span class="text-gray-500 text-sm uppercase tracking-wider">PRIZE POOL</span>
              </div>
            </div>
          </div>

          <div class="relative hidden lg:block">
            <div class="relative z-10 w-full h-[500px] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.1)] group">
              <img src="/assets/images/hero-player.jpg" alt="Player silhouette" 
                   class="w-full h-full object-cover transform duration-700 hover:scale-110"
                   onerror="this.src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000'">
              <div class="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent"></div>
            </div>
            <!-- Decorative Elements -->
            <div class="absolute -top-6 -right-6 w-32 h-32 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute -bottom-6 -left-6 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 1s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HeroComponent {
  @Input() tournament?: Tournament;
}
