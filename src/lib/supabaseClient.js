import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// null tant que les variables d'environnement ne sont pas configurées : tous
// les appelants doivent tolérer ce cas (repli silencieux sur le comportement
// local existant, voir GameHub.jsx et useFriendSession.js).
export const supabase = url && anonKey ? createClient(url, anonKey) : null
