// DIAGNOSTIC: does the enemy actually damage the player?
const fs = require('fs');
const html = fs.readFileSync(require('path').join(__dirname, 'index.html'), 'utf8');
const code = html.match(/<script>([\s\S]+?)<\/script>/)[1];
const domStub = `
  const _stub = () => ({ addEventListener:()=>{}, classList:{add:()=>{},remove:()=>{},contains:()=>false},
    appendChild:()=>{}, removeChild:()=>{}, setAttribute:()=>{}, getAttribute:()=>'', style:{}, innerHTML:'',
    textContent:'', onclick:null, oncontextmenu:null, dataset:{}, children:[], querySelector:_stub,
    querySelectorAll:()=>[], remove:()=>{}, offsetWidth:0, offsetHeight:0,
    getBoundingClientRect:()=>({left:0,top:0,width:100,height:100}), firstElementChild:null });
  const document = { getElementById:_stub, querySelector:_stub, querySelectorAll:()=>[], createElement:_stub, body:{appendChild:()=>{}} };
  const window = { addEventListener:()=>{}, innerWidth:400 };
  const localStorage = { _s:{}, getItem(k){return this._s[k]||null}, setItem(k,v){this._s[k]=v} };
  const navigator = { serviceWorker:null };
  const setTimeout = () => {}; const clearTimeout = () => {}; const confirm = () => true;
  const Image = function(){ return { onload:null, onerror:null, src:'' }; };
`;
const exposed = `return { freshRun, startCombat, endTurn, playCard, state, ENEMY_BY_ID, resolveEnemyIntent, chooseEnemyIntent, scaledEnemyHit };`;
const game = eval(`(function(){${domStub}${code}; ${exposed} })()`);

const run = game.freshRun('diag-seed');
game.state.run = run;
run.floor = 0;
run.path[0].chosenNode = 0;
run.currentNode = run.path[0].nodes[0];
const enemyId = run.path[0].nodes[0].enemyId;
game.startCombat(enemyId);
const P = () => run.combatPlayer, E = () => run.combatEnemy;

console.log('Enemy:', game.ENEMY_BY_ID[enemyId].name, 'HP', E().hp);
console.log('Player start HP:', P().hp, ' block:', P().block);
console.log('Initial telegraphed intent:', JSON.stringify(E().intent));

console.log('\n--- TEST A: force an ATTACK intent (base 9), play NOTHING, end turn ---');
let hpBefore = P().hp;
E().intent = { type:'attack', value:9, desc:'FORCED-ATTACK-9' };
const expectedHit = game.scaledEnemyHit({ player:P(), enemy:E() }, 9); // what the dial actually lands
console.log('  player.hp before endTurn:', hpBefore, ' player.block:', P().block, ' scaled hit:', expectedHit);
game.endTurn();
console.log('  player.hp after  endTurn:', P().hp, ' (expected', hpBefore - expectedHit, ')');
console.log('  RESULT:', P().hp === hpBefore - expectedHit ? 'PASS — enemy dealt scaled damage' : 'FAIL — damage mismatch');

console.log('\n--- TEST B: 6 turns, player passes every turn, random real intents ---');
for(let t=0; t<6 && E().hp>0 && P().hp>0; t++){
  const intent = E().intent;
  const hp0 = P().hp;
  game.endTurn();
  console.log(`  turn ${t}: intent=${intent?intent.desc+'('+intent.type+(intent.value!=null?' '+intent.value:'')+')':'—'}  hp ${hp0} -> ${P().hp}  (Δ ${P().hp-hp0})`);
}
console.log('  Player HP after 6 idle turns:', P().hp, '/ started 60');
console.log('  RESULT:', P().hp < 60 ? 'PASS — player took damage over time' : 'FAIL — player never took damage');

console.log('\n--- TEST C: direct resolveEnemyIntent unit check ---');
const ctx = { player:{hp:50,block:0,debuffs:{},buffs:{}}, enemy:{hp:10,block:0,debuffs:{},intent:{type:'attack',value:7}}, combat:{}, run:run };
const exp = 50 - game.scaledEnemyHit(ctx, 7);
game.resolveEnemyIntent(ctx);
console.log('  player.hp 50 -> ' + ctx.player.hp + ' (expected ' + exp + '):', ctx.player.hp===exp?'PASS':'FAIL');

console.log('\n--- TEST D: Ward (Cups) absorbs a hit and persists across turns ---');
const wctx = { player:{hp:50,block:0,debuffs:{},buffs:{ward:10}}, enemy:{hp:10,block:0,debuffs:{},intent:{type:'attack',value:6}}, combat:{}, run:run };
const wexp = game.scaledEnemyHit(wctx, 6);
game.resolveEnemyIntent(wctx);
console.log('  ward 10, hit ' + wexp + ' -> hp ' + wctx.player.hp + ' ward ' + (wctx.player.buffs.ward||0) +
  ':', (wctx.player.hp===50 && wctx.player.buffs.ward===10-wexp) ? 'PASS — ward soaked it, hp intact' : 'FAIL');

console.log('\n--- TEST E: a Studied card deals +2 ---');
// fresh combat, find a basic Wands strike in hand or force one
const s = game.freshRun('study-seed'); game.state.run = s;
s.floor = 0; s.path[0].chosenNode = 0; s.currentNode = s.path[0].nodes[0];
game.startCombat(s.path[0].nodes[0].enemyId);
const sp = () => s.combatPlayer, se = () => s.combatEnemy;
// inject a known card (Two of Wands = wands-2, Strike 5) — once plain, once studied
function playInjected(studied){
  const e2 = se().hp;
  // Reset The Chain so each measurement is first-in-chain (chain bonus 0),
  // isolating the +2 Study delta from the (separate) Chain mechanic.
  s.combat.chainSuit = null; s.combat.chainCount = 0;
  sp().hand.unshift({ cardId:'wands-2', reversed:false, studied });
  sp().energy = 5;
  game.playCard(0);
  return e2 - se().hp;
}
const plain = playInjected(false);
const study = playInjected(true);
console.log(`  Two of Wands plain=${plain}  studied=${study}  (expect studied = plain+2)`);
console.log('  RESULT:', study === plain + 2 ? 'PASS — Study adds +2' : 'FAIL — Study not applied');

console.log('\n--- TEST F: a Spread Arcanum fires at combat start ---');
const fr = game.freshRun('spread-seed', 'magician'); game.state.run = fr;
fr.spread = ['major-4','major-19']; // The Emperor (+12 Block), The Sun (+2 Str)
fr.floor = 0; fr.path[0].chosenNode = 0; fr.currentNode = fr.path[0].nodes[0];
game.startCombat(fr.path[0].nodes[0].enemyId);
const fb = fr.combatPlayer.block, fs2 = (fr.combatPlayer.buffs.strength||0);
console.log(`  start block=${fb} (expect >=12)  strength=${fs2} (expect >=2)`);
console.log('  RESULT:', (fb>=12 && fs2>=2) ? 'PASS — Spread boons applied at combat start' : 'FAIL');

console.log('\n--- TEST G: The Chain escalates on same suit, resets on off-suit ---');
const gr = game.freshRun('chain-seed', 'magician'); game.state.run = gr;
gr.floor = 0; gr.path[0].chosenNode = 0; gr.currentNode = gr.path[0].nodes[0];
game.startCombat(gr.path[0].nodes[0].enemyId);
const gp=()=>gr.combatPlayer, ge=()=>gr.combatEnemy;
ge().hp = 999; ge().maxHp = 999; // dummy so the sequence isn't cut short by a kill
function gplay(cardId){ gp().hand.unshift({cardId,reversed:false}); gp().energy=9; const h=ge().hp; game.playCard(0); return h-ge().hp; }
// Stop at chain 2 so the chain-of-3 Aspect never fires and confounds it.
const a=gplay('wands-2');   // chain1 -> +0 -> 5
const b=gplay('wands-2');   // chain2 -> +2 -> 7
const off=gplay('swords-2');// off-suit: chain resets to swords1 -> pierce 3
const d=gplay('wands-2');   // wands chain reset to 1 -> +0 -> 5
console.log(`  Wands chain: ${a}, ${b} (expect 5,7); off-suit Swords ${off} (expect 3); Wands after reset ${d} (expect 5)`);
console.log('  RESULT:', (a===5&&b===7&&off===3&&d===5) ? 'PASS — Chain escalates +2/step and resets on suit change' : 'FAIL');
