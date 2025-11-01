create type "public"."Role" as enum ('admin');

create table "public"."user_roles"
(
    "id"      uuid                                    not null default gen_random_uuid(),
    "user_id" uuid                                    not null,
    "role"    "public"."Role"                         not null,
    constraint "user_roles_pkey" primary key ("id"),
    constraint "user_roles_user_id_fkey" foreign key ("user_id") references "auth"."users" ("id") on delete cascade
);

alter table "public"."user_roles"
    enable row level security;

create
    policy "Give users access to their own data" on "public"."user_roles"
    for
    select using ((select auth.uid()) = user_id);