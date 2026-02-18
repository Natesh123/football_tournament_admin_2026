import { Component } from '@angular/core';

@Component({
    selector: 'app-roles',
    standalone: true,
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Roles Management</h2>
        <button class="px-4 py-2 bg-gold-400 text-black font-bold rounded-lg hover:bg-gold-500 transition-colors">
          Add Role
        </button>
      </div>
      <div class="bg-black-card border border-black-border rounded-xl p-6">
        <p class="text-zinc-400">Manage user roles and their access levels here.</p>
        <!-- Role list table would go here -->
      </div>
    </div>
  `
})
export class RolesComponent { }
