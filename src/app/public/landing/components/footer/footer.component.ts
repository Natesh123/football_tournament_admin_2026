import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-navy-lighter pt-20 pb-10 border-t border-gold/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div class="space-y-6">
            <span class="text-3xl font-black text-gold-gradient italic tracking-tighter">FOOTBALL TURNO</span>
            <p class="text-gray-500 leading-relaxed text-sm">
              The premier platform for regional football competitions. Bringing together the passion, the glory, and the champion inside you.
            </p>
          </div>
          
          <div class="space-y-6">
            <h5 class="text-white font-bold uppercase tracking-widest text-xs">Quick Links</h5>
            <ul class="space-y-3 text-gray-500 text-sm">
              <li><a href="#hero" class="hover:text-gold transition-colors">Home</a></li>
              <li><a href="#about" class="hover:text-gold transition-colors">About</a></li>
              <li><a href="#schedule" class="hover:text-gold transition-colors">Schedule</a></li>
            </ul>
          </div>

          <div class="space-y-6">
            <h5 class="text-white font-bold uppercase tracking-widest text-xs">Support</h5>
            <ul class="space-y-3 text-gray-500 text-sm">
              <li><a href="#" class="hover:text-gold transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-gold transition-colors">Official Rules</a></li>
              <li><a href="#" class="hover:text-gold transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div class="space-y-6">
            <h5 class="text-white font-bold uppercase tracking-widest text-xs">Stay Connected</h5>
            <div class="flex space-x-4">
              <a href="#" class="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-gray-400 hover:bg-gold hover:text-navy transition-all duration-300 transform hover:scale-110">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-gray-400 hover:bg-gold hover:text-navy transition-all duration-300 transform hover:scale-110">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" class="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-gray-400 hover:bg-gold hover:text-navy transition-all duration-300 transform hover:scale-110">
                 <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.132 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.584-.072 4.85c-.052 1.17-.247 1.803-.413 2.227-.217.562-.477.96-.896 1.382-.419.419-.824.679-1.38.896-.42.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.015-4.85-.072c-1.17-.052-1.803-.247-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.419-.679-.824-.896-1.38-.164-.42-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.584.072-4.85c.052-1.17.247-1.803.413-2.227.217-.562.477-.96.896-1.382.419-.419.824-.679 1.38-.896.42-.164 1.057-.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="pt-10 border-t border-gold/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
           <span class="text-gray-600 text-xs tracking-widest font-bold">© 2026 FOOTBALL TURNO. ALL RIGHTS RESERVED.</span>
           <div class="text-gray-500 text-xs flex items-center space-x-2">
              <span>Made with</span>
              <svg class="h-4 w-4 text-gold-dark" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
              <span>for World-Class Football</span>
           </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent { }
