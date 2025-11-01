create table "public"."concerts"
(
    "id"     uuid                                    not null default gen_random_uuid(),
    "name"   text                                    not null,
    "active" boolean                                 not null default true,
    constraint "concerts_pkey" primary key ("id")
);

create table "public"."global_settings"
(
    "id"      uuid                                    not null default gen_random_uuid(),
    "key"     text                                    not null,
    "value"   text,
    "private" boolean                                 not null default false,
    constraint "global_settings_pkey" primary key ("id")
);

create table "public"."instruments"
(
    "id"     uuid                                    not null default gen_random_uuid(),
    "name"   text                                    not null,
    constraint "instruments_pkey" primary key ("id")
);

create table "public"."groups"
(
    "id"   uuid                                    not null default gen_random_uuid(),
    "name" text                                    not null,
    constraint "groups_pkey" primary key ("id")
);

create table "public"."pieces"
(
    "id"   uuid                                    not null default gen_random_uuid(),
    "name" text                                    not null,
    constraint "pieces_pkey" primary key ("id")
);

create table "public"."files"
(
    "id"        uuid                                    not null default gen_random_uuid(),
    "piece_id"  uuid                                    not null,
    "file_path" text                                    not null,
    "version"   bigint                                  not null default '0',
    constraint "files_pkey" primary key ("id"),
    constraint "files_piece_id_fkey" foreign key ("piece_id") references "public"."pieces" ("id") on delete cascade,
    constraint "unique_version_piece_id_file_path" unique ("version", "piece_id", "file_path")
);

create table "public"."user_settings"
(
    "id"       uuid                                    not null default gen_random_uuid(),
    "user_id"  uuid                                    not null default auth.uid(),
    "key"      text                                    not null,
    "value"    text,
    "private"  boolean                                 not null default false,
    "readonly" boolean                                 not null default false,
    constraint "user_settings_pkey" primary key ("id"),
    constraint "user_settings_user_id_fkey" foreign key ("user_id") references "auth"."users" ("id") on delete cascade
);

create table "public"."concert_groups"
(
    "id"           uuid                                    not null default gen_random_uuid(),
    "concert_id"   uuid                                    not null,
    "group_id" uuid not null,
    constraint "concert_groups_pkey" primary key ("id"),
    constraint "concert_groups_concert_id_fkey" foreign key ("concert_id") references "public"."concerts" ("id") on delete cascade,
    constraint "concert_groups_group_id_fkey" foreign key ("group_id") references "public"."groups" ("id") on delete cascade
);

create table "public"."concert_pieces"
(
    "id"         uuid                                    not null default gen_random_uuid(),
    "piece_id"   uuid                                    not null,
    "concert_id" uuid                                    not null,
    constraint "concert_pieces_pkey" primary key ("id"),
    constraint "concert_pieces_piece_id_fkey" foreign key ("piece_id") references "public"."pieces" ("id") on delete cascade,
    constraint "concert_pieces_concert_id_fkey" foreign key ("concert_id") references "public"."concerts" ("id") on delete cascade
);

create table "public"."group_pieces"
(
    "id"           uuid                                    not null default gen_random_uuid(),
    "piece_id"     uuid                                    not null,
    "group_id" uuid not null,
    constraint "group_pieces_pkey" primary key ("id"),
    constraint "group_pieces_piece_id_fkey" foreign key ("piece_id") references "public"."pieces" ("id") on delete cascade,
    constraint "group_pieces_group_id_fkey" foreign key ("group_id") references "public"."groups" ("id") on delete cascade
);

create table "public"."file_instruments"
(
    "id"            uuid                                    not null default gen_random_uuid(),
    "instrument_id" uuid                                    not null,
    "file_id"       uuid                                    not null,
    constraint "file_instruments_pkey" primary key ("id"),
    constraint "file_instruments_instrument_id_fkey" foreign key ("instrument_id") references "public"."instruments" ("id") on delete cascade,
    constraint "file_instruments_file_id_fkey" foreign key ("file_id") references "public"."files" ("id") on delete cascade
);

create table "public"."instrument_concert_groups"
(
    "id"            uuid                                    not null default gen_random_uuid(),
    "instrument_id" uuid                                    not null,
    "group_id" uuid not null,
    "user_id" uuid not null default auth.uid(),
    constraint "instrument_group_pkey" primary key ("id"),
    constraint "instrument_concert_groups_instrument_id_fkey" foreign key ("instrument_id") references "public"."instruments" ("id") on delete cascade,
    constraint "instrument_concert_groups_group_id_fkey" foreign key ("group_id") references "public"."groups" ("id") on delete cascade,
    constraint "instrument_concert_groups_user_id_fkey" foreign key ("user_id") references "auth"."users" ("id") on delete cascade
);

alter table "public"."concerts" enable row level security;
alter table "public"."groups" enable row level security;
alter table "public"."pieces" enable row level security;
alter table "public"."instruments" enable row level security;
alter table "public"."concert_groups" enable row level security;
alter table "public"."concert_pieces" enable row level security;
alter table "public"."group_pieces" enable row level security;
alter table "public"."files" enable row level security;
alter table "public"."file_instruments" enable row level security;
alter table "public"."instrument_concert_groups" enable row level security;
alter table "public"."global_settings" enable row level security;
alter table "public"."user_settings" enable row level security;

create
policy "Allow select if user can access a corresponding group" on "public"."concerts"
    for
select using (id in (select concert_id from public.concert_groups));

create
policy "Enable read access for all users" on "public"."global_settings"
    for
select using (true);

create
policy "Enable read access for all users" on "public"."pieces"
    for
select using (true);

create
policy "Give access if user has access to instrument" on "public"."instruments"
    for
select using (id in (select instrument_id from public.instrument_concert_groups));

create
policy "Give access if user has access to instrument" on "public"."file_instruments"
    for
select using (instrument_id in (
    select instrument_concert_groups.instrument_id
    from public.instrument_concert_groups
    ));

create
policy "Give access if user has access to group" on "public"."group_pieces"
    for
select using (group_id in (
    select groups.id
    from public.groups
    ));

create
policy "Give access if user has access to group" on "public"."groups"
    for
select using (id in (
    select group_id
    from public.instrument_concert_groups
    ));

create
policy "Give access if user has access to concert" on "public"."concert_pieces"
    for
select using (concert_id in (
    select concerts.id
    from public.concerts
    ));

create
policy "Give access if user can access group" on "public"."concert_groups"
    for
select using (group_id in (
    select groups.id
    from public.groups
    ));

create
policy "Give users access to their own data only" on "public"."instrument_concert_groups"
    for
select using ((select auth.uid()) = user_id);

create
policy "Restrict access to access to concert" on "public"."pieces"
    as restrictive
    for
select using (id in (
    select piece_id
    from public.concert_pieces
    ));

create
policy "Restrict access to access to group" on "public"."pieces"
    as restrictive
    for
select using (id in (
    select piece_id
    from public.group_pieces
    ));


create
policy "Give access if user has access to piece" on "public"."files"
for
select using (
    (select "files"."piece_id") in
    (select "pieces"."id" from "public"."pieces"));

create
policy "Restrict access to instrument" on "public"."files"
    as restrictive
    for
select using (id in (
    select file_id
    from public.file_instruments
    ));

create
policy "Give users access to their own data only" on "public"."user_settings"
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create
policy "Restrict access to public" on "public"."user_settings"
    as restrictive
    using (not private)
    with check (not private);

create
policy "Restrict delete to writable" on "public"."user_settings"
    as restrictive
    for delete
using (not readonly);

create
policy "Restrict insert to writable" on "public"."user_settings"
    as restrictive
    for
insert with check (not readonly);

create
policy "Restrict update access to writable" on "public"."user_settings"
    as restrictive
    for
update using (not readonly)
with check (not readonly);

create
policy "Restrict to active concerts" on "public"."concerts"
    as restrictive
    for
select using (active);

create
policy "Restrict to public settings" on "public"."global_settings"
    as restrictive
    for
select using (not private);
