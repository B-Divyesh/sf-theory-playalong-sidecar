import './style.css';
import { KEYS, NOTE_NAMES, frequencyForMidi, noteContext, scalePitches, type Mode } from './theory';
import { loadState, saveState, type HistoryNote, type SavedState } from './storage';

const app = document.querySelector<HTMLDivElement>('#app')!;
const BUILD = 'v1.0.2';
const CANONICAL = 'https://theory-playalong-sidecar.sociobot.in';
const keyboardMap: Record<string, number> = {a:60,w:61,s:62,e:63,d:64,f:65,t:66,g:67,y:68,h:69,u:70,j:71,k:72};
let cleanup: Array<() => void> = [];
let routeAnnouncer: HTMLElement | null = null;

const demoHistory: HistoryNote[] = [
  {id:'demo-1',midi:60,name:'C',inKey:true,keyName:'C major',playedAt:new Date(Date.now()-12000).toISOString()},
  {id:'demo-2',midi:64,name:'E',inKey:true,keyName:'C major',playedAt:new Date(Date.now()-8000).toISOString()},
  {id:'demo-3',midi:66,name:'F♯',inKey:false,keyName:'C major',playedAt:new Date(Date.now()-4000).toISOString()},
  {id:'demo-4',midi:67,name:'G',inKey:true,keyName:'C major',playedAt:new Date().toISOString()}
];

function shell(content: string, demo = false): string {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demo ? `<aside class="demo-bar" aria-label="Demo mode"><strong>Demo</strong> — sample data, nothing is saved <span><button class="text-button" id="reset-demo">Reset demo</button><a href="/" data-link>Start for real</a></span></aside>` : ''}
    <header class="site-header">
      <a class="wordmark" href="/" data-link aria-label="Theory Playalong Sidecar home"><span aria-hidden="true">▞</span> THEORY SIDECAR</a>
      <nav aria-label="Main navigation"><a href="/" data-link>Home</a><a href="/demo" data-link>Demo</a><a href="/privacy" data-link>Privacy</a></nav>
    </header>
    ${content}
    <footer class="site-footer">
      <p><strong>Theory Playalong Sidecar</strong><br><span>See each note inside the key you choose.</span></p>
      <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
      <p class="build">${BUILD}</p>
    </footer>
    <div id="route-status" class="sr-only" aria-live="polite"></div>
    <div id="app-status" class="toast" role="status" aria-live="polite" hidden></div>`;
}

function landing(): string {
  return shell(`<main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">See each note in the key.</p>
        <h1 id="hero-title" tabindex="-1">Play notes against any backing track</h1>
        <p class="lede">For beginning keyboard players who want to see why each note fits while the music keeps moving.</p>
        <div class="hero-actions"><a class="button primary" href="/?demo=1" data-link>Try it with sample data</a><span>Opens a ready C-major practice set.</span></div>
        <ul class="plain-facts"><li>Free to use.</li><li>Audio stays on your device.</li><li>Works offline after your first visit.</li></ul>
      </div>
      <figure class="hero-art"><picture><img src="/assets/harmony-console.32a49c4c.webp" width="1200" height="800" alt="A pixel keyboard sends glowing notes into a twelve-note harmony wheel." fetchpriority="high" decoding="async"></picture><figcaption>Play a note. See its place in the key.</figcaption></figure>
    </section>
    ${workspace(false, false)}
    <section class="how" aria-labelledby="how-title"><p class="section-code">02 / SIGNAL PATH</p><h2 id="how-title">How it works</h2><ol class="steps"><li><span>01</span><div><h3>Choose the context</h3><p>Pick a key, then load your own audio file.</p></div></li><li><span>02</span><div><h3>Play without stopping</h3><p>Use MIDI or the screen keys while the audio continues.</p></div></li><li><span>03</span><div><h3>Notice what changed</h3><p>See the note number in the key, matching chords, and recent notes.</p></div></li></ol></section>
    <section class="limits" aria-labelledby="limits-title"><p class="section-code">03 / BOUNDARIES</p><h2 id="limits-title">What this practice tool does not do</h2><div><p>Your settings and note history stay in this browser. Audio files are not stored.</p></div></section>
  </main>`);
}

function workspace(isDemo: boolean, isPage = true): string {
  const heading = isPage ? `<p class="section-code">DEMO / C MAJOR</p><h1 tabindex="-1">Try notes in C major</h1><p class="demo-intro">The sample groove and four notes are ready. Press a screen key or use A–K on your keyboard.</p>` : `<p class="section-code">01 / PLAYALONG</p><h2 id="play-title">Keep the track moving</h2>`;
  const tag = isPage ? 'main' : 'section';
  const attrs = isPage ? `id="main" class="workspace-page"` : `id="play" class="workspace-section" aria-labelledby="play-title"`;
  const panelHeading = isPage ? 'h2' : 'h3';
  const panelSubheading = isPage ? 'h3' : 'h4';
  return `<${tag} ${attrs}>${heading}
    <div class="console" data-demo="${isDemo}">
      <section class="source-panel" aria-labelledby="source-title">
        <div class="panel-heading"><div><span class="panel-number">A</span><${panelHeading} id="source-title">Backing track</${panelHeading}></div><output id="audio-status" class="readout">${isDemo ? 'SAMPLE READY' : 'NO AUDIO'}</output></div>
        <div class="source-controls">
          <label class="file-button"><span>${isDemo ? 'Replace sample audio' : 'Choose an audio file'}</span><input id="audio-file" type="file" accept="audio/*"></label>
          ${isDemo ? `<button id="sample-play" class="button secondary" type="button">Play sample groove</button>` : ''}
          <audio id="audio-player" controls preload="metadata" aria-label="Backing track player"></audio>
        </div>
        <div class="tempo-row"><label for="bpm">Tempo <input id="bpm" type="number" min="30" max="240" step="1" value="96"> BPM</label><div class="beat-rail" aria-label="Eight-beat marker; playback has reached beat 1" id="beat-rail">${Array.from({length:8},(_,i)=>`<i class="${i===0?'active':''}" data-beat="${i}" aria-hidden="true"></i>`).join('')}<span class="sr-only" id="beat-text">Beat 1 of 8</span></div></div>
      </section>
      <section class="context-panel" aria-labelledby="context-title">
        <div class="panel-heading"><div><span class="panel-number">B</span><${panelHeading} id="context-title">Note in the key</${panelHeading}></div><output id="midi-status" class="readout">MIDI NOT CONNECTED</output></div>
        <div class="context-controls"><label for="key-select">Key<select id="key-select">${KEYS.map(key=>`<option>${key}</option>`).join('')}</select></label><label for="mode-select">Scale<select id="mode-select"><option value="major">Major</option><option value="minor">Minor</option></select></label><button id="connect-midi" class="button secondary" type="button">Connect MIDI</button></div>
        <p id="midi-help" class="help">No MIDI keyboard? Use the screen keys or A–K.</p>
      </section>
      <section class="live-panel" aria-labelledby="live-title">
        <div class="live-note" id="live-note"><p class="panel-number" id="live-title">LIVE NOTE</p><strong id="note-name">—</strong><span id="note-fit">Play a note to see its place.</span></div>
        <div class="chord-area"><${panelSubheading}>Chords that include it</${panelSubheading}><div id="chord-map" class="chord-map"><p>Chord names appear after you play.</p></div></div>
      </section>
      <section class="keyboard-panel" aria-labelledby="keyboard-title"><div class="keyboard-heading"><div><span class="panel-number">C</span><${panelHeading} id="keyboard-title">One-octave note map</${panelHeading}></div><p>Computer keys: A W S E D F T G Y H U J K</p></div><div class="keyboard-scroll"><div class="piano" id="piano" role="group" aria-label="Playable one-octave keyboard">${pianoKeys()}</div></div><p id="scale-summary" class="scale-summary"></p></section>
      <section class="history-panel" aria-labelledby="history-title"><div class="panel-heading"><div><span class="panel-number">D</span><${panelHeading} id="history-title">Recent notes</${panelHeading}></div><span id="history-count" class="readout">0 NOTES</span></div><ol id="history-list" class="history-list" tabindex="0" aria-label="Scrollable recent note history"><li class="empty">Played notes will appear here.</li></ol><div class="history-actions"><button class="text-button" id="clear-history" type="button">Clear history</button><button class="text-button" id="export-csv" type="button">Export CSV</button><button class="text-button" id="export-json" type="button">Export JSON</button><label class="text-button import-label">Import JSON<input id="import-json" type="file" accept="application/json"></label></div></section>
    </div>
  </${tag}>`;
}

function pianoKeys(): string {
  const white = [60,62,64,65,67,69,71,72];
  const black = [61,63,66,68,70];
  const key=(midi:number,kind:'white'|'black')=>{const note=NOTE_NAMES[midi%12],shortcut=Object.keys(keyboardMap).find(name=>keyboardMap[name]===midi)?.toUpperCase()??'';return `<button class="piano-key ${kind}${kind==='black'?` black-${midi}`:''}" data-midi="${midi}" type="button" aria-label="Play ${note}"><span>${note}</span><small aria-hidden="true">${shortcut}</small></button>`;};
  return [...white.map(midi=>key(midi,'white')),...black.map(midi=>key(midi,'black'))].join('');
}

function textPage(kind: 'privacy'|'terms'): string {
  const privacy = `<p class="section-code">LOCAL FIRST / PRIVACY</p><h1 tabindex="-1">Your practice stays on this device</h1><p class="lede">Theory Playalong Sidecar has no account, ads, analytics, or remote storage.</p><section><h2>What the app stores</h2><p>Your key, tempo, and recent note history are stored in this browser with IndexedDB. Demo activity uses memory only and is discarded when you leave.</p><h2>What the app does not send</h2><p>Audio files, MIDI messages, and note history are not uploaded. The app makes no third-party runtime requests.</p><h2>Your controls</h2><p>Use the history buttons to export your notes. Clear history removes saved notes from this browser.</p><h2>Contact</h2><p>For privacy questions, email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></section>`;
  const terms = `<p class="section-code">TERMS / PLAIN LANGUAGE</p><h1 tabindex="-1">Use this practice tool</h1><p class="lede">These terms apply when you use Theory Playalong Sidecar.</p><section><h2>The service</h2><p>The app is free. It shows note relationships for reference and does not promise learning results.</p><h2>Your files</h2><p>You keep ownership of files you open. Only use audio that you have permission to use.</p><h2>Availability</h2><p>The app is provided as available, without warranties. MIDI support depends on your browser and device.</p><h2>Contact</h2><p>For terms questions, email <a href="mailto:hello@sociobot.in">hello@sociobot.in</a>.</p></section>`;
  return shell(`<main id="main" class="text-page">${kind==='privacy'?privacy:terms}</main>`);
}

function notFound(): string {
  return shell(`<main id="main" class="not-found"><p class="pixel-row" aria-hidden="true">□ □ ■ □</p><h1 tabindex="-1">This bar is empty</h1><p>That page is not part of the arrangement.</p><a class="button primary" href="/" data-link>Return to Theory Playalong Sidecar</a></main>`);
}

function setMetadata(path: string): void {
  const data: Record<string,[string,string]> = {
    '/':['Theory Playalong Sidecar — play with a backing track','Play a MIDI keyboard beside any backing track and see each note in the key you choose.'],
    '/demo':['Demo — Theory Playalong Sidecar','Try the sample groove and see notes inside C major.'],
    '/privacy':['Privacy — Theory Playalong Sidecar','Read what Theory Playalong Sidecar stores in your browser.'],
    '/terms':['Terms — Theory Playalong Sidecar','Read the terms for using Theory Playalong Sidecar.']
  };
  const [title,description] = data[path] ?? ['Theory Playalong Sidecar — page not found','Return to Theory Playalong Sidecar.'];
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = title;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `${CANONICAL}${path}`;
}

async function render(path = location.pathname): Promise<void> {
  cleanup.forEach(fn=>fn()); cleanup=[];
  const isDemo = path === '/demo' || (path === '/' && new URLSearchParams(location.search).get('demo') === '1');
  const route = isDemo ? '/demo' : path;
  if (route === '/') app.innerHTML = landing();
  else if (route === '/demo') app.innerHTML = shell(workspace(true), true);
  else if (route === '/privacy') app.innerHTML = textPage('privacy');
  else if (route === '/terms') app.innerHTML = textPage('terms');
  else app.innerHTML = notFound();
  setMetadata(route);
  bindNavigation();
  if (route === '/' || route === '/demo') await bindWorkspace(route === '/demo');
  if (route === '/demo') bindDemoControls();
  routeAnnouncer = document.querySelector('#route-status');
  const h1 = document.querySelector<HTMLHeadingElement>('h1');
  if (routeAnnouncer && h1) routeAnnouncer.textContent = h1.textContent;
}

function bindNavigation(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach(link=>link.addEventListener('click',event=>{
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState({},'',link.href);
    render(location.pathname).then(()=>{window.scrollTo(0,0);document.querySelector<HTMLHeadingElement>('h1')?.focus();});
  }));
}

function bindDemoControls(): void {
  document.querySelector('#reset-demo')?.addEventListener('click',()=>render('/demo').then(()=>announce('Demo reset.')));
}

function announce(message: string): void {
  const el = document.querySelector<HTMLElement>('#app-status');
  if (!el) return;
  el.textContent=message; el.hidden=false;
  window.setTimeout(()=>{el.hidden=true;},3000);
}

function createSampleWav(): Blob {
  const rate=22050,duration=8,samples=rate*duration,channels=1,bytes=2;
  const buffer=new ArrayBuffer(44+samples*bytes); const view=new DataView(buffer);
  const write=(offset:number,value:string)=>[...value].forEach((char,index)=>view.setUint8(offset+index,char.charCodeAt(0)));
  write(0,'RIFF');view.setUint32(4,36+samples*bytes,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,rate,true);view.setUint32(28,rate*bytes,true);view.setUint16(32,bytes,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,samples*bytes,true);
  const freqs=[130.81,164.81,196,220];
  for(let i=0;i<samples;i++){const t=i/rate,step=Math.floor(t/0.625)%8,env=Math.exp(-((t%0.625)*4));const bass=Math.sin(2*Math.PI*freqs[step%4]*t)*0.18;const click=Math.sin(2*Math.PI*880*t)*env*0.06;view.setInt16(44+i*2,Math.max(-1,Math.min(1,bass+click))*32767,true);}
  return new Blob([buffer],{type:'audio/wav'});
}

async function bindWorkspace(isDemo: boolean): Promise<void> {
  const keySelect=document.querySelector<HTMLSelectElement>('#key-select')!;
  const modeSelect=document.querySelector<HTMLSelectElement>('#mode-select')!;
  const bpmInput=document.querySelector<HTMLInputElement>('#bpm')!;
  const audio=document.querySelector<HTMLAudioElement>('#audio-player')!;
  const file=document.querySelector<HTMLInputElement>('#audio-file')!;
  let state:SavedState={keyName:'C',mode:'major',bpm:96,history:isDemo?structuredClone(demoHistory):[]};
  if(!isDemo){try{state=(await loadState())??state;}catch{announce('Saved settings could not load. You can still play.');}}
  keySelect.value=state.keyName;modeSelect.value=state.mode;bpmInput.value=String(state.bpm);
  let audioUrl='';
  if(isDemo){audioUrl=URL.createObjectURL(createSampleWav());audio.src=audioUrl;audio.loop=true;cleanup.push(()=>URL.revokeObjectURL(audioUrl));}
  const persist=()=>{if(!isDemo)saveState(state).catch(()=>announce('Changes could not be saved. Your browser may block storage.'));};
  const renderContext=()=>{
    const scale=scalePitches(state.keyName,state.mode as Mode);
    document.querySelector('#scale-summary')!.textContent=`${state.keyName} ${state.mode}: ${scale.map(pc=>NOTE_NAMES[pc]).join(' · ')}`;
    document.querySelectorAll<HTMLElement>('[data-midi]').forEach(key=>{const pc=Number(key.dataset.midi)%12;const index=scale.indexOf(pc);key.classList.toggle('in-scale',index>=0);key.dataset.degree=index>=0?String(index+1):'';});
  };
  const renderHistory=()=>{
    const list=document.querySelector<HTMLOListElement>('#history-list')!;
    document.querySelector('#history-count')!.textContent=`${state.history.length} ${state.history.length===1?'NOTE':'NOTES'}`;
    list.innerHTML=state.history.length?state.history.slice(0,24).map(note=>`<li class="${note.inKey?'inside':'outside'}"><strong>${note.name}</strong><span>${note.inKey?'◆ in key':'◇ outside key'}</span><small>${note.keyName}</small></li>`).join(''):'<li class="empty">Played notes will appear here.</li>';
  };
  const setKey=()=>{state.keyName=keySelect.value;state.mode=modeSelect.value as Mode;renderContext();persist();};
  keySelect.addEventListener('change',setKey);modeSelect.addEventListener('change',setKey);
  bpmInput.addEventListener('change',()=>{state.bpm=Math.min(240,Math.max(30,Number(bpmInput.value)||96));bpmInput.value=String(state.bpm);persist();});
  let synth:AudioContext|null=null;
  const sound=(midi:number,notes=[midi])=>{synth??=new AudioContext();const now=synth.currentTime;notes.forEach((note,index)=>{const osc=synth!.createOscillator(),gain=synth!.createGain();osc.type=index?'triangle':'square';osc.frequency.value=frequencyForMidi(note);gain.gain.setValueAtTime(0.0001,now);gain.gain.exponentialRampToValueAtTime(index?0.025:0.05,now+0.01);gain.gain.exponentialRampToValueAtTime(0.0001,now+0.32);osc.connect(gain).connect(synth!.destination);osc.start(now);osc.stop(now+0.34);});};
  const playNote=(midi:number,makeSound=true)=>{
    const context=noteContext(midi,state.keyName,state.mode as Mode);
    if(makeSound)sound(midi);
    document.querySelector('#note-name')!.textContent=context.name;
    document.querySelector('#note-fit')!.textContent=context.inKey?`Degree ${context.degree} · in ${state.keyName} ${state.mode}`:`Outside ${state.keyName} ${state.mode} · try where it leads`;
    const live=document.querySelector('#live-note')!;live.classList.toggle('outside',!context.inKey);live.classList.add('pulse');window.setTimeout(()=>live.classList.remove('pulse'),180);
    document.querySelectorAll('.piano-key').forEach(key=>key.classList.toggle('playing',Number((key as HTMLElement).dataset.midi)%12===context.pitchClass));
    const map=document.querySelector('#chord-map')!;
    map.innerHTML=context.chords.length?context.chords.map(chord=>`<button type="button" data-chord="${chord.notes.join(',')}" title="Play ${chord.symbol}"><strong>${chord.symbol}</strong><span>${chord.rootName}</span></button>`).join(''):'<p>No matching three-note chord includes this note.</p>';
    map.querySelectorAll<HTMLButtonElement>('[data-chord]').forEach(button=>button.addEventListener('click',()=>sound(60,button.dataset.chord!.split(',').map(pc=>60+Number(pc)))));
    state.history.unshift({id:crypto.randomUUID(),midi,name:context.name,inKey:context.inKey,keyName:`${state.keyName} ${state.mode}`,playedAt:new Date().toISOString()});state.history=state.history.slice(0,64);renderHistory();persist();
  };
  document.querySelectorAll<HTMLButtonElement>('.piano-key').forEach(key=>key.addEventListener('click',()=>playNote(Number(key.dataset.midi))));
  const down=(event:KeyboardEvent)=>{if(event.repeat||event.target instanceof HTMLInputElement||event.target instanceof HTMLSelectElement)return;const note=keyboardMap[event.key.toLowerCase()];if(note!==undefined){event.preventDefault();playNote(note);}};
  window.addEventListener('keydown',down);cleanup.push(()=>window.removeEventListener('keydown',down));
  document.querySelector('#connect-midi')!.addEventListener('click',async()=>{
    const status=document.querySelector('#midi-status')!,help=document.querySelector('#midi-help')!;
    const nav=navigator as Navigator & {requestMIDIAccess?:()=>Promise<{inputs:Map<string,{onmidimessage:((event:{data:Uint8Array})=>void)|null}>}>};
    if(!nav.requestMIDIAccess){status.textContent='MIDI UNAVAILABLE';help.textContent='MIDI is not available here. Use the screen keys or A–K.';return;}
    status.textContent='MIDI CONNECTING';
    try{const access=await nav.requestMIDIAccess();let count=0;access.inputs.forEach(input=>{count++;input.onmidimessage=event=>{const data=event.data;if(!data)return;const [command,note,velocity]=data;if((command&0xf0)===0x90&&velocity>0)playNote(note,false);};});status.textContent=count?`${count} MIDI INPUT${count===1?'':'S'}`:'NO MIDI INPUTS';help.textContent=count?'Play your keyboard. Notes will appear below.':'Connect a MIDI keyboard, then press Connect MIDI again.';}catch{status.textContent='MIDI PERMISSION BLOCKED';help.textContent='MIDI access was blocked. Allow it in browser settings, then try again.';}
  });
  file.addEventListener('change',()=>{const chosen=file.files?.[0];if(!chosen)return;if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(chosen);audio.src=audioUrl;audio.loop=false;document.querySelector('#audio-status')!.textContent='LOCAL AUDIO READY';announce(`${chosen.name} is ready.`);});
  document.querySelector('#sample-play')?.addEventListener('click',()=>{if(audio.paused){audio.play().then(()=>{document.querySelector('#sample-play')!.textContent='Pause sample groove';document.querySelector('#audio-status')!.textContent='SAMPLE PLAYING';}).catch(()=>announce('The sample could not start. Press play in the audio controls.'));}else{audio.pause();document.querySelector('#sample-play')!.textContent='Play sample groove';document.querySelector('#audio-status')!.textContent='SAMPLE PAUSED';}});
  const beatRail=document.querySelector<HTMLElement>('#beat-rail')!;
  let beatFrame:number|null=null;
  let furthestBeat=0;
  let currentBeat=-1;
  const beat=()=>{
    const index=Math.floor(audio.currentTime/(60/state.bpm))%8;
    if(index===currentBeat)return;
    currentBeat=index;
    furthestBeat=Math.max(furthestBeat,index);
    beatRail.querySelectorAll('i').forEach((dot,i)=>dot.classList.toggle('active',i===index));
    document.querySelector('#beat-text')!.textContent=`Beat ${index+1} of 8`;
    beatRail.setAttribute('aria-label',`Eight-beat marker; playback has reached beat ${furthestBeat+1}`);
    beatRail.dataset.highestBeat=String(furthestBeat+1);
  };
  const stopBeatLoop=()=>{if(beatFrame!==null)cancelAnimationFrame(beatFrame);beatFrame=null;};
  const runBeatLoop=()=>{stopBeatLoop();const frame=()=>{beat();if(!audio.paused&&!audio.ended)beatFrame=requestAnimationFrame(frame);else beatFrame=null;};frame();};
  audio.addEventListener('play',runBeatLoop);
  audio.addEventListener('pause',stopBeatLoop);
  audio.addEventListener('ended',stopBeatLoop);
  audio.addEventListener('seeked',beat);
  cleanup.push(stopBeatLoop);
  document.querySelector('#clear-history')!.addEventListener('click',()=>{if(!confirm(`Clear ${state.history.length} recent notes?`))return;state.history=[];renderHistory();persist();announce('Note history cleared.');});
  document.querySelector('#export-csv')!.addEventListener('click',()=>download('theory-sidecar-history.csv',`note,in_key,key,played_at\n${state.history.map(n=>`${n.name},${n.inKey},${n.keyName},${n.playedAt}`).join('\n')}`,'text/csv'));
  document.querySelector('#export-json')!.addEventListener('click',()=>download('theory-sidecar-history.json',JSON.stringify({version:1,history:state.history},null,2),'application/json'));
  document.querySelector<HTMLInputElement>('#import-json')!.addEventListener('change',async event=>{try{const imported=JSON.parse(await (event.target as HTMLInputElement).files![0].text()) as {history:HistoryNote[]};if(!Array.isArray(imported.history))throw new Error();state.history=imported.history.slice(0,64);renderHistory();persist();announce('Note history imported.');}catch{announce('That JSON file did not contain note history. Choose an exported Sidecar file.');}});
  renderContext();renderHistory();
}

function download(name:string,contents:string,type:string):void{const url=URL.createObjectURL(new Blob([contents],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),0);}

window.addEventListener('popstate',()=>render(location.pathname).then(()=>document.querySelector<HTMLHeadingElement>('h1')?.focus()));
window.addEventListener('online',()=>announce('You are back online.'));
window.addEventListener('offline',()=>announce('You are offline. The loaded sidecar still works.'));

render().then(()=>{
  if('serviceWorker'in navigator){
    const hadController=Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.register('/sw.js').then(registration=>registration.addEventListener('updatefound',()=>{
      const worker=registration.installing;
      worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&hadController)announce('An update is ready. Reload to use it.');});
    })).catch(()=>announce('Offline setup could not finish. Try reloading.'));
  }
});
