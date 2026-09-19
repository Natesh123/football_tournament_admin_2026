import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../settings.service';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
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
      </div>

      <!-- Roles List -->
      <div class="bg-black-card border border-black-border rounded-xl overflow-hidden shadow-lg">
        <div class="p-4 border-b border-black-border bg-white/5">
          <h3 class="font-semibold text-white">Existing Roles</h3>
        </div>
        <div class="p-0 relative min-h-[200px]">
          @if (isFetchingData()) {
            <div class="absolute inset-0 flex items-center justify-center">
              <app-loader></app-loader>
            </div>
          } @else {
          <table class="w-full text-left">
            <thead>
              <tr class="text-zinc-400 text-sm border-b border-black-border">
                <th class="px-6 py-4 font-medium uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 font-medium uppercase tracking-wider">Role Name</th>
                <th class="px-6 py-4 font-medium uppercase tracking-wider text-right">Actions</th>
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
                <td class="px-6 py-4 text-right">
                  <button *ngIf="role.id !== 1" (click)="deleteRole(role.id)" class="p-2 text-red-500 hover:bg-red-500/20 rounded-md transition-all active:scale-90" title="Delete Role">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="roles().length === 0">
                <td colspan="3" class="px-6 py-8 text-center text-zinc-500 italic">No roles found. Create one above.</td>
              </tr>
            </tbody>
          </table>
          }
        </div>
      </div>

    </div>
  `
})
export class RolesComponent implements OnInit {
  roles = signal<any[]>([]);
  newRoleName = '';
  isLoading = false;
  isFetchingData = signal(true);

  roleToDeleteId: number | null = null;

  constructor(
    private settingsService: SettingsService,
    private ui: UiService
  ) { }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.isFetchingData.set(true);
    this.settingsService.getRoles().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.isFetchingData.set(false);
      },
      error: (err) => {
        this.isFetchingData.set(false);
      }
    });
  }

  addRole() {
    if (!this.newRoleName.trim()) return;

    this.isLoading = true;
    this.settingsService.addRole(this.newRoleName.trim()).subscribe({
      next: () => {
        this.newRoleName = '';
        this.isLoading = false;
        this.ui.showToast('Role added successfully', 'success');
        this.loadRoles();
      },
      error: (err) => {
        this.isLoading = false;
        this.ui.showToast(err.error?.error || 'Failed to add role', 'error');
      }
    });
  }

  async deleteRole(id: number) {
    const confirmed = await this.ui.confirmAction(
      'Delete Role', 
      'Are you sure you want to delete this role? This action cannot be undone and will remove all related permissions.'
    );
    
    if (confirmed) {
      this.isLoading = true;
      this.settingsService.deleteRole(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.ui.showToast('Role deleted successfully', 'success');
          this.loadRoles();
        },
        error: (err) => {
          this.isLoading = false;
          this.ui.showToast(err.error?.error || 'Failed to delete role', 'error');
        }
      });
    }
  }
}
