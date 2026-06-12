import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { TeamsComponent } from './teams.component';
import { TeamService, Team } from './team.service';
import { UiService } from '../services/ui.service';
import { API_URL } from '../core/config/app.config';

function makeTeam(overrides: Partial<Team> = {}): Team {
  return {
    id: 't1',
    name: 'Manchester FC',
    contactEmail: 'info@mfc.com',
    captainName: 'John Doe',
    teamType: 'Club',
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

/** A minimal MouseEvent stub that records stopPropagation calls. */
function mouseEvent(): MouseEvent {
  return { stopPropagation: vi.fn() } as unknown as MouseEvent;
}

describe('TeamsComponent (team menu)', () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;
  let teamServiceMock: {
    getAll: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let uiMock: { showToast: ReturnType<typeof vi.fn> };

  const seed = [makeTeam({ id: 't1' }), makeTeam({ id: 't2', name: 'Rovers' })];

  beforeEach(async () => {
    teamServiceMock = {
      getAll: vi.fn().mockReturnValue(of(seed)),
      delete: vi.fn().mockReturnValue(of({ message: 'ok' })),
    };
    routerMock = { navigate: vi.fn() };
    uiMock = { showToast: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TeamsComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TeamService, useValue: teamServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: UiService, useValue: uiMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  describe('initial load', () => {
    it('loads teams on construction and clears the loading flag', () => {
      expect(teamServiceMock.getAll).toHaveBeenCalledWith('');
      expect(component.teams()).toEqual(seed);
      expect(component.isLoading()).toBe(false);
    });

    it('clears the loading flag when the request fails', () => {
      teamServiceMock.getAll.mockReturnValue(throwError(() => new Error('boom')));
      component.isLoading.set(true);
      component.loadTeams();
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('search', () => {
    it('reloads teams using the current query', () => {
      teamServiceMock.getAll.mockClear();
      component.searchQuery = 'rov';
      component.onSearch();
      expect(teamServiceMock.getAll).toHaveBeenCalledWith('rov');
    });
  });

  describe('create / edit modal wiring', () => {
    it('openCreateModal opens the modal in create mode with no team to edit', () => {
      component.teamToEdit.set(makeTeam());
      component.openCreateModal();
      expect(component.modalMode()).toBe('create');
      expect(component.teamToEdit()).toBeNull();
      expect(component.isModalOpen()).toBe(true);
    });

    it('openEditModal opens the modal in edit mode with the chosen team', () => {
      const team = makeTeam({ id: 't2' });
      const ev = mouseEvent();
      component.openMenuId.set('t2');

      component.openEditModal(ev, team);

      expect(ev.stopPropagation).toHaveBeenCalled();
      expect(component.openMenuId()).toBeNull();
      expect(component.modalMode()).toBe('edit');
      expect(component.teamToEdit()).toBe(team);
      expect(component.isModalOpen()).toBe(true);
    });

    it('closeModal hides the modal and clears the edit target', () => {
      component.teamToEdit.set(makeTeam());
      component.isModalOpen.set(true);
      component.closeModal();
      expect(component.isModalOpen()).toBe(false);
      expect(component.teamToEdit()).toBeNull();
    });

    it('onTeamCreated closes the modal and navigates to the new team', () => {
      component.isModalOpen.set(true);
      component.onTeamCreated('new-99');
      expect(component.isModalOpen()).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/teams', 'new-99']);
    });

    it('onTeamUpdated closes the modal, toasts success, and reloads', () => {
      teamServiceMock.getAll.mockClear();
      component.isModalOpen.set(true);
      component.onTeamUpdated();
      expect(component.isModalOpen()).toBe(false);
      expect(uiMock.showToast).toHaveBeenCalledWith('TEAMS.UPDATED', 'success');
      expect(teamServiceMock.getAll).toHaveBeenCalled();
    });
  });

  describe('navigation', () => {
    it('openTeamDashboard navigates to the team detail route', () => {
      component.openTeamDashboard('t1');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/teams', 't1']);
    });
  });

  describe('per-card action menu', () => {
    it('toggleMenu opens the menu for a card and stops propagation', () => {
      const ev = mouseEvent();
      component.toggleMenu(ev, 't1');
      expect(ev.stopPropagation).toHaveBeenCalled();
      expect(component.openMenuId()).toBe('t1');
    });

    it('toggleMenu closes the menu when the same card is toggled again', () => {
      component.openMenuId.set('t1');
      component.toggleMenu(mouseEvent(), 't1');
      expect(component.openMenuId()).toBeNull();
    });

    it('toggleMenu switches directly to another card', () => {
      component.openMenuId.set('t1');
      component.toggleMenu(mouseEvent(), 't2');
      expect(component.openMenuId()).toBe('t2');
    });

    it('closeMenu (document click) closes an open menu', () => {
      component.openMenuId.set('t1');
      component.closeMenu();
      expect(component.openMenuId()).toBeNull();
    });

    it('closeMenu is a no-op when no menu is open', () => {
      component.openMenuId.set(null);
      component.closeMenu();
      expect(component.openMenuId()).toBeNull();
    });
  });

  describe('delete flow', () => {
    it('confirmDelete arms the confirmation dialog and closes the menu', () => {
      const team = makeTeam({ id: 't2', name: 'Rovers' });
      const ev = mouseEvent();
      component.openMenuId.set('t2');

      component.confirmDelete(ev, team);

      expect(ev.stopPropagation).toHaveBeenCalled();
      expect(component.openMenuId()).toBeNull();
      expect(component.teamToDelete()).toBe(team);
      expect(component.isConfirmOpen()).toBe(true);
      // translate.instant returns the key when no translations are loaded
      expect(component.deleteMessage()).toBe('TEAMS.DELETE_MESSAGE');
    });

    it('cancelDelete closes the dialog and clears the target', () => {
      component.teamToDelete.set(makeTeam());
      component.isConfirmOpen.set(true);
      component.cancelDelete();
      expect(component.isConfirmOpen()).toBe(false);
      expect(component.teamToDelete()).toBeNull();
    });

    it('executeDelete removes the team, toasts success, and closes the dialog', () => {
      component.teams.set([...seed]);
      component.teamToDelete.set(seed[0]);
      component.isConfirmOpen.set(true);

      component.executeDelete();

      expect(teamServiceMock.delete).toHaveBeenCalledWith('t1');
      expect(component.teams().map(t => t.id)).toEqual(['t2']);
      expect(uiMock.showToast).toHaveBeenCalledWith('TEAMS.DELETED', 'success');
      expect(component.isConfirmOpen()).toBe(false);
      expect(component.teamToDelete()).toBeNull();
    });

    it('executeDelete shows an error toast and keeps the list on failure', () => {
      teamServiceMock.delete.mockReturnValue(throwError(() => new Error('nope')));
      component.teams.set([...seed]);
      component.teamToDelete.set(seed[0]);
      component.isConfirmOpen.set(true);

      component.executeDelete();

      expect(uiMock.showToast).toHaveBeenCalledWith('TEAMS.DELETE_FAILED', 'error');
      expect(component.teams().length).toBe(2);
      expect(component.isConfirmOpen()).toBe(false);
    });

    it('executeDelete is a no-op when no team is targeted', () => {
      component.teamToDelete.set(null);
      component.executeDelete();
      expect(teamServiceMock.delete).not.toHaveBeenCalled();
    });
  });

  describe('getImageUrl', () => {
    it('returns an empty string for a missing path', () => {
      expect(component.getImageUrl()).toBe('');
    });

    it('returns absolute URLs unchanged', () => {
      expect(component.getImageUrl('https://cdn/x.png')).toBe('https://cdn/x.png');
    });

    it('prefixes relative paths with the API base and a leading slash', () => {
      expect(component.getImageUrl('uploads/x.png')).toBe(`${API_URL}/uploads/x.png`);
      expect(component.getImageUrl('/uploads/x.png')).toBe(`${API_URL}/uploads/x.png`);
    });
  });
});
