import {getChatGPTUser} from '@/app/chatgpt-auth';
export async function isAdmin(){const user=await getChatGPTUser();const emails=(process.env.NOTE_ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);return !!user&&emails.includes(user.email.toLowerCase());}
