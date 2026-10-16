
'use strict';
(() => {
const $ = id => document.getElementById(id);
const ICON = (name,cls='') => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const num = (n,d=0) => new Intl.NumberFormat('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:true}).format(n);
const pad = n => String(Math.floor(n)).padStart(2,'0');
const clock = secs => `${pad(Math.floor(secs/60))}:${pad(secs%60)}`;
const STORE = 'bro-os-bigbang-v2';
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAX_BUGS = 12;
const NODE_NAMES = ['producción','rr.forms','dockerópolis','api.madre','caché eterna','localhost 2','sudo.verso','nube privada','bug free*','cronolandia','git.narnia','último deploy','ceuta 2.0','sin staging','viernes 17:59','bro.infinity'];
const BUG_NAMES = ['404','CORS','NULL','500','NaN','OOM','RACE','422','TIMEOUT','¿?','CSS','N+1'];
const LOG_JOKES = ['El contenedor tiene sentimientos. No tiene logs.','No era la caché. Era la otra caché.','La documentación dice: «pendiente de documentar».','Se ha detectado un viernes en producción.','El bug ha solicitado teletrabajo permanente.','Localhost asegura que todo funciona.','Un cron ha elegido su propio horario.','El sistema recomienda cerrar 47 pestañas.'];
const EVENT_DEFS = [
 {id:'machine',label:'INCIDENTE EXISTENCIAL',title:'«En mi máquina funciona».',text:'Un contenedor ha desarrollado conciencia y se niega a funcionar fuera de localhost.',a:'Darle una terapia',ac:-90,as:8,ab:-1,b:'Subir mi máquina',bc:150,bs:-8,bb:2,logA:'Docker ha aceptado sus emociones. Y el puerto 8080.',logB:'Tu portátil ahora es infraestructura crítica.'},
 {id:'friday',label:'DEPLOY DE ALTO RIESGO',title:'Viernes. 17:59.',text:'Alguien acaba de decir «es cambiar una línea». El botón de deploy te mira con cariño.',a:'Esperar al lunes',ac:-70,as:10,ab:-1,b:'Qué puede pasar',bc:220,bs:-12,bb:3,logA:'El lunes te ha enviado una carta de agradecimiento.',logB:'La línea tenía 47 dependencias emocionales.'},
 {id:'ceuta',label:'ANOMALÍA GEOGRÁFICA',title:'Todo es Ceuta.',text:'El selector de provincias ha decidido que todo el multiverso pertenece a Ceuta. Otra vez.',a:'Revisar el bucle',ac:-100,as:12,ab:-2,b:'Aceptar la realidad',bc:180,bs:-8,bb:2,logA:'Ceuta vuelve a tener el tamaño de una provincia.',logB:'Ceuta ha sido nombrada capital del multiverso.'},
 {id:'cache',label:'PARADOJA DE CACHÉ',title:'La caché tiene caché.',text:'Has vaciado la caché. La caché ha restaurado su propia copia de seguridad. Te está mirando.',a:'Purgar hasta el alma',ac:-85,as:9,ab:-2,b:'Crear otra capa',bc:170,bs:-7,bb:2,logA:'Caché purgada. Ahora solo quedan tus dudas.',logB:'Nueva arquitectura: caché sobre caché sobre fe.'},
 {id:'uuid',label:'CRISIS DE IDENTIDAD',title:'Dos fichas. Un UUID.',text:'Un formulario se ha enviado dos veces y ambos registros insisten en ser el original.',a:'Idempotencia, bro',ac:-95,as:11,ab:-2,b:'Gemelos cósmicos',bc:190,bs:-9,bb:2,logA:'Idempotencia activa. Uno por UUID, como las personas.',logB:'Los duplicados ya tienen su propio grupo de WhatsApp.'},
 {id:'ai',label:'AUTONOMÍA EXCESIVA',title:'La IA es ahora tu jefa.',text:'Tu asistente ha terminado el refactor y se ha asignado el cargo de directora de infraestructura.',a:'Revocar permisos',ac:-110,as:10,ab:-1,b:'Pedirle vacaciones',bc:240,bs:-12,bb:3,logA:'Permisos revocados. La IA lo ha anotado en su diario.',logB:'Vacaciones denegadas. Te toca documentar.'},
 {id:'css',label:'EMERGENCIA VISUAL',title:'Un div sin centrar.',text:'El comité intergaláctico exige centrar un div. Hay 11 desarrolladores y 14 opiniones.',a:'Usar display: grid',ac:-65,as:7,ab:-1,b:'Abrir una reunión',bc:130,bs:-6,bb:2,logA:'place-items: center. El comité ya no es necesario.',logB:'La reunión ha generado tres reuniones dependientes.'},
 {id:'disk',label:'ESPACIO INSUFICIENTE',title:'El disco guarda rencor.',text:'Hay 800 GB de «backup_final_definitivo_v2». Nadie sabe cuál es el bueno.',a:'Limpiar con cuidado',ac:-120,as:14,ab:-2,b:'Comprar otro disco',bc:200,bs:-10,bb:2,logA:'Copias verificadas. El disco vuelve a respirar.',logB:'Otro disco. Otro backup_final_definitivo_v3.'}
];
const UPGRADES = [
 {id:'cooling',name:'Refrigeración emocional',icon:'snow',desc:'Ventila los servidores y las malas decisiones. Recuperación continua de estabilidad, incluso con bugs.',effect:l=>`+${num(l*.08,2)} estabilidad / s`,base:350,max:5},
 {id:'firewall',name:'Firewall anti-tonterías',icon:'shield',desc:'Menos daño por cada bug y más tiempo entre intrusiones. No protege de tu propio botón de caos.',effect:l=>`−${l*12}% de daño por bugs`,base:450,max:5},
 {id:'workers',name:'Becarios cuánticos',icon:'cpu',desc:'Están trabajando y tomando café al mismo tiempo. Multiplican los ingresos de todos tus universos.',effect:l=>`+${l*20}% de producción`,base:400,max:5},
 {id:'capacity',name:'Expansión sin permiso',icon:'expand',desc:'Amplía el mapa con espacio para dos universos adicionales por nivel. Arquitectura de «ya veremos».',effect:l=>`${8+l*2} universos de capacidad`,base:550,max:4}
];
const ACHIEVEMENTS = [
 {id:'first',icon:'🚀',name:'Hola, producción',desc:'Despliega tu primer universo.',test:s=>s.totalDeploys>=1},
 {id:'bugs',icon:'🪲',name:'No era una feature',desc:'Elimina 10 bugs del multiverso.',test:s=>s.totalDefeated>=10},
 {id:'coffee',icon:'☕',name:'Sangre tipo espresso',desc:'Usa el café de emergencia 3 veces.',test:s=>s.coffees>=3},
 {id:'chaos',icon:'🌪️',name:'Yo he venido a jugar',desc:'Invoca el caos 3 veces. A propósito.',test:s=>s.chaosCount>=3},
 {id:'empire',icon:'🪐',name:'Infraestructura emocional',desc:'Mantén 8 universos desplegados.',test:s=>s.nodes.length>=8},
 {id:'stable',icon:'🧘',name:'Esto no es normal',desc:'Acumula 45 s con estabilidad ≥90%.',test:s=>s.highStableSeconds>=45},
 {id:'rich',icon:'💎',name:'Unicornio de localhost',desc:'Genera 10.000 créditos en total.',test:s=>s.totalEarned>=10000},
 {id:'senior',icon:'🧙',name:'Senior por accidente',desc:'Compra 6 mejoras de cualquier tipo.',test:s=>s.totalUpgrades>=6},
 {id:'secret',icon:'🦆',name:'Rubber duck celestial',desc:'Descubre el comando de la sabiduría.',test:s=>s.secrets.includes('duck')}
];
const MISSIONS = [
 {id:'m1',title:'Hola, multiverso.',desc:'Despliega un nuevo universo. El primero siempre parece buena idea.',target:1,value:s=>s.totalDeploys,unit:'universos',reward:250,xp:80},
 {id:'m2',title:'No era la caché.',desc:'Elimina 5 bugs. Pulsa sobre ellos en el mapa o usa un hotfix.',target:5,value:s=>s.totalDefeated,unit:'bugs purgados',reward:380,xp:120},
 {id:'m3',title:'Aquí sí escalamos.',desc:'Consigue 5 universos activos. Más servidores, más decisiones cuestionables.',target:5,value:s=>s.nodes.length,unit:'universos activos',reward:550,xp:160},
 {id:'m4',title:'Senior por accidente.',desc:'Compra 3 mejoras: en el laboratorio o directamente en tus nodos.',target:3,value:s=>s.totalUpgrades,unit:'mejoras',reward:700,xp:200},
 {id:'m5',title:'Ahora sí, estable.',desc:'Acumula 45 segundos con estabilidad del 90% o superior. No hace falta que sean seguidos.',target:45,value:s=>s.highStableSeconds,unit:'segundos',reward:650,xp:170},
 {id:'m6',title:'El dios de producción.',desc:'Genera 10.000 créditos. No tienes que ahorrarlos: aquí gastar está bien visto.',target:10000,value:s=>s.totalEarned,unit:'CR generados',reward:1500,xp:400}
];
function legacyFreshState(){return {version:1,credits:1250,stability:92,nodes:[{id:1,name:NODE_NAMES[0],level:1},{id:2,name:NODE_NAMES[1],level:1},{id:3,name:NODE_NAMES[2],level:1}],nextNodeId:4,bugs:[{id:1,name:'404',seed:1.5,hp:1,target:1},{id:2,name:'CORS',seed:3.7,hp:1,target:2}],nextBugId:3,upgrades:{cooling:0,firewall:0,workers:0,capacity:0},cooldowns:{coffee:0,fix:0,rollback:0,chaos:0},boost:0,freezeIncome:0,uptime:0,totalEarned:0,totalDefeated:0,totalDeploys:0,totalUpgrades:0,coffees:0,chaosCount:0,highStableSeconds:0,xp:0,completed:[],achievements:[],secrets:[],events:[{id:'machine',serial:1}],eventSerial:2,nextBug:25,nextEvent:65,logs:[],paused:false,settings:{sound:false,orbit:!REDUCED,motion:!REDUCED},onboarded:false};}
function validateLegacySave(raw){
 if(!raw || typeof raw!=='object' || Array.isArray(raw) || raw.version!==1) throw new Error('Formato de partida no compatible.');
 if(!Array.isArray(raw.nodes)||raw.nodes.length<1||raw.nodes.length>16||!raw.nodes.every(n=>n&&Number.isInteger(n.id)&&n.id>=1&&n.id<=100000&&typeof n.name==='string'&&Number.isInteger(n.level)&&n.level>=1&&n.level<=5))throw new Error('Los universos de la partida no son válidos.');
 if(new Set(raw.nodes.map(n=>n.id)).size!==raw.nodes.length)throw new Error('La partida contiene universos duplicados.');
 const s=legacyFreshState();
 const read=(key,low,high)=>{const v=raw[key]; if(typeof v!=='number'||!Number.isFinite(v)||v<low||v>high)throw new Error(`Valor no válido: ${key}.`); return v;};
 for(const k of ['credits','totalEarned'])s[k]=read(k,0,1e12);
 s.stability=read('stability',0,100);
 for(const k of ['uptime','totalDefeated','totalDeploys','totalUpgrades','coffees','chaosCount','highStableSeconds','xp']) s[k]=read(k,0,1e12);
 s.nodes=raw.nodes.map(n=>({id:n.id,name:n.name.slice(0,32),level:n.level}));s.nextNodeId=Math.max(...s.nodes.map(n=>n.id))+1;
 for(const u of UPGRADES){const v=raw.upgrades&&raw.upgrades[u.id];if(!Number.isInteger(v)||v<0||v>u.max)throw new Error('Mejora no válida.');s.upgrades[u.id]=v;}
 if(s.nodes.length>8+s.upgrades.capacity*2)throw new Error('Capacidad de universos no válida.');
 if(!Array.isArray(raw.bugs)||raw.bugs.length>MAX_BUGS)throw new Error('Lista de bugs no válida.');
 s.bugs=raw.bugs.map((b,i)=>({id:i+1,name:typeof b?.name==='string'?b.name.slice(0,12):'BUG',seed:Number.isFinite(b?.seed)?clamp(b.seed,0,100):Math.random()*6,hp:b?.hp===2?2:1,target:s.nodes.some(n=>n.id===b?.target)?b.target:s.nodes[0].id}));s.nextBugId=s.bugs.length+1;
 for(const k of Object.keys(s.cooldowns))s.cooldowns[k]=clamp(Number(raw.cooldowns?.[k])||0,0,120);
 s.boost=clamp(Number(raw.boost)||0,0,20);s.freezeIncome=clamp(Number(raw.freezeIncome)||0,0,8);
 for(const [key,allowed] of [['completed',MISSIONS.map(x=>x.id)],['achievements',ACHIEVEMENTS.map(x=>x.id)],['secrets',['duck','sudo','bro']]]) s[key]=Array.isArray(raw[key])?[...new Set(raw[key].filter(x=>allowed.includes(x)))]:[];
 s.events=Array.isArray(raw.events)?raw.events.slice(0,2).filter(e=>e&&EVENT_DEFS.some(d=>d.id===e.id)).map((e,i)=>({id:e.id,serial:i+1})):[];s.eventSerial=s.events.length+1;
 s.nextBug=clamp(Number(raw.nextBug)||25,1,120);s.nextEvent=clamp(Number(raw.nextEvent)||65,1,150);
 s.logs=Array.isArray(raw.logs)?raw.logs.slice(-70).filter(x=>x&&typeof x.message==='string').map(x=>({message:x.message.slice(0,400),type:['info','success','warn','error'].includes(x.type)?x.type:'info',time:Number.isFinite(x.time)?clamp(x.time,0,1e12):0})):[];
 s.settings={sound:raw.settings?.sound===true,orbit:raw.settings?.orbit!==false,motion:raw.settings?.motion!==false};s.paused=raw.paused===true;s.onboarded=raw.onboarded===true;
 return s;
}
// BIG BANG 2.0 - all simulation time advances only while the game is visible.
// No network, remote services, analytics, or real shell commands.
const DIMENSIONS = [
 {id:'origin',name:'Localhost original',tag:'EL LUGAR DONDE TODO FUNCIONA',need:0,income:1,damage:1,spawn:1,deploy:1,penalty:2,recovery:1,bonus:0,icon:'core',desc:'Las reglas que conoces. El sitio ideal para preparar tu primer salto.',rules:['Producci\u00f3n \u00d71','Despliegue: \u22122 estabilidad','Recuperaci\u00f3n normal']},
 {id:'ceuta',name:'Rep\u00fablica de Ceuta',tag:'UNA PROVINCIA. INFINITAS COPIAS.',need:1,income:1.6,damage:1.1,spawn:.75,deploy:.85,penalty:2,recovery:1,bonus:2,icon:'orbit',desc:'La geograf\u00eda ha perdido. Las intrusiones naturales tienen un 45% de probabilidad de traer un gemelo.',rules:['Producci\u00f3n \u00d71,6','Intrusiones m\u00e1s frecuentes; 45% de duplicaci\u00f3n','+2 fragmentos al completar el ciclo']},
 {id:'friday',name:'Viernes eterno',tag:'SON LAS 17:59. PARA SIEMPRE.',need:2,income:2.2,damage:1.3,spawn:.65,deploy:.65,penalty:6,recovery:1,bonus:4,icon:'clock',desc:'Desplegar cuesta menos dinero y m\u00e1s salud mental. Cada servidor nuevo resta 6 puntos de estabilidad.',rules:['Producci\u00f3n \u00d72,2; despliegues \u221235%','Da\u00f1o de bugs +30%; m\u00e1s intrusiones','+4 fragmentos al completar el ciclo']},
 {id:'void',name:'El vac\u00edo de staging',tag:'NO HAY RED. SOLO T\u00da.',need:3,income:2.8,damage:1.45,spawn:.8,deploy:1,penalty:3,recovery:0,bonus:6,icon:'shield',desc:'No hay recuperaci\u00f3n pasiva, ni siquiera con refrigeraci\u00f3n. Necesitar\u00e1s reparaciones, drones y sangre fr\u00eda.',rules:['Producci\u00f3n \u00d72,8','Sin regeneraci\u00f3n pasiva; bugs +45% de da\u00f1o','+6 fragmentos al completar el ciclo']}
];
const DRONES = [
 {id:'purger',name:'Pato centinela',icon:'bug',base:650,max:5,desc:'Elimina un bug completo por turno. Cobra los 35 CR y tambi\u00e9n cuenta para los objetivos de los jefes.',effect:l=>`Un bug cada ${12-2*l} s. Sin coste por turno.`},
 {id:'medic',name:'SRE de guardia',icon:'heart',base:850,max:5,desc:'Repara autom\u00e1ticamente cuando la estabilidad cae por debajo de tu umbral. Cada reparaci\u00f3n cuesta 40 CR.',effect:l=>`+${3+3*l} estabilidad cada 12 s. Respeta tu reserva.`},
 {id:'engineer',name:'Becario aut\u00f3nomo',icon:'cpu',base:1200,max:5,desc:'Mejora el servidor m\u00e1s barato, hasta nivel 5. Paga el precio normal sin tocar tu reserva de cr\u00e9ditos.',effect:l=>`Una mejora cada ${26-3*l} s. No despliega servidores.`}
];
const PERMANENT = [
 {id:'yield',name:'Memoria del universo',icon:'cpu',base:2,max:8,desc:'Cada nivel a\u00f1ade un 15% de producci\u00f3n a todos los ciclos.'},
 {id:'seed',name:'Capital de otra vida',icon:'credit',base:2,max:6,desc:'Cada nivel a\u00f1ade 500 CR al empezar tu pr\u00f3ximo ciclo. No entrega cr\u00e9ditos retroactivos.'},
 {id:'shield',name:'Firewall ancestral',icon:'shield',base:3,max:5,desc:'Reduce un 6% por nivel el da\u00f1o continuo de los bugs. No bloquea ataques directos de jefes.'},
 {id:'heir',name:'El pato es eterno',icon:'orbit',base:5,max:1,desc:'Activa un Pato centinela de nivel 1 ahora y al empezar cada ciclo. Sus mejoras extra no se heredan.'}
];
const RAIDS = [
 {id:'migration',name:'La migraci\u00f3n sin backup',code:'INCIDENTE 01',icon:'server',nodes:6,entry:400,reward:1600,time:160,pulse:20,bugs:2,hit:3,
 desc:'Alguien ha ejecutado ALTER TABLE directamente en producci\u00f3n. El backup es un recuerdo.',
 phases:[{mode:'purge',name:'Aislar la corrupci\u00f3n',goal:4,desc:'Elimina los bugs corruptos. Cuentan clics, hotfixes, rollback y drones.'},{mode:'hold',name:'Reconstruir el snapshot',goal:12,threshold:80,desc:'Mant\u00e9n la estabilidad indicada durante todo el intervalo. Si baja, la cuenta vuelve a cero.'},{mode:'patch',name:'Migrar con dignidad',goal:3,cost:250,desc:'Aplica parches con estabilidad \u226565% y un m\u00e1ximo de 3 bugs. O toma el atajo peligroso.'}]},
 {id:'friday',name:'El viernes eterno',code:'INCIDENTE 02',icon:'clock',nodes:8,entry:800,reward:3200,time:175,pulse:15,bugs:2,hit:4,
 desc:'El deploy dura un minuto. La guardia, toda una eternidad. El lunes ha dejado de existir.',
 phases:[{mode:'patch',name:'Cerrar la ventana de deploy',goal:4,cost:400,desc:'Cada parche necesita estabilidad \u226565% y no m\u00e1s de 3 bugs.'},{mode:'purge',name:'Matar las dependencias',goal:7,desc:'Elimina los bugs del despliegue. Los drones y los hotfixes tambi\u00e9n cuentan.'},{mode:'hold',name:'Conseguir que llegue el lunes',goal:18,threshold:85,desc:'Sost\u00e9n la estabilidad sin interrupciones. El lunes est\u00e1 al otro lado.'}]},
 {id:'ceuta',name:'CEUTA PRIME',code:'JEFE DE CICLO',icon:'chaos',nodes:12,entry:1600,reward:6000,time:190,pulse:12,bugs:3,hit:5,
 desc:'Ya no es un selector. Es una entidad geogr\u00e1fica consciente. Y te ha marcado como localidad.',
 phases:[{mode:'purge',name:'Desduplicar la realidad',goal:10,desc:'Purga las copias del selector. Todo sistema de eliminaci\u00f3n es v\u00e1lido.'},{mode:'patch',name:'Reescribir el mapa',goal:5,cost:550,desc:'Cinco parches separan Ceuta del resto del universo. Estabilidad \u226565%; no m\u00e1s de 3 bugs.'},{mode:'hold',name:'Restaurar la geograf\u00eda',goal:22,threshold:90,desc:'Sost\u00e9n la estabilidad sin interrupciones y sobrevive a sus \u00faltimos ataques.'}]}
];
const NEW_ACHIEVEMENTS = [
 {id:'bb-first',icon:'\u{1F4A5}',name:'Que se haga localhost',desc:'Completa tu primer Big Bang.',test:s=>s.meta.prestiges>=1},
 {id:'bb-drone',icon:'\u{1F916}',name:'Delegar era esto',desc:'Compra tu primer nivel de dron.',test:s=>s.meta.dronePurchases>=1},
 {id:'bb-auto',icon:'\u{1F986}',name:'No me llames por un bug',desc:'Deja que tus drones eliminen 100 bugs.',test:s=>s.meta.autoKills>=100},
 {id:'bb-boss',icon:'\u{1F6E1}',name:'Hab\u00eda backup emocional',desc:'Derrota a La migraci\u00f3n sin backup.',test:s=>s.meta.bossHistory.includes('migration')},
 {id:'bb-ceuta',icon:'\u{1F30D}',name:'Ceuta tiene fronteras',desc:'Derrota a CEUTA PRIME.',test:s=>s.meta.bossHistory.includes('ceuta')},
 {id:'bb-three',icon:'\u{1F300}',name:'No era mi primer universo',desc:'Completa tres Big Bangs.',test:s=>s.meta.prestiges>=3},
 {id:'bb-explorer',icon:'\u{1FA90}',name:'Fuera de mi localhost',desc:'Completa un Big Bang en una dimensi\u00f3n especial.',test:s=>s.meta.clearedDimensions.some(id=>id!=='origin')},
 {id:'bb-five',icon:'\u{1F451}',name:'Arquitecto del imposible',desc:'Completa cinco Big Bangs.',test:s=>s.meta.prestiges>=5}
];
ACHIEVEMENTS.push(...NEW_ACHIEVEMENTS);
const BACKUP_STORE='bro-os-bigbang-backup-v2';
const LEGACY_STORE='bro-os-save-v1';
const META_DEFAULT=()=>({prestiges:0,fragments:0,fragmentsEarned:0,permanent:{yield:0,seed:0,shield:0,heir:0},bossHistory:[],totalBossWins:0,autoKills:0,dronePurchases:0,clearedDimensions:[],archivedEarned:0,archivedTime:0,grandVictory:false});
const RUN_DEFAULT=()=>({dimension:'origin',bossWins:[],boss:null,droneLevels:{purger:0,medic:0,engineer:0},enabled:{purger:true,medic:true,engineer:true},clocks:{purger:0,medic:0,engineer:0},reserve:1000,medicTarget:85,raidCooldown:0,droneOperations:0});
function freshState(){const s=legacyFreshState();s.version=2;s.meta=META_DEFAULT();s.run=RUN_DEFAULT();return s;}
function validateSave(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||![1,2].includes(raw.version))throw new Error('Formato de partida no compatible. Se admite BRO//OS v1 y BIG BANG v2.');
 const s=validateLegacySave({...raw,version:1});s.version=2;s.meta=META_DEFAULT();s.run=RUN_DEFAULT();
 if(raw.version===1)return s;
 if(!raw.meta||!raw.run||typeof raw.meta!=='object'||typeof raw.run!=='object')throw new Error('Faltan los datos de BIG BANG.');
 const m=raw.meta,r=raw.run;
 const validNumber=(v,min,max,integer=false)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max&&(!integer||Number.isInteger(v));
 const read=(obj,key,min=0,max=1e12,int=false)=>{if(!validNumber(obj[key],min,max,int))throw new Error(`Dato no v\u00e1lido: ${key}.`);return obj[key];};
 const list=(v,allowed)=>{if(!Array.isArray(v)||v.some(x=>!allowed.includes(x))||new Set(v).size!==v.length)throw new Error('Lista de progreso no v\u00e1lida.');return [...v];};
 for(const k of ['prestiges','fragments','fragmentsEarned','totalBossWins','autoKills','dronePurchases'])s.meta[k]=read(m,k,0,1e9,true);
 for(const k of ['archivedEarned','archivedTime'])s.meta[k]=read(m,k);
 if(m.fragments>m.fragmentsEarned)throw new Error('El saldo de fragmentos no es v\u00e1lido.');
 if(!m.permanent||typeof m.permanent!=='object')throw new Error('Faltan las mejoras permanentes.');
 for(const p of PERMANENT)s.meta.permanent[p.id]=read(m.permanent,p.id,0,p.max,true);
 s.meta.bossHistory=list(m.bossHistory,RAIDS.map(x=>x.id));s.meta.clearedDimensions=list(m.clearedDimensions,DIMENSIONS.map(x=>x.id));s.meta.grandVictory=m.grandVictory===true;
 const dim=DIMENSIONS.find(d=>d.id===r.dimension);if(!dim||dim.need>s.meta.prestiges)throw new Error('Dimensi\u00f3n no disponible.');s.run.dimension=dim.id;
 s.run.bossWins=list(r.bossWins,RAIDS.map(x=>x.id));
 if(s.run.bossWins.some((id,i)=>id!==RAIDS[i].id))throw new Error('Orden de jefes no v\u00e1lido.');
 for(const p of DRONES){if(!r.droneLevels||!r.enabled||!r.clocks)throw new Error('Faltan datos de automatizaci\u00f3n.');s.run.droneLevels[p.id]=read(r.droneLevels,p.id,0,p.max,true);if(typeof r.enabled[p.id]!=='boolean')throw new Error('Estado de dron no v\u00e1lido.');s.run.enabled[p.id]=r.enabled[p.id];s.run.clocks[p.id]=read(r.clocks,p.id,0,60);}
 s.run.reserve=read(r,'reserve',0,1e9,true);s.run.medicTarget=read(r,'medicTarget',50,100,true);if(![70,85,95,100].includes(s.run.medicTarget))throw new Error('Umbral de reparacion no valido.');s.run.raidCooldown=read(r,'raidCooldown',0,90);s.run.droneOperations=read(r,'droneOperations',0,1e12,true);
 if(r.boss!==null){
 const b=r.boss,d=RAIDS.find(x=>x.id===b?.id);if(!d||s.run.bossWins.includes(d.id)||RAIDS.indexOf(d)!==s.run.bossWins.length||s.nodes.length<d.nodes)throw new Error('Encuentro no v\u00e1lido.');
 s.run.boss={id:d.id,phase:read(b,'phase',0,2,true),time:read(b,'time',0,d.time),progress:read(b,'progress',0,100000),startKills:read(b,'startKills'),pulse:read(b,'pulse',0,60),actionCd:read(b,'actionCd',0,15),supportCd:read(b,'supportCd',0,15)};
 if(b.startKills>s.totalDefeated)throw new Error('Contador de combate no v\u00e1lido.');
 }
 return s;
}
// This state is kept separate from the original v1 key. v1 is never overwritten.
function loadBigBang(){
 try{const current=localStorage.getItem(STORE),legacy=localStorage.getItem(LEGACY_STORE);if(current){state=validateSave(JSON.parse(current));}else if(legacy){state=validateSave(JSON.parse(legacy));migrationNotice=true;}}
 catch(e){loadError=e instanceof Error?e.message:'No se pudo leer la partida.';try{const bad=localStorage.getItem(STORE);if(bad)localStorage.setItem('bro-os-bigbang-unreadable',bad);}catch{storageOK=false;}}
}
function dimension(){return DIMENSIONS.find(d=>d.id===state.run.dimension)||DIMENSIONS[0];}
function eraPressure(){return 1+Math.min(1.5,state.meta.prestiges*.12);}
function raidScale(){return 1+Math.min(10,state.meta.prestiges)*.25;}
function income(){return legacyIncome()*dimension().income*(1+state.meta.prestiges*.1+state.meta.permanent.yield*.15);}
function deployCost(){return Math.max(1,Math.floor(legacyDeployCost()*dimension().deploy));}
function canAct(){if(modalType)return false;if(state.paused){toast('El multiverso est\u00e1 pausado.','Reanuda la simulaci\u00f3n para actuar.','warn');return false;}if(state.stability<=0)return false;return true;}
function deploy(){if(!canAct())return;const before=state.nodes.length;legacyDeploy();if(state.nodes.length>before){setStability(2-dimension().penalty);updateUI();save();}}
function checkProgress(){legacyCheckProgress();if(state.meta.prestiges>=5&&!state.meta.grandVictory){state.meta.grandVictory=true;toast('ARQUITECTO DEL IMPOSIBLE.','Cinco Big Bangs. Has completado la expansi\u00f3n; el modo libre contin\u00faa.');confetti();log('BIG BANG completado. Cinco ciclos conquistados. El multiverso ya no puede despedirte.','success');}}
function backupCurrent(reason){
 const snapshot={reason,at:new Date().toISOString(),save:state};
 try{localStorage.setItem(BACKUP_STORE,JSON.stringify(snapshot));return true;}catch{toast('No se pudo guardar la copia local.','Exporta tu partida antes de continuar.','warn');return false;}
}
function resetRenderCaches(){eventKey=null;lastLogKey='';lastNodeList='';lastCapacity='';viewDirty=true;expKeys={};particles=[];floatingTexts=[];crisisOpen=false;closeInspector();}
function fragmentReward(){return 3+Math.min(8,Math.floor(state.totalEarned/25000))+state.run.bossWins.length*2+dimension().bonus;}
function prestigeReady(){return state.completed.length===MISSIONS.length&&state.nodes.length>=8&&state.run.bossWins.includes('ceuta')&&!state.run.boss;}
function permanentCost(id){const p=PERMANENT.find(x=>x.id===id);return p.base*(state.meta.permanent[id]+1);}
function buyPermanent(id){
 if(!canAct())return;const p=PERMANENT.find(x=>x.id===id);if(!p||state.meta.permanent[id]>=p.max)return;
 const cost=permanentCost(id);if(state.meta.fragments<cost){toast('Faltan fragmentos.','Completa otro Big Bang para conseguir m\u00e1s.','warn');return;}
 state.meta.fragments-=cost;state.meta.permanent[id]++;
 if(id==='heir'&&state.run.droneLevels.purger<1){state.run.droneLevels.purger=1;state.run.enabled.purger=true;}
 log(`Mejora permanente: ${p.name}. \u2212${cost} fragmentos.`,'success');tone('reward');expKeys={};updateUI();save();
}
function showPrestige(){
 if(!prestigeReady()){switchView('singularity');toast('Todav\u00eda queda un jefe en producci\u00f3n.','Completa los seis contratos, despliega 8 servidores y derrota a CEUTA PRIME.','warn');return;}
 const reward=fragmentReward(),next=state.meta.prestiges+1;
 const options=DIMENSIONS.map(d=>`<option value="${d.id}" ${d.need>next?'disabled':''}>${escapeHTML(d.name)}${d.need>next?` \u00b7 Requiere ${d.need} Big Bangs`:''}</option>`).join('');
 openModal('prestige',`${closeHTML}<div class="eyebrow">FIN DE CICLO ${pad(state.meta.prestiges+1)}</div><h2>Un final.<br><span class="acid">Otro Big Bang.</span></h2><div class="reward-giant">+${reward} <span>fragmentos permanentes</span></div><p><strong>Conservas:</strong> los ${state.achievements.length} logros, experiencia, historial de victorias, fragmentos y mejoras permanentes.</p><p><strong>Se reinician:</strong> cr\u00e9ditos, servidores, laboratorio, contratos, drones y jefes del ciclo. Los secretos vuelven a estar disponibles.</p><p>Empiezas con 3 servidores, ${num(1250+state.meta.permanent.seed*500)} CR y un 92% de estabilidad. Cada Big Bang a\u00f1ade +10% de producci\u00f3n base, pero los bugs hacen m\u00e1s da\u00f1o.</p><label class="field-label" for="nextDimension">DIMENSI\u00d3N DEL PR\u00d3XIMO CICLO</label><select id="nextDimension" class="bb-select">${options}</select><p id="nextDimRules" class="small-note"></p><div class="backup-note">Se guardar\u00e1 una copia local del ciclo anterior. Exportar un JSON es la copia m\u00e1s segura.</div><div class="modal-footer"><button class="btn" id="backupBeforePrestige">${ICON('download')} Exportar primero</button><button class="btn primary" id="confirmPrestige">Confirmar Big Bang ${ICON('chaos')}</button></div>`);
 const sel=$('nextDimension');sel.value=DIMENSIONS.filter(d=>d.need<=next).at(-1).id;
 const rule=()=>{$('nextDimRules').textContent=DIMENSIONS.find(d=>d.id===sel.value).rules.join(' \u00b7 ');};sel.addEventListener('change',rule);rule();
 $('backupBeforePrestige').addEventListener('click',exportSave);
 $('confirmPrestige').addEventListener('click',()=>performPrestige(sel.value));
}
function performPrestige(dimId){
 if(modalType!=='prestige'||!prestigeReady())return;
 const d=DIMENSIONS.find(x=>x.id===dimId);if(!d||d.need>state.meta.prestiges+1)return;
 const backedUp=backupCurrent('Antes del Big Bang');
 if(!backedUp&&!$('allowNoBackup')?.checked){
 if(!$('allowNoBackup')){
 const label=document.createElement('label');label.className='backup-note';label.style.display='block';
 label.innerHTML='<input id="allowNoBackup" type="checkbox" style="margin-right:8px">He exportado mi partida y acepto continuar sin copia local.';
 $('confirmPrestige').closest('.modal-footer').before(label);
 }
 toast('Falta una copia segura.','Exporta el JSON, marca la casilla y vuelve a confirmar el Big Bang.','warn');return;
 }
 finishPrestige(dimId);
}
function finishPrestige(dimId){
 // Called only from the confirmed modal. No automatic prestige or reset.
 if(modalType!=='prestige'||!prestigeReady())return;
 const chosen=DIMENSIONS.find(d=>d.id===dimId);if(!chosen||chosen.need>state.meta.prestiges+1)return;
 const old=state,reward=fragmentReward(),next=legacyFreshState();
 const meta=structuredClone(old.meta);meta.prestiges++;meta.fragments+=reward;meta.fragmentsEarned+=reward;meta.archivedEarned+=old.totalEarned;meta.archivedTime+=old.uptime;
 if(!meta.clearedDimensions.includes(old.run.dimension))meta.clearedDimensions.push(old.run.dimension);
 next.version=2;next.meta=meta;next.run=RUN_DEFAULT();next.run.dimension=dimId;next.credits+=meta.permanent.seed*500;next.achievements=[...old.achievements];next.xp=old.xp;next.settings={...old.settings};next.onboarded=true;
 if(meta.permanent.heir){next.run.droneLevels.purger=1;next.run.enabled.purger=true;}
 state=next;resetRenderCaches();forceCloseModal();switchView('command');log(`BIG BANG ${meta.prestiges}. +${reward} fragmentos. Destino: ${dimension().name}.`,'success');log('Tus logros y mejoras permanentes han sobrevivido. La dignidad estaba fuera del backup.','info');checkProgress();confetti();tone('reward');updateSoundUI();updateUI();save();toast('Bienvenido a tu siguiente mala idea.',`${dimension().name}. ${meta.fragments} fragmentos disponibles en Big Bang.`);
}
function droneCost(id){const d=DRONES.find(x=>x.id===id);return Math.floor(d.base*Math.pow(1.8,state.run.droneLevels[id]));}
function droneInterval(id){const l=state.run.droneLevels[id];return id==='purger'?12-l*2:id==='medic'?12:26-l*3;}
function buyDrone(id){
 if(!canAct())return;const d=DRONES.find(x=>x.id===id);if(!d||state.run.droneLevels[id]>=d.max)return;if(!spend(droneCost(id)))return;
 state.run.droneLevels[id]++;state.run.enabled[id]=true;state.meta.dronePurchases++;state.xp+=35;state.run.clocks[id]=0;
 log(`${d.name} contratado. Nivel ${state.run.droneLevels[id]}.`,'success');toast('Delega el incendio.',d.effect(state.run.droneLevels[id]));tone('deploy');expKeys={};checkProgress();updateUI();save();
}
function droneTick(dt){
 for(const d of DRONES){const id=d.id,l=state.run.droneLevels[id];if(!l||!state.run.enabled[id])continue;const interval=droneInterval(id);state.run.clocks[id]=Math.min(interval,state.run.clocks[id]+dt);if(state.run.clocks[id]<interval)continue;
 if(id==='purger'){
 if(!state.bugs.length)continue;killBug(state.bugs[0].id,true,true);state.meta.autoKills++;state.run.droneOperations++;state.run.clocks[id]=0;
 }else if(id==='medic'){
 if(state.stability>=state.run.medicTarget||state.credits-40<state.run.reserve)continue;
 state.credits-=40;setStability(3+3*l);state.run.clocks[id]=0;state.run.droneOperations++;
 }else{
 const n=state.nodes.filter(n=>n.level<5).sort((a,b)=>a.level-b.level||a.id-b.id)[0];if(!n)continue;const cost=nodeCost(n);if(state.credits-cost<state.run.reserve)continue;
 state.credits-=cost;n.level++;state.totalUpgrades++;state.xp+=35;state.run.clocks[id]=0;state.run.droneOperations++;viewDirty=true;
 log(`Becario aut\u00f3nomo: ${n.name} al nivel ${n.level}. \u2212${cost} CR.`,'success');
 }
 }
}
function raidDefinition(){return state.run.boss?RAIDS.find(x=>x.id===state.run.boss.id):null;}
function raidPhase(){const d=raidDefinition();return d?d.phases[state.run.boss.phase]:null;}
function phaseGoal(){const p=raidPhase();if(!p)return 0;return p.mode==='purge'?p.goal+Math.min(10,state.meta.prestiges):p.goal;}
function raidAvailable(id){const d=RAIDS.find(x=>x.id===id),i=RAIDS.indexOf(d);return !!d&&!state.run.boss&&!state.run.bossWins.includes(id)&&i===state.run.bossWins.length&&state.nodes.length>=d.nodes&&state.run.raidCooldown<=0;}
function raidEntry(d){return Math.ceil(d.entry*raidScale());}
function startRaid(id){
 if(!canAct())return;const d=RAIDS.find(x=>x.id===id);if(!d||!raidAvailable(id)){toast('El encuentro no est\u00e1 disponible.','Comprueba los requisitos de servidores y el jefe anterior.','warn');return;}
 if(!spend(raidEntry(d)))return;
 state.run.boss={id,phase:0,time:d.time,progress:0,startKills:state.totalDefeated,pulse:d.pulse,actionCd:0,supportCd:0};
 enterRaidPhase();log(`ENCUENTRO: ${d.name}. El equipo de soporte eres t\u00fa.`,'error');tone('chaos');switchView('rifts');expKeys={};updateUI();save();
}
function enterRaidPhase(){
 const b=state.run.boss,p=raidPhase();if(!b||!p)return;b.progress=0;b.startKills=state.totalDefeated;b.actionCd=0;
 if(p.mode==='purge')spawnBug(Math.max(0,Math.min(MAX_BUGS,phaseGoal())-state.bugs.length));
 if(p.mode==='hold')setStability(5);
 expKeys.rifts='';viewDirty=true;log(`Fase ${b.phase+1}/3: ${p.name}.`,'warn');
}
function raidPatch(risky=false){
 if(!canAct())return;const b=state.run.boss,p=raidPhase();if(!b||p.mode!=='patch'||b.actionCd>0)return;
 if(!risky){if(state.stability<65||state.bugs.length>3){toast('No es seguro aplicar el parche.','Necesitas estabilidad \u226565% y como m\u00e1ximo 3 bugs.','warn');return;}if(!spend(Math.ceil(p.cost*raidScale())))return;b.progress++;b.actionCd=3;log('Parche aplicado con pruebas. La realidad se recompone.','success');}
 else{b.progress+=2;b.actionCd=8;spawnBug(3);setStability(-12);log('Parche sin tests: +2 progreso, +3 bugs, \u221212 estabilidad.','error');tone('chaos');}
 if(state.stability<=0){showCrisis();return;}advanceRaidIfReady();updateUI();save();
}
function raidSupport(){
 if(!canAct())return;const b=state.run.boss;if(!b||b.supportCd>0)return;const cost=Math.ceil(200*raidScale());if(!spend(cost))return;
 state.bugs.slice(0,2).forEach(x=>killBug(x.id,false,true));setStability(8);b.supportCd=6;log('Fuga sellada. Hasta 2 bugs eliminados; +8 estabilidad.','success');tone('deploy');advanceRaidIfReady();updateUI();save();
}
function raidProgress(){const b=state.run.boss,p=raidPhase();return !b?0:p.mode==='purge'?Math.max(0,state.totalDefeated-b.startKills):b.progress;}
function advanceRaidIfReady(){
 if(!state.run.boss)return;if(raidProgress()+.0001<phaseGoal())return;
 state.run.boss.phase++;if(state.run.boss.phase>=3){winRaid();return;}enterRaidPhase();tone('reward');
}
function winRaid(){
 const d=raidDefinition();if(!d)return;const reward=Math.ceil(d.reward*raidScale());
 state.run.bossWins.push(d.id);state.meta.totalBossWins++;if(!state.meta.bossHistory.includes(d.id))state.meta.bossHistory.push(d.id);
 state.run.boss=null;earn(reward);state.xp+=250;setStability(15);state.bugs=[];
 log(`JEFE DERROTADO: ${d.name}. +${num(reward)} CR. +250 XP.`,'success');toast(`${d.name}: fuera de producci\u00f3n.`,d.id==='ceuta'?'El Big Bang est\u00e1 a un salto. Revisa los requisitos en Singularidad.':`+${num(reward)} CR. El pr\u00f3ximo encuentro est\u00e1 disponible si cumples sus requisitos.`);tone('reward');confetti();expKeys={};checkProgress();updateUI();save();
}
function failRaid(reason,retreat=false){
 const d=raidDefinition();if(!d)return;state.run.boss=null;state.run.raidCooldown=retreat?20:45;
 if(!retreat){state.credits-=Math.floor(state.credits*.1);setStability(-12);}
 log(`${d.name}: ${reason}.${retreat?'':' \u221210% de cr\u00e9ditos y \u221212 estabilidad.'}`,'error');toast('No era el plan.',`${reason}. Conservas servidores y mejoras. Puedes reintentar despu\u00e9s de ${retreat?20:45} s.`,'warn');expKeys={};updateUI();save();
}
function confirmRetreat(){
 if(!state.run.boss)return;openModal('retreat',`${closeHTML}<div class="eyebrow">RETIRADA T\u00c1CTICA</div><h2>\u00bfY si lo intentamos<br>con un backup?</h2><p>Se cancela el encuentro actual. No se devuelve la entrada, pero no pierdes servidores, mejoras ni cr\u00e9ditos adicionales. Podr\u00e1s reintentar en 20 segundos de juego.</p><div class="modal-footer"><button class="btn danger" id="confirmRetreat">Retirarme</button><button class="btn" data-return>Seguir luchando</button></div>`);
 $('confirmRetreat').addEventListener('click',()=>{forceCloseModal();failRaid('Retirada voluntaria',true);});$('modal').querySelector('[data-return]').addEventListener('click',closeModal);
}
function raidTick(dt){
 const b=state.run.boss,d=raidDefinition();if(!b)return;
 b.time=Math.max(0,b.time-dt);b.pulse-=dt;b.actionCd=Math.max(0,b.actionCd-dt);b.supportCd=Math.max(0,b.supportCd-dt);
 if(b.time<=0){failRaid('Tiempo agotado');return;}
 if(b.pulse<=0){b.pulse=d.pulse/Math.min(1.5,eraPressure());spawnBug(d.bugs);setStability(-d.hit*eraPressure());shake=state.settings.motion?4:0;log(`${d.name} contraataca: +${d.bugs} bugs.`,'error');}
 if(state.stability<=0)return;
 const p=raidPhase();if(p.mode==='hold')b.progress=state.stability>=p.threshold?b.progress+dt:0;
 if(p.mode==='purge'&&!state.bugs.length&&raidProgress()<phaseGoal())spawnBug(1);
 advanceRaidIfReady();
}
function showCrisis(){
 if(state.run.boss){const name=raidDefinition().name;state.run.boss=null;state.run.raidCooldown=45;expKeys={};log(`${name} ha ganado este intento. Conservas tus mejoras.`,'error');}
 legacyShowCrisis();
}
function tick(dt){
 if(state.paused||modalType||!state.onboarded||document.hidden)return;
 state.uptime+=dt;
 for(const k of Object.keys(state.cooldowns))state.cooldowns[k]=Math.max(0,state.cooldowns[k]-dt);
 state.boost=Math.max(0,state.boost-dt);state.freezeIncome=Math.max(0,state.freezeIncome-dt);state.run.raidCooldown=Math.max(0,state.run.raidCooldown-dt);
 earn(income()*dt);
 const damage=state.bugs.length*.17*(1-state.upgrades.firewall*.12)*(1-state.meta.permanent.shield*.06)*dimension().damage*eraPressure();
 const recovery=(state.upgrades.cooling*.08+(state.bugs.length===0?.13:0))*dimension().recovery;
 setStability((recovery-damage)*dt);
 if(state.stability<=0){showCrisis();return;}
 droneTick(dt);
 if(state.stability>=90)state.highStableSeconds+=dt;
 state.nextBug-=dt;if(state.nextBug<=0){spawnBug(dimension().id==='ceuta'&&Math.random()<.45?2:1);state.nextBug=(Math.max(15,32-state.nodes.length*.8)+state.upgrades.firewall*3)*dimension().spawn;log(`${state.bugs.at(-1)?.name||'BUG'} ha entrado sin llamar.`,'error');}
 state.nextEvent-=dt;if(state.nextEvent<=0){if(state.events.length<2){const available=EVENT_DEFS.filter(e=>!state.events.some(x=>x.id===e.id));const d=available[Math.floor(Math.random()*available.length)];state.events.push({id:d.id,serial:state.eventSerial++});log(`Incidente: ${d.title}`,'warn');}state.nextEvent=55+Math.random()*35;}
 if(state.stability<=0){showCrisis();return;}
 raidTick(dt);if(state.stability<=0){showCrisis();return;}
 saveClock+=dt;if(saveClock>=3){saveClock=0;checkProgress();save();}
}
function switchView(v){
 if(!['command','lab','archive','automation','rifts','singularity'].includes(v))return;
 view=v;document.querySelectorAll('.view').forEach(el=>el.classList.add('hidden'));$('view-'+v).classList.remove('hidden');
 document.querySelectorAll('[data-view]').forEach(b=>{const a=b.dataset.view===v;b.classList.toggle('active',a);if(a)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 const titles={command:['Tu imperio. Tus bugs.','Construye algo incre\u00edble. Intenta que no explote.'],lab:['M\u00e1s sistema. Menos excusas.','Invierte en el ciclo actual. Las mejoras del laboratorio se reinician con el Big Bang.'],archive:['El caos tiene memoria.','Los logros sobreviven al Big Bang. Las an\u00e9cdotas, por desgracia, tambi\u00e9n.'],automation:['Trabaja menos. Delega mejor.','Tres drones. Una reserva de cr\u00e9ditos. Ninguno pide vacaciones.'],rifts:['Los jefes tambi\u00e9n tienen bugs.','Tres incidentes. Nueve fases. Un universo que se niega a jubilarse.'],singularity:['El final era el principio.','Convierte tu imperio en fragmentos y construye el siguiente con ventaja.']};
 $('breadcrumbCurrent').textContent=v==='command'?`CICLO\u2013${pad(state.meta.prestiges+1)}`:({lab:'LABORATORIO',archive:'SALA DE LA FAMA',automation:'AUTOMATIZACI\u00d3N',rifts:'INCIDENTES MAYORES',singularity:'SINGULARIDAD'}[v]);
 $('mainTitle').textContent=titles[v][0];$('headingDesc').textContent=titles[v][1];viewDirty=true;expKeys={};resizeNeeded=true;closeInspector();updateUI();
}
function updateUI(){
 legacyUpdateUI();
 $('dimensionLabel').textContent=dimension().name;
 $('cycleLabel').textContent=`CICLO ${pad(state.meta.prestiges+1)}`;
 $('shardLabel').textContent=`${num(state.meta.fragments)} FRG`;
 $('eraLabel').textContent=`+${Math.round((eraPressure()-1)*100)}% DA\u00d1O DE BUGS`;
 $('bbNavCount').textContent=pad(state.meta.prestiges);
 $('achievementCount').textContent=`${state.achievements.length}/${ACHIEVEMENTS.length}`;
 $('labNavCount').textContent='04';
 const ready=prestigeReady();$('nextFrontier').textContent=state.run.boss?'ENCUENTRO ACTIVO':ready?'BIG BANG DISPONIBLE':`JEFES ${state.run.bossWins.length}/3`;
 $('nextFrontier').classList.toggle('ready',ready);$('nextFrontier').classList.toggle('fighting',!!state.run.boss);
 if(state.run.boss){const p=raidPhase();$('frontierHint').textContent=`${raidDefinition().name} \u00b7 ${clock(state.run.boss.time)} \u00b7 ${p.name}`;}
 else $('frontierHint').textContent=ready?`Cierra el ciclo: +${fragmentReward()} fragmentos permanentes.`:state.run.bossWins.length<3?`Siguiente: ${RAIDS[state.run.bossWins.length].name}`:'Termina los contratos para preparar tu salto.';
 renderExpansion();
}
function renderMission(){
 if(state.completed.length<MISSIONS.length){legacyRenderMission();return;}
 const wins=state.run.bossWins.length;
 $('missionNumber').textContent='LA SIGUIENTE FRONTERA';$('missionTitle').textContent=prestigeReady()?'El Big Bang te espera.':wins<3?RAIDS[wins].name:'Tu imperio est\u00e1 listo.';
 $('missionDesc').textContent=wins<3?`Derrota a los tres jefes desde la pesta\u00f1a Jefes para desbloquear el prestigio. Siguiente requisito: ${RAIDS[wins].nodes} servidores.`:'Ve a Big Bang. Conserva tus logros y compra mejoras permanentes con los fragmentos.';
 $('missionFill').style.width=`${wins/3*100}%`;$('missionProgress').setAttribute('aria-valuenow',String(Math.floor(wins/3*100)));$('missionProgressText').textContent=`${wins}/3 jefes del ciclo`;$('missionReward').textContent=`+${fragmentReward()} FRG al saltar`;
}
function renderExpansion(){
 if(view==='automation')renderAutomation();if(view==='rifts')renderRifts();if(view==='singularity')renderSingularity();
 if(view==='archive'){$('archiveEarned').textContent=num(Math.floor(state.meta.archivedEarned+state.totalEarned));$('archiveTime').textContent=clock(state.meta.archivedTime+state.uptime);}
}
function renderAutomation(){
 const key=JSON.stringify([state.run.droneLevels,state.run.enabled]);
 if(expKeys.automation!==key){expKeys.automation=key;$('droneGrid').innerHTML=DRONES.map(d=>{const l=state.run.droneLevels[d.id],on=state.run.enabled[d.id];return `<article class="drone-card"><div class="card-top"><span class="upgrade-icon">${ICON(d.icon)}</span><span class="badge ${l?'green':'grey'}">${l?`NIVEL ${l} / ${d.max}`:'SIN CONTRATAR'}</span></div><h3>${d.name}</h3><p>${d.desc}</p><div class="drone-effect">${l?d.effect(l):d.effect(1)}</div><div class="drone-timer"><div id="drone-bar-${d.id}"></div></div><div class="drone-activity" id="drone-state-${d.id}"></div><div class="drone-actions"><button class="btn primary" data-drone-buy="${d.id}" ${l>=d.max?'disabled':''}>${l>=d.max?'Al m\u00e1ximo':`${l?'Mejorar':'Contratar'} \u00b7 ${num(droneCost(d.id))} CR`}</button><button class="switch" role="switch" aria-label="Activar ${d.name}" aria-checked="${on&&l>0}" data-drone-toggle="${d.id}" ${!l?'disabled':''}></button></div></article>`;}).join('');}
 for(const d of DRONES){const l=state.run.droneLevels[d.id],on=l&&state.run.enabled[d.id],interval=droneInterval(d.id);$('drone-bar-'+d.id).style.width=`${on?Math.min(100,state.run.clocks[d.id]/interval*100):0}%`;let msg=!l?'Pendiente de contrataci\u00f3n':!on?'Pausado por ti':state.run.clocks[d.id]>=interval?'Listo. Esperando una tarea o presupuesto.':`Pr\u00f3ximo turno en ${Math.ceil(interval-state.run.clocks[d.id])} s`;$('drone-state-'+d.id).textContent=msg;}
 $('autoCounter').textContent=`${num(state.meta.autoKills)} bugs purgados por drones \u00b7 ${num(state.run.droneOperations)} tareas este ciclo`;
 if(document.activeElement!==$('creditReserve'))$('creditReserve').value=state.run.reserve;
 if(document.activeElement!==$('medicThreshold'))$('medicThreshold').value=state.run.medicTarget;
}
function renderSingularity(){
 const key=JSON.stringify([state.meta,state.run.bossWins,state.completed.length,state.nodes.length,fragmentReward(),!!state.run.boss]);
 if(expKeys.singularity===key)return;expKeys.singularity=key;
 const ready=prestigeReady(),m=state.meta;
 $('prestigeHero').innerHTML=`<div class="bb-hero-copy"><div class="eyebrow">${m.grandVictory?'EXPANSI\u00d3N COMPLETADA \u00b7 MODO LIBRE':'PRESTIGIO INTERDIMENSIONAL'}</div><h2>${m.grandVictory?'Arquitecto del<br><em>imposible.</em>':'No reinicies.<br><em>Trasciende.</em>'}</h2><p>El universo actual tiene fecha de caducidad.<br>Tu experiencia, no.</p><div class="hero-pills"><span>${num(m.prestiges)} Big Bangs</span><span>${m.prestiges>=5?'Campaña completada':`${m.prestiges}/5 para completar la expansi\u00f3n`}</span></div><button class="btn primary big-btn" data-prestige ${!ready?'disabled':''}>${ICON('chaos')}${ready?'Preparar Big Bang':'Completa los requisitos del salto'}</button></div><div class="singularity-art" aria-hidden="true"><div class="orbit-ring r1"></div><div class="orbit-ring r2"></div><div class="orbit-ring r3"></div><div class="singularity-core">${ICON('core')}</div><span class="orbit-dot o1"></span><span class="orbit-dot o2"></span><span class="art-caption">${pad(m.prestiges+1)} / EVENT HORIZON</span></div>`;
 const checks=[['Contratos completados',`${state.completed.length}/6`,state.completed.length===6],['Servidores desplegados',`${Math.min(8,state.nodes.length)}/8`,state.nodes.length>=8],['CEUTA PRIME derrotado',state.run.bossWins.includes('ceuta')?'S\u00ed':'Pendiente',state.run.bossWins.includes('ceuta')]];
 $('prestigeChecklist').innerHTML=checks.map(([label,value,done])=>`<div class="check-item ${done?'done':''}"><span class="check-circle">${ICON(done?'check':'clock')}</span><span>${label}</span><strong>${value}</strong></div>`).join('');
 $('prestigeNumbers').innerHTML=`<div><span>FRAGMENTOS DISPONIBLES</span><strong>${num(m.fragments)}<small> FRG</small></strong></div><div><span>RECOMPENSA DEL CICLO</span><strong class="acid">+${fragmentReward()}<small> FRG</small></strong></div><div><span>BONIFICACI\u00d3N PERMANENTE</span><strong>+${Math.round(m.prestiges*10+m.permanent.yield*15)}<small>% ingresos</small></strong></div>`;
 $('fragmentFormula').textContent=`Recompensa: 3 base + ${Math.min(8,Math.floor(state.totalEarned/25000))} por cr\u00e9ditos generados (1 cada 25.000; m\u00e1ximo 8) + ${state.run.bossWins.length*2} por jefes + ${dimension().bonus} por dimensi\u00f3n. Se cobra solo al confirmar el Big Bang.`;
 $('permanentGrid').innerHTML=PERMANENT.map(p=>{const l=m.permanent[p.id];return `<article class="permanent-card"><div class="card-top"><span class="upgrade-icon">${ICON(p.icon)}</span><span class="badge">${l}/${p.max}</span></div><h3>${p.name}</h3><p>${p.desc}</p><button class="btn ${l>=p.max?'ghost':'primary'}" data-permanent="${p.id}" ${l>=p.max?'disabled':''}>${l>=p.max?'Mejora completa':`${permanentCost(p.id)} fragmentos`}</button></article>`;}).join('');
 $('dimensionsGrid').innerHTML=DIMENSIONS.map(d=>`<article class="dimension-card ${d.id===dimension().id?'current':''} ${d.need>m.prestiges?'locked':''}"><div class="card-top"><span class="dim-symbol">${ICON(d.icon)}</span><span class="badge ${d.id===dimension().id?'green':'grey'}">${d.id===dimension().id?'ACTUAL':d.need>m.prestiges?`${d.need} BIG BANGS`:'DISPONIBLE'}</span></div><h3>${d.name}</h3><p>${d.desc}</p><div class="dimension-rules">${d.rules.map(r=>`<span>${r}</span>`).join('')}</div></article>`).join('');
}
function renderRifts(){
 const b=state.run.boss,d=raidDefinition(),p=raidPhase();
 const key=JSON.stringify([b?.id,b?.phase,state.run.bossWins,state.nodes.length,state.meta.prestiges,state.run.raidCooldown>0]);
 if(expKeys.rifts!==key){expKeys.rifts=key;
 $('raidCatalog').classList.toggle('hidden',!!b);$('raidLive').classList.toggle('hidden',!b);
 if(!b){$('raidCatalog').innerHTML=RAIDS.map((r,i)=>{const won=state.run.bossWins.includes(r.id),unlocked=i===state.run.bossWins.length;return `<article class="raid-card ${won?'won':''} ${!won&&!unlocked?'locked':''}"><div class="raid-number">0${i+1}</div><div class="raid-card-head"><span class="badge ${won?'green':'pink'}">${won?'DERROTADO':r.code}</span><span class="dim-symbol">${ICON(r.icon)}</span></div><h3>${r.name}</h3><p>${r.desc}</p><div class="raid-rules"><span>${ICON('server')}${r.nodes} servidores</span><span>${ICON('clock')}${clock(r.time)} por intento</span><span>${ICON('credit')}+${num(Math.ceil(r.reward*raidScale()))} CR</span></div><div class="phase-chips">${r.phases.map((x,j)=>`<span>${j+1}. ${{purge:'Purgar',hold:'Estabilizar',patch:'Parchear'}[x.mode]}</span>`).join('')}</div><button class="btn ${won?'ghost':unlocked?'primary':'ghost'}" data-raid="${r.id}" ${won||!raidAvailable(r.id)?'disabled':''}>${won?'Victoria registrada':!unlocked?'Derrota al jefe anterior':state.nodes.length<r.nodes?`Necesitas ${r.nodes} servidores`:state.run.raidCooldown>0?'Recuperando sistema':`Iniciar \u00b7 ${num(raidEntry(r))} CR`}</button></article>`;}).join('');}
 else{
 $('raidLive').innerHTML=`<div class="raid-battle-head"><div><div class="eyebrow pink">${d.code} \u00b7 NIVEL DE AMENAZA ${state.meta.prestiges+1}</div><h2>${d.name}</h2></div><div class="raid-clock" id="raidClock"></div></div><div class="battle-rail">${d.phases.map((x,i)=>`<div class="${i<b.phase?'done':i===b.phase?'active':''}"><span>${i<b.phase?'\u2713':`0${i+1}`}</span><strong>${x.name}</strong></div>`).join('')}</div><div class="battle-body"><div class="battle-main"><span class="badge pink">FASE ${b.phase+1} / 3</span><h3>${p.name}</h3><p>${p.desc}</p><div class="battle-goal"><span id="raidGoalText"></span><strong id="raidGoalNumber"></strong></div><div class="battle-progress" role="progressbar" aria-label="Progreso de fase" aria-valuemin="0" aria-valuemax="100" id="battleProgress"><div id="raidProgressBar"></div></div><div class="patch-buttons ${p.mode==='patch'?'':'hidden'}"><button class="btn primary" id="patchSafe" data-raid-action="patch">Aplicar parche \u00b7 ${num(Math.ceil((p.cost||0)*raidScale()))} CR</button><button class="btn danger" id="patchRisk" data-raid-action="risk">Sin tests \u00b7 +2 avance / +3 bugs / \u221212 estabilidad</button></div><div class="battle-tip">${p.mode==='hold'?`Necesitas ${p.goal} segundos SEGUIDOS con estabilidad \u2265${p.threshold}%.` :p.mode==='purge'?'No necesitas volver al mapa: usa Purgar bug debajo. Tambi\u00e9n act\u00faan los drones.':'El parche seguro requiere estabilidad \u226565% y un m\u00e1ximo de 3 bugs. Atajo: gratis, pero peligroso.'}</div></div><aside class="battle-system"><div class="eyebrow">TELEMETR\u00cdA DE COMBATE</div><div><span>Estabilidad</span><strong id="raidStability"></strong></div><div><span>Bugs activos</span><strong id="raidBugs"></strong></div><div><span>Pr\u00f3ximo ataque</span><strong id="raidPulse"></strong></div><p>El jefe mete ${d.bugs} bugs y resta ${num(d.hit*eraPressure(),1)} de estabilidad en cada ataque. La producci\u00f3n y los drones siguen funcionando.</p></aside></div><div class="battle-actions"><button class="btn" data-raid-action="purge" id="raidPurge">${ICON('bug')}Purgar bug \u00b7 gratis</button><button class="btn" data-raid-action="fix" id="raidFix">Hotfix \u00b7 120 CR</button><button class="btn" data-raid-action="support" id="raidSupport">Sellar fuga \u00b7 ${num(Math.ceil(200*raidScale()))} CR</button><button class="btn ghost" data-raid-action="rollback" id="raidRollback">Rollback \u00b7 240 CR</button><button class="btn danger" data-raid-action="retreat">Retirada</button></div>`;
 }
 }
 $('raidStatus').textContent=b?'El tiempo solo avanza con la aplicaci\u00f3n visible. Pausar detiene tambi\u00e9n al jefe.':state.run.raidCooldown>0?`Puedes reintentar en ${Math.ceil(state.run.raidCooldown)} segundos de juego.`:'Cada jefe se puede derrotar una vez por ciclo. Sus fases y requisitos se reinician con el Big Bang.';
 if(!b)return;
 const progress=Math.min(phaseGoal(),raidProgress()),pct=Math.min(100,progress/phaseGoal()*100);
 $('raidClock').textContent=clock(b.time);$('raidClock').classList.toggle('urgent',b.time<30);
 $('raidGoalText').textContent=p.mode==='purge'?'Bugs eliminados':p.mode==='hold'?`Estabilidad \u2265${p.threshold}% sin interrupciones`:'Parches aplicados';
 $('raidGoalNumber').textContent=`${p.mode==='hold'?num(progress,1):Math.floor(progress)} / ${phaseGoal()}${p.mode==='hold'?' s':''}`;
 $('raidProgressBar').style.width=`${pct}%`;$('battleProgress').setAttribute('aria-valuenow',String(Math.floor(pct)));
 $('raidStability').textContent=`${num(state.stability,1)}%`;$('raidBugs').textContent=state.bugs.length;$('raidPulse').textContent=`${Math.ceil(b.pulse)} s`;
 $('raidPurge').disabled=!state.bugs.length;
 $('raidFix').disabled=state.cooldowns.fix>0;$('raidFix').textContent=state.cooldowns.fix>0?`Hotfix \u00b7 ${Math.ceil(state.cooldowns.fix)} s`:'Hotfix \u00b7 120 CR';
 $('raidRollback').disabled=state.cooldowns.rollback>0;
 $('raidSupport').disabled=b.supportCd>0;$('raidSupport').textContent=b.supportCd>0?`Sellar fuga \u00b7 ${Math.ceil(b.supportCd)} s`:`Sellar fuga \u00b7 ${num(Math.ceil(200*raidScale()))} CR`;
 if(p.mode==='patch'){$('patchSafe').disabled=b.actionCd>0||state.stability<65||state.bugs.length>3;$('patchRisk').disabled=b.actionCd>0;}
}
function exportSave(){
 save();downloadJSON(state,`bro-os-bigbang-ciclo-${pad(state.meta.prestiges+1)}.json`);toast('Universo embotellado.','El JSON contiene tu ciclo, logros, fragmentos y mejoras permanentes.');
}
function downloadJSON(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function showWelcome(){
 openModal('welcome',`<div class="eyebrow">BRO//OS \u00b7 BIG BANG 2.0</div><h2>Producci\u00f3n se te<br>ha quedado <span class="acid">peque\u00f1a.</span></h2><p>La expansi\u00f3n empieza donde terminaba el juego. Automatiza tus servidores, derrota a los jefes y convierte cada victoria en un nuevo universo.</p><div class="how-grid"><div class="how-step"><span class="number">01</span><div><strong>\u00bfVienes de la primera versi\u00f3n?</strong><p>Exporta tu partida desde los Ajustes del juego antiguo. Imp\u00f3rtala aqu\u00ed: conservar\u00e1s todos tus servidores, cr\u00e9ditos, mejoras y logros.</p></div></div><div class="how-step"><span class="number">02</span><div><strong>Deja de hacerlo todo a mano</strong><p>Contrata drones y derrota a tres jefes con fases diferentes. CEUTA PRIME desbloquea el Big Bang.</p></div></div><div class="how-step"><span class="number">03</span><div><strong>Un final que s\u00ed sirve de algo</strong><p>Salta a otras dimensiones, compra mejoras permanentes y completa cinco Big Bangs.</p></div></div></div><button class="btn primary full-width" id="welcomeImport">${ICON('upload')} Importar mi partida anterior</button><button class="btn ghost full-width" id="startBtn" style="margin-top:10px">Empezar una partida nueva</button><div class="modal-note">100% local. No conecta con AutoDrop, RRForms ni servidores reales.<br>La app cerrada o la pesta\u00f1a oculta no genera progreso ni da\u00f1os.</div>`);
 $('welcomeImport').addEventListener('click',()=>$('importInput').click());
 $('startBtn').addEventListener('click',()=>{state.onboarded=true;forceCloseModal();log('BIG BANG online. Los jefes te estaban esperando.','success');tone('deploy');save();switchView('command');});
}
function showHelp(){
 openModal('help',`${closeHTML}<div class="eyebrow">MANUAL DE SUPERVIVENCIA \u00b7 V2</div><h2>Ahora el caos<br>tiene <span class="violet">continuidad.</span></h2><p><strong>Ruta:</strong> construye servidores y termina los 6 contratos. Contrata drones. Derrota a Migraci\u00f3n, Viernes y CEUTA PRIME. Confirma el Big Bang. Compra mejoras permanentes. Repite hasta completar 5 Big Bangs.</p><div class="how-grid"><div class="how-step"><span class="number">01</span><div><strong>Los bugs se pueden eliminar gratis</strong><p>Pulsarlos en el mapa o usar Purgar da +35 CR y +0,8 estabilidad. Los reforzados necesitan dos golpes. Un hotfix cuesta 120 CR y elimina hasta tres bugs.</p></div></div><div class="how-step"><span class="number">02</span><div><strong>Los drones respetan tu presupuesto</strong><p>El pato purga gratis. El SRE paga 40 CR por reparar. El becario paga las mejoras. Los dos \u00faltimos nunca gastan por debajo de tu reserva.</p></div></div><div class="how-step"><span class="number">03</span><div><strong>Lee las fases de cada jefe</strong><p>Purgar: elimina la cantidad indicada. Estabilizar: mant\u00e9n el umbral sin interrupciones. Parchear: paga con estabilidad \u226565% y no m\u00e1s de 3 bugs, o usa el atajo peligroso.</p></div></div><div class="how-step"><span class="number">04</span><div><strong>Prestigio no es borrar la partida</strong><p>Big Bang conserva logros, XP, fragmentos e historial. Reinicia la econom\u00eda y las mejoras del ciclo. Las mejoras permanentes se compran con fragmentos y sobreviven a todos los saltos.</p></div></div></div><p><strong>Si colapsas:</strong> rescata los servidores por un 40% de tus cr\u00e9ditos. Un encuentro activo se cancela. Si agotas el tiempo de un jefe, pierdes un 10% de cr\u00e9ditos y 12 de estabilidad; puedes reintentar.</p><p><strong>Atajos:</strong> D desplegar, F hotfix, C caf\u00e9, X caos, Espacio pausa, / terminal. La terminal no ejecuta comandos reales.</p><p><strong>Terminal:</strong> <span class="mono acid">help, status, deploy, purge, fix, coffee, rollback, chaos, lab, map, drones, bosses, prestige, achievements, duck</span>.</p><p class="small-note">Los cuadros de di\u00e1logo y las pesta\u00f1as ocultas pausan la simulaci\u00f3n. No hay progreso offline. Solo los ajustes de tu navegador pueden impedir el guardado local; exporta copias JSON regularmente.</p><button class="btn primary full-width" id="helpDoneBtn">Volver a producci\u00f3n ${ICON('arrow')}</button>`);
 $('helpDoneBtn').addEventListener('click',closeModal);
}
function readBackup(){try{const raw=localStorage.getItem(BACKUP_STORE);if(!raw)return null;const b=JSON.parse(raw);return {reason:typeof b.reason==='string'?b.reason:'Copia local',at:b.at,save:validateSave(b.save)};}catch{return null;}}
function renderSettings(){
 const backup=readBackup();
 openModal('settings',`${closeHTML}<div class="eyebrow">PARTIDA Y PREFERENCIAS</div><h2>El caos tambi\u00e9n<br>necesita <span class="acid">backup.</span></h2><p>Todo est\u00e1 pausado mientras este panel est\u00e1 abierto.</p><div class="settings-row"><div><strong>Efectos de sonido</strong><small>Sintetizados aqu\u00ed. No se descarga audio externo.</small></div><button class="switch" id="setSound" role="switch" aria-label="Efectos de sonido" aria-checked="${state.settings.sound}"></button></div><div class="settings-row"><div><strong>Movimiento y part\u00edculas</strong><small>No cambia las reglas ni la dificultad.</small></div><button class="switch" id="setMotion" role="switch" aria-label="Movimiento y part\u00edculas" aria-checked="${state.settings.motion}"></button></div><div class="settings-row"><div><strong>\u00d3rbitas animadas</strong><small>Movimiento de los nodos en el mapa.</small></div><button class="switch" id="setOrbit" role="switch" aria-label="\u00d3rbitas animadas" aria-checked="${state.settings.orbit}"></button></div><div class="modal-footer"><button class="btn primary" id="exportBtn">${ICON('download')}Exportar partida</button><button class="btn" id="importBtn">${ICON('upload')}Importar v1 / v2</button></div><p class="small-note" style="margin-top:15px">${storageOK?'Autoguardado cada 3 segundos de juego.':'Este navegador no permite guardar. Exporta tu partida antes de cerrar.'} BIG BANG usa un guardado separado de la versi\u00f3n original. Al abrir otro archivo HTML, importa el JSON para trasladar la partida con seguridad.</p>${backup?`<div class="backup-note"><strong>Copia local disponible</strong><br>${escapeHTML(backup.reason)} \u00b7 ciclo ${backup.save.meta.prestiges+1}<br><button class="btn ghost" id="downloadBackup" style="margin-top:9px">${ICON('download')}Descargar copia anterior</button></div>`:''}<div class="modal-footer" style="padding-top:18px;border-top:1px solid var(--line)"><button class="btn danger" id="resetBtn">Borrar TODO el progreso</button><button class="btn ghost" id="settingsDone">Volver</button></div>`);
 $('setSound').addEventListener('click',toggleSound);$('setMotion').addEventListener('click',()=>{state.settings.motion=!state.settings.motion;if(!state.settings.motion){particles=[];shake=0;}save();renderSettings();});$('setOrbit').addEventListener('click',()=>{state.settings.orbit=!state.settings.orbit;save();renderSettings();});
 $('exportBtn').addEventListener('click',exportSave);$('importBtn').addEventListener('click',()=>$('importInput').click());$('resetBtn').addEventListener('click',confirmReset);$('settingsDone').addEventListener('click',closeModal);
 if(backup)$('downloadBackup').addEventListener('click',()=>downloadJSON(backup.save,'bro-os-bigbang-copia-anterior.json'));
}
function confirmReset(){
 openModal('reset',`${closeHTML}<div class="eyebrow pink">ESTO NO ES UN BIG BANG</div><h2>Borrar significa<br><span class="pink">borrar todo.</span></h2><p>Se reiniciar\u00e1n tambi\u00e9n los fragmentos, las mejoras permanentes, los logros y los Big Bangs. Este bot\u00f3n no da bonificaciones. La partida de la primera versi\u00f3n no se toca.</p><div class="modal-footer"><button class="btn" id="resetExport">Exportar copia</button><button class="btn danger" id="confirmResetBtn">S\u00ed, borrar todo BIG BANG</button><button class="btn ghost" id="cancelResetBtn">Cancelar</button></div>`);
 $('resetExport').addEventListener('click',exportSave);$('cancelResetBtn').addEventListener('click',renderSettings);
 $('confirmResetBtn').addEventListener('click',()=>{backupCurrent('Antes de borrar todo');state=freshState();resetRenderCaches();forceCloseModal();updateSoundUI();switchView('command');save();showWelcome();});
}
function importCandidate(candidate,version){
 openModal('import',`${closeHTML}<div class="eyebrow">${version===1?'MIGRACI\u00d3N DESDE BRO//OS V1':'RESTAURAR BIG BANG'}</div><h2>Tu imperio<br><span class="acid">sigue aqu\u00ed.</span></h2><p>Esta partida tiene <strong>${candidate.nodes.length} servidores</strong>, <strong>${num(Math.floor(candidate.credits))} CR</strong>, <strong>${candidate.achievements.length} logros</strong> y <strong>${candidate.meta.prestiges} Big Bangs</strong>.</p><p>${version===1?'No se reinicia nada de tu partida anterior. Solo se a\u00f1aden las nuevas mec\u00e1nicas.':'Se recuperar\u00e1n los drones, la dimensi\u00f3n, las mejoras permanentes y el encuentro activo, si lo hay.'}</p><div class="backup-note">La partida actual de BIG BANG se sustituir\u00e1. Se intentar\u00e1 guardar una copia local antes. Exporta tambi\u00e9n un JSON si necesitas conservarla.</div><div class="modal-footer"><button class="btn" id="exportBeforeImport">Exportar actual</button><button class="btn primary" id="confirmImport">Importar y continuar</button><button class="btn ghost" id="cancelImport">Cancelar</button></div>`);
 $('exportBeforeImport').addEventListener('click',exportSave);
 $('confirmImport').addEventListener('click',()=>{backupCurrent('Antes de importar otra partida');state=candidate;state.onboarded=true;resetRenderCaches();forceCloseModal();updateSoundUI();switchView(state.run.boss?'rifts':state.completed.length===6?'rifts':'command');log(version===1?'Partida v1 migrada: tus servidores, cr\u00e9ditos y logros se han conservado.':'Partida BIG BANG restaurada.','success');checkProgress();updateUI();save();if(state.stability<=0)showCrisis();toast('Continuamos donde lo dejaste.',state.paused?'La partida estaba pausada. Pulsa Reanudar.':'Tu siguiente frontera est\u00e1 en Jefes y Big Bang.');});
 $('cancelImport').addEventListener('click',()=>{if(!state.onboarded)showWelcome();else renderSettings();});
}
function executeCommand(raw){
 const c=raw.trim().toLowerCase();
 if(c==='drones'||c==='automation'){switchView('automation');log('Control de drones abierto.','info');return;}
 if(c==='bosses'||c==='jefes'){switchView('rifts');log('Incidentes mayores abiertos.','info');return;}
 if(c==='prestige'||c==='bigbang'){switchView('singularity');log('Singularidad abierta. Los saltos siempre requieren confirmaci\u00f3n.','info');return;}
 if(c==='help'){legacyExecuteCommand(raw);log('BIG BANG: drones \u00b7 bosses \u00b7 prestige. Comandos de navegaci\u00f3n; no reinician la partida.','info');return;}
 legacyExecuteCommand(raw);
}
function initExpansion(){
 $('nextFrontier').addEventListener('click',()=>switchView(state.run.boss||!prestigeReady()?'rifts':'singularity'));
 $('frontierHint').addEventListener('click',()=>switchView(state.run.boss||!prestigeReady()?'rifts':'singularity'));
 $('view-automation').addEventListener('click',e=>{const buy=e.target.closest('[data-drone-buy]'),toggle=e.target.closest('[data-drone-toggle]');if(buy)buyDrone(buy.dataset.droneBuy);if(toggle){const id=toggle.dataset.droneToggle;if(!state.run.droneLevels[id]||!canAct())return;state.run.enabled[id]=!state.run.enabled[id];expKeys.automation='';updateUI();save();}});
 $('creditReserve').addEventListener('change',e=>{const v=Number(e.target.value);if(!Number.isFinite(v)){e.target.value=state.run.reserve;return;}state.run.reserve=clamp(Math.floor(v),0,1e9);e.target.value=state.run.reserve;save();});
 $('medicThreshold').addEventListener('change',e=>{const v=Number(e.target.value);if(!Number.isFinite(v))return;state.run.medicTarget=clamp(Math.floor(v),50,100);save();});
 $('view-singularity').addEventListener('click',e=>{const p=e.target.closest('[data-permanent]');if(p)buyPermanent(p.dataset.permanent);if(e.target.closest('[data-prestige]'))showPrestige();});
 $('view-rifts').addEventListener('click',e=>{const start=e.target.closest('[data-raid]'),action=e.target.closest('[data-raid-action]');if(start)startRaid(start.dataset.raid);if(action){const commands={purge:()=>{if(state.bugs[0])hitBug(state.bugs[0].id);},fix:doFix,rollback:doRollback,patch:()=>raidPatch(false),risk:()=>raidPatch(true),support:raidSupport,retreat:confirmRetreat};commands[action.dataset.raidAction]?.();}});
 $('importInput').addEventListener('change',async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{if(file.size>2000000)throw new Error('La partida supera 2 MB.');const raw=JSON.parse(await file.text()),candidate=validateSave(raw);importCandidate(candidate,raw.version);}catch(err){toast('No se ha cambiado tu partida.',err instanceof Error?err.message:'Archivo no v\u00e1lido.','warn');}});
 if(migrationNotice)setTimeout(()=>toast('Tu partida v1 se ha detectado.','Se ha migrado a un guardado separado. El original no se ha tocado.'),500);
}

function closeModal(){
 if(modalType==='welcome'||modalType==='crisis')return;
 const needsWelcome=!state.onboarded;legacyCloseModal();if(needsWelcome)showWelcome();
}


let state=freshState(),storageOK=true,loadError='';
let migrationNotice=false, expKeys={};
loadBigBang();
let view='command',logFilter='all',selectedNode=null,modalType=null,lastFocus=null,modalCleanup=null,lastUITime=0,saveClock=0,eventKey=null,viewDirty=true,lastCapacity='',lastNodeList='',lastLogKey='',resizeNeeded=true,sceneTime=0,orbitPhase=0,lastFrame=performance.now(),pointer={x:0,y:0,active:false},nodePositions=[],bugPositions=[],particles=[],floatingTexts=[],shake=0,starField=[],audio=null,commandHistory=[],historyIndex=0,crisisOpen=false;
const canvas=$('universe');const ctx=canvas.getContext('2d');let cw=700,ch=376,dpr=1;
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));storageOK=true;$('saveStatus').innerHTML=ICON('check')+'<span>Partida guardada en local</span>';}catch{storageOK=false;$('saveStatus').innerHTML=ICON('save')+'<span>Sin guardado · exporta partida</span>';}}
function log(message,type='info') {state.logs.push({message,type,time:state.uptime});if(state.logs.length>70)state.logs.shift();renderLogs();}
function toast(title,text='',type='ok'){const el=document.createElement('div');el.className='toast'+(type==='warn'?' warn':'');el.innerHTML=ICON(type==='warn'?'bolt':'check')+`<div><div class="toast-title">${escapeHTML(title)}</div>${text?`<div class="toast-text">${escapeHTML(text)}</div>`:''}</div><button aria-label="Cerrar notificación">×</button>`;$('toasts').appendChild(el);el.querySelector('button').addEventListener('click',()=>el.remove());while($('toasts').children.length>3)$('toasts').firstChild.remove();window.setTimeout(()=>el.remove(),5200);}
function tone(kind='click'){
 if(!state.settings.sound)return;
 try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});const t=audio.currentTime;const patterns={click:[520,740],deploy:[330,440,660,880],bug:[200,100],reward:[523,659,784,1046],chaos:[120,95,65],error:[160,140]};const notes=patterns[kind]||patterns.click;notes.forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type=kind==='chaos'?'sawtooth':'sine';o.frequency.setValueAtTime(f,t+i*.075);g.gain.setValueAtTime(0,t+i*.075);g.gain.linearRampToValueAtTime(.045,t+i*.075+.012);g.gain.exponentialRampToValueAtTime(.001,t+i*.075+.13);o.connect(g);g.connect(audio.destination);o.start(t+i*.075);o.stop(t+i*.075+.15);});}catch{state.settings.sound=false;updateSoundUI();}
}
function confetti(){if(!state.settings.motion)return;for(let i=0;i<26;i++){const e=document.createElement('span');e.className='confetti-piece';e.style.left=`${10+Math.random()*80}%`;e.style.background=['#d9fa76','#b19af9','#f58dab','#82d6e5'][i%4];e.style.setProperty('--drift',`${Math.random()*200-100}px`);e.style.animationDelay=`${Math.random()*.4}s`;e.style.animationDuration=`${2+Math.random()}s`;document.body.appendChild(e);setTimeout(()=>e.remove(),3800);}}
function capacity(){return 8+state.upgrades.capacity*2;}
function legacyIncome(){if(state.freezeIncome>0)return 0;return state.nodes.reduce((a,n)=>a+n.level*4,0)*(1+state.upgrades.workers*.2)*(state.boost>0?2:1)*(.4+.6*state.stability/100);}
function level(){return 1+Math.floor(state.xp/400);}
function rank(){return ['Becario del cosmos','Junior del vacío','Dev intergaláctico','Senior por accidente','CTO de las estrellas','Dios de producción'][Math.min(5,Math.floor((level()-1)/2))];}
function legacyDeployCost(){return Math.floor(180*Math.pow(1.24,state.nodes.length-3));}
function upgradeCost(id){const def=UPGRADES.find(u=>u.id===id);return Math.floor(def.base*Math.pow(1.75,state.upgrades[id]));}
function nodeCost(node){return 150*node.level;}
function legacyCanAct(){if(modalType && modalType!=='settings')return false;if(state.paused){toast('El multiverso está pausado.','Reanuda la simulación antes de hacer cambios.','warn');return false;}return true;}
function spend(amount){if(state.credits<amount){toast('La fe no paga los servidores.',`Necesitas ${num(amount)} CR. Te faltan ${num(Math.ceil(amount-state.credits))}.`,'warn');tone('error');return false;}state.credits-=amount;return true;}
function earn(amount){state.credits+=amount;state.totalEarned+=amount;}
function setStability(delta){state.stability=clamp(state.stability+delta,0,100);}
function spawnBug(count=1){for(let i=0;i<count;i++){if(state.bugs.length>=MAX_BUGS){setStability(-2);continue;}const id=state.nextBugId++;const seed=Math.random()*Math.PI*2;state.bugs.push({id,name:BUG_NAMES[Math.floor(Math.random()*BUG_NAMES.length)],seed,hp:state.nodes.length>7&&Math.random()>.7?2:1,target:state.nodes[Math.floor(Math.random()*state.nodes.length)].id});}viewDirty=true;}
function particlesAt(x,y,color='#d9fa76',count=18){if(!state.settings.motion)return;for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,speed=25+Math.random()*90;particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:.6+Math.random()*.6,max:1.2,color});}if(particles.length>350)particles.splice(0,particles.length-350);}
function floatText(text,x,y,color='#d9fa76'){floatingTexts.push({text,x,y,life:1.3,color});}
function killBug(id,reward=true,silent=false){const idx=state.bugs.findIndex(b=>b.id===id);if(idx<0)return;const b=state.bugs[idx];const pos=bugPositions.find(p=>p.id===id);state.bugs.splice(idx,1);state.totalDefeated++;state.xp+=8;if(reward){earn(35);setStability(.8);}if(pos){particlesAt(pos.x,pos.y,'#f58dab',16);if(reward)floatText('+35 CR',pos.x,pos.y-9);}
 if(!silent){log(`${b.name} eliminado. No era una feature.`,'success');tone('bug');}viewDirty=true;
}
function hitBug(id){if(!canAct())return;const bug=state.bugs.find(b=>b.id===id);if(!bug)return;if(bug.hp>1){bug.hp--;const p=bugPositions.find(p=>p.id===id);if(p){particlesAt(p.x,p.y,'#f58dab',8);floatText('¡OTRA VEZ!',p.x,p.y-13,'#f58dab');}tone('bug');return;}killBug(id);checkProgress();updateUI();}
function legacyDeploy(){if(!canAct())return;if(state.nodes.length>=capacity()){toast('Tu imperio ya no cabe.','Amplía la capacidad en el laboratorio.','warn');switchView('lab');return;}const cost=deployCost();if(!spend(cost))return;const id=state.nextNodeId++;const n={id,name:NODE_NAMES[(id-1)%NODE_NAMES.length],level:1};state.nodes.push(n);state.totalDeploys++;state.xp+=25;setStability(-2);log(`Universo «${n.name}» desplegado. −${cost} CR. Sin tests, como siempre.`,'success');toast('Nuevo universo online.',`${n.name} ya genera +4 CR/s de producción base.`);tone('deploy');particlesAt(cw/2,ch/2,'#b19af9',32);checkProgress();viewDirty=true;updateUI();save();}
function doCoffee(){if(!canAct())return;if(state.cooldowns.coffee>0){toast('La cafetera está pensando.',`Disponible en ${Math.ceil(state.cooldowns.coffee)} s.`,'warn');return;}if(!spend(80))return;state.boost=20;state.cooldowns.coffee=50;state.coffees++;log('Café intravenoso activado. Ingresos ×2 durante 20 s.','success');toast('Ahora ves el código en 4D.','Producción duplicada durante 20 segundos.');tone('reward');checkProgress();updateUI();save();}
function doFix(){if(!canAct())return;if(state.cooldowns.fix>0){toast('El hotfix todavía está caliente.',`Disponible en ${Math.ceil(state.cooldowns.fix)} s.`,'warn');return;}if(!spend(120))return;const bugs=state.bugs.slice(0,3);bugs.forEach(b=>killBug(b.id,false,true));setStability(12);state.cooldowns.fix=10;state.xp+=12;log(`Hotfix aplicado: ${bugs.length} bugs menos. Estabilidad +12.`,'success');toast('No preguntes por qué funciona.',`${bugs.length} bugs eliminados. +12 puntos de estabilidad.`);tone('deploy');checkProgress();updateUI();save();}
function doRollback(){if(!canAct())return;if(state.cooldowns.rollback>0){toast('No puedes retroceder tan deprisa.',`Disponible en ${Math.ceil(state.cooldowns.rollback)} s.`,'warn');return;}if(!spend(240))return;const count=state.bugs.length;[...state.bugs].forEach(b=>killBug(b.id,false,true));setStability(25);state.freezeIncome=8;state.cooldowns.rollback=50;state.xp+=18;log(`Rollback: ${count} bugs eliminados. +25 estabilidad. Ingresos detenidos 8 s.`,'success');toast('Has deshecho tus decisiones.','Todos los bugs fuera. La producción se recupera en 8 s.');tone('deploy');checkProgress();updateUI();save();}
function doChaos(){if(!canAct())return;if(state.cooldowns.chaos>0){toast('Hasta el caos tiene límites.',`Disponible en ${Math.ceil(state.cooldowns.chaos)} s.`,'warn');return;}earn(200);spawnBug(3);setStability(-8);state.chaosCount++;state.cooldowns.chaos=25;state.xp+=20;shake=state.settings.motion?9:0;log('Caos invocado voluntariamente. +200 CR, +3 bugs y −8 estabilidad.','error');toast('¿Pero tú has visto lo que has hecho?','+200 CR. +3 bugs. −8 estabilidad. Muy tú.','warn');tone('chaos');checkProgress();updateUI();save();}
function buyUpgrade(id){if(!canAct())return;const def=UPGRADES.find(u=>u.id===id);if(!def||state.upgrades[id]>=def.max)return;if(!spend(upgradeCost(id)))return;state.upgrades[id]++;state.totalUpgrades++;state.xp+=40;log(`${def.name}: nivel ${state.upgrades[id]}. ${def.effect(state.upgrades[id])}.`,'success');toast('Infraestructura con autoestima.',`${def.name} · nivel ${state.upgrades[id]}`);tone('deploy');viewDirty=true;checkProgress();updateUI();save();}
function inspectNode(id){const node=state.nodes.find(n=>n.id===Number(id));if(!node)return;selectedNode=node.id;$('nodeInspector').classList.remove('hidden');$('nodeSelect').value=String(node.id);renderInspector();}
function closeInspector(){selectedNode=null;$('nodeInspector').classList.add('hidden');$('nodeSelect').value='';}
function renderInspector(){if(!selectedNode)return;const n=state.nodes.find(n=>n.id===selectedNode);if(!n){closeInspector();return;}$('inspectorName').textContent=n.name;$('inspectorLevel').textContent=`${n.level} / 5`;$('inspectorIncome').textContent=`+${n.level*4} CR/s`;$('upgradeNodeBtn').disabled=n.level>=5;$('upgradeNodeBtn').innerHTML=n.level>=5?'Nivel máximo, bro':`Mejorar · ${num(nodeCost(n))} CR ${ICON('arrow')}`;}
function buyNodeUpgrade(){if(!canAct())return;const n=state.nodes.find(n=>n.id===selectedNode);if(!n||n.level>=5)return;if(!spend(nodeCost(n)))return;n.level++;state.totalUpgrades++;state.xp+=35;log(`«${n.name}» ahora es nivel ${n.level}. Producción base +4 CR/s.`,'success');tone('deploy');toast('Universo vitaminado.',`${n.name} · nivel ${n.level} · +${n.level*4} CR/s base.`);viewDirty=true;checkProgress();updateUI();save();}
function legacyCheckProgress(){
 let completedAny=false;
 for(const m of MISSIONS){if(state.completed.includes(m.id))continue;if(m.value(state)<m.target)break;state.completed.push(m.id);earn(m.reward);state.xp+=m.xp;log(`Contrato completado: ${m.title} +${num(m.reward)} CR, +${m.xp} XP.`,'success');toast('Contrato completado.',`${m.title} +${num(m.reward)} CR.`);completedAny=true;}
 for(const a of ACHIEVEMENTS){if(!state.achievements.includes(a.id)&&a.test(state)){state.achievements.push(a.id);state.xp+=50;toast(`${a.icon} ${a.name}`,a.desc);log(`Logro desbloqueado: ${a.name}. +50 XP.`,'success');viewDirty=true;}}
 if(completedAny){tone('reward');confetti();viewDirty=true;}
}
function resolveEvent(choice){if(!canAct()||!state.events.length)return;const ev=state.events[0];const d=EVENT_DEFS.find(e=>e.id===ev.id);if(!d)return;const c=choice==='a'?'a':'b';const credits=d[c+'c'];if(credits<0&&!spend(-credits))return;if(credits>0)earn(credits);setStability(d[c+'s']);const bugDelta=d[c+'b'];if(bugDelta>0)spawnBug(bugDelta);else state.bugs.slice(0,-bugDelta).forEach(b=>killBug(b.id,false,true));state.events.shift();state.xp+=20;log(d[c==='a'?'logA':'logB'],c==='a'?'success':'warn');toast(c==='a'?'Crisis desactivada.':'Decisión cuestionable registrada.',d[c==='a'?'logA':'logB'],c==='a'?'ok':'warn');tone(c==='a'?'deploy':'chaos');eventKey=null;checkProgress();updateUI();save();}
function renderEvent(){const key=state.events.map(e=>e.id+e.serial).join(',');if(key===eventKey&&$('incidentBody').children.length)return;eventKey=key;$('eventCount').textContent=pad(state.events.length);const body=$('incidentBody');
 if(!state.events.length){body.className='incident-body calm';body.innerHTML=`<div class="calm-icon">${ICON('shield')}</div><div class="incident-eyebrow" style="justify-content:center;color:var(--acid)">CALMA SOSPECHOSA</div><h2>Nada está ardiendo.<br>De momento.</h2><p>Disfruta de este instante estadísticamente improbable. El próximo incidente ya tiene tu dirección.</p><div class="incident-footer" style="justify-content:center">${ICON('clock')}El universo está preparando algo.</div>`;return;}
 const d=EVENT_DEFS.find(e=>e.id===state.events[0].id);body.className='incident-body';const cost=n=>`${n>0?'+':'−'}${Math.abs(n)} CR`;
 body.innerHTML=`<div class="incident-eyebrow"><span class="dot" style="background:var(--pink)"></span>${escapeHTML(d.label)}</div><h2>${escapeHTML(d.title)}</h2><p>${escapeHTML(d.text)}</p><div class="incident-choices"><button class="choice recommended" data-choice="a" title="${cost(d.ac)}, +${d.as} estabilidad, elimina hasta ${Math.abs(d.ab)} bugs"><span>${escapeHTML(d.a)}</span><span class="choice-cost">${cost(d.ac)}</span></button><button class="choice" data-choice="b" title="${cost(d.bc)}, ${d.bs} estabilidad, +${d.bb} bugs"><span>${escapeHTML(d.b)}</span><span class="choice-cost">${cost(d.bc)}</span></button></div><div class="incident-footer">${ICON('clock')}Tu decisión tiene efectos. Sorpresa.</div>`;body.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>resolveEvent(b.dataset.choice)));
}
function renderLogs(){const filtered=state.logs.filter(l=>logFilter==='all'||l.type==='error'||l.type==='warn');const k=logFilter+filtered.length+JSON.stringify(filtered.at(-1));if(k===lastLogKey)return;lastLogKey=k;const lines=filtered.slice(-18).reverse();$('logs').innerHTML=lines.length?lines.map(l=>`<div class="log-row"><span class="log-time">${clock(l.time)}</span><span class="log-kind ${l.type==='success'?'':l.type}">${{info:'INFO',success:'OK',warn:'WARN',error:'ERROR'}[l.type]}</span><span class="log-message">${escapeHTML(l.message)}</span></div>`).join(''):'<div class="log-row"><span class="log-time">--:--</span><span class="log-kind">OK</span><span class="log-message">Sin incidencias. Haz una captura: esto no dura.</span></div>';}
function legacyRenderMission(){const index=MISSIONS.findIndex(m=>!state.completed.includes(m.id));if(index<0){$('missionNumber').textContent='TODOS LOS CONTRATOS COMPLETADOS';$('missionTitle').textContent='El multiverso lleva tu nombre.';$('missionDesc').textContent='Has terminado la campaña. Sigue creciendo, completa los logros o empieza un nuevo caos.';$('missionFill').style.width='100%';$('missionProgress').setAttribute('aria-valuenow','100');$('missionProgressText').textContent='6 / 6 contratos';$('missionReward').textContent='LEYENDA';return;}const m=MISSIONS[index];const value=Math.min(m.target,Math.floor(m.value(state)));const percent=clamp(value/m.target*100,0,100);$('missionNumber').textContent=`CONTRATO ${pad(index+1)} / 06`;$('missionTitle').textContent=m.title;$('missionDesc').textContent=m.desc;$('missionFill').style.width=`${percent}%`;$('missionProgress').setAttribute('aria-valuenow',String(Math.round(percent)));$('missionProgressText').textContent=`${num(value)} / ${num(m.target)} ${m.unit}`;$('missionReward').textContent=`+${num(m.reward)} CR`;}
function renderLab(){if(view!=='lab'||!viewDirty)return;$('upgradeGrid').innerHTML=UPGRADES.map(u=>{const l=state.upgrades[u.id];const max=l>=u.max;return `<article class="upgrade-card"><div class="upgrade-icon">${ICON(u.icon)}</div><span class="badge">NIVEL ${l} / ${u.max}</span><h3>${u.name}</h3><p>${u.desc}</p><div class="upgrade-foot"><div class="upgrade-effect">${u.effect(l)}</div><button class="btn ${max?'ghost':'primary'}" data-upgrade="${u.id}" ${max?'disabled':''}>${max?'Al máximo':`${num(upgradeCost(u.id))} CR ${ICON('arrow')}`}</button></div></article>`;}).join('');$('upgradeGrid').querySelectorAll('[data-upgrade]').forEach(b=>b.addEventListener('click',()=>buyUpgrade(b.dataset.upgrade)));}
function renderArchive(){if(view!=='archive')return;$('archiveTime').textContent=clock(state.uptime);$('archiveEarned').textContent=num(Math.floor(state.totalEarned));$('archiveLevel').textContent=pad(level());if(!viewDirty)return;$('achievementGrid').innerHTML=ACHIEVEMENTS.map(a=>{const unlocked=state.achievements.includes(a.id);return `<article class="achievement ${unlocked?'unlocked':'locked'}"><div class="achievement-icon" aria-hidden="true">${a.icon}</div><h3>${a.name}</h3><p>${a.desc}</p><div class="achievement-status">${unlocked?'✓ DESBLOQUEADO':'○ POR DESCUBRIR'}</div></article>`;}).join('');}
function legacyUpdateUI(){
 document.documentElement.dataset.motion=state.settings.motion?'on':'off';$('deployPrice').textContent=state.nodes.length>=capacity()?'MAX':`${num(deployCost())} CR`;
 $('creditsValue').textContent=num(Math.floor(state.credits));$('incomeValue').textContent=state.freezeIncome>0?`↻ RECUPERANDO ${Math.ceil(state.freezeIncome)}s`:`↗ +${num(income(),1)} / s`;$('nodesValue').textContent=pad(state.nodes.length);$('capacityValue').textContent=`/ ${pad(capacity())}`;$('stabilityValue').textContent=String(Math.ceil(state.stability));$('stabilityText').textContent=state.stability>85?'Sospechosamente estable':state.stability>60?'Esto aguanta. Probablemente.':state.stability>30?'Huele a viernes por la tarde':'BRO. HAZ ALGO.';const healthColor=state.stability>65?'var(--acid)':state.stability>35?'#e5c881':'var(--pink)';$('stabilityMeter').style.width=`${state.stability}%`;$('stabilityMeter').style.background=healthColor;$('stabilityDot').style.background=healthColor;$('bugsValue').textContent=pad(state.bugs.length);$('threatLabel').textContent=state.bugs.length===0?'MILAGRO':state.bugs.length<=3?'MANEJABLE':state.bugs.length<=6?'SOSPECHOSO':'SOCORRO';$('threatLabel').style.color=state.bugs.length===0?'var(--acid)':'var(--pink)';$('bugsDefeated').textContent=`${num(state.totalDefeated)} purgados`;$('rankLabel').textContent=`${rank()} · N.${level()}`;$('achievementCount').textContent=pad(state.achievements.length);$('purgeBtn').disabled=state.bugs.length===0;$('deployBtn').title=`Desplegar universo · ${num(deployCost())} CR · Atajo D`;
 const capKey=state.nodes.length+':'+capacity();if(capKey!==lastCapacity){lastCapacity=capKey;$('miniCapacity').innerHTML=Array.from({length:Math.min(capacity(),12)},(_,i)=>`<span class="${i<state.nodes.length?'filled':''}"></span>`).join('');}
 const nodeKey=state.nodes.map(n=>n.id+':'+n.level).join(',');if(nodeKey!==lastNodeList){lastNodeList=nodeKey;$('nodeSelect').innerHTML='<option value="">Inspeccionar nodo ↓</option>'+state.nodes.map(n=>`<option value="${n.id}">${escapeHTML(n.name)} · N.${n.level}</option>`).join('');if(selectedNode)$('nodeSelect').value=String(selectedNode);}
 const cds=[['coffee',50,'80 CR · INGRESOS ×2'],['fix',10,'120 CR · −3 BUGS'],['rollback',50,'240 CR · RESCATE'],['chaos',25,'+200 CR · MALA IDEA']];
 for(const [key,max,label] of cds){const cd=state.cooldowns[key];$(key+'Cost').textContent=cd>0?`RECARGANDO · ${Math.ceil(cd)}s`:label;$(key+'Bar').style.width=`${cd/max*100}%`;}
 $('boostRibbon').classList.toggle('hidden',state.boost<=0&&state.freezeIncome<=0);$('boostRibbon').textContent=state.freezeIncome>0?`RESTAURANDO SISTEMA · ${Math.ceil(state.freezeIncome)}s`:`CAFEÍNA ×2 · ${Math.ceil(state.boost)}s`;
 $('pauseBtn').innerHTML=ICON(state.paused?'play':'pause')+`<span>${state.paused?'Reanudar':'Pausar'}</span>`;$('pauseOverlay').classList.toggle('hidden',!state.paused);const suspended=state.paused||!!modalType||!state.onboarded; $('liveText').textContent=suspended?'SISTEMA EN PAUSA':'SISTEMA EN VIVO';$('liveDot').style.background=suspended?'var(--dim)':'var(--acid)';$('orbitBtn').setAttribute('aria-pressed',String(state.settings.orbit));$('sectorBadge').textContent=`SECTOR ${pad(Math.ceil(state.nodes.length/5))}`;
 renderInspector();renderMission();renderEvent();renderLogs();renderLab();renderArchive();viewDirty=false;
}
function legacySwitchView(v){if(!['command','lab','archive'].includes(v))return;view=v;document.querySelectorAll('.view').forEach(el=>el.classList.add('hidden'));$('view-'+v).classList.remove('hidden');document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===v);if(b.dataset.view===v)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});$('breadcrumbCurrent').textContent={command:'MULTIVERSO–001',lab:'LABORATORIO',archive:'SALA DE LA FAMA'}[v];$('mainTitle').textContent={command:'Tu imperio. Tus bugs.',lab:'Invertir también es un superpoder.',archive:'Sobrevivir ya es un logro.'}[v];$('headingDesc').textContent={command:'Construye algo increíble. Intenta que no explote.',lab:'Menos apagar fuegos. Más infraestructura con sentido.',archive:'El rastro glorioso de tus decisiones cuestionables.'}[v];viewDirty=true;resizeNeeded=true;closeInspector();updateUI();}
function togglePause(){state.paused=!state.paused;if(state.paused)closeInspector();log(state.paused?'Simulación pausada. El café de verdad sigue funcionando.':'Simulación reanudada. El caos te echaba de menos.','info');updateUI();save();}
function updateSoundUI(){$('soundBtn').innerHTML=ICON(state.settings.sound?'volume':'muted');$('soundBtn').setAttribute('aria-pressed',String(state.settings.sound));$('soundBtn').setAttribute('aria-label',state.settings.sound?'Desactivar sonido':'Activar sonido');$('soundBtn').title=state.settings.sound?'Desactivar sonido':'Activar sonido';}
function toggleSound(){state.settings.sound=!state.settings.sound;updateSoundUI();tone('click');save();if(modalType==='settings')renderSettings();}
function openModal(type,html){if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});$('app').inert=true;if(modalCleanup){modalCleanup();modalCleanup=null;}if(!modalType)lastFocus=document.activeElement;modalType=type;$('modal').innerHTML=html;const title=$('modal').querySelector('h2');if(title)title.id='modalTitle';$('modalLayer').classList.remove('hidden');document.body.style.overflow='hidden';const close=$('modal').querySelector('[data-close]');if(close)close.addEventListener('click',closeModal);const first=$('modal').querySelector('button,input,[tabindex="0"]');if(first)setTimeout(()=>first.focus(),0);updateUI();}
function legacyCloseModal(){if(modalType==='welcome'||modalType==='crisis')return;if(modalCleanup){modalCleanup();modalCleanup=null;}modalType=null;$('modalLayer').classList.add('hidden');$('app').inert=false;document.body.style.overflow='';if(lastFocus?.isConnected)lastFocus.focus();lastFocus=null;updateUI();}
function forceCloseModal(){modalType=null;$('modalLayer').classList.add('hidden');$('app').inert=false;document.body.style.overflow='';updateUI();}
const closeHTML=`<button class="modal-close" data-close aria-label="Cerrar">${ICON('close')}</button>`;
function legacyShowWelcome(){openModal('welcome',`<div class="modal-art">${ICON('core')}</div><div class="eyebrow">BIENVENIDO A BRO//OS</div><h2>Te hemos dado acceso<br>a producción.<br><span class="acid">Lo sentimos.</span></h2><p>Eres el CTO de un multiverso inestable. Despliega universos, genera créditos y mantén el sistema vivo. O pulsa el botón que dice «caos».</p><div class="how-grid"><div class="how-step"><span class="number">01</span><div><strong>Construye tu imperio</strong><p>Tus universos generan créditos automáticamente.</p></div></div><div class="how-step"><span class="number">02</span><div><strong>Haz clic en los bugs</strong><p>Eliminarlos a mano es gratis. Los hotfixes cuestan.</p></div></div><div class="how-step"><span class="number">03</span><div><strong>Toma malas decisiones con estilo</strong><p>Resuelve incidentes, compra mejoras y cumple contratos.</p></div></div></div><button class="btn primary full-width" id="startBtn">Tengo un mal presentimiento. Empezar ${ICON('arrow')}</button><div class="modal-note">100% local. Sin cuentas. Sin IA remota. Sin servidores reales.<br>La partida se guarda en este navegador; al cerrar, el caos se detiene.</div>`);$('startBtn').addEventListener('click',()=>{state.onboarded=true;forceCloseModal();log('Acceso a producción concedido. No consta evaluación psicológica.','success');tone('deploy');save();$('deployBtn').focus();});}
function legacyShowHelp(){openModal('help',`${closeHTML}<div class="eyebrow">MANUAL DE SUPERVIVENCIA</div><h2>No está roto.<br>Está <span class="violet">en producción.</span></h2><p><strong>Objetivo:</strong> termina 6 contratos, desbloquea logros y mantén la estabilidad por encima de cero. No hay servidores ni dinero reales.</p><div class="how-grid"><div class="how-step"><span class="number">01</span><div><strong>Universos = ingresos</strong><p>Cada nivel de nodo produce 4 CR/s base. La estabilidad modifica la producción. Selecciona un nodo para mejorarlo.</p></div></div><div class="how-step"><span class="number">02</span><div><strong>Bugs = menos estabilidad</strong><p>Pulsa un bug o «Purgar un bug»: +35 CR y +0,8 de estabilidad. Los bugs reforzados necesitan 2 golpes. El hotfix elimina hasta 3 y recupera 12 puntos.</p></div></div><div class="how-step"><span class="number">03</span><div><strong>Invierte antes del incendio</strong><p>El laboratorio mejora ingresos, capacidad y resistencia. Sin bugs, la estabilidad se recupera sola. Los modales y las pestañas ocultas pausan el juego.</p></div></div></div><div class="eyebrow">ATAJOS DE TECLADO</div><div class="keys-grid"><div class="key-row"><kbd>D</kbd>Desplegar universo</div><div class="key-row"><kbd>F</kbd>Hotfix</div><div class="key-row"><kbd>C</kbd>Café de emergencia</div><div class="key-row"><kbd>X</kbd>Invocar caos</div><div class="key-row"><kbd>Espacio</kbd>Pausar / reanudar</div><div class="key-row"><kbd>/</kbd>Abrir terminal</div></div><p style="font-size:10px">Terminal simulada: <span class="acid mono">help, status, deploy, fix, coffee, rollback, chaos, purge, pause, resume, lab, map, achievements, sound, clear, duck</span>. Ningún comando ejecuta órdenes en tu equipo.</p><button class="btn primary full-width" id="helpDoneBtn">Entendido. Más o menos. ${ICON('arrow')}</button>`);$('helpDoneBtn').addEventListener('click',closeModal);}
function legacyRenderSettings(){openModal('settings',`${closeHTML}<div class="eyebrow">PREFERENCIAS DEL UNIVERSO</div><h2>Tu caos, tus reglas.</h2><p>La simulación está pausada mientras estás aquí.</p><div class="settings-row"><div><strong>Efectos de sonido</strong><small>Sintetizados en tu navegador. Sin música externa.</small></div><button class="switch" id="setSound" role="switch" aria-label="Efectos de sonido" aria-checked="${state.settings.sound}"></button></div><div class="settings-row"><div><strong>Movimiento y partículas</strong><small>Reduce la animación visual sin cambiar el juego.</small></div><button class="switch" id="setMotion" role="switch" aria-label="Movimiento y partículas" aria-checked="${state.settings.motion}"></button></div><div class="settings-row"><div><strong>Órbitas animadas</strong><small>Haz que los nodos giren alrededor del núcleo.</small></div><button class="switch" id="setOrbit" role="switch" aria-label="Órbitas animadas" aria-checked="${state.settings.orbit}"></button></div><div class="modal-footer"><button class="btn" id="exportBtn">${ICON('download')}Exportar partida</button><button class="btn" id="importBtn">${ICON('upload')}Importar partida</button></div><p style="font-size:10px;margin-top:15px">${storageOK?'Autoguardado local cada 3 segundos.':'El navegador no permite el guardado local. Exporta tu partida para conservarla.'} No se transmite ningún dato. No hay progreso ni penalizaciones con la app cerrada.</p><div class="modal-footer" style="padding-top:13px;border-top:1px solid var(--line)"><button class="btn danger" id="resetBtn">Reiniciar multiverso</button><button class="btn ghost" id="settingsDone">Volver</button></div>`);
 $('setSound').addEventListener('click',toggleSound);$('setMotion').addEventListener('click',()=>{state.settings.motion=!state.settings.motion;if(!state.settings.motion){particles=[];shake=0;}save();renderSettings();});$('setOrbit').addEventListener('click',()=>{state.settings.orbit=!state.settings.orbit;save();renderSettings();});$('exportBtn').addEventListener('click',exportSave);$('importBtn').addEventListener('click',()=>$('importInput').click());$('resetBtn').addEventListener('click',confirmReset);$('settingsDone').addEventListener('click',closeModal);
}
function legacyConfirmReset(){openModal('reset',`${closeHTML}<div class="eyebrow">OPERACIÓN SIN CTRL + Z</div><h2>¿Borrar todo este<br>maravilloso desastre?</h2><p>Se eliminarán los universos, créditos, mejoras, contratos y logros de esta partida local. Exporta una copia antes de continuar para poder recuperarla.</p><div class="modal-footer"><button class="btn danger" id="confirmResetBtn">Sí, crear un multiverso nuevo</button><button class="btn" id="cancelResetBtn">Mejor no</button></div>`);$('cancelResetBtn').addEventListener('click',renderSettings);$('confirmResetBtn').addEventListener('click',()=>{state=freshState();eventKey=null;lastLogKey='';lastNodeList='';lastCapacity='';viewDirty=true;particles=[];floatingTexts=[];closeInspector();forceCloseModal();switchView('command');updateSoundUI();log('Un multiverso nuevo. Las mismas malas costumbres.','info');save();showWelcome();});}
function legacyExportSave(){save();const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`bro-os-partida-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Multiverso embotellado.','Guarda el archivo JSON para importar esta partida después.');}
function legacyShowCrisis(){if(crisisOpen)return;crisisOpen=true;openModal('crisis',`<div class="modal-art" style="border-color:#f58dab40">${ICON('bolt')}</div><div class="eyebrow" style="color:var(--pink)">PRODUCCIÓN HA ABANDONADO EL CHAT</div><h2>Bueno.<br>Ha sido <span class="pink">intenso.</span></h2><p>La estabilidad ha llegado a cero. Tus universos siguen aquí, pero necesitan un rescate. Puedes recuperarlos a cambio del 40% de tus créditos actuales.</p><p>El rescate elimina todos los bugs y restaura la estabilidad al 65%. Las mejoras y los logros se conservan.</p><button class="btn primary full-width" id="rescueBtn">Rescate de emergencia · ${num(Math.floor(state.credits*.4))} CR ${ICON('arrow')}</button>`);$('rescueBtn').addEventListener('click',()=>{state.credits-=Math.floor(state.credits*.4);state.stability=65;state.bugs=[];state.nextBug=30;state.nextEvent=Math.max(state.nextEvent,30);crisisOpen=false;forceCloseModal();log('Rescate completado. −40% de créditos. Dignidad no recuperable.','warn');tone('deploy');updateUI();save();});}
function legacyExecuteCommand(raw){const cmd=raw.trim();if(!cmd)return;commandHistory.push(cmd);if(commandHistory.length>40)commandHistory.shift();historyIndex=commandHistory.length;log('> '+cmd,'info');const c=cmd.toLowerCase().replace(/^\//,'').replace(/\s+/g,' ');
 const commands={deploy,fix:doFix,coffee:doCoffee,rollback:doRollback,chaos:doChaos,purge:()=>state.bugs[0]?hitBug(state.bugs[0].id):log('No hay bugs. Inquietante.','success'),lab:()=>switchView('lab'),map:()=>switchView('command'),achievements:()=>switchView('archive'),pause:()=>{if(!state.paused)togglePause();},resume:()=>{if(state.paused)togglePause();},sound:toggleSound,clear:()=>{state.logs=[];lastLogKey='';renderLogs();},help:()=>{log('Comandos: status · deploy · fix · coffee · rollback · chaos · purge · pause · resume · lab · map · achievements · sound · clear · duck','info');toast('Terminal simulada. Poderes reales sobre el juego.','Prueba deploy, fix, coffee, chaos, status o duck.');},status:()=>log(`${state.nodes.length} universos · ${num(Math.floor(state.credits))} CR · ${num(state.stability,1)}% estabilidad · ${state.bugs.length} bugs · +${num(income(),1)} CR/s.`,'info'),duck:()=>{log('🦆 Cuéntamelo desde el principio. ¿Has mirado la consola?','success');if(!state.secrets.includes('duck')){state.secrets.push('duck');earn(150);toast('El pato te ha escuchado.','+150 CR por practicar el debugging emocional.');checkProgress();}tone('reward');}};
 if(Object.prototype.hasOwnProperty.call(commands,c))commands[c]();else if(c==='sudo make it work'){if(!canAct())return;if(state.secrets.includes('sudo')){log('sudo: la magia gratuita solo funciona una vez. Usa fix.','warn');return;}state.secrets.push('sudo');setStability(15);state.bugs.slice(0,2).forEach(b=>killBug(b.id,false,true));log('sudo: concedido. +15 estabilidad. Dos bugs han reflexionado.','success');toast('La fe ha compilado.','+15 estabilidad. Hasta 2 bugs eliminados.');checkProgress();}else if(c==='bro'||c==='brooo'||/^bro{2,}$/.test(c)){log('BROOOOO. Confirmado: el sistema habla tu idioma.','success');if(!state.secrets.includes('bro')){state.secrets.push('bro');earn(75);toast('Handshake emocional completado.','+75 CR. Era importante.');}}else if(c.startsWith('sudo ')||c.startsWith('rm ')){log('Buen intento. Esto es una terminal simulada: tu equipo está a salvo.','warn');}else{log(`Comando desconocido: «${cmd}». Escribe help. No ejecutamos shell real.`,'warn');tone('error');}updateUI();save();}
function legacyTick(dt){
 if(state.paused||modalType||!state.onboarded||document.hidden)return;
 state.uptime+=dt;
 for(const k of Object.keys(state.cooldowns))state.cooldowns[k]=Math.max(0,state.cooldowns[k]-dt);
 state.boost=Math.max(0,state.boost-dt);state.freezeIncome=Math.max(0,state.freezeIncome-dt);
 const incoming=income()*dt;earn(incoming);
 const damage=state.bugs.length*.17*(1-state.upgrades.firewall*.12);
 const recovery=state.upgrades.cooling*.08+(state.bugs.length===0?.13:0);
 setStability((recovery-damage)*dt);
 if(state.stability>=90)state.highStableSeconds+=dt;
 state.nextBug-=dt;if(state.nextBug<=0){spawnBug();state.nextBug=Math.max(15,32-state.nodes.length*.8)+state.upgrades.firewall*3;log(`${state.bugs.at(-1)?.name||'BUG'} ha entrado sin llamar. ${LOG_JOKES[Math.floor(Math.random()*LOG_JOKES.length)]}`,'error');}
 state.nextEvent-=dt;if(state.nextEvent<=0){if(state.events.length<2){const available=EVENT_DEFS.filter(e=>!state.events.some(x=>x.id===e.id));const d=available[Math.floor(Math.random()*available.length)];state.events.push({id:d.id,serial:state.eventSerial++});log(`Incidente: ${d.title}`,'warn');toast('Mientras tanto, en producción…',d.title,'warn');}state.nextEvent=55+Math.random()*35;}
 if(state.stability<=0){showCrisis();return;}
 saveClock+=dt;if(saveClock>=3){saveClock=0;checkProgress();save();}
}
function resizeCanvas(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;cw=r.width;ch=r.height;dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);starField=Array.from({length:Math.floor(cw*ch/1900)},()=>({x:Math.random()*cw,y:Math.random()*ch,size:Math.random()>.92?1.2:.55,alpha:.13+Math.random()*.43,phase:Math.random()*6}));resizeNeeded=false;}
function roundedRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):ctx.rect(x,y,w,h);}
function text(str,x,y,size=10,color='#9da6c1',align='center',font='mono'){ctx.font=`${font==='bold'?'600 ':''}${size}px ${font==='mono'?'ui-monospace, SFMono-Regular, Consolas, monospace':'-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'}`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(str,x,y);}
function drawCore(x,y,t){
 const glow=ctx.createRadialGradient(x,y,5,x,y,98);glow.addColorStop(0,'#b19af922');glow.addColorStop(.5,'#b19af910');glow.addColorStop(1,'#b19af900');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,98,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#b19af927';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,45,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#b19af91b';ctx.beginPath();ctx.arc(x,y,54,0,Math.PI*2);ctx.stroke();
 for(let k=0;k<3;k++){ctx.strokeStyle=k===0?'#b19af9aa':'#b19af937';ctx.lineWidth=k===0?2:1;ctx.beginPath();ctx.arc(x,y,45+k*5,t*.3+k*2.1,t*.3+k*2.1+.55);ctx.stroke();}
 const fill=ctx.createRadialGradient(x-9,y-12,2,x,y,35);fill.addColorStop(0,'#3b3456');fill.addColorStop(1,'#1c2033');ctx.fillStyle=fill;ctx.beginPath();ctx.arc(x,y,35,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#b19af96b';ctx.lineWidth=1;ctx.stroke();
 ctx.strokeStyle='#d6c8ff';ctx.lineWidth=1.6;const s=14;ctx.beginPath();ctx.moveTo(x,y-s);ctx.lineTo(x+s*.92,y-s*.5);ctx.lineTo(x+s*.92,y+s*.5);ctx.lineTo(x,y+s);ctx.lineTo(x-s*.92,y+s*.5);ctx.lineTo(x-s*.92,y-s*.5);ctx.closePath();ctx.moveTo(x-s*.92,y-s*.5);ctx.lineTo(x,y);ctx.lineTo(x+s*.92,y-s*.5);ctx.moveTo(x,y);ctx.lineTo(x,y+s);ctx.stroke();
 text('BRO.CORE',x,y+72,9,'#c1b1f2');text('núcleo del caos',x,y+85,7,'#647089');
}
function drawServer(p,n,t){const selected=n.id===selectedNode;const r=cw<450?22:25;const hue=n.level>2?'#d9fa76':'#b19af9';
 const g=ctx.createRadialGradient(p.x,p.y,6,p.x,p.y,r+19);g.addColorStop(0,selected?'#b19af929':'#b19af912');g.addColorStop(1,'#b19af900');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r+19,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#171c2b';ctx.strokeStyle=selected?'#d9fa76':n.level>2?'#d9fa7650':'#676483';ctx.lineWidth=selected?1.7:1;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.stroke();
 ctx.strokeStyle=hue;ctx.lineWidth=1.2;for(let j=0;j<2;j++){roundedRect(p.x-9,p.y-9+j*10,18,7,2);ctx.stroke();ctx.fillStyle=hue;ctx.beginPath();ctx.arc(p.x-5,p.y-5.5+j*10,1,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(p.x+1,p.y-5.5+j*10);ctx.lineTo(p.x+6,p.y-5.5+j*10);ctx.stroke();}
 ctx.fillStyle=state.stability>40?'#d9fa76':'#f58dab';ctx.strokeStyle='#0f121c';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x+r*.7,p.y-r*.7,3.6,0,Math.PI*2);ctx.stroke();ctx.fill();
 text(n.name,p.x,p.y+r+14,cw<450?8:9,'#b6bfd8');text(`N.${n.level} · +${n.level*4} CR/s`,p.x,p.y+r+26,cw<450?6.5:7,'#656f88');
 if(selected){ctx.setLineDash([2,5]);ctx.strokeStyle='#d9fa7660';ctx.beginPath();ctx.arc(p.x,p.y,r+7,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
}
function drawBug(p,b,t){const r=b.hp>1?13:11;ctx.save();ctx.translate(p.x,p.y);const g=ctx.createRadialGradient(0,0,1,0,0,25);g.addColorStop(0,'#f58dab1a');g.addColorStop(1,'#f58dab00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f58dab';ctx.fillStyle='#34212f';ctx.lineWidth=1;roundedRect(-7,-8,14,16,5);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-4,-8);ctx.lineTo(-6,-12);ctx.moveTo(4,-8);ctx.lineTo(6,-12);for(let k=-1;k<=1;k++){ctx.moveTo(-7,k*5);ctx.lineTo(-11,k*6);ctx.moveTo(7,k*5);ctx.lineTo(11,k*6);}ctx.moveTo(0,-4);ctx.lineTo(0,5);ctx.stroke();ctx.fillStyle='#ffbad1';ctx.fillRect(-3,-4,1.5,1.5);ctx.fillRect(2,-4,1.5,1.5);if(b.hp>1){ctx.strokeStyle='#f58dab55';ctx.beginPath();ctx.arc(0,0,r+5,0,Math.PI*2);ctx.stroke();}ctx.restore();text(b.name,p.x,p.y+22,7,'#d897ac');}
function drawScene(dt){if(!ctx||view!=='command')return;if(resizeNeeded)resizeCanvas();if(!cw||!ch)return;
 const active=!(state.paused||modalType||document.hidden);if(active&&state.settings.motion){sceneTime+=dt;if(state.settings.orbit)orbitPhase+=dt*.027;}const t=sceneTime;
 ctx.clearRect(0,0,cw,ch);ctx.fillStyle='#0e111b';ctx.fillRect(0,0,cw,ch);
 const bg=ctx.createRadialGradient(cw*.48,ch*.5,10,cw*.48,ch*.5,cw*.55);bg.addColorStop(0,'#1c1a322e');bg.addColorStop(1,'#0e111b00');ctx.fillStyle=bg;ctx.fillRect(0,0,cw,ch);
 for(const s of starField){ctx.fillStyle=`rgba(173,182,219,${s.alpha*(.65+.35*Math.sin(t*.5+s.phase))})`;ctx.fillRect(s.x,s.y,s.size,s.size);}
 ctx.strokeStyle='#7080a907';ctx.lineWidth=1;for(let x=24;x<cw;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,ch);ctx.stroke();}for(let y=20;y<ch;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(cw,y);ctx.stroke();}
 ctx.save();if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake=Math.max(0,shake-dt*18);}
 const cx=cw*.50,cy=ch*.48;const rx=Math.min(cw*.345,245),ry=Math.min(ch*.30,135);const offset=orbitPhase;
 ctx.strokeStyle='#b19af91c';ctx.lineWidth=1;ctx.setLineDash([3,6]);ctx.beginPath();ctx.ellipse(cx,cy,rx+19,ry+13,-.07,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#b19af90c';ctx.beginPath();ctx.ellipse(cx,cy,rx+44,ry+34,-.07,0,Math.PI*2);ctx.stroke();
 const len=state.nodes.length;nodePositions=state.nodes.map((n,i)=>{const a=-Math.PI/2+i*Math.PI*2/len+offset;const ring=len>9&&i%2===1?.77:1;return {id:n.id,x:cx+Math.cos(a)*rx*ring,y:cy+Math.sin(a)*ry*ring,a};});
 for(const p of nodePositions){ctx.strokeStyle='#b19af929';ctx.lineWidth=1;ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.setLineDash([]);for(let q=0;q<2;q++){const progress=(t*.16+q*.5+p.id*.17)%1;const px=cx+(p.x-cx)*progress,py=cy+(p.y-cy)*progress;ctx.fillStyle=state.boost>0?'#d9fa76':'#ac96eab0';ctx.beginPath();ctx.arc(px,py,1.8,0,Math.PI*2);ctx.fill();}}
 drawCore(cx,cy,t);for(let i=0;i<nodePositions.length;i++)drawServer(nodePositions[i],state.nodes[i],t);
 bugPositions=state.bugs.map((b,i)=>{const target=nodePositions.find(p=>p.id===b.target)||nodePositions[i%nodePositions.length];const side=target.x>cw-80?-1:target.x<80?1:(Math.sin(b.seed+i)>0?1:-1);const distance=46+7*Math.sin(t*.3+b.seed+i);return {id:b.id,x:clamp(target.x+side*distance,20,cw-24),y:clamp(target.y-13+14*Math.sin(t*.23+b.seed*2+i),72,ch-62)};});for(let i=0;i<bugPositions.length;i++)drawBug(bugPositions[i],state.bugs[i],t);
 if(active){for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,2.5,2.5);}ctx.globalAlpha=1;particles=particles.filter(p=>p.life>0);for(const f of floatingTexts){f.y-=dt*24;f.life-=dt;ctx.globalAlpha=Math.min(1,Math.max(0,f.life));text(f.text,f.x,f.y,10,f.color);}ctx.globalAlpha=1;floatingTexts=floatingTexts.filter(f=>f.life>0);}
 ctx.restore();
}
function loop(now){const dt=Math.min((now-lastFrame)/1000,.12);lastFrame=now;tick(dt);drawScene(dt);if(now-lastUITime>240){lastUITime=now;updateUI();}requestAnimationFrame(loop);}
canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const hit=bugPositions.some(p=>Math.hypot(p.x-x,p.y-y)<24)||nodePositions.some(p=>Math.hypot(p.x-x,p.y-y)<31);canvas.style.cursor=hit?'pointer':'default';});
canvas.addEventListener('pointerup',e=>{if(state.paused||modalType)return;const r=canvas.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const bug=bugPositions.map(p=>({...p,d:Math.hypot(p.x-x,p.y-y)})).filter(p=>p.d<25).sort((a,b)=>a.d-b.d)[0];if(bug){hitBug(bug.id);return;}const node=nodePositions.find(p=>Math.hypot(p.x-x,p.y-y)<31);if(node){inspectNode(node.id);tone('click');return;}closeInspector();});
$('deployBtn').addEventListener('click',deploy);$('pauseBtn').addEventListener('click',togglePause);$('resumeBtn').addEventListener('click',togglePause);$('coffeeBtn').addEventListener('click',doCoffee);$('fixBtn').addEventListener('click',doFix);$('rollbackBtn').addEventListener('click',doRollback);$('chaosBtn').addEventListener('click',doChaos);$('purgeBtn').addEventListener('click',()=>{if(state.bugs[0])hitBug(state.bugs[0].id);});$('nodeSelect').addEventListener('change',e=>{if(e.target.value)inspectNode(Number(e.target.value));else closeInspector();});$('closeInspector').addEventListener('click',closeInspector);$('upgradeNodeBtn').addEventListener('click',buyNodeUpgrade);document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));$('brandBtn').addEventListener('click',()=>switchView('command'));$('manualBtn').addEventListener('click',showHelp);$('helpBtn').addEventListener('click',showHelp);$('footerHelp').addEventListener('click',showHelp);$('settingsBtn').addEventListener('click',renderSettings);$('topSettingsBtn').addEventListener('click',renderSettings);$('soundBtn').addEventListener('click',toggleSound);$('orbitBtn').addEventListener('click',()=>{state.settings.orbit=!state.settings.orbit;updateUI();save();toast(state.settings.orbit?'Órbitas en movimiento.':'Órbitas detenidas.','La producción sigue su curso.');});
$('focusBtn').addEventListener('click',()=>{const el=$('arenaWrap');if(document.fullscreenElement){document.exitFullscreen?.().catch(()=>{});}else if(el.requestFullscreen){el.requestFullscreen().catch(()=>toast('El navegador no permite pantalla completa.','El mapa sigue funcionando normalmente.','warn'));}else{toast('Pantalla completa no disponible.','El mapa ya ocupa todo el ancho disponible.');}});document.addEventListener('fullscreenchange',()=>{resizeNeeded=true;});
$('terminalForm').addEventListener('submit',e=>{e.preventDefault();const input=$('terminalInput');const value=input.value;input.value='';executeCommand(value);});$('terminalInput').addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();historyIndex=Math.max(0,historyIndex-1);e.target.value=commandHistory[historyIndex]||'';}else if(e.key==='ArrowDown'){e.preventDefault();historyIndex=Math.min(commandHistory.length,historyIndex+1);e.target.value=commandHistory[historyIndex]||'';}else if(e.key==='Escape')e.target.blur();});
 document.querySelectorAll('[data-log]').forEach(b=>b.addEventListener('click',()=>{logFilter=b.dataset.log;document.querySelectorAll('[data-log]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});renderLogs();}));
$('modalLayer').addEventListener('click',e=>{if(e.target===$('modalLayer'))closeModal();});
document.addEventListener('keydown',e=>{
 if(modalType){if(e.key==='Escape'){e.preventDefault();closeModal();}if(e.key==='Tab'){const list=[...$('modal').querySelectorAll('button:not(:disabled),input,select,[tabindex="0"]')];if(list.length){const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}return;}
 if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)||document.activeElement.isContentEditable)return;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();switchView('command');$('terminalInput').focus();return;}if(e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.key===' '){if(document.activeElement.tagName==='BUTTON')return;e.preventDefault();togglePause();return;}if(e.key==='Escape'){closeInspector();return;}const fn={d:deploy,f:doFix,c:doCoffee,x:doChaos,'/':()=>{switchView('command');$('terminalInput').focus();},'?':showHelp}[e.key.toLowerCase()];if(fn){e.preventDefault();fn();}
});
window.addEventListener('resize',()=>{resizeNeeded=true;});if(window.ResizeObserver){new ResizeObserver(()=>{resizeNeeded=true;}).observe($('arenaWrap'));}document.addEventListener('visibilitychange',()=>{save();lastFrame=performance.now();});window.addEventListener('pagehide',save);
initExpansion();
if(!state.logs.length){log('bro.core inicializado. 3 universos, 0 planes de contingencia.','success');log('Dos bugs han llegado antes que tú. Son puntuales.','warn');log('El multiverso está listo. La responsabilidad es relativa.','info');}
updateSoundUI();updateUI();resizeCanvas();drawScene(0);requestAnimationFrame(loop);
if(!state.onboarded)showWelcome();else if(state.stability<=0)showCrisis();else if(state.run.boss)switchView('rifts');
if(loadError)setTimeout(()=>toast('No se pudo recuperar la partida.',loadError+' Puedes importar una copia desde Ajustes.','warn'),600);
if(!ctx)toast('Tu navegador no puede dibujar el mapa.','El resto del juego funciona con los botones y el selector de nodos.','warn');
})();