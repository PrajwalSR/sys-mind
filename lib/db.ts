import { supabase } from "./supabase";
import { Message } from "@/app/page";

export interface Session {
    id?: string;
    topic: string;
    messages: Message[];
    diagram_code: string;
    created_at?: string;
}

export async function saveSession(session: Session) {
    if (!supabase) {
        // The warning is already logged in lib/supabase.ts
        return null;
    }

    const { data, error } = await supabase
        .from("sessions")
        .upsert(session)
        .select()
        .single();

    if (error) {
        console.error("Error saving session:", error);
        throw error;
    }

    return data;
}
