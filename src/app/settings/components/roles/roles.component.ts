import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Roles Management</h2>
      </div>

      <!-- Add Role Form -->
      <div class="bg-black-card border border-black-border rounded-xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-white mb-4">Create New Role</h3>
        <div class="flex gap-4">
          <input 
            type="text" 
            [(ngModel)]="newRoleName" 
            placeholder="Enter role name (e.g. Admin)" 
            class="flex-1 bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-400"
          />
          <button 
            (click)="addRole()" 
            [disabled]="!newRoleName.trim() || isLoading"
            class="px-6 py-2 bg-gold-400 text-black font-bold rounded-lg hover:bg-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Adding...' : 'Add Role' }}
          </button>
        </div>
        <p *ngIf="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </div>

      <!-- Roles List -->
      <div class="bg-black-card border border-black-border rounded-xl overflow-hidden shadow-lg">
        <div class="p-4 border-b border-black-border bg-white/5">
          <h3 class="font-semibold text-white">Existing Roles</h3>
        </div>
        <div class="p-0">
          <table class="w-full text-left">
            <thead>
              <tr class="text-zinc-400 text-sm border-b border-black-border">
                <th class="px-6 py-4 font-medium uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 font-medium uppercase tracking-wider">Role Name</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black-border">
              <tr *ngFor="let role of roles()" class="text-zinc-300 hover:bg-white/5 transition-colors">
                <td class="px-6 py-4">{{ role.id }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-gold-400/10 text-gold-400 rounded-md text-sm font-medium border border-gold-400/20">
                    {{ role.name }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="roles().length === 0">
                <td colspan="2" class="px-6 py-8 text-center text-zinc-500 italic">No roles found. Create one above.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class RolesComponent implements OnInit {
  roles = signal<any[]>([]);
  newRoleName = '';
  isLoading = false;
  errorMessage = '';

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.settingsService.getRoles().subscribe({
      next: (data) => this.roles.set(data),
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  addRole() {
    if (!this.newRoleName.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.settingsService.addRole(this.newRoleName.trim()).subscribe({
      next: () => {
        this.newRoleName = '';
        this.isLoading = false;
        this.loadRoles();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Failed to add role';
      }
    });
  }
}
