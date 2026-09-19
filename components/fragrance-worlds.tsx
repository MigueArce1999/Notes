'use client';
import {useState} from 'react';
import {ArrowUpRight,Plus,Minus} from 'lucide-react';
import {Collapsible,CollapsibleTrigger,CollapsibleContent} from '@/components/ui/collapsible';
const worlds=[
{name:'LIGHT',tag:'Fresca. Limpia. Luminosa.',intro:'Para los días que se sienten como un nuevo comienzo.',description:'Una presencia ligera y luminosa. En Nöte reúne fragancias que evocan frescura, limpieza y libertad, para acompañarte sin dominar el momento.',moments:'Día a día · Trabajo · Aire libre',min:2,max:3,scale:'Sutil a equilibrada'},
{name:'ICON',tag:'Elegante. Equilibrada. Memorable.',intro:'La confianza de estar exactamente donde quieres.',description:'Tu firma personal: versátil, cuidada y con carácter. En Nöte conecta la delicadeza con la sofisticación, desde una presencia sutil hasta una más intensa.',moments:'Trabajo · Citas · Eventos',min:2,max:4,scale:'Sutil a intensa'},
{name:'BOLD',tag:'Intensa. Dulce. Seductora.',intro:'Para esos momentos en los que quieres dejar huella.',description:'Una presencia profunda y expresiva. En Nöte reúne fragancias asociadas con dulzura, sensualidad y carácter, para los momentos en que buscas hacerte sentir.',moments:'Tarde · Noche · Ocasiones especiales',min:4,max:5,scale:'Intensa a muy intensa'}
];
function WorldCard({world,index,onDiscover}:{world:typeof worlds[number];index:number;onDiscover:()=>void}){
const [hovered,H]=useState(false),[focused,F]=useState(false),[pinned,P]=useState(false);const open=hovered||focused||pinned;
return <Collapsible className={`scent-world world-${index}`} open={open} onOpenChange={P} onPointerEnter={e=>{if(e.pointerType==='mouse')H(true);}} onPointerLeave={()=>H(false)} onFocusCapture={e=>F((e.target as HTMLElement).matches(':focus-visible'))} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))F(false);}} onKeyDown={e=>{if(e.key==='Escape'){H(false);F(false);P(false);}}}>
<CollapsibleTrigger className="scent-trigger" aria-label={`${world.name}: conocer este universo`}><span className="scent-number">0{index+1}</span><span className="scent-toggle" aria-hidden="true">{open?<Minus size={20}/>:<Plus size={20}/>}</span><span className="scent-orbit" aria-hidden="true"/><h3>{world.name}</h3><span className="scent-tag">{world.tag}</span><span className="scent-intro">{world.intro}</span></CollapsibleTrigger>
<div className="scent-intensity"><div><span>INTENSIDAD</span><span>Hasta {world.max}/5</span></div><span className="scent-dots" role="img" aria-label={`Intensidad de ${world.min} a ${world.max} sobre 5, según la fragancia`}>{[1,2,3,4,5].map(n=><i key={n} className={n<=world.max?'filled':''} style={{transitionDelay:`${n*45}ms`}}/>)}</span><p>{world.min}–{world.max} / 5 · {world.scale}</p></div>
<CollapsibleContent forceMount className="scent-details" aria-hidden={!open} inert={!open}><div><p>{world.description}</p><span className="scent-moments">{world.moments}</span><button className="scent-discover" onClick={onDiscover}>Descubrir mi esencia <ArrowUpRight size={17}/></button></div></CollapsibleContent>
</Collapsible>;
}
export function FragranceWorlds({onDiscover}:{onDiscover:()=>void}){return <><div className="scent-grid">{worlds.map((world,i)=><WorldCard key={world.name} world={world} index={i} onDiscover={onDiscover}/>)}</div><p className="scent-scale-note">1 Muy sutil · 2 Sutil · 3 Equilibrada · 4 Intensa · 5 Muy intensa.<br/>La intensidad varía según la fragancia. LIGHT, ICON y BOLD son los universos de Nöte.</p></>;}
