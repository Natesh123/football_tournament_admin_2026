import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="flex justify-center items-center h-full w-full">
      <img src="/assets/images/football.gif" alt="Loading..." class="w-64 h-64 object-contain">
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class LoaderComponent { }
