import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { CreateTeamModalComponent } from './create-team-modal.component';
import { TeamService } from '../../team.service';

describe('CreateTeamModalComponent (team creation / edit)', () => {
  let component: CreateTeamModalComponent;
  let fixture: ComponentFixture<CreateTeamModalComponent>;
  let serviceMock: {
    createWithFormData: ReturnType<typeof vi.fn>;
    updateWithFormData: ReturnType<typeof vi.fn>;
    fullUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    serviceMock = {
      createWithFormData: vi.fn().mockReturnValue(of({ id: 'created-1' })),
      updateWithFormData: vi.fn().mockReturnValue(of({ id: 'edit-1' })),
      fullUrl: vi.fn((p: string) => `BASE${p}`),
    };

    await TestBed.configureTestingModule({
      imports: [CreateTeamModalComponent],
      providers: [{ provide: TeamService, useValue: serviceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTeamModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  /** Helper to drive ngOnChanges for the isOpen input. */
  function openModal(previous = false) {
    component.isOpen = true;
    component.ngOnChanges({
      isOpen: new SimpleChange(previous, true, previous === false),
    });
  }

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('starts with an empty form and create defaults', () => {
    expect(component.mode).toBe('create');
    expect(component.team).toEqual(component.emptyForm());
    expect(component.isSubmitting()).toBe(false);
    expect(component.logoPreview()).toBeNull();
  });

  describe('opening in edit mode', () => {
    it('populates the form from teamToEdit', () => {
      component.mode = 'edit';
      component.teamToEdit = {
        id: 'x',
        name: 'Rovers',
        shortName: 'ROV',
        teamType: 'Club',
        city: 'Leeds',
        foundedYear: 2001,
        logoUrl: '/uploads/logo.png',
      };

      openModal();

      expect(component.team.name).toBe('Rovers');
      expect(component.team.shortName).toBe('ROV');
      expect(component.team.city).toBe('Leeds');
      expect(component.team.foundedYear).toBe(2001);
      expect(component.logoPreview()).toBe('BASE/uploads/logo.png');
      expect(serviceMock.fullUrl).toHaveBeenCalledWith('/uploads/logo.png');
    });

    it('clears the logo preview when the team has no logo', () => {
      component.mode = 'edit';
      component.teamToEdit = { id: 'x', name: 'No Logo' };
      openModal();
      expect(component.logoPreview()).toBeNull();
    });
  });

  describe('opening in create mode', () => {
    it('resets a previously dirty form', () => {
      component.team.name = 'leftover';
      component.logoPreview.set('data:...');
      component.mode = 'create';
      openModal();
      expect(component.team).toEqual(component.emptyForm());
      expect(component.logoPreview()).toBeNull();
    });
  });

  describe('logo handling', () => {
    it('removeLogo clears the preview, file, and url', () => {
      component.logoPreview.set('data:...');
      (component as any).selectedLogoFile = new File(['x'], 'a.png');
      component.team.logoUrl = '/uploads/a.png';

      component.removeLogo();

      expect(component.logoPreview()).toBeNull();
      expect((component as any).selectedLogoFile).toBeNull();
      expect(component.team.logoUrl).toBe('');
    });
  });

  describe('submit', () => {
    function fieldsOf(fd: FormData) {
      const out: Record<string, any> = {};
      fd.forEach((v, k) => (out[k] = v));
      return out;
    }

    it('does nothing without a name', () => {
      component.team.name = '';
      component.submit();
      expect(serviceMock.createWithFormData).not.toHaveBeenCalled();
      expect(serviceMock.updateWithFormData).not.toHaveBeenCalled();
    });

    it('create: posts non-empty fields, omits logoUrl, emits id, and resets', () => {
      const createdSpy = vi.fn();
      component.teamCreated.subscribe(createdSpy);
      component.mode = 'create';
      component.team.name = 'Manchester FC';
      component.team.shortName = 'MFC';
      component.team.city = ''; // empty -> skipped
      component.team.foundedYear = 2005;

      component.submit();

      expect(serviceMock.createWithFormData).toHaveBeenCalledTimes(1);
      const fd = serviceMock.createWithFormData.mock.calls[0][0] as FormData;
      const fields = fieldsOf(fd);
      expect(fields['name']).toBe('Manchester FC');
      expect(fields['shortName']).toBe('MFC');
      expect(fields['foundedYear']).toBe('2005');
      expect('city' in fields).toBe(false);
      expect('logoUrl' in fields).toBe(false);

      expect(createdSpy).toHaveBeenCalledWith('created-1');
      expect(component.isSubmitting()).toBe(false);
      expect(component.team.name).toBe('');
    });

    it('create: appends the selected logo file', () => {
      component.mode = 'create';
      component.team.name = 'With Logo';
      (component as any).selectedLogoFile = new File(['x'], 'logo.png', { type: 'image/png' });

      component.submit();

      const fd = serviceMock.createWithFormData.mock.calls[0][0] as FormData;
      const logo = fd.get('logo') as File;
      expect(logo).toBeInstanceOf(File);
      expect(logo.name).toBe('logo.png');
    });

    it('edit: calls updateWithFormData with the id and emits teamUpdated', () => {
      const updatedSpy = vi.fn();
      const closeSpy = vi.fn();
      component.teamUpdated.subscribe(updatedSpy);
      component.closeModal.subscribe(closeSpy);
      component.mode = 'edit';
      component.teamToEdit = { id: 'team-42' };
      component.team.name = 'Edited Name';

      component.submit();

      expect(serviceMock.updateWithFormData).toHaveBeenCalledWith('team-42', expect.any(FormData));
      expect(updatedSpy).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalled();
      expect(component.isSubmitting()).toBe(false);
    });

    it('clears the submitting flag when create fails', () => {
      serviceMock.createWithFormData.mockReturnValue(throwError(() => new Error('boom')));
      const createdSpy = vi.fn();
      component.teamCreated.subscribe(createdSpy);
      component.mode = 'create';
      component.team.name = 'Fails';

      component.submit();

      expect(component.isSubmitting()).toBe(false);
      expect(createdSpy).not.toHaveBeenCalled();
    });

    it('clears the submitting flag when update fails', () => {
      serviceMock.updateWithFormData.mockReturnValue(throwError(() => new Error('boom')));
      component.mode = 'edit';
      component.teamToEdit = { id: 'team-42' };
      component.team.name = 'Fails';

      component.submit();

      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('close', () => {
    it('emits closeModal and resets the form', () => {
      const closeSpy = vi.fn();
      component.closeModal.subscribe(closeSpy);
      component.team.name = 'dirty';
      component.logoPreview.set('data:...');

      component.close();

      expect(closeSpy).toHaveBeenCalled();
      expect(component.team).toEqual(component.emptyForm());
      expect(component.logoPreview()).toBeNull();
    });
  });
});
