import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { TeamMembersComponent } from './team-members.component';
import { TeamMemberService, TeamMember } from '../../team-member.service';

function makeMember(overrides: Partial<TeamMember> = {}): TeamMember {
  return {
    id: 'm1',
    name: 'Player One',
    role: 'player',
    teamId: 'team-1',
    createdAt: '2026-01-01T00:00:00Z',
    status: 'active',
    ...overrides,
  };
}

describe('TeamMembersComponent (players & staff)', () => {
  let component: TeamMembersComponent;
  let fixture: ComponentFixture<TeamMembersComponent>;
  let serviceMock: {
    getByTeamId: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const roster = [
    makeMember({ id: 'm1', name: 'Alice', role: 'captain', jerseyNumber: 10 }),
    makeMember({ id: 'm2', name: 'Bob', role: 'player', jerseyNumber: 7, status: 'injured' }),
    makeMember({ id: 'm3', name: 'Coach Carl', role: 'coach' }),
    makeMember({ id: 'm4', name: 'Manager Mia', role: 'manager' }),
  ];

  beforeEach(async () => {
    serviceMock = {
      getByTeamId: vi.fn().mockReturnValue(of(roster)),
      create: vi.fn().mockReturnValue(of(makeMember())),
      update: vi.fn().mockReturnValue(of(makeMember())),
      delete: vi.fn().mockReturnValue(of(undefined)),
    };

    const routeMock = {
      parent: { snapshot: { paramMap: { get: (k: string) => (k === 'id' ? 'team-1' : null) } } },
    };

    await TestBed.configureTestingModule({
      imports: [TeamMembersComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TeamMemberService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
    await fixture.whenStable();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('loads members for the parent team id on init', () => {
    expect(serviceMock.getByTeamId).toHaveBeenCalledWith('team-1');
    expect(component.members()).toEqual(roster);
  });

  describe('filtering', () => {
    it('filters by name (case-insensitive)', () => {
      component.searchTerm.set('ali');
      expect(component.filteredMembers().map(m => m.id)).toEqual(['m1']);
    });

    it('filters by jersey number', () => {
      component.searchTerm.set('7');
      expect(component.filteredMembers().map(m => m.id)).toEqual(['m2']);
    });

    it('"players" filter keeps players, captains and vice-captains', () => {
      component.activeFilter.set('players');
      expect(component.filteredMembers().map(m => m.id).sort()).toEqual(['m1', 'm2']);
    });

    it('"staff" filter keeps coaches and managers', () => {
      component.activeFilter.set('staff');
      expect(component.filteredMembers().map(m => m.id).sort()).toEqual(['m3', 'm4']);
    });

    it('"injured" filter keeps only injured members', () => {
      component.activeFilter.set('injured');
      expect(component.filteredMembers().map(m => m.id)).toEqual(['m2']);
    });

    it('"active" filter keeps active (or status-less) members', () => {
      component.activeFilter.set('active');
      expect(component.filteredMembers().map(m => m.id).sort()).toEqual(['m1', 'm3', 'm4']);
    });
  });

  it('exposes the captain via the computed signal', () => {
    expect(component.captain()?.id).toBe('m1');
  });

  describe('add / edit modal', () => {
    it('openAddModal("player") opens a blank player form', () => {
      component.openAddModal('player');
      expect(component.isModalOpen()).toBe(true);
      expect(component.editingMemberId()).toBeNull();
      expect(component.newMember.role).toBe('player');
      expect(component.newMember.status).toBe('active');
    });

    it('openAddModal("staff") defaults to a concrete staff role (coach)', () => {
      // 'staff' is a UI grouping with no matching role option, so it must
      // resolve to a real role that the staff filter recognises.
      component.openAddModal('staff');
      expect(component.newMember.role).toBe('coach');
      expect(['coach', 'manager']).toContain(component.newMember.role);
    });

    it('openEditModal loads a copy of the member (not the original reference)', () => {
      const member = roster[1];
      component.openEditModal(member);
      expect(component.editingMemberId()).toBe('m2');
      expect(component.newMember).toEqual(member);
      expect(component.newMember).not.toBe(member);
      expect(component.isModalOpen()).toBe(true);
    });

    it('closeModal resets the form and editing state', () => {
      component.openEditModal(roster[0]);
      component.closeModal();
      expect(component.isModalOpen()).toBe(false);
      expect(component.editingMemberId()).toBeNull();
      expect(component.newMember.role).toBe('player');
    });
  });

  describe('action menu', () => {
    it('toggleMenu opens and closes the row menu', () => {
      component.toggleMenu('m2');
      expect(component.activeMenuId()).toBe('m2');
      component.toggleMenu('m2');
      expect(component.activeMenuId()).toBeNull();
    });
  });

  describe('saveMember', () => {
    it('does nothing without a name', () => {
      component.newMember = { name: '' };
      component.saveMember();
      expect(serviceMock.create).not.toHaveBeenCalled();
      expect(serviceMock.update).not.toHaveBeenCalled();
    });

    it('creates a new member when not editing, then closes and reloads', () => {
      serviceMock.getByTeamId.mockClear();
      component.editingMemberId.set(null);
      component.newMember = { name: 'New Guy', role: 'player' };

      component.saveMember();

      expect(serviceMock.create).toHaveBeenCalledWith('team-1', { name: 'New Guy', role: 'player' });
      expect(component.isModalOpen()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
      expect(serviceMock.getByTeamId).toHaveBeenCalledWith('team-1');
    });

    it('updates an existing member when editing', () => {
      component.editingMemberId.set('m2');
      component.newMember = { name: 'Bob Edited', role: 'player' };

      component.saveMember();

      expect(serviceMock.update).toHaveBeenCalledWith('m2', { name: 'Bob Edited', role: 'player' });
      expect(serviceMock.create).not.toHaveBeenCalled();
    });

    it('clears the submitting flag when the request fails', () => {
      serviceMock.create.mockReturnValue(throwError(() => new Error('boom')));
      component.editingMemberId.set(null);
      component.newMember = { name: 'Fails' };

      component.saveMember();

      expect(component.isSubmitting()).toBe(false);
      expect(component.isModalOpen()).toBe(false); // was never opened in this test
    });
  });

  describe('removeMember', () => {
    afterEach(() => vi.restoreAllMocks());

    it('deletes and reloads when confirmed', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      serviceMock.getByTeamId.mockClear();

      component.removeMember('m2');

      expect(serviceMock.delete).toHaveBeenCalledWith('m2');
      expect(serviceMock.getByTeamId).toHaveBeenCalledWith('team-1');
      expect(component.activeMenuId()).toBeNull();
    });

    it('does not delete when cancelled', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      component.removeMember('m2');
      expect(serviceMock.delete).not.toHaveBeenCalled();
    });
  });
});
