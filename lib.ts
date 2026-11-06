import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const configured = Boolean(url && key && !url.includes('YOUR_PROJECT') && !key.includes('YOUR_SUPABASE'));
export const supabase = configured ? createClient(url,key) : null;

// Password vault encryption happens in this browser. The master password is never sent to Supabase.
const enc = new TextEncoder();
const toB64=(b:ArrayBuffer)=>btoa(String.fromCharCode(...new Uint8Array(b)));
const fromB64=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function derive(pass:string,salt:Uint8Array){
 const material=await crypto.subtle.importKey('raw',enc.encode(pass),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function encryptVault(value:unknown,pass:string){
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await derive(pass,salt);
 const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(value)));
 return {salt:toB64(salt.buffer),iv:toB64(iv.buffer),ciphertext:toB64(data)};
}
export async function decryptVault(payload:{salt:string;iv:string;ciphertext:string},pass:string){
 const key=await derive(pass,fromB64(payload.salt));
 const raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(payload.iv)},key,fromB64(payload.ciphertext));
 return JSON.parse(new TextDecoder().decode(raw));
}