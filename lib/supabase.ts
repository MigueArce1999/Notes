export async function noteDatabase<T>(body:Record<string,unknown>):Promise<T>{
  const url=process.env.NOTE_SUPABASE_BRIDGE_URL;
  const token=process.env.NOTE_SUPABASE_BRIDGE_TOKEN;
  if(!url||!token)throw new Error('DATABASE_NOT_CONFIGURED');
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','x-note-bridge-token':token},body:JSON.stringify(body),cache:'no-store'});
  const data=await response.json().catch(()=>({error:'Respuesta inválida de la base de datos'})) as T&{error?:string};
  if(!response.ok)throw Object.assign(new Error(data.error||'DATABASE_ERROR'),{status:response.status});
  return data;
}
