import { Component } from '@angular/core';

@Component({
    selector: 'app-permissions',
    standalone: true,
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Permissions Management</h2>
      </div>
      <div class="bg-black-card border border-black-border rounded-xl p-6">
        <p class="text-zinc-400">View and configure system-wide permissions.</p>
        <!-- Permission matrix would go here -->
      </div>
    </div>
  `
})
export class PermissionsComponent { }
