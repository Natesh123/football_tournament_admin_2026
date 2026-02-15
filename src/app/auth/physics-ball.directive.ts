import { Directive, ElementRef, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';

@Directive({
    selector: '[appPhysicsBall]',
    standalone: true
})
export class PhysicsBallDirective implements OnInit, OnDestroy {
    private mouseX = -1000;
    private mouseY = -1000;

    // Physics state
    private posX = window.innerWidth / 2; // Start center (approx)
    private posY = window.innerHeight / 2;
    private velX = 0;
    private velY = 0;

    // Constants
    private readonly FRICTION = 0.95;
    private readonly REPULSION_RADIUS = 150; // slightly larger for better feel
    private readonly FORCE_FACTOR = 0.5;
    private readonly MAX_SPEED = 15;

    private animationId: number | null = null;
    private isRunning = false;

    constructor(private el: ElementRef, private ngZone: NgZone) { }

    ngOnInit() {
        // Set initial random velocity for some life
        this.velX = (Math.random() - 0.5) * 2;
        this.velY = (Math.random() - 0.5) * 2;

        // Position correctly initially (center of screen)
        this.posX = window.innerWidth / 2;
        this.posY = window.innerHeight / 2;

        this.startSimulation();
    }

    ngOnDestroy() {
        this.stopSimulation();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e: MouseEvent) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    private startSimulation() {
        this.isRunning = true;
        this.ngZone.runOutsideAngular(() => {
            const loop = () => {
                if (!this.isRunning) return;
                this.updatePhysics();
                this.render();
                this.animationId = requestAnimationFrame(loop);
            };
            loop();
        });
    }

    private stopSimulation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    private updatePhysics() {
        // 1. Calculate distance from mouse
        const dx = this.posX - this.mouseX;
        const dy = this.posY - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 2. Repulsion Force
        if (distance < this.REPULSION_RADIUS) {
            // Calculate normalized vector
            const angle = Math.atan2(dy, dx);
            // Force increases as we get closer (linear falloff)
            const force = (this.REPULSION_RADIUS - distance) / this.REPULSION_RADIUS;

            // Apply force to velocity (push away)
            this.velX += Math.cos(angle) * force * this.FORCE_FACTOR * 5; // Multiplier for punchiness
            this.velY += Math.sin(angle) * force * this.FORCE_FACTOR * 5;
        }

        // 3. Apply Friction (air resistance)
        this.velX *= this.FRICTION;
        this.velY *= this.FRICTION;

        // Cap velocity
        /*if (Math.abs(this.velX) > this.MAX_SPEED) this.velX = Math.sign(this.velX) * this.MAX_SPEED;
        if (Math.abs(this.velY) > this.MAX_SPEED) this.velY = Math.sign(this.velY) * this.MAX_SPEED;*/

        // Stop completely if very slow
        if (Math.abs(this.velX) < 0.01) this.velX = 0;
        if (Math.abs(this.velY) < 0.01) this.velY = 0;

        // 4. Update Position
        this.posX += this.velX;
        this.posY += this.velY;

        // 5. Boundary Detection (Bounce)
        const bounds = this.el.nativeElement.getBoundingClientRect();
        const radius = bounds.width / 2; // Assuming circle/square

        // X Boundaries
        if (this.posX - radius < 0) {
            this.posX = radius;
            this.velX *= -1;
        } else if (this.posX + radius > window.innerWidth) {
            this.posX = window.innerWidth - radius;
            this.velX *= -1;
        }

        // Y Boundaries
        if (this.posY - radius < 0) {
            this.posY = radius;
            this.velY *= -1;
        } else if (this.posY + radius > window.innerHeight) {
            this.posY = window.innerHeight - radius;
            this.velY *= -1;
        }
    }

    private render() {
        // Center the element on the tracked position
        // We assume the element structure needs 'left: 0; top: 0' and using transform for positioning
        const x = this.posX - (this.el.nativeElement.offsetWidth / 2);
        const y = this.posY - (this.el.nativeElement.offsetHeight / 2);

        this.el.nativeElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
}
