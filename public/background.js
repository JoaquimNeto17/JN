import * as THREE from './vendor/three.module.js';

const canvas = document.getElementById('ambient-canvas');
const toggle = document.getElementById('background-toggle');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  initialize();
} catch (error) {
  renderer?.dispose();canvas.style.display='none';toggle.hidden=true;
  console.warn('The animated background is unavailable. The page remains usable.',error);
}

function initialize() {
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.25));
  renderer.setClearColor(0x050505,0);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(40,1,.1,70);
  camera.position.set(0,0,22);
  // Linhas de contorno longas com detalhes pontuais em cobre.
  const positions=[],accents=[];
  const rows=38,segments=132;
  for(let row=0;row<rows;row++){
    const y=(row/(rows-1)-.5)*20;
    const accent=row%8===0?1:0;
    for(let segment=0;segment<segments;segment++){
      const x1=(segment/segments-.5)*38;
      const x2=((segment+1)/segments-.5)*38;
      positions.push(x1,y,0,x2,y,0);
      accents.push(accent,accent);
    }
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('aAccent',new THREE.Float32BufferAttribute(accents,1));
  const uniforms={uTime:{value:0},uPointer:{value:new THREE.Vector2(0,0)}};
  const material=new THREE.ShaderMaterial({
    uniforms,transparent:true,depthWrite:false,
    vertexShader:`
      uniform float uTime;
      uniform vec2 uPointer;
      attribute float aAccent;
      varying float vOpacity;
      varying float vAccent;
      void main(){
        vec3 p=position;
        float waves=sin(p.x*.43+p.y*.14+uTime*.19)*.48;
        waves+=sin(length(vec2(p.x*.61,p.y*.88))*.87-uTime*.13)*.50;
        waves+=sin((p.x+p.y)*.21-uTime*.10)*.18;
        p.y+=waves;
        p.z=sin(p.x*.19+p.y*.28+uTime*.12)*.55;
        float d=distance(p.xy,uPointer*vec2(7.0,4.0));
        p.y+=.24*exp(-d*.24)*sin(d*.9-uTime*.38);
        float fade=1.0-smoothstep(8.0,19.0,length(vec2(p.x*.68,p.y)));
        vOpacity=(.26+.18*aAccent)*fade;
        vAccent=aAccent;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }`,
    fragmentShader:`precision mediump float;
      varying float vOpacity;
      varying float vAccent;
      void main(){
        vec3 graphite=vec3(.28,.28,.30);
        vec3 amber=vec3(.85,.60,.17);
        gl_FragColor=vec4(mix(graphite,amber,vAccent),vOpacity*.72);
      }`
  });
  const contours=new THREE.LineSegments(geometry,material);
  contours.rotation.z=-.13;contours.position.set(2,-1,-3);contours.frustumCulled=false;
  scene.add(contours);
  const target=new THREE.Vector2(0,0);
  let paused=false,available=true,lastTime=0,lastFrame=0;
  function render(){renderer.render(scene,camera);}
  function frame(time){
    if(time-lastFrame<1000/30)return;
    const dt=lastTime?Math.min((time-lastTime)/1000,.07):0;
    lastTime=time;lastFrame=time;uniforms.uTime.value+=dt;
    uniforms.uPointer.value.lerp(target,1-Math.exp(-dt*2));render();
  }
  function sync(){
    lastTime=0;lastFrame=0;
    const still=paused||reduced.matches;
    renderer.setAnimationLoop(available&&!still&&!document.hidden?frame:null);
    toggle.textContent=reduced.matches?'Movimento reduzido':paused?'Retomar animação do fundo':'Pausar animação do fundo';
    toggle.setAttribute('aria-pressed',String(still));toggle.disabled=reduced.matches;
    if(available)render();
  }
  function resize(){
    renderer.setSize(innerWidth,innerHeight,false);
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
    contours.position.x=innerWidth<760?3:2;
    if(available)render();
  }
  window.addEventListener('pointermove',event=>{
    if(reduced.matches||paused||event.pointerType!=='mouse')return;
    target.set(event.clientX/innerWidth*2-1,1-event.clientY/innerHeight*2);
  },{passive:true});
  toggle.addEventListener('click',()=>{paused=!paused;sync();});
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('resize',resize,{passive:true});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();available=false;renderer.setAnimationLoop(null);canvas.style.display='none';toggle.hidden=true;});
  canvas.addEventListener('webglcontextrestored',()=>{available=true;canvas.style.display='block';toggle.hidden=false;resize();sync();});
  window.addEventListener('pagehide',event=>{renderer.setAnimationLoop(null);if(!event.persisted){geometry.dispose();material.dispose();renderer.dispose();}});
  window.addEventListener('pageshow',event=>{if(event.persisted)sync();});
  toggle.hidden=false;resize();sync();
}
