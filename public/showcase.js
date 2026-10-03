import * as THREE from './vendor/three.module.js';

const root = document.querySelector('.showcase');
if (root) {
  const projects = [
    {name:'Ricardo Lara',category:'SERVIÇOS · LANDING PAGE',description:'Uma presença digital para serviços de elétrica e hidráulica, com caminho direto para solicitar orçamento.',stack:'HTML · CSS · JavaScript · GSAP',image:'assets/ricardo-lara-preview.jpg',alt:'Prévia do site Ricardo Lara',url:'https://ricardolara.vercel.app/'},
    {name:'Exercícios de Front-end',category:'ESTUDOS · FERRAMENTAS WEB',description:'Três exercícios interativos: reajuste salarial, transporte fretado e cálculo de horas extras.',stack:'Front-end · Cálculos interativos',image:'assets/exercicios-front-end-preview.jpg',alt:'Página com três exercícios de front-end de Joaquim Neto',url:'https://projetos-three-sooty.vercel.app/index.html'},
    {name:'Peixaria Dinho',category:'COMÉRCIO · CATÁLOGO',description:'Um catálogo de peixes e frutos do mar, com produtos em destaque e navegação para contato.',stack:'Next.js · React · TypeScript',image:'assets/peixaria-dinho-preview.jpg',alt:'Prévia do site Peixaria Dinho',url:'https://peixaria-dinho.vercel.app/'},
    {name:'Portal Acácio Piedade',category:'EDUCAÇÃO · PORTAL',description:'Atividades para crianças em fase de desenvolvimento, com números e formação de palavras. Explore também as telas de entrada e recuperação de senha.',stack:'Experiência educativa',image:'assets/portal-palavras.png',alt:'Atividade de formação de palavras do Portal Acácio Piedade',url:'https://portal-acacio-piedade-topaz.vercel.app/'},
    {name:'Chatbot com IA',category:'CONCEITO · CHATBOT',description:'Protótipo de assistente para explorar uma experiência de atendimento digital em uma loja de celulares.',note:'Projeto hipotético e independente. Não é um canal oficial da Binho Celulares.',stack:'Conceito · IA',image:'assets/binho-ia.png',alt:'Prévia do protótipo de chatbot com IA',url:'https://chat-bot-front-beta.vercel.app/'},
    {name:'Geo Mundo',category:'JOGO · GEOGRAFIA',description:'Jogo desenvolvido para o TCC que estimula o conhecimento de lugares, vegetação, clima e fusos horários.',stack:'Jogo educativo · TCC',image:'assets/geo-mundo.png',alt:'Prévia de uma partida do Geo Mundo',url:'https://geo-mundo.vercel.app/'}
  ];
  const portalPreviews = [
    {image:'assets/portal-palavras.png',alt:'Atividade de formação de palavras no Portal Acácio Piedade'},
    {image:'assets/portal-numeros.png',alt:'Atividade de reconhecimento de números no Portal Acácio Piedade'},
    {image:'assets/portal-atividades.png',alt:'Seleção de atividades do Portal Acácio Piedade'},
    {image:'assets/portal-acacio-login.jpg',alt:'Tela inicial de entrada no Portal Acácio Piedade'},
    {image:'assets/portal-acacio-recuperacao.jpg',alt:'Tela de recuperação de senha do Portal Acácio Piedade'}
  ];
  const tabs = [...root.querySelectorAll('.showcase-tab')];
  const category = document.getElementById('showcase-category');
  const name = document.getElementById('showcase-name');
  const description = document.getElementById('showcase-description');
  const note = document.getElementById('showcase-note');
  const stack = document.getElementById('showcase-stack');
  const link = document.getElementById('showcase-link');
  const fallback = document.getElementById('showcase-fallback');
  const label = document.getElementById('showcase-visual-label');
  const gallery = document.getElementById('showcase-gallery');
  const previewButtons = [...gallery.querySelectorAll('[data-preview]')];
  const visual = root.querySelector('.showcase-visual');
  const canvas = document.getElementById('showcase-canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let selectedPortalPreview = 0;
  let renderSelection = () => {};
  let renderPreview = () => {};

  function select(index) {
    if (!projects[index]) return;
    selected = index;
    const project = projects[index];
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === index);
      tab.setAttribute('aria-pressed', String(i === index));
    });
    category.textContent = project.category;
    name.textContent = project.name;
    description.textContent = project.description;
    note.hidden = !project.note;
    note.textContent = project.note || '';
    stack.textContent = project.stack;
    link.href = project.url;
    link.setAttribute('aria-label', `Abrir ${project.name} em nova aba`);
    label.textContent = `${String(index + 1).padStart(2, '0')} / ${project.name.toUpperCase()}`;
    gallery.hidden = index !== 3;
    const preview = index === 3 ? portalPreviews[selectedPortalPreview] : project;
    fallback.src = preview.image;
    fallback.alt = preview.alt;
    renderSelection();
  }
  tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
  previewButtons.forEach((button, index) => button.addEventListener('click', () => {
    selectedPortalPreview = index;
    previewButtons.forEach((item, i) => {
      item.classList.toggle('is-active', i === index);
      item.setAttribute('aria-pressed', String(i === index));
    });
    fallback.src = portalPreviews[index].image;
    fallback.alt = portalPreviews[index].alt;
    renderPreview(3, portalPreviews[index].image);
  }));

  // A galeria é progressiva: os botões, as imagens e os links funcionam sem GPU.
  if (!reduced.matches && innerWidth >= 700) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.3));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, .1, 50);
      camera.position.set(0, 1.0, 7.5);
      camera.lookAt(0, 0, 0);
      const grid = new THREE.GridHelper(18, 18, 0x654c27, 0x272420);
      grid.position.set(0,-1.55,-1);
      scene.add(grid);
      const groups = [];
      const faces = [];
      const disposables = [grid.geometry, ...(Array.isArray(grid.material) ? grid.material : [grid.material])];
      const textureLoader = new THREE.TextureLoader();
      const textures = new Map();
      function loadPreview(index, path) {
        const {group, face, material} = faces[index];
        group.userData.activeImage = path;
        const apply = texture => {
          if (group.userData.activeImage !== path) return;
          const aspect = texture.image.width / texture.image.height;
          const frameAspect = 2.64 / 1.77;
          face.scale.set(1, 1, 1);
          if (aspect > frameAspect) face.scale.y = frameAspect / aspect;
          else face.scale.x = aspect / frameAspect;
          material.map = texture;
          material.needsUpdate = true;
          draw();
        };
        const cached = textures.get(path);
        if (cached) {
          if (cached.texture) apply(cached.texture);
          else cached.callbacks.push(apply);
          return;
        }
        const entry = {texture: null, callbacks: [apply]};
        textures.set(path, entry);
        textureLoader.load(path, texture => {
          texture.colorSpace = THREE.SRGBColorSpace;
          entry.texture = texture;
          disposables.push(texture);
          entry.callbacks.forEach(callback => callback(texture));
          entry.callbacks.length = 0;
        }, undefined, () => textures.delete(path));
      }
      projects.forEach((project, index) => {
        const group = new THREE.Group();
        group.userData.project = index;
        const frameGeometry = new THREE.BoxGeometry(2.8,1.95,.075);
        const frameMaterial = new THREE.MeshBasicMaterial({color:0x4a3b28});
        const frame = new THREE.Mesh(frameGeometry,frameMaterial);
        group.add(frame);
        const faceGeometry = new THREE.PlaneGeometry(2.64,1.77);
        const faceMaterial = new THREE.MeshBasicMaterial({color:0x151515,side:THREE.DoubleSide});
        const face = new THREE.Mesh(faceGeometry,faceMaterial);
        face.position.z=.043;
        group.add(face);
        const stripGeometry = new THREE.BoxGeometry(2.8,.035,.09);
        const stripMaterial = new THREE.MeshBasicMaterial({color:0xd99a2b});
        const strip = new THREE.Mesh(stripGeometry,stripMaterial);
        strip.position.y=-1.0;
        group.add(strip);
        disposables.push(frameGeometry,frameMaterial,faceGeometry,faceMaterial,stripGeometry,stripMaterial);
        scene.add(group);
        groups.push(group);
        faces.push({group,face,material:faceMaterial});
        loadPreview(index, project.image);
      });
      renderPreview = loadPreview;
      let visible = false, raf = 0, last = 0, mouseX = 0, mouseY = 0;
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      function draw(){renderer.render(scene,camera);}
      function layout(animate=true){
        groups.forEach((group,i)=>{
          let distance=(i-selected+projects.length)%projects.length;
          if(distance>projects.length/2)distance-=projects.length;
          if(distance===projects.length/2 && i<selected)distance=-distance;
          const depth=Math.abs(distance);
          const chosen=depth===0;
          const to={x:distance*2.88,y:chosen?.12:-.13,z:chosen?1.05:-.55-depth*.65};
          const rotY=-distance*.24;
          const scale=chosen ? 1.17 : depth===1 ? .82 : depth===2 ? .62 : .45;
          if(animate&&window.gsap){
            window.gsap.to(group.position,{...to,duration:.78,ease:'power3.inOut',overwrite:true,onUpdate:draw});
            window.gsap.to(group.rotation,{y:rotY,duration:.78,ease:'power3.inOut',overwrite:true,onUpdate:draw});
            window.gsap.to(group.scale,{x:scale,y:scale,z:scale,duration:.78,ease:'power3.inOut',overwrite:true,onUpdate:draw});
          }else{group.position.set(to.x,to.y,to.z);group.rotation.y=rotY;group.scale.setScalar(scale);}
        });
        draw();
      }
      renderSelection=()=>layout(!reduced.matches);
      function resize(){
        const width=visual.clientWidth,height=visual.clientHeight;
        if(!width||!height)return;
        renderer.setSize(width,height,false);
        camera.aspect=width/height;
        camera.updateProjectionMatrix();
        draw();
      }
      function frame(time){
        if(!visible||document.hidden)return;
        raf=requestAnimationFrame(frame);
        if(time-last<1000/30)return;
        last=time;
        camera.position.x+=(mouseX*.22-camera.position.x)*.055;
        camera.position.y+=(1+mouseY*.13-camera.position.y)*.055;
        camera.lookAt(0,0,0);
        draw();
      }
      function hit(event){
        const rect=canvas.getBoundingClientRect();
        pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
        raycaster.setFromCamera(pointer,camera);
        const mesh=raycaster.intersectObjects(groups,true)[0]?.object;
        let node=mesh;
        while(node&&!Number.isInteger(node.userData.project))node=node.parent;
        return node?.userData.project;
      }
      canvas.addEventListener('pointermove',event=>{
        const rect=canvas.getBoundingClientRect();
        mouseX=(event.clientX-rect.left)/rect.width*2-1;
        mouseY=1-(event.clientY-rect.top)/rect.height*2;
        canvas.style.cursor=Number.isInteger(hit(event))?'pointer':'default';
      },{passive:true});
      canvas.addEventListener('pointerleave',()=>{mouseX=mouseY=0;canvas.style.cursor='default';});
      canvas.addEventListener('click',event=>{const index=hit(event);if(Number.isInteger(index))select(index);});
      const resizeObserver=new ResizeObserver(resize);
      resizeObserver.observe(visual);
      const observer=new IntersectionObserver(entries=>{
        visible=entries[0].isIntersecting;
        cancelAnimationFrame(raf);
        if(visible&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(frame);
      },{rootMargin:'100px'});
      observer.observe(root);
      document.addEventListener('visibilitychange',()=>{
        cancelAnimationFrame(raf);
        if(visible&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(frame);
      });
      reduced.addEventListener('change',()=>{
        cancelAnimationFrame(raf);
        visual.classList.toggle('is-webgl',!reduced.matches);
        if(visible&&!reduced.matches&&!document.hidden)raf=requestAnimationFrame(frame);
      });
      canvas.addEventListener('webglcontextlost',event=>{
        event.preventDefault();visible=false;cancelAnimationFrame(raf);visual.classList.remove('is-webgl');
      });
      window.addEventListener('pagehide',event=>{
        cancelAnimationFrame(raf);observer.disconnect();resizeObserver.disconnect();
        if(!event.persisted){disposables.forEach(item=>item.dispose());renderer.dispose();}
      },{once:true});
      layout(false);resize();visual.classList.add('is-webgl');
    }catch(error){
      renderer?.dispose();
      console.warn('Galeria 3D indisponível; a navegação por projetos continua acessível.',error);
    }
  }
}
