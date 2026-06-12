import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TeamMemberService, TeamMember } from '../../team-member.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './team-members.component.html',
  styles: [`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #3f3f46;
        border-radius: 20px;
      }
      .shadow-inset {
        box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.5);
      }
    `]
})
export class TeamMembersComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private memberService = inject(TeamMemberService);

  private teamId = this.route.parent?.snapshot.paramMap.get('id');

  // State
  members = signal<TeamMember[]>([]);
  isModalOpen = signal(false);
  isSubmitting = signal(false);
  editingMemberId = signal<string | null>(null);
  activeMenuId = signal<string | null>(null);

  // Filters
  searchTerm = signal('');
  activeFilter = signal('all'); // all, players, staff, active, injured

  // New/Edit Member Form State
  newMember: Partial<TeamMember> = this.getInitialMemberState('player');

  // Computed Properties
  filteredMembers = computed(() => {
    let result = this.members();

    // Apply string search
    const term = this.searchTerm().toLowerCase();
    if (term) {
      result = result.filter(m =>
        m.name.toLowerCase().includes(term) ||
        (m.jerseyNumber && m.jerseyNumber.toString().includes(term))
      );
    }

    // Apply dropdown filter
    switch (this.activeFilter()) {
      case 'players':
        result = result.filter(m => ['player', 'captain', 'vice_captain'].includes(m.role));
        break;
      case 'staff':
        result = result.filter(m => ['coach', 'manager'].includes(m.role));
        break;
      case 'active':
        result = result.filter(m => m.status === 'active' || !m.status);
        break;
      case 'injured':
        result = result.filter(m => m.status === 'injured');
        break;
    }

    return result;
  });

  // We select the first captain we find to highlight
  captain = computed(() => {
    return this.members().find(m => m.role === 'captain');
  });

  ngOnInit() {
    this.loadMembers();
  }

  private getInitialMemberState(role: 'player' | 'staff' | 'captain' | 'vice_captain' | 'coach' | 'manager' = 'player'): Partial<TeamMember> {
    // 'staff' is a UI grouping, not a persisted role — default it to a concrete staff role
    const resolvedRole = role === 'staff' ? 'coach' : role;
    return {
      role: resolvedRole as any,
      status: 'active',
      position: '',
      jerseyNumber: undefined,
      dob: '',
      preferredFoot: 'right'
    };
  }

  loadMembers() {
    if (!this.teamId) return;
    this.memberService.getByTeamId(this.teamId).subscribe(data => {
      this.members.set(data);
    });
  }

  // Modal Actions
  openAddModal(type: 'player' | 'staff') {
    this.editingMemberId.set(null);
    this.newMember = this.getInitialMemberState(type);
    this.isModalOpen.set(true);
    this.activeMenuId.set(null); // close any open native menu
  }

  openEditModal(member: TeamMember) {
    this.editingMemberId.set(member.id);
    this.newMember = { ...member }; // open a copy to edit
    this.isModalOpen.set(true);
    this.activeMenuId.set(null);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingMemberId.set(null);
    this.newMember = this.getInitialMemberState('player');
  }

  // Action Menu Toggle
  toggleMenu(id: string) {
    if (this.activeMenuId() === id) {
      this.activeMenuId.set(null);
    } else {
      this.activeMenuId.set(id);
    }
  }

  saveMember() {
    if (!this.teamId || !this.newMember.name) return;

    this.isSubmitting.set(true);

    const editingId = this.editingMemberId();
    const request$ = editingId
      ? this.memberService.update(editingId, this.newMember)
      : this.memberService.create(this.teamId, this.newMember);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadMembers();
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  removeMember(id: string) {
    if (!confirm('Are you sure you want to remove this member?')) return;
    this.activeMenuId.set(null);

    this.memberService.delete(id).subscribe({
      next: () => this.loadMembers(),
      error: () => {}
    });
  }
}
