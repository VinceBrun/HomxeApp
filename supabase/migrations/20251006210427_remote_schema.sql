create table "public"."amenities" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "icon_url" text
);


alter table "public"."amenities" enable row level security;

create table "public"."chats" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid,
    "landlord_id" uuid,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."chats" enable row level security;

create table "public"."complaints" (
    "id" uuid not null default gen_random_uuid(),
    "tenancy_id" uuid not null,
    "title" text not null,
    "description" text not null,
    "status" text default 'submitted'::text,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."complaints" enable row level security;

create table "public"."device_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "token" text not null,
    "platform" text not null,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."device_tokens" enable row level security;

create table "public"."kyc_verifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "id_type" text not null,
    "id_image_url" text not null,
    "selfie_image_url" text not null,
    "status" text default 'pending'::text,
    "admin_comment" text,
    "submitted_at" timestamp with time zone default timezone('utc'::text, now()),
    "verified_at" timestamp with time zone
);


alter table "public"."kyc_verifications" enable row level security;

create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "chat_id" uuid not null,
    "sender_id" uuid not null,
    "content" text,
    "type" text default 'text'::text,
    "status" text default 'sent'::text,
    "sent_at" timestamp with time zone default timezone('utc'::text, now()),
    "seen_by" uuid[] default '{}'::uuid[],
    "media_url" text,
    "media_mime_type" text,
    "edited_at" timestamp with time zone,
    "deleted" boolean default false
);


alter table "public"."messages" enable row level security;

create table "public"."payments" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid,
    "property_id" uuid,
    "tenancy_id" uuid,
    "amount" numeric(12,2) not null,
    "status" text default 'pending'::text,
    "payment_method" text,
    "reference" text,
    "paid_at" timestamp with time zone,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."payments" enable row level security;

create table if not exists "public"."profiles" (
    "id" uuid not null,
    "full_name" text not null,
    "phone_number" text not null,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "role" text[] default ARRAY[]::text[],
    "avatar_url" jsonb default '{}'::jsonb
);


alter table "public"."profiles" enable row level security;

create table "public"."properties" (
    "id" uuid not null default gen_random_uuid(),
    "landlord_id" uuid,
    "title" text not null,
    "description" text,
    "type" text not null,
    "location" text not null,
    "price" numeric not null,
    "images" text[] default ARRAY[]::text[],
    "videos" text[] default ARRAY[]::text[],
    "facilities" jsonb,
    "is_available" boolean default true,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "category" text,
    "status" text default 'listed'::text,
    "latitude" double precision,
    "longitude" double precision
);


alter table "public"."properties" enable row level security;

create table "public"."property_amenities" (
    "property_id" uuid not null,
    "amenity_id" uuid not null
);


alter table "public"."property_amenities" enable row level security;

create table "public"."reviews" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid,
    "tenant_id" uuid,
    "landlord_id" uuid,
    "rating" integer,
    "comment" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."reviews" enable row level security;

create table "public"."saved_properties" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid,
    "property_id" uuid,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."saved_properties" enable row level security;

create table "public"."schedules" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid,
    "tenant_id" uuid,
    "scheduled_date" date not null,
    "scheduled_time" time without time zone not null,
    "mode" text default 'physical'::text,
    "status" text default 'pending'::text,
    "notes" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."schedules" enable row level security;

create table "public"."tenancies" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid not null,
    "tenant_id" uuid not null,
    "lease_start_date" date not null,
    "lease_end_date" date not null,
    "rent_amount" numeric not null,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."tenancies" enable row level security;

create table "public"."typing_status" (
    "id" uuid not null default gen_random_uuid(),
    "chat_id" uuid,
    "user_id" uuid,
    "is_typing" boolean default false,
    "updated_at" timestamp with time zone default timezone('utc'::text, now())
);


alter table "public"."typing_status" enable row level security;

CREATE UNIQUE INDEX amenities_pkey ON public.amenities USING btree (id);

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

CREATE UNIQUE INDEX complaints_pkey ON public.complaints USING btree (id);

CREATE UNIQUE INDEX device_tokens_pkey ON public.device_tokens USING btree (id);

CREATE INDEX idx_complaints_tenancy_id ON public.complaints USING btree (tenancy_id);

CREATE INDEX idx_tenancies_property_id ON public.tenancies USING btree (property_id);

CREATE INDEX idx_tenancies_tenant_id ON public.tenancies USING btree (tenant_id);

CREATE UNIQUE INDEX kyc_verifications_pkey ON public.kyc_verifications USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX one_review_per_property ON public.reviews USING btree (property_id, tenant_id);

CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id);

CREATE UNIQUE INDEX payments_reference_key ON public.payments USING btree (reference);

CREATE UNIQUE INDEX IF NOT EXISTS profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX properties_pkey ON public.properties USING btree (id);

CREATE UNIQUE INDEX property_amenities_pkey ON public.property_amenities USING btree (property_id, amenity_id);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE UNIQUE INDEX saved_properties_pkey ON public.saved_properties USING btree (id);

CREATE UNIQUE INDEX schedules_pkey ON public.schedules USING btree (id);

CREATE UNIQUE INDEX tenancies_pkey ON public.tenancies USING btree (id);

CREATE UNIQUE INDEX typing_status_pkey ON public.typing_status USING btree (id);

CREATE UNIQUE INDEX unique_chat_pair ON public.chats USING btree (tenant_id, landlord_id);

CREATE UNIQUE INDEX unique_landlord_listing ON public.properties USING btree (landlord_id, title, location);

CREATE UNIQUE INDEX unique_saved_property ON public.saved_properties USING btree (tenant_id, property_id);

alter table "public"."amenities" add constraint "amenities_pkey" PRIMARY KEY using index "amenities_pkey";

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

alter table "public"."complaints" add constraint "complaints_pkey" PRIMARY KEY using index "complaints_pkey";

alter table "public"."device_tokens" add constraint "device_tokens_pkey" PRIMARY KEY using index "device_tokens_pkey";

alter table "public"."kyc_verifications" add constraint "kyc_verifications_pkey" PRIMARY KEY using index "kyc_verifications_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_pkey'
  ) THEN
    alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";
  END IF;
END
$$;

alter table "public"."properties" add constraint "properties_pkey" PRIMARY KEY using index "properties_pkey";

alter table "public"."property_amenities" add constraint "property_amenities_pkey" PRIMARY KEY using index "property_amenities_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."saved_properties" add constraint "saved_properties_pkey" PRIMARY KEY using index "saved_properties_pkey";

alter table "public"."schedules" add constraint "schedules_pkey" PRIMARY KEY using index "schedules_pkey";

alter table "public"."tenancies" add constraint "tenancies_pkey" PRIMARY KEY using index "tenancies_pkey";

alter table "public"."typing_status" add constraint "typing_status_pkey" PRIMARY KEY using index "typing_status_pkey";

alter table "public"."chats" add constraint "chats_landlord_id_fkey" FOREIGN KEY (landlord_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "chats_landlord_id_fkey";

alter table "public"."chats" add constraint "chats_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "chats_tenant_id_fkey";

alter table "public"."chats" add constraint "unique_chat_pair" UNIQUE using index "unique_chat_pair";

alter table "public"."complaints" add constraint "complaints_status_check" CHECK ((status = ANY (ARRAY['submitted'::text, 'in_progress'::text, 'resolved'::text]))) not valid;

alter table "public"."complaints" validate constraint "complaints_status_check";

alter table "public"."complaints" add constraint "complaints_tenancy_id_fkey" FOREIGN KEY (tenancy_id) REFERENCES tenancies(id) ON DELETE CASCADE not valid;

alter table "public"."complaints" validate constraint "complaints_tenancy_id_fkey";

alter table "public"."device_tokens" add constraint "device_tokens_platform_check" CHECK ((platform = ANY (ARRAY['ios'::text, 'android'::text, 'web'::text]))) not valid;

alter table "public"."device_tokens" validate constraint "device_tokens_platform_check";

alter table "public"."device_tokens" add constraint "device_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."device_tokens" validate constraint "device_tokens_user_id_fkey";

alter table "public"."kyc_verifications" add constraint "kyc_verifications_id_type_check" CHECK ((id_type = ANY (ARRAY['national_id'::text, 'passport'::text, 'driver_license'::text]))) not valid;

alter table "public"."kyc_verifications" validate constraint "kyc_verifications_id_type_check";

alter table "public"."kyc_verifications" add constraint "kyc_verifications_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text]))) not valid;

alter table "public"."kyc_verifications" validate constraint "kyc_verifications_status_check";

alter table "public"."kyc_verifications" add constraint "kyc_verifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."kyc_verifications" validate constraint "kyc_verifications_user_id_fkey";

alter table "public"."messages" add constraint "messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_chat_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."messages" add constraint "messages_status_check" CHECK ((status = ANY (ARRAY['sent'::text, 'delivered'::text, 'seen'::text]))) not valid;

alter table "public"."messages" validate constraint "messages_status_check";

alter table "public"."messages" add constraint "messages_type_check" CHECK ((type = ANY (ARRAY['text'::text, 'image'::text, 'video'::text, 'audio'::text]))) not valid;

alter table "public"."messages" validate constraint "messages_type_check";

alter table "public"."payments" add constraint "payments_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."payments" validate constraint "payments_property_id_fkey";

alter table "public"."payments" add constraint "payments_reference_key" UNIQUE using index "payments_reference_key";

alter table "public"."payments" add constraint "payments_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'successful'::text, 'failed'::text]))) not valid;

alter table "public"."payments" validate constraint "payments_status_check";

alter table "public"."payments" add constraint "payments_tenancy_id_fkey" FOREIGN KEY (tenancy_id) REFERENCES tenancies(id) ON DELETE SET NULL not valid;

alter table "public"."payments" validate constraint "payments_tenancy_id_fkey";

alter table "public"."payments" add constraint "payments_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."payments" validate constraint "payments_tenant_id_fkey";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_fkey'
  ) THEN
    alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
  END IF;
END
$$;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."properties" add constraint "properties_landlord_id_fkey" FOREIGN KEY (landlord_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."properties" validate constraint "properties_landlord_id_fkey";

alter table "public"."properties" add constraint "properties_status_check" CHECK ((status = ANY (ARRAY['listed'::text, 'sold'::text]))) not valid;

alter table "public"."properties" validate constraint "properties_status_check";

alter table "public"."properties" add constraint "unique_landlord_listing" UNIQUE using index "unique_landlord_listing";

alter table "public"."property_amenities" add constraint "property_amenities_amenity_id_fkey" FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE not valid;

alter table "public"."property_amenities" validate constraint "property_amenities_amenity_id_fkey";

alter table "public"."property_amenities" add constraint "property_amenities_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."property_amenities" validate constraint "property_amenities_property_id_fkey";

alter table "public"."reviews" add constraint "one_review_per_property" UNIQUE using index "one_review_per_property";

alter table "public"."reviews" add constraint "reviews_landlord_id_fkey" FOREIGN KEY (landlord_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_landlord_id_fkey";

alter table "public"."reviews" add constraint "reviews_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_property_id_fkey";

alter table "public"."reviews" add constraint "reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_rating_check";

alter table "public"."reviews" add constraint "reviews_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_tenant_id_fkey";

alter table "public"."saved_properties" add constraint "saved_properties_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."saved_properties" validate constraint "saved_properties_property_id_fkey";

alter table "public"."saved_properties" add constraint "saved_properties_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."saved_properties" validate constraint "saved_properties_tenant_id_fkey";

alter table "public"."saved_properties" add constraint "unique_saved_property" UNIQUE using index "unique_saved_property";

alter table "public"."schedules" add constraint "schedules_mode_check" CHECK ((mode = ANY (ARRAY['physical'::text, 'virtual'::text]))) not valid;

alter table "public"."schedules" validate constraint "schedules_mode_check";

alter table "public"."schedules" add constraint "schedules_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."schedules" validate constraint "schedules_property_id_fkey";

alter table "public"."schedules" add constraint "schedules_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text]))) not valid;

alter table "public"."schedules" validate constraint "schedules_status_check";

alter table "public"."schedules" add constraint "schedules_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."schedules" validate constraint "schedules_tenant_id_fkey";

alter table "public"."tenancies" add constraint "tenancies_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."tenancies" validate constraint "tenancies_property_id_fkey";

alter table "public"."tenancies" add constraint "tenancies_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'terminated'::text, 'pending'::text]))) not valid;

alter table "public"."tenancies" validate constraint "tenancies_status_check";

alter table "public"."tenancies" add constraint "tenancies_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."tenancies" validate constraint "tenancies_tenant_id_fkey";

alter table "public"."typing_status" add constraint "typing_status_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE not valid;

alter table "public"."typing_status" validate constraint "typing_status_chat_id_fkey";

alter table "public"."typing_status" add constraint "typing_status_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."typing_status" validate constraint "typing_status_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN (
        SELECT role_name 
        FROM "public"."user_roles" ur 
        JOIN "public"."roles" r ON ur.role_id = r.id 
        WHERE ur.user_id = user_id::bigint
        LIMIT 1
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM "public"."user_roles" ur 
        JOIN "public"."roles" r ON ur.role_id = r.id 
        WHERE ur.user_id = user_id::bigint 
        AND r.role_name = role_name
    );
END;
$function$
;

-- Skipped: last_messages depends on deprecated profiles.avatar_url and role columns


CREATE OR REPLACE FUNCTION public.notify_new_message()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  -- You’ll later call an Edge Function from here
  -- For now, just a placeholder log
  raise notice 'New message by %, content: %', NEW.sender_id, NEW.content;
  return new;
end;
$function$
;

-- Skipped: top_landlords_view depended on profiles.role which has been removed


-- Skipped: top_landlords_with_email depended on profiles.role which has been removed


grant delete on table "public"."amenities" to "anon";

grant insert on table "public"."amenities" to "anon";

grant references on table "public"."amenities" to "anon";

grant select on table "public"."amenities" to "anon";

grant trigger on table "public"."amenities" to "anon";

grant truncate on table "public"."amenities" to "anon";

grant update on table "public"."amenities" to "anon";

grant delete on table "public"."amenities" to "authenticated";

grant insert on table "public"."amenities" to "authenticated";

grant references on table "public"."amenities" to "authenticated";

grant select on table "public"."amenities" to "authenticated";

grant trigger on table "public"."amenities" to "authenticated";

grant truncate on table "public"."amenities" to "authenticated";

grant update on table "public"."amenities" to "authenticated";

grant delete on table "public"."amenities" to "service_role";

grant insert on table "public"."amenities" to "service_role";

grant references on table "public"."amenities" to "service_role";

grant select on table "public"."amenities" to "service_role";

grant trigger on table "public"."amenities" to "service_role";

grant truncate on table "public"."amenities" to "service_role";

grant update on table "public"."amenities" to "service_role";

grant delete on table "public"."chats" to "anon";

grant insert on table "public"."chats" to "anon";

grant references on table "public"."chats" to "anon";

grant select on table "public"."chats" to "anon";

grant trigger on table "public"."chats" to "anon";

grant truncate on table "public"."chats" to "anon";

grant update on table "public"."chats" to "anon";

grant delete on table "public"."chats" to "authenticated";

grant insert on table "public"."chats" to "authenticated";

grant references on table "public"."chats" to "authenticated";

grant select on table "public"."chats" to "authenticated";

grant trigger on table "public"."chats" to "authenticated";

grant truncate on table "public"."chats" to "authenticated";

grant update on table "public"."chats" to "authenticated";

grant delete on table "public"."chats" to "service_role";

grant insert on table "public"."chats" to "service_role";

grant references on table "public"."chats" to "service_role";

grant select on table "public"."chats" to "service_role";

grant trigger on table "public"."chats" to "service_role";

grant truncate on table "public"."chats" to "service_role";

grant update on table "public"."chats" to "service_role";

grant delete on table "public"."complaints" to "anon";

grant insert on table "public"."complaints" to "anon";

grant references on table "public"."complaints" to "anon";

grant select on table "public"."complaints" to "anon";

grant trigger on table "public"."complaints" to "anon";

grant truncate on table "public"."complaints" to "anon";

grant update on table "public"."complaints" to "anon";

grant delete on table "public"."complaints" to "authenticated";

grant insert on table "public"."complaints" to "authenticated";

grant references on table "public"."complaints" to "authenticated";

grant select on table "public"."complaints" to "authenticated";

grant trigger on table "public"."complaints" to "authenticated";

grant truncate on table "public"."complaints" to "authenticated";

grant update on table "public"."complaints" to "authenticated";

grant delete on table "public"."complaints" to "service_role";

grant insert on table "public"."complaints" to "service_role";

grant references on table "public"."complaints" to "service_role";

grant select on table "public"."complaints" to "service_role";

grant trigger on table "public"."complaints" to "service_role";

grant truncate on table "public"."complaints" to "service_role";

grant update on table "public"."complaints" to "service_role";

grant delete on table "public"."device_tokens" to "anon";

grant insert on table "public"."device_tokens" to "anon";

grant references on table "public"."device_tokens" to "anon";

grant select on table "public"."device_tokens" to "anon";

grant trigger on table "public"."device_tokens" to "anon";

grant truncate on table "public"."device_tokens" to "anon";

grant update on table "public"."device_tokens" to "anon";

grant delete on table "public"."device_tokens" to "authenticated";

grant insert on table "public"."device_tokens" to "authenticated";

grant references on table "public"."device_tokens" to "authenticated";

grant select on table "public"."device_tokens" to "authenticated";

grant trigger on table "public"."device_tokens" to "authenticated";

grant truncate on table "public"."device_tokens" to "authenticated";

grant update on table "public"."device_tokens" to "authenticated";

grant delete on table "public"."device_tokens" to "service_role";

grant insert on table "public"."device_tokens" to "service_role";

grant references on table "public"."device_tokens" to "service_role";

grant select on table "public"."device_tokens" to "service_role";

grant trigger on table "public"."device_tokens" to "service_role";

grant truncate on table "public"."device_tokens" to "service_role";

grant update on table "public"."device_tokens" to "service_role";

grant delete on table "public"."kyc_verifications" to "anon";

grant insert on table "public"."kyc_verifications" to "anon";

grant references on table "public"."kyc_verifications" to "anon";

grant select on table "public"."kyc_verifications" to "anon";

grant trigger on table "public"."kyc_verifications" to "anon";

grant truncate on table "public"."kyc_verifications" to "anon";

grant update on table "public"."kyc_verifications" to "anon";

grant delete on table "public"."kyc_verifications" to "authenticated";

grant insert on table "public"."kyc_verifications" to "authenticated";

grant references on table "public"."kyc_verifications" to "authenticated";

grant select on table "public"."kyc_verifications" to "authenticated";

grant trigger on table "public"."kyc_verifications" to "authenticated";

grant truncate on table "public"."kyc_verifications" to "authenticated";

grant update on table "public"."kyc_verifications" to "authenticated";

grant delete on table "public"."kyc_verifications" to "service_role";

grant insert on table "public"."kyc_verifications" to "service_role";

grant references on table "public"."kyc_verifications" to "service_role";

grant select on table "public"."kyc_verifications" to "service_role";

grant trigger on table "public"."kyc_verifications" to "service_role";

grant truncate on table "public"."kyc_verifications" to "service_role";

grant update on table "public"."kyc_verifications" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."payments" to "anon";

grant insert on table "public"."payments" to "anon";

grant references on table "public"."payments" to "anon";

grant select on table "public"."payments" to "anon";

grant trigger on table "public"."payments" to "anon";

grant truncate on table "public"."payments" to "anon";

grant update on table "public"."payments" to "anon";

grant delete on table "public"."payments" to "authenticated";

grant insert on table "public"."payments" to "authenticated";

grant references on table "public"."payments" to "authenticated";

grant select on table "public"."payments" to "authenticated";

grant trigger on table "public"."payments" to "authenticated";

grant truncate on table "public"."payments" to "authenticated";

grant update on table "public"."payments" to "authenticated";

grant delete on table "public"."payments" to "service_role";

grant insert on table "public"."payments" to "service_role";

grant references on table "public"."payments" to "service_role";

grant select on table "public"."payments" to "service_role";

grant trigger on table "public"."payments" to "service_role";

grant truncate on table "public"."payments" to "service_role";

grant update on table "public"."payments" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."properties" to "anon";

grant insert on table "public"."properties" to "anon";

grant references on table "public"."properties" to "anon";

grant select on table "public"."properties" to "anon";

grant trigger on table "public"."properties" to "anon";

grant truncate on table "public"."properties" to "anon";

grant update on table "public"."properties" to "anon";

grant delete on table "public"."properties" to "authenticated";

grant insert on table "public"."properties" to "authenticated";

grant references on table "public"."properties" to "authenticated";

grant select on table "public"."properties" to "authenticated";

grant trigger on table "public"."properties" to "authenticated";

grant truncate on table "public"."properties" to "authenticated";

grant update on table "public"."properties" to "authenticated";

grant delete on table "public"."properties" to "service_role";

grant insert on table "public"."properties" to "service_role";

grant references on table "public"."properties" to "service_role";

grant select on table "public"."properties" to "service_role";

grant trigger on table "public"."properties" to "service_role";

grant truncate on table "public"."properties" to "service_role";

grant update on table "public"."properties" to "service_role";

grant delete on table "public"."property_amenities" to "anon";

grant insert on table "public"."property_amenities" to "anon";

grant references on table "public"."property_amenities" to "anon";

grant select on table "public"."property_amenities" to "anon";

grant trigger on table "public"."property_amenities" to "anon";

grant truncate on table "public"."property_amenities" to "anon";

grant update on table "public"."property_amenities" to "anon";

grant delete on table "public"."property_amenities" to "authenticated";

grant insert on table "public"."property_amenities" to "authenticated";

grant references on table "public"."property_amenities" to "authenticated";

grant select on table "public"."property_amenities" to "authenticated";

grant trigger on table "public"."property_amenities" to "authenticated";

grant truncate on table "public"."property_amenities" to "authenticated";

grant update on table "public"."property_amenities" to "authenticated";

grant delete on table "public"."property_amenities" to "service_role";

grant insert on table "public"."property_amenities" to "service_role";

grant references on table "public"."property_amenities" to "service_role";

grant select on table "public"."property_amenities" to "service_role";

grant trigger on table "public"."property_amenities" to "service_role";

grant truncate on table "public"."property_amenities" to "service_role";

grant update on table "public"."property_amenities" to "service_role";

grant delete on table "public"."reviews" to "anon";

grant insert on table "public"."reviews" to "anon";

grant references on table "public"."reviews" to "anon";

grant select on table "public"."reviews" to "anon";

grant trigger on table "public"."reviews" to "anon";

grant truncate on table "public"."reviews" to "anon";

grant update on table "public"."reviews" to "anon";

grant delete on table "public"."reviews" to "authenticated";

grant insert on table "public"."reviews" to "authenticated";

grant references on table "public"."reviews" to "authenticated";

grant select on table "public"."reviews" to "authenticated";

grant trigger on table "public"."reviews" to "authenticated";

grant truncate on table "public"."reviews" to "authenticated";

grant update on table "public"."reviews" to "authenticated";

grant delete on table "public"."reviews" to "service_role";

grant insert on table "public"."reviews" to "service_role";

grant references on table "public"."reviews" to "service_role";

grant select on table "public"."reviews" to "service_role";

grant trigger on table "public"."reviews" to "service_role";

grant truncate on table "public"."reviews" to "service_role";

grant update on table "public"."reviews" to "service_role";

grant delete on table "public"."saved_properties" to "anon";

grant insert on table "public"."saved_properties" to "anon";

grant references on table "public"."saved_properties" to "anon";

grant select on table "public"."saved_properties" to "anon";

grant trigger on table "public"."saved_properties" to "anon";

grant truncate on table "public"."saved_properties" to "anon";

grant update on table "public"."saved_properties" to "anon";

grant delete on table "public"."saved_properties" to "authenticated";

grant insert on table "public"."saved_properties" to "authenticated";

grant references on table "public"."saved_properties" to "authenticated";

grant select on table "public"."saved_properties" to "authenticated";

grant trigger on table "public"."saved_properties" to "authenticated";

grant truncate on table "public"."saved_properties" to "authenticated";

grant update on table "public"."saved_properties" to "authenticated";

grant delete on table "public"."saved_properties" to "service_role";

grant insert on table "public"."saved_properties" to "service_role";

grant references on table "public"."saved_properties" to "service_role";

grant select on table "public"."saved_properties" to "service_role";

grant trigger on table "public"."saved_properties" to "service_role";

grant truncate on table "public"."saved_properties" to "service_role";

grant update on table "public"."saved_properties" to "service_role";

grant delete on table "public"."schedules" to "anon";

grant insert on table "public"."schedules" to "anon";

grant references on table "public"."schedules" to "anon";

grant select on table "public"."schedules" to "anon";

grant trigger on table "public"."schedules" to "anon";

grant truncate on table "public"."schedules" to "anon";

grant update on table "public"."schedules" to "anon";

grant delete on table "public"."schedules" to "authenticated";

grant insert on table "public"."schedules" to "authenticated";

grant references on table "public"."schedules" to "authenticated";

grant select on table "public"."schedules" to "authenticated";

grant trigger on table "public"."schedules" to "authenticated";

grant truncate on table "public"."schedules" to "authenticated";

grant update on table "public"."schedules" to "authenticated";

grant delete on table "public"."schedules" to "service_role";

grant insert on table "public"."schedules" to "service_role";

grant references on table "public"."schedules" to "service_role";

grant select on table "public"."schedules" to "service_role";

grant trigger on table "public"."schedules" to "service_role";

grant truncate on table "public"."schedules" to "service_role";

grant update on table "public"."schedules" to "service_role";

grant delete on table "public"."tenancies" to "anon";

grant insert on table "public"."tenancies" to "anon";

grant references on table "public"."tenancies" to "anon";

grant select on table "public"."tenancies" to "anon";

grant trigger on table "public"."tenancies" to "anon";

grant truncate on table "public"."tenancies" to "anon";

grant update on table "public"."tenancies" to "anon";

grant delete on table "public"."tenancies" to "authenticated";

grant insert on table "public"."tenancies" to "authenticated";

grant references on table "public"."tenancies" to "authenticated";

grant select on table "public"."tenancies" to "authenticated";

grant trigger on table "public"."tenancies" to "authenticated";

grant truncate on table "public"."tenancies" to "authenticated";

grant update on table "public"."tenancies" to "authenticated";

grant delete on table "public"."tenancies" to "service_role";

grant insert on table "public"."tenancies" to "service_role";

grant references on table "public"."tenancies" to "service_role";

grant select on table "public"."tenancies" to "service_role";

grant trigger on table "public"."tenancies" to "service_role";

grant truncate on table "public"."tenancies" to "service_role";

grant update on table "public"."tenancies" to "service_role";

grant delete on table "public"."typing_status" to "anon";

grant insert on table "public"."typing_status" to "anon";

grant references on table "public"."typing_status" to "anon";

grant select on table "public"."typing_status" to "anon";

grant trigger on table "public"."typing_status" to "anon";

grant truncate on table "public"."typing_status" to "anon";

grant update on table "public"."typing_status" to "anon";

grant delete on table "public"."typing_status" to "authenticated";

grant insert on table "public"."typing_status" to "authenticated";

grant references on table "public"."typing_status" to "authenticated";

grant select on table "public"."typing_status" to "authenticated";

grant trigger on table "public"."typing_status" to "authenticated";

grant truncate on table "public"."typing_status" to "authenticated";

grant update on table "public"."typing_status" to "authenticated";

grant delete on table "public"."typing_status" to "service_role";

grant insert on table "public"."typing_status" to "service_role";

grant references on table "public"."typing_status" to "service_role";

grant select on table "public"."typing_status" to "service_role";

grant trigger on table "public"."typing_status" to "service_role";

grant truncate on table "public"."typing_status" to "service_role";

grant update on table "public"."typing_status" to "service_role";

create policy "Tenant or landlord can access their chats"
on "public"."chats"
as permissive
for all
to public
using (((auth.uid() = tenant_id) OR (auth.uid() = landlord_id)));


create policy "landlord_complaint_access"
on "public"."complaints"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (tenancies
     JOIN properties ON ((properties.id = tenancies.property_id)))
  WHERE ((tenancies.id = complaints.tenancy_id) AND (properties.landlord_id = auth.uid())))));


create policy "tenant_complaint_access"
on "public"."complaints"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM tenancies
  WHERE ((tenancies.id = complaints.tenancy_id) AND (tenancies.tenant_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM tenancies
  WHERE ((tenancies.id = complaints.tenancy_id) AND (tenancies.tenant_id = auth.uid())))));


create policy "User can manage own device tokens"
on "public"."device_tokens"
as permissive
for all
to public
using ((user_id = auth.uid()));


create policy "Allow users to insert their own KYC record"
on "public"."kyc_verifications"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."kyc_verifications"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users"
on "public"."kyc_verifications"
as permissive
for select
to public
using (true);


create policy "Users can submit KYC"
on "public"."kyc_verifications"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Users can view their own KYC"
on "public"."kyc_verifications"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Allow sender or receiver to read message"
on "public"."messages"
as permissive
for select
to public
using (((sender_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM chats
  WHERE ((chats.id = messages.chat_id) AND ((chats.tenant_id = auth.uid()) OR (chats.landlord_id = auth.uid())))))));


create policy "Allow sender to insert message"
on "public"."messages"
as permissive
for insert
to public
with check ((sender_id = auth.uid()));


create policy "Users can edit/delete their own messages"
on "public"."messages"
as permissive
for update
to public
using ((sender_id = auth.uid()));


-- Skipped: admin_delete_payments depended on profiles.role


-- Skipped: admin_insert_payments depended on profiles.role


-- Skipped: admin_select_all_payments depended on profiles.role


-- Skipped: admin_update_payments depended on profiles.role


create policy "landlord_select_payments"
on "public"."payments"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM properties
  WHERE ((properties.id = payments.property_id) AND (properties.landlord_id = auth.uid())))));


create policy "tenant_insert_payments"
on "public"."payments"
as permissive
for insert
to public
with check ((tenant_id = auth.uid()));


create policy "tenant_select_payments"
on "public"."payments"
as permissive
for select
to public
using ((tenant_id = auth.uid()));


create policy "Authenticated user can read own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Public read access to profiles"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "User can insert own profile"
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "User can update own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Anyone can read available properties"
on "public"."properties"
as permissive
for select
to public
using ((is_available = true));


create policy "Anyone logged in can view properties"
on "public"."properties"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));


create policy "Landlord can manage their own properties"
on "public"."properties"
as permissive
for all
to public
using ((auth.uid() = landlord_id));


create policy "Landlords can add properties"
on "public"."properties"
as permissive
for insert
to public
with check ((auth.uid() = landlord_id));


create policy "Landlords can delete their properties"
on "public"."properties"
as permissive
for delete
to public
using ((auth.uid() = landlord_id));


create policy "Landlords can modify their properties"
on "public"."properties"
as permissive
for update
to public
using ((auth.uid() = landlord_id))
with check ((auth.uid() = landlord_id));


create policy "Anyone can read reviews"
on "public"."reviews"
as permissive
for select
to public
using (true);


create policy "Tenants can manage their own reviews"
on "public"."reviews"
as permissive
for all
to public
using ((auth.uid() = tenant_id));


create policy "Tenants can manage their saved properties"
on "public"."saved_properties"
as permissive
for all
to public
using ((auth.uid() = tenant_id));


create policy "Landlords can view schedules for their properties"
on "public"."schedules"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM properties
  WHERE ((properties.id = schedules.property_id) AND (properties.landlord_id = auth.uid())))));


create policy "Tenants can manage their own schedules"
on "public"."schedules"
as permissive
for all
to public
using ((auth.uid() = tenant_id));


create policy "landlord_access"
on "public"."tenancies"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM properties
  WHERE ((properties.id = tenancies.property_id) AND (properties.landlord_id = auth.uid())))));


create policy "tenant_access"
on "public"."tenancies"
as permissive
for select
to public
using ((tenant_id = auth.uid()));


create policy "Only chat participants can update typing"
on "public"."typing_status"
as permissive
for all
to public
using ((chat_id IN ( SELECT chats.id
   FROM chats
  WHERE ((chats.tenant_id = auth.uid()) OR (chats.landlord_id = auth.uid())))));


CREATE TRIGGER trigger_notify_new_message AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION notify_new_message();


