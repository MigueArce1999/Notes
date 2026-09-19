import {BrandLogo} from '@/components/brand-logo';
import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {isAdmin} from '@/lib/admin-store';
import {AdminDashboard} from '@/components/admin-dashboard';
export const dynamic='force-dynamic';
export default async function Admin(){await requireChatGPTUser('/admin');if(!await isAdmin())return <main className="admin"><BrandLogo placement="admin"/><h1>Panel administrativo</h1><p>Este espacio está reservado al equipo autorizado de Nöte.</p><a className="text-button" href="/">Volver a la experiencia →</a></main>;return <AdminDashboard/>;}
