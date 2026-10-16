// Logic regressions without browser dependencies. Rendering is stubbed out.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const app = fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf8');
const boundary = app.indexOf("canvas.addEventListener('pointermove'");
assert.ok(boundary > 0, 'Application initialization boundary exists');
const scenarios = `
updateUI=()=>{};toast=()=>{};log=()=>{};tone=()=>{};
particlesAt=()=>{};confetti=()=>{};save=()=>{};
let crises=0;
legacyShowCrisis=()=>{crises++;modalType='crisis';};
const reset=()=>{state=freshState();state.onboarded=true;state.bugs=[];modalType=null;crises=0;};

// A manual deployment can exhaust stability between simulation frames.
reset();state.stability=1;state.upgrades.cooling=5;
deploy();assert.equal(state.stability,0);
const credits=state.credits,uptime=state.uptime;
tick(.1);
assert.equal(crises,1);assert.equal(modalType,'crisis');
assert.equal(state.stability,0);assert.equal(state.credits,credits);
assert.equal(state.uptime,uptime);
console.log('PASS collapse precedes recovery and income');

// A brief dip must count even when the player repairs before the next frame.
reset();state.stability=85;
state.run.boss={id:'migration',phase:1,time:100,progress:10,startKills:0,pulse:20,actionCd:0,supportCd:0};
doChaos();assert.equal(state.stability,77);
assert.equal(state.run.boss.progress,0);
doFix();assert.equal(state.stability,89);
raidTick(.1);assert.equal(state.run.boss.progress,.1);
setStability(0);assert.equal(state.run.boss.progress,.1);
setStability(80-state.stability);assert.equal(state.run.boss.progress,.1);
setStability(-.01);assert.equal(state.run.boss.progress,0);
console.log('PASS hold resets on dips and accepts the exact threshold');

// Simulation damage also resets the hold before a medic repairs it.
reset();state.stability=80.001;
state.run.boss={id:'migration',phase:1,time:100,progress:10,startKills:0,pulse:20,actionCd:0,supportCd:0};
state.bugs=[{id:1,hp:1,target:1}];
state.run.droneLevels.medic=1;state.run.clocks.medic=12;
tick(.1);assert.ok(state.stability>80);
assert.equal(state.run.boss.progress,.1);
console.log('PASS medic cannot conceal a hold interruption');

reset();state.paused=true;
for(const cmd of ['duck','bro','brooo','brooooo'])executeCommand(cmd);
assert.equal(state.credits,1250);assert.equal(state.secrets.length,0);
assert.equal(state.xp,0);assert.equal(state.achievements.length,0);
executeCommand('resume');assert.equal(state.paused,false);
executeCommand('duck');executeCommand('bro');
assert.equal(state.credits,1475);assert.equal(state.secrets.length,2);
assert.ok(state.achievements.includes('secret'));
executeCommand('duck');executeCommand('brooooo');
assert.equal(state.credits,1475);
console.log('PASS paused secrets grant nothing and work once after resume');
})();`;

vm.runInNewContext(app.slice(0, boundary) + scenarios, {
  assert, console, structuredClone,
  window: {matchMedia: () => ({matches: false})},
  document: {getElementById: () => ({getContext: () => null}), hidden: false},
  localStorage: {getItem: () => null},
  performance: {now: () => 0},
}, {filename: 'app-regression.js'});
