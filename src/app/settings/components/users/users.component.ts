import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../settings.service';
import { ConfirmModalComponent } from '../../../components/shared/confirm-modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">User Management</h2>
        <button 
          (click)="showForm = !showForm; resetForm()"
          class="px-4 py-2 bg-gold-400 text-black font-bold rounded-lg hover:bg-gold-500 transition-colors shadow-[0_0_15px_rgba(251,191,36,0.2)]"
        >
          {{ showForm ? 'Cancel' : 'Add User' }}
        </button>
      </div>

      <!-- User Form (Add/Edit) -->
      <div *ngIf="showForm" class="bg-black-card border border-gold-400/20 rounded-xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4">
        <h3 class="text-lg font-semibold text-gold-400 mb-4">{{ editingUserId ? 'Edit User' : 'Add New User' }}</h3>
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs text-zinc-500 uppercase font-bold px-1">Email</label>
            <input formControlName="email" type="email" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-zinc-500 uppercase font-bold px-1">User Name</label>
            <input formControlName="user_name" type="text" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-zinc-500 uppercase font-bold px-1">Phone Number</label>
            <input formControlName="phone_number" type="text" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/20" />
          </div>
          <div class="space-y-1">
            <label class="text-xs text-zinc-500 uppercase font-bold px-1 text-gold-400">Role</label>
            <div class="relative group role-dropdown-container">
              <!-- Custom Role Dropdown -->
              <div 
                (click)="toggleRoleDropdown($event)"
                class="w-full bg-black-bg border-2 border-gold-400/30 rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none cursor-pointer transition-all hover:bg-white/5 font-semibold text-sm shadow-[0_0_15px_rgba(251,191,36,0.1)] flex items-center justify-between"
                [ngClass]="{'border-gold-400': showRoleDropdown()}"
              >
                <span>{{ getSelectedRoleName() || 'Select Role' }}</span>
                <div class="text-gold-400 transition-transform duration-300" [ngClass]="{'rotate-180': showRoleDropdown()}">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                   </svg>
                </div>
              </div>

              <!-- Custom Role Menu -->
              <div 
                *ngIf="showRoleDropdown()"
                class="absolute left-0 right-0 mt-1 bg-black-card border border-gold-400/50 rounded-lg shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div class="max-h-48 overflow-y-auto py-1">
                  <div (click)="selectRole(null)" class="px-4 py-2 text-zinc-500 hover:bg-white/5 cursor-pointer text-xs font-bold uppercase">Select Role</div>
                  <div 
                    *ngFor="let role of roles()" 
                    (click)="selectRole(role.id)"
                    class="px-4 py-2 text-white hover:bg-gold-400/10 hover:text-gold-400 cursor-pointer text-sm font-semibold transition-colors flex items-center justify-between"
                    [ngClass]="{'bg-gold-400/10 text-gold-400': userForm.get('roleId')?.value === role.id}"
                  >
                    {{ role.name }}
                    <svg *ngIf="userForm.get('roleId')?.value === role.id" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-zinc-500 uppercase font-bold px-1">Status</label>
            <div class="relative group status-dropdown-container">
              <!-- Custom Status Dropdown -->
               <div 
                (click)="toggleStatusDropdown($event)"
                class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between"
                [ngClass]="{'border-gold-400': showStatusDropdown()}"
              >
                <span [ngClass]="userForm.get('state')?.value === 1 ? 'text-green-500' : 'text-red-500'">
                  {{ userForm.get('state')?.value === 1 ? 'Active' : 'Inactive' }}
                </span>
                <div class="text-zinc-500 transition-transform duration-300" [ngClass]="{'rotate-180': showStatusDropdown(), 'text-gold-400': showStatusDropdown()}">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                   </svg>
                </div>
              </div>

              <!-- Custom Status Menu -->
              <div 
                *ngIf="showStatusDropdown()"
                class="absolute left-0 right-0 mt-1 bg-black-card border border-black-border rounded-lg shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div class="py-1">
                  <div (click)="selectStatus(1)" class="px-4 py-3 text-green-500 hover:bg-green-500/10 cursor-pointer text-xs font-bold uppercase transition-colors">Active</div>
                  <div (click)="selectStatus(0)" class="px-4 py-3 text-red-500 hover:bg-red-500/10 cursor-pointer text-xs font-bold uppercase transition-colors">Inactive</div>
                </div>
              </div>
            </div>
          </div>
          <div class="md:col-span-2 pt-4">
            <button 
              type="submit" 
              [disabled]="userForm.invalid || isLoading"
              class="w-full py-3 bg-gold-400 text-black font-extrabold rounded-lg hover:bg-gold-500 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-sm"
            >
              {{ isLoading ? 'Processing...' : (editingUserId ? 'Update User' : 'Create User') }}
            </button>
            <p *ngIf="errorMessage" class="text-red-500 text-sm mt-3 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{{ errorMessage }}</p>
          </div>
        </form>
      </div>

      <!-- Users List -->
      <div class="bg-black-card border border-black-border rounded-xl overflow-hidden shadow-2xl">
        <div class="p-4 border-b border-black-border bg-white/5 flex items-center justify-between">
          <span class="font-bold text-lg text-white">System Users</span>
          <span class="text-xs text-zinc-500 uppercase font-bold tracking-widest">{{ users().length }} total users</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-black-border bg-black/20">
                <th class="px-6 py-5">User</th>
                <th class="px-6 py-5">Contact</th>
                <th class="px-6 py-5">Role</th>
                <th class="px-6 py-5">Status</th>
                <th class="px-6 py-5">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black-border/50">
              <tr *ngFor="let user of users()" class="group text-zinc-300 hover:bg-gold-400/[0.02] transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-white group-hover:text-gold-400 transition-colors">{{ user.user_name }}</div>
                  <div class="text-xs text-zinc-500">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-mono text-zinc-400">{{ user.phone_number }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-zinc-800 text-gold-400 rounded-md text-[10px] font-bold border border-gold-400/20 uppercase tracking-tighter">
                    {{ user.userRole?.name || 'No Role' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                    [ngClass]="user.state === 1 ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'"
                  >
                    {{ user.state === 1 ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-1">
                    <button (click)="editUser(user)" class="p-2 text-gold-400 hover:bg-gold-400/20 rounded-md transition-all active:scale-90" title="Edit User">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button (click)="deleteUser(user.id)" class="p-2 text-red-500 hover:bg-red-500/20 rounded-md transition-all active:scale-90" title="Delete User">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="users().length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-zinc-500 italic">No users found. Capture your first user above.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <app-confirm-modal
        [show]="showDeleteConfirm"
        title="Delete User"
        [message]="'Are you sure you want to delete ' + userToDelete?.user_name + '? This action cannot be undone.'"
        (onConfirm)="confirmDelete()"
        (onCancel)="showDeleteConfirm = false"
      ></app-confirm-modal>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users = signal<any[]>([]);
  roles = signal<any[]>([]);
  showForm = false;
  editingUserId: number | null = null;
  isLoading = false;
  errorMessage = '';
  userForm: FormGroup;

  // Modal State
  showDeleteConfirm = false;
  userToDelete: any = null;

  // Custom Dropdown State
  showRoleDropdown = signal(false);
  showStatusDropdown = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.role-dropdown-container')) {
      this.showRoleDropdown.set(false);
    }
    if (!target.closest('.status-dropdown-container')) {
      this.showStatusDropdown.set(false);
    }
  }

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      user_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      roleId: [null, [Validators.required]],
      state: [1, [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.settingsService.getUsers().subscribe(data => this.users.set(data));
    this.settingsService.getRoles().subscribe(data => this.roles.set(data));
  }

  resetForm() {
    this.editingUserId = null;
    this.userForm.reset();
    this.errorMessage = '';
  }

  editUser(user: any) {
    this.editingUserId = user.id;
    this.showForm = true;
    this.userForm.patchValue({
      email: user.email,
      user_name: user.user_name,
      phone_number: user.phone_number,
      roleId: user.roleId,
      state: user.state
    });
  }

  toggleRoleDropdown(event: Event) {
    event.stopPropagation();
    this.showRoleDropdown.set(!this.showRoleDropdown());
    this.showStatusDropdown.set(false);
  }

  toggleStatusDropdown(event: Event) {
    event.stopPropagation();
    this.showStatusDropdown.set(!this.showStatusDropdown());
    this.showRoleDropdown.set(false);
  }

  selectRole(roleId: number | null) {
    this.userForm.get('roleId')?.setValue(roleId);
    this.userForm.get('roleId')?.markAsTouched();
    this.showRoleDropdown.set(false);
  }

  selectStatus(state: number) {
    this.userForm.get('state')?.setValue(state);
    this.showStatusDropdown.set(false);
  }

  getSelectedRoleName() {
    const roleId = this.userForm.get('roleId')?.value;
    return this.roles().find(r => r.id === roleId)?.name;
  }

  deleteUser(id: number) {
    const user = this.users().find(u => u.id === id);
    if (user) {
      this.userToDelete = user;
      this.showDeleteConfirm = true;
    }
  }

  confirmDelete() {
    if (!this.userToDelete) return;

    this.isLoading = true;
    this.showDeleteConfirm = false;

    this.settingsService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.userToDelete = null;
        this.loadData();
      },
      error: (err) => {
        this.isLoading = false;
        this.userToDelete = null;
        alert(err.error?.error || 'Failed to delete user');
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const userData = {
      ...this.userForm.value,
      id: this.editingUserId
    };

    this.settingsService.saveUser(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.showForm = false;
        this.resetForm();
        this.loadData();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Failed to save user';
      }
    });
  }
}
