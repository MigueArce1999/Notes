const SUPABASE_URL='https://cfokczovpcikyiwtmzss.supabase.co';
const SUPABASE_KEY='sb_publishable_Yjk7EmUxLloP8d_tVShGMQ_gBBLwL9F';
const EDGE_URL=`${SUPABASE_URL}/functions/v1/note-bridge`;
const ADMIN_EMAIL='miguelarcemercado08@gmail.com';

export const BASE_PATH=process.env.NEXT_PUBLIC_BASE_PATH||'';
export const appPath=(path:string)=>`${BASE_PATH}${path.startsWith('/')?path:`/${path}`}`;
export const assetPath=appPath;
export const adminEmail=ADMIN_EMAIL;

type Session={access_token:string;refresh_token:string;expires_at:number};
const SESSION_KEY='note-supabase-session-v1';

function readSession():Session|null{
  if(typeof window==='undefined')return null;
  try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null') as Session|null;}catch{return null;}
}
function saveSession(data:any){
  const session:Session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Math.floor(Date.now()/1000)+Number(data.expires_in||3600)};
  localStorage.setItem(SESSION_KEY,JSON.stringify(session));
  return session;
}
async function authRequest(path:string,body:Record<string,unknown>){
  const response=await fetch(`${SUPABASE_URL}/auth/v1/${path}`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await response.json().catch(()=>({})) as any;
  if(!response.ok)throw new Error(data.msg||data.error_description||data.message||'No pudimos completar el acceso.');
  return data;
}
export async function signIn(password:string){
  const data=await authRequest('token?grant_type=password',{email:ADMIN_EMAIL,password});
  return saveSession(data);
}
export async function signUp(password:string){
  const data=await authRequest('signup',{email:ADMIN_EMAIL,password,options:{email_redirect_to:`${window.location.origin}${appPath('/admin/')}`}});
  if(data.access_token)saveSession(data);
  return data;
}
export function signOut(){if(typeof window!=='undefined')localStorage.removeItem(SESSION_KEY);}
export function hasSession(){return !!readSession();}
async function accessToken(){
  let session=readSession();
  if(!session)throw new Error('Inicia sesión para continuar.');
  if(session.expires_at>Date.now()/1000+60)return session.access_token;
  const data=await authRequest('token?grant_type=refresh_token',{refresh_token:session.refresh_token});
  session=saveSession(data);return session.access_token;
}
export async function noteRequest<T>(body:Record<string,unknown>,admin=false):Promise<T>{
  const headers:Record<string,string>={'Content-Type':'application/json',apikey:SUPABASE_KEY};
  if(admin)headers.Authorization=`Bearer ${await accessToken()}`;
  const response=await fetch(EDGE_URL,{method:'POST',headers,body:JSON.stringify(body),cache:'no-store'});
  const data=await response.json().catch(()=>({error:'Respuesta inválida'})) as T&{error?:string};
  if(!response.ok){if(response.status===401)signOut();throw new Error(data.error||'No pudimos completar la operación.');}
  return data;
}
