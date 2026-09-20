'use client';
import {useState} from 'react';
import {BrandLogo} from '@/components/brand-logo';
import {AdminDashboard} from '@/components/admin-dashboard';
import {adminEmail,appPath,hasSession,signIn,signOut,signUp} from '@/lib/note-client';

export function AdminAuth(){
  const [ready,setReady]=useState(()=>typeof window!=='undefined'&&hasSession());
  const [password,setPassword]=useState('');
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  async function enter(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage('');try{await signIn(password);setReady(true);}catch(error){setMessage(error instanceof Error?error.message:'No pudimos iniciar sesión.');}finally{setBusy(false);}}
  async function createAccess(){if(password.length<8){setMessage('Usa una contraseña de mínimo 8 caracteres.');return;}setBusy(true);setMessage('');try{const data=await signUp(password);setMessage(data.access_token?'Acceso creado correctamente.':'Te enviamos un correo de confirmación. Confírmalo y luego inicia sesión aquí.');if(data.access_token)setReady(true);}catch(error){setMessage(error instanceof Error?error.message:'No pudimos crear el acceso.');}finally{setBusy(false);}}
  if(ready)return <><button className="admin-signout" onClick={()=>{signOut();setReady(false);}}>Cerrar sesión</button><AdminDashboard/></>;
  return <main className="admin"><BrandLogo placement="admin"/><p className="eyebrow">ACCESO PRIVADO</p><h1>Panel administrativo</h1><p>Gestiona las Nötes, pedidos, clientes y movimientos de tu negocio.</p><form onSubmit={enter} className="control-form admin-login"><label className="full">Correo administrador<input type="email" value={adminEmail} readOnly/></label><label className="full">Contraseña<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required autoComplete="current-password"/></label>{message&&<p className="full" role="status">{message}</p>}<div className="full control-form-actions"><button type="button" className="control-secondary" onClick={createAccess} disabled={busy}>Crear acceso</button><button className="control-primary" disabled={busy}>{busy?'Procesando…':'Iniciar sesión'}</button></div></form><a className="text-button" href={appPath('/')}>Volver a la experiencia →</a></main>;
}
