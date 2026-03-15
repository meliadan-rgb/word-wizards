import { useState, useEffect, useCallback } from "react";
import { useUser, useSignIn, useSignUp } from "@clerk/react";

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Nunito',sans-serif;background:#0e0a2e}

  @keyframes drift{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-18px) rotate(2deg)}66%{transform:translateY(-8px) rotate(-2deg)}}
  @keyframes twinkle{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
  @keyframes slide-up{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes pop-in{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
  @keyframes bounce-in{0%{transform:scale(0)}60%{transform:scale(1.15)}100%{transform:scale(1)}}
  @keyframes gem-shine{0%,100%{filter:brightness(1)}50%{filter:brightness(1.5) saturate(1.4)}}
  @keyframes streak-pulse{0%,100%{box-shadow:0 0 0 0 rgba(251,146,60,.5)}50%{box-shadow:0 0 0 10px rgba(251,146,60,0)}}
  @keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(90px) rotate(720deg);opacity:0}}
  @keyframes title-glow{0%,100%{text-shadow:0 0 20px #a78bfa,0 0 40px #7c3aed}50%{text-shadow:0 0 40px #c4b5fd,0 0 80px #a855f7}}
  @keyframes shimmer-sweep{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes wizard-bob{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-14px) rotate(1deg)}}
  @keyframes modal-in{from{transform:scale(.9) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  @keyframes admin-pulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}50%{box-shadow:0 0 0 8px rgba(239,68,68,0)}}
  @keyframes spin{to{transform:rotate(360deg)}}

  .slide-up{animation:slide-up .45s cubic-bezier(.34,1.2,.64,1) forwards}
  .pop-in{animation:pop-in .4s cubic-bezier(.34,1.2,.64,1) forwards}
  .bounce-in{animation:bounce-in .5s cubic-bezier(.34,1.56,.64,1) forwards}

  .app{min-height:100vh;font-family:'Nunito',sans-serif;background:#0e0a2e}
  .particle-bg{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
  .star-dot{position:absolute;border-radius:50%;background:white;animation:twinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--del,0s)}
  .nebula-blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.12;animation:drift 8s ease-in-out infinite;animation-delay:var(--del,0s)}

  /* Landing */
  .landing{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;position:relative;z-index:1;background:radial-gradient(ellipse at 30% 20%,rgba(124,58,237,.35) 0%,transparent 55%),radial-gradient(ellipse at 75% 80%,rgba(236,72,153,.25) 0%,transparent 50%),linear-gradient(160deg,#0e0a2e 0%,#1a0d3d 50%,#0f172a 100%)}
  .landing-logo-wrap{text-align:center;margin-bottom:32px}
  .landing-title{font-family:'Fredoka One',cursive;font-size:clamp(2.8rem,6vw,4.2rem);color:white;animation:title-glow 3s ease-in-out infinite;letter-spacing:.02em;line-height:1}
  .landing-title span{color:#fbbf24}
  .landing-subtitle{font-size:1rem;font-weight:700;background:linear-gradient(90deg,#a78bfa,#38bdf8,#f472b6);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer-sweep 3s linear infinite;letter-spacing:.12em;text-transform:uppercase;margin-top:4px}
  .wizard-mascot{width:140px;height:140px;margin:0 auto 8px;animation:wizard-bob 3.5s ease-in-out infinite;filter:drop-shadow(0 12px 32px rgba(124,58,237,.6))}
  .landing-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(20px);border-radius:28px;padding:36px 32px;max-width:440px;width:100%;position:relative;z-index:2;box-shadow:0 32px 80px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.1)}
  .login-toggle{display:flex;background:rgba(255,255,255,.06);border-radius:14px;padding:4px;margin-bottom:24px;gap:4px;border:1px solid rgba(255,255,255,.1)}
  .toggle-btn{flex:1;padding:11px 8px;border:none;border-radius:10px;font-family:'Nunito',sans-serif;font-size:.88rem;font-weight:800;cursor:pointer;transition:all .3s;background:transparent;color:rgba(255,255,255,.45)}
  .toggle-btn.active{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;box-shadow:0 4px 16px rgba(109,40,217,.5)}
  .form-label{display:block;font-size:.75rem;font-weight:800;color:rgba(255,255,255,.5);margin-bottom:7px;text-transform:uppercase;letter-spacing:.1em}
  .form-input{width:100%;padding:13px 16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);border-radius:12px;font-family:'Nunito',sans-serif;font-size:.95rem;font-weight:700;color:white;outline:none;transition:border-color .2s,box-shadow .2s}
  .form-input::placeholder{color:rgba(255,255,255,.25)}
  .form-input:focus{border-color:#a78bfa;box-shadow:0 0 0 3px rgba(167,139,250,.2)}
  .form-input option{background:#1a0d3d;color:white}
  .form-group{margin-bottom:14px}
  .btn-primary{width:100%;padding:15px;background:linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#7c3aed 100%);background-size:200%;color:white;border:none;border-radius:14px;font-family:'Fredoka One',cursive;font-size:1.2rem;letter-spacing:.03em;cursor:pointer;transition:all .2s;box-shadow:0 6px 24px rgba(124,58,237,.5),0 0 0 1px rgba(167,139,250,.3);position:relative;overflow:hidden}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(124,58,237,.65)}
  .btn-primary:active{transform:translateY(0)}
  .avatar-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:14px 0}
  .avatar-option{font-size:1.6rem;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);transition:all .2s}
  .avatar-option:hover{transform:scale(1.2);background:rgba(167,139,250,.2);border-color:rgba(167,139,250,.5)}
  .avatar-option.selected{border-color:#a78bfa;background:rgba(167,139,250,.25);transform:scale(1.2);box-shadow:0 0 16px rgba(167,139,250,.5)}

  /* Student App */
  .student-app{min-height:100vh;background:radial-gradient(ellipse at 20% 0%,rgba(124,58,237,.2) 0%,transparent 50%),linear-gradient(180deg,#0e0a2e 0%,#111827 100%);position:relative;z-index:1}
  .top-bar{background:rgba(14,10,46,.8);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08);padding:10px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
  .top-bar-logo{font-family:'Fredoka One',cursive;font-size:1.45rem;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .top-bar-profile{display:flex;align-items:center;gap:8px;cursor:pointer;padding:7px 12px;border-radius:50px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);transition:all .2s}
  .top-bar-profile:hover{background:rgba(167,139,250,.15);border-color:rgba(167,139,250,.4)}
  .profile-name-sm{font-size:.85rem;font-weight:800;color:rgba(255,255,255,.85)}
  .gems-badge{display:flex;align-items:center;gap:6px;background:linear-gradient(135deg,#d97706,#f59e0b);padding:6px 14px;border-radius:50px;font-weight:800;font-size:.9rem;color:white;box-shadow:0 0 0 0 rgba(245,158,11,.4);animation:streak-pulse 2s infinite}
  .student-main{padding:20px;max-width:680px;margin:0 auto}
  .quest-banner{border-radius:22px;padding:22px 24px;color:white;margin-bottom:20px;position:relative;overflow:hidden;background:linear-gradient(135deg,#4c1d95,#7c3aed,#6d28d9);border:1px solid rgba(167,139,250,.3);box-shadow:0 8px 32px rgba(124,58,237,.35)}
  .quest-banner::before{content:'';position:absolute;top:-40px;right:-40px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.1) 0%,transparent 70%)}
  .level-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(251,191,36,.2);border:1px solid rgba(251,191,36,.5);color:#fbbf24;padding:3px 12px;border-radius:50px;font-size:.8rem;font-weight:900;margin-bottom:8px;letter-spacing:.05em}
  .quest-banner h2{font-family:'Fredoka One',cursive;font-size:1.6rem;margin-bottom:3px;position:relative;z-index:1}
  .quest-banner p{font-size:.88rem;opacity:.8;font-weight:700;position:relative;z-index:1}
  .xp-bar-wrap{background:rgba(0,0,0,.3);border-radius:50px;height:10px;margin-top:12px;overflow:hidden;position:relative;z-index:1;border:1px solid rgba(255,255,255,.1)}
  .xp-bar-fill{height:100%;border-radius:50px;background:linear-gradient(90deg,#fbbf24,#f59e0b,#fcd34d);transition:width .8s cubic-bezier(.34,1.2,.64,1);box-shadow:0 0 10px rgba(251,191,36,.6)}
  .xp-label{font-size:.75rem;opacity:.65;margin-top:5px;font-weight:700;position:relative;z-index:1}
  .streak-card{background:linear-gradient(135deg,rgba(234,88,12,.2),rgba(239,68,68,.15));border:1px solid rgba(251,146,60,.3);border-radius:18px;padding:14px 18px;color:white;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;box-shadow:0 4px 20px rgba(239,68,68,.15)}
  .streak-num{font-family:'Fredoka One',cursive;font-size:2.4rem;color:#fb923c;line-height:1}
  .section-title{font-family:'Fredoka One',cursive;font-size:1.25rem;color:rgba(255,255,255,.9);margin-bottom:12px;letter-spacing:.02em}
  .activity-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-bottom:22px}
  .act-card{border-radius:20px;padding:20px 16px;cursor:pointer;transition:transform .25s cubic-bezier(.34,1.2,.64,1),box-shadow .25s;text-align:center;position:relative;overflow:hidden;background:var(--card-bg);border:1px solid var(--card-border);box-shadow:0 4px 20px var(--card-glow),inset 0 1px 0 rgba(255,255,255,.1)}
  .act-card:hover{transform:translateY(-7px) scale(1.02);box-shadow:0 16px 40px var(--card-glow),0 0 0 1px var(--card-border)}
  .act-card:active{transform:translateY(-2px) scale(.99)}
  .act-card .card-title{font-weight:800;font-size:.95rem;color:white;margin-bottom:3px}
  .act-card .card-desc{font-size:.75rem;color:rgba(255,255,255,.55);font-weight:700;margin-bottom:8px}
  .act-card .card-pts{display:inline-flex;align-items:center;gap:4px;background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.3);color:#fbbf24;border-radius:50px;padding:3px 10px;font-size:.75rem;font-weight:800}
  .act-card::after{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.08) 50%,transparent 60%);background-size:200%;background-position:200%;transition:background-position .5s}
  .act-card:hover::after{background-position:-200%}
  .act-card .progress-ring-wrap{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:50%;background:conic-gradient(var(--ring-color) var(--ring-pct,0%),rgba(255,255,255,.08) 0%);display:flex;align-items:center;justify-content:center}
  .act-card .progress-ring-inner{width:18px;height:18px;border-radius:50%;background:var(--card-bg)}
  .badges-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
  .badge-item{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:8px 12px;display:flex;align-items:center;gap:6px;font-size:.8rem;font-weight:700;color:rgba(255,255,255,.5)}
  .badge-item.earned{background:rgba(251,191,36,.12);border-color:rgba(251,191,36,.35);color:#fbbf24;box-shadow:0 0 12px rgba(251,191,36,.15)}

  /* Activity Screen */
  .activity-screen{min-height:100vh;background:radial-gradient(ellipse at 20% 0%,rgba(124,58,237,.2) 0%,transparent 50%),linear-gradient(180deg,#0e0a2e 0%,#111827 100%);position:relative;z-index:1}
  .activity-header{background:rgba(14,10,46,.85);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.08);padding:14px 20px;display:flex;align-items:center;gap:12px}
  .back-btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:12px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;font-size:1rem;font-weight:800;transition:all .2s}
  .back-btn:hover{background:rgba(167,139,250,.2);border-color:rgba(167,139,250,.4)}
  .activity-title-bar{font-family:'Fredoka One',cursive;font-size:1.25rem;color:white}
  .activity-body{padding:20px;max-width:660px;margin:0 auto}
  .progress-bar-wrap{background:rgba(255,255,255,.08);border-radius:50px;height:8px;margin-bottom:18px;overflow:hidden;border:1px solid rgba(255,255,255,.06)}
  .progress-bar-fill{height:100%;border-radius:50px;background:linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b);transition:width .5s ease;box-shadow:0 0 10px rgba(167,139,250,.6)}
  .q-counter{font-size:.78rem;font-weight:800;color:#a78bfa;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}
  .question-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,.3)}
  .q-instruction{font-size:.85rem;color:rgba(255,255,255,.6);font-weight:700;background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2);padding:8px 13px;border-radius:10px;margin-bottom:14px;display:inline-block}
  .q-text{font-size:1.15rem;font-weight:700;color:white;margin-bottom:18px;line-height:1.5}
  .options-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
  .option-btn{padding:15px 12px;border:1.5px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(255,255,255,.04);font-family:'Nunito',sans-serif;font-size:.9rem;font-weight:700;color:rgba(255,255,255,.85);cursor:pointer;transition:all .2s;text-align:left}
  .option-btn:hover{border-color:#a78bfa;background:rgba(167,139,250,.1);transform:scale(1.02)}
  .option-btn.correct{border-color:#34d399;background:rgba(52,211,153,.12);color:#34d399;animation:bounce-in .4s}
  .option-btn.wrong{border-color:#f87171;background:rgba(248,113,113,.1);color:#f87171}
  .option-btn.selected-neutral{border-color:#a78bfa;background:rgba(167,139,250,.1)}
  .sentence-drop{display:flex;flex-wrap:wrap;gap:6px;padding:14px;border:2px dashed rgba(167,139,250,.3);border-radius:14px;min-height:56px;background:rgba(124,58,237,.06);margin-bottom:12px;align-items:center}
  .word-bank{display:flex;flex-wrap:wrap;gap:7px;padding:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;min-height:54px;margin-bottom:14px}
  .word-chip{padding:8px 15px;background:rgba(124,58,237,.25);border-radius:50px;font-weight:800;font-size:.9rem;color:white;cursor:pointer;border:1.5px solid rgba(167,139,250,.35);transition:all .2s}
  .word-chip:hover{background:rgba(124,58,237,.5);transform:scale(1.06);border-color:#a78bfa}
  .word-chip.placed{opacity:.2;pointer-events:none}
  .placed-chip{padding:7px 13px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;border-radius:50px;font-weight:800;font-size:.88rem;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all .2s;box-shadow:0 2px 8px rgba(124,58,237,.4)}
  .placed-chip:hover{background:linear-gradient(135deg,#6d28d9,#9333ea)}
  .feedback-correct{background:rgba(52,211,153,.1);border:1.5px solid rgba(52,211,153,.4);border-radius:14px;padding:14px;text-align:center;font-weight:800;color:#34d399;font-size:1rem;animation:pop-in .4s;box-shadow:0 0 20px rgba(52,211,153,.15)}
  .feedback-wrong{background:rgba(248,113,113,.08);border:1.5px solid rgba(248,113,113,.35);border-radius:14px;padding:14px;text-align:center;font-weight:800;color:#f87171;font-size:1rem;animation:pop-in .4s}
  .submit-btn{width:100%;padding:14px;background:linear-gradient(135deg,#10b981,#059669);color:white;border:none;border-radius:14px;font-family:'Fredoka One',cursive;font-size:1.1rem;cursor:pointer;transition:all .2s;box-shadow:0 6px 20px rgba(16,185,129,.35);border-bottom:3px solid #047857}
  .submit-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(16,185,129,.5)}
  .submit-btn:active{transform:translateY(1px);border-bottom-width:1px}
  .completion-screen{text-align:center;padding:40px 20px}
  .completion-emoji{font-size:5rem;display:block;margin-bottom:14px;animation:drift 2.5s ease-in-out infinite}
  .completion-title{font-family:'Fredoka One',cursive;font-size:2.5rem;color:white;margin-bottom:8px;text-shadow:0 0 30px rgba(167,139,250,.8)}
  .completion-pts{font-family:'Fredoka One',cursive;font-size:3rem;display:block;animation:pop-in .7s;background:linear-gradient(135deg,#fbbf24,#f59e0b,#fcd34d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .confetti-piece{position:absolute;width:9px;height:9px;border-radius:2px;animation:confetti-fall 1.5s ease-out forwards}

  /* SPAG */
  .spag-header{border-radius:22px;padding:22px;color:white;margin-bottom:20px;background:linear-gradient(135deg,#1e1b4b,#4c1d95,#312e81);border:1px solid rgba(167,139,250,.25);box-shadow:0 8px 32px rgba(76,29,149,.4)}
  .spag-header h2{font-family:'Fredoka One',cursive;font-size:1.7rem;margin-bottom:3px}
  .spag-topics{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .spag-topic{background:rgba(255,255,255,.04);border-radius:14px;padding:14px;cursor:pointer;transition:transform .2s;border-left:4px solid;display:flex;align-items:center;gap:10px;border-top:1px solid rgba(255,255,255,.08)}
  .spag-topic:hover{transform:scale(1.03);background:rgba(255,255,255,.07)}
  .spag-topic .topic-name{font-weight:800;font-size:.88rem;color:white;margin-bottom:2px}
  .spag-topic .topic-q{font-size:.72rem;color:rgba(255,255,255,.4);font-weight:600}
  .spag-topic .topic-status{margin-left:auto;font-size:.72rem;font-weight:800;padding:3px 9px;border-radius:50px;white-space:nowrap}

  /* CS */
  .cs-key{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px;justify-content:center}
  .cs-key-item{display:flex;align-items:center;gap:4px;padding:5px 12px;border-radius:50px;font-size:.75rem;font-weight:900;color:white;letter-spacing:.04em;box-shadow:0 2px 8px rgba(0,0,0,.3)}
  .cs-scene{border-radius:20px;padding:18px 20px;text-align:center;margin-bottom:14px;background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(245,158,11,.08));border:1.5px solid rgba(251,191,36,.3)}
  .cs-scene-emoji{font-size:4rem;display:block;animation:drift 3s ease-in-out infinite;line-height:1.2}
  .cs-scene-desc{font-size:.9rem;font-weight:800;color:#fbbf24;margin-top:6px}
  .cs-instruction{font-size:.82rem;font-weight:700;color:#a78bfa;background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2);padding:7px 13px;border-radius:10px;margin-bottom:11px;text-align:center}
  .cs-slots{display:flex;flex-direction:column;gap:7px;margin-bottom:12px}
  .cs-slot{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:14px;border:2px dashed;background:rgba(255,255,255,.03);min-height:52px;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,.15)}
  .cs-slot:hover{transform:scale(1.01)}
  .cs-slot.active-target{box-shadow:0 0 0 2px #7c3aed;transform:scale(1.01)}
  .cs-slot.correct-slot{border-style:solid;background:rgba(52,211,153,.08)}
  .cs-slot.wrong-slot{border-style:solid;background:rgba(248,113,113,.08)}
  .cs-slot-label{font-size:.7rem;font-weight:900;text-transform:uppercase;letter-spacing:.07em;white-space:nowrap;padding:4px 10px;border-radius:50px;color:white;flex-shrink:0;min-width:76px;text-align:center}
  .cs-slot-value{font-size:.95rem;font-weight:700;color:white;flex:1}
  .cs-slot-empty{color:rgba(255,255,255,.2);font-weight:600;font-style:italic;font-size:.82rem;flex:1}
  .cs-remove-btn{font-size:.7rem;color:rgba(255,255,255,.25);background:none;border:none;cursor:pointer;padding:2px 5px;border-radius:50%;transition:all .2s;font-weight:800}
  .cs-remove-btn:hover{background:rgba(248,113,113,.2);color:#f87171}
  .cs-sentence-preview{background:rgba(167,139,250,.08);border:1.5px solid rgba(167,139,250,.2);border-radius:14px;padding:12px 16px;margin-bottom:12px;display:flex;align-items:center;flex-wrap:wrap;gap:5px;min-height:46px}
  .cs-sentence-word{padding:5px 12px;border-radius:50px;font-weight:800;font-size:.88rem;color:white;animation:bounce-in .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 2px 8px rgba(0,0,0,.25)}
  .cs-sentence-placeholder{color:rgba(167,139,250,.4);font-weight:600;font-style:italic;font-size:.82rem}
  .cs-chip-bank{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px;min-height:58px;justify-content:center;align-items:center}
  .cs-chip-bank-label{width:100%;font-size:.72rem;font-weight:900;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px;text-align:center}
  .cs-chip{padding:9px 16px;border-radius:50px;font-weight:800;font-size:.88rem;cursor:pointer;border:2px solid transparent;transition:all .2s;color:white;user-select:none;box-shadow:0 3px 10px rgba(0,0,0,.3)}
  .cs-chip:hover{transform:translateY(-3px) scale(1.06);box-shadow:0 8px 20px rgba(0,0,0,.4);filter:brightness(1.15)}
  .cs-chip.chip-selected{transform:translateY(-5px) scale(1.1);border-color:white;box-shadow:0 10px 24px rgba(0,0,0,.5)}
  .cs-chip.chip-used{opacity:.2;pointer-events:none;transform:none;box-shadow:none}

  /* Teacher Dashboard */
  .teacher-app{min-height:100vh;display:flex;background:#0a0a1a}
  .teacher-sidebar{width:220px;flex-shrink:0;min-height:100vh;padding:20px 14px;background:linear-gradient(180deg,#13102b,#1a0d3d);border-right:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;gap:4px}
  .sidebar-logo{font-family:'Fredoka One',cursive;font-size:1.45rem;color:white;text-align:center;margin-bottom:24px;line-height:1.2}
  .sidebar-logo span{display:block;font-family:'Nunito',sans-serif;font-size:.65rem;font-weight:700;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.15em}
  .nav-item{display:flex;align-items:center;gap:9px;padding:11px 12px;border-radius:12px;color:rgba(255,255,255,.45);cursor:pointer;transition:all .2s;font-weight:700;font-size:.88rem;border:none;background:transparent;width:100%;text-align:left}
  .nav-item:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.85)}
  .nav-item.active{background:rgba(124,58,237,.25);color:white;border:1px solid rgba(167,139,250,.2)}
  .nav-item .nav-icon{font-size:1rem;width:20px;text-align:center}
  .teacher-main{flex:1;overflow:auto;padding:28px;background:#0f0f23}
  .teacher-header{margin-bottom:26px}
  .teacher-header h1{font-family:'Fredoka One',cursive;font-size:1.9rem;color:white;margin-bottom:3px}
  .teacher-header p{color:rgba(255,255,255,.4);font-weight:600;font-size:.88rem}
  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
  .stat-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:18px;border-left:3px solid transparent}
  .stat-card.purple{border-left-color:#a855f7}.stat-card.pink{border-left-color:#ec4899}.stat-card.teal{border-left-color:#14b8a6}.stat-card.orange{border-left-color:#f97316}
  .stat-num{font-family:'Fredoka One',cursive;font-size:1.9rem;color:white}
  .stat-label{font-size:.72rem;color:rgba(255,255,255,.4);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
  .stat-trend{font-size:.75rem;color:#34d399;font-weight:700;margin-top:3px}
  .dashboard-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .dash-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:20px}
  .dash-card-title{font-weight:800;font-size:.95rem;color:white;margin-bottom:14px;display:flex;align-items:center;gap:7px}
  .student-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05)}
  .student-row:last-child{border-bottom:none}
  .student-ava{font-size:1.3rem}
  .student-info{flex:1}
  .student-info .name{font-weight:700;font-size:.85rem;color:rgba(255,255,255,.85)}
  .student-info .class{font-size:.72rem;color:rgba(255,255,255,.35);font-weight:600}
  .student-pts-badge{background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.25);color:#fbbf24;padding:3px 9px;border-radius:50px;font-size:.72rem;font-weight:700}
  .mini-bar-wrap{flex:1;height:6px;background:rgba(255,255,255,.08);border-radius:50px;overflow:hidden}
  .mini-bar-fill{height:100%;border-radius:50px;background:linear-gradient(90deg,#7c3aed,#ec4899)}
  .class-chip{display:inline-flex;align-items:center;gap:5px;background:rgba(124,58,237,.2);color:#a78bfa;padding:5px 12px;border-radius:50px;font-size:.8rem;font-weight:700;margin:3px;cursor:pointer;border:1px solid rgba(167,139,250,.2);transition:background .2s}
  .class-chip:hover{background:rgba(124,58,237,.35)}
  .classes-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
  .class-card{background:rgba(255,255,255,.04);border-radius:18px;padding:18px;cursor:pointer;transition:transform .2s,box-shadow .2s;border-top:3px solid;border-right:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.05);border-left:1px solid rgba(255,255,255,.07)}
  .class-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.3)}
  .class-card h3{font-family:'Fredoka One',cursive;font-size:1.15rem;color:white;margin-bottom:3px}
  .class-card .class-meta{font-size:.76rem;color:rgba(255,255,255,.35);font-weight:600;margin-bottom:10px}
  .btn-add{padding:9px 18px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:white;border:none;border-radius:11px;font-family:'Nunito',sans-serif;font-weight:800;cursor:pointer;font-size:.85rem;display:flex;align-items:center;gap:5px;transition:all .2s;box-shadow:0 4px 14px rgba(109,40,217,.35)}
  .btn-add:hover{transform:translateY(-1px)}
  .progress-table{width:100%;border-collapse:collapse}
  .progress-table th{padding:11px 14px;background:rgba(255,255,255,.04);text-align:left;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.35);font-weight:700;border-bottom:1px solid rgba(255,255,255,.08)}
  .progress-table td{padding:11px 14px;font-size:.85rem;color:rgba(255,255,255,.75);font-weight:600;border-bottom:1px solid rgba(255,255,255,.05)}
  .progress-table tr:last-child td{border-bottom:none}
  .progress-table tr:hover td{background:rgba(255,255,255,.03)}
  .skill-pills{display:flex;gap:3px;flex-wrap:wrap}
  .skill-pill{padding:2px 7px;border-radius:50px;font-size:.68rem;font-weight:700}
  .skill-pill.high{background:rgba(52,211,153,.15);color:#34d399}
  .skill-pill.mid{background:rgba(251,191,36,.12);color:#fbbf24}
  .skill-pill.low{background:rgba(248,113,113,.12);color:#f87171}
  .pathway-header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
  .pathway-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:18px;margin-bottom:11px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s;border-left:4px solid}
  .pathway-card:hover{transform:translateX(4px);background:rgba(255,255,255,.07)}
  .pathway-info h3{font-weight:800;font-size:.95rem;color:white;margin-bottom:2px}
  .pathway-info p{font-size:.76rem;color:rgba(255,255,255,.4);font-weight:600}
  .pathway-meta{margin-left:auto;text-align:right}
  .pathway-meta .assigned{font-size:.76rem;color:rgba(255,255,255,.35);font-weight:600}
  .pathway-meta .students{font-weight:700;color:rgba(255,255,255,.75);font-size:.85rem}
  .toggle-switch{width:46px;height:24px;background:rgba(255,255,255,.12);border-radius:50px;cursor:pointer;position:relative;transition:background .3s;border:none;flex-shrink:0}
  .toggle-switch.on{background:#22c55e;box-shadow:0 0 10px rgba(34,197,94,.3)}
  .toggle-switch::after{content:'';position:absolute;top:2px;left:2px;width:20px;height:20px;background:white;border-radius:50%;transition:left .3s;box-shadow:0 1px 4px rgba(0,0,0,.3)}
  .toggle-switch.on::after{left:24px}

  /* ─── MODAL ─── */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px}
  .modal-box{background:linear-gradient(160deg,#13102b,#1a0d3d);border:1px solid rgba(167,139,250,.25);border-radius:24px;padding:32px;width:100%;max-width:640px;max-height:85vh;overflow-y:auto;box-shadow:0 40px 100px rgba(0,0,0,.6);animation:modal-in .3s cubic-bezier(.34,1.2,.64,1)}
  .modal-box::-webkit-scrollbar{width:4px}.modal-box::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:2px}
  .modal-title{font-family:'Fredoka One',cursive;font-size:1.6rem;color:white;margin-bottom:4px}
  .modal-subtitle{font-size:.85rem;color:rgba(255,255,255,.4);font-weight:600;margin-bottom:24px}
  .modal-step-bar{display:flex;gap:6px;margin-bottom:24px}
  .modal-step{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.1);transition:background .3s}
  .modal-step.done{background:#7c3aed}
  .modal-step.active{background:linear-gradient(90deg,#7c3aed,#a855f7)}
  .modal-section-label{font-size:.72rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.4);margin-bottom:10px}
  .modal-footer{display:flex;gap:10px;margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08)}
  .btn-ghost{padding:13px 20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;color:rgba(255,255,255,.7);font-family:'Nunito',sans-serif;font-weight:700;font-size:.9rem;cursor:pointer;transition:all .2s}
  .btn-ghost:hover{background:rgba(255,255,255,.1);color:white}
  .btn-action{padding:13px 24px;background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;border-radius:12px;color:white;font-family:'Fredoka One',cursive;font-size:1rem;cursor:pointer;transition:all .2s;box-shadow:0 4px 16px rgba(124,58,237,.4)}
  .btn-action:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(124,58,237,.6)}
  .btn-danger{padding:13px 24px;background:linear-gradient(135deg,#dc2626,#b91c1c);border:none;border-radius:12px;color:white;font-family:'Fredoka One',cursive;font-size:1rem;cursor:pointer;box-shadow:0 4px 16px rgba(220,38,38,.3)}
  .btn-danger:hover{transform:translateY(-2px)}
  .activity-pill{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:50px;border:2px solid;background:transparent;cursor:pointer;font-family:'Nunito',sans-serif;font-weight:800;font-size:.85rem;transition:all .2s;color:white}
  .activity-pill.selected{background:rgba(255,255,255,.12)}
  .activity-pill:hover{transform:scale(1.04)}
  .student-check-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;transition:background .2s;border:1px solid rgba(255,255,255,.06);margin-bottom:6px}
  .student-check-row:hover{background:rgba(255,255,255,.05)}
  .student-check-row.checked{background:rgba(124,58,237,.15);border-color:rgba(167,139,250,.3)}
  .checkbox{width:20px;height:20px;border-radius:6px;border:2px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
  .checkbox.checked{background:#7c3aed;border-color:#7c3aed}
  .color-swatch{width:32px;height:32px;border-radius:50%;cursor:pointer;transition:all .2s;border:3px solid transparent}
  .color-swatch:hover{transform:scale(1.2)}
  .color-swatch.selected{border-color:white;transform:scale(1.25);box-shadow:0 0 14px currentColor}
  .icon-btn{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.3rem;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.08);transition:all .2s}
  .icon-btn:hover{background:rgba(167,139,250,.2);border-color:rgba(167,139,250,.4);transform:scale(1.1)}
  .icon-btn.selected{background:rgba(167,139,250,.25);border-color:#a78bfa;box-shadow:0 0 12px rgba(167,139,250,.4)}
  .diff-btn{padding:8px 16px;border-radius:10px;border:2px solid;background:transparent;cursor:pointer;font-family:'Nunito',sans-serif;font-weight:800;font-size:.82rem;transition:all .2s;color:white}
  .diff-btn.selected{background:rgba(255,255,255,.12)}
  .tag-input-row{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:12px;min-height:44px;align-items:center}
  .tag{padding:4px 10px;border-radius:50px;font-size:.78rem;font-weight:700;display:flex;align-items:center;gap:4px}

  /* ─── ADMIN BACKEND ─── */
  .admin-app{min-height:100vh;display:flex;background:#0a0505}
  .admin-sidebar{width:240px;flex-shrink:0;min-height:100vh;padding:20px 14px;background:linear-gradient(180deg,#130a0a,#1f0a0a);border-right:1px solid rgba(239,68,68,.15);display:flex;flex-direction:column;gap:4px}
  .admin-logo{font-family:'Fredoka One',cursive;font-size:1.3rem;color:white;text-align:center;margin-bottom:6px}
  .admin-logo-badge{background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:4px 10px;font-size:.65rem;font-weight:900;color:#f87171;text-transform:uppercase;letter-spacing:.12em;text-align:center;margin-bottom:20px;animation:admin-pulse 2s infinite}
  .admin-nav-item{display:flex;align-items:center;gap:9px;padding:11px 12px;border-radius:12px;color:rgba(255,255,255,.4);cursor:pointer;transition:all .2s;font-weight:700;font-size:.88rem;border:none;background:transparent;width:100%;text-align:left}
  .admin-nav-item:hover{background:rgba(239,68,68,.08);color:rgba(255,255,255,.8)}
  .admin-nav-item.active{background:rgba(239,68,68,.18);color:white;border:1px solid rgba(239,68,68,.25)}
  .admin-main{flex:1;overflow:auto;padding:28px;background:#0f0505}
  .admin-header h1{font-family:'Fredoka One',cursive;font-size:1.9rem;color:white;margin-bottom:3px}
  .admin-header p{color:rgba(255,255,255,.4);font-weight:600;font-size:.88rem;margin-bottom:24px}
  .admin-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
  .admin-stat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px;border-left:3px solid}
  .admin-stat .n{font-family:'Fredoka One',cursive;font-size:2rem;color:white}
  .admin-stat .l{font-size:.7rem;color:rgba(255,255,255,.35);font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
  .account-table-wrap{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;overflow:hidden}
  .account-table{width:100%;border-collapse:collapse}
  .account-table th{padding:12px 16px;background:rgba(255,255,255,.04);text-align:left;font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.3);font-weight:800;border-bottom:1px solid rgba(255,255,255,.07)}
  .account-table td{padding:12px 16px;font-size:.85rem;color:rgba(255,255,255,.75);font-weight:600;border-bottom:1px solid rgba(255,255,255,.04)}
  .account-table tr:last-child td{border-bottom:none}
  .account-table tr:hover td{background:rgba(255,255,255,.03)}
  .role-badge{padding:3px 9px;border-radius:50px;font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em}
  .role-badge.admin{background:rgba(239,68,68,.18);color:#f87171;border:1px solid rgba(239,68,68,.3)}
  .role-badge.teacher{background:rgba(124,58,237,.18);color:#a78bfa;border:1px solid rgba(124,58,237,.3)}
  .role-badge.student{background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.25)}
  .status-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:5px}
  .status-dot.active{background:#34d399;box-shadow:0 0 6px rgba(52,211,153,.6)}
  .status-dot.suspended{background:#f87171;box-shadow:0 0 6px rgba(248,113,113,.5)}
  .status-dot.inactive{background:rgba(255,255,255,.2)}
  .search-bar{width:100%;padding:11px 16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:12px;font-family:'Nunito',sans-serif;font-size:.9rem;color:white;outline:none;transition:border-color .2s}
  .search-bar::placeholder{color:rgba(255,255,255,.2)}
  .search-bar:focus{border-color:rgba(239,68,68,.4);box-shadow:0 0 0 3px rgba(239,68,68,.1)}
  .tab-row{display:flex;gap:4px;background:rgba(255,255,255,.04);border-radius:12px;padding:4px;margin-bottom:20px;border:1px solid rgba(255,255,255,.06)}
  .tab-btn{flex:1;padding:9px;border:none;border-radius:9px;font-family:'Nunito',sans-serif;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .2s;background:transparent;color:rgba(255,255,255,.4)}
  .tab-btn.active{background:rgba(255,255,255,.08);color:white}
  .admin-modal{background:linear-gradient(160deg,#1a0808,#1f0a0a);border:1px solid rgba(239,68,68,.2)}
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(16,185,129,.9);color:white;padding:12px 24px;border-radius:50px;font-weight:800;font-size:.9rem;z-index:999;animation:pop-in .3s;box-shadow:0 8px 24px rgba(0,0,0,.4)}
  .toast.error{background:rgba(239,68,68,.9)}
  .spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,.2);border-top-color:white;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
  .log-entry{padding:9px 14px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);margin-bottom:6px;display:flex;align-items:center;gap:12px;font-size:.82rem;color:rgba(255,255,255,.65);font-weight:600}
  .log-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}

  /* ── SOCIAL / SIGNUP ── */
  .or-divider{display:flex;align-items:center;gap:12px;margin:18px 0}
  .or-divider::before,.or-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.1)}
  .or-divider span{font-size:.75rem;font-weight:800;color:rgba(255,255,255,.25);text-transform:uppercase;letter-spacing:.1em;white-space:nowrap}

  .social-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:13px 16px;border-radius:13px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);cursor:pointer;transition:all .2s;margin-bottom:9px;font-family:'Nunito',sans-serif;font-size:.92rem;font-weight:800;color:white;position:relative;overflow:hidden}
  .social-btn:hover{background:rgba(255,255,255,.11);border-color:rgba(255,255,255,.25);transform:translateY(-1px)}
  .social-btn:active{transform:translateY(0)}
  .social-btn.google{border-color:rgba(66,133,244,.35);background:rgba(66,133,244,.08)}
  .social-btn.google:hover{background:rgba(66,133,244,.15);border-color:rgba(66,133,244,.5)}
  .social-btn.microsoft{border-color:rgba(0,120,212,.35);background:rgba(0,120,212,.08)}
  .social-btn.microsoft:hover{background:rgba(0,120,212,.15);border-color:rgba(0,120,212,.5)}
  .social-btn.apple{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.07)}
  .social-btn.apple:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.35)}
  .social-btn-icon{width:20px;height:20px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .social-shimmer{position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);transition:left .5s}
  .social-btn:hover .social-shimmer{left:150%}

  .signup-step-pill{display:flex;align-items:center;gap:6px;justify-content:center;margin-bottom:22px}
  .step-dot{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.15);transition:all .3s}
  .step-dot.done{background:#34d399;box-shadow:0 0 8px rgba(52,211,153,.5)}
  .step-dot.active{background:#a78bfa;box-shadow:0 0 10px rgba(167,139,250,.6);transform:scale(1.3)}

  .signup-card-title{font-family:'Fredoka One',cursive;font-size:1.5rem;color:white;margin-bottom:4px;text-align:center}
  .signup-card-sub{font-size:.8rem;color:rgba(255,255,255,.4);font-weight:700;text-align:center;margin-bottom:22px}

  .class-code-input-wrap{position:relative;margin-bottom:6px}
  .class-code-input{width:100%;padding:18px 16px;background:rgba(255,255,255,.06);border:2px solid rgba(167,139,250,.3);border-radius:16px;font-family:'Fredoka One',cursive;font-size:1.8rem;font-weight:900;color:white;outline:none;transition:all .2s;text-align:center;letter-spacing:.35em;text-transform:uppercase}
  .class-code-input::placeholder{color:rgba(255,255,255,.15);letter-spacing:.1em;font-size:1.2rem}
  .class-code-input:focus{border-color:#a78bfa;box-shadow:0 0 0 4px rgba(167,139,250,.2)}
  .class-code-input.valid{border-color:#34d399;box-shadow:0 0 0 4px rgba(52,211,153,.15)}
  .class-code-input.invalid{border-color:#f87171;box-shadow:0 0 0 4px rgba(248,113,113,.12)}
  .code-validation-msg{text-align:center;font-size:.8rem;font-weight:700;margin-top:8px;height:18px}

  .found-class-pill{display:inline-flex;align-items:center;gap:7px;padding:6px 14px;border-radius:50px;font-size:.82rem;font-weight:800;border:1px solid;animation:bounce-in .4s}

  /* Teacher class code panel */
  .code-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:20px;margin-bottom:12px}
  .code-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .code-card-title{font-weight:800;color:white;font-size:.95rem}
  .big-code{font-family:'Fredoka One',cursive;font-size:2.6rem;letter-spacing:.3em;color:white;text-shadow:0 0 20px rgba(167,139,250,.5);text-align:center;padding:18px 0;cursor:pointer;transition:all .2s}
  .big-code:hover{color:#a78bfa;text-shadow:0 0 30px rgba(167,139,250,.8)}
  .code-copy-hint{text-align:center;font-size:.72rem;color:rgba(255,255,255,.25);font-weight:600;margin-bottom:12px}
  .code-meta-row{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(255,255,255,.06)}
  .btn-regen{padding:7px 14px;border-radius:9px;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.25);color:#a78bfa;font-family:'Nunito',sans-serif;font-weight:800;font-size:.78rem;cursor:pointer;transition:all .2s}
  .btn-regen:hover{background:rgba(167,139,250,.22)}
  .code-share-row{display:flex;gap:7px;margin-top:12px}
  .btn-share{flex:1;padding:9px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:rgba(255,255,255,.6);font-family:'Nunito',sans-serif;font-weight:700;font-size:.78rem;cursor:pointer;transition:all .2s;text-align:center}
  .btn-share:hover{background:rgba(255,255,255,.09);color:white}
  .pending-student-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.15);margin-bottom:6px}

  /* ── EAL VOCABULARY BUILDER ── */
  .eal-screen{min-height:100vh;background:radial-gradient(ellipse at 20% 0%,rgba(6,182,212,.18) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(16,185,129,.12) 0%,transparent 50%),linear-gradient(180deg,#0e0a2e 0%,#0a1628 100%);position:relative;z-index:1}

  .lang-search{width:100%;padding:12px 16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);border-radius:12px;font-family:'Nunito',sans-serif;font-size:.95rem;font-weight:700;color:white;outline:none;margin-bottom:14px}
  .lang-search::placeholder{color:rgba(255,255,255,.25)}
  .lang-search:focus{border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,.2)}

  .lang-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;max-height:480px;overflow-y:auto;padding-right:4px}
  .lang-grid::-webkit-scrollbar{width:4px}
  .lang-grid::-webkit-scrollbar-track{background:rgba(255,255,255,.04);border-radius:4px}
  .lang-grid::-webkit-scrollbar-thumb{background:rgba(56,189,248,.3);border-radius:4px}
  .lang-btn{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);cursor:pointer;transition:all .2s;text-align:left;width:100%}
  .lang-btn:hover{background:rgba(56,189,248,.1);border-color:rgba(56,189,248,.3);transform:scale(1.02)}
  .lang-btn.selected{background:rgba(56,189,248,.18);border-color:rgba(56,189,248,.5);box-shadow:0 0 14px rgba(56,189,248,.2)}
  .lang-flag{font-size:1.4rem;flex-shrink:0}
  .lang-names{flex:1;min-width:0}
  .lang-name-en{font-size:.82rem;font-weight:800;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .lang-name-native{font-size:.72rem;color:rgba(255,255,255,.4);font-weight:600;margin-top:1px}

  .cat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px}
  .cat-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:18px 14px;cursor:pointer;transition:all .25s cubic-bezier(.34,1.2,.64,1);text-align:center;position:relative;overflow:hidden}
  .cat-card:hover{transform:translateY(-5px) scale(1.02);background:rgba(56,189,248,.1);border-color:rgba(56,189,248,.35);box-shadow:0 12px 30px rgba(56,189,248,.2)}
  .cat-card .cat-emoji{font-size:2.4rem;display:block;margin-bottom:6px}
  .cat-card .cat-name{font-weight:800;font-size:.88rem;color:white}
  .cat-card .cat-count{font-size:.72rem;color:rgba(255,255,255,.4);font-weight:600;margin-top:2px}
  .cat-card .cat-done{position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:50%;background:#34d399;display:flex;align-items:center;justify-content:center;font-size:.62rem;color:white;font-weight:900}

  .flashcard-wrap{perspective:1000px;width:100%;max-width:420px;margin:0 auto 20px;height:260px;cursor:pointer}
  .flashcard{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.4,0,.2,1)}
  .flashcard.flipped{transform:rotateY(180deg)}
  .flashcard-face{position:absolute;inset:0;backface-visibility:hidden;border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;border:1px solid;box-shadow:0 12px 40px rgba(0,0,0,.35)}
  .flashcard-front{background:linear-gradient(135deg,rgba(6,182,212,.18),rgba(16,185,129,.12));border-color:rgba(6,182,212,.3)}
  .flashcard-back {background:linear-gradient(135deg,rgba(124,58,237,.2),rgba(168,85,247,.12));border-color:rgba(167,139,250,.3);transform:rotateY(180deg)}
  .flashcard-emoji{font-size:5rem;line-height:1;margin-bottom:12px;filter:drop-shadow(0 4px 12px rgba(0,0,0,.3))}
  .flashcard-word{font-family:'Fredoka One',cursive;font-size:2rem;color:white;text-align:center;word-break:break-word}
  .flashcard-lang-label{font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.12em;opacity:.5;margin-bottom:6px}
  .flashcard-phonetic{font-size:.85rem;color:rgba(255,255,255,.5);margin-top:6px;font-style:italic;font-weight:600}
  .flashcard-tap-hint{font-size:.72rem;color:rgba(255,255,255,.3);font-weight:600;margin-top:8px;display:flex;align-items:center;gap:4px}
  .flashcard-rtl{direction:rtl;font-size:1.9rem}

  .card-nav{display:flex;align-items:center;justify-content:space-between;max-width:420px;margin:0 auto 20px;gap:12px}
  .card-nav-btn{width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:white;font-size:1.2rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center}
  .card-nav-btn:hover{background:rgba(56,189,248,.15);border-color:rgba(56,189,248,.35)}
  .card-nav-btn:disabled{opacity:.25;pointer-events:none}
  .card-counter{font-family:'Fredoka One',cursive;font-size:1.1rem;color:rgba(255,255,255,.6)}

  .mode-tabs{display:flex;gap:6px;background:rgba(255,255,255,.05);border-radius:12px;padding:4px;margin-bottom:20px;border:1px solid rgba(255,255,255,.08)}
  .mode-tab{flex:1;padding:9px;border:none;border-radius:9px;font-family:'Nunito',sans-serif;font-size:.82rem;font-weight:800;cursor:pointer;transition:all .2s;background:transparent;color:rgba(255,255,255,.4)}
  .mode-tab.active{background:rgba(56,189,248,.18);color:#38bdf8;border:1px solid rgba(56,189,248,.25)}

  .quiz-emoji-big{font-size:5rem;text-align:center;display:block;margin:10px 0 6px;filter:drop-shadow(0 4px 16px rgba(0,0,0,.4))}
  .quiz-prompt{text-align:center;margin-bottom:18px}
  .quiz-prompt .qp-label{font-size:.72rem;font-weight:800;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
  .quiz-prompt .qp-word{font-family:'Fredoka One',cursive;font-size:1.8rem;color:white}
  .quiz-prompt .qp-word.rtl{direction:rtl;font-size:1.6rem}
  .quiz-opts{display:grid;grid-template-columns:1fr 1fr;gap:9px}
  .quiz-opt{padding:16px 12px;border-radius:14px;border:1.5px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);font-family:'Nunito',sans-serif;font-size:.95rem;font-weight:800;color:white;cursor:pointer;transition:all .2s;text-align:center}
  .quiz-opt:hover{border-color:#38bdf8;background:rgba(56,189,248,.1);transform:scale(1.03)}
  .quiz-opt.correct-ans{border-color:#34d399;background:rgba(52,211,153,.15);color:#34d399;animation:bounce-in .4s}
  .quiz-opt.wrong-ans{border-color:#f87171;background:rgba(248,113,113,.1);color:#f87171}

  .eal-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:16px}
  .eal-loading-text{font-weight:700;color:rgba(255,255,255,.5);font-size:.9rem}
  .eal-spinner{width:40px;height:40px;border:3px solid rgba(56,189,248,.2);border-top-color:#38bdf8;border-radius:50%;animation:spin .8s linear infinite}

  .vocab-complete{text-align:center;padding:40px 20px}
  .vocab-stars{font-size:3rem;margin-bottom:12px;display:block;animation:drift 2s ease-in-out infinite}

  @media(max-width:600px){.lang-grid{grid-template-columns:1fr}.cat-grid{grid-template-columns:1fr 1fr}.quiz-opts{grid-template-columns:1fr}}
`;

// ═══════════════════════════════════════════════════════════════
// PERSISTENT STORAGE HOOK
// ═══════════════════════════════════════════════════════════════
function useStorage(key, defaultVal) {
  const [value, setValue] = useState(defaultVal);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch (_) {}
    setLoaded(true);
  }, [key]);

  const save = useCallback((newVal) => {
    const resolved = typeof newVal === "function" ? newVal(value) : newVal;
    setValue(resolved);
    try { localStorage.setItem(key, JSON.stringify(resolved)); } catch (_) {}
  }, [key, value]);

  return [value, save, loaded];
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT SEED DATA
// ═══════════════════════════════════════════════════════════════
const SEED_ACCOUNTS = [
  { id:"acc-admin-1", role:"admin",   name:"System Admin",   email:"admin@wordwizards.com",   password:"admin2024",   status:"active",  createdAt:"2024-01-01" },
  { id:"acc-t-1",     role:"teacher", name:"Miss Taylor",    email:"taylor@school.ac.uk",     password:"teacher123",  status:"active",  school:"Oakfield Primary", createdAt:"2024-09-01" },
  { id:"acc-t-2",     role:"teacher", name:"Mr Patel",       email:"patel@school.ac.uk",      password:"teacher123",  status:"active",  school:"Oakfield Primary", createdAt:"2024-09-01" },
  { id:"acc-s-1",     role:"student", name:"Amara Johnson",  username:"amara.j",              password:"star123",     status:"active",  class:"6A", year:"Y6", avatar:"🦁", pts:1240, streak:12, skills:{sentences:"high",punctuation:"high",grammar:"mid",spag:"mid"} },
  { id:"acc-s-2",     role:"student", name:"Noah Williams",  username:"noah.w",               password:"star123",     status:"active",  class:"6A", year:"Y6", avatar:"🐯", pts:980,  streak:5,  skills:{sentences:"mid",punctuation:"mid",grammar:"low",spag:"low"} },
  { id:"acc-s-3",     role:"student", name:"Isla Patel",     username:"isla.p",               password:"star123",     status:"active",  class:"5B", year:"Y5", avatar:"🦋", pts:860,  streak:8,  skills:{sentences:"high",punctuation:"mid",grammar:"mid",spag:"mid"} },
  { id:"acc-s-4",     role:"student", name:"Theo Brown",     username:"theo.b",               password:"star123",     status:"active",  class:"6B", year:"Y6", avatar:"🐸", pts:720,  streak:3,  skills:{sentences:"mid",punctuation:"low",grammar:"mid",spag:"low"} },
  { id:"acc-s-5",     role:"student", name:"Sophia Chen",    username:"sophia.c",             password:"star123",     status:"active",  class:"5A", year:"Y5", avatar:"🦄", pts:1100, streak:15, skills:{sentences:"high",punctuation:"high",grammar:"high",spag:"mid"} },
  { id:"acc-s-6",     role:"student", name:"Eli Okafor",     username:"eli.o",                password:"star123",     status:"suspended",class:"4A", year:"Y4", avatar:"🐙", pts:640,  streak:4,  skills:{sentences:"mid",punctuation:"mid",grammar:"low",spag:"low"} },
  { id:"acc-s-7",     role:"student", name:"Mia Roberts",    username:"mia.r",                password:"star123",     status:"active",  class:"4A", year:"Y4", avatar:"🐨", pts:590,  streak:2,  skills:{sentences:"mid",punctuation:"low",grammar:"low",spag:"low"} },
  { id:"acc-s-8",     role:"student", name:"Oscar Lee",      username:"oscar.l",              password:"star123",     status:"active",  class:"6A", year:"Y6", avatar:"🦖", pts:1050, streak:9,  skills:{sentences:"high",punctuation:"high",grammar:"high",spag:"high"} },
];

const SEED_PATHWAYS = [
  { id:"pw-1", name:"KS1 Foundations",    desc:"Basic sentence structure, capital letters & full stops", color:"#22c55e", icon:"🌱", activities:["sentences","colourful"], difficulty:"KS1", targetYear:["Y1","Y2","Y3"], assignedStudents:["acc-s-7"], active:true, createdBy:"acc-t-1", createdAt:"2025-01-10" },
  { id:"pw-2", name:"KS2 Grammar Journey", desc:"Nouns, verbs, adjectives, adverbs & conjunctions",      color:"#3b82f6", icon:"🚀", activities:["grammar","sentences"],   difficulty:"KS2", targetYear:["Y4","Y5"],     assignedStudents:["acc-s-3","acc-s-5","acc-s-6","acc-s-7"], active:true, createdBy:"acc-t-1", createdAt:"2025-01-12" },
  { id:"pw-3", name:"Punctuation Power",   desc:"Commas, apostrophes, speech marks & colons",            color:"#f97316", icon:"⚡", activities:["punctuation"],          difficulty:"KS2", targetYear:["Y4","Y5","Y6"], assignedStudents:["acc-s-2","acc-s-4","acc-s-6","acc-s-7"], active:true, createdBy:"acc-t-2", createdAt:"2025-02-01" },
  { id:"pw-4", name:"Year 6 SATs Prep",    desc:"Full SPAG SATs test preparation pathway",               color:"#a855f7", icon:"⭐", activities:["spag","grammar","punctuation"], difficulty:"SATs", targetYear:["Y6"], assignedStudents:["acc-s-1","acc-s-2","acc-s-4","acc-s-8"], active:true, createdBy:"acc-t-1", createdAt:"2025-02-10" },
];

const SEED_LOGS = [
  { id:1, type:"login",   user:"Miss Taylor",  detail:"Teacher login",              ts:"2026-03-13 08:41" },
  { id:2, type:"create",  user:"Admin",        detail:"Student account: Isla Patel", ts:"2026-03-12 14:22" },
  { id:3, type:"pathway", user:"Miss Taylor",  detail:"Pathway created: SATs Prep",  ts:"2026-03-11 09:00" },
  { id:4, type:"suspend", user:"Admin",        detail:"Account suspended: Eli O",    ts:"2026-03-10 16:10" },
];

// Class codes — teachers share these with pupils to self-enrol
const SEED_CLASSES = [
  { id:"cl-1", name:"Class 6A", year:"Year 6", teacherId:"acc-t-1", color:"#a855f7", code:"WIZA6A", students:["acc-s-1","acc-s-2","acc-s-8"] },
  { id:"cl-2", name:"Class 6B", year:"Year 6", teacherId:"acc-t-1", color:"#ec4899", code:"WIZB6B", students:["acc-s-4"] },
  { id:"cl-3", name:"Class 5A", year:"Year 5", teacherId:"acc-t-2", color:"#14b8a6", code:"WIZ5AA", students:["acc-s-5"] },
  { id:"cl-4", name:"Class 5B", year:"Year 5", teacherId:"acc-t-2", color:"#f97316", code:"WIZ5BB", students:["acc-s-3"] },
  { id:"cl-5", name:"Class 4A", year:"Year 4", teacherId:"acc-t-1", color:"#3b82f6", code:"WIZ4AA", students:["acc-s-6","acc-s-7"] },
];
const AVATARS = ["🦁","🐯","🐻","🦊","🐧","🦄","🐸","🐨","🐺","🦋","🐙","🦖","🐬","🦓","🦕"];
const COLORS  = ["#7c3aed","#ec4899","#14b8a6","#f97316","#3b82f6","#22c55e"];

const ACTIVITY_META = {
  sentences:   { label:"Sentence Builder",   color:"#7c3aed", icon:"✦" },
  colourful:   { label:"Colourful Sentences", color:"#f97316", icon:"🌈" },
  punctuation: { label:"Punctuation Quest",   color:"#ec4899", icon:"⚡" },
  grammar:     { label:"Grammar Galaxy",      color:"#14b8a6", icon:"◎" },
  spag:        { label:"SATs Academy",        color:"#f59e0b", icon:"⭐" },
  eal:         { label:"Vocabulary Builder",  color:"#06b6d4", icon:"🌍" },
};

const SENTENCE_QUESTIONS=[{id:1,type:"word_order",instruction:"Build a sentence:",words:["The","big","dog","ran","quickly","away"],answer:"The big dog ran quickly away",hint:"Start with 'The'",points:15},{id:2,type:"word_order",instruction:"Arrange into a question:",words:["is","What","your","favourite","colour","?"],answer:"What is your favourite colour ?",hint:"Questions start with 'What', 'Where', 'When', 'Who'",points:15},{id:3,type:"multiple_choice",instruction:"Which sentence is punctuated correctly?",options:["the cat sat on the mat.","The cat sat on the mat.","The cat sat on the mat","The Cat sat on the mat."],answer:"The cat sat on the mat.",points:10},{id:4,type:"multiple_choice",instruction:"Choose the correct sentence:",options:["I goed to the shops yesterday.","I went to the shops yesterday.","I go to the shops yesterday.","I going to the shops yesterday."],answer:"I went to the shops yesterday.",points:10},{id:5,type:"multiple_choice",instruction:"Which word is a noun?",options:["quickly","jump","yellow","happiness"],answer:"happiness",hint:"Nouns are naming words",points:10}];
const PUNCTUATION_QUESTIONS=[{id:1,type:"multiple_choice",instruction:"Which punctuation ends this sentence?\n'Where are you going'",options:[".","!","?",","],answer:"?",points:10},{id:2,type:"multiple_choice",instruction:"Apostrophe: 'The dogs bone was buried.'",options:["dog's","dogs'","d'ogs","dogs"],answer:"dog's",points:10},{id:3,type:"multiple_choice",instruction:"Correct comma usage?",options:["I bought apples, bananas and oranges.","I bought, apples bananas, and oranges.","I bought apples bananas, and, oranges.","I, bought apples bananas and oranges."],answer:"I bought apples, bananas and oranges.",points:10},{id:4,type:"multiple_choice",instruction:"'I was tired ___ I went to bed early.'",options:["semicolon (;)","comma (,)","exclamation mark (!)","question mark (?)"],answer:"semicolon (;)",points:15}];
const GRAMMAR_QUESTIONS=[{id:1,type:"multiple_choice",instruction:"What type of word is 'beautiful'?",options:["Noun","Verb","Adjective","Adverb"],answer:"Adjective",points:10},{id:2,type:"multiple_choice",instruction:"ADVERB: 'She spoke very quietly.'",options:["She","spoke","very","quietly"],answer:"quietly",hint:"Adverbs describe HOW",points:10},{id:3,type:"multiple_choice",instruction:"Which is a COMPOUND sentence?",options:["The dog barked.","The dog barked and the cat ran away.","Because the dog barked.","Barking loudly, the dog."],answer:"The dog barked and the cat ran away.",points:15},{id:4,type:"multiple_choice",instruction:"Which word is a CONJUNCTION?",options:["run","because","slowly","happy"],answer:"because",points:10}];
const SPAG_QUESTIONS=[{id:1,type:"multiple_choice",instruction:"Which is in the PASSIVE voice?",options:["The chef cooked the meal.","The meal was cooked by the chef.","The chef was cooking the meal.","The chef has cooked the meal."],answer:"The meal was cooked by the chef.",points:20},{id:2,type:"multiple_choice",instruction:"RELATIVE CLAUSE:\n'The book ___ I borrowed was fascinating.'",options:["what","who","which","where"],answer:"which",points:20},{id:3,type:"multiple_choice",instruction:"SUBJUNCTIVE:\n'The teacher insisted that he ___ quiet.'",options:["is","was","be","being"],answer:"be",points:20},{id:4,type:"multiple_choice",instruction:"FRONTED ADVERBIAL?",options:["I went to the park yesterday.","Yesterday I went to the park.","Yesterday, I went to the park.","I, yesterday, went to the park."],answer:"Yesterday, I went to the park.",points:20},{id:5,type:"multiple_choice",instruction:"SYNONYM for 'benevolent'?",options:["cruel","kind","brave","clever"],answer:"kind",points:15}];
const CS_COLOUR_KEY=[{role:"WHO?",color:"#f97316",emoji:"� "},{role:"WHAT DOING?",color:"#eab308",emoji:"🟡"},{role:"WHAT?",color:"#22c55e",emoji:"🟢"},{role:"WHERE?",color:"#3b82f6",emoji:"🔵"}];
const CS_QUESTIONS=[{id:1,scene:"🐕🏃",sceneDesc:"Look at the picture!",slots:[{role:"WHO?",color:"#f97316",answer:"The dog"},{role:"WHAT DOING?",color:"#eab308",answer:"is running"},{role:"WHERE?",color:"#3b82f6",answer:"in the park"}],chips:[{text:"The dog",color:"#f97316"},{text:"is running",color:"#eab308"},{text:"in the park",color:"#3b82f6"},{text:"the cat",color:"#f97316"},{text:"on the bed",color:"#3b82f6"}],points:15},{id:2,scene:"👧🍎",sceneDesc:"What is the girl doing?",slots:[{role:"WHO?",color:"#f97316",answer:"A girl"},{role:"WHAT DOING?",color:"#eab308",answer:"is eating"},{role:"WHAT?",color:"#22c55e",answer:"an apple"}],chips:[{text:"A girl",color:"#f97316"},{text:"is eating",color:"#eab308"},{text:"an apple",color:"#22c55e"},{text:"a biscuit",color:"#22c55e"},{text:"is jumping",color:"#eab308"}],points:15},{id:3,scene:"😺🛋️",sceneDesc:"What is the cat doing?",slots:[{role:"WHO?",color:"#f97316",answer:"The cat"},{role:"WHAT DOING?",color:"#eab308",answer:"is sleeping"},{role:"WHERE?",color:"#3b82f6",answer:"on the sofa"}],chips:[{text:"The cat",color:"#f97316"},{text:"is sleeping",color:"#eab308"},{text:"on the sofa",color:"#3b82f6"},{text:"The dog",color:"#f97316"},{text:"in the garden",color:"#3b82f6"},{text:"is playing",color:"#eab308"}],points:15},{id:4,scene:"👩‍🏫📖",sceneDesc:"What is the teacher doing?",slots:[{role:"WHO?",color:"#f97316",answer:"The teacher"},{role:"WHAT DOING?",color:"#eab308",answer:"is reading"},{role:"WHAT?",color:"#22c55e",answer:"a story"},{role:"WHERE?",color:"#3b82f6",answer:"in the classroom"}],chips:[{text:"The teacher",color:"#f97316"},{text:"is reading",color:"#eab308"},{text:"a story",color:"#22c55e"},{text:"in the classroom",color:"#3b82f6"},{text:"a letter",color:"#22c55e"},{text:"in the library",color:"#3b82f6"},{text:"is writing",color:"#eab308"}],points:20},{id:5,scene:"🐦🌳",sceneDesc:"What can you see?",slots:[{role:"WHO?",color:"#f97316",answer:"A little bird"},{role:"WHAT DOING?",color:"#eab308",answer:"is singing"},{role:"WHERE?",color:"#3b82f6",answer:"in the tree"}],chips:[{text:"A little bird",color:"#f97316"},{text:"is singing",color:"#eab308"},{text:"in the tree",color:"#3b82f6"},{text:"A big owl",color:"#f97316"},{text:"is flying",color:"#eab308"},{text:"on a branch",color:"#3b82f6"}],points:15},{id:6,scene:"👦⚽🌿",sceneDesc:"What is happening?",slots:[{role:"WHO?",color:"#f97316",answer:"The boy"},{role:"WHAT DOING?",color:"#eab308",answer:"is kicking"},{role:"WHAT?",color:"#22c55e",answer:"a football"},{role:"WHERE?",color:"#3b82f6",answer:"in the garden"}],chips:[{text:"The boy",color:"#f97316"},{text:"is kicking",color:"#eab308"},{text:"a football",color:"#22c55e"},{text:"in the garden",color:"#3b82f6"},{text:"The girl",color:"#f97316"},{text:"a tennis ball",color:"#22c55e"},{text:"in the park",color:"#3b82f6"}],points:20}];
const SPAG_TOPICS=[{name:"Nouns & Pronouns",icon:"🏷️",qs:8,color:"#a855f7",status:"completed"},{name:"Verbs & Tenses",icon:"⏰",qs:10,color:"#ec4899",status:"completed"},{name:"Adjectives & Adverbs",icon:"✨",qs:8,color:"#14b8a6",status:"in-progress"},{name:"Clauses & Phrases",icon:"🔗",qs:10,color:"#f97316",status:"locked"},{name:"Passive Voice",icon:"🔄",qs:6,color:"#3b82f6",status:"locked"},{name:"Punctuation Mastery",icon:"❗",qs:12,color:"#22c55e",status:"locked"},{name:"Vocabulary",icon:"📚",qs:8,color:"#fbbf24",status:"locked"},{name:"Practice Paper",icon:"📝",qs:40,color:"#6B21E8",status:"locked"}];

// ─── EAL DATA ───────────────────────────────────────────────────
const EAL_LANGUAGES = [
  {code:"ar",name:"Arabic",     native:"العربية",       flag:"🇸🇦",rtl:true},
  {code:"am",name:"Amharic",    native:"� ማርኛ",          flag:"🇪🇹"},
  {code:"sq",name:"Albanian",   native:"Shqip",         flag:"🇦🇱"},
  {code:"bn",name:"Bengali",    native:"বাংলা",          flag:"🇧🇩"},
  {code:"bs",name:"Bosnian",    native:"Bosanski",      flag:"🇧🇦"},
  {code:"bg",name:"Bulgarian",  native:"Български",     flag:"🇧🇬"},
  {code:"hr",name:"Croatian",   native:"Hrvatski",      flag:"🇭🇷"},
  {code:"cs",name:"Czech",      native:"Čeština",       flag:"🇨🇿"},
  {code:"nl",name:"Dutch",      native:"Nederlands",    flag:"🇳🇱"},
  {code:"et",name:"Estonian",   native:"Eesti",         flag:"🇪🇪"},
  {code:"fa",name:"Farsi",      native:"فارسی",          flag:"🇮🇷",rtl:true},
  {code:"fr",name:"French",     native:"Français",      flag:"🇫🇷"},
  {code:"de",name:"German",     native:"Deutsch",       flag:"🇩🇪"},
  {code:"el",name:"Greek",      native:"Ελληνικά",      flag:"🇬🇷"},
  {code:"gu",name:"Gujarati",   native:"ગુજરાતી",        flag:"🇮🇳"},
  {code:"hi",name:"Hindi",      native:"हिन्दी",         flag:"🇮🇳"},
  {code:"hu",name:"Hungarian",  native:"Magyar",        flag:"🇭🇺"},
  {code:"id",name:"Indonesian", native:"Bahasa Indonesia",flag:"🇮🇩"},
  {code:"it",name:"Italian",    native:"Italiano",      flag:"🇮🇹"},
  {code:"ja",name:"Japanese",   native:"日本語",          flag:"🇯🇵"},
  {code:"ko",name:"Korean",     native:"한국어",          flag:"🇰🇷"},
  {code:"lv",name:"Latvian",    native:"Latviešu",      flag:"🇱🇻"},
  {code:"lt",name:"Lithuanian", native:"Lietuvių",      flag:"🇱🇹"},
  {code:"mk",name:"Macedonian", native:"Македонски",    flag:"🇲🇰"},
  {code:"ms",name:"Malay",      native:"Bahasa Melayu", flag:"🇲🇾"},
  {code:"mr",name:"Marathi",    native:"मरा� ी",          flag:"🇮🇳"},
  {code:"ne",name:"Nepali",     native:"नेपाली",         flag:"🇳🇵"},
  {code:"pa",name:"Punjabi",    native:"ਪੰਜਾਬੀ",          flag:"🇮🇳"},
  {code:"ps",name:"Pashto",     native:"پښتو",            flag:"🇦🇫",rtl:true},
  {code:"pl",name:"Polish",     native:"Polski",        flag:"🇵🇱"},
  {code:"pt",name:"Portuguese", native:"Português",     flag:"🇧🇷"},
  {code:"ro",name:"Romanian",   native:"Română",        flag:"🇷🇴"},
  {code:"ru",name:"Russian",    native:"� усский",       flag:"🇷🇺"},
  {code:"sr",name:"Serbian",    native:"Српски",        flag:"🇷🇸"},
  {code:"si",name:"Sinhala",    native:"සිංහල",         flag:"🇱🇰"},
  {code:"sk",name:"Slovak",     native:"Slovenčina",    flag:"🇸🇰"},
  {code:"sl",name:"Slovenian",  native:"Slovenščina",   flag:"🇸🇮"},
  {code:"so",name:"Somali",     native:"Soomaali",      flag:"🇸🇴"},
  {code:"es",name:"Spanish",    native:"Español",       flag:"🇪🇸"},
  {code:"sw",name:"Swahili",    native:"Kiswahili",     flag:"🇰🇪"},
  {code:"tl",name:"Tagalog",    native:"Filipino",      flag:"🇵🇭"},
  {code:"ta",name:"Tamil",      native:"தமிழ்",          flag:"🇱🇰"},
  {code:"th",name:"Thai",       native:"� าษาไทย",        flag:"🇹🇭"},
  {code:"ti",name:"Tigrinya",   native:"ትግርኛ",          flag:"🇪🇷"},
  {code:"tr",name:"Turkish",    native:"Türkçe",        flag:"🇹🇷"},
  {code:"uk",name:"Ukrainian",  native:"Українська",    flag:"🇺🇦"},
  {code:"ur",name:"Urdu",       native:"اردو",           flag:"🇵🇰",rtl:true},
  {code:"vi",name:"Vietnamese", native:"Tiếng Việt",    flag:"🇻🇳"},
  {code:"yo",name:"Yoruba",     native:"Yorùbá",        flag:"🇳🇬"},
  {code:"zh",name:"Chinese",    native:"中文",            flag:"🇨🇳"},
];

const EAL_CATEGORIES = [
  {id:"animals",  label:"Animals",      emoji:"🐾",  icon:"🦁",
   words:[{en:"cat",emoji:"🐱"},{en:"dog",emoji:"🐶"},{en:"fish",emoji:"🐟"},{en:"bird",emoji:"🐦"},{en:"cow",emoji:"🐄"},{en:"horse",emoji:"🐴"},{en:"duck",emoji:"🦆"},{en:"frog",emoji:"🐸"}]},
  {id:"colours",  label:"Colours",      emoji:"🎨",  icon:"🌈",
   words:[{en:"red",emoji:"🔴"},{en:"blue",emoji:"🔵"},{en:"green",emoji:"🟢"},{en:"yellow",emoji:"🟡"},{en:"orange",emoji:"� "},{en:"purple",emoji:"🟣"},{en:"pink",emoji:"🩷"},{en:"brown",emoji:"🟤"}]},
  {id:"numbers",  label:"Numbers",      emoji:"🔢",  icon:"🔢",
   words:[{en:"one",emoji:"1️⃣"},{en:"two",emoji:"2️⃣"},{en:"three",emoji:"3️⃣"},{en:"four",emoji:"4️⃣"},{en:"five",emoji:"5️⃣"},{en:"six",emoji:"6️⃣"},{en:"seven",emoji:"7️⃣"},{en:"eight",emoji:"8️⃣"}]},
  {id:"food",     label:"Food & Drink", emoji:"🍎",  icon:"🍱",
   words:[{en:"apple",emoji:"🍎"},{en:"bread",emoji:"🍞"},{en:"milk",emoji:"🥛"},{en:"water",emoji:"💧"},{en:"banana",emoji:"🍌"},{en:"rice",emoji:"🍚"},{en:"egg",emoji:"🥚"},{en:"orange",emoji:"🍊"}]},
  {id:"school",   label:"School",       emoji:"✏️",  icon:"📚",
   words:[{en:"book",emoji:"📖"},{en:"pen",emoji:"✒️"},{en:"pencil",emoji:"✏️"},{en:"table",emoji:"🪑"},{en:"chair",emoji:"💺"},{en:"teacher",emoji:"👩‍🏫"},{en:"school",emoji:"🏫"},{en:"bag",emoji:"🎒"}]},
  {id:"family",   label:"Family",       emoji:"👨‍👩‍👧", icon:"👨‍👩‍👧",
   words:[{en:"mother",emoji:"👩"},{en:"father",emoji:"👨"},{en:"sister",emoji:"👧"},{en:"brother",emoji:"👦"},{en:"baby",emoji:"👶"},{en:"grandmother",emoji:"👵"},{en:"grandfather",emoji:"👴"},{en:"family",emoji:"👨‍👩‍👧‍👦"}]},
  {id:"body",     label:"Body Parts",   emoji:"🤚",  icon:"🫁",
   words:[{en:"head",emoji:"🗣️"},{en:"eye",emoji:"👁️"},{en:"nose",emoji:"👃"},{en:"mouth",emoji:"👄"},{en:"ear",emoji:"👂"},{en:"hand",emoji:"✋"},{en:"foot",emoji:"🦶"},{en:"arm",emoji:"💪"}]},
  {id:"feelings", label:"Feelings",     emoji:"😊",  icon:"💭",
   words:[{en:"happy",emoji:"😊"},{en:"sad",emoji:"😢"},{en:"tired",emoji:"😴"},{en:"hungry",emoji:"🤤"},{en:"scared",emoji:"😨"},{en:"excited",emoji:"🤩"},{en:"angry",emoji:"� "},{en:"surprised",emoji:"😲"}]},
];

// ═══════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════
function WizardMascot(){return(<svg viewBox="0 0 140 160" xmlns="http://www.w3.org/2000/svg" className="wizard-mascot"><path d="M70 8 L95 70 H45 Z" fill="#4c1d95" stroke="#a78bfa" strokeWidth="2"/><line x1="45" y1="70" x2="95" y2="70" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/><circle cx="70" cy="36" r="5" fill="#fbbf24" opacity="0.9"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/></circle><ellipse cx="70" cy="90" rx="26" ry="28" fill="#fde68a"/><circle cx="61" cy="86" r="5" fill="white"/><circle cx="79" cy="86" r="5" fill="white"/><circle cx="62" cy="87" r="3" fill="#1e1b4b"><animate attributeName="cx" values="62;63;62" dur="4s" repeatCount="indefinite"/></circle><circle cx="80" cy="87" r="3" fill="#1e1b4b"><animate attributeName="cx" values="80;81;80" dur="4s" repeatCount="indefinite"/></circle><circle cx="63.5" cy="85.5" r="1.2" fill="white" opacity="0.9"/><circle cx="81.5" cy="85.5" r="1.2" fill="white" opacity="0.9"/><path d="M57 80 Q61 77 65 80" stroke="#92400e" strokeWidth="1.8" fill="none" strokeLinecap="round"/><path d="M75 80 Q79 77 83 80" stroke="#92400e" strokeWidth="1.8" fill="none" strokeLinecap="round"/><path d="M63 97 Q70 104 77 97" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round"/><circle cx="56" cy="94" r="6" fill="#f87171" opacity="0.25"/><circle cx="84" cy="94" r="6" fill="#f87171" opacity="0.25"/><path d="M44 115 Q36 150 30 160 H110 Q104 150 96 115 Q83 108 70 108 Q57 108 44 115Z" fill="#4c1d95"/><circle cx="55" cy="138" r="2" fill="#fbbf24" opacity="0.7"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/></circle><circle cx="85" cy="145" r="1.5" fill="#a78bfa" opacity="0.8"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.3s" repeatCount="indefinite"/></circle><path d="M44 120 Q25 128 20 140" stroke="#4c1d95" strokeWidth="14" strokeLinecap="round" fill="none"/><path d="M96 120 Q115 128 120 140" stroke="#4c1d95" strokeWidth="14" strokeLinecap="round" fill="none"/><circle cx="20" cy="141" r="8" fill="#fde68a"/><circle cx="120" cy="141" r="8" fill="#fde68a"/><line x1="122" y1="143" x2="136" y2="130" stroke="#92400e" strokeWidth="3" strokeLinecap="round"/><circle cx="136" cy="129" r="5" fill="#fbbf24"><animate attributeName="r" values="4;6;4" dur="1.2s" repeatCount="indefinite"/></circle></svg>)}
function GemQuill({size=54}){return(<svg width={size} height={size} viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="qg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs><polygon points="27,4 46,16 46,38 27,50 8,38 8,16" fill="url(#qg1)" stroke="#a78bfa" strokeWidth="1.5" opacity="0.9"/><polygon points="27,4 46,16 27,22 8,16" fill="#c4b5fd" opacity="0.4"/><path d="M22 38 Q27 20 36 14 Q34 22 30 28 L26 40 Z" fill="white" opacity="0.85"/><line x1="21" y1="39" x2="28" y2="42" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/></svg>)}
function GemRainbow({size=54}){return(<svg width={size} height={size} viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f97316"/><stop offset="33%" stopColor="#facc15"/><stop offset="66%" stopColor="#4ade80"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient></defs><polygon points="27,4 46,16 46,38 27,50 8,38 8,16" fill="url(#rg1)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" opacity="0.9"/><polygon points="27,4 46,16 27,22 8,16" fill="rgba(255,255,255,0.3)"/><path d="M18 30 Q27 22 36 30" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M16 34 Q27 24 38 34" stroke="#facc15" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M20 38 Q27 32 34 38" stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M22 42 Q27 38 32 42" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>)}
function GemLightning({size=54}){return(<svg width={size} height={size} viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f9a8d4"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs><polygon points="27,4 46,16 46,38 27,50 8,38 8,16" fill="url(#lg1)" stroke="#f472b6" strokeWidth="1.5" opacity="0.9"/><polygon points="27,4 46,16 27,22 8,16" fill="#f9a8d4" opacity="0.35"/><path d="M30 12 L20 28 H28 L24 44 L36 26 H28 Z" fill="white" opacity="0.9"/></svg>)}
function GemTelescope({size=54}){return(<svg width={size} height={size} viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5eead4"/><stop offset="100%" stopColor="#14b8a6"/></linearGradient></defs><polygon points="27,4 46,16 46,38 27,50 8,38 8,16" fill="url(#tg1)" stroke="#2dd4bf" strokeWidth="1.5" opacity="0.9"/><polygon points="27,4 46,16 27,22 8,16" fill="#99f6e4" opacity="0.3"/><rect x="16" y="25" width="22" height="7" rx="3.5" fill="white" opacity="0.85" transform="rotate(-30 27 28.5)"/><circle cx="18" cy="16" r="2" fill="white" opacity="0.9"/><circle cx="38" cy="14" r="1.5" fill="white" opacity="0.7"/><circle cx="34" cy="39" r="1.8" fill="white" opacity="0.8"/></svg>)}
function GemCrown({size=54}){return(<svg width={size} height={size} viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs><polygon points="27,4 46,16 46,38 27,50 8,38 8,16" fill="url(#cg1)" stroke="#fbbf24" strokeWidth="1.5" opacity="0.9"/><polygon points="27,4 46,16 27,22 8,16" fill="#fef3c7" opacity="0.4"/><path d="M16 38 L16 24 L20 30 L27 20 L34 30 L38 24 L38 38 Z" fill="white" opacity="0.9"/><line x1="16" y1="38" x2="38" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="27" cy="20" r="2.5" fill="#f59e0b"/><circle cx="16" cy="24" r="2" fill="#f59e0b"/><circle cx="38" cy="24" r="2" fill="#f59e0b"/></svg>)}

function GemWorld({size=54}){return(
  <svg width={size} height={size} viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9"/>
        <stop offset="50%" stopColor="#06b6d4"/>
        <stop offset="100%" stopColor="#0e7490"/>
      </linearGradient>
    </defs>
    <polygon points="27,4 46,16 46,38 27,50 8,38 8,16" fill="url(#wg1)" stroke="#38bdf8" strokeWidth="1.5" opacity="0.95"/>
    <polygon points="27,4 46,16 27,20 8,16" fill="#a5f3fc" opacity="0.35"/>
    <circle cx="27" cy="28" r="12" fill="none" stroke="white" strokeWidth="1.4" opacity="0.8"/>
    <ellipse cx="23" cy="24" rx="5" ry="3.5" fill="white" opacity="0.7" transform="rotate(-20 23 24)"/>
    <ellipse cx="31" cy="30" rx="4" ry="3" fill="white" opacity="0.6" transform="rotate(15 31 30)"/>
    <ellipse cx="24" cy="33" rx="2.5" ry="1.8" fill="white" opacity="0.5"/>
    <path d="M27 16 Q33 22 33 28 Q33 35 27 40" stroke="white" strokeWidth=".7" fill="none" opacity="0.35"/>
    <path d="M27 16 Q21 22 21 28 Q21 35 27 40" stroke="white" strokeWidth=".7" fill="none" opacity="0.35"/>
    <line x1="15" y1="28" x2="39" y2="28" stroke="white" strokeWidth=".7" opacity="0.35"/>
  </svg>
)}

const GEM_MAP = { sentences:GemQuill, colourful:GemRainbow, punctuation:GemLightning, grammar:GemTelescope, spag:GemCrown, eal:GemWorld };

function ParticleBg(){const stars=Array.from({length:60},(_,i)=>({top:Math.random()*100,left:Math.random()*100,size:Math.random()*2+.5,dur:(Math.random()*3+2).toFixed(1),del:(Math.random()*4).toFixed(1)}));const nebulae=[{top:10,left:20,w:400,h:400,color:"#7c3aed"},{top:60,left:70,w:350,h:350,color:"#ec4899"},{top:30,left:55,w:300,h:300,color:"#06b6d4"}];return(<div className="particle-bg">{nebulae.map((n,i)=><div key={i} className="nebula-blob" style={{top:`${n.top}%`,left:`${n.left}%`,width:n.w,height:n.h,background:n.color,"--del":`${i*2}s`}}/>)}{stars.map((s,i)=><div key={i} className="star-dot" style={{top:`${s.top}%`,left:`${s.left}%`,width:s.size,height:s.size,"--dur":`${s.dur}s`,"--del":`${s.del}s`}}/>)}</div>)}

// ═══════════════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════════════
function Toast({message,type="success",onDone}){useEffect(()=>{const t=setTimeout(onDone,2600);return()=>clearTimeout(t)},[]);return <div className={`toast ${type==="error"?"error":""}`}>{message}</div>}

// ═══════════════════════════════════════════════════════════════
// GAME HOOKS & COMPONENTS
// ═══════════════════════════════════════════════════════════════
function useActivity(questions){const[qIdx,setQIdx]=useState(0);const[placed,setPlaced]=useState([]);const[selected,setSelected]=useState(null);const[feedback,setFeedback]=useState(null);const[score,setScore]=useState(0);const[done,setDone]=useState(false);const q=questions[qIdx];function checkAnswer(ans){const correct=ans===q.answer||ans.replace(/ \?/g,"?")===q.answer.replace(/ \?/g,"?");setFeedback(correct?"correct":"wrong");if(correct)setScore(s=>s+q.points)}function submitWordOrder(){checkAnswer(placed.join(" "))}function next(){if(qIdx+1>=questions.length){setDone(true);return}setQIdx(i=>i+1);setPlaced([]);setSelected(null);setFeedback(null)}return{q,qIdx,placed,setPlaced,selected,setSelected,feedback,setFeedback,score,done,checkAnswer,submitWordOrder,next,total:questions.length}}
function Confetti(){const pieces=Array.from({length:24},(_,i)=>({left:Math.random()*100,delay:Math.random()*.8,color:["#a78bfa","#f472b6","#fb923c","#34d399","#38bdf8","#fbbf24"][i%6]}));return(<div style={{position:"fixed",top:0,left:0,width:"100%",height:"220px",pointerEvents:"none",zIndex:999}}>{pieces.map((p,i)=><div key={i} className="confetti-piece" style={{left:`${p.left}%`,background:p.color,animationDelay:`${p.delay}s`}}/>)}</div>)}

function ActivityGame({questions,title,GemIcon,onBack,onComplete}){
  const{q,qIdx,placed,setPlaced,selected,setSelected,feedback,setFeedback,score,done,checkAnswer,submitWordOrder,next,total}=useActivity(questions);
  const[shuffled,setShuffled]=useState([]);
  useEffect(()=>{if(q?.type==="word_order")setShuffled([...q.words].sort(()=>Math.random()-.5))},[qIdx]);
  if(done)return(<div className="activity-screen"><style>{style}</style><Confetti/><div className="activity-body completion-screen"><span className="completion-emoji">🏆</span><div className="completion-title">Quest Complete!</div><p style={{color:"rgba(255,255,255,.5)",fontWeight:700,marginBottom:12}}>You finished {title}</p><span className="completion-pts">+{score} crystals!</span><div style={{marginTop:32}}><button className="btn-primary" onClick={()=>onComplete(score)}>Continue →</button></div></div></div>);
  return(<div className="activity-screen"><style>{style}</style><div className="activity-header"><button className="back-btn" onClick={onBack}>←</button><div style={{display:"flex",alignItems:"center",gap:10}}>{GemIcon&&<GemIcon size={32}/>}<div className="activity-title-bar">{title}</div></div><div style={{marginLeft:"auto",background:"rgba(251,191,36,.15)",border:"1px solid rgba(251,191,36,.3)",padding:"6px 14px",borderRadius:50,fontWeight:800,color:"#fbbf24",fontSize:".9rem"}}>💎 {score}</div></div><div className="activity-body"><div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${(qIdx/total)*100}%`}}/></div><div className="question-card slide-up" key={qIdx}><div className="q-counter">Challenge {qIdx+1} of {total}</div>{q.instruction&&<div className="q-instruction">✦ {q.instruction}</div>}{q.text&&<div className="q-text">{q.text}</div>}{q.type==="word_order"&&(<><p style={{fontWeight:700,color:"rgba(255,255,255,.5)",marginBottom:8,fontSize:".85rem"}}>Build the sentence:</p><div className="sentence-drop">{placed.length===0&&<span style={{color:"rgba(255,255,255,.2)",fontWeight:600,fontSize:".85rem"}}>Tap words below…</span>}{placed.map((w,i)=><div key={i} className="placed-chip" onClick={()=>{setPlaced(p=>p.filter((_,pi)=>pi!==i));setFeedback(null)}}>{w} ✕</div>)}</div><div className="word-bank">{(shuffled.length?shuffled:q.words).map((w,i)=><div key={i} className={`word-chip ${placed.includes(w)?"placed":""}`} onClick={()=>{if(!placed.includes(w)){setPlaced(p=>[...p,w]);setFeedback(null)}}}>{w}</div>)}</div>{feedback===null&&placed.length>0&&<button className="submit-btn" onClick={submitWordOrder}>Check Answer ✓</button>}</>)}{q.type==="multiple_choice"&&<div className="options-grid">{q.options.map((opt,i)=><button key={i} className={`option-btn ${feedback&&opt===q.answer?"correct":""} ${feedback&&selected===opt&&opt!==q.answer?"wrong":""} ${!feedback&&selected===opt?"selected-neutral":""}`} onClick={()=>{if(feedback)return;setSelected(opt);checkAnswer(opt)}}>{opt}</button>)}</div>}{feedback&&<div style={{marginTop:14}}><div className={feedback==="correct"?"feedback-correct":"feedback-wrong"}>{feedback==="correct"?`✦ Brilliant! +${q.points} crystals!`:`✗ The answer was: "${q.answer}"`}</div>{q.hint&&feedback==="wrong"&&<p style={{marginTop:7,fontSize:".82rem",color:"rgba(167,139,250,.8)",fontWeight:700,textAlign:"center"}}>Hint: {q.hint}</p>}<button className="submit-btn" style={{marginTop:11}} onClick={next}>{qIdx+1>=total?"See Results 🏆":"Next Challenge →"}</button></div>}</div></div></div>)
}

function ColourfulSemanticsGame({onBack,onComplete}){
  const[qIdx,setQIdx]=useState(0);const[slots,setSlots]=useState({});const[sel,setSel]=useState(null);const[feedback,setFeedback]=useState(null);const[score,setScore]=useState(0);const[done,setDone]=useState(false);const[shuffled,setShuffled]=useState([]);
  const q=CS_QUESTIONS[qIdx];
  useEffect(()=>{setSlots({});setSel(null);setFeedback(null);setShuffled([...CS_QUESTIONS[qIdx].chips].sort(()=>Math.random()-.5))},[qIdx]);
  const used=Object.values(slots);const allFilled=q.slots.every((_,i)=>slots[i]!==undefined);
  function handleChip(i){if(feedback)return;if(used.includes(shuffled[i].text))return;setSel(p=>p===i?null:i)}
  function handleSlot(si){if(feedback)return;if(sel!==null){setSlots(p=>({...p,[si]:shuffled[sel].text}));setSel(null)}else if(slots[si]!==undefined)setSlots(p=>{const n={...p};delete n[si];return n})}
  function check(){if(!allFilled)return;const ok=q.slots.every((s,i)=>slots[i]===s.answer);setFeedback(ok?"correct":"wrong");if(ok)setScore(s=>s+q.points)}
  function next(){if(qIdx+1>=CS_QUESTIONS.length)setDone(true);else setQIdx(i=>i+1)}
  if(done)return(<div className="activity-screen"><style>{style}</style><Confetti/><div className="activity-body completion-screen"><span className="completion-emoji">🌈</span><div className="completion-title">Brilliant Sentences!</div><span className="completion-pts">+{score} crystals!</span><div style={{marginTop:32}}><button className="btn-primary" onClick={()=>onComplete(score)}>Continue →</button></div></div></div>);
  return(<div className="activity-screen"><style>{style}</style><div className="activity-header"><button className="back-btn" onClick={onBack}>←</button><div style={{display:"flex",alignItems:"center",gap:10}}><GemRainbow size={32}/><div className="activity-title-bar">Colourful Sentences</div></div><div style={{marginLeft:"auto",background:"rgba(251,191,36,.15)",border:"1px solid rgba(251,191,36,.3)",padding:"6px 14px",borderRadius:50,fontWeight:800,color:"#fbbf24",fontSize:".9rem"}}>💎 {score}</div></div><div className="activity-body"><div className="progress-bar-wrap"><div className="progress-bar-fill" style={{width:`${(qIdx/CS_QUESTIONS.length)*100}%`}}/></div><div className="q-counter">Sentence {qIdx+1} of {CS_QUESTIONS.length}</div><div className="cs-key">{CS_COLOUR_KEY.map(k=><div key={k.role} className="cs-key-item" style={{background:k.color}}>{k.emoji} {k.role}</div>)}</div><div className="cs-scene"><span className="cs-scene-emoji">{q.scene}</span><div className="cs-scene-desc">{q.sceneDesc}</div></div><div className="cs-instruction">✦ Tap a word, then tap the matching colour box</div><div className="cs-slots">{q.slots.map((slot,i)=>{let cls="cs-slot";if(feedback==="correct")cls+=" correct-slot";else if(feedback==="wrong")cls+=slots[i]===slot.answer?" correct-slot":" wrong-slot";else if(sel!==null)cls+=" active-target";return(<div key={i} className={cls} style={{borderColor:slot.color}} onClick={()=>handleSlot(i)}><span className="cs-slot-label" style={{background:slot.color}}>{slot.role}</span>{slots[i]!==undefined?<><span className="cs-slot-value">{slots[i]}</span>{!feedback&&<button className="cs-remove-btn" onClick={e=>{e.stopPropagation();setSlots(p=>{const n={...p};delete n[i];return n})}}>✕</button>}{feedback&&<span>{slots[i]===slot.answer?"✅":"❌"}</span>}</>:<span className="cs-slot-empty">tap a word…</span>}</div>)})}</div><div className="cs-sentence-preview">{q.slots.map((slot,i)=>slots[i]!==undefined?<span key={i} className="cs-sentence-word" style={{background:slot.color}}>{slots[i]}</span>:null)}{!allFilled&&<span className="cs-sentence-placeholder">Your sentence will appear here… ✏️</span>}</div><div className="cs-chip-bank"><div className="cs-chip-bank-label">Word Bank</div>{shuffled.map((chip,i)=>{const isUsed=used.includes(chip.text);return<div key={i} className={`cs-chip ${sel===i?"chip-selected":""} ${isUsed?"chip-used":""}`} style={{background:chip.color}} onClick={()=>handleChip(i)}>{chip.text}</div>})}</div>{!feedback?<button className="submit-btn" onClick={check} style={{opacity:allFilled?1:.4,cursor:allFilled?"pointer":"not-allowed"}}>Check My Sentence ✓</button>:<div><div className={feedback==="correct"?"feedback-correct":"feedback-wrong"}>{feedback==="correct"?`✦ Fantastic! +${q.points} crystals!`:"✗ Check the correct sentence below."}</div>{feedback==="wrong"&&<div style={{background:"rgba(167,139,250,.08)",border:"1px solid rgba(167,139,250,.2)",borderRadius:13,padding:12,marginTop:9,display:"flex",flexWrap:"wrap",gap:5}}>{q.slots.map((slot,i)=><span key={i} className="cs-sentence-word" style={{background:slot.color,fontSize:".85rem"}}>{slot.answer}</span>)}</div>}<button className="submit-btn" style={{marginTop:11}} onClick={next}>{qIdx+1>=CS_QUESTIONS.length?"See Results 🏆":"Next Sentence →"}</button></div>}</div></div>)
}

// ═══════════════════════════════════════════════════════════════
// PATHWAY BUILDER MODAL
// ═══════════════════════════════════════════════════════════════
const PATH_COLORS = ["#22c55e","#3b82f6","#f97316","#a855f7","#ec4899","#14b8a6","#fbbf24","#ef4444"];
const PATH_ICONS  = ["🌱","🚀","⚡","⭐","🏆","🔬","📖","🧩","🎯","🌈","🔥","💡"];
const YEAR_OPTS   = ["Y1","Y2","Y3","Y4","Y5","Y6"];
const DIFF_OPTS   = [{id:"KS1",label:"KS1"},{id:"KS2",label:"KS2"},{id:"SATs",label:"SATs Prep"},{id:"custom",label:"Custom"}];

function PathwayBuilderModal({ accounts, onSave, onClose }) {
  const [step, setStep]             = useState(0);
  const [name, setName]             = useState("");
  const [desc, setDesc]             = useState("");
  const [color, setColor]           = useState("#22c55e");
  const [icon, setIcon]             = useState("🌱");
  const [selectedActs, setActs]     = useState([]);
  const [difficulty, setDiff]       = useState("KS2");
  const [targetYear, setYears]      = useState([]);
  const [selStudents, setStudents]  = useState([]);
  const [deadline, setDeadline]     = useState("");
  const [notes, setNotes]           = useState("");

  const students = accounts.filter(a => a.role === "student" && a.status === "active");
  const steps = ["Details","Activities","Assign Students","Review"];

  function toggleAct(id) { setActs(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]); }
  function toggleYear(y) { setYears(p => p.includes(y) ? p.filter(x=>x!==y) : [...p, y]); }
  function toggleStudent(id) { setStudents(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]); }
  function selectByYear(y) {
    const ids = students.filter(s=>s.year===y).map(s=>s.id);
    const allIn = ids.every(id=>selStudents.includes(id));
    if(allIn) setStudents(p=>p.filter(id=>!ids.includes(id)));
    else setStudents(p=>[...new Set([...p,...ids])]);
  }

  const canNext = [
    name.trim().length > 0,
    selectedActs.length > 0,
    selStudents.length > 0,
    true,
  ];

  function finish() {
    const pw = {
      id: "pw-" + Date.now(),
      name: name.trim(),
      desc: desc.trim(),
      color, icon,
      activities: selectedActs,
      difficulty,
      targetYear,
      assignedStudents: selStudents,
      deadline: deadline || null,
      notes: notes.trim(),
      active: true,
      createdBy: "teacher",
      createdAt: new Date().toISOString().split("T")[0],
    };
    onSave(pw);
  }

  return (
    <div className="modal-overlay" onClick={e=>e.target.className==="modal-overlay"&&onClose()}>
      <div className="modal-box">
        {/* Step bar */}
        <div className="modal-step-bar">
          {steps.map((s,i)=><div key={i} className={`modal-step ${i<step?"done":i===step?"active":""}`}/>)}
        </div>
        <div className="modal-title">{steps[step]}</div>
        <div className="modal-subtitle">
          {["Set a name and visual style","Choose which activities to include","Pick the students for this pathway","Confirm and create your pathway"][step]}
        </div>

        {/* ── Step 0: Details ── */}
        {step===0&&(
          <>
            <div className="form-group">
              <label className="form-label">Pathway name *</label>
              <input className="form-input" placeholder="e.g. Noah's Grammar Boost" value={name} onChange={e=>setName(e.target.value)} maxLength={60}/>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="What will students focus on?" value={desc} onChange={e=>setDesc(e.target.value)} rows={3} style={{resize:"vertical"}}/>
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty level</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {DIFF_OPTS.map(d=>(
                  <button key={d.id} className={`diff-btn ${difficulty===d.id?"selected":""}`}
                    style={{borderColor:difficulty===d.id?"#a78bfa":"rgba(255,255,255,.2)",color:difficulty===d.id?"white":"rgba(255,255,255,.5)"}}
                    onClick={()=>setDiff(d.id)}>{d.label}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Target year groups</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {YEAR_OPTS.map(y=>(
                  <button key={y} className={`diff-btn ${targetYear.includes(y)?"selected":""}`}
                    style={{borderColor:targetYear.includes(y)?"#a78bfa":"rgba(255,255,255,.2)",color:targetYear.includes(y)?"white":"rgba(255,255,255,.5)"}}
                    onClick={()=>toggleYear(y)}>{y}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Deadline (optional)</label>
              <input className="form-input" type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} style={{colorScheme:"dark"}}/>
            </div>
            <div style={{display:"flex",gap:20,marginTop:4}}>
              <div style={{flex:1}}>
                <div className="modal-section-label" style={{marginBottom:8}}>Colour</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {PATH_COLORS.map(c=><div key={c} className={`color-swatch ${color===c?"selected":""}`} style={{background:c,boxShadow:`0 0 0 ${color===c?"3px":"0px"} ${c}`}} onClick={()=>setColor(c)}/>)}
                </div>
              </div>
              <div style={{flex:1}}>
                <div className="modal-section-label" style={{marginBottom:8}}>Icon</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {PATH_ICONS.map(ic=><div key={ic} className={`icon-btn ${icon===ic?"selected":""}`} onClick={()=>setIcon(ic)}>{ic}</div>)}
                </div>
              </div>
            </div>
            {/* Preview */}
            <div style={{marginTop:20,padding:"14px 18px",borderRadius:16,borderLeft:`4px solid ${color}`,background:"rgba(255,255,255,.04)",border:`1px solid rgba(255,255,255,.08)`,borderLeftWidth:4,borderLeftColor:color,display:"flex",alignItems:"center",gap:14}}>
              <span style={{fontSize:"2rem"}}>{icon}</span>
              <div>
                <div style={{fontWeight:800,color:"white",fontSize:".95rem"}}>{name||"Pathway name…"}</div>
                <div style={{fontSize:".78rem",color:"rgba(255,255,255,.4)",marginTop:2}}>{desc||"Description…"}</div>
              </div>
            </div>
          </>
        )}

        {/* ── Step 1: Activities ── */}
        {step===1&&(
          <>
            <div className="modal-section-label">Select activities to include in this pathway</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {Object.entries(ACTIVITY_META).map(([id,meta])=>{
                const G = GEM_MAP[id];
                const sel = selectedActs.includes(id);
                return(
                  <div key={id} onClick={()=>toggleAct(id)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:14,border:`2px solid ${sel?meta.color:"rgba(255,255,255,.1)"}`,background:sel?`${meta.color}18`:"rgba(255,255,255,.03)",cursor:"pointer",transition:"all .2s"}}>
                    <G size={38}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,color:"white",fontSize:".9rem"}}>{meta.label}</div>
                      <div style={{fontSize:".75rem",color:"rgba(255,255,255,.4)",marginTop:2}}>Tap to {sel?"remove from":"add to"} pathway</div>
                    </div>
                    <div style={{width:24,height:24,borderRadius:"50%",background:sel?meta.color:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem",fontWeight:900,color:"white",flexShrink:0,transition:"all .2s"}}>{sel?"✓":""}</div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:14,padding:"10px 14px",borderRadius:12,background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.2)",fontSize:".8rem",color:"#fbbf24",fontWeight:700}}>
              {selectedActs.length} activit{selectedActs.length===1?"y":"ies"} selected
            </div>
            <div className="form-group" style={{marginTop:16}}>
              <label className="form-label">Additional notes for student (optional)</label>
              <textarea className="form-input" placeholder="e.g. Focus especially on fronted adverbials…" value={notes} onChange={e=>setNotes(e.target.value)} rows={2} style={{resize:"vertical"}}/>
            </div>
          </>
        )}

        {/* ── Step 2: Assign Students ── */}
        {step===2&&(
          <>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {YEAR_OPTS.map(y=>{
                const yStudents=students.filter(s=>s.year===y);
                if(!yStudents.length) return null;
                const allIn=yStudents.every(s=>selStudents.includes(s.id));
                return(
                  <button key={y} onClick={()=>selectByYear(y)}
                    style={{padding:"5px 12px",borderRadius:50,border:`1px solid ${allIn?"#a78bfa":"rgba(255,255,255,.15)"}`,background:allIn?"rgba(124,58,237,.25)":"transparent",color:allIn?"white":"rgba(255,255,255,.5)",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".8rem",cursor:"pointer"}}>
                    {allIn?"✓ ":""}{y} ({yStudents.length})
                  </button>
                );
              })}
              <button onClick={()=>setStudents(students.map(s=>s.id))}
                style={{padding:"5px 12px",borderRadius:50,border:"1px solid rgba(255,255,255,.15)",background:"transparent",color:"rgba(255,255,255,.4)",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".8rem",cursor:"pointer"}}>
                Select all
              </button>
              <button onClick={()=>setStudents([])}
                style={{padding:"5px 12px",borderRadius:50,border:"1px solid rgba(255,255,255,.15)",background:"transparent",color:"rgba(255,255,255,.4)",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".8rem",cursor:"pointer"}}>
                Clear
              </button>
            </div>
            <div style={{maxHeight:340,overflowY:"auto"}}>
              {["Y4","Y5","Y6"].map(y=>{
                const ys=students.filter(s=>s.year===y);
                if(!ys.length) return null;
                return(
                  <div key={y}>
                    <div style={{fontSize:".7rem",fontWeight:900,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(255,255,255,.3)",marginBottom:6,marginTop:12}}>{y}</div>
                    {ys.map(s=>{
                      const checked=selStudents.includes(s.id);
                      return(
                        <div key={s.id} className={`student-check-row ${checked?"checked":""}`} onClick={()=>toggleStudent(s.id)}>
                          <div className={`checkbox ${checked?"checked":""}`}>{checked&&<span style={{color:"white",fontSize:".7rem",fontWeight:900}}>✓</span>}</div>
                          <span style={{fontSize:"1.2rem"}}>{s.avatar}</span>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:700,color:"white",fontSize:".88rem"}}>{s.name}</div>
                            <div style={{fontSize:".72rem",color:"rgba(255,255,255,.35)",marginTop:1}}>{s.class} · Skills: sentences {s.skills?.sentences}, grammar {s.skills?.grammar}</div>
                          </div>
                          <div className="skill-pills">
                            {Object.entries(s.skills||{}).map(([k,v])=>(
                              v==="low"&&<span key={k} className={`skill-pill ${v}`}>{k.slice(0,4)}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:12,padding:"10px 14px",borderRadius:12,background:"rgba(124,58,237,.1)",border:"1px solid rgba(167,139,250,.2)",fontSize:".8rem",color:"#a78bfa",fontWeight:700}}>
              {selStudents.length} student{selStudents.length!==1?"s":""} selected
            </div>
          </>
        )}

        {/* ── Step 3: Review ── */}
        {step===3&&(
          <>
            <div style={{padding:"18px 20px",borderRadius:16,borderLeft:`4px solid ${color}`,background:"rgba(255,255,255,.04)",border:`1px solid rgba(255,255,255,.08)`,borderLeftWidth:4,borderLeftColor:color,marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:"1.8rem"}}>{icon}</span>
                <div>
                  <div style={{fontWeight:800,color:"white",fontSize:"1.05rem"}}>{name}</div>
                  <div style={{fontSize:".8rem",color:"rgba(255,255,255,.45)",marginTop:2}}>{desc}</div>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
                <span style={{background:"rgba(255,255,255,.08)",padding:"3px 10px",borderRadius:50,fontSize:".72rem",fontWeight:700,color:"rgba(255,255,255,.65)"}}>Difficulty: {difficulty}</span>
                {targetYear.length>0&&<span style={{background:"rgba(255,255,255,.08)",padding:"3px 10px",borderRadius:50,fontSize:".72rem",fontWeight:700,color:"rgba(255,255,255,.65)"}}>Years: {targetYear.join(", ")}</span>}
                {deadline&&<span style={{background:"rgba(251,191,36,.12)",padding:"3px 10px",borderRadius:50,fontSize:".72rem",fontWeight:700,color:"#fbbf24"}}>Due: {deadline}</span>}
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div className="modal-section-label">Activities ({selectedActs.length})</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
                {selectedActs.map(id=>{const m=ACTIVITY_META[id];return <span key={id} style={{padding:"5px 12px",borderRadius:50,background:`${m.color}22`,border:`1px solid ${m.color}55`,color:m.color,fontSize:".8rem",fontWeight:700}}>{m.icon} {m.label}</span>;})}
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div className="modal-section-label">Assigned Students ({selStudents.length})</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
                {selStudents.map(id=>{const s=accounts.find(a=>a.id===id);return s?<span key={id} style={{padding:"5px 12px",borderRadius:50,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.8)",fontSize:".8rem",fontWeight:700}}>{s.avatar} {s.name}</span>:null;})}
              </div>
            </div>
            {notes&&<div style={{background:"rgba(167,139,250,.08)",border:"1px solid rgba(167,139,250,.18)",borderRadius:12,padding:"10px 14px",fontSize:".82rem",color:"rgba(255,255,255,.6)",fontWeight:600}}><strong style={{color:"#a78bfa"}}>Notes: </strong>{notes}</div>}
          </>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-ghost" onClick={step===0?onClose:()=>setStep(s=>s-1)}>{step===0?"Cancel":"← Back"}</button>
          <div style={{flex:1}}/>
          {step<3
            ? <button className="btn-action" onClick={()=>setStep(s=>s+1)} disabled={!canNext[step]} style={{opacity:canNext[step]?1:.4,cursor:canNext[step]?"pointer":"not-allowed"}}>
                {step===2?"Review →":"Next →"}
              </button>
            : <button className="btn-action" style={{background:"linear-gradient(135deg,#10b981,#059669)"}} onClick={finish}>
                ✦ Create Pathway
              </button>
          }
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VOCABULARY BUILDER (EAL)
// ═══════════════════════════════════════════════════════════════
function VocabularyBuilder({ onBack, onComplete }) {
  const [stage, setStage]         = useState("lang");      // lang | cat | loading | study | quiz | done
  const [langQuery, setLangQuery] = useState("");
  const [selLang, setSelLang]     = useState(null);
  const [selCat, setSelCat]       = useState(null);
  const [translated, setTranslated] = useState([]);        // [{en,emoji,translation,phonetic}]
  const [loadErr, setLoadErr]     = useState("");
  const [cardIdx, setCardIdx]     = useState(0);
  const [flipped, setFlipped]     = useState(false);
  const [mode, setMode]           = useState("study");     // study | quiz
  const [quizOpts, setQuizOpts]   = useState([]);
  const [quizPicked, setQuizPicked] = useState(null);
  const [score, setScore]         = useState(0);
  const [quizIdx, setQuizIdx]     = useState(0);
  const [quizDone, setQuizDone]   = useState(false);
  // translation cache: key = `${langCode}-${catId}` → array
  const [cache, setCache]         = useState({});

  const langList = EAL_LANGUAGES.filter(l =>
    !langQuery || l.name.toLowerCase().includes(langQuery.toLowerCase()) ||
    l.native.toLowerCase().includes(langQuery.toLowerCase())
  );

  // ── Fetch translations via Claude API ──
  async function fetchTranslations(lang, cat) {
    const key = `${lang.code}-${cat.id}`;
    if (cache[key]) { setTranslated(cache[key]); setStage("study"); return; }

    setStage("loading"); setLoadErr("");
    const wordList = cat.words.map(w => w.en).join(", ");
    const prompt = `Translate these English words into ${lang.name} (${lang.native}).
Words: ${wordList}

Return ONLY a JSON array, no markdown, no extra text. Format:
[{"en":"cat","translation":"...","phonetic":"..."}]

Rules:
- Use the most common everyday translation
- For phonetic: write a simple English pronunciation guide (e.g. "gat-toh")
- Keep phonetic short and readable for a primary school child
- If no distinct phonetic is needed (e.g. similar to English), write ""
- Return exactly ${cat.words.length} objects in the same order as the input`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:800,
          messages:[{ role:"user", content:prompt }]
        })
      });
      const data = await res.json();
      const raw  = (data.content||[]).find(b=>b.type==="text")?.text || "[]";
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      // Merge emoji from category words
      const enriched = parsed.map((item, i) => ({ ...item, emoji: cat.words[i]?.emoji || "❓" }));
      setCache(prev => ({...prev, [key]: enriched}));
      setTranslated(enriched);
      setCardIdx(0); setFlipped(false); setQuizIdx(0); setQuizPicked(null); setQuizDone(false); setScore(0);
      setStage("study");
    } catch(e) {
      setLoadErr("Couldn't load translations. Please check your connection and try again.");
      setStage("loading");
    }
  }

  // ── Build quiz options ──
  function buildQuizOpts(idx, words) {
    const correct = words[idx];
    const others  = words.filter((_,i)=>i!==idx).sort(()=>Math.random()-.5).slice(0,3);
    const all     = [...others, correct].sort(()=>Math.random()-.5);
    setQuizOpts(all); setQuizPicked(null);
  }

  function startQuiz() {
    setMode("quiz"); setQuizIdx(0); setScore(0); setQuizDone(false);
    buildQuizOpts(0, translated);
  }

  function pickAnswer(word) {
    if (quizPicked) return;
    setQuizPicked(word.en);
    if (word.en === translated[quizIdx].en) setScore(s => s + 10);
    setTimeout(() => {
      if (quizIdx + 1 >= translated.length) { setQuizDone(true); return; }
      const next = quizIdx + 1;
      setQuizIdx(next);
      buildQuizOpts(next, translated);
    }, 1100);
  }

  const isRtl = selLang?.rtl || false;

  // ── Render ──
  return (
    <div className="eal-screen">
      <style>{style}</style>
      {/* Header */}
      <div className="top-bar">
        <button className="back-btn" onClick={
          stage==="lang" ? onBack :
          stage==="cat"  ? ()=>setStage("lang") :
          stage==="loading" ? ()=>setStage("cat") :
          ()=>{ setStage("cat"); setMode("study"); }
        }>←</button>
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,marginLeft:4}}>
          <GemWorld size={28}/>
          <div className="activity-title-bar">
            Vocabulary Builder
            {selLang && <span style={{fontSize:".75rem",fontWeight:700,color:"rgba(255,255,255,.4)",marginLeft:8}}>{selLang.flag} {selLang.name}</span>}
          </div>
        </div>
        <div style={{background:"rgba(251,191,36,.15)",border:"1px solid rgba(251,191,36,.3)",padding:"6px 14px",borderRadius:50,fontWeight:800,color:"#fbbf24",fontSize:".9rem"}}>💎 {score}</div>
      </div>

      <div className="activity-body" style={{maxWidth:600}}>

        {/* ── Stage: Language picker ── */}
        {stage==="lang" && (
          <>
            <div style={{marginBottom:20,textAlign:"center"}}>
              <div style={{fontSize:"3rem",marginBottom:6}}>🌍</div>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.5rem",color:"white",marginBottom:4}}>Choose your language</div>
              <div style={{fontSize:".85rem",color:"rgba(255,255,255,.45)",fontWeight:700}}>Select your first language to see words translated just for you</div>
            </div>
            <input className="lang-search" placeholder="🔍  Search languages…" value={langQuery} onChange={e=>setLangQuery(e.target.value)}/>
            <div className="lang-grid">
              {langList.map(l => (
                <button key={l.code} className={`lang-btn ${selLang?.code===l.code?"selected":""}`} onClick={()=>setSelLang(l)}>
                  <span className="lang-flag">{l.flag}</span>
                  <div className="lang-names">
                    <div className="lang-name-en">{l.name}</div>
                    <div className="lang-name-native">{l.native}</div>
                  </div>
                  {selLang?.code===l.code && <span style={{color:"#38bdf8",fontSize:".9rem",marginLeft:"auto"}}>✓</span>}
                </button>
              ))}
              {langList.length===0 && <div style={{gridColumn:"1/-1",textAlign:"center",color:"rgba(255,255,255,.3)",padding:24,fontWeight:600}}>No languages match "{langQuery}"</div>}
            </div>
            {selLang && (
              <div style={{position:"sticky",bottom:16,paddingTop:14}}>
                <button className="btn-primary" onClick={()=>setStage("cat")} style={{background:"linear-gradient(135deg,#0891b2,#06b6d4)"}}>
                  Continue with {selLang.flag} {selLang.name} →
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Stage: Category picker ── */}
        {stage==="cat" && (
          <>
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.5rem",color:"white",marginBottom:4}}>
                {selLang.flag} Learning in {selLang.name}
              </div>
              <div style={{fontSize:".85rem",color:"rgba(255,255,255,.45)",fontWeight:700}}>
                Choose a topic to learn vocabulary for
              </div>
            </div>
            <div className="cat-grid">
              {EAL_CATEGORIES.map(cat => {
                const isDone = !!cache[`${selLang.code}-${cat.id}`];
                return (
                  <div key={cat.id} className="cat-card" onClick={()=>{setSelCat(cat);fetchTranslations(selLang,cat);}}>
                    {isDone && <div className="cat-done">✓</div>}
                    <span className="cat-emoji">{cat.icon}</span>
                    <div className="cat-name">{cat.label}</div>
                    <div className="cat-count">{cat.words.length} words {isDone?"· ✓ done":""}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Stage: Loading ── */}
        {stage==="loading" && (
          <div className="eal-loading">
            {!loadErr ? (
              <>
                <div className="eal-spinner"/>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.3rem",color:"white"}}>Translating words…</div>
                <div className="eal-loading-text">{selLang?.flag} Getting {selCat?.label} vocabulary in {selLang?.name}</div>
              </>
            ) : (
              <>
                <div style={{fontSize:"3rem"}}>� ️</div>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.2rem",color:"#f87171",marginBottom:8}}>Translation failed</div>
                <div style={{fontSize:".85rem",color:"rgba(255,255,255,.4)",fontWeight:600,textAlign:"center",marginBottom:20}}>{loadErr}</div>
                <button className="btn-primary" style={{maxWidth:260}} onClick={()=>fetchTranslations(selLang,selCat)}>Try Again</button>
                <button onClick={()=>setStage("cat")} style={{background:"none",border:"none",color:"rgba(255,255,255,.35)",fontFamily:"'Nunito',sans-serif",fontWeight:700,cursor:"pointer",marginTop:8}}>← Back to topics</button>
              </>
            )}
          </div>
        )}

        {/* ── Stage: Study / Quiz ── */}
        {(stage==="study" || stage==="quiz") && translated.length > 0 && (
          <>
            {/* Mode tabs */}
            <div className="mode-tabs">
              <button className={`mode-tab ${mode==="study"?"active":""}`} onClick={()=>setMode("study")}>📖 Flashcards</button>
              <button className={`mode-tab ${mode==="quiz"?"active":""}`} onClick={startQuiz}>🎯 Quiz me!</button>
            </div>

            {/* ── FLASHCARD MODE ── */}
            {mode==="study" && (
              <>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{width:`${((cardIdx+1)/translated.length)*100}%`}}/>
                </div>
                <div className="flashcard-wrap" onClick={()=>setFlipped(f=>!f)}>
                  <div className={`flashcard ${flipped?"flipped":""}`}>
                    {/* Front — English */}
                    <div className="flashcard-face flashcard-front">
                      <div className="flashcard-lang-label">🇬🇧 English</div>
                      <div className="flashcard-emoji">{translated[cardIdx].emoji}</div>
                      <div className="flashcard-word">{translated[cardIdx].en}</div>
                      <div className="flashcard-tap-hint">↩ Tap to see in {selLang.flag} {selLang.name}</div>
                    </div>
                    {/* Back — Translation */}
                    <div className="flashcard-face flashcard-back">
                      <div className="flashcard-lang-label">{selLang.flag} {selLang.name}</div>
                      <div className="flashcard-emoji">{translated[cardIdx].emoji}</div>
                      <div className={`flashcard-word ${isRtl?"flashcard-rtl":""}`}>{translated[cardIdx].translation}</div>
                      {translated[cardIdx].phonetic && (
                        <div className="flashcard-phonetic">/ {translated[cardIdx].phonetic} /</div>
                      )}
                      <div className="flashcard-tap-hint">↩ Tap to flip back</div>
                    </div>
                  </div>
                </div>

                {/* Card navigation */}
                <div className="card-nav">
                  <button className="card-nav-btn" disabled={cardIdx===0} onClick={()=>{setCardIdx(i=>i-1);setFlipped(false);}}>‹</button>
                  <div className="card-counter">{cardIdx+1} / {translated.length}</div>
                  <button className="card-nav-btn" disabled={cardIdx===translated.length-1} onClick={()=>{setCardIdx(i=>i+1);setFlipped(false);}}>›</button>
                </div>

                {/* Word list strip */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
                  {translated.map((w,i)=>(
                    <div key={i} onClick={()=>{setCardIdx(i);setFlipped(false);}} style={{padding:"5px 12px",borderRadius:50,cursor:"pointer",background:i===cardIdx?"rgba(6,182,212,.25)":"rgba(255,255,255,.05)",border:`1px solid ${i===cardIdx?"rgba(56,189,248,.5)":"rgba(255,255,255,.1)"}`,transition:"all .2s"}}>
                      <span style={{fontSize:"1rem"}}>{w.emoji}</span>
                      <span style={{fontSize:".75rem",fontWeight:700,color:i===cardIdx?"#38bdf8":"rgba(255,255,255,.45)",marginLeft:4}}>{w.en}</span>
                    </div>
                  ))}
                </div>

                <button className="submit-btn" style={{background:"linear-gradient(135deg,#0891b2,#06b6d4)"}} onClick={startQuiz}>
                  Ready? Take the Quiz! 🎯
                </button>
              </>
            )}

            {/* ── QUIZ MODE ── */}
            {mode==="quiz" && !quizDone && quizOpts.length>0 && (
              <>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{width:`${((quizIdx)/translated.length)*100}%`,background:"linear-gradient(90deg,#06b6d4,#38bdf8)"}}/>
                </div>
                <div className="q-counter" style={{color:"#38bdf8"}}>Question {quizIdx+1} of {translated.length}</div>
                {/* Show emoji + translation, pick English */}
                <span className="quiz-emoji-big">{translated[quizIdx].emoji}</span>
                <div className="quiz-prompt">
                  <div className="qp-label">{selLang.flag} In {selLang.name} this is:</div>
                  <div className={`qp-word ${isRtl?"rtl":""}`}>{translated[quizIdx].translation}</div>
                  {translated[quizIdx].phonetic && <div style={{fontSize:".78rem",color:"rgba(255,255,255,.35)",fontStyle:"italic",marginTop:3}}>/ {translated[quizIdx].phonetic} /</div>}
                  <div className="qp-label" style={{marginTop:10}}>🇬🇧 Which English word is this?</div>
                </div>
                <div className="quiz-opts">
                  {quizOpts.map((opt,i)=>{
                    let cls="quiz-opt";
                    if(quizPicked){
                      if(opt.en===translated[quizIdx].en) cls+=" correct-ans";
                      else if(opt.en===quizPicked) cls+=" wrong-ans";
                    }
                    return(
                      <button key={i} className={cls} onClick={()=>pickAnswer(opt)}>
                        <span style={{fontSize:"1.4rem",display:"block",marginBottom:3}}>{opt.emoji}</span>
                        {opt.en}
                      </button>
                    );
                  })}
                </div>
                {quizPicked && (
                  <div style={{marginTop:12,textAlign:"center",fontSize:".88rem",fontWeight:700,color:quizPicked===translated[quizIdx].en?"#34d399":"#f87171"}}>
                    {quizPicked===translated[quizIdx].en ? `✦ Correct! +10 crystals` : `✗ It was "${translated[quizIdx].en}" — ${selLang.flag} ${translated[quizIdx].translation}`}
                  </div>
                )}
              </>
            )}

            {/* ── QUIZ DONE ── */}
            {mode==="quiz" && quizDone && (
              <div className="vocab-complete">
                <Confetti/>
                <span className="vocab-stars">{score>=translated.length*8?"🏆":score>=translated.length*5?"🌟":"⭐"}</span>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"2rem",color:"white",marginBottom:8}}>
                  {score>=translated.length*8?"Brilliant!":score>=translated.length*5?"Well done!":"Keep practising!"}
                </div>
                <div style={{color:"rgba(255,255,255,.5)",fontWeight:700,marginBottom:6}}>
                  You scored {score} / {translated.length*10} on {selCat?.label}
                </div>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"2.2rem",background:"linear-gradient(135deg,#fbbf24,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:24}}>
                  +{score} crystals!
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                  <button className="btn-primary" style={{maxWidth:200,background:"linear-gradient(135deg,#0891b2,#06b6d4)"}} onClick={startQuiz}>Try Again 🔄</button>
                  <button className="btn-primary" style={{maxWidth:200,background:"rgba(255,255,255,.08)",boxShadow:"none",border:"1px solid rgba(255,255,255,.15)"}} onClick={()=>setStage("cat")}>New Topic</button>
                </div>
                <button className="btn-primary" style={{marginTop:12,background:"linear-gradient(135deg,#7c3aed,#a855f7)"}} onClick={()=>onComplete(score)}>
                  Save & Continue →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STUDENT APP
// ═══════════════════════════════════════════════════════════════
function StudentApp({ profile, onLogout, accounts, saveAccounts }) {
  const [view, setView]    = useState("home");
  const [points, setPoints]= useState(profile.startPts||0);
  const [streak, setStreak]= useState(profile.streak||0);

  // Save points and streak back to the account whenever they change
  useEffect(() => {
    if(!profile.id || !saveAccounts || !accounts) return;
    const updated = accounts.map(a =>
      a.id === profile.id ? { ...a, pts: points, streak: streak } : a
    );
    saveAccounts(updated);
  }, [points, streak]);
  const [curAct, setAct]   = useState(null);
  const level = Math.floor(points/200)+1;
  const xpPct = ((points%200)/200)*100;

  const ACTIVITIES=[
    {id:"sentences",  title:"Sentence Builder",   GemIcon:GemQuill,     desc:"Craft perfect sentences",    cardBg:"rgba(124,58,237,.18)", cardBorder:"rgba(167,139,250,.25)",cardGlow:"rgba(124,58,237,.25)", ring:"#a78bfa",pts:15,pct:"65%",questions:SENTENCE_QUESTIONS},
    {id:"colourful",  title:"Colourful Sentences", GemIcon:GemRainbow,   desc:"WHO · DOING · WHAT · WHERE", cardBg:"rgba(234,88,12,.15)",  cardBorder:"rgba(251,146,60,.25)",  cardGlow:"rgba(234,88,12,.2)",  ring:"#fb923c",pts:20,pct:"40%",questions:[]},
    {id:"eal",        title:"Vocab Builder",       GemIcon:GemWorld,     desc:"Learn words in your language",cardBg:"rgba(6,182,212,.14)", cardBorder:"rgba(56,189,248,.3)",  cardGlow:"rgba(6,182,212,.2)",  ring:"#38bdf8",pts:10,pct:"55%",questions:[]},
    {id:"punctuation",title:"Punctuation Quest",   GemIcon:GemLightning, desc:"Master marks & apostrophes", cardBg:"rgba(236,72,153,.15)", cardBorder:"rgba(244,114,182,.25)",cardGlow:"rgba(236,72,153,.2)", ring:"#f472b6",pts:10,pct:"80%",questions:PUNCTUATION_QUESTIONS},
    {id:"grammar",    title:"Grammar Galaxy",      GemIcon:GemTelescope, desc:"Nouns, verbs & beyond",      cardBg:"rgba(20,184,166,.12)", cardBorder:"rgba(45,212,191,.2)",   cardGlow:"rgba(20,184,166,.18)",ring:"#2dd4bf",pts:10,pct:"50%",questions:GRAMMAR_QUESTIONS},
    {id:"spag",       title:"SATs Academy",        GemIcon:GemCrown,     desc:"Year 6 power prep",          cardBg:"rgba(245,158,11,.12)", cardBorder:"rgba(251,191,36,.25)", cardGlow:"rgba(245,158,11,.18)",ring:"#fbbf24",pts:20,pct:"30%",questions:SPAG_QUESTIONS},
  ];
  const badges=[{emoji:"🏆",name:"First Steps",earned:true},{emoji:"🔥",name:"On Fire!",earned:streak>=5},{emoji:"⚡",name:"Speed Star",earned:points>500},{emoji:"💎",name:"Diamond",earned:points>1000},{emoji:"🌟",name:"Top Scorer",earned:false},{emoji:"📚",name:"Bookworm",earned:false}];

  if(curAct==="colourful") return <ColourfulSemanticsGame onBack={()=>setAct(null)} onComplete={e=>{setPoints(p=>p+e);setStreak(s=>s+1);setAct(null)}}/>;
  if(curAct==="eal")       return <VocabularyBuilder      onBack={()=>setAct(null)} onComplete={e=>{setPoints(p=>p+e);setStreak(s=>s+1);setAct(null)}}/>;
  if(curAct){const act=ACTIVITIES.find(a=>a.id===curAct);return <ActivityGame questions={act.questions} title={act.title} GemIcon={act.GemIcon} onBack={()=>setAct(null)} onComplete={e=>{setPoints(p=>p+e);setStreak(s=>s+1);setAct(null)}}/>;}

  if(view==="spag") return(
    <div className="student-app"><style>{style}</style>
      <div className="top-bar"><button onClick={()=>setView("home")} className="back-btn">←</button><div className="top-bar-logo">Word Wizards</div><div className="gems-badge">💎 {points}</div></div>
      <div className="student-main">
        <div className="spag-header"><div className="level-badge">SATs Academy</div><h2>Year 6 SATs Prep</h2><p style={{opacity:.75,fontWeight:700,marginTop:4}}>Master every topic</p></div>
        <p className="section-title" style={{marginBottom:10}}>Topics</p>
        <div className="spag-topics">{SPAG_TOPICS.map((t,i)=><div key={i} className="spag-topic" style={{borderLeftColor:t.color}} onClick={()=>t.status!=="locked"&&setAct("spag")}><span style={{fontSize:"1.5rem"}}>{t.icon}</span><div><div className="topic-name">{t.name}</div><div className="topic-q">{t.qs} questions</div></div><span className="topic-status" style={{background:t.status==="completed"?"rgba(52,211,153,.15)":t.status==="in-progress"?"rgba(251,191,36,.12)":"rgba(255,255,255,.06)",color:t.status==="completed"?"#34d399":t.status==="in-progress"?"#fbbf24":"rgba(255,255,255,.25)"}}>{t.status==="completed"?"✦ Done":t.status==="in-progress"?"▶ Active":"⊘ Locked"}</span></div>)}</div>
      </div>
    </div>
  );

  return(
    <div className="student-app"><style>{style}</style>
      <div className="top-bar"><div className="top-bar-logo">✦ Word Wizards</div><div style={{display:"flex",gap:8,alignItems:"center"}}><div className="gems-badge">💎 {points}</div><div className="top-bar-profile" onClick={onLogout}><span style={{fontSize:"1.3rem"}}>{profile.avatar}</span><span className="profile-name-sm">{profile.name}</span></div></div></div>
      <div className="student-main">
        <div className="quest-banner"><div className="level-badge">✦ Level {level} Wizard</div><h2>Welcome back, {profile.name}! {profile.avatar}</h2><p>Your next quest awaits!</p><div className="xp-bar-wrap"><div className="xp-bar-fill" style={{width:`${xpPct}%`}}/></div><div className="xp-label">{points%200} / 200 XP until Level {level+1}</div></div>
        <div className="streak-card"><div><div style={{fontWeight:800,fontSize:".95rem",color:"white"}}>🔥 Day Streak!</div><div style={{fontSize:".8rem",color:"rgba(255,255,255,.5)",fontWeight:600,marginTop:2}}>Keep it up</div></div><div className="streak-num">{streak}</div></div>
        <p className="section-title">⚔ Choose Your Quest</p>
        <div className="activity-grid">{ACTIVITIES.map(act=><div key={act.id} className="act-card" style={{"--card-bg":act.cardBg,"--card-border":act.cardBorder,"--card-glow":act.cardGlow,"--ring-color":act.ring,"--ring-pct":act.pct}} onClick={()=>{if(act.id==="spag"){setView("spag");return}setAct(act.id)}}><div className="progress-ring-wrap"><div className="progress-ring-inner"/></div><div style={{margin:"0 auto 10px"}}><act.GemIcon size={52}/></div><div className="card-title">{act.title}</div><div className="card-desc">{act.desc}</div><div className="card-pts">💎 up to {act.pts} pts</div></div>)}</div>
        <p className="section-title">🏅 Achievements</p>
        <div className="badges-row">{badges.map((b,i)=><div key={i} className={`badge-item ${b.earned?"earned":""}`}><span style={{fontSize:"1.1rem"}}>{b.emoji}</span>{b.name}</div>)}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TEACHER APP
// ═══════════════════════════════════════════════════════════════
function TeacherApp({ onLogout, accounts, pathways, savePaths, classes, saveClasses }) {
  const [view, setView]           = useState("dashboard");
  const [selClass, setSelClass]   = useState(null);
  const [showBuilder, setBuilder] = useState(false);
  const [editPath, setEditPath]   = useState(null);
  const [toast, setToast]         = useState(null);
  const [copiedCode, setCopied]   = useState(null);

  const students = accounts.filter(a=>a.role==="student");
  const classNames  = [...new Set(students.map(s=>s.class))].filter(Boolean).sort();

  function handleSavePathway(pw) {
    savePaths(p=>[...p, pw]);
    setBuilder(false);
    setToast("Pathway created successfully!");
  }
  function togglePathway(id) { savePaths(p=>p.map(x=>x.id===id?{...x,active:!x.active}:x)); }
  function deletePathway(id) { savePaths(p=>p.filter(x=>x.id!==id)); setToast("Pathway deleted."); }

  function regenCode(classId) {
    const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const newCode = Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
    saveClasses(cs=>cs.map(c=>c.id===classId?{...c,code:newCode}:c));
    setToast("New code generated!");
  }

  function copyCode(code) {
    try { navigator.clipboard.writeText(code); } catch {}
    setCopied(code);
    setTimeout(()=>setCopied(null), 2000);
  }

  const nav=[
    {id:"dashboard",icon:"◈",label:"Dashboard"},
    {id:"classes",  icon:"◎",label:"Classes"},
    {id:"progress", icon:"▲",label:"Progress"},
    {id:"pathways", icon:"⬡",label:"Pathways"},
    {id:"codes",    icon:"⊞",label:"Class Codes"},
  ];

  function Dashboard(){return(
    <>
      <div className="teacher-header"><h1>Dashboard ✦</h1><p>School overview</p></div>
      <div className="stats-row">
        <div className="stat-card purple"><div className="stat-num">{students.length}</div><div className="stat-label">Students</div><div className="stat-trend">Active</div></div>
        <div className="stat-card pink"><div className="stat-num">{classes.length}</div><div className="stat-label">Classes</div></div>
        <div className="stat-card teal"><div className="stat-num">82%</div><div className="stat-label">Avg Completion</div><div className="stat-trend">↑ +5%</div></div>
        <div className="stat-card orange"><div className="stat-num">{pathways.filter(p=>p.active).length}</div><div className="stat-label">Active Pathways</div></div>
      </div>
      <div className="dashboard-grid">
        <div className="dash-card">
          <div className="dash-card-title">🏆 Top Performers</div>
          {[...students].sort((a,b)=>(b.pts||0)-(a.pts||0)).slice(0,5).map(s=><div key={s.id} className="student-row"><span className="student-ava">{s.avatar}</span><div className="student-info"><div className="name">{s.name}</div><div className="class">{s.class} · {s.year}</div></div><span className="student-pts-badge">💎 {s.pts||0}</span></div>)}
        </div>
        <div className="dash-card">
          <div className="dash-card-title">�  Needs Attention</div>
          {students.filter(s=>Object.values(s.skills||{}).some(v=>v==="low")).slice(0,5).map(s=><div key={s.id} className="student-row"><span className="student-ava">{s.avatar}</span><div className="student-info"><div className="name">{s.name}</div><div className="class">{s.class}</div></div><div className="mini-bar-wrap"><div className="mini-bar-fill" style={{width:`${((s.pts||0)/1240)*100}%`}}/></div></div>)}
        </div>
        <div className="dash-card">
          <div className="dash-card-title">⬡ My Pathways</div>
          {pathways.slice(0,5).map(p=><div key={p.id} className="student-row"><span style={{fontSize:"1.3rem"}}>{p.icon}</span><div className="student-info"><div className="name">{p.name}</div><div className="class">{p.assignedStudents.length} students · {p.activities.length} activities</div></div><span style={{fontSize:".72rem",fontWeight:700,padding:"2px 8px",borderRadius:50,background:p.active?"rgba(52,211,153,.15)":"rgba(255,255,255,.06)",color:p.active?"#34d399":"rgba(255,255,255,.3)"}}>{p.active?"●  Active":"○  Off"}</span></div>)}
          {pathways.length===0&&<p style={{color:"rgba(255,255,255,.3)",fontWeight:600,fontSize:".85rem",padding:"8px 0"}}>No pathways yet — create one in Pathways!</p>}
        </div>
        <div className="dash-card">
          <div className="dash-card-title">🔥 Streak Leaders</div>
          {[...students].sort((a,b)=>(b.streak||0)-(a.streak||0)).slice(0,5).map(s=><div key={s.id} className="student-row"><span className="student-ava">{s.avatar}</span><div className="student-info"><div className="name">{s.name}</div><div className="class">{s.class}</div></div><span style={{fontWeight:700,fontSize:".85rem",color:"#fb923c"}}>🔥 {s.streak||0}d</span></div>)}
        </div>
      </div>
    </>
  );}

  function Classes(){
    if(selClass){
      const sts=students.filter(s=>s.class===selClass);
      const cls=classes?.find(c=>c.name===`Class ${selClass}`||c.name===selClass);
      return(<>
        <div className="teacher-header" style={{display:"flex",alignItems:"center",gap:12}}>
          <button className="back-btn" onClick={()=>setSelClass(null)}>←</button>
          <div><h1>Class {selClass}</h1><p>{sts.length} students</p></div>
          {cls&&<div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:".72rem",color:"rgba(255,255,255,.3)",fontWeight:700,marginBottom:3}}>Class Code</div><div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.4rem",color:"#a78bfa",letterSpacing:".25em",cursor:"pointer"}} onClick={()=>copyCode(cls.code)}>{cls.code}</div></div>}
        </div>
        {sts.map(s=><div key={s.id} className="student-row" style={{background:"rgba(255,255,255,.04)",borderRadius:14,padding:13,marginBottom:7,border:"1px solid rgba(255,255,255,.07)"}}><span style={{fontSize:"1.5rem"}}>{s.avatar}</span><div className="student-info"><div className="name" style={{fontSize:".95rem"}}>{s.name}</div><div className="skill-pills" style={{marginTop:3}}><span className={`skill-pill ${s.skills?.sentences}`}>Sentences</span><span className={`skill-pill ${s.skills?.punctuation}`}>Punctuation</span><span className={`skill-pill ${s.skills?.grammar}`}>Grammar</span></div></div><div style={{textAlign:"right"}}><div className="student-pts-badge">💎 {s.pts||0}</div><div style={{fontSize:".72rem",color:"rgba(255,255,255,.35)",marginTop:3}}>🔥 {s.streak||0} streak</div></div></div>)}
      </>);
    }
    return(<>
      <div className="teacher-header"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h1>Classes</h1></div><p>Manage classes and year groups</p></div>
      <div className="classes-grid">
        {classNames.map((c,i)=>{const cs=students.filter(s=>s.class===c);const col=["#a855f7","#ec4899","#14b8a6","#f97316","#3b82f6"][i%5];const cls=classes?.find(x=>x.name===`Class ${c}`||x.name===c);return(<div key={c} className="class-card" style={{borderTopColor:col}} onClick={()=>setSelClass(c)}><h3>Class {c}</h3><div className="class-meta">{cs.length} students{cls?<span style={{marginLeft:8,color:col,fontFamily:"'Fredoka One',cursive",letterSpacing:".12em"}}>  {cls.code}</span>:null}</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{cs.slice(0,5).map((s,j)=><span key={j} style={{fontSize:"1.2rem"}}>{s.avatar}</span>)}{cs.length>5&&<span style={{fontSize:".8rem",color:"rgba(255,255,255,.35)",fontWeight:700,alignSelf:"center"}}>+{cs.length-5}</span>}</div></div>);})}
      </div>
    </>);
  }

  function ClassCodes() {
    const [newClassName, setNewClassName] = useState("");
    const [newYear, setNewYear] = useState("Year 5");
    const [newColor, setNewColor] = useState("#a855f7");
    const [adding, setAdding] = useState(false);
    const pendingStudents = students.filter(s=>s.pendingApproval);

    function addNewClass() {
      if(!newClassName.trim()) return;
      const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const code = Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
      const newCls = { id:"cl-"+Date.now(), name:newClassName, year:newYear, teacherId:"acc-t-1", color:newColor, code, students:[] };
      saveClasses(cs=>[...cs,newCls]);
      setNewClassName(""); setAdding(false);
      setToast(`Class "${newClassName}" created with code ${code}`);
    }

    const PALETTE=["#a855f7","#ec4899","#14b8a6","#f97316","#3b82f6","#22c55e","#f59e0b","#f43f5e"];

    return(
      <>
        <div className="teacher-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h1>Class Codes ⊞</h1>
            <button className="btn-add" style={{width:"auto"}} onClick={()=>setAdding(a=>!a)}>+ New Class</button>
          </div>
          <p>Share these codes with pupils so they can self-register and join your class</p>
        </div>

        {/* New class form */}
        {adding&&(
          <div style={{background:"rgba(167,139,250,.08)",border:"1px solid rgba(167,139,250,.2)",borderRadius:16,padding:20,marginBottom:18,animation:"pop-in .3s"}}>
            <div style={{fontWeight:800,color:"white",marginBottom:14}}>✦ Create New Class</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <div><label style={{display:"block",fontSize:".72rem",fontWeight:800,color:"rgba(255,255,255,.4)",marginBottom:5,textTransform:"uppercase",letterSpacing:".1em"}}>Class Name</label><input style={{width:"100%",padding:"10px 13px",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,fontFamily:"'Nunito',sans-serif",fontSize:".9rem",fontWeight:700,color:"white",outline:"none"}} placeholder="e.g. Class 5C" value={newClassName} onChange={e=>setNewClassName(e.target.value)}/></div>
              <div><label style={{display:"block",fontSize:".72rem",fontWeight:800,color:"rgba(255,255,255,.4)",marginBottom:5,textTransform:"uppercase",letterSpacing:".1em"}}>Year Group</label>
                <select style={{width:"100%",padding:"10px 13px",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,fontFamily:"'Nunito',sans-serif",fontSize:".9rem",fontWeight:700,color:"white",outline:"none"}} value={newYear} onChange={e=>setNewYear(e.target.value)}>
                  {["Year 1","Year 2","Year 3","Year 4","Year 5","Year 6"].map(y=><option key={y} style={{background:"#1a0d3d"}}>{y}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:".72rem",fontWeight:800,color:"rgba(255,255,255,.4)",marginBottom:8,textTransform:"uppercase",letterSpacing:".1em"}}>Colour</label>
              <div style={{display:"flex",gap:7}}>{PALETTE.map(c=><div key={c} onClick={()=>setNewColor(c)} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:newColor===c?"3px solid white":"3px solid transparent",transform:newColor===c?"scale(1.25)":"scale(1)",transition:"all .15s",boxShadow:newColor===c?`0 0 10px ${c}`:"none"}}/>)}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn-add" style={{background:`linear-gradient(135deg,${newColor}cc,${newColor})`}} onClick={addNewClass}>Create Class + Generate Code</button>
              <button onClick={()=>setAdding(false)} style={{padding:"9px 16px",borderRadius:10,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.4)",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".82rem",cursor:"pointer"}}>Cancel</button>
            </div>
          </div>
        )}

        {/* Pending self-registrations */}
        {pendingStudents.length>0&&(
          <div style={{background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.2)",borderRadius:16,padding:16,marginBottom:18}}>
            <div style={{fontWeight:800,color:"#fbbf24",marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
              ⏳ Pending Approvals ({pendingStudents.length})
            </div>
            {pendingStudents.map(s=>(
              <div key={s.id} className="pending-student-row">
                <span style={{fontSize:"1.3rem"}}>{s.avatar}</span>
                <div style={{flex:1}}><div style={{fontWeight:700,color:"white",fontSize:".88rem"}}>{s.name}</div><div style={{fontSize:".72rem",color:"rgba(255,255,255,.4)"}}>Signed up · {s.year} · {s.signupMethod||"email"}</div></div>
                <span style={{fontSize:".72rem",color:"#fbbf24",fontWeight:700,background:"rgba(251,191,36,.15)",padding:"3px 9px",borderRadius:50}}>No class assigned</span>
              </div>
            ))}
          </div>
        )}

        {/* Class code cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {(classes||[]).map(cls=>{
            const classStudents=students.filter(s=>s.classId===cls.id||s.class===cls.name.replace("Class ",""));
            const isCopied=copiedCode===cls.code;
            return(
              <div key={cls.id} className="code-card" style={{borderTop:`3px solid ${cls.color}`}}>
                <div className="code-card-header">
                  <div>
                    <div className="code-card-title">{cls.name}</div>
                    <div style={{fontSize:".75rem",color:"rgba(255,255,255,.35)",fontWeight:600,marginTop:2}}>{cls.year} · {classStudents.length} students</div>
                  </div>
                  <button className="btn-regen" onClick={()=>regenCode(cls.id)}>↻ New Code</button>
                </div>

                <div className="big-code" onClick={()=>copyCode(cls.code)} style={{color:isCopied?"#34d399":cls.color}}>
                  {cls.code}
                </div>
                <div className="code-copy-hint">{isCopied?"✓ Copied to clipboard!":"Click code to copy"}</div>

                <div className="code-share-row">
                  <button className="btn-share" onClick={()=>copyCode(`Join my class on Word Wizards!\nClass: ${cls.name}\nCode: ${cls.code}\nGo to wordwizards.com → Create Account → Enter code`)}>
                    📋 Copy invite message
                  </button>
                  <button className="btn-share" onClick={()=>copyCode(cls.code)}>
                    🔗 Copy code
                  </button>
                </div>

                <div className="code-meta-row">
                  <div style={{display:"flex",gap:2}}>
                    {classStudents.slice(0,6).map((s,i)=><span key={i} style={{fontSize:"1rem"}}>{s.avatar}</span>)}
                    {classStudents.length>6&&<span style={{fontSize:".72rem",color:"rgba(255,255,255,.3)",fontWeight:700,alignSelf:"center",marginLeft:3}}>+{classStudents.length-6}</span>}
                  </div>
                  <span style={{fontSize:".72rem",color:"rgba(255,255,255,.3)",fontWeight:600}}>Share with Year {cls.year.replace("Year ","")}</span>
                </div>
              </div>
            );
          })}
          {(!classes||classes.length===0)&&(
            <div style={{gridColumn:"1/-1",textAlign:"center",padding:"40px",color:"rgba(255,255,255,.3)",fontWeight:600}}>No classes yet — create one above</div>
          )}
        </div>
      </>
    );
  }

  function Progress(){
    const[filter,setFilter]=useState("all");
    const filtered=filter==="all"?students:students.filter(s=>s.year===filter);
    return(<>
      <div className="teacher-header"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><h1>Progress</h1><div style={{display:"flex",gap:5}}>{["all","Y4","Y5","Y6"].map(y=><button key={y} onClick={()=>setFilter(y)} className="class-chip" style={{background:filter===y?"rgba(124,58,237,.4)":"",color:filter===y?"white":""}}>{y==="all"?"All":y}</button>)}</div></div><p>Individual performance across all activities</p></div>
      <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:16,overflow:"hidden"}}><table className="progress-table" style={{width:"100%"}}><thead><tr><th>Student</th><th>Class</th><th>Crystals</th><th>Skills</th><th>Streak</th><th>Status</th></tr></thead><tbody>{filtered.map(s=><tr key={s.id}><td><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:"1.1rem"}}>{s.avatar}</span><strong style={{color:"white"}}>{s.name}</strong></div></td><td><span className="class-chip" style={{cursor:"default"}}>{s.class}</span></td><td><strong style={{color:"#fbbf24"}}>💎 {s.pts||0}</strong></td><td><div className="skill-pills">{Object.entries(s.skills||{}).map(([k,v])=><span key={k} className={`skill-pill ${v}`}>{k.slice(0,4)}</span>)}</div></td><td style={{color:"#fb923c"}}>🔥 {s.streak||0}d</td><td><span style={{padding:"3px 9px",borderRadius:50,fontSize:".72rem",fontWeight:700,background:(s.pts||0)>1000?"rgba(52,211,153,.15)":(s.pts||0)>700?"rgba(251,191,36,.12)":"rgba(248,113,113,.12)",color:(s.pts||0)>1000?"#34d399":(s.pts||0)>700?"#fbbf24":"#f87171"}}>{(s.pts||0)>1000?"Excelling":(s.pts||0)>700?"On Track":"Needs Support"}</span></td></tr>)}</tbody></table></div>
    </>);
  }

  function Pathways(){return(<>
    <div className="pathway-header-row">
      <div className="teacher-header" style={{marginBottom:0}}><h1>Learning Pathways</h1><p>Create personalised learning journeys for your students</p></div>
      <button className="btn-add" style={{width:"auto"}} onClick={()=>setBuilder(true)}>+ New Pathway</button>
    </div>
    {pathways.length===0&&(
      <div style={{textAlign:"center",padding:"60px 20px"}}>
        <div style={{fontSize:"3.5rem",marginBottom:16,opacity:.4}}>⬡</div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.4rem",color:"rgba(255,255,255,.5)",marginBottom:8}}>No pathways yet</div>
        <p style={{color:"rgba(255,255,255,.3)",fontWeight:600,marginBottom:24}}>Create your first pathway to personalise learning for your students</p>
        <button className="btn-add" style={{margin:"0 auto"}} onClick={()=>setBuilder(true)}>+ Create First Pathway</button>
      </div>
    )}
    {pathways.map(p=>{
      const assignedStudents=accounts.filter(a=>p.assignedStudents.includes(a.id));
      return(
        <div key={p.id} className="pathway-card" style={{borderLeftColor:p.color}}>
          <span style={{fontSize:"1.8rem"}}>{p.icon}</span>
          <div className="pathway-info" style={{flex:1}}>
            <h3>{p.name}</h3><p>{p.desc}</p>
            <div style={{marginTop:7,display:"flex",gap:3,flexWrap:"wrap"}}>
              {p.activities.map(id=>{const m=ACTIVITY_META[id];return <span key={id} style={{background:`${m.color}22`,color:m.color,padding:"2px 8px",borderRadius:50,fontSize:".7rem",fontWeight:700}}>{m.icon} {m.label}</span>;})}
            </div>
            {p.deadline&&<div style={{marginTop:5,fontSize:".72rem",color:"#fbbf24",fontWeight:700}}>📅 Due: {p.deadline}</div>}
            <div style={{marginTop:7,display:"flex",gap:3,flexWrap:"wrap"}}>
              {assignedStudents.slice(0,6).map(s=><span key={s.id} title={s.name} style={{fontSize:"1rem"}}>{s.avatar}</span>)}
              {assignedStudents.length>6&&<span style={{fontSize:".72rem",color:"rgba(255,255,255,.4)",fontWeight:700,alignSelf:"center"}}>+{assignedStudents.length-6}</span>}
            </div>
          </div>
          <div className="pathway-meta">
            <div className="assigned">{p.assignedStudents.length} students</div>
            <div style={{marginTop:7,display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:".72rem",color:"rgba(255,255,255,.35)",fontWeight:600}}>{p.active?"Active":"Off"}</span>
              <button className={`toggle-switch ${p.active?"on":""}`} onClick={()=>togglePathway(p.id)}/>
            </div>
            <button onClick={()=>deletePathway(p.id)} style={{marginTop:8,background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.2)",borderRadius:8,padding:"4px 10px",color:"#f87171",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".72rem",cursor:"pointer"}}>Delete</button>
          </div>
        </div>
      );
    })}
  </>);}

  return(
    <div className="teacher-app">
      <style>{style}</style>
      {showBuilder&&<PathwayBuilderModal accounts={accounts} onSave={handleSavePathway} onClose={()=>setBuilder(false)}/>}
      {toast&&<Toast message={toast} onDone={()=>setToast(null)}/>}
      <div className="teacher-sidebar">
        <div className="sidebar-logo">Word Wizards<span>Teacher Portal</span></div>
        {nav.map(n=><button key={n.id} className={`nav-item ${view===n.id?"active":""}`} onClick={()=>setView(n.id)}><span className="nav-icon">{n.icon}</span>{n.label}</button>)}
        <div style={{marginTop:"auto"}}><button className="nav-item" onClick={onLogout}><span className="nav-icon">⊘</span>Sign Out</button></div>
      </div>
      <div className="teacher-main">
        {view==="dashboard"&&<Dashboard/>}
        {view==="classes"  &&<Classes/>}
        {view==="progress" &&<Progress/>}
        {view==="pathways" &&<Pathways/>}
        {view==="codes"    &&<ClassCodes/>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ACCOUNT FORM MODAL (Admin — create/edit)
// ═══════════════════════════════════════════════════════════════
function AccountModal({ account, onSave, onClose }) {
  const isNew = !account?.id;
  const [form, setForm] = useState({
    role:"student", name:"", email:"", username:"",
    password:"", status:"active", school:"Oakfield Primary",
    class:"", year:"Y5", avatar:"🦄",
    ...account,
  });
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  function submit() {
    if(!form.name.trim()) return;
    const acc = {
      ...form,
      id: form.id || "acc-"+Date.now(),
      createdAt: form.createdAt || new Date().toISOString().split("T")[0],
      pts: form.pts || 0, streak: form.streak || 0,
      skills: form.skills || {sentences:"mid",punctuation:"mid",grammar:"mid",spag:"low"},
    };
    onSave(acc);
  }

  return(
    <div className="modal-overlay" onClick={e=>e.target.className==="modal-overlay"&&onClose()}>
      <div className="modal-box admin-modal">
        <div className="modal-title">{isNew?"Create Account":"Edit Account"}</div>
        <div className="modal-subtitle">{isNew?"Add a new user to Word Wizards":"Update user details"}</div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <div style={{display:"flex",gap:6}}>
            {["student","teacher","admin"].map(r=><button key={r} onClick={()=>f("role",r)} style={{flex:1,padding:"9px",borderRadius:10,border:`1px solid ${form.role===r?"#ef4444":"rgba(255,255,255,.15)"}`,background:form.role===r?"rgba(239,68,68,.18)":"transparent",color:form.role===r?"#f87171":"rgba(255,255,255,.5)",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".82rem",cursor:"pointer",textTransform:"capitalize"}}>{r}</button>)}
          </div>
        </div>
        <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.name} onChange={e=>f("name",e.target.value)} placeholder="Full name"/></div>
        {form.role==="student"
          ? <div className="form-group"><label className="form-label">Username</label><input className="form-input" value={form.username||""} onChange={e=>f("username",e.target.value)} placeholder="e.g. amara.j"/></div>
          : <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email||""} onChange={e=>f("email",e.target.value)} placeholder="name@school.ac.uk"/></div>
        }
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" value={form.password||""} onChange={e=>f("password",e.target.value)} placeholder={isNew?"Set password":"Leave blank to keep current"}/></div>
        {form.role==="student"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="form-group"><label className="form-label">Class</label><input className="form-input" value={form.class||""} onChange={e=>f("class",e.target.value)} placeholder="e.g. 6A"/></div>
            <div className="form-group"><label className="form-label">Year Group</label><select className="form-input" value={form.year||"Y5"} onChange={e=>f("year",e.target.value)}>{["Y1","Y2","Y3","Y4","Y5","Y6"].map(y=><option key={y}>{y}</option>)}</select></div>
          </div>
        )}
        {form.role==="teacher"&&<div className="form-group"><label className="form-label">School</label><input className="form-input" value={form.school||""} onChange={e=>f("school",e.target.value)}/></div>}
        {form.role==="student"&&(
          <div className="form-group">
            <label className="form-label">Avatar</label>
            <div className="avatar-grid">{AVATARS.map((a,i)=><div key={i} className={`avatar-option ${form.avatar===a?"selected":""}`} onClick={()=>f("avatar",a)}>{a}</div>)}</div>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Status</label>
          <div style={{display:"flex",gap:6}}>
            {["active","suspended","inactive"].map(s=><button key={s} onClick={()=>f("status",s)} style={{flex:1,padding:"9px",borderRadius:10,border:`1px solid ${form.status===s?"rgba(239,68,68,.5)":"rgba(255,255,255,.12)"}`,background:form.status===s?"rgba(239,68,68,.12)":"transparent",color:form.status===s?"#f87171":"rgba(255,255,255,.45)",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".8rem",cursor:"pointer",textTransform:"capitalize"}}>{s}</button>)}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <div style={{flex:1}}/>
          <button className="btn-action" style={{background:"linear-gradient(135deg,#dc2626,#b91c1c)"}} onClick={submit}>{isNew?"Create Account":"Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN APP
// ═══════════════════════════════════════════════════════════════
function AdminApp({ accounts, saveAccounts, pathways, savePaths, onLogout }) {
  const [view, setView]        = useState("overview");
  const [tab, setTab]          = useState("all");
  const [search, setSearch]    = useState("");
  const [modal, setModal]      = useState(null);  // null | {mode:"create"|"edit", account}
  const [confirm, setConfirm]  = useState(null);  // account to delete
  const [toast, setToast]      = useState(null);
  const [logs, setLogs]        = useState(SEED_LOGS);

  const addLog = (type, detail) => setLogs(p=>[{id:Date.now(),type,user:"Admin",detail,ts:new Date().toISOString().slice(0,16).replace("T"," ")},...p.slice(0,49)]);

  const filtered = accounts.filter(a=>{
    if(tab!=="all"&&a.role!==tab) return false;
    if(!search) return true;
    return a.name.toLowerCase().includes(search.toLowerCase())||
           (a.email||"").toLowerCase().includes(search.toLowerCase())||
           (a.username||"").toLowerCase().includes(search.toLowerCase());
  });

  function saveAccount(acc) {
    const exists = accounts.find(a=>a.id===acc.id);
    if(exists) { saveAccounts(p=>p.map(a=>a.id===acc.id?acc:a)); addLog("edit","Account updated: "+acc.name); setToast("Account updated!"); }
    else        { saveAccounts(p=>[...p,acc]); addLog("create","Account created: "+acc.name); setToast("Account created!"); }
    setModal(null);
  }
  function deleteAccount(id) {
    const a=accounts.find(x=>x.id===id);
    saveAccounts(p=>p.filter(x=>x.id!==id));
    addLog("delete","Account deleted: "+(a?.name||id));
    setToast("Account deleted.","error");
    setConfirm(null);
  }
  function toggleStatus(id) {
    saveAccounts(p=>p.map(a=>{
      if(a.id!==id) return a;
      const ns=a.status==="active"?"suspended":"active";
      addLog("status","Account "+(ns==="suspended"?"suspended":"reactivated")+": "+a.name);
      return {...a,status:ns};
    }));
    setToast("Status updated!");
  }
  function resetPassword(id) {
    saveAccounts(p=>p.map(a=>a.id===id?{...a,password:"reset123"}:a));
    addLog("reset","Password reset for: "+(accounts.find(a=>a.id===id)?.name||id));
    setToast("Password reset to: reset123");
  }

  const stats = {
    total:accounts.length,
    teachers:accounts.filter(a=>a.role==="teacher").length,
    students:accounts.filter(a=>a.role==="student").length,
    suspended:accounts.filter(a=>a.status==="suspended").length,
  };

  const nav=[{id:"overview",icon:"◈",label:"Overview"},{id:"accounts",icon:"◎",label:"Accounts"},{id:"pathways",icon:"⬡",label:"Pathways"},{id:"logs",icon:"▲",label:"Activity Log"}];

  const logColors={login:"#34d399",create:"#a78bfa",edit:"#38bdf8",delete:"#f87171",suspend:"#fb923c",status:"#fbbf24",pathway:"#a78bfa",reset:"#f97316"};

  return(
    <div className="admin-app">
      <style>{style}</style>
      {toast&&<Toast message={toast} onDone={()=>setToast(null)}/>}

      {modal&&<AccountModal account={modal.account} onSave={saveAccount} onClose={()=>setModal(null)}/>}

      {confirm&&(
        <div className="modal-overlay">
          <div className="modal-box admin-modal" style={{maxWidth:400}}>
            <div className="modal-title" style={{color:"#f87171"}}>Delete Account</div>
            <p style={{color:"rgba(255,255,255,.6)",fontWeight:600,marginBottom:20}}>Are you sure you want to permanently delete <strong style={{color:"white"}}>{confirm.name}</strong>? This cannot be undone.</p>
            <div className="modal-footer" style={{paddingTop:0,borderTop:"none"}}>
              <button className="btn-ghost" onClick={()=>setConfirm(null)}>Cancel</button>
              <div style={{flex:1}}/>
              <button className="btn-danger" onClick={()=>deleteAccount(confirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">⬡ Word Wizards</div>
        <div className="admin-logo-badge">Admin Backend</div>
        {nav.map(n=><button key={n.id} className={`admin-nav-item ${view===n.id?"active":""}`} onClick={()=>setView(n.id)}><span className="nav-icon" style={{color:view===n.id?"#f87171":"inherit"}}>{n.icon}</span>{n.label}</button>)}
        <div style={{marginTop:"auto"}}>
          <button className="admin-nav-item" onClick={onLogout}><span className="nav-icon">⊘</span>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div className="admin-main">

        {view==="overview"&&(
          <>
            <div className="admin-header"><h1>System Overview</h1><p>Word Wizards Platform · {new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p></div>
            <div className="admin-stats">
              <div className="admin-stat" style={{borderLeftColor:"#ef4444"}}><div className="n">{stats.total}</div><div className="l">Total Accounts</div></div>
              <div className="admin-stat" style={{borderLeftColor:"#a855f7"}}><div className="n">{stats.teachers}</div><div className="l">Teachers</div></div>
              <div className="admin-stat" style={{borderLeftColor:"#34d399"}}><div className="n">{stats.students}</div><div className="l">Students</div></div>
              <div className="admin-stat" style={{borderLeftColor:"#f87171"}}><div className="n">{stats.suspended}</div><div className="l">Suspended</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="dash-card" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)"}}>
                <div className="dash-card-title" style={{color:"white"}}>👩‍🏫 Teachers</div>
                {accounts.filter(a=>a.role==="teacher").map(t=><div key={t.id} className="student-row"><div className="student-info"><div className="name" style={{color:"#a78bfa"}}>{t.name}</div><div className="class">{t.email} · {t.school||""}</div></div><span className={`status-dot ${t.status}`}/></div>)}
              </div>
              <div className="dash-card" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)"}}>
                <div className="dash-card-title" style={{color:"white"}}>⬡ Pathways Active</div>
                {pathways.filter(p=>p.active).map(p=><div key={p.id} className="student-row"><span style={{fontSize:"1.2rem"}}>{p.icon}</span><div className="student-info"><div className="name">{p.name}</div><div className="class">{p.assignedStudents.length} students</div></div><div style={{width:7,height:7,borderRadius:"50%",background:p.color,boxShadow:`0 0 8px ${p.color}`}}/></div>)}
                {pathways.filter(p=>p.active).length===0&&<p style={{color:"rgba(255,255,255,.3)",fontSize:".85rem",fontWeight:600}}>No active pathways</p>}
              </div>
            </div>
          </>
        )}

        {view==="accounts"&&(
          <>
            <div className="admin-header"><h1>Account Management</h1><p>Create, edit and manage all user accounts</p></div>
            <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
              <input className="search-bar" placeholder="Search by name, email or username…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}}/>
              <button className="btn-add" onClick={()=>setModal({mode:"create",account:null})}>+ New Account</button>
            </div>
            <div className="tab-row">
              {[["all","All"],["student","Students"],["teacher","Teachers"],["admin","Admins"]].map(([id,label])=><button key={id} className={`tab-btn ${tab===id?"active":""}`} onClick={()=>setTab(id)}>{label} {id!=="all"&&<span style={{fontSize:".7rem",marginLeft:3,opacity:.6}}>({accounts.filter(a=>a.role===id).length})</span>}</button>)}
            </div>
            <div className="account-table-wrap">
              <table className="account-table">
                <thead><tr><th>Name</th><th>Role</th><th>Login</th><th>Status</th><th>Created</th><th style={{textAlign:"right"}}>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(a=>(
                    <tr key={a.id}>
                      <td><div style={{display:"flex",alignItems:"center",gap:8}}>{a.role==="student"&&<span style={{fontSize:"1.1rem"}}>{a.avatar}</span>}<div><div style={{fontWeight:700,color:"white"}}>{a.name}</div>{a.role==="student"&&<div style={{fontSize:".7rem",color:"rgba(255,255,255,.3)"}}>{a.class} · {a.year}</div>}</div></div></td>
                      <td><span className={`role-badge ${a.role}`}>{a.role}</span></td>
                      <td style={{fontSize:".8rem",color:"rgba(255,255,255,.5)"}}>{a.email||a.username||"—"}</td>
                      <td><span className={`status-dot ${a.status}`}/>{a.status}</td>
                      <td style={{fontSize:".78rem",color:"rgba(255,255,255,.35)"}}>{a.createdAt||"—"}</td>
                      <td>
                        <div style={{display:"flex",gap:5,justifyContent:"flex-end"}}>
                          <button onClick={()=>setModal({mode:"edit",account:a})} style={{padding:"4px 10px",borderRadius:8,background:"rgba(167,139,250,.15)",border:"1px solid rgba(167,139,250,.25)",color:"#a78bfa",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".72rem",cursor:"pointer"}}>Edit</button>
                          <button onClick={()=>toggleStatus(a.id)} style={{padding:"4px 10px",borderRadius:8,background:a.status==="active"?"rgba(251,146,60,.12)":"rgba(52,211,153,.12)",border:`1px solid ${a.status==="active"?"rgba(251,146,60,.3)":"rgba(52,211,153,.3)"}`,color:a.status==="active"?"#fb923c":"#34d399",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".72rem",cursor:"pointer"}}>{a.status==="active"?"Suspend":"Restore"}</button>
                          <button onClick={()=>resetPassword(a.id)} style={{padding:"4px 10px",borderRadius:8,background:"rgba(56,189,248,.1)",border:"1px solid rgba(56,189,248,.25)",color:"#38bdf8",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".72rem",cursor:"pointer"}}>Reset PW</button>
                          {a.role!=="admin"&&<button onClick={()=>setConfirm(a)} style={{padding:"4px 10px",borderRadius:8,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",color:"#f87171",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".72rem",cursor:"pointer"}}>Delete</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length===0&&<tr><td colSpan={6} style={{textAlign:"center",color:"rgba(255,255,255,.25)",padding:"32px",fontWeight:600}}>No accounts found</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {view==="pathways"&&(
          <>
            <div className="admin-header"><h1>Pathway Overview</h1><p>All pathways across all teachers</p></div>
            {pathways.length===0&&<p style={{color:"rgba(255,255,255,.3)",fontWeight:600}}>No pathways created yet.</p>}
            {pathways.map(p=>(
              <div key={p.id} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:16,padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14,borderLeft:`4px solid ${p.color}`}}>
                <span style={{fontSize:"1.8rem"}}>{p.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,color:"white",fontSize:".95rem"}}>{p.name}</div>
                  <div style={{fontSize:".78rem",color:"rgba(255,255,255,.4)",margin:"2px 0"}}>{p.desc}</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5}}>
                    {p.activities.map(id=>{const m=ACTIVITY_META[id];return <span key={id} style={{background:`${m.color}22`,color:m.color,padding:"2px 7px",borderRadius:50,fontSize:".7rem",fontWeight:700}}>{m.icon} {m.label}</span>;})}
                  </div>
                </div>
                <div style={{textAlign:"right",minWidth:90}}>
                  <div style={{fontWeight:700,color:"white",fontSize:".88rem"}}>{p.assignedStudents.length} students</div>
                  <div style={{fontSize:".72rem",color:"rgba(255,255,255,.4)",margin:"2px 0"}}>{p.difficulty}</div>
                  <span style={{fontSize:".72rem",fontWeight:700,padding:"2px 8px",borderRadius:50,background:p.active?"rgba(52,211,153,.15)":"rgba(255,255,255,.06)",color:p.active?"#34d399":"rgba(255,255,255,.3)"}}>{p.active?"Active":"Inactive"}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {view==="logs"&&(
          <>
            <div className="admin-header"><h1>Activity Log</h1><p>Recent system and user actions</p></div>
            {logs.map(l=>(
              <div key={l.id} className="log-entry">
                <div className="log-dot" style={{background:logColors[l.type]||"#888",boxShadow:`0 0 6px ${logColors[l.type]||"#888"}`}}/>
                <div style={{flex:1}}>
                  <span style={{fontWeight:700,color:"white"}}>{l.user}</span> — {l.detail}
                </div>
                <div style={{fontSize:".72rem",color:"rgba(255,255,255,.3)",whiteSpace:"nowrap"}}>{l.ts}</div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SOCIAL ICONS (inline SVG, no external deps)
// ═══════════════════════════════════════════════════════════════
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
function MicrosoftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 21 21">
      <rect x="1" y="1"  width="9" height="9" fill="#f25022"/>
      <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 814 1000" fill="white">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-155.5-127.4C46.7 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269.1-317.3 71 0 130.5 43.8 176.3 43.8 43.7 0 112.2-46.2 190.5-46.2zm-167.2-123.1c31.6-36.6 54.2-87.5 54.2-138.4 0-7.1-.6-14.3-1.9-20.1-51.5 1.9-112.8 34.5-149.4 75.5-28.3 33.1-55.1 83.9-55.1 135.5 0 7.7 1.3 15.5 1.9 18 3.2.6 8.4 1.3 13.6 1.3 46.2 0 103.1-31.6 136.7-71.8z"/>
    </svg>
  );
}

function SocialLoginButtons({ intent = "student", fullWidth = false }) {
  const { signIn, isLoaded } = useSignIn();

  async function loginWith(provider) {
    if (!isLoaded) return;
    // Store intent before redirect so we know on return
    localStorage.setItem("ww:clerkIntent", intent);
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: window.location.origin,
        redirectUrlComplete: window.location.origin,
      });
    } catch(e) {
      console.error("Clerk login error:", e);
    }
  }

  const btnStyle = fullWidth
    ? { width:"100%", marginBottom:8 }
    : { flex:1, padding:"11px 8px", fontSize:".78rem" };

  return (
    <div style={fullWidth ? {} : {display:"flex",gap:8,marginBottom:4}}>
      <button className="social-btn" style={btnStyle} onClick={()=>loginWith("google")}>
        <span className="social-shimmer"/><span className="social-btn-icon" style={{fontSize:"1rem"}}><GoogleIcon/></span>
        {fullWidth ? "Continue with Google" : "Google"}
      </button>
      <button className="social-btn" style={btnStyle} onClick={()=>loginWith("microsoft")}>
        <span className="social-shimmer"/><span className="social-btn-icon" style={{fontSize:"1rem"}}><MicrosoftIcon/></span>
        {fullWidth ? "Continue with Microsoft" : "Microsoft"}
      </button>
      <button className="social-btn" style={btnStyle} onClick={()=>loginWith("apple")}>
        <span className="social-shimmer"/><span style={{fontSize:"1rem"}}>🍎</span>
        {fullWidth ? "Continue with Apple" : "Apple"}
      </button>
    </div>
  );
}

function SignupFlow({ accounts, saveAccounts, classes, saveClasses, onSuccess, onBack, clerkUser }) {
  const [step, setStep]           = useState(0); // 0=method 1=details 2=avatar 3=classcode 4=done
  const [method, setMethod]       = useState(null);
  const [form, setForm]           = useState({ firstName:"", lastName:"", email:"", username:"", password:"", year:"Year 5" });

  // ── Clerk: hook for triggering OAuth ────────────────────────────────────
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  async function handleSocialClick(provider) {
    setMethod(provider);
    const strategy = `oauth_${provider}`;
    const redirectUrl = window.location.origin;
    localStorage.setItem("ww:clerkIntent", "student"); // signup is always student
    try {
      if (signInLoaded) {
        await signIn.authenticateWithRedirect({ strategy, redirectUrl, redirectUrlComplete: redirectUrl });
      }
    } catch(e) {
      try {
        if (signUpLoaded) {
          await signUp.authenticateWithRedirect({ strategy, redirectUrl, redirectUrlComplete: redirectUrl });
        }
      } catch(e2) {
        console.error("Clerk OAuth error:", e2);
        setStep(1);
      }
    }
  }
  // ────────────────────────────────────────────────────────────────────────

  // Pre-fill form if we came back from a Clerk OAuth with a new user
  useEffect(() => {
    if (!clerkUser) return;
    const firstName = clerkUser.firstName || "";
    const lastName  = clerkUser.lastName  || "";
    const email     = clerkUser.primaryEmailAddress?.emailAddress || "";
    const base = firstName && lastName
      ? (firstName.toLowerCase().charAt(0) + "." + lastName.toLowerCase().replace(/\s+/g,"")).slice(0,16)
      : "";
    setForm(p => ({ ...p, firstName, lastName, email, username: base }));
    setMethod("google"); // treat as social signup
    setStep(1);          // skip method choice, go straight to details
  }, [clerkUser]);
  const [avatar, setAvatar]       = useState("🦄");
  const [colour, setColour]       = useState("#7c3aed");
  const [code, setCode]           = useState("");
  const [foundClass, setFoundClass] = useState(null);
  const [codeStatus, setCodeStatus] = useState(null); // null|'valid'|'invalid'
  const [formErr, setFormErr]     = useState("");

  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  // Auto-generate username from name
  useEffect(() => {
    if(form.firstName && form.lastName) {
      const base = (form.firstName.toLowerCase().charAt(0) + "." + form.lastName.toLowerCase().replace(/\s+/g,"")).slice(0,16);
      f("username", base);
    }
  }, [form.firstName, form.lastName]);

  function checkCode(val) {
    setCode(val.toUpperCase());
    if(val.length < 6) { setCodeStatus(null); setFoundClass(null); return; }
    const cls = classes.find(c=>c.code===val.toUpperCase());
    if(cls) { setFoundClass(cls); setCodeStatus("valid"); }
    else { setFoundClass(null); setCodeStatus("invalid"); }
  }

  function validateDetails() {
    if(!form.firstName.trim()) return "Please enter your first name.";
    if(!form.lastName.trim())  return "Please enter your last name.";
    if(method==="email" && !form.email.includes("@")) return "Please enter a valid email address.";
    if(method==="email" && form.password.length<6) return "Password must be at least 6 characters.";
    const taken = accounts.find(a=>a.username===form.username||a.email===form.email);
    if(taken) return "That username or email is already taken. Please try another.";
    return null;
  }

  async function finish() {
    const newId = "acc-s-" + Date.now();
    const today = new Date().toISOString().slice(0,10);
    const newStudent = {
      id: newId,
      role: "student",
      name: form.firstName + " " + form.lastName,
      username: form.username,
      email: form.email || null,
      password: form.password || "wizard" + Math.floor(1000+Math.random()*9000),
      status: "active",
      year: form.year,
      class: foundClass ? foundClass.name.replace("Class ","") : null,
      classId: foundClass ? foundClass.id : null,
      avatar, colour,
      pts: 0, streak: 0,
      skills:{ sentences:"low", punctuation:"low", grammar:"low", spag:"low" },
      signupMethod: method,
      createdAt: today,
      pendingApproval: foundClass ? false : true,
    };
    const updated = [...accounts, newStudent];
    await saveAccounts(updated);
    if(foundClass) {
      const updatedClasses = classes.map(c=>c.id===foundClass.id?{...c,students:[...c.students,newId]}:c);
      await saveClasses(updatedClasses);
    }
    onSuccess({ id:newStudent.id, name:newStudent.name, avatar, colour, year:form.year, startPts:0, streak:0, pendingApproval:newStudent.pendingApproval, className:foundClass?.name });
  }

  const stepLabels = ["Method","Details","Avatar","Class","Done"];

  return (
    <div className="landing-card pop-in" style={{maxWidth:460}}>
      {/* Progress dots */}
      <div className="signup-step-pill">
        {[0,1,2,3].map(i=>(
          <div key={i} className={`step-dot ${i<step?"done":i===step?"active":""}`}/>
        ))}
      </div>

      {/* ── Step 0: Choose Method ── */}
      {step===0&&(
        <>
          <div className="signup-card-title">Create your account</div>
          <div className="signup-card-sub">Choose how you'd like to sign up</div>
          <button className="social-btn google" onClick={()=>handleSocialClick("google")}>
            <span className="social-shimmer"/>
            <span className="social-btn-icon"><GoogleIcon/></span>
            Continue with Google
          </button>
          <button className="social-btn microsoft" onClick={()=>handleSocialClick("microsoft")}>
            <span className="social-shimmer"/>
            <span className="social-btn-icon"><MicrosoftIcon/></span>
            Continue with Microsoft
          </button>
          <button className="social-btn apple" onClick={()=>handleSocialClick("apple")}>
            <span className="social-shimmer"/>
            <span className="social-btn-icon"><AppleIcon/></span>
            Continue with Apple
          </button>

          <div className="or-divider"><span>or</span></div>
          <button className="social-btn" onClick={()=>{setMethod("email");setStep(1);}}>
            <span className="social-shimmer"/>
            <span style={{fontSize:"1.1rem"}}>✉</span>
            Sign up with email &amp; password
          </button>
          <button onClick={onBack} style={{width:"100%",marginTop:10,background:"none",border:"none",color:"rgba(255,255,255,.3)",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:".82rem",cursor:"pointer",padding:"8px"}}>← Back to login</button>
        </>
      )}

      {/* ── Step 1: Details ── */}
      {step===1&&(
        <>
          <div className="signup-card-title">Your details</div>
          <div className="signup-card-sub">
            {method==="google"&&<><GoogleIcon/> </>}
            {method==="microsoft"&&<><MicrosoftIcon/> </>}
            {method==="apple"&&"🍎 "}
{method==="email"?"Signing up with email":`Signing in with ${method.charAt(0).toUpperCase()+method.slice(1)}`}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="form-group"><label className="form-label">First name</label><input className="form-input" placeholder="e.g. Amara" value={form.firstName} onChange={e=>f("firstName",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Last name</label><input className="form-input" placeholder="e.g. Johnson" value={form.lastName} onChange={e=>f("lastName",e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Year group</label>
            <select className="form-input" value={form.year} onChange={e=>f("year",e.target.value)}>
              {["Year 1","Year 2","Year 3","Year 4","Year 5","Year 6"].map(y=><option key={y}>{y}</option>)}
            </select>
          </div>
          {method==="email"&&(
            <>
              <div className="form-group"><label className="form-label">Email address</label><input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e=>f("email",e.target.value)}/></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="At least 6 characters" value={form.password} onChange={e=>f("password",e.target.value)}/></div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Username <span style={{color:"rgba(255,255,255,.3)",fontWeight:600,textTransform:"none",letterSpacing:0}}>— auto-generated, you can change it</span></label>
            <input className="form-input" value={form.username} onChange={e=>f("username",e.target.value)} style={{fontFamily:"monospace",letterSpacing:".04em"}}/>
          </div>
          {formErr&&<p style={{color:"#f87171",fontSize:".8rem",fontWeight:700,textAlign:"center",marginBottom:10}}>{formErr}</p>}
          <div style={{display:"flex",gap:8}}>
            <button className="btn-primary" style={{flex:1,background:"rgba(255,255,255,.07)",boxShadow:"none",border:"1px solid rgba(255,255,255,.12)"}} onClick={()=>setStep(0)}>← Back</button>
            <button className="btn-primary" style={{flex:2}} onClick={()=>{const e=validateDetails();if(e){setFormErr(e);return;}setFormErr("");setStep(2);}}>Next: Avatar →</button>
          </div>
        </>
      )}

      {/* ── Step 2: Avatar & colour ── */}
      {step===2&&(
        <>
          <div className="signup-card-title">Personalise your wizard</div>
          <div className="signup-card-sub">Pick an avatar and colour theme</div>
          <div style={{fontSize:"4rem",textAlign:"center",marginBottom:10,filter:"drop-shadow(0 0 20px rgba(167,139,250,.6))"}}>{avatar}</div>
          <div className="avatar-grid">{AVATARS.map((a,i)=><div key={i} className={`avatar-option ${avatar===a?"selected":""}`} onClick={()=>setAvatar(a)}>{a}</div>)}</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",margin:"14px 0 20px"}}>
            {COLORS.map(c=><div key={c} onClick={()=>setColour(c)} style={{width:34,height:34,borderRadius:"50%",background:c,cursor:"pointer",border:colour===c?"3px solid white":"3px solid transparent",transform:colour===c?"scale(1.25)":"scale(1)",transition:"all .2s",boxShadow:colour===c?`0 0 14px ${c}`:"none"}}/>)}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-primary" style={{flex:1,background:"rgba(255,255,255,.07)",boxShadow:"none",border:"1px solid rgba(255,255,255,.12)"}} onClick={()=>setStep(1)}>← Back</button>
            <button className="btn-primary" style={{flex:2}} onClick={()=>setStep(3)}>Next: Join a class →</button>
          </div>
        </>
      )}

      {/* ── Step 3: Class code ── */}
      {step===3&&(
        <>
          <div className="signup-card-title">Join a class</div>
          <div className="signup-card-sub">Enter the class code your teacher gave you, or skip to join later</div>
          <div className="class-code-input-wrap">
            <input
              className={`class-code-input ${codeStatus==="valid"?"valid":codeStatus==="invalid"?"invalid":""}`}
              placeholder="ABC123"
              maxLength={6}
              value={code}
              onChange={e=>checkCode(e.target.value)}
            />
          </div>
          {codeStatus==="valid"&&foundClass&&(
            <div style={{textAlign:"center",marginTop:8,marginBottom:4}}>
              <span className="found-class-pill" style={{background:`${foundClass.color}20`,color:foundClass.color,borderColor:`${foundClass.color}55`}}>
                ✓ {foundClass.name} · {foundClass.year}
              </span>
            </div>
          )}
          {codeStatus==="invalid"&&(
            <p className="code-validation-msg" style={{color:"#f87171"}}>✗ That code wasn't found — check with your teacher</p>
          )}
          {codeStatus===null&&<p className="code-validation-msg" style={{color:"rgba(255,255,255,.2)"}}>6-character code, e.g. WIZA6A</p>}
          <div style={{display:"flex",gap:8,marginTop:18}}>
            <button className="btn-primary" style={{flex:1,background:"rgba(255,255,255,.07)",boxShadow:"none",border:"1px solid rgba(255,255,255,.12)"}} onClick={()=>setStep(2)}>← Back</button>
            <button className="btn-primary" style={{flex:2,background:codeStatus==="valid"?"linear-gradient(135deg,#059669,#10b981)":undefined}} onClick={finish}>
              {codeStatus==="valid"?`Join ${foundClass?.name} →`:"Skip for now →"}
            </button>
          </div>
          <p style={{textAlign:"center",marginTop:10,fontSize:".72rem",color:"rgba(255,255,255,.2)",fontWeight:600}}>
            {codeStatus!=="valid"&&"You can join a class later from your teacher's invitation."}
          </p>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [accounts, saveAccounts, accsLoaded] = useStorage("ww:accounts", SEED_ACCOUNTS);
  const [pathways, savePaths,    pwLoaded]   = useStorage("ww:pathways",  SEED_PATHWAYS);
  const [classes,  saveClasses,  clsLoaded]  = useStorage("ww:classes",   SEED_CLASSES);

  const [screen,    setScreen]    = useState("landing");
  const [loginType, setLoginType] = useState("student");
  const [profile,   setProfile]   = useState(null);
  const [step,      setStep]      = useState(0);
  const [tmp,       setTmp]       = useState({name:"",avatar:"🦄",colour:"#7c3aed",year:"Year 5"});
  const [email,     setEmail]     = useState("");
  const [pass,      setPass]      = useState("");
  const [loginErr,  setLoginErr]  = useState("");
  const [clerkUser, setClerkUser] = useState(null); // holds Clerk user after OAuth

  // ── Clerk: detect session after OAuth redirect ──────────────────────────
  const { isSignedIn, user: clerkSession, isLoaded: clerkLoaded } = useUser();
  const [clerkTeacherErr, setClerkTeacherErr] = useState("");
  useEffect(() => {
    if (!clerkLoaded || !isSignedIn || !clerkSession) return;
    if (screen !== "landing") return; // already navigated
    const clerkEmail = clerkSession.primaryEmailAddress?.emailAddress;
    if (!clerkEmail) return;

    // Retrieve which login tab triggered the OAuth (stored before redirect)
    const intent = localStorage.getItem("ww:clerkIntent") || "student";
    localStorage.removeItem("ww:clerkIntent");

    const existing = accounts.find(a => a.email === clerkEmail && a.status === "active");

    if (intent === "teacher") {
      // Teacher flow: must already have a teacher account with matching email
      if (existing && existing.role === "teacher") {
        setScreen("teacher");
      } else {
        // Not set up — show error on teacher tab
        setLoginType("teacher");
        setClerkTeacherErr("No teacher account found for " + clerkEmail + ". Please ask your admin to set up your account.");
      }
    } else {
      // Student flow
      if (existing && existing.role === "student") {
        setProfile({ id:existing.id, name:existing.name, avatar:existing.avatar||"🦄", year:existing.year, colour:existing.colour||"#7c3aed", startPts:existing.pts||0, streak:existing.streak||0 });
        setScreen("student");
      } else if (!existing) {
        // New student — pre-fill signup from Clerk data
        setClerkUser(clerkSession);
        setScreen("signup");
      }
    }
  }, [clerkLoaded, isSignedIn, clerkSession, accounts, screen]);
  // ────────────────────────────────────────────────────────────────────────

  const allLoaded = accsLoaded && pwLoaded && clsLoaded;

  if(!allLoaded) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0e0a2e"}}>
      <style>{style}</style>
      <div className="spinner" style={{width:36,height:36,border:"3px solid rgba(167,139,250,.3)",borderTopColor:"#a78bfa"}}/>
    </div>
  );

  function doLogin() {
    // Only handles teacher-created student credential login
    setLoginErr("");
    const a = accounts.find(a => {
      if (a.status === "suspended") return false;
      return a.role === "student" &&
        (a.username === email || a.name.toLowerCase() === email.toLowerCase()) &&
        a.password === pass;
    });
    if (!a) { setLoginErr("Incorrect username or password."); return; }
    setProfile({ id:a.id, name:a.name, avatar:a.avatar||"🦄", year:a.year, colour:a.colour||"#7c3aed", startPts:a.pts||0, streak:a.streak||0 });
    setScreen("student");
  }

  function doAdminLogin() {
    const a = accounts.find(a=>a.role==="admin"&&a.email===email&&a.password===pass&&a.status==="active");
    if(!a){ setLoginErr("Invalid admin credentials."); return; }
    setScreen("admin");
  }

  function handleSignupSuccess(prof) {
    setProfile(prof);
    setScreen("student");
  }

  const logout = () => { setScreen("landing"); setEmail(""); setPass(""); setLoginErr(""); };

  if(screen==="student") return <><style>{style}</style><ParticleBg/><StudentApp profile={profile} onLogout={logout} accounts={accounts} saveAccounts={saveAccounts}/></>;
  if(screen==="teacher") return <TeacherApp onLogout={logout} accounts={accounts} pathways={pathways} savePaths={savePaths} classes={classes} saveClasses={saveClasses}/>;
  if(screen==="admin")   return <AdminApp onLogout={logout} accounts={accounts} saveAccounts={saveAccounts} pathways={pathways} savePaths={savePaths}/>;

  /* ── Signup ── */
  if(screen==="signup") return (
    <div className="app"><style>{style}</style><ParticleBg/>
      <div className="landing">
        <div className="landing-logo-wrap">
          <WizardMascot/>
          <div className="landing-title">Word <span>Wizards</span></div>
          <div className="landing-subtitle">KS1 &amp; KS2 English Learning</div>
        </div>
        <SignupFlow
          accounts={accounts}
          saveAccounts={saveAccounts}
          classes={classes}
          saveClasses={saveClasses}
          onSuccess={handleSignupSuccess}
          onBack={()=>setScreen("landing")}
          clerkUser={clerkUser}
        />
      </div>
    </div>
  );

  /* ── Profile Setup (legacy path) ── */
  if(screen==="setup") return(
    <div className="app"><style>{style}</style><ParticleBg/>
      <div className="landing">
        <div className="landing-logo-wrap"><WizardMascot/><div className="landing-title">Word <span>Wizards</span></div><div className="landing-subtitle">Build your wizard profile</div></div>
        <div className="landing-card pop-in">
          {step===0&&(<><div className="form-group"><label className="form-label">Your name</label><input className="form-input" placeholder="Enter your first name" value={tmp.name} onChange={e=>setTmp(p=>({...p,name:e.target.value}))}/></div><div className="form-group"><label className="form-label">Year group</label><select className="form-input" value={tmp.year} onChange={e=>setTmp(p=>({...p,year:e.target.value}))}>{["Year 1","Year 2","Year 3","Year 4","Year 5","Year 6"].map(y=><option key={y}>{y}</option>)}</select></div><button className="btn-primary" onClick={()=>tmp.name&&setStep(1)}>Choose your avatar →</button></>)}
          {step===1&&(<><p className="form-label" style={{marginBottom:10}}>Pick your wizard avatar</p><div className="avatar-grid">{AVATARS.map((a,i)=><div key={i} className={`avatar-option ${tmp.avatar===a?"selected":""}`} onClick={()=>setTmp(p=>({...p,avatar:a}))}>{a}</div>)}</div><div style={{display:"flex",gap:8,marginTop:10}}><button className="btn-primary" style={{flex:1,background:"rgba(255,255,255,.08)",boxShadow:"none",border:"1px solid rgba(255,255,255,.12)"}} onClick={()=>setStep(0)}>← Back</button><button className="btn-primary" style={{flex:2}} onClick={()=>setStep(2)}>Choose colour →</button></div></>)}
          {step===2&&(<><div style={{fontSize:"4rem",textAlign:"center",margin:"0 auto 12px",filter:"drop-shadow(0 0 20px rgba(167,139,250,.6))"}}>{tmp.avatar}</div><p style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.4rem",color:"white",marginBottom:4,textAlign:"center"}}>{tmp.name}</p><p style={{color:"rgba(255,255,255,.45)",fontWeight:700,marginBottom:20,textAlign:"center",fontSize:".85rem"}}>{tmp.year} · Ready!</p><p className="form-label" style={{marginBottom:10}}>Wizard colour</p><div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:24}}>{COLORS.map(c=><div key={c} onClick={()=>setTmp(p=>({...p,colour:c}))} style={{width:36,height:36,borderRadius:"50%",background:c,cursor:"pointer",border:tmp.colour===c?"3px solid white":"3px solid transparent",transform:tmp.colour===c?"scale(1.25)":"scale(1)",transition:"all .2s",boxShadow:tmp.colour===c?`0 0 16px ${c}`:"none"}}/>)}</div><button className="btn-primary" onClick={()=>{setProfile({...tmp,startPts:120});setScreen("student");}}>Begin your quest! ⚔</button></>)}
        </div>
      </div>
    </div>
  );

  /* ── Landing ── */
  return(
    <div className="app"><style>{style}</style><ParticleBg/>
      <div className="landing">
        <div className="landing-logo-wrap slide-up"><WizardMascot/><div className="landing-title">Word <span>Wizards</span></div><div className="landing-subtitle">KS1 &amp; KS2 English Learning</div></div>
        <div className="landing-card slide-up" style={{animationDelay:".1s"}}>
          <div className="login-toggle">
            <button className={`toggle-btn ${loginType==="student"?"active":""}`} onClick={()=>{setLoginType("student");setLoginErr("")}}>⚔ Pupil</button>
            <button className={`toggle-btn ${loginType==="teacher"?"active":""}`} onClick={()=>{setLoginType("teacher");setLoginErr("")}}>◈ Teacher</button>
            <button className={`toggle-btn ${loginType==="admin"?"active":""}`} style={{fontSize:".75rem",color:loginType==="admin"?"#f87171":""}} onClick={()=>{setLoginType("admin");setLoginErr("")}}>⬡ Admin</button>
          </div>

          {loginType==="student"&&(
            <>
              <div className="form-group"><label className="form-label">Username</label><input className="form-input" placeholder="Your username" value={email} onChange={e=>{setEmail(e.target.value);setLoginErr("")}}/></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Your password" value={pass} onChange={e=>{setPass(e.target.value);setLoginErr("")}}/></div>
              {loginErr&&<p style={{color:"#f87171",fontSize:".82rem",fontWeight:700,marginBottom:10,textAlign:"center"}}>{loginErr}</p>}
              <button className="btn-primary" onClick={()=>email&&pass?doLogin():setLoginErr("Please enter your username and password.")}>Begin Quest ⚔</button>
              <div className="or-divider"><span>or sign in with</span></div>
              <SocialLoginButtons intent="student"/>
              <div className="or-divider"><span>new here?</span></div>
              <button className="social-btn" style={{marginBottom:0}} onClick={()=>setScreen("signup")}>
                <span className="social-shimmer"/>
                <span style={{fontSize:"1rem"}}>✦</span> Create your free account
              </button>
              
            </>
          )}

          {loginType==="teacher"&&(
            <div style={{paddingTop:4}}>
              <p style={{fontSize:".82rem",color:"rgba(255,255,255,.45)",fontWeight:700,textAlign:"center",marginBottom:20,lineHeight:1.5}}>
                Sign in with your school email address.<br/>
                <span style={{color:"rgba(255,255,255,.25)",fontSize:".75rem"}}>Your account must be set up by an admin first.</span>
              </p>
              <SocialLoginButtons intent="teacher" fullWidth={true}/>
              {clerkTeacherErr&&(
                <div style={{marginTop:14,padding:"12px 16px",background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.3)",borderRadius:12}}>
                  <p style={{color:"#f87171",fontSize:".8rem",fontWeight:700,textAlign:"center",lineHeight:1.5}}>{clerkTeacherErr}</p>
                  <button onClick={()=>setClerkTeacherErr("")} style={{display:"block",margin:"8px auto 0",background:"none",border:"none",color:"rgba(255,255,255,.3)",fontSize:".75rem",cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>Dismiss</button>
                </div>
              )}
            </div>
          )}

          {loginType==="admin"&&(<><div className="form-group"><label className="form-label" style={{color:"rgba(239,68,68,.7)"}}>Admin Email</label><input className="form-input" placeholder="admin@wordwizards.com" value={email} onChange={e=>{setEmail(e.target.value);setLoginErr("")}} style={{borderColor:"rgba(239,68,68,.2)"}}/></div><div className="form-group"><label className="form-label" style={{color:"rgba(239,68,68,.7)"}}>Admin Password</label><input className="form-input" type="password" placeholder="Password" value={pass} onChange={e=>{setPass(e.target.value);setLoginErr("")}} style={{borderColor:"rgba(239,68,68,.2)"}}/></div>{loginErr&&<p style={{color:"#f87171",fontSize:".82rem",fontWeight:700,marginBottom:10,textAlign:"center"}}>{loginErr}</p>}<button className="btn-primary" style={{background:"linear-gradient(135deg,#7f1d1d,#dc2626)"}} onClick={()=>email&&pass?doAdminLogin():setLoginErr("Please enter admin credentials.")}>Enter Admin Backend ⬡</button></>)}
        </div>
      </div>
    </div>
  );
}
