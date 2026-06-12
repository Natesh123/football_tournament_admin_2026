import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, inject, signal, computed, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { API_URL } from '../../../../core/config/app.config';
import { EpIconComponent } from '../ep-icon.component';

/*
  ELITE PITCH — landing page recreated from the Claude Design handoff bundle.
  Deep warm black + metallic gold, faint pitch-green glow.
  Display: Oswald (condensed, uppercase). Body: Manrope.
  Reveal-on-scroll via IntersectionObserver (content stays visible if JS fails);
  GSAP drives the on-load hero entrance plus scrub-linked parallax
  (transform-only, desktop + no-reduced-motion only — see initParallax).
*/

interface Team { name: string; score: number | string; win?: boolean; grad: string; }

@Component({
  selector: 'app-premium-landing',
  standalone: true,
  imports: [FormsModule, EpIconComponent],
  host: { '[class.io-ready]': 'ioReady()' },
  template: `
    <!-- page background: warm vignette + faint pitch lines -->
    <div class="bg-vignette"></div>
    <div class="bg-lines"></div>

    <!-- ===================== NAV ===================== -->
    <nav class="nav" [class.scrolled]="navScrolled()">
      <div class="nav-inner">
        <a href="#" class="brand">
          <img class="brand-logo" src="images/logo-gold.png" alt="ATB Sports" />
          <span class="name">ATB Sports<small>Admin Hub</small></span>
        </a>
        <div class="nav-links">
          @for (l of navLinks(); track l.href) {
            <a [href]="l.href">{{ l.label }}</a>
          }
        </div>
        <div class="lang-switch" role="group" aria-label="Language">
          @for (l of langs; track l.id) {
            <button type="button" [class.on]="lang() === l.id" (click)="setLang(l.id)">{{ l.label }}</button>
          }
        </div>
        <a href="/login" class="btn btn-gold nav-cta"><ep-icon name="log-in"></ep-icon> {{ t().login }}</a>
        <button class="nav-burger" aria-label="Menu"><ep-icon name="menu"></ep-icon></button>
      </div>
    </nav>

    <!-- ===================== HERO ===================== -->
    <header class="hero">
      <div class="hero-pitch"></div>
      <div class="hero-ball"><img src="assets/images/landing-ball.webp" alt="Gold football" /></div>
      <div class="hero-whistle"><img src="assets/images/landing-whistle.webp" alt="Gold referee whistle" /></div>
      <div class="hero-inner">
        <h1 [class.lang-de]="lang() === 'de'">{{ t().heroTitle1 }}<br /><span class="gold-text">{{ t().heroTitle2 }}</span></h1>
        <p class="hero-sub">{{ t().heroSub }}</p>
        <div class="hero-cta">
          <a href="/login" class="btn btn-gold">{{ t().signIn }}</a>
        </div>
      </div>
    </header>

    <!-- ===================== FEATURES ===================== -->
    <section id="features">
      <div class="wrap">
        <div class="section-head reveal">
          <span class="eyebrow">{{ t().featEyebrow }}</span>
          <h2>{{ t().featH2 }}</h2>
          <p>{{ t().featP }}</p>
        </div>
        <div class="feat-grid">
          @for (f of features; track f.title) {
            <div class="feat-card reveal">
              <div class="feat-ico"><ep-icon [name]="f.icon"></ep-icon></div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
              <span class="more">Learn more <ep-icon name="arrow-right"></ep-icon></span>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== DASHBOARD + BRACKET share the pitch backdrop ===== -->
    <div class="pitch-band">
    <div class="pitch-band-bg" aria-hidden="true"></div>
    <!-- ===================== DASHBOARD ===================== -->
    <section id="dashboard">
      <div class="wrap">
        <div class="section-head reveal">
          <span class="eyebrow">{{ t().dashEyebrow }}</span>
          <h2>{{ t().dashH2 }}</h2>
          <p>{{ t().dashP }}</p>
        </div>
        <div class="dash-shell reveal">
          <div class="dash">
            <div class="dash-top">
              <div class="dash-dots"><span></span><span></span><span></span></div>
              <div class="dash-title"><b>ATB Sports</b> &nbsp;·&nbsp; Admin Control Panel</div>
            </div>
            <div class="dash-body">
              <aside class="dash-side">
                <div class="brand-sm"><img class="brand-logo sm" src="images/logo-gold.png" alt="ATB Sports" /> ATB Sports</div>
                <nav class="dnav">
                  @for (n of dashNav; track n.label) {
                    <a [class.active]="n.active"><ep-icon [name]="n.icon"></ep-icon> {{ n.label }}</a>
                  }
                </nav>
              </aside>
              <div class="dash-main">
                <div class="dh">
                  <h4>Season Overview</h4>
                  <span class="pill">2025–26 · Active</span>
                </div>
                <div class="metrics">
                  @for (m of metrics; track m.k) {
                    <div class="metric"><div class="k">{{ m.k }}</div><div class="v">{{ m.v }}</div><div class="d" [class.dn]="m.down">{{ m.d }}</div></div>
                  }
                </div>
                <div class="dash-tables">
                  <div class="dbox">
                    <div class="bh"><span>Recent Results</span><span>FT</span></div>
                    @for (r of recentResults; track r.av) {
                      <div class="drow"><span class="av" [style.background]="r.grad">{{ r.av }}</span><span class="nm">{{ r.home }} <span class="sub">vs {{ r.away }}</span></span><span class="sc">{{ r.score }}</span></div>
                    }
                  </div>
                  <div class="dbox">
                    <div class="bh"><span>Top Scorers</span><span>Goals</span></div>
                    @for (s of topScorers; track s.name) {
                      <div class="bar-row"><span class="bl">{{ s.name }}</span><span class="bar"><i [style.width.%]="s.pct"></i></span><span class="bv">{{ s.goals }}</span></div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== BRACKET ===================== -->
    <section id="bracket">
      <div class="wrap">
        <div class="section-head reveal">
          <span class="eyebrow">{{ t().brackEyebrow }}</span>
          <h2>{{ t().brackH2 }}</h2>
          <p>{{ t().brackP }}</p>
        </div>
        <div class="bracket-wrap reveal">
          <div class="bracket">
            @for (round of bracket; track round.label) {
              <div class="round">
                <div class="round-label">{{ round.label }}</div>
                <div class="matches">
                  @for (match of round.matches; track $index) {
                    <div class="match">
                      <div class="match-card">
                        @for (t of match; track $index) {
                          <div class="team-row" [class.win]="t.win">
                            <span class="badge" [style.background]="t.grad"><ep-icon name="shield"></ep-icon></span>
                            <span class="tn">{{ t.name }}</span>
                            <span class="ts">{{ t.score }}</span>
                            @if (t.win) { <ep-icon class="adv" name="check"></ep-icon> }
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
            <div class="round champ-col">
              <div class="round-label">Champion</div>
              <div class="matches">
                <div class="match">
                  <div class="champ">
                    <div class="cup"><ep-icon name="trophy"></ep-icon></div>
                    <div class="ct">Champions</div>
                    <div class="cn gold-text">Falcons United</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>

    <!-- ===================== PRICING ===================== -->
    <section id="pricing">
      <div class="wrap">
        <div class="section-head reveal">
          <span class="eyebrow">{{ t().priceEyebrow }}</span>
          <h2>{{ t().priceH2 }}</h2>
          <p>{{ t().priceP }}</p>
        </div>
        <div class="price-grid">
          @for (p of pricing; track p.tier) {
            <div class="price-card reveal" [class.featured]="p.featured">
              <div class="tier">{{ p.tier }}</div>
              <div class="desc">{{ p.desc }}</div>
              <div class="amt">{{ p.amt }}@if (p.per) {<small> {{ p.per }}</small>}</div>
              <div class="per">{{ p.note }}</div>
              <ul class="price-feats">
                @for (feat of p.feats; track feat.label) {
                  <li [class.off]="feat.off"><ep-icon [name]="feat.off ? 'minus' : 'check'"></ep-icon> {{ feat.label }}</li>
                }
              </ul>
              <a href="/register" class="btn" [class.btn-gold]="p.featured" [class.btn-ghost]="!p.featured">{{ p.cta }}</a>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===================== FIXTURES ===================== -->
    <section id="fixtures">
      <div class="wrap">
        <div class="section-head reveal">
          <span class="eyebrow">{{ t().fixEyebrow }}</span>
          <h2>{{ t().fixH2 }}</h2>
          <p>{{ t().fixP }}</p>
        </div>
        <div class="fixtures reveal">
          <div class="fix-card">
            <div class="fix-head">
              <h3>Today's Matches</h3>
              <span class="live"><span class="dot"></span> Live Now</span>
            </div>
            <div class="fix-colhead"><span>Match</span><span>Venue</span><span>Kickoff</span><span></span></div>
            @for (fx of fixtures; track $index) {
              <div class="fix-row">
                <div class="matchup">
                  <span class="badge" [style.background]="fx.home.grad"><ep-icon name="shield"></ep-icon></span>
                  <span class="tt">{{ fx.home.name }}</span>
                  <span class="vs">vs</span>
                  <span class="badge" [style.background]="fx.away.grad"><ep-icon name="shield"></ep-icon></span>
                  <span class="tt">{{ fx.away.name }}</span>
                </div>
                <div class="venue">{{ fx.venue }}</div>
                <div class="time">{{ fx.time }}<small>{{ fx.day }}</small></div>
                <a href="#" class="watch"><ep-icon name="play"></ep-icon> Watch Live</a>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== TESTIMONIALS ===================== -->
    <section id="testimonials">
      <div class="wrap">
        <div class="section-head reveal">
          <span class="eyebrow">{{ t().testiEyebrow }}</span>
          <h2>{{ t().testiH2 }}</h2>
          <p>{{ t().testiP }}</p>
        </div>
        <div class="testi-grid" (mouseenter)="pauseTesti()" (mouseleave)="resumeTesti()">
          @for (t of testimonials; track t.name; let i = $index) {
            <article class="testi-card reveal" [class.active]="i === testiIdx()">
              <span class="qmark">&ldquo;</span>
              <p class="testi-quote">{{ t.text }}</p>
              <div class="testi-name">— {{ t.name }}</div>
              <span class="avatar" [style.background]="t.grad">{{ t.initials }}</span>
            </article>
          }
        </div>
        <div class="testi-dots">
          @for (t of testimonials; track t.name; let i = $index) {
            <button class="dot" [class.on]="i === testiIdx()" (click)="selectTesti(i)" [attr.aria-label]="'Show testimonial ' + (i + 1)"></button>
          }
        </div>
      </div>
    </section>

    <!-- ===================== CTA BANNER ===================== -->
    <section class="cta-band">
      <div class="cta-inner reveal">
        <div class="cta-player">
          <div class="cta-player-art"></div>
        </div>
        <div class="wrap cta-wrap">
          <div class="cta-copy">
            <span class="eyebrow">{{ t().ctaEyebrow }}</span>
            <h2 style="margin-top:16px">{{ t().ctaH2 }}</h2>
            <p>{{ t().ctaP }}</p>
            <a href="/register" class="btn btn-gold">{{ t().ctaBtn }} <ep-icon name="arrow-right"></ep-icon></a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== FOOTER ===================== -->
    <footer class="footer">
      <div class="wrap">
        <div class="foot-grid">
          <div class="foot-brand">
            <a href="#" class="brand">
              <img class="brand-logo" src="images/logo-gold.png" alt="ATB Sports" />
              <span class="name">ATB Sports<small>Admin Hub</small></span>
            </a>
            <p>The ultimate platform for running football tournaments, leagues and federations — from kickoff to final whistle.</p>
            <div class="socials">
              @for (s of socials; track s.icon) {
                <a href="#" [attr.aria-label]="s.label"><ep-icon [name]="s.icon"></ep-icon></a>
              }
            </div>
          </div>
          @for (col of footerCols; track col.title) {
            <div class="foot-col">
              <h5>{{ col.title }}</h5>
              @for (l of col.links; track l.label) {
                <a [href]="l.href">{{ l.label }}</a>
              }
            </div>
          }
          <div class="news">
            <h5>Newsletter</h5>
            <p>Match-day tips, product news and tournament insights — straight to your inbox.</p>
            <form (ngSubmit)="onSubmit()">
              <input type="email" [(ngModel)]="contactForm.email" name="email" placeholder="Your email address" />
              <button class="btn btn-gold" type="submit" [disabled]="contactSubmitting()">
                {{ contactSubmitting() ? '...' : (contactSuccess() ? 'Done' : 'Join') }}
              </button>
            </form>
          </div>
        </div>
        <div class="foot-bottom">
          <span>© 2026 ATB Sports. All rights reserved.</span>
          <div class="links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
            <a href="#">Status</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host{
      --bg:#0a0807; --bg-2:#0d0a08;
      --panel:#15110c; --panel-2:#1c170f; --panel-3:#241d12;
      --line:rgba(201,164,92,.16); --line-2:rgba(201,164,92,.30); --line-3:rgba(201,164,92,.50);
      --gold:#d4af5a; --gold-bright:#f4e2a3; --gold-deep:#9a7530;
      --gold-grad:linear-gradient(135deg,#f7eab2 0%,#dcb863 32%,#a9802f 58%,#f1da90 100%);
      --gold-grad-v:linear-gradient(180deg,#f7eab2 0%,#dcb863 45%,#a9802f 100%);
      --text:#f4ede0; --muted:#9d9583; --muted-2:#766f60;
      --green:#1f3a28; --radius:16px; --radius-lg:22px;
      --shadow:0 24px 60px -20px rgba(0,0,0,.8);
      --shadow-gold:0 18px 50px -18px rgba(180,140,60,.45);
      --maxw:1240px;

      display:block; position:relative;
      background:var(--bg); color:var(--text);
      font-family:'Manrope',system-ui,sans-serif; font-size:16px; line-height:1.6;
      -webkit-font-smoothing:antialiased; overflow-x:hidden;
    }
    *{box-sizing:border-box}
    img{display:block;max-width:100%}
    a{color:inherit;text-decoration:none}
    button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}

    .bg-vignette{
      position:fixed;inset:0;z-index:0;pointer-events:none;
      background:
        radial-gradient(1200px 700px at 50% -8%, rgba(120,92,40,.22), transparent 60%),
        radial-gradient(900px 600px at 88% 12%, rgba(90,70,30,.14), transparent 55%);
    }
    .bg-lines{
      position:fixed;inset:0;z-index:0;opacity:.5;pointer-events:none;
      background:repeating-linear-gradient(90deg, transparent 0 119px, rgba(201,164,92,.025) 119px 120px);
      -webkit-mask:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent);
      mask:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent);
    }

    /* ---------- shared utilities ---------- */
    .wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px}
    .eyebrow{
      font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;
      letter-spacing:.42em;font-size:13px;color:var(--gold);
      display:inline-flex;align-items:center;gap:14px;
    }
    .eyebrow::before{content:"";width:34px;height:2px;background:var(--gold-grad);display:inline-block}
    .section-head{text-align:center;margin-bottom:54px}
    .section-head .eyebrow::before{display:none}
    .section-head h2{
      font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;
      font-size:clamp(30px,4vw,52px);letter-spacing:.04em;line-height:1.04;margin-top:14px;
    }
    .section-head p{color:var(--muted);max-width:560px;margin:16px auto 0;font-size:16px}
    .gold-text{
      background:var(--gold-grad);-webkit-background-clip:text;background-clip:text;
      -webkit-text-fill-color:transparent;color:transparent;
    }
    section{position:relative;z-index:1;padding:64px 0}
    /* anchored sections stop below the fixed nav when smooth-scrolled to */
    section[id]{scroll-margin-top:84px}

    /* glossy gold pill button */
    .btn{
      position:relative;overflow:hidden;
      font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.12em;
      font-size:14px;display:inline-flex;align-items:center;justify-content:center;gap:10px;
      padding:16px 36px;border-radius:999px;
      transition:transform .25s ease,box-shadow .3s ease,filter .25s ease;
    }
    .btn ep-icon{width:17px;height:17px;position:relative;z-index:1}
    /* shine sweep on hover */
    .btn::before{
      content:"";position:absolute;top:0;bottom:0;left:-65%;width:45%;pointer-events:none;
      background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);
      transform:skewX(-18deg);transition:left .65s cubic-bezier(.22,.61,.36,1);
    }
    .btn:hover::before{left:135%}
    .btn-gold{
      background:linear-gradient(180deg,rgba(255,255,255,.4),rgba(255,255,255,.04) 46%,transparent 60%),var(--gold-grad);
      color:#241803;
      box-shadow:
        0 12px 30px -8px rgba(200,160,80,.6),
        inset 0 1px 0 rgba(255,255,255,.7),
        inset 0 -3px 7px rgba(120,80,20,.28);
    }
    .btn-gold:hover{
      transform:translateY(-2px);filter:brightness(1.05) saturate(1.04);
      box-shadow:
        0 20px 46px -10px rgba(224,184,92,.8),
        0 0 0 1px rgba(244,226,163,.45),
        inset 0 1px 0 rgba(255,255,255,.85),
        inset 0 -3px 7px rgba(120,80,20,.3);
    }
    .btn-ghost{
      background:rgba(255,255,255,.03);color:var(--text);
      border:1px solid var(--line-2);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
    }
    .btn-ghost:hover{
      border-color:var(--line-3);background:rgba(201,164,92,.08);transform:translateY(-2px);
      box-shadow:0 12px 30px -12px rgba(201,164,92,.4),inset 0 1px 0 rgba(255,255,255,.08);
    }

    /* ============================================================ NAV */
    .nav{
      position:fixed;top:0;left:0;right:0;z-index:60;
      transition:background .35s ease,border-color .35s ease,backdrop-filter .35s ease;
      border-bottom:1px solid transparent;
    }
    .nav.scrolled{
      background:rgba(10,8,7,.82);backdrop-filter:blur(14px);
      border-bottom:1px solid var(--line);
    }
    .nav-inner{max-width:var(--maxw);margin:0 auto;padding:18px 28px;display:flex;align-items:center;gap:40px}
    .brand{display:flex;align-items:center;gap:12px;font-family:'Oswald',sans-serif}
    .brand .mark{
      width:38px;height:38px;border-radius:10px;background:var(--gold-grad);
      display:grid;place-items:center;color:#241803;font-weight:700;font-size:20px;
      box-shadow:var(--shadow-gold),inset 0 1px 0 rgba(255,255,255,.5);
    }
    .brand .name{font-weight:700;text-transform:uppercase;letter-spacing:.22em;font-size:17px}
    .brand .name small{display:block;font-size:9px;letter-spacing:.34em;color:var(--gold);font-weight:500;margin-top:1px}
    .brand-logo{width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0;box-shadow:var(--shadow-gold),0 0 0 1px var(--line-2)}
    .brand-logo.sm{width:28px;height:28px}
    .nav-links{display:flex;gap:34px;margin-left:auto}
    .nav-links a{
      font-family:'Oswald',sans-serif;font-weight:500;text-transform:uppercase;
      letter-spacing:.14em;font-size:13px;color:var(--muted);transition:color .2s;position:relative;
    }
    .nav-links a::after{content:"";position:absolute;left:0;bottom:-6px;width:0;height:2px;background:var(--gold-grad);transition:width .25s}
    .nav-links a:hover{color:var(--text)}
    .nav-links a:hover::after{width:100%}
    .nav-cta{padding:11px 22px;font-size:13px}
    .lang-switch{display:inline-flex;align-items:center;gap:2px;padding:3px;border:1px solid var(--line-2);border-radius:999px;background:rgba(255,255,255,.02)}
    .lang-switch button{
      font-family:'Oswald',sans-serif;font-weight:600;letter-spacing:.1em;font-size:12px;
      color:var(--muted);padding:6px 13px;border-radius:999px;transition:.2s;line-height:1;
    }
    .lang-switch button:hover{color:var(--text)}
    .lang-switch button.on{background:var(--gold-grad);color:#241803;box-shadow:inset 0 1px 0 rgba(255,255,255,.5)}
    .nav-burger{display:none;width:42px;height:42px;border-radius:10px;border:1px solid var(--line-2);place-items:center}

    /* ============================================================ HERO */
    .hero{position:relative;z-index:1;padding:150px 0 120px;overflow:hidden;min-height:90vh;display:flex;align-items:center}
    .hero-pitch{
      position:absolute;inset:0;z-index:0;
      background:
        radial-gradient(680px 560px at 64% 42%, rgba(214,168,78,.26), transparent 60%),
        linear-gradient(180deg,rgba(8,7,6,.6),transparent 22%,transparent 78%,#080605),
        url('/assets/images/landing-hero.webp') center/cover no-repeat,
        #080605;
    }
    .hero-pitch::before{
      content:"";position:absolute;inset:0;opacity:.45;
      background:
        conic-gradient(from 200deg at 28% 8%, transparent 0deg, rgba(230,190,100,.10) 12deg, transparent 26deg),
        conic-gradient(from 150deg at 74% 6%, transparent 0deg, rgba(230,190,100,.08) 10deg, transparent 22deg);
      -webkit-mask:linear-gradient(180deg,#000,transparent 70%);
      mask:linear-gradient(180deg,#000,transparent 70%);
    }
    /* centered copy, flanked by floating props */
    .hero-inner{position:relative;z-index:2;max-width:780px;margin:0 auto;text-align:center;padding:0 28px}
    .hero h1{
      font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;
      font-size:clamp(38px,6.2vw,84px);line-height:1.03;letter-spacing:.01em;margin:0;
    }
    /* German: "Turniermanagement" is one unbreakable word — at the 84px cap it
       overflows .hero-inner, and overflowing glyphs of a background-clip:text
       span paint transparent (no gradient behind them), hiding the last letters. */
    .hero h1.lang-de{font-size:clamp(34px,5.4vw,70px)}
    .hero h1 .gold-text{display:block}
    .hero-sub{color:var(--muted);font-size:clamp(16px,1.5vw,19px);line-height:1.6;margin:24px auto 34px;max-width:540px}
    .hero-cta{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}

    .hero-ball,.hero-whistle{position:absolute;top:0;bottom:0;display:flex;align-items:center;z-index:1;pointer-events:none}
    .hero-ball{left:0;width:min(34vw,420px);justify-content:flex-start}
    .hero-whistle{right:0;width:min(26vw,330px);justify-content:flex-end}
    .hero-ball img{
      width:100%;height:auto;display:block;margin-left:-7%;
      filter:drop-shadow(0 44px 54px rgba(0,0,0,.65)) drop-shadow(0 0 60px rgba(214,168,78,.32));
      animation:floaty 7s ease-in-out infinite;
    }
    .hero-whistle img{
      width:100%;height:auto;display:block;margin-right:-8%;transform:rotate(25deg);transform-origin:center;
      filter:drop-shadow(0 28px 38px rgba(0,0,0,.6)) drop-shadow(0 0 36px rgba(214,168,78,.26));
      animation:floaty2 7.5s ease-in-out infinite 1s;
    }
    @keyframes floaty2{0%,100%{transform:rotate(25deg) translateY(0)}50%{transform:rotate(25deg) translateY(-14px)}}
    @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
    @media(prefers-reduced-motion:reduce){.hero-ball img,.hero-whistle img{animation:none}}

    /* ============================================================ FEATURES */
    .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:8px}
    .feat-card{
      padding:38px 32px 34px;border-radius:var(--radius-lg);position:relative;overflow:hidden;
      background:linear-gradient(180deg,var(--panel-2),var(--panel));
      border:1px solid var(--line);transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease;
    }
    .feat-card::before{content:"";position:absolute;left:0;top:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(244,226,163,.5),transparent);opacity:0;transition:opacity .3s}
    .feat-card:hover{transform:translateY(-7px);border-color:var(--line-2);box-shadow:var(--shadow),var(--shadow-gold)}
    .feat-card:hover::before{opacity:1}
    .feat-ico{
      width:66px;height:66px;border-radius:16px;display:grid;place-items:center;margin-bottom:24px;
      background:radial-gradient(circle at 35% 25%, rgba(244,226,163,.22), rgba(154,117,48,.08));
      border:1px solid var(--line-2);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
    }
    .feat-ico ep-icon{width:30px;height:30px;color:var(--gold-bright)}
    .feat-card h3{font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:21px;margin-bottom:11px}
    .feat-card p{color:var(--muted);font-size:15px}
    .feat-card .more{display:inline-flex;align-items:center;gap:8px;margin-top:20px;color:var(--gold);font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.12em;font-size:12px}
    .feat-card .more ep-icon{width:15px;height:15px;transition:transform .25s}
    .feat-card:hover .more ep-icon{transform:translateX(4px)}

    /* ===== pitch backdrop shared by Dashboard + Bracket ===== */
    .pitch-band{position:relative;z-index:1;overflow:hidden}
    .pitch-band > section{padding-top:88px;padding-bottom:88px}
    .pitch-band-bg{
      position:absolute;inset:0;z-index:-1;pointer-events:none;
      background:
        radial-gradient(900px 520px at 50% 0%, rgba(214,168,78,.22), transparent 62%),
        linear-gradient(180deg, rgba(8,7,6,.82), rgba(8,7,6,.62) 38%, rgba(8,7,6,.62) 62%, rgba(8,7,6,.86)),
        url('/assets/images/landing-hero.webp') center/cover no-repeat;
    }
    .pitch-band::after{
      content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--line-2);
    }

    /* ============================================================ DASHBOARD */
    .dash-shell{margin-top:10px}
    .dash{
      border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line-2);
      background:linear-gradient(180deg,#16120c,#100d09);box-shadow:var(--shadow),0 0 80px -30px rgba(180,140,60,.4);
    }
    .dash-top{display:flex;align-items:center;gap:14px;padding:14px 20px;border-bottom:1px solid var(--line);background:rgba(0,0,0,.25)}
    .dash-dots{display:flex;gap:7px}
    .dash-dots span{width:11px;height:11px;border-radius:50%;background:#2a241a;border:1px solid var(--line)}
    .dash-dots span:first-child{background:var(--gold);border-color:transparent}
    .dash-title{font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.18em;font-size:12px;color:var(--muted)}
    .dash-title b{color:var(--text);font-weight:600}
    .dash-body{display:grid;grid-template-columns:208px 1fr;min-height:430px}
    .dash-side{border-right:1px solid var(--line);padding:18px 14px;background:rgba(0,0,0,.18)}
    .dash-side .brand-sm{display:flex;align-items:center;gap:9px;padding:6px 10px 16px;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.16em;font-size:13px}
    .dash-side .brand-sm .mark{width:26px;height:26px;font-size:14px;border-radius:7px;background:var(--gold-grad);display:grid;place-items:center;color:#241803;font-weight:700;box-shadow:var(--shadow-gold),inset 0 1px 0 rgba(255,255,255,.5)}
    .dnav{display:flex;flex-direction:column;gap:3px}
    .dnav a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:9px;color:var(--muted);font-size:13.5px;font-weight:500;transition:.2s;cursor:pointer}
    .dnav a ep-icon{width:17px;height:17px}
    .dnav a.active{background:linear-gradient(90deg,rgba(201,164,92,.16),transparent);color:var(--text);border:1px solid var(--line)}
    .dnav a.active ep-icon{color:var(--gold-bright)}
    .dnav a:hover:not(.active){color:var(--text);background:rgba(255,255,255,.02)}
    .dash-main{padding:22px}
    .dash-main .dh{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
    .dash-main .dh h4{font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.06em;font-size:19px}
    .dash-main .dh .pill{font-size:11px;color:var(--gold);border:1px solid var(--line-2);padding:6px 13px;border-radius:20px;text-transform:uppercase;letter-spacing:.1em;font-family:'Oswald',sans-serif}
    .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
    .metric{background:linear-gradient(180deg,var(--panel-3),var(--panel));border:1px solid var(--line);border-radius:12px;padding:14px}
    .metric .k{font-size:10.5px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted-2)}
    .metric .v{font-family:'Oswald',sans-serif;font-weight:700;font-size:25px;margin-top:7px}
    .metric .d{font-size:11px;color:#7cc28a;margin-top:3px}
    .metric .d.dn{color:#c87c7c}
    .dash-tables{display:grid;grid-template-columns:1.3fr 1fr;gap:14px}
    .dbox{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:rgba(0,0,0,.15)}
    .dbox .bh{padding:11px 14px;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.1em;font-size:12px;color:var(--muted);border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center}
    .drow{display:flex;align-items:center;gap:11px;padding:10px 14px;border-bottom:1px solid rgba(201,164,92,.07);font-size:13px}
    .drow:last-child{border-bottom:none}
    .av{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:700;color:#241803;font-family:'Oswald',sans-serif;flex-shrink:0}
    .drow .nm{flex:1;color:var(--text)}
    .drow .sub{color:var(--muted-2);font-size:11.5px}
    .drow .sc{font-family:'Oswald',sans-serif;font-weight:700;color:var(--gold-bright)}
    .bar-row{display:flex;align-items:center;gap:10px;padding:9px 14px;font-size:12.5px}
    .bar-row .bl{width:70px;color:var(--muted);flex-shrink:0}
    .bar{flex:1;height:7px;border-radius:6px;background:rgba(255,255,255,.05);overflow:hidden}
    .bar i{display:block;height:100%;background:var(--gold-grad);border-radius:6px}
    .bar-row .bv{font-family:'Oswald',sans-serif;color:var(--text);width:34px;text-align:right}

    /* ============================================================ BRACKET (connector tree) */
    .bracket-wrap{overflow-x:auto;padding:8px 4px 22px}
    .bracket{display:flex;gap:48px;min-width:900px;min-height:520px;justify-content:center;position:relative}
    .round{display:flex;flex-direction:column;min-width:190px}
    .round-label{
      align-self:center;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.18em;font-size:10.5px;
      color:var(--gold);padding:5px 15px;margin-bottom:16px;border:1px solid var(--line-2);border-radius:20px;
      background:rgba(201,164,92,.06);
    }
    .matches{flex:1;display:flex;flex-direction:column}
    .match{flex:1;display:flex;align-items:center;justify-content:center;position:relative}
    .match-card{
      width:100%;border-radius:13px;overflow:hidden;position:relative;
      background:linear-gradient(180deg,var(--panel-2),var(--panel));border:1px solid var(--line);
      box-shadow:0 12px 28px -18px rgba(0,0,0,.8);transition:border-color .3s,box-shadow .3s,transform .3s;
    }
    .match:hover .match-card{border-color:var(--line-2);box-shadow:var(--shadow-gold);transform:translateY(-2px)}

    /* connectors: horizontal feed-out + the bracket "[" bar into each next match */
    .round:not(.champ-col) .match::after{
      content:"";position:absolute;left:100%;top:50%;width:48px;height:2px;margin-top:-1px;
      background:linear-gradient(90deg,var(--line-3),rgba(201,164,92,.14));
    }
    .round:not(:first-child):not(.champ-col) .match::before{
      content:"";position:absolute;right:100%;top:25%;height:50%;width:2px;background:var(--line-2);
    }

    .team-row{display:flex;align-items:center;gap:10px;padding:11px 13px;position:relative}
    .team-row+.team-row{border-top:1px solid rgba(201,164,92,.08)}
    .team-row.win{background:linear-gradient(90deg,rgba(201,164,92,.16),transparent)}
    .team-row.win::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gold-grad)}
    .team-row.win .tn,.team-row.win .ts{color:var(--gold-bright)}
    .badge{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;flex-shrink:0;border:1px solid rgba(255,255,255,.12)}
    .badge ep-icon{width:13px;height:13px;color:#fff;opacity:.85}
    .tn{flex:1;font-size:13px;font-weight:600;letter-spacing:.02em}
    .ts{font-family:'Oswald',sans-serif;font-weight:700;font-size:15px;color:var(--muted)}
    .team-row .adv{width:14px;height:14px;color:var(--gold-bright);flex-shrink:0}

    /* champion */
    .champ-col .matches{justify-content:center}
    .champ{
      display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;width:100%;padding:28px 22px;
      border-radius:18px;border:1px solid var(--line-2);
      background:radial-gradient(130% 120% at 50% 0%,rgba(201,164,92,.18),transparent 60%),linear-gradient(180deg,var(--panel-3),var(--panel));
      box-shadow:var(--shadow),0 0 64px -28px rgba(200,160,80,.75);
    }
    .champ .cup{
      width:74px;height:74px;border-radius:50%;display:grid;place-items:center;
      background:radial-gradient(circle at 38% 28%,rgba(244,226,163,.42),rgba(154,117,48,.12));
      border:1px solid var(--line-3);box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 0 32px -6px rgba(214,168,78,.65);
    }
    .champ .cup ep-icon{width:36px;height:36px;color:var(--gold-bright)}
    .champ .ct{font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:var(--muted)}
    .champ .cn{font-family:'Oswald',sans-serif;font-weight:700;font-size:18px}

    /* ============================================================ PRICING */
    .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;align-items:stretch}
    .price-card{
      padding:36px 32px;border-radius:var(--radius-lg);position:relative;display:flex;flex-direction:column;
      background:linear-gradient(180deg,var(--panel-2),var(--panel));border:1px solid var(--line);transition:.3s;
    }
    .price-card:hover{transform:translateY(-6px);border-color:var(--line-2);box-shadow:var(--shadow)}
    .price-card.featured{border-color:var(--line-3);background:linear-gradient(180deg,#221a0f,#15110b);box-shadow:var(--shadow),0 0 70px -26px rgba(180,140,60,.5)}
    .price-card.featured::before{
      content:"Most Popular";position:absolute;top:-13px;left:50%;transform:translateX(-50%);
      background:var(--gold-grad);color:#241803;font-family:'Oswald',sans-serif;text-transform:uppercase;
      letter-spacing:.14em;font-size:11px;font-weight:600;padding:6px 16px;border-radius:20px;box-shadow:var(--shadow-gold);
    }
    .price-card .tier{font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.18em;font-size:14px;color:var(--gold)}
    .price-card .desc{color:var(--muted);font-size:13.5px;margin-top:7px;min-height:38px}
    .price-card .amt{font-family:'Oswald',sans-serif;font-weight:700;font-size:52px;line-height:1;margin:22px 0 4px}
    .price-card .amt small{font-size:16px;color:var(--muted);font-weight:500;letter-spacing:0}
    .price-card .per{color:var(--muted-2);font-size:13px;margin-bottom:24px}
    .price-feats{list-style:none;display:flex;flex-direction:column;gap:13px;margin-bottom:30px;flex:1}
    .price-feats li{display:flex;align-items:flex-start;gap:11px;font-size:14px;color:var(--text)}
    .price-feats li ep-icon{width:18px;height:18px;color:var(--gold-bright);flex-shrink:0;margin-top:1px}
    .price-feats li.off{color:var(--muted-2)}
    .price-feats li.off ep-icon{color:var(--muted-2)}
    .price-card .btn{justify-content:center;width:100%}

    /* ============================================================ FIXTURES */
    .fixtures{max-width:980px;margin:0 auto}
    .fix-card{border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line);background:linear-gradient(180deg,var(--panel-2),var(--panel));box-shadow:var(--shadow)}
    .fix-head{display:flex;align-items:center;justify-content:space-between;padding:20px 26px;border-bottom:1px solid var(--line);background:rgba(0,0,0,.2)}
    .fix-head h3{font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.08em;font-size:20px}
    .fix-head .live{display:inline-flex;align-items:center;gap:8px;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.14em;font-size:11px;color:var(--gold);border:1px solid var(--line-2);padding:6px 14px;border-radius:20px}
    .fix-head .live .dot{width:7px;height:7px;border-radius:50%;background:#e0533f;box-shadow:0 0 0 0 rgba(224,83,63,.6);animation:pulse 1.8s infinite}
    @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(224,83,63,.5)}70%{box-shadow:0 0 0 7px rgba(224,83,63,0)}100%{box-shadow:0 0 0 0 rgba(224,83,63,0)}}
    .fix-colhead{display:grid;grid-template-columns:1.6fr 1fr .8fr 130px;gap:14px;padding:11px 26px;font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.14em;font-size:11px;color:var(--muted-2);border-bottom:1px solid var(--line)}
    .fix-row{display:grid;grid-template-columns:1.6fr 1fr .8fr 130px;gap:14px;align-items:center;padding:15px 26px;border-bottom:1px solid rgba(201,164,92,.07);transition:background .2s}
    .fix-row:last-child{border-bottom:none}
    .fix-row:hover{background:rgba(201,164,92,.04)}
    .matchup{display:flex;align-items:center;gap:10px}
    .matchup .badge{width:30px;height:30px}
    .matchup .vs{color:var(--muted-2);font-family:'Oswald',sans-serif;font-size:12px;padding:0 2px}
    .matchup .tt{font-weight:600;font-size:14px}
    .fix-row .venue{color:var(--muted);font-size:13.5px}
    .fix-row .time{font-family:'Oswald',sans-serif;color:var(--text);font-size:15px}
    .fix-row .time small{display:block;color:var(--muted-2);font-size:11px;letter-spacing:.1em}
    .watch{font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.1em;font-size:11px;padding:9px 0;border-radius:9px;border:1px solid var(--line-2);text-align:center;color:var(--gold-bright);transition:.2s;display:inline-flex;align-items:center;justify-content:center;gap:7px}
    .watch ep-icon{width:13px;height:13px}
    .watch:hover{background:var(--gold-grad);color:#241803;border-color:transparent}

    /* ============================================================ TESTIMONIALS (cards) */
    .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-bottom:18px}
    .testi-card{
      position:relative;text-align:center;padding:42px 30px 50px;border-radius:var(--radius-lg);overflow:visible;
      background:linear-gradient(180deg,var(--panel-2),var(--panel));border:1px solid var(--line-2);
      transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease;
    }
    .testi-card:hover{transform:translateY(-5px);border-color:var(--line-3)}
    .testi-card.active{border-color:var(--line-3);box-shadow:var(--shadow),0 0 70px -34px rgba(180,140,60,.6)}
    .testi-card .qmark{
      display:block;font-family:'Oswald',sans-serif;font-weight:700;font-size:62px;line-height:.4;height:34px;
      background:var(--gold-grad);-webkit-background-clip:text;background-clip:text;color:transparent;
    }
    .testi-quote{color:#cfc7b6;font-style:italic;font-size:15px;line-height:1.7;margin:20px auto 22px;max-width:300px}
    .testi-name{
      font-family:'Oswald',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.07em;font-size:15px;
      background:var(--gold-grad);-webkit-background-clip:text;background-clip:text;color:transparent;
    }
    .testi-card .avatar{
      position:absolute;left:50%;bottom:-28px;transform:translateX(-50%);
      width:56px;height:56px;border-radius:50%;display:grid;place-items:center;
      font-family:'Oswald',sans-serif;font-weight:700;font-size:16px;color:#241803;
      border:3px solid var(--bg);box-shadow:var(--shadow-gold),0 0 0 1px var(--line-2);
    }
    .testi-dots{display:flex;justify-content:center;gap:9px;margin-top:50px}
    .testi-dots .dot{width:9px;height:9px;border-radius:50%;background:rgba(201,164,92,.28);transition:.25s}
    .testi-dots .dot:hover{background:rgba(201,164,92,.55)}
    .testi-dots .dot.on{background:var(--gold-grad);width:26px;border-radius:5px}

    /* ============================================================ CTA BANNER (full-bleed) */
    /* full-bleed band keeps the same vertical rhythm as every other section */
    .cta-band{padding:64px 0 0}
    .cta-inner{
      position:relative;overflow:hidden;min-height:680px;
      border-top:1px solid var(--line-2);border-bottom:1px solid var(--line-2);
      background:#120f0a;
      display:flex;align-items:center;
    }
    .cta-player{position:absolute;inset:0;width:100%}
    .cta-player-art{
      width:100%;height:100%;
      background:
        url('/assets/images/landing-cta.webp') center/cover no-repeat;
    }
    .cta-inner::after{
      content:"";position:absolute;inset:0;z-index:2;pointer-events:none;
      background:linear-gradient(90deg, transparent 24%, rgba(18,15,10,.5) 56%, rgba(18,15,10,.92) 100%),
                 linear-gradient(180deg, rgba(18,15,10,.45), transparent 30%, transparent 72%, rgba(18,15,10,.55)),
                 radial-gradient(460px 420px at 80% 40%, rgba(230,185,90,.20), transparent 64%);
    }
    .cta-wrap{position:relative;z-index:3;width:100%;display:flex}
    .cta-copy{padding:64px 0;max-width:520px;margin-left:auto}
    .cta-copy h2{font-family:'Oswald',sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(34px,4.6vw,58px);line-height:1;margin-bottom:18px}
    .cta-copy p{color:var(--muted);font-size:17px;max-width:430px;margin-bottom:30px}

    /* ============================================================ FOOTER */
    .footer{position:relative;z-index:1;padding:72px 0 34px;border-top:1px solid var(--line);margin-top:0}
    .foot-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1.4fr;gap:40px;padding-bottom:48px;border-bottom:1px solid var(--line)}
    .foot-brand .brand{margin-bottom:18px}
    .foot-brand p{color:var(--muted);font-size:14px;max-width:280px;margin-bottom:22px}
    .socials{display:flex;gap:11px}
    .socials a{width:40px;height:40px;border-radius:10px;border:1px solid var(--line-2);display:grid;place-items:center;color:var(--muted);transition:.2s}
    .socials a:hover{color:#241803;background:var(--gold-grad);border-color:transparent;transform:translateY(-2px)}
    .socials a ep-icon{width:18px;height:18px}
    .foot-col h5{font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.16em;font-size:13px;color:var(--gold);margin-bottom:18px}
    .foot-col a{display:block;color:var(--muted);font-size:14px;margin-bottom:12px;transition:color .2s}
    .foot-col a:hover{color:var(--text)}
    .news h5{font-family:'Oswald',sans-serif;text-transform:uppercase;letter-spacing:.16em;font-size:13px;color:var(--gold);margin-bottom:18px}
    .news p{color:var(--muted);font-size:14px;margin-bottom:16px}
    .news form{display:flex;gap:9px}
    .news input{flex:1;background:rgba(0,0,0,.3);border:1px solid var(--line-2);border-radius:10px;padding:13px 15px;color:var(--text);font-family:inherit;font-size:14px}
    .news input:focus{outline:none;border-color:var(--line-3)}
    .news input::placeholder{color:var(--muted-2)}
    .news button{padding:13px 18px}
    .foot-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:26px;color:var(--muted-2);font-size:13px;flex-wrap:wrap;gap:12px}
    .foot-bottom .links{display:flex;gap:24px}
    .foot-bottom a:hover{color:var(--muted)}

    /* ============================================================ reveal */
    :host(.io-ready) .reveal{opacity:0;transform:translateY(34px);transition:opacity .85s cubic-bezier(.22,.61,.36,1),transform .85s cubic-bezier(.22,.61,.36,1)}
    :host(.io-ready) .reveal.in{opacity:1;transform:none}

    /* ============================================================ responsive */
    @media(max-width:980px){
      .nav-links{display:none}
      .nav-burger{display:grid}
      .lang-switch{margin-left:auto}
      .hero{min-height:auto;padding:128px 0 88px}
      .hero-ball{width:40vw;opacity:.6}
      .hero-whistle{width:32vw;opacity:.6}
      .feat-grid,.price-grid,.testi-grid{grid-template-columns:1fr}
      .testi-grid{gap:54px}
      .dash-tables,.metrics{grid-template-columns:1fr 1fr}
      .dash-body{grid-template-columns:1fr}
      .dash-side{display:none}
      .foot-grid{grid-template-columns:1fr 1fr}
      .cta-player{width:100%;opacity:.55}
      .cta-inner::after{background:linear-gradient(180deg,rgba(21,17,11,.45),rgba(21,17,11,.88))}
      .cta-copy{margin-left:0}
    }
    @media(max-width:600px){
      section{padding:52px 0}
      .metrics{grid-template-columns:1fr 1fr}
      .dash-tables{grid-template-columns:1fr}
      .foot-grid{grid-template-columns:1fr}
      .fix-colhead,.fix-row{grid-template-columns:1.4fr 1fr;gap:10px}
      .fix-row .venue,.fix-colhead span:nth-child(2){display:none}
      .hero-ball{width:48vw;opacity:.4}
      .hero-whistle{width:40vw;opacity:.4}
    }
  `],
})
export class PremiumLandingComponent implements OnInit, AfterViewInit, OnDestroy {
  /* signal-backed host class: safe to flip from rAF without NG0100 */
  ioReady = signal(false);

  private host = inject(ElementRef<HTMLElement>);
  private meta = inject(Meta);
  private titleService = inject(Title);
  private http = inject(HttpClient);
  private gsapCtx: gsap.Context | null = null;
  private gsapMM: gsap.MatchMedia | null = null;
  private io: IntersectionObserver | null = null;
  private navScrollFn: (() => void) | null = null;
  private testiTimer: ReturnType<typeof setInterval> | null = null;
  private reducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  navScrolled = signal(false);
  testiIdx = signal(0);
  isMobile = signal(false);

  contactForm = { name: '', email: '', subject: 'Newsletter', message: 'Newsletter signup' };
  contactSubmitting = signal(false);
  contactSuccess = signal(false);

  /* ---- i18n (English + Swiss German) ---- */
  lang = signal<'en' | 'de'>('en');
  langs = [{ id: 'en' as const, label: 'EN' }, { id: 'de' as const, label: 'DE' }];

  private i18n = {
    en: {
      navFeatures: 'Features', navDashboard: 'Dashboard', navBrackets: 'Brackets', navPricing: 'Pricing', navFixtures: 'Fixtures',
      login: 'Login', signIn: 'Sign In',
      heroTitle1: 'The Ultimate', heroTitle2: 'Tournament Management',
      heroSub: 'Streamlined football administration — from fixtures and live scoring to brackets, payments and reporting, all from one central command center.',
      featEyebrow: 'Features', featH2: 'Built For Serious Competition', featP: 'Everything an organizer needs to run a flawless season — engineered for federations, leagues and clubs alike.',
      dashEyebrow: 'Dashboard Preview', dashH2: 'Your Admin Command Center', dashP: 'A single source of truth for the entire competition — clean, fast and built for match-day pressure.',
      brackEyebrow: 'Live Bracket Demo', brackH2: 'Brackets That Build Themselves', brackP: 'Winners advance automatically. Every result ripples through the bracket in real time — no spreadsheets, no manual edits.',
      priceEyebrow: 'Pricing', priceH2: 'Plans For Every Level', priceP: 'From grassroots clubs to national federations — scale your competition without scaling your workload.',
      fixEyebrow: 'Fixtures Demo', fixH2: "Today's Matches", fixP: 'Every kickoff, venue and live stream in one organized match-day view.',
      testiEyebrow: 'Testimonials', testiH2: 'Trusted By Organizers', testiP: 'From weekend cups to national leagues — administrators run their seasons on ATB Sports.',
      ctaEyebrow: 'Join The Elite', ctaH2: 'Start Your Season Today', ctaP: 'Create your first tournament, invite your teams and run match-day like the pros — your competition deserves an elite stage.', ctaBtn: 'Start Your Season',
    },
    de: {
      navFeatures: 'Funktionen', navDashboard: 'Dashboard', navBrackets: 'Turnierbaum', navPricing: 'Preise', navFixtures: 'Spielplan',
      login: 'Anmelden', signIn: 'Anmelden',
      heroTitle1: 'Das ultimative', heroTitle2: 'Turniermanagement',
      heroSub: 'Optimierte Fussballverwaltung – von Spielplänen und Live-Ergebnissen über Turnierbäume bis zu Zahlungen und Auswertungen, alles über eine zentrale Steuerzentrale.',
      featEyebrow: 'Funktionen', featH2: 'Für ernsthaften Wettbewerb gemacht', featP: 'Alles, was ein Veranstalter für eine reibungslose Saison braucht – entwickelt für Verbände, Ligen und Vereine.',
      dashEyebrow: 'Dashboard-Vorschau', dashH2: 'Ihre Verwaltungszentrale', dashP: 'Eine zentrale Informationsquelle für den gesamten Wettbewerb – klar, schnell und für den Spieltag gemacht.',
      brackEyebrow: 'Live-Turnierbaum-Demo', brackH2: 'Turnierbäume, die sich selbst aufbauen', brackP: 'Sieger ziehen automatisch weiter. Jedes Ergebnis aktualisiert den Turnierbaum in Echtzeit – keine Tabellen, keine manuelle Pflege.',
      priceEyebrow: 'Preise', priceH2: 'Pläne für jede Stufe', priceP: 'Vom Breitensportverein bis zum nationalen Verband – skalieren Sie Ihren Wettbewerb ohne Mehraufwand.',
      fixEyebrow: 'Spielplan-Demo', fixH2: 'Spiele heute', fixP: 'Jeder Anpfiff, Austragungsort und Livestream in einer übersichtlichen Spieltagsansicht.',
      testiEyebrow: 'Stimmen', testiH2: 'Von Veranstaltern geschätzt', testiP: 'Vom Wochenend-Cup bis zur nationalen Liga – Veranstalter organisieren ihre Saison mit ATB Sports.',
      ctaEyebrow: 'Werden Sie Teil der Elite', ctaH2: 'Starten Sie Ihre Saison heute', ctaP: 'Erstellen Sie Ihr erstes Turnier, laden Sie Ihre Teams ein und meistern Sie den Spieltag wie die Profis – Ihr Wettbewerb verdient eine grosse Bühne.', ctaBtn: 'Saison starten',
    },
  };

  t = computed(() => this.i18n[this.lang()]);

  navLinks = computed(() => [
    { label: this.t().navFeatures, href: '#features' },
    { label: this.t().navDashboard, href: '#dashboard' },
    { label: this.t().navBrackets, href: '#bracket' },
    { label: this.t().navPricing, href: '#pricing' },
    { label: this.t().navFixtures, href: '#fixtures' },
  ]);

  setLang(l: 'en' | 'de') {
    this.lang.set(l);
    if (typeof document !== 'undefined') document.documentElement.lang = l;
    try { localStorage.setItem('atb_lang', l); } catch {}
  }

  features = [
    { icon: 'trophy', title: 'Tournament Creation', desc: 'Spin up knockout, league or hybrid formats in minutes with automated seeding, scheduling and venue allocation.' },
    { icon: 'gauge', title: 'Real-Time Scoring', desc: 'Push live scores, cards and substitutions from the touchline. Standings and brackets update instantly across every screen.' },
    { icon: 'clipboard-list', title: 'Team Management', desc: 'Centralize rosters, eligibility, documents and player stats with role-based access for staff, coaches and referees.' },
  ];

  dashNav = [
    { label: 'Overview', icon: 'layout-dashboard', active: true },
    { label: 'Tournaments', icon: 'trophy', active: false },
    { label: 'Fixtures', icon: 'calendar-days', active: false },
    { label: 'Teams', icon: 'users', active: false },
    { label: 'Brackets', icon: 'git-merge', active: false },
    { label: 'Reports', icon: 'bar-chart-3', active: false },
    { label: 'Settings', icon: 'settings', active: false },
  ];

  metrics = [
    { k: 'Active Tournaments', v: '24', d: '▲ 4 this week', down: false },
    { k: 'Matches Today', v: '86', d: '▲ 12 live', down: false },
    { k: 'Registered Teams', v: '1,204', d: '▲ 38 new', down: false },
    { k: 'Pending Approvals', v: '7', d: '▼ 3 overdue', down: true },
  ];

  recentResults = [
    { av: 'FC', grad: 'linear-gradient(135deg,#d9b35e,#a8802f)', home: 'Falcons United', away: 'Riverside', score: '3 – 1' },
    { av: 'RS', grad: 'linear-gradient(135deg,#7c9bd1,#3f5e96)', home: 'Royal Stags', away: 'Harbour', score: '2 – 2' },
    { av: 'VC', grad: 'linear-gradient(135deg,#c87c7c,#8f3f3f)', home: 'Vale City', away: 'Northgate', score: '0 – 1' },
    { av: 'AT', grad: 'linear-gradient(135deg,#7cc28a,#3f8f55)', home: 'Ashford Town', away: 'Pinehill', score: '4 – 0' },
  ];

  topScorers = [
    { name: 'M. Okafor', pct: 96, goals: 24 },
    { name: 'L. Costa', pct: 82, goals: 21 },
    { name: 'D. Hassan', pct: 68, goals: 17 },
    { name: 'J. Müller', pct: 54, goals: 14 },
    { name: 'P. Silva', pct: 40, goals: 10 },
  ];

  bracket: { label: string; matches: Team[][] }[] = [
    {
      label: 'Quarter Finals',
      matches: [
        [{ name: 'Falcons', score: 3, win: true, grad: 'linear-gradient(135deg,#d9b35e,#a8802f)' }, { name: 'Tanners', score: 1, grad: 'linear-gradient(135deg,#7c9bd1,#3f5e96)' }],
        [{ name: 'Zenith', score: 0, grad: 'linear-gradient(135deg,#c87c7c,#8f3f3f)' }, { name: 'Boroughs', score: 2, win: true, grad: 'linear-gradient(135deg,#7cc28a,#3f8f55)' }],
        [{ name: 'Saints', score: 4, win: true, grad: 'linear-gradient(135deg,#b59cd1,#6a4f96)' }, { name: 'Compton', score: 2, grad: 'linear-gradient(135deg,#d1a87c,#96673f)' }],
        [{ name: 'Harbour', score: 1, grad: 'linear-gradient(135deg,#7cc2bf,#3f8f8a)' }, { name: 'Marshes', score: 3, win: true, grad: 'linear-gradient(135deg,#d9b35e,#a8802f)' }],
      ],
    },
    {
      label: 'Semi Finals',
      matches: [
        [{ name: 'Falcons', score: 2, win: true, grad: 'linear-gradient(135deg,#d9b35e,#a8802f)' }, { name: 'Boroughs', score: 1, grad: 'linear-gradient(135deg,#7cc28a,#3f8f55)' }],
        [{ name: 'Saints', score: 0, grad: 'linear-gradient(135deg,#b59cd1,#6a4f96)' }, { name: 'Marshes', score: 2, win: true, grad: 'linear-gradient(135deg,#d9b35e,#a8802f)' }],
      ],
    },
    {
      label: 'Final',
      matches: [
        [{ name: 'Falcons', score: 3, win: true, grad: 'linear-gradient(135deg,#d9b35e,#a8802f)' }, { name: 'Marshes', score: 2, grad: 'linear-gradient(135deg,#d9b35e,#a8802f)' }],
      ],
    },
  ];

  pricing = [
    {
      tier: 'Clubs', desc: 'For single clubs running local cups and friendlies.', amt: '$49', per: '/mo',
      note: 'Billed monthly · cancel anytime', featured: false, cta: 'Get Started',
      feats: [
        { label: 'Up to 5 tournaments', off: false },
        { label: '50 registered teams', off: false },
        { label: 'Live scoring & standings', off: false },
        { label: 'Email support', off: false },
        { label: 'Custom branding', off: true },
      ],
    },
    {
      tier: 'Leagues', desc: 'For multi-division leagues and regional bodies.', amt: '$149', per: '/mo',
      note: 'Billed monthly · cancel anytime', featured: true, cta: 'Get Started',
      feats: [
        { label: 'Unlimited tournaments', off: false },
        { label: '500 registered teams', off: false },
        { label: 'Advanced brackets & seeding', off: false },
        { label: 'Custom branding', off: false },
        { label: 'Priority support', off: false },
      ],
    },
    {
      tier: 'Federations', desc: 'For national federations and enterprise operations.', amt: 'Custom', per: '',
      note: 'Tailored to your competition', featured: false, cta: 'Talk to Sales',
      feats: [
        { label: 'Everything in Leagues', off: false },
        { label: 'Unlimited teams & staff', off: false },
        { label: 'SSO & audit logs', off: false },
        { label: 'Dedicated success manager', off: false },
        { label: 'SLA & on-prem options', off: false },
      ],
    },
  ];

  fixtures = [
    { home: { name: 'Falcons', grad: 'linear-gradient(135deg,#d9b35e,#a8802f)' }, away: { name: 'Vale City', grad: 'linear-gradient(135deg,#c87c7c,#8f3f3f)' }, venue: 'Marris Stadium', time: '15:00', day: 'SAT' },
    { home: { name: 'Royal Stags', grad: 'linear-gradient(135deg,#7c9bd1,#3f5e96)' }, away: { name: 'Ashford', grad: 'linear-gradient(135deg,#7cc28a,#3f8f55)' }, venue: 'Pinehill Park', time: '17:30', day: 'SAT' },
    { home: { name: 'Saints', grad: 'linear-gradient(135deg,#b59cd1,#6a4f96)' }, away: { name: 'Harbour', grad: 'linear-gradient(135deg,#7cc2bf,#3f8f8a)' }, venue: 'Boroughs Arena', time: '19:00', day: 'SAT' },
    { home: { name: 'Compton', grad: 'linear-gradient(135deg,#d1a87c,#96673f)' }, away: { name: 'Marshes', grad: 'linear-gradient(135deg,#d9b35e,#a8802f)' }, venue: 'Northgate Ground', time: '20:45', day: 'SAT' },
    { home: { name: 'Tanners', grad: 'linear-gradient(135deg,#7c9bd1,#3f5e96)' }, away: { name: 'Zenith', grad: 'linear-gradient(135deg,#b59cd1,#6a4f96)' }, venue: 'Riverside Field', time: '13:00', day: 'SUN' },
  ];

  testimonials = [
    { initials: 'DM', grad: 'linear-gradient(135deg,#d9b35e,#a8802f)', text: 'We migrated three regional cups onto ATB Sports in a weekend. Live scoring and auto-advancing brackets cut our match-day admin in half.', name: 'Daniel Mertens', role: 'Director, Riverside League' },
    { initials: 'SC', grad: 'linear-gradient(135deg,#b59cd1,#6a4f96)', text: 'The dashboard is the cleanest we\'ve used. Our referees push scores from the touchline and standings update before the final whistle.', name: 'Sofia Castellano', role: 'Ops Lead, Marshes FA' },
    { initials: 'MA', grad: 'linear-gradient(135deg,#7cc28a,#3f8f55)', text: 'Registration, eligibility and payments in one place. ATB Sports made running our 64-team federation tournament genuinely effortless.', name: 'Marcus Adeyemi', role: 'Secretary, Boroughs Federation' },
  ];

  socials = [
    { label: 'X', icon: 'twitter' },
    { label: 'Instagram', icon: 'instagram' },
    { label: 'Facebook', icon: 'facebook' },
    { label: 'YouTube', icon: 'youtube' },
    { label: 'LinkedIn', icon: 'linkedin' },
  ];

  footerCols = [
    { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Dashboard', href: '#dashboard' }, { label: 'Brackets', href: '#bracket' }, { label: 'Fixtures', href: '#fixtures' }, { label: 'Pricing', href: '#pricing' }] },
    { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }, { label: 'Partners', href: '#' }, { label: 'Contact', href: '#' }] },
  ];

  ngOnInit() {
    try {
      const saved = localStorage.getItem('atb_lang');
      if (saved === 'en' || saved === 'de') this.setLang(saved);
    } catch {}
    this.titleService.setTitle('ATB Sports — The Ultimate Tournament Management');
    this.meta.updateTag({ name: 'description', content: 'Streamline every stage of football administration — fixtures, live scoring, brackets, payments and reporting — from one elite command center.' });
    this.meta.updateTag({ property: 'og:title', content: 'ATB Sports — Tournament Management' });
    this.meta.updateTag({ property: 'og:description', content: 'Run football tournaments with real-time scoring, brackets, and team management.' });
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    this.syncViewport();
    this.initNavScroll();
    requestAnimationFrame(() => {
      this.initReveals();
      this.initHero();
      this.initParallax();
    });
    this.startTesti();
  }

  ngOnDestroy() {
    this.io?.disconnect();
    this.gsapCtx?.revert();
    this.gsapMM?.revert();
    if (this.navScrollFn) window.removeEventListener('scroll', this.navScrollFn);
    this.stopTesti();
  }

  @HostListener('window:resize')
  onResize() { this.syncViewport(); }

  /* Native passive listener instead of @HostListener('window:scroll') — in a
     zoneless app a host listener schedules change detection on every scroll
     event; the signal only notifies when the boolean actually flips. */
  private initNavScroll() {
    this.navScrollFn = () => this.navScrolled.set(window.scrollY > 30);
    window.addEventListener('scroll', this.navScrollFn, { passive: true });
    this.navScrollFn();
  }

  private syncViewport() {
    this.isMobile.set(window.matchMedia('(max-width:980px)').matches);
  }

  /* Reveal-on-scroll via IntersectionObserver — content stays visible if this never runs. */
  private initReveals() {
    if (!('IntersectionObserver' in window)) return;
    this.ioReady.set(true);
    const root: HTMLElement = this.host.nativeElement;

    // cascade siblings that share a parent
    root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
      const sibs = [...el.parentElement!.children].filter(c => c.classList.contains('reveal'));
      const i = sibs.indexOf(el);
      if (sibs.length > 1 && i > 0) el.style.transitionDelay = (i * 0.09) + 's';
    });

    this.io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); this.io!.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    root.querySelectorAll('.reveal').forEach(el => this.io!.observe(el));

    // Fail-safe: directly reveal anything already in view.
    const revealInView = () => {
      const h = window.innerHeight || document.documentElement.clientHeight;
      root.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < h * 0.92) { el.classList.add('in'); this.io!.unobserve(el); }
      });
    };
    requestAnimationFrame(revealInView);
    setTimeout(revealInView, 200);
  }

  /* GSAP on-load hero entrance (only hides while gsap is present). */
  private initHero() {
    if (this.reducedMotion || !gsap) return;
    this.gsapCtx = gsap.context(() => {
      gsap.from('.hero-inner > *', { opacity: 0, y: 34, duration: .9, stagger: .12, ease: 'power3.out', delay: .15 });
      gsap.from('.hero-ball', { opacity: 0, xPercent: -45, rotation: -35, duration: 1.2, ease: 'power3.out' });
      gsap.from('.hero-whistle', { opacity: 0, xPercent: 45, rotation: 25, duration: 1.2, ease: 'power3.out', delay: .1 });
    }, this.host.nativeElement);
  }

  /* Scrub-linked parallax. Transform-only tweens (translate + a small
     pre-scale so the oversampled layers never expose their edges), pinned to
     scroll position with scrub:true — no smoothing delay, no layout work per
     frame. gsap.matchMedia keeps it off touch/mobile and reduced-motion, and
     reverts every tween + ScrollTrigger automatically when conditions flip. */
  private initParallax() {
    if (!gsap || !('IntersectionObserver' in window)) return;
    gsap.registerPlugin(ScrollTrigger);

    this.gsapMM = gsap.matchMedia(this.host.nativeElement);
    this.gsapMM.add('(min-width: 981px) and (prefers-reduced-motion: no-preference)', () => {
      const scrub = { scrub: true } as const;

      // hero: backdrop drifts slower than the page, props float at depths
      gsap.fromTo('.hero-pitch', { yPercent: 0, scale: 1.12 }, {
        yPercent: 10, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', ...scrub },
      });
      gsap.to('.hero-ball', {
        yPercent: 26, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', ...scrub },
      });
      gsap.to('.hero-whistle', {
        yPercent: 16, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', ...scrub },
      });
      gsap.to('.hero-inner', {
        yPercent: -12, opacity: .25, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', ...scrub },
      });

      // dashboard + bracket band: stadium backdrop counter-drifts through it
      gsap.fromTo('.pitch-band-bg', { yPercent: -8, scale: 1.18 }, {
        yPercent: 8, scale: 1.18, ease: 'none',
        scrollTrigger: { trigger: '.pitch-band', start: 'top bottom', end: 'bottom top', ...scrub },
      });

      // CTA banner: player art glides against the band
      gsap.fromTo('.cta-player-art', { yPercent: -8, scale: 1.16 }, {
        yPercent: 8, scale: 1.16, ease: 'none',
        scrollTrigger: { trigger: '.cta-inner', start: 'top bottom', end: 'bottom top', ...scrub },
      });
    });
  }

  nextTesti() { this.testiIdx.set((this.testiIdx() + 1) % this.testimonials.length); }

  /* card carousel: dots highlight the active card, auto-advancing with hover pause */
  selectTesti(i: number) { this.testiIdx.set(i); this.startTesti(); }
  pauseTesti() { this.stopTesti(); }
  resumeTesti() { this.startTesti(); }

  private startTesti() {
    if (this.reducedMotion || typeof window === 'undefined') return;
    this.stopTesti();
    this.testiTimer = setInterval(() => this.nextTesti(), 6000);
  }
  private stopTesti() {
    if (this.testiTimer) { clearInterval(this.testiTimer); this.testiTimer = null; }
  }

  onSubmit() {
    if (this.contactSubmitting() || !this.contactForm.email) return;
    this.contactSubmitting.set(true);
    this.contactSuccess.set(false);
    this.http.post(`${API_URL}/api/public/contact`, this.contactForm).subscribe({
      next: () => { this.contactSuccess.set(true); this.contactSubmitting.set(false); this.contactForm.email = ''; },
      error: () => this.contactSubmitting.set(false),
    });
  }
}
