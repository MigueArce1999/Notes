import {isAdmin} from '@/lib/admin-store';
import {noteDatabase} from '@/lib/supabase';
export const dynamic='force-dynamic';
export async function GET(){if(!await isAdmin())return Response.json({error:'Acceso no autorizado'},{status:403});try{const {rows}=await noteDatabase<{rows:unknown[]}>({action:'list'});return new Response(JSON.stringify({format:'note-backup-v2',source:'supabase',exported_at:new Date().toISOString(),record_count:rows.length,records:rows},null,2),{headers:{'Content-Type':'application/json; charset=utf-8','Content-Disposition':`attachment; filename="note-respaldo-${new Date().toISOString().slice(0,10)}.json"`,'Cache-Control':'no-store'}});}catch{return Response.json({error:'No se pudo generar el respaldo. Intenta nuevamente.'},{status:503});}}
