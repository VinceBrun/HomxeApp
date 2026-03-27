--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";

--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: get_user_role("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."get_user_role"("user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN (
        SELECT role_name 
        FROM "public"."user_roles" ur 
        JOIN "public"."roles" r ON ur.role_id = r.id 
        WHERE ur.user_id = user_id::bigint
        LIMIT 1
    );
END;
$$;


ALTER FUNCTION "public"."get_user_role"("user_id" "uuid") OWNER TO "postgres";

--
-- Name: has_role("uuid", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."has_role"("user_id" "uuid", "role_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM "public"."user_roles" ur 
        JOIN "public"."roles" r ON ur.role_id = r.id 
        WHERE ur.user_id = user_id::bigint 
        AND r.role_name = role_name
    );
END;
$$;


ALTER FUNCTION "public"."has_role"("user_id" "uuid", "role_name" "text") OWNER TO "postgres";

--
-- Name: notify_new_message(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."notify_new_message"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  -- You’ll later call an Edge Function from here
  -- For now, just a placeholder log
  raise notice 'New message by %, content: %', NEW.sender_id, NEW.content;
  return new;
end;
$$;


ALTER FUNCTION "public"."notify_new_message"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."amenities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "icon_url" "text"
);


ALTER TABLE "public"."amenities" OWNER TO "postgres";

--
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."chats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "landlord_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."chats" OWNER TO "postgres";

--
-- Name: complaints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."complaints" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenancy_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "status" "text" DEFAULT 'submitted'::"text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "complaints_status_check" CHECK (("status" = ANY (ARRAY['submitted'::"text", 'in_progress'::"text", 'resolved'::"text"])))
);


ALTER TABLE "public"."complaints" OWNER TO "postgres";

--
-- Name: device_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."device_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token" "text" NOT NULL,
    "platform" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "device_tokens_platform_check" CHECK (("platform" = ANY (ARRAY['ios'::"text", 'android'::"text", 'web'::"text"])))
);


ALTER TABLE "public"."device_tokens" OWNER TO "postgres";

--
-- Name: kyc_verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."kyc_verifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "id_type" "text" NOT NULL,
    "id_image_url" "text" NOT NULL,
    "selfie_image_url" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "admin_comment" "text",
    "submitted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "verified_at" timestamp with time zone,
    CONSTRAINT "kyc_verifications_id_type_check" CHECK (("id_type" = ANY (ARRAY['national_id'::"text", 'passport'::"text", 'driver_license'::"text"]))),
    CONSTRAINT "kyc_verifications_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'verified'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."kyc_verifications" OWNER TO "postgres";

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chat_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "content" "text",
    "type" "text" DEFAULT 'text'::"text",
    "status" "text" DEFAULT 'sent'::"text",
    "sent_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "seen_by" "uuid"[] DEFAULT '{}'::"uuid"[],
    "media_url" "text",
    "media_mime_type" "text",
    "edited_at" timestamp with time zone,
    "deleted" boolean DEFAULT false,
    "seen" boolean DEFAULT false,
    CONSTRAINT "messages_status_check" CHECK (("status" = ANY (ARRAY['sent'::"text", 'delivered'::"text", 'seen'::"text"]))),
    CONSTRAINT "messages_type_check" CHECK (("type" = ANY (ARRAY['text'::"text", 'image'::"text", 'video'::"text", 'audio'::"text"])))
);


ALTER TABLE "public"."messages" OWNER TO "postgres";

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "phone_number" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "role" "text"[] DEFAULT ARRAY[]::"text"[],
    "avatar_url" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";

--
-- Name: last_messages; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW "public"."last_messages" AS
 SELECT DISTINCT ON ("m"."chat_id") "m"."chat_id",
    "m"."id" AS "message_id",
    "m"."content",
    "m"."type",
    "m"."sent_at",
    "m"."status",
    "m"."sender_id",
    "p"."full_name" AS "sender_name",
    ("p"."avatar_url" ->> "p"."role"[1]) AS "sender_avatar"
   FROM ("public"."messages" "m"
     JOIN "public"."profiles" "p" ON (("p"."id" = "m"."sender_id")))
  ORDER BY "m"."chat_id", "m"."sent_at" DESC
  WITH NO DATA;


ALTER TABLE "public"."last_messages" OWNER TO "postgres";

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "property_id" "uuid",
    "tenancy_id" "uuid",
    "amount" numeric(12,2) NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "payment_method" "text",
    "reference" "text",
    "paid_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "payments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'successful'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";

--
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."properties" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "landlord_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "type" "text" NOT NULL,
    "location" "text" NOT NULL,
    "price" numeric NOT NULL,
    "images" "text"[] DEFAULT ARRAY[]::"text"[],
    "videos" "text"[] DEFAULT ARRAY[]::"text"[],
    "facilities" "jsonb",
    "is_available" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "category" "text",
    "status" "text" DEFAULT 'listed'::"text",
    "latitude" double precision,
    "longitude" double precision,
    CONSTRAINT "properties_status_check" CHECK (("status" = ANY (ARRAY['listed'::"text", 'sold'::"text"])))
);


ALTER TABLE "public"."properties" OWNER TO "postgres";

--
-- Name: property_amenities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."property_amenities" (
    "property_id" "uuid" NOT NULL,
    "amenity_id" "uuid" NOT NULL
);


ALTER TABLE "public"."property_amenities" OWNER TO "postgres";

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "tenant_id" "uuid",
    "landlord_id" "uuid",
    "rating" integer,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";

--
-- Name: saved_properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."saved_properties" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "property_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."saved_properties" OWNER TO "postgres";

--
-- Name: schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."schedules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "tenant_id" "uuid",
    "scheduled_date" "date" NOT NULL,
    "scheduled_time" time without time zone NOT NULL,
    "mode" "text" DEFAULT 'physical'::"text",
    "status" "text" DEFAULT 'pending'::"text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "schedules_mode_check" CHECK (("mode" = ANY (ARRAY['physical'::"text", 'virtual'::"text"]))),
    CONSTRAINT "schedules_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'confirmed'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."schedules" OWNER TO "postgres";

--
-- Name: tenancies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."tenancies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "lease_start_date" "date" NOT NULL,
    "lease_end_date" "date" NOT NULL,
    "rent_amount" numeric NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "tenancies_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'terminated'::"text", 'pending'::"text"])))
);


ALTER TABLE "public"."tenancies" OWNER TO "postgres";

--
-- Name: top_landlords_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW "public"."top_landlords_view" AS
 WITH "property_counts" AS (
         SELECT "properties"."landlord_id",
            "count"(*) AS "num_properties"
           FROM "public"."properties"
          GROUP BY "properties"."landlord_id"
        ), "review_stats" AS (
         SELECT "reviews"."landlord_id",
            "avg"("reviews"."rating") AS "average_rating",
            "count"(*) AS "review_count"
           FROM "public"."reviews"
          GROUP BY "reviews"."landlord_id"
        ), "recent_activity" AS (
         SELECT "properties"."landlord_id",
            "max"("properties"."created_at") AS "last_activity",
                CASE
                    WHEN ("max"("properties"."created_at") > ("now"() - '30 days'::interval)) THEN 1
                    ELSE 0
                END AS "recent_activity_score"
           FROM "public"."properties"
          GROUP BY "properties"."landlord_id"
        )
 SELECT "p"."id" AS "landlord_id",
    "p"."full_name",
    "pc"."num_properties",
    "rs"."average_rating",
    "rs"."review_count",
    "ra"."recent_activity_score",
    (((((("pc"."num_properties")::numeric * 0.4) + (COALESCE("rs"."average_rating", (0)::numeric) * 0.3)))::double precision + ("log"(((COALESCE("rs"."review_count", (0)::bigint) + 1))::double precision) * (0.2)::double precision)) + ((("ra"."recent_activity_score")::numeric * 0.1))::double precision) AS "score"
   FROM ((("public"."profiles" "p"
     LEFT JOIN "property_counts" "pc" ON (("p"."id" = "pc"."landlord_id")))
     LEFT JOIN "review_stats" "rs" ON (("p"."id" = "rs"."landlord_id")))
     LEFT JOIN "recent_activity" "ra" ON (("p"."id" = "ra"."landlord_id")))
  WHERE ('landlord'::"text" = ANY ("p"."role"));


ALTER TABLE "public"."top_landlords_view" OWNER TO "postgres";

--
-- Name: top_landlords_with_email; Type: VIEW; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW "public"."top_landlords_with_email" AS
 WITH "property_counts" AS (
         SELECT "properties"."landlord_id",
            "count"(*) AS "num_properties"
           FROM "public"."properties"
          GROUP BY "properties"."landlord_id"
        ), "review_stats" AS (
         SELECT "reviews"."landlord_id",
            "avg"("reviews"."rating") AS "average_rating",
            "count"(*) AS "review_count"
           FROM "public"."reviews"
          GROUP BY "reviews"."landlord_id"
        ), "recent_activity" AS (
         SELECT "properties"."landlord_id",
            "max"("properties"."created_at") AS "last_activity",
                CASE
                    WHEN ("max"("properties"."created_at") > ("now"() - '30 days'::interval)) THEN 1
                    ELSE 0
                END AS "recent_activity_score"
           FROM "public"."properties"
          GROUP BY "properties"."landlord_id"
        )
 SELECT "p"."id" AS "landlord_id",
    "p"."full_name",
    "u"."email",
    "pc"."num_properties",
    "rs"."average_rating",
    "rs"."review_count",
    "ra"."recent_activity_score",
    (((((("pc"."num_properties")::numeric * 0.4) + (COALESCE("rs"."average_rating", (0)::numeric) * 0.3)))::double precision + ("log"(((COALESCE("rs"."review_count", (0)::bigint) + 1))::double precision) * (0.2)::double precision)) + ((("ra"."recent_activity_score")::numeric * 0.1))::double precision) AS "score"
   FROM (((("public"."profiles" "p"
     JOIN "auth"."users" "u" ON (("u"."id" = "p"."id")))
     LEFT JOIN "property_counts" "pc" ON (("p"."id" = "pc"."landlord_id")))
     LEFT JOIN "review_stats" "rs" ON (("p"."id" = "rs"."landlord_id")))
     LEFT JOIN "recent_activity" "ra" ON (("p"."id" = "ra"."landlord_id")))
  WHERE ('landlord'::"text" = ANY ("p"."role"));


ALTER TABLE "public"."top_landlords_with_email" OWNER TO "postgres";

--
-- Name: typing_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."typing_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chat_id" "uuid",
    "user_id" "uuid",
    "is_typing" boolean DEFAULT false,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."typing_status" OWNER TO "postgres";

--
-- Name: amenities amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."amenities"
    ADD CONSTRAINT "amenities_pkey" PRIMARY KEY ("id");


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."complaints"
    ADD CONSTRAINT "complaints_pkey" PRIMARY KEY ("id");


--
-- Name: device_tokens device_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."device_tokens"
    ADD CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: kyc_verifications kyc_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."kyc_verifications"
    ADD CONSTRAINT "kyc_verifications_pkey" PRIMARY KEY ("id");


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");


--
-- Name: reviews one_review_per_property; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "one_review_per_property" UNIQUE ("property_id", "tenant_id");


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");


--
-- Name: payments payments_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_reference_key" UNIQUE ("reference");


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_pkey" PRIMARY KEY ("id");


--
-- Name: property_amenities property_amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."property_amenities"
    ADD CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("property_id", "amenity_id");


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");


--
-- Name: saved_properties saved_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."saved_properties"
    ADD CONSTRAINT "saved_properties_pkey" PRIMARY KEY ("id");


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_pkey" PRIMARY KEY ("id");


--
-- Name: tenancies tenancies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."tenancies"
    ADD CONSTRAINT "tenancies_pkey" PRIMARY KEY ("id");


--
-- Name: typing_status typing_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."typing_status"
    ADD CONSTRAINT "typing_status_pkey" PRIMARY KEY ("id");


--
-- Name: typing_status typing_status_unique_chat_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."typing_status"
    ADD CONSTRAINT "typing_status_unique_chat_user" UNIQUE ("chat_id", "user_id");


--
-- Name: chats unique_chat_pair; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "unique_chat_pair" UNIQUE ("tenant_id", "landlord_id");


--
-- Name: properties unique_landlord_listing; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "unique_landlord_listing" UNIQUE ("landlord_id", "title", "location");


--
-- Name: saved_properties unique_saved_property; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."saved_properties"
    ADD CONSTRAINT "unique_saved_property" UNIQUE ("tenant_id", "property_id");


--
-- Name: idx_complaints_tenancy_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_complaints_tenancy_id" ON "public"."complaints" USING "btree" ("tenancy_id");


--
-- Name: idx_tenancies_property_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_tenancies_property_id" ON "public"."tenancies" USING "btree" ("property_id");


--
-- Name: idx_tenancies_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_tenancies_tenant_id" ON "public"."tenancies" USING "btree" ("tenant_id");


--
-- Name: messages trigger_notify_new_message; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "trigger_notify_new_message" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."notify_new_message"();


--
-- Name: chats chats_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: chats chats_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: complaints complaints_tenancy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."complaints"
    ADD CONSTRAINT "complaints_tenancy_id_fkey" FOREIGN KEY ("tenancy_id") REFERENCES "public"."tenancies"("id") ON DELETE CASCADE;


--
-- Name: device_tokens device_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."device_tokens"
    ADD CONSTRAINT "device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: kyc_verifications kyc_verifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."kyc_verifications"
    ADD CONSTRAINT "kyc_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: messages messages_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: payments payments_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;


--
-- Name: payments payments_tenancy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_tenancy_id_fkey" FOREIGN KEY ("tenancy_id") REFERENCES "public"."tenancies"("id") ON DELETE SET NULL;


--
-- Name: payments payments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: properties properties_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: property_amenities property_amenities_amenity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."property_amenities"
    ADD CONSTRAINT "property_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE CASCADE;


--
-- Name: property_amenities property_amenities_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."property_amenities"
    ADD CONSTRAINT "property_amenities_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;


--
-- Name: reviews reviews_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: reviews reviews_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;


--
-- Name: reviews reviews_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: saved_properties saved_properties_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."saved_properties"
    ADD CONSTRAINT "saved_properties_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;


--
-- Name: saved_properties saved_properties_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."saved_properties"
    ADD CONSTRAINT "saved_properties_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: schedules schedules_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;


--
-- Name: schedules schedules_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."schedules"
    ADD CONSTRAINT "schedules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: tenancies tenancies_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."tenancies"
    ADD CONSTRAINT "tenancies_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;


--
-- Name: tenancies tenancies_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."tenancies"
    ADD CONSTRAINT "tenancies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: typing_status typing_status_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."typing_status"
    ADD CONSTRAINT "typing_status_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE CASCADE;


--
-- Name: typing_status typing_status_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."typing_status"
    ADD CONSTRAINT "typing_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: messages Allow chat participants to update message seen; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow chat participants to update message seen" ON "public"."messages" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."chats" "c"
  WHERE (("c"."id" = "messages"."chat_id") AND (("c"."tenant_id" = "auth"."uid"()) OR ("c"."landlord_id" = "auth"."uid"())))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."chats" "c"
  WHERE (("c"."id" = "messages"."chat_id") AND (("c"."tenant_id" = "auth"."uid"()) OR ("c"."landlord_id" = "auth"."uid"()))))));


--
-- Name: messages Allow sender or receiver to read message; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow sender or receiver to read message" ON "public"."messages" FOR SELECT USING ((("sender_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."chats"
  WHERE (("chats"."id" = "messages"."chat_id") AND (("chats"."tenant_id" = "auth"."uid"()) OR ("chats"."landlord_id" = "auth"."uid"())))))));


--
-- Name: messages Allow sender to insert message; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow sender to insert message" ON "public"."messages" FOR INSERT WITH CHECK (("sender_id" = "auth"."uid"()));


--
-- Name: kyc_verifications Allow users to insert their own KYC record; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow users to insert their own KYC record" ON "public"."kyc_verifications" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));


--
-- Name: properties Anyone can read available properties; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can read available properties" ON "public"."properties" FOR SELECT USING (("is_available" = true));


--
-- Name: reviews Anyone can read reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can read reviews" ON "public"."reviews" FOR SELECT USING (true);


--
-- Name: properties Anyone logged in can view properties; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone logged in can view properties" ON "public"."properties" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: profiles Authenticated user can read own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated user can read own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));


--
-- Name: kyc_verifications Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON "public"."kyc_verifications" FOR INSERT TO "authenticated" WITH CHECK (true);


--
-- Name: kyc_verifications Enable read access for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for authenticated users" ON "public"."kyc_verifications" FOR SELECT USING (true);


--
-- Name: properties Landlord can manage their own properties; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Landlord can manage their own properties" ON "public"."properties" USING (("auth"."uid"() = "landlord_id"));


--
-- Name: properties Landlords can add properties; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Landlords can add properties" ON "public"."properties" FOR INSERT WITH CHECK (("auth"."uid"() = "landlord_id"));


--
-- Name: properties Landlords can delete their properties; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Landlords can delete their properties" ON "public"."properties" FOR DELETE USING (("auth"."uid"() = "landlord_id"));


--
-- Name: properties Landlords can modify their properties; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Landlords can modify their properties" ON "public"."properties" FOR UPDATE USING (("auth"."uid"() = "landlord_id")) WITH CHECK (("auth"."uid"() = "landlord_id"));


--
-- Name: schedules Landlords can view schedules for their properties; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Landlords can view schedules for their properties" ON "public"."schedules" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "schedules"."property_id") AND ("properties"."landlord_id" = "auth"."uid"())))));


--
-- Name: typing_status Only chat participants can update typing; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only chat participants can update typing" ON "public"."typing_status" USING (("chat_id" IN ( SELECT "chats"."id"
   FROM "public"."chats"
  WHERE (("chats"."tenant_id" = "auth"."uid"()) OR ("chats"."landlord_id" = "auth"."uid"())))));


--
-- Name: profiles Public read access to profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public read access to profiles" ON "public"."profiles" FOR SELECT USING (true);


--
-- Name: chats Tenant or landlord can access their chats; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Tenant or landlord can access their chats" ON "public"."chats" USING ((("auth"."uid"() = "tenant_id") OR ("auth"."uid"() = "landlord_id")));


--
-- Name: reviews Tenants can manage their own reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Tenants can manage their own reviews" ON "public"."reviews" USING (("auth"."uid"() = "tenant_id"));


--
-- Name: schedules Tenants can manage their own schedules; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Tenants can manage their own schedules" ON "public"."schedules" USING (("auth"."uid"() = "tenant_id"));


--
-- Name: saved_properties Tenants can manage their saved properties; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Tenants can manage their saved properties" ON "public"."saved_properties" USING (("auth"."uid"() = "tenant_id"));


--
-- Name: profiles User can insert own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "User can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));


--
-- Name: device_tokens User can manage own device tokens; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "User can manage own device tokens" ON "public"."device_tokens" USING (("user_id" = "auth"."uid"()));


--
-- Name: profiles User can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "User can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));


--
-- Name: messages Users can edit/delete their own messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can edit/delete their own messages" ON "public"."messages" FOR UPDATE USING (("sender_id" = "auth"."uid"()));


--
-- Name: kyc_verifications Users can submit KYC; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can submit KYC" ON "public"."kyc_verifications" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));


--
-- Name: kyc_verifications Users can view their own KYC; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own KYC" ON "public"."kyc_verifications" FOR SELECT USING (("user_id" = "auth"."uid"()));


--
-- Name: payments admin_delete_payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_delete_payments" ON "public"."payments" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ('admin'::"text" = ANY ("profiles"."role"))))));


--
-- Name: payments admin_insert_payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_insert_payments" ON "public"."payments" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ('admin'::"text" = ANY ("profiles"."role"))))));


--
-- Name: payments admin_select_all_payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_select_all_payments" ON "public"."payments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ('admin'::"text" = ANY ("profiles"."role"))))));


--
-- Name: payments admin_update_payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "admin_update_payments" ON "public"."payments" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ('admin'::"text" = ANY ("profiles"."role"))))));


--
-- Name: amenities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."amenities" ENABLE ROW LEVEL SECURITY;

--
-- Name: chats; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;

--
-- Name: complaints; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."complaints" ENABLE ROW LEVEL SECURITY;

--
-- Name: device_tokens; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."device_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: kyc_verifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."kyc_verifications" ENABLE ROW LEVEL SECURITY;

--
-- Name: tenancies landlord_access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "landlord_access" ON "public"."tenancies" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "tenancies"."property_id") AND ("properties"."landlord_id" = "auth"."uid"())))));


--
-- Name: complaints landlord_complaint_access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "landlord_complaint_access" ON "public"."complaints" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."tenancies"
     JOIN "public"."properties" ON (("properties"."id" = "tenancies"."property_id")))
  WHERE (("tenancies"."id" = "complaints"."tenancy_id") AND ("properties"."landlord_id" = "auth"."uid"())))));


--
-- Name: payments landlord_select_payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "landlord_select_payments" ON "public"."payments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "payments"."property_id") AND ("properties"."landlord_id" = "auth"."uid"())))));


--
-- Name: messages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

--
-- Name: payments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: properties; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."properties" ENABLE ROW LEVEL SECURITY;

--
-- Name: property_amenities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."property_amenities" ENABLE ROW LEVEL SECURITY;

--
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;

--
-- Name: saved_properties; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."saved_properties" ENABLE ROW LEVEL SECURITY;

--
-- Name: schedules; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."schedules" ENABLE ROW LEVEL SECURITY;

--
-- Name: tenancies; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."tenancies" ENABLE ROW LEVEL SECURITY;

--
-- Name: tenancies tenant_access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "tenant_access" ON "public"."tenancies" FOR SELECT USING (("tenant_id" = "auth"."uid"()));


--
-- Name: complaints tenant_complaint_access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "tenant_complaint_access" ON "public"."complaints" USING ((EXISTS ( SELECT 1
   FROM "public"."tenancies"
  WHERE (("tenancies"."id" = "complaints"."tenancy_id") AND ("tenancies"."tenant_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenancies"
  WHERE (("tenancies"."id" = "complaints"."tenancy_id") AND ("tenancies"."tenant_id" = "auth"."uid"())))));


--
-- Name: payments tenant_insert_payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "tenant_insert_payments" ON "public"."payments" FOR INSERT WITH CHECK (("tenant_id" = "auth"."uid"()));


--
-- Name: payments tenant_select_payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "tenant_select_payments" ON "public"."payments" FOR SELECT USING (("tenant_id" = "auth"."uid"()));


--
-- Name: typing_status; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."typing_status" ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: FUNCTION "get_user_role"("user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "has_role"("user_id" "uuid", "role_name" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."has_role"("user_id" "uuid", "role_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."has_role"("user_id" "uuid", "role_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_role"("user_id" "uuid", "role_name" "text") TO "service_role";


--
-- Name: FUNCTION "notify_new_message"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."notify_new_message"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_new_message"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_new_message"() TO "service_role";


--
-- Name: TABLE "amenities"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."amenities" TO "anon";
GRANT ALL ON TABLE "public"."amenities" TO "authenticated";
GRANT ALL ON TABLE "public"."amenities" TO "service_role";


--
-- Name: TABLE "chats"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";


--
-- Name: TABLE "complaints"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."complaints" TO "anon";
GRANT ALL ON TABLE "public"."complaints" TO "authenticated";
GRANT ALL ON TABLE "public"."complaints" TO "service_role";


--
-- Name: TABLE "device_tokens"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."device_tokens" TO "anon";
GRANT ALL ON TABLE "public"."device_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."device_tokens" TO "service_role";


--
-- Name: TABLE "kyc_verifications"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."kyc_verifications" TO "anon";
GRANT ALL ON TABLE "public"."kyc_verifications" TO "authenticated";
GRANT ALL ON TABLE "public"."kyc_verifications" TO "service_role";


--
-- Name: TABLE "messages"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";


--
-- Name: TABLE "profiles"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";


--
-- Name: TABLE "last_messages"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."last_messages" TO "anon";
GRANT ALL ON TABLE "public"."last_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."last_messages" TO "service_role";


--
-- Name: TABLE "payments"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";


--
-- Name: TABLE "properties"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."properties" TO "anon";
GRANT ALL ON TABLE "public"."properties" TO "authenticated";
GRANT ALL ON TABLE "public"."properties" TO "service_role";


--
-- Name: TABLE "property_amenities"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."property_amenities" TO "anon";
GRANT ALL ON TABLE "public"."property_amenities" TO "authenticated";
GRANT ALL ON TABLE "public"."property_amenities" TO "service_role";


--
-- Name: TABLE "reviews"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";


--
-- Name: TABLE "saved_properties"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."saved_properties" TO "anon";
GRANT ALL ON TABLE "public"."saved_properties" TO "authenticated";
GRANT ALL ON TABLE "public"."saved_properties" TO "service_role";


--
-- Name: TABLE "schedules"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."schedules" TO "anon";
GRANT ALL ON TABLE "public"."schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."schedules" TO "service_role";


--
-- Name: TABLE "tenancies"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."tenancies" TO "anon";
GRANT ALL ON TABLE "public"."tenancies" TO "authenticated";
GRANT ALL ON TABLE "public"."tenancies" TO "service_role";


--
-- Name: TABLE "top_landlords_view"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."top_landlords_view" TO "anon";
GRANT ALL ON TABLE "public"."top_landlords_view" TO "authenticated";
GRANT ALL ON TABLE "public"."top_landlords_view" TO "service_role";


--
-- Name: TABLE "top_landlords_with_email"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."top_landlords_with_email" TO "anon";
GRANT ALL ON TABLE "public"."top_landlords_with_email" TO "authenticated";
GRANT ALL ON TABLE "public"."top_landlords_with_email" TO "service_role";


--
-- Name: TABLE "typing_status"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."typing_status" TO "anon";
GRANT ALL ON TABLE "public"."typing_status" TO "authenticated";
GRANT ALL ON TABLE "public"."typing_status" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- PostgreSQL database dump complete
--

RESET ALL;
