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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.warn("Supabase credentials missing. Session not saved.");
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
