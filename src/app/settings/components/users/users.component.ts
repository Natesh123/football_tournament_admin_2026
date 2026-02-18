import { Component } from '@angular/core';

@Component({
    selector: 'app-users',
    standalone: true,
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">User Management</h2>
        <button class="px-4 py-2 bg-gold-400 text-black font-bold rounded-lg hover:bg-gold-500 transition-colors">
          Add User
        </button>
      </div>
      <div class="bg-black-card border border-black-border rounded-xl p-6">
        <p class="text-zinc-400">Manage system users and their account details here.</p>
        <!-- User list table would go here -->
      </div>
    </div>
  `
})
export class UsersComponent { }
