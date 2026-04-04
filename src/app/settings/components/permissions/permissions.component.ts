import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../settings.service';
import { ConfirmModalComponent } from '../../../components/shared/confirm-modal.component';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Permissions Management</h2>
      </div>

      <!-- Add/Edit Permissions Form -->
      <div class="bg-black-card border border-gold-400/20 rounded-xl p-6 shadow-2xl">
        <h3 class="text-lg font-semibold text-gold-400 mb-6 underline decoration-gold-400/30 underline-offset-8 text-center uppercase tracking-widest">Add Permissions</h3>
        
        <form [formGroup]="permissionForm" (ngSubmit)="onSubmit()" class="space-y-8">
          <!-- Role Selection -->
          <div class="max-w-md mx-auto space-y-2 text-center relative">
            <label class="text-xs text-zinc-500 uppercase font-black px-1 tracking-[0.2em]">Role</label>
            <div class="relative group dropdown-container">
              <!-- Custom Dropdown Trigger -->
              <div 
                (click)="toggleRoleDropdown($event)"
                class="w-full bg-black-bg border-2 border-gold-400/30 rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none cursor-pointer transition-all hover:bg-gold-400/5 font-bold shadow-[0_0_20px_rgba(251,191,36,0.05)] flex items-center justify-between"
                [ngClass]="{'border-gold-400': showRoleDropdown()}"
              >
                <span>{{ getSelectedRoleName() || 'Select Role' }}</span>
                <div class="text-gold-400 transition-transform duration-300" [ngClass]="{'rotate-180': showRoleDropdown()}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <!-- Custom Dropdown Menu -->
              <div 
                *ngIf="showRoleDropdown()"
                class="absolute left-0 right-0 mt-2 bg-black-card border border-gold-400/50 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.8)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              >
                <div class="max-h-60 overflow-y-auto py-2">
                  <div 
                    (click)="selectRole(null)"
                    class="px-4 py-3 text-zinc-500 hover:bg-white/5 cursor-pointer text-sm font-bold uppercase transition-colors"
                  >
                    Select Role
                  </div>
                  <div 
                    *ngFor="let role of roles()"
                    (click)="selectRole(role.id)"
                    class="px-4 py-3 text-white hover:bg-gold-400/10 hover:text-gold-400 cursor-pointer text-sm font-bold uppercase transition-colors flex items-center justify-between group"
                    [ngClass]="{'bg-gold-400/10 text-gold-400': permissionForm.get('roleId')?.value === role.id}"
                  >
                    {{ role.name }}
                    <svg *ngIf="permissionForm.get('roleId')?.value === role.id" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <p *ngIf="permissionForm.get('roleId')?.touched && permissionForm.get('roleId')?.invalid" class="text-red-500 text-[10px] font-bold mt-1 uppercase">Role is required</p>
          </div>

          <!-- Allocate Access Grid -->
          <div class="space-y-4">
             <h4 class="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] mb-4 border-b border-white/5 pb-2">Allocate Access</h4>
             <div class="grid grid-cols-2 md:grid-cols-4 gap-6 p-4">
                <div *ngFor="let mod of modules" class="flex items-center space-x-3 group cursor-pointer" (click)="toggleModule(mod.key)">
                   <div class="w-5 h-5 border-2 rounded flex items-center justify-center transition-all" 
                        [ngClass]="permissionForm.get('permissions')?.get(mod.key)?.value ? 'bg-gold-400 border-gold-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]' : 'border-zinc-700 bg-transparent group-hover:border-gold-400/50'">
                      <svg *ngIf="permissionForm.get('permissions')?.get(mod.key)?.value" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-black font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                        <path d="M20 6L9 17L4 12" />
                      </svg>
                   </div>
                   <span class="text-sm font-semibold transition-colors uppercase tracking-wider" 
                         [ngClass]="permissionForm.get('permissions')?.get(mod.key)?.value ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'">
                      {{ mod.label }}
                   </span>
                </div>
             </div>
          </div>

          <div class="pt-4 border-t border-white/5">
            <button 
              type="submit" 
              [disabled]="permissionForm.invalid || isLoading"
              class="px-8 py-3 bg-gold-400 text-black font-black rounded-lg hover:bg-gold-500 transition-all shadow-xl active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
            >
              {{ isLoading ? 'Processing...' : (editingId ? 'Update Permissions' : 'Add Permissions') }}
            </button>
            <button 
              *ngIf="editingId"
              type="button"
              (click)="resetForm()"
              class="ml-4 px-8 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-lg hover:text-white transition-all text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Permissions List -->
      <div class="bg-black-card border border-black-border rounded-xl overflow-hidden shadow-2xl mt-12">
        <div class="p-6 border-b border-black-border bg-black/40 flex items-center justify-between">
            <h3 class="text-xl font-bold text-white tracking-widest uppercase">Permissions List</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-gold-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-black-border bg-black/20">
                <th class="px-8 py-5">S.No</th>
                <th class="px-8 py-5">Role Name</th>
                <th class="px-8 py-5">Permissions</th>
                <th class="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black-border/30">
              <tr *ngFor="let p of permissions(); let i = index" class="hover:bg-gold-400/[0.02] transition-colors group">
                <td class="px-8 py-6 text-zinc-500 font-mono text-sm">{{ i + 1 }}</td>
                <td class="px-8 py-6">
                  <div class="font-bold text-white text-base group-hover:text-gold-400 transition-colors uppercase">{{ p.role?.name || 'Unknown' }}</div>
                </td>
                <td class="px-8 py-6">
                  <div class="flex flex-wrap gap-2 max-w-xl">
                    <ng-container *ngFor="let mod of modules">
                      <span *ngIf="p.module_access?.[mod.key]" class="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-[9px] font-black uppercase tracking-tighter">
                        {{ mod.label }}
                      </span>
                    </ng-container>
                  </div>
                </td>
                <td class="px-8 py-6 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button (click)="editPermission(p)" class="p-2.5 bg-gold-400 text-black rounded-lg hover:bg-gold-500 transition-all shadow-md active:scale-90" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button (click)="onDelete(p)" class="p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md active:scale-90" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="permissions().length === 0">
                <td colspan="4" class="px-8 py-16 text-center text-zinc-600 italic uppercase tracking-[0.2em] text-xs">No permissions configured yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <app-confirm-modal
        [show]="showDeleteConfirm"
        title="Delete Permission Mapping"
        [message]="'Are you sure you want to remove permissions for this role? This cannot be undone.'"
        (onConfirm)="confirmDelete()"
        (onCancel)="showDeleteConfirm = false"
      ></app-confirm-modal>
    </div>
  `
})
export class PermissionsComponent implements OnInit {
  permissions = signal<any[]>([]);
  roles = signal<any[]>([]);
  isLoading = false;
  editingId: number | null = null;
  permissionForm: FormGroup;

  showDeleteConfirm = false;
  recordToDelete: any = null;
  showRoleDropdown = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.showRoleDropdown.set(false);
    }
  }

  modules = [
    { key: 'can_dashboard', label: 'Dashboard' },
    { key: 'can_tournaments', label: 'Tournaments' },
    { key: 'can_teams', label: 'Teams' },
    { key: 'can_roles', label: 'Roles' },
    { key: 'can_permissions', label: 'Permissions' },
    { key: 'can_users', label: 'Users' },
    { key: 'can_settings', label: 'Settings' }
  ];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {
    const permGroup: any = {};
    this.modules.forEach(m => permGroup[m.key] = [false]);

    this.permissionForm = this.fb.group({
      roleId: [null, [Validators.required]],
      permissions: this.fb.group(permGroup)
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.settingsService.getPermissions().subscribe(data => this.permissions.set(data));
    this.settingsService.getRoles().subscribe(data => this.roles.set(data));
  }

  toggleRoleDropdown(event: Event) {
    event.stopPropagation();
    this.showRoleDropdown.set(!this.showRoleDropdown());
  }

  selectRole(roleId: number | null) {
    this.permissionForm.get('roleId')?.setValue(roleId);
    this.permissionForm.get('roleId')?.markAsTouched();
    this.showRoleDropdown.set(false);
  }

  getSelectedRoleName() {
    const roleId = this.permissionForm.get('roleId')?.value;
    return this.roles().find(r => r.id === roleId)?.name;
  }

  toggleModule(key: string) {
    const control = this.permissionForm.get('permissions')?.get(key);
    control?.setValue(!control.value);
  }

  resetForm() {
    this.editingId = null;
    this.permissionForm.reset({
      roleId: null,
      permissions: this.modules.reduce((acc: any, m) => ({ ...acc, [m.key]: false }), {})
    });
  }

  editPermission(p: any) {
    this.editingId = p.id;
    const permissions: any = {};
    const access = p.module_access || {};
    this.modules.forEach(m => permissions[m.key] = access[m.key] || false);

    this.permissionForm.patchValue({
      roleId: p.roleId,
      permissions
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(p: any) {
    this.recordToDelete = p;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.recordToDelete) return;
    this.isLoading = true;
    this.showDeleteConfirm = false;
    this.settingsService.deletePermission(this.recordToDelete.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.recordToDelete = null;
        this.loadData();
      },
      error: () => {
        this.isLoading = false;
        this.recordToDelete = null;
        alert('Failed to delete permission mapping');
      }
    });
  }

  onSubmit() {
    if (this.permissionForm.invalid) return;
    this.isLoading = true;

    const formData = {
      roleId: this.permissionForm.value.roleId,
      permissions: this.permissionForm.value.permissions
    };

    this.settingsService.savePermissions(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.resetForm();
        this.loadData();
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error?.error || 'Failed to save permissions');
      }
    });
  }
}
