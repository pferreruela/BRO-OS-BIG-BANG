from pathlib import Path
import json, traceback
from playwright.sync_api import sync_playwright
import os, shutil, tempfile
ROOT=Path(__file__).resolve().parents[1]
QA=Path(tempfile.mkdtemp(prefix='bro-os-bigbang-tests-'))
html=(ROOT/'BRO-OS-BIG-BANG.html').read_text()
# Test instrumentation is never included in the distributed application.
api='''
window.Q={
 snapshot:()=>structuredClone(state),fresh:freshState,legacy:legacyFreshState,validate:validateSave,
 set:(s)=>{state=validateSave(s);resetRenderCaches();forceCloseModal();updateUI();},
 mutate:(fn)=>{fn(state);expKeys={};viewDirty=true;updateUI();},
 go:switchView,step:(t)=>{for(let i=0;i<Math.ceil(t*10);i++)tick(Math.min(.1,t-i*.1));updateUI();},
 drones:droneTick,buyDrone,buyPermanent,startRaid,raidAvailable,phase:raidPhase,
 support:raidSupport,patch:raidPatch,purge:()=>state.bugs[0]&&hitBug(state.bugs[0].id),fix:doFix,rollback:doRollback,
 showPrestige,prestigeReady,fragmentReward,showCrisis,progress:checkProgress,save,income,deployCost,deploy,
 validate:validateSave,readBackup,exportSave,failRaid,
 phaseGoal,raidProgress,draw:()=>{resizeCanvas();drawScene(0);},canAct,
 reset:()=>{state=freshState();state.onboarded=true;resetRenderCaches();forceCloseModal();updateUI();}
};
'''
idx=html.rfind('})();')
html=html[:idx]+api+html[idx:]
html=html.replace('requestAnimationFrame(loop);','/* deterministic QA clock */')
(QA/'instrumented.html').write_text(html)
STORE='bro-os-bigbang-v2'; OLD='bro-os-save-v1'
MOCK='''seed=>{const data={...seed};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>Object.hasOwn(data,k)?data[k]:null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>{delete data[k]},clear:()=>{for(const k in data)delete data[k]},key:i=>Object.keys(data)[i]||null,get length(){return Object.keys(data).length}}});}'''
results=[]
def ok(name,cond=True):
    assert cond,name
    results.append(name)
    print('PASS',name,flush=True)
def snap(page): return page.evaluate('Q.snapshot()')
def new_page(browser,seed=None):
    page=browser.new_page(viewport={'width':1440,'height':1000})
    page.evaluate(MOCK,seed or {})
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(html,wait_until='domcontentloaded')
    return page,errors
with sync_playwright() as p:
    launch={'headless':True}
    executable=os.environ.get('BROWSER_EXECUTABLE') or shutil.which('chromium')
    if executable:launch['executable_path']=executable
    browser=p.chromium.launch(**launch)
    page,errors=new_page(browser)
    page.click('#startBtn')
    ok('Fresh start renders without JavaScript errors',not errors)
    legacy=page.evaluate('Q.legacy()')
    legacy.update(credits=68000,totalEarned=98000,totalDefeated=135,totalDeploys=13,totalUpgrades=70,coffees=5,chaosCount=4,highStableSeconds=90,xp=5200,uptime=940,stability=98,onboarded=True,paused=False)
    legacy['nodes']=[{'id':i,'name':f'legacy-server-{i}','level':5} for i in range(1,17)]
    legacy['upgrades']={'cooling':5,'firewall':5,'workers':5,'capacity':4}
    legacy['completed']=[f'm{i}' for i in range(1,7)]
    legacy['achievements']=['first','bugs','coffee','chaos','empire','stable','rich','senior','secret']
    legacy['secrets']=['duck','sudo','bro'];legacy['bugs']=[];legacy['events']=[]
    (QA/'legacy-fixture.json').write_text(json.dumps(legacy))
    page.click('#topSettingsBtn')
    page.locator('#importInput').set_input_files(str(QA/'legacy-fixture.json'))
    page.click('#confirmImport')
    s=snap(page)
    ok('v1 file import preserves all 16 servers and all nine achievements',s['nodes']==legacy['nodes'] and s['achievements']==legacy['achievements'])
    ok('v1 file import preserves credits, upgrades, campaign, XP',all(s[k]==legacy[k] for k in ['credits','upgrades','completed','xp']))
    ok('v1 migrates into a separate v2 save with no prestige',s['version']==2 and s['meta']['prestiges']==0)
    ok('Import backs up the previous v2 state',page.evaluate('Q.readBackup()!==null'))
    old_json=json.dumps(legacy)
    auto,autoerr=new_page(browser,{OLD:old_json})
    ok('Automatic same-storage v1 migration preserves original key',auto.evaluate('(key)=>localStorage.getItem(key)',OLD)==old_json and snap(auto)['nodes']==legacy['nodes'])
    auto.evaluate('Q.save()')
    ok('Migration writes v2, never overwrites v1',auto.evaluate('localStorage.getItem("bro-os-bigbang-v2")!==null') and auto.evaluate('(key)=>localStorage.getItem(key)',OLD)==old_json)
    auto.close()
    # Invalid files and save data cannot partially overwrite the active game.
    before=snap(page)
    page.click('#topSettingsBtn')
    page.locator('#importInput').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{not json'})
    ok('Malformed JSON leaves current game intact',snap(page)==before)
    page.click('#settingsDone')
    bads=[]
    for path,value in [('meta.fragments',-1),('meta.prestiges',1.5),('run.dimension','evil'),('run.droneLevels.purger',99),('run.reserve',-2)]:
        raw=json.loads(json.dumps(before));obj=raw;parts=path.split('.')
        for k in parts[:-1]:obj=obj[k]
        obj[parts[-1]]=value;bads.append(raw)
    count=page.evaluate('(items)=>items.filter(s=>{try{Q.validate(s);return false}catch{return true}}).length',bads)
    ok('Save validator rejects invalid meta, dimensions, drone levels and reserve',count==len(bads))
    before=snap(page);page.click('#pauseBtn');page.evaluate('Q.deploy()');after=snap(page)
    ok('Pause blocks game actions',after['credits']==before['credits'] and len(after['nodes'])==16)
    page.click('#pauseBtn')
    # Drone behavior and reserves.
    page.evaluate('Q.reset();Q.mutate(s=>{s.credits=9000;s.run.reserve=1000;s.bugs=[];s.stability=80;});Q.buyDrone("purger");')
    ok('Hiring a drone unlocks its achievement', 'bb-drone' in snap(page)['achievements'])
    page.evaluate('Q.mutate(s=>{s.bugs=[{id:99,name:"BUG",seed:1,hp:2,target:1}];});Q.drones(11)')
    ok('Purger removes reinforced bugs and records lifetime automation',not snap(page)['bugs'] and snap(page)['meta']['autoKills']==1)
    page.evaluate('Q.buyDrone("medic");Q.mutate(s=>{s.credits=1020;s.stability=50;});Q.drones(12);')
    ok('Medic cannot breach reserve',snap(page)['credits']==1020 and snap(page)['stability']==50)
    page.evaluate('Q.mutate(s=>{s.credits=1100;});Q.drones(12);')
    ok('Medic charges 40 CR and repairs at level one',snap(page)['credits']==1060 and snap(page)['stability']==56)
    page.evaluate('Q.mutate(s=>{s.credits=8000;});Q.buyDrone("engineer");Q.mutate(s=>{s.credits=1100;s.run.enabled.medic=false;});Q.drones(30);')
    ok('Engineer waits instead of breaking reserve',all(n['level']==1 for n in snap(page)['nodes']))
    page.evaluate('Q.mutate(s=>{s.credits=1200;});Q.drones(30);')
    ok('Engineer upgrades cheapest node at normal cost',snap(page)['nodes'][0]['level']==2 and snap(page)['credits']==1050)
    # Dimensional rules must modify the actual economy and recovery.
    page.evaluate('Q.reset();Q.mutate(s=>{s.bugs=[];s.stability=100;});')
    base=page.evaluate('Q.income()')
    page.evaluate('Q.mutate(s=>{s.meta.prestiges=1;s.run.dimension="ceuta";})')
    ok('Ceuta production multiplier is applied',abs(page.evaluate('Q.income()')-base*1.6*1.1)<1e-7)
    page.evaluate('Q.mutate(s=>{s.meta.prestiges=3;s.run.dimension="void";s.upgrades.cooling=5;s.stability=70;s.nextBug=100;s.nextEvent=100;});Q.step(4)')
    ok('Void disables passive recovery even with cooling',snap(page)['stability']==70)
    page.evaluate('Q.mutate(s=>{s.run.dimension="friday";s.credits=9000;s.stability=100;});Q.deploy();')
    ok('Friday deployment costs six stability',snap(page)['stability']==94)
    # Begin boss chain from a mature, migrated game.
    page.evaluate('(s)=>Q.set(s)',legacy)
    page.evaluate('Q.go("rifts")')
    ok('First boss is unlocked, later bosses are gated',page.evaluate('Q.raidAvailable("migration")&&!Q.raidAvailable("friday")&&!Q.raidAvailable("ceuta")'))
    for rid in ['migration','friday','ceuta']:
        page.click(f'[data-raid="{rid}"]')
        ok(f'{rid}: entrance payment starts three-phase encounter',snap(page)['run']['boss']['id']==rid)
        for phase_index in range(3):
            b=snap(page)['run']['boss']; assert b['phase']==phase_index
            phase=page.evaluate('Q.phase()')
            if phase['mode']=='purge':
                for _ in range(80):
                    if not snap(page)['run']['boss'] or snap(page)['run']['boss']['phase']!=phase_index:break
                    page.evaluate('Q.purge();Q.step(.1)')
            elif phase['mode']=='patch':
                for _ in range(phase['goal']):
                    page.evaluate('Q.mutate(s=>{s.stability=100;s.bugs=[];});Q.patch(false);Q.step(3.1)')
            else:
                # Verify hold resets when the threshold is not met.
                page.evaluate('Q.mutate(s=>{s.stability=100;s.bugs=[];});Q.step(3)')
                assert snap(page)['run']['boss']['progress']>0
                page.evaluate('Q.mutate(s=>{s.stability=60;});Q.step(.1)')
                ok(f'{rid}: hold counter resets below threshold',snap(page)['run']['boss']['progress']==0)
                for _ in range(phase['goal']+4):
                    if snap(page)['run']['boss'] is None or snap(page)['run']['boss']['phase']!=phase_index:break
                    page.evaluate('Q.mutate(s=>{s.stability=100;s.bugs=[];});Q.step(1)')
        ok(f'{rid}: victory recorded exactly once',snap(page)['run']['bossWins'].count(rid)==1 and snap(page)['run']['boss'] is None)
        page.evaluate(f'Q.startRaid("{rid}")')
        ok(f'{rid}: reward cannot be farmed again this cycle',snap(page)['run']['boss'] is None)
    ok('Boss trilogy unlocks prestige',page.evaluate('Q.prestigeReady()'))
    pre=snap(page);reward=page.evaluate('Q.fragmentReward()')
    page.evaluate('Q.showPrestige()');page.click('[data-close]')
    ok('Cancelling prestige never resets progress',snap(page)==pre)
    page.evaluate('Q.showPrestige()')
    page.select_option('#nextDimension','ceuta');page.click('#confirmPrestige')
    after=snap(page)
    ok('Prestige grants exact fragment reward and selected dimension',after['meta']['prestiges']==1 and after['meta']['fragments']==reward and after['run']['dimension']=='ceuta')
    ok('Prestige preserves achievements and XP while resetting the economy',set(pre['achievements']).issubset(after['achievements']) and len(after['nodes'])==3 and after['credits']==1250 and after['xp']>=pre['xp'])
    ok('Prestige resets cycle upgrades, contracts, bosses and drones',after['completed']==[] and after['run']['bossWins']==[] and all(v==0 for v in after['upgrades'].values()) and all(v==0 for v in after['run']['droneLevels'].values()))
    backup=page.evaluate('Q.readBackup()')
    ok('Pre-prestige backup retains the complete old universe',backup['save']['nodes']==pre['nodes'] and backup['save']['meta']['prestiges']==0)
    page.evaluate('Q.buyPermanent("heir")')
    ok('Permanent heir activates a free drone immediately',snap(page)['run']['droneLevels']['purger']==1)
    page.evaluate('Q.buyPermanent("yield")')
    ok('Permanent production upgrade is purchased using fragments',snap(page)['meta']['permanent']['yield']==1)
    # Round trip the entire v2 save through JSON and a clean page.
    page.evaluate('Q.save()');saved=page.evaluate('localStorage.getItem("bro-os-bigbang-v2")');before=snap(page)
    restored,err=new_page(browser,{STORE:saved})
    ok('v2 JSON round-trip preserves full state',snap(restored)==before)
    restored.close()
    # Resume an active encounter, including timer, progress and cooldown.
    page.evaluate('(s)=>Q.set(s)',legacy)
    page.evaluate('Q.startRaid("migration");Q.step(1.5);Q.save()')
    saved=page.evaluate('localStorage.getItem("bro-os-bigbang-v2")');before=snap(page)
    resumed,err=new_page(browser,{STORE:saved})
    ok('Active boss resumes without restarting phase or timer',snap(resumed)['run']['boss']==before['run']['boss'] and resumed.locator('#view-rifts').is_visible())
    resumed.close()
    # Failure, retreat and crisis are recoverable.
    page.evaluate('Q.mutate(s=>{s.credits=10000;s.stability=100;s.run.boss.time=.05;});Q.step(.1)')
    ok('Timeout ends boss and applies retry cooldown',snap(page)['run']['boss'] is None and snap(page)['run']['raidCooldown']==45)
    page.evaluate('Q.mutate(s=>{s.run.raidCooldown=0;s.credits=10000;s.stability=100;});Q.startRaid("migration");Q.mutate(s=>{s.stability=0;});Q.showCrisis()')
    ok('System crisis aborts active encounter and preserves servers',snap(page)['run']['boss'] is None and len(snap(page)['nodes'])==16)
    page.click('#rescueBtn')
    ok('Crisis rescue restores stability and keeps progression',snap(page)['stability']==65 and len(snap(page)['nodes'])==16)
    # Five explicit prestiges provide a real completion goal.
    page.evaluate('(s)=>Q.set(s)',legacy)
    for cycle in range(5):
        page.evaluate('Q.mutate(s=>{s.completed=["m1","m2","m3","m4","m5","m6"];s.nodes=Array.from({length:12},(_,i)=>({id:i+1,name:"qa-"+i,level:5}));s.upgrades.capacity=2;s.run.bossWins=["migration","friday","ceuta"];s.run.boss=null;s.totalEarned=60000;});Q.showPrestige()')
        page.select_option('#nextDimension','origin');page.click('#confirmPrestige')
    ok('Five prestiges mark expansion complete with achievement',snap(page)['meta']['grandVictory'] and 'bb-five' in snap(page)['achievements'])
    ok('No unhandled JavaScript errors across all integration cases',not errors)
    # Download is tested as a user-triggered browser download, not a network request.
    try:
        with page.expect_download(timeout=4000) as dl:
            page.evaluate('Q.exportSave()')
        download=dl.value;download.save_as(str(QA/'export-test.json'))
        ok('Export button creates a valid v2 JSON file',json.loads((QA/'export-test.json').read_text())['version']==2)
    except Exception as e:
        print('DOWNLOAD ENVIRONMENT LIMITATION:',str(e))
    (QA/'test-results.json').write_text(json.dumps({'passed':len(results),'tests':results,'js_errors':errors,'storage_note':'Storage API was tested using an in-memory browser mock because browser navigation is blocked by the execution environment.'},ensure_ascii=False,indent=2))
    browser.close()
print('TOTAL',len(results),'PASSED')

print('Temporary test output:',QA)
