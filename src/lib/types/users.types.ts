import type { User } from "@supabase/supabase-js"
import type { Enums } from "$lib/types/database.types"

export interface UserData extends User {
  roles: Enums<"Role">[]
}
