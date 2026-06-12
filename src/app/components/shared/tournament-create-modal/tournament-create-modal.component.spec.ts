import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { TournamentCreateModalComponent } from './tournament-create-modal.component';
import { TournamentService } from '../../../tournament/tournament.service';

describe('TournamentCreateModalComponent', () => {
  let component: TournamentCreateModalComponent;
  let fixture: ComponentFixture<TournamentCreateModalComponent>;
  let serviceMock: { create: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    serviceMock = { create: vi.fn() };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TournamentCreateModalComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TournamentService, useValue: serviceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentCreateModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialises with sensible defaults', () => {
    expect(component.newTournament).toEqual({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'draft',
      maxTeams: 16,
      minTeams: 3,
      type: 'group',
    });
    expect(component.isCreating()).toBe(false);
  });

  describe('createTournament', () => {
    it('does nothing when the name is missing', () => {
      component.newTournament.name = '';
      component.newTournament.startDate = '2026-07-01';

      component.createTournament();

      expect(serviceMock.create).not.toHaveBeenCalled();
      expect(component.isCreating()).toBe(false);
    });

    it('does nothing when the start date is missing', () => {
      component.newTournament.name = 'Summer Cup';
      component.newTournament.startDate = '';

      component.createTournament();

      expect(serviceMock.create).not.toHaveBeenCalled();
      expect(component.isCreating()).toBe(false);
    });

    it('sends the mapped payload to the service', () => {
      serviceMock.create.mockReturnValue(of({ id: 'abc' }));
      component.newTournament.name = 'Summer Cup';
      component.newTournament.description = 'A friendly tournament';
      component.newTournament.startDate = '2026-07-01';
      component.newTournament.endDate = '2026-07-15';
      component.newTournament.maxTeams = 32;
      component.newTournament.minTeams = 4;
      component.newTournament.status = 'registration_open';
      component.newTournament.type = 'knockout';

      component.createTournament();

      expect(serviceMock.create).toHaveBeenCalledWith({
        name: 'Summer Cup',
        description: 'A friendly tournament',
        startDate: '2026-07-01',
        endDate: '2026-07-15',
        maxTeams: 32,
        minTeams: 4,
        status: 'registration_open',
        type: 'knockout',
      });
    });

    it('coerces maxTeams to a number', () => {
      serviceMock.create.mockReturnValue(of({ id: 'abc' }));
      component.newTournament.name = 'Summer Cup';
      component.newTournament.startDate = '2026-07-01';
      // ngModel on a <select> yields strings
      (component.newTournament as any).maxTeams = '24';

      component.createTournament();

      expect(serviceMock.create.mock.calls[0][0].maxTeams).toBe(24);
    });

    it('defaults endDate to startDate when end date is blank', () => {
      serviceMock.create.mockReturnValue(of({ id: 'abc' }));
      component.newTournament.name = 'Summer Cup';
      component.newTournament.startDate = '2026-07-01';
      component.newTournament.endDate = '';

      component.createTournament();

      expect(serviceMock.create.mock.calls[0][0].endDate).toBe('2026-07-01');
    });

    it('on success emits the created tournament, navigates, and resets', () => {
      const created = { id: '42', name: 'Summer Cup' };
      serviceMock.create.mockReturnValue(of(created));
      const successSpy = vi.fn();
      const closeSpy = vi.fn();
      component.onSuccess.subscribe(successSpy);
      component.onClose.subscribe(closeSpy);
      component.newTournament.name = 'Summer Cup';
      component.newTournament.startDate = '2026-07-01';

      component.createTournament();

      expect(successSpy).toHaveBeenCalledWith(created);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/tournaments', '42']);
      expect(closeSpy).toHaveBeenCalled();
      expect(component.isCreating()).toBe(false);
      // close() resets the form
      expect(component.newTournament.name).toBe('');
    });

    it('on error clears the creating state without navigating', () => {
      serviceMock.create.mockReturnValue(throwError(() => new Error('boom')));
      const successSpy = vi.fn();
      component.onSuccess.subscribe(successSpy);
      component.newTournament.name = 'Summer Cup';
      component.newTournament.startDate = '2026-07-01';

      component.createTournament();

      expect(component.isCreating()).toBe(false);
      expect(successSpy).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onFormatChange', () => {
    it('sets minTeams to 3 for group format', () => {
      component.newTournament.type = 'group';
      component.onFormatChange();
      expect(component.newTournament.minTeams).toBe(3);
    });

    it('sets minTeams to 4 for knockout and group_knockout formats', () => {
      component.newTournament.type = 'knockout';
      component.onFormatChange();
      expect(component.newTournament.minTeams).toBe(4);

      component.newTournament.type = 'group_knockout';
      component.onFormatChange();
      expect(component.newTournament.minTeams).toBe(4);
    });

    it('sets minTeams to 2 for any other format', () => {
      component.newTournament.type = 'custom';
      component.onFormatChange();
      expect(component.newTournament.minTeams).toBe(2);
    });
  });

  describe('close', () => {
    it('resets the form and emits onClose', () => {
      const closeSpy = vi.fn();
      component.onClose.subscribe(closeSpy);
      component.newTournament.name = 'Dirty';
      component.newTournament.minTeams = 8;

      component.close();

      expect(closeSpy).toHaveBeenCalled();
      expect(component.newTournament.name).toBe('');
      expect(component.newTournament.minTeams).toBe(3);
    });
  });
});
