import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const expectedHash="aecc11cf52868fabf466a3e15efdba92c61c1e93aac5193a2df19661173a9a10";
const adminEmail="miguelarcemercado08@gmail.com";
const allowedOrigins=new Set([
  "https://miguearce1999.github.io",
  "https://note-esencia.miguelarcemercado08.chatgpt.site",
]);
const encoder=new TextEncoder();
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,"0")).join("");

function cors(req:Request){const origin=req.headers.get("origin")||"";return {
  "access-control-allow-origin":allowedOrigins.has(origin)?origin:"https://miguearce1999.github.io",
  "access-control-allow-headers":"authorization, apikey, content-type, x-note-bridge-token",
  "access-control-allow-methods":"POST, OPTIONS","vary":"Origin",
};}
const json=(req:Request,body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors(req),"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});

async function authorizedLegacy(req:Request){
  const supplied=req.headers.get("x-note-bridge-token")||"";
  if(!supplied)return false;
  const digest=hex(await crypto.subtle.digest("SHA-256",encoder.encode(supplied)));
  if(digest.length!==expectedHash.length)return false;
  let mismatch=0;for(let i=0;i<digest.length;i++)mismatch|=digest.charCodeAt(i)^expectedHash.charCodeAt(i);
  return mismatch===0;
}
async function authorizedAdmin(req:Request){
  const authorization=req.headers.get("authorization")||"";
  const base=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY");
  if(!base||!anon||!authorization.startsWith("Bearer "))return false;
  const response=await fetch(`${base}/auth/v1/user`,{headers:{apikey:anon,authorization}});
  if(!response.ok)return false;
  const user=await response.json();
  return typeof user.email==="string"&&user.email.toLowerCase()===adminEmail;
}
async function rpc(name:string,body:Record<string,unknown>){
  const base=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!base||!key)throw new Error("Supabase server credentials unavailable");
  const response=await fetch(`${base}/rest/v1/rpc/${name}`,{method:"POST",headers:{apikey:key,authorization:`Bearer ${key}`,"content-type":"application/json"},body:JSON.stringify(body)});
  const text=await response.text();if(!response.ok)throw new Error(text||"Database request failed");return text?JSON.parse(text):null;
}
function validProfile(body:any){
  const c=body?.customer_payload,n=body?.note_payload,p=c?.profile;
  return uuid.test(body?.customer_id||"")&&uuid.test(body?.note_id||"")&&c&&n&&p&&c.consent===true&&
    typeof c.name==="string"&&c.name.trim().length>0&&c.name.length<=100&&
    typeof c.phone==="string"&&/^[+0-9 ()-]{7,20}$/.test(c.phone)&&
    (c.email==null||c.email===""||(typeof c.email==="string"&&c.email.length<=200&&c.email.includes("@")))&&
    Array.isArray(c.recommendations)&&c.recommendations.length>0&&c.recommendations.length<=3&&
    typeof n.name==="string"&&n.name.length<=150&&typeof n.customer==="string"&&n.customer.length<=100&&
    typeof n.fragrance==="string"&&n.fragrance.length<=150&&n.status==="En desarrollo";
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors(req)});
  if(req.method!=="POST")return json(req,{error:"Method not allowed"},405);
  if(Number(req.headers.get("content-length")||0)>30000)return json(req,{error:"Solicitud demasiado grande"},413);
  const origin=req.headers.get("origin");
  try{
    const body=await req.json();
    if(body.action==="profile"){
      if(origin&&!allowedOrigins.has(origin))return json(req,{error:"Origen no permitido"},403);
      if(!validProfile(body))return json(req,{error:"Datos de perfil inválidos"},400);
      return json(req,await rpc("note_save_profile",{p_customer_id:body.customer_id,p_customer_payload:body.customer_payload,p_note_id:body.note_id,p_note_payload:body.note_payload}));
    }
    if(!(await authorizedLegacy(req))&&!(await authorizedAdmin(req)))return json(req,{error:"Acceso no autorizado"},401);
    if(body.action==="list")return json(req,{rows:await rpc("note_list_all",{})});
    if(body.action==="save")return json(req,await rpc("note_save_admin",{p_id:body.id,p_kind:body.kind,p_payload:body.payload,p_revision:body.revision??null}));
    if(body.action==="archive")return json(req,await rpc("note_archive_admin",{p_id:body.id,p_revision:body.revision}));
    return json(req,{error:"Acción inválida"},400);
  }catch(error){const message=error instanceof Error?error.message:"Unexpected error";const conflict=message.includes("Record changed")||message.includes("Request changed");return json(req,{error:conflict?"El registro cambió. Actualiza e intenta de nuevo.":"No pudimos completar la operación."},conflict?409:500);}
});
