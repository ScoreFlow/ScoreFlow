import type { Session, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types.ts"
import type { Enums } from "$lib/types/database.types"

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      getSession: () => Promise<Session | null>
    }

    interface PageData {
      session?: Session | null
      rolesPromise?: Promise<Enums<"Role">[] | null>
      supabase?: SupabaseClient<Database>
      cookies?: { name: string; value: string }[]
    }
  }
}
