--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-10 16:51:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 881 (class 1247 OID 16836)
-- Name: bank_transaction_type; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.bank_transaction_type AS ENUM (
    'DEPOSIT',
    'WITHDRAWAL'
    );


ALTER TYPE public.bank_transaction_type OWNER TO d107;

--
-- TOC entry 869 (class 1247 OID 18478)
-- Name: banktransactiontype; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.banktransactiontype AS ENUM (
    'DEPOSIT',
    'WITHDRAWAL'
    );


ALTER TYPE public.banktransactiontype OWNER TO d107;

--
-- TOC entry 884 (class 1247 OID 16842)
-- Name: funding_category; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.funding_category AS ENUM (
    'BIRTHDAY',
    'HOUSEWARMING',
    'WEDDING',
    'GRADUATION',
    'EMPLOYMENT',
    'CHILDBIRTH',
    'ETC'
    );


ALTER TYPE public.funding_category OWNER TO d107;

--
-- TOC entry 887 (class 1247 OID 16858)
-- Name: funding_scope; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.funding_scope AS ENUM (
    'PUBLIC',
    'PRIVATE'
    );


ALTER TYPE public.funding_scope OWNER TO d107;

--
-- TOC entry 890 (class 1247 OID 16864)
-- Name: funding_status; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.funding_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'CANCELED',
    'SHIPPING',
    'DELIVERED'
    );


ALTER TYPE public.funding_status OWNER TO d107;

--
-- TOC entry 872 (class 1247 OID 18486)
-- Name: fundingscategory; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.fundingscategory AS ENUM (
    'BIRTHDAY',
    'CHILDBIRTH',
    'EMPLOYMENT',
    'ETC',
    'GRADUATION',
    'HOUSEWARMING',
    'WEDDING'
    );


ALTER TYPE public.fundingscategory OWNER TO d107;

--
-- TOC entry 875 (class 1247 OID 18504)
-- Name: fundingsscope; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.fundingsscope AS ENUM (
    'PRIVATE',
    'PUBLIC'
    );


ALTER TYPE public.fundingsscope OWNER TO d107;

--
-- TOC entry 878 (class 1247 OID 18512)
-- Name: fundingsstatus; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.fundingsstatus AS ENUM (
    'CANCELED',
    'COMPLETED',
    'DELIVERED',
    'PENDING',
    'SHIPPING'
    );


ALTER TYPE public.fundingsstatus OWNER TO d107;

--
-- TOC entry 893 (class 1247 OID 16876)
-- Name: letter_private; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.letter_private AS ENUM (
    'PUBLIC',
    'PRIVATE'
    );


ALTER TYPE public.letter_private OWNER TO d107;

--
-- TOC entry 902 (class 1247 OID 18526)
-- Name: lettersprivate; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.lettersprivate AS ENUM (
    'PRIVATE',
    'PUBLIC'
    );


ALTER TYPE public.lettersprivate OWNER TO d107;

--
-- TOC entry 896 (class 1247 OID 16882)
-- Name: participant_refund_status; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.participant_refund_status AS ENUM (
    'REFUND',
    'NOT_REFUND'
    );


ALTER TYPE public.participant_refund_status OWNER TO d107;

--
-- TOC entry 905 (class 1247 OID 18534)
-- Name: participantsrefundstatus; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.participantsrefundstatus AS ENUM (
    'NOT_REFUND',
    'REFUND'
    );


ALTER TYPE public.participantsrefundstatus OWNER TO d107;

--
-- TOC entry 899 (class 1247 OID 16888)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAIL'
    );


ALTER TYPE public.payment_status OWNER TO d107;

--
-- TOC entry 933 (class 1247 OID 16896)
-- Name: payment_transaction_type; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.payment_transaction_type AS ENUM (
    'FUNDING',
    'PRODUCT',
    'REFUND'
    );


ALTER TYPE public.payment_transaction_type OWNER TO d107;

--
-- TOC entry 908 (class 1247 OID 18542)
-- Name: paymentsstatus; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.paymentsstatus AS ENUM (
    'FAIL',
    'PENDING',
    'SUCCESS'
    );


ALTER TYPE public.paymentsstatus OWNER TO d107;

--
-- TOC entry 911 (class 1247 OID 18552)
-- Name: paymentstransactiontype; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.paymentstransactiontype AS ENUM (
    'FUNDING',
    'PRODUCT'
    );


ALTER TYPE public.paymentstransactiontype OWNER TO d107;

--
-- TOC entry 936 (class 1247 OID 16902)
-- Name: product_category; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.product_category AS ENUM (
    'ELECTRONICS',
    'CLOTHING',
    'BEAUTY',
    'HOMEAPPLIANCES',
    'SPORTS',
    'FOOD',
    'TOYS',
    'FURNITURE',
    'LIVING',
    'OTHERS'
    );


ALTER TYPE public.product_category OWNER TO d107;

--
-- TOC entry 914 (class 1247 OID 18560)
-- Name: productscategory; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.productscategory AS ENUM (
    'BEAUTY',
    'CLOTHING',
    'ELECTRONICS',
    'FOOD',
    'FURNITURE',
    'HOMEAPPLIANCES',
    'LIVING',
    'OTHERS',
    'SPORTS',
    'TOYS'
    );


ALTER TYPE public.productscategory OWNER TO d107;

--
-- TOC entry 939 (class 1247 OID 16924)
-- Name: user_age_range; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.user_age_range AS ENUM (
    'TEENAGER',
    'YOUNG_ADULT',
    'ADULT',
    'MIDDLE_AGED',
    'SENIOR'
    );


ALTER TYPE public.user_age_range OWNER TO d107;

--
-- TOC entry 942 (class 1247 OID 16936)
-- Name: user_gender; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.user_gender AS ENUM (
    'MALE',
    'FEMALE'
    );


ALTER TYPE public.user_gender OWNER TO d107;

--
-- TOC entry 917 (class 1247 OID 18584)
-- Name: usersagerange; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.usersagerange AS ENUM (
    'ADULT',
    'MIDDLE_AGED',
    'SENIOR',
    'TEENAGER',
    'YOUNG_ADULT'
    );


ALTER TYPE public.usersagerange OWNER TO d107;

--
-- TOC entry 920 (class 1247 OID 18598)
-- Name: usersgender; Type: TYPE; Schema: public; Owner: d107
--

CREATE TYPE public.usersgender AS ENUM (
    'FEMALE',
    'MALE'
    );


ALTER TYPE public.usersgender OWNER TO d107;

--
-- TOC entry 3342 (class 2605 OID 18484)
-- Name: CAST (public.banktransactiontype AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.banktransactiontype AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3343 (class 2605 OID 18502)
-- Name: CAST (public.fundingscategory AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.fundingscategory AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3344 (class 2605 OID 18510)
-- Name: CAST (public.fundingsscope AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.fundingsscope AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3345 (class 2605 OID 18524)
-- Name: CAST (public.fundingsstatus AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.fundingsstatus AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3346 (class 2605 OID 18532)
-- Name: CAST (public.lettersprivate AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.lettersprivate AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3347 (class 2605 OID 18540)
-- Name: CAST (public.participantsrefundstatus AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.participantsrefundstatus AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3348 (class 2605 OID 18550)
-- Name: CAST (public.paymentsstatus AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.paymentsstatus AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3349 (class 2605 OID 18558)
-- Name: CAST (public.paymentstransactiontype AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.paymentstransactiontype AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3350 (class 2605 OID 18582)
-- Name: CAST (public.productscategory AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.productscategory AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3351 (class 2605 OID 18596)
-- Name: CAST (public.usersagerange AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.usersagerange AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3352 (class 2605 OID 18604)
-- Name: CAST (public.usersgender AS character varying); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (public.usersgender AS character varying) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3252 (class 2605 OID 18483)
-- Name: CAST (character varying AS public.banktransactiontype); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.banktransactiontype) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3253 (class 2605 OID 18501)
-- Name: CAST (character varying AS public.fundingscategory); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.fundingscategory) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3254 (class 2605 OID 18509)
-- Name: CAST (character varying AS public.fundingsscope); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.fundingsscope) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3255 (class 2605 OID 18523)
-- Name: CAST (character varying AS public.fundingsstatus); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.fundingsstatus) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3256 (class 2605 OID 18531)
-- Name: CAST (character varying AS public.lettersprivate); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.lettersprivate) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3257 (class 2605 OID 18539)
-- Name: CAST (character varying AS public.participantsrefundstatus); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.participantsrefundstatus) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3258 (class 2605 OID 18549)
-- Name: CAST (character varying AS public.paymentsstatus); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.paymentsstatus) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3259 (class 2605 OID 18557)
-- Name: CAST (character varying AS public.paymentstransactiontype); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.paymentstransactiontype) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3260 (class 2605 OID 18581)
-- Name: CAST (character varying AS public.productscategory); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.productscategory) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3261 (class 2605 OID 18595)
-- Name: CAST (character varying AS public.usersagerange); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.usersagerange) WITH INOUT AS IMPLICIT;


--
-- TOC entry 3262 (class 2605 OID 18603)
-- Name: CAST (character varying AS public.usersgender); Type: CAST; Schema: -; Owner: -
--

CREATE CAST (character varying AS public.usersgender) WITH INOUT AS IMPLICIT;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 18606)
-- Name: bank_transaction; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.bank_transaction (
                                         amount integer,
                                         transaction_id integer NOT NULL,
                                         date timestamp(6) with time zone,
                                         user_id bigint NOT NULL,
                                         bank_name character varying(20),
                                         transaction_type public.bank_transaction_type
);


ALTER TABLE public.bank_transaction OWNER TO d107;

--
-- TOC entry 217 (class 1259 OID 18605)
-- Name: bank_transaction_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

ALTER TABLE public.bank_transaction ALTER COLUMN transaction_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.bank_transaction_transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );


--
-- TOC entry 219 (class 1259 OID 18611)
-- Name: favorites; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.favorites (
                                  funding_id integer NOT NULL,
                                  user_id bigint NOT NULL
);


ALTER TABLE public.favorites OWNER TO d107;

--
-- TOC entry 237 (class 1259 OID 18772)
-- Name: friends; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.friends (
                                id integer NOT NULL,
                                user_id bigint NOT NULL,
                                friend_id bigint NOT NULL
);


ALTER TABLE public.friends OWNER TO d107;

--
-- TOC entry 236 (class 1259 OID 18771)
-- Name: friends_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

CREATE SEQUENCE public.friends_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.friends_id_seq OWNER TO d107;

--
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 236
-- Name: friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: d107
--

ALTER SEQUENCE public.friends_id_seq OWNED BY public.friends.id;


--
-- TOC entry 221 (class 1259 OID 18617)
-- Name: fundings; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.fundings (
                                 funded_amount integer,
                                 funding_id integer NOT NULL,
                                 participants_number integer,
                                 product_id integer,
                                 created_at timestamp(6) with time zone,
                                 updated_at timestamp(6) with time zone,
                                 user_id bigint NOT NULL,
                                 category_name character varying(20),
                                 title character varying(20) NOT NULL,
                                 description text,
                                 category public.funding_category,
                                 scope public.funding_scope,
                                 status public.funding_status,
                                 image jsonb
);


ALTER TABLE public.fundings OWNER TO d107;

--
-- TOC entry 220 (class 1259 OID 18616)
-- Name: fundings_funding_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

ALTER TABLE public.fundings ALTER COLUMN funding_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.fundings_funding_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );


--
-- TOC entry 223 (class 1259 OID 18625)
-- Name: letters; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.letters (
                                funding_id integer NOT NULL,
                                letter_id integer NOT NULL,
                                created_at timestamp(6) with time zone,
                                updated_at timestamp(6) with time zone,
                                user_id bigint NOT NULL,
                                image character varying(255),
                                access public.letter_private,
                                comment text NOT NULL
);


ALTER TABLE public.letters OWNER TO d107;

--
-- TOC entry 222 (class 1259 OID 18624)
-- Name: letters_letter_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

ALTER TABLE public.letters ALTER COLUMN letter_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.letters_letter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );


--
-- TOC entry 224 (class 1259 OID 18632)
-- Name: participants; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.participants (
                                     funding_amount integer,
                                     funding_id integer NOT NULL,
                                     joined_at timestamp(6) with time zone,
                                     user_id bigint NOT NULL,
                                     refund_status public.participant_refund_status,
                                     id integer NOT NULL
);


ALTER TABLE public.participants OWNER TO d107;

--
-- TOC entry 235 (class 1259 OID 18761)
-- Name: participants_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

CREATE SEQUENCE public.participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.participants_id_seq OWNER TO d107;

--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 235
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: d107
--

ALTER SEQUENCE public.participants_id_seq OWNED BY public.participants.id;


--
-- TOC entry 226 (class 1259 OID 18638)
-- Name: payments; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.payments (
                                 amount integer,
                                 related_funding_id integer,
                                 related_product_id integer,
                                 transaction_id integer NOT NULL,
                                 date timestamp(6) with time zone,
                                 user_id bigint NOT NULL,
                                 status public.payment_status,
                                 transaction_type public.payment_transaction_type
);


ALTER TABLE public.payments OWNER TO d107;

--
-- TOC entry 225 (class 1259 OID 18637)
-- Name: payments_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

ALTER TABLE public.payments ALTER COLUMN transaction_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.payments_transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );


--
-- TOC entry 228 (class 1259 OID 18644)
-- Name: product_review; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.product_review (
                                       product_id integer NOT NULL,
                                       product_review_id integer NOT NULL,
                                       star integer,
                                       user_id bigint NOT NULL,
                                       image character varying(1024),
                                       title character varying(255) NOT NULL,
                                       body text
);


ALTER TABLE public.product_review OWNER TO d107;

--
-- TOC entry 227 (class 1259 OID 18643)
-- Name: product_review_product_review_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

ALTER TABLE public.product_review ALTER COLUMN product_review_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_review_product_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );


--
-- TOC entry 230 (class 1259 OID 18652)
-- Name: products; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.products (
                                 favorite integer,
                                 price integer NOT NULL,
                                 product_id integer NOT NULL,
                                 star double precision,
                                 created_at timestamp(6) with time zone,
                                 product_name character varying(100) NOT NULL,
                                 description character varying(255),
                                 image character varying(255),
                                 category public.product_category
);


ALTER TABLE public.products OWNER TO d107;

--
-- TOC entry 229 (class 1259 OID 18651)
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

ALTER TABLE public.products ALTER COLUMN product_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.products_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );


--
-- TOC entry 239 (class 1259 OID 18791)
-- Name: refund_fail_log; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.refund_fail_log (
                                        id integer NOT NULL,
                                        user_id bigint NOT NULL,
                                        funding_id bigint NOT NULL,
                                        amount integer NOT NULL,
                                        reason text,
                                        failed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.refund_fail_log OWNER TO d107;

--
-- TOC entry 238 (class 1259 OID 18790)
-- Name: refund_fail_log_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

CREATE SEQUENCE public.refund_fail_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refund_fail_log_id_seq OWNER TO d107;

--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 238
-- Name: refund_fail_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: d107
--

ALTER SEQUENCE public.refund_fail_log_id_seq OWNED BY public.refund_fail_log.id;


--
-- TOC entry 240 (class 1259 OID 18803)
-- Name: refund_fail_log_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

CREATE SEQUENCE public.refund_fail_log_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refund_fail_log_seq OWNER TO d107;

--
-- TOC entry 232 (class 1259 OID 18660)
-- Name: reviews; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.reviews (
                                funding_id integer NOT NULL,
                                review_id integer NOT NULL,
                                created_at timestamp(6) with time zone,
                                updated_at timestamp(6) with time zone,
                                user_id bigint NOT NULL,
                                visit bigint,
                                image character varying(500),
                                comment text NOT NULL
);


ALTER TABLE public.reviews OWNER TO d107;

--
-- TOC entry 231 (class 1259 OID 18659)
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

ALTER TABLE public.reviews ALTER COLUMN review_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.reviews_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );


--
-- TOC entry 234 (class 1259 OID 18668)
-- Name: users; Type: TABLE; Schema: public; Owner: d107
--

CREATE TABLE public.users (
                              balance integer,
                              birth date,
                              created_at timestamp(6) with time zone,
                              kakao_id bigint,
                              updated_at timestamp(6) with time zone,
                              user_id bigint NOT NULL,
                              nickname character varying(100),
                              profile_image character varying(500),
                              email character varying(255),
                              address text,
                              age_range public.user_age_range,
                              gender public.user_gender,
                              account_number character varying(100),
                              payment_password character varying(100)
);


ALTER TABLE public.users OWNER TO d107;

--
-- TOC entry 233 (class 1259 OID 18667)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: d107
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    );


--
-- TOC entry 3354 (class 2604 OID 18775)
-- Name: friends id; Type: DEFAULT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.friends ALTER COLUMN id SET DEFAULT nextval('public.friends_id_seq'::regclass);


--
-- TOC entry 3353 (class 2604 OID 18762)
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.participants ALTER COLUMN id SET DEFAULT nextval('public.participants_id_seq'::regclass);


--
-- TOC entry 3355 (class 2604 OID 18794)
-- Name: refund_fail_log id; Type: DEFAULT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.refund_fail_log ALTER COLUMN id SET DEFAULT nextval('public.refund_fail_log_id_seq'::regclass);


--
-- TOC entry 3358 (class 2606 OID 18610)
-- Name: bank_transaction bank_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.bank_transaction
    ADD CONSTRAINT bank_transaction_pkey PRIMARY KEY (transaction_id);


--
-- TOC entry 3360 (class 2606 OID 18615)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (funding_id, user_id);


--
-- TOC entry 3380 (class 2606 OID 18777)
-- Name: friends friends_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY (id);


--
-- TOC entry 3362 (class 2606 OID 18623)
-- Name: fundings fundings_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.fundings
    ADD CONSTRAINT fundings_pkey PRIMARY KEY (funding_id);


--
-- TOC entry 3364 (class 2606 OID 18631)
-- Name: letters letters_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.letters
    ADD CONSTRAINT letters_pkey PRIMARY KEY (letter_id);


--
-- TOC entry 3366 (class 2606 OID 18764)
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- TOC entry 3370 (class 2606 OID 18642)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (transaction_id);


--
-- TOC entry 3372 (class 2606 OID 18650)
-- Name: product_review product_review_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT product_review_pkey PRIMARY KEY (product_review_id);


--
-- TOC entry 3374 (class 2606 OID 18658)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- TOC entry 3384 (class 2606 OID 18799)
-- Name: refund_fail_log refund_fail_log_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.refund_fail_log
    ADD CONSTRAINT refund_fail_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3376 (class 2606 OID 18666)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 3382 (class 2606 OID 18779)
-- Name: friends unique_friendship; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT unique_friendship UNIQUE (user_id, friend_id);


--
-- TOC entry 3368 (class 2606 OID 18770)
-- Name: participants unique_funding_user; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT unique_funding_user UNIQUE (funding_id, user_id);


--
-- TOC entry 3378 (class 2606 OID 18674)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3388 (class 2606 OID 18690)
-- Name: fundings fk1s8d6wngf1jvbomftviprnn4i; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.fundings
    ADD CONSTRAINT fk1s8d6wngf1jvbomftviprnn4i FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3400 (class 2606 OID 18785)
-- Name: friends fk_friend; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT fk_friend FOREIGN KEY (friend_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3401 (class 2606 OID 18780)
-- Name: friends fk_user; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3386 (class 2606 OID 18680)
-- Name: favorites fkav5m05hwvfvqbwmngh7o9iq58; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fkav5m05hwvfvqbwmngh7o9iq58 FOREIGN KEY (funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 3398 (class 2606 OID 18745)
-- Name: reviews fkcgy7qjc1r99dp117y9en6lxye; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkcgy7qjc1r99dp117y9en6lxye FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3391 (class 2606 OID 18710)
-- Name: participants fkghixrahoj1s8cloinfx8lyeqa; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT fkghixrahoj1s8cloinfx8lyeqa FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3389 (class 2606 OID 18695)
-- Name: letters fkhm17sk47kuf18rkhqj34rarvn; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.letters
    ADD CONSTRAINT fkhm17sk47kuf18rkhqj34rarvn FOREIGN KEY (funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 3396 (class 2606 OID 18735)
-- Name: product_review fkib6mkfaqaj0beph37y4qxmu9x; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT fkib6mkfaqaj0beph37y4qxmu9x FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3393 (class 2606 OID 18725)
-- Name: payments fkj94hgy9v5fw1munb90tar2eje; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fkj94hgy9v5fw1munb90tar2eje FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3385 (class 2606 OID 18675)
-- Name: bank_transaction fkjrmuhdewo0yfa2dvmgcn1elpq; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.bank_transaction
    ADD CONSTRAINT fkjrmuhdewo0yfa2dvmgcn1elpq FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3387 (class 2606 OID 18685)
-- Name: favorites fkk7du8b8ewipawnnpg76d55fus; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fkk7du8b8ewipawnnpg76d55fus FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3397 (class 2606 OID 18730)
-- Name: product_review fklkf2n9dkjx32vcqqmds9v62; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT fklkf2n9dkjx32vcqqmds9v62 FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- TOC entry 3399 (class 2606 OID 18740)
-- Name: reviews fkovix3u5osjvq3ojmn7ymak0r4; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkovix3u5osjvq3ojmn7ymak0r4 FOREIGN KEY (funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 3390 (class 2606 OID 18700)
-- Name: letters fkp414782wb3mwd3ofl8dr0j0qq; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.letters
    ADD CONSTRAINT fkp414782wb3mwd3ofl8dr0j0qq FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3394 (class 2606 OID 18715)
-- Name: payments fkraqfiego1yh3f9ng2ysd6ml8n; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fkraqfiego1yh3f9ng2ysd6ml8n FOREIGN KEY (related_funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 3392 (class 2606 OID 18705)
-- Name: participants fkswlqnb8wufjbkh3y6wyv3debt; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT fkswlqnb8wufjbkh3y6wyv3debt FOREIGN KEY (funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 3395 (class 2606 OID 18720)
-- Name: payments fktlaodk75wtbg8265yh78fkpev; Type: FK CONSTRAINT; Schema: public; Owner: d107
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fktlaodk75wtbg8265yh78fkpev FOREIGN KEY (related_product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


-- Completed on 2025-04-10 16:51:28

--
-- PostgreSQL database dump complete
--

INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (1, 495000, 4, 0, '2025-03-25 14:44:19.630685+00', '삼성 갤럭시 탭 S9 FE', '삼성 갤럭시 탭 S9 FE은(는) 현대적인 디자인과 함께 고급 기능을 갖추어 업무와 엔터테인먼트를 모두 만족시킵니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/202/7be39af3-8a20-4d4f-a442-19c9011a8603-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20151704.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 19900, 20, 0, '2025-03-25 14:44:19.630685+00', '무신사 스탠다드 반팔티', '무신사 스탠다드 반팔티은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/219/7483191c-c87f-4b61-a644-6c7cae6de201-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152931.png', 'CLOTHING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 76000, 21, 0, '2025-03-25 14:44:19.630685+00', '리바이스 501 오리지널 진', '리바이스 501 오리지널 진은(는) 데일리룩은 물론 특별한 날에도 잘 어울리는 실용적인 패션 아이템입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/220/9a6ca45e-0bbf-4b8e-bfc3-293d9a0cfa2b-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152958.png', 'CLOTHING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 66000, 22, 0, '2025-03-25 14:44:19.630685+00', '헤라 블랙쿠션 21호', '헤라 블랙쿠션 21호은(는) 깊은 보습력과 은은한 향기로 당신의 뷰티 루틴을 한층 고급스럽게 만들어줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/222/1792d2e1-6213-417e-87f1-8b1a4fbcf820-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153104.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 28000, 24, 0, '2025-03-25 14:44:19.630685+00', 'AHC 아이크림 시즌10', 'AHC 아이크림 시즌10은(는) 가볍고 매끄러운 발림성으로 하루 종일 산뜻한 피부 상태를 유지시켜줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/225/924bd18a-6bb6-4f3f-acdf-bb407be30cdf-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153240.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 32600, 25, 0, '2025-03-25 14:44:19.630685+00', '클리오 킬커버 파운웨어 쿠션 XP', '클리오 킬커버 파운웨어 쿠션 XP은(는) 피부에 부담 없이 흡수되어 건강하고 빛나는 피부를 완성합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/227/a8bbb158-f33b-4934-b8f3-478a61575817-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153346.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 18700, 26, 0, '2025-03-25 14:44:19.630685+00', '미샤 타임레볼루션 퍼스트에센스', '미샤 타임레볼루션 퍼스트에센스은(는) 자연 유래 성분과 풍부한 영양감으로 피부에 생기를 부여하는 제품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/228/9f1e4fcb-43b7-4a8e-b591-502f012447bc-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153426.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 11500, 27, 0, '2025-03-25 14:44:19.630685+00', '네이처리퍼블릭 알로에 수딩젤', '네이처리퍼블릭 알로에 수딩젤은(는) 민감한 피부에도 안심하고 사용할 수 있는 순한 성분으로 구성되어 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/230/e9b74815-ce46-4c19-a993-79aefa16f3cf-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153535.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 179600, 29, 0, '2025-03-25 14:44:19.630685+00', '쿠쿠 전기밥솥 6인용 CRP-P0610FD', '쿠쿠 전기밥솥 6인용 CRP-P0610FD은(는) 사용자의 라이프스타일을 고려해 설계된 똑똑한 생활 가전입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/233/91b2f9b8-3252-4112-b313-8003d1818181-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153838.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 436000, 30, 0, '2025-03-25 14:44:19.630685+00', 'SK매직 전기레인지 IHR-B310F', 'SK매직 전기레인지 IHR-B310F은(는) 내구성과 성능을 동시에 갖춘 제품으로, 장기적인 만족감을 보장합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/235/0b0bd3f9-43fe-426a-a919-c1da87062d32-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153932.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 606500, 31, 0, '2025-03-25 14:44:19.630685+00', '다이슨 퓨어쿨 공기청정기', '다이슨 퓨어쿨 공기청정기은(는) 스마트한 기능과 고급스러운 디자인을 결합하여 공간의 품격을 높여줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/237/90f9dd70-d71b-42e7-98f8-0e256990d68a-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154035.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 241000, 32, 0, '2025-03-25 14:44:19.630685+00', '위닉스 뽀송 제습기 10L', '위닉스 뽀송 제습기 10L은(는) 내구성과 성능을 동시에 갖춘 제품으로, 장기적인 만족감을 보장합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/238/5dd954f4-f1e9-471a-847e-d67b4d7aae06-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154104.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 246000, 33, 0, '2025-03-25 14:44:19.630685+00', '테팔 무선청소기 에어포스 360', '테팔 무선청소기 에어포스 360은(는) 내구성과 성능을 동시에 갖춘 제품으로, 장기적인 만족감을 보장합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/240/a4a6161a-d66f-4698-a3c0-9e9c6ca9d871-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154210.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 80200, 34, 0, '2025-03-25 14:44:19.630685+00', '나이키 에어맥스 270', '나이키 에어맥스 270은(는) 야외 활동은 물론 실내 운동에서도 뛰어난 효율을 자랑하는 제품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/242/7b3c61e3-0b19-4d9d-87c7-438111b95346-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154305.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 16000, 35, 0, '2025-03-25 14:44:19.630685+00', '리복 홈트레이닝 요가매트', '리복 홈트레이닝 요가매트은(는) 활동적인 움직임을 자유롭게 지원하며, 스포츠 퍼포먼스를 극대화합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/243/37189e5d-4a0f-4dff-aab9-e23bb6507b89-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154337.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 42000, 36, 0, '2025-03-25 14:44:19.630685+00', '데상트 기능성 트레이닝 셔츠', '데상트 기능성 트레이닝 셔츠은(는) 체력 향상을 돕고 운동 루틴을 더 풍성하게 만들어주는 필수 아이템입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/245/8b67cfbc-89d4-4f02-b549-641a05e6a4c4-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154437.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 4400, 37, 5, '2025-03-25 14:44:19.630685+00', '팔도 비빔면 5입', '팔도 비빔면 4입은(는) 정성껏 준비된 맛으로 언제 먹어도 만족스러운 식사를 선사합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/256/1159cbd6-ff51-4318-9c5d-640886b0f72e-%ED%8C%94%EB%8F%84%20%EB%B9%84%EB%B9%94%EB%A9%B4%204%EC%9E%85.jpg', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (1, 40800, 23, 0, '2025-03-25 14:44:19.630685+00', '라로슈포제 시카플라스트 밤 B5', '라로슈포제 시카플라스트 밤 B5은(는) 민감한 피부에도 안심하고 사용할 수 있는 순한 성분으로 구성되어 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/223/96a9bb22-4545-471d-997f-97f442de0949-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153135.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 17500, 38, 0, '2025-03-25 14:44:19.630685+00', '맥심 모카골드 커피믹스 100T', '맥심 모카골드 커피믹스 100T은(는) 간편하면서도 든든한 한 끼를 책임지는 실속 있는 먹거리입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/260/f3d57083-7c97-458b-a659-8a868d5192ba-%EB%A7%A5%EC%8B%AC%20%EB%AA%A8%EC%B9%B4%EA%B3%A8%EB%93%9C%20%EC%BB%A4%ED%94%BC%EB%AF%B9%EC%8A%A4%20100T.jpg', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 59500, 39, 0, '2025-03-25 14:44:19.630685+00', '타요 미니카 풀세트', '타요 미니카 풀세트은(는) 아이들의 상상력을 자극하고 창의력을 길러주는 교육적 완구입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/262/926cdf2c-6c1b-418d-aedf-a216a99e91bb-%ED%83%80%EC%9A%94%20%EB%AF%B8%EB%8B%88%EC%B9%B4%20%ED%92%80%EC%84%B8%ED%8A%B8.jpg', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 3500, 40, 0, '2025-03-25 14:44:19.630685+00', '오뚜기 진라면 매운맛 5입', '오뚜기 진라면 매운맛 5입은(는) 집에서 간편하게 즐길 수 있는 고품질 프리미엄 식품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/251/845109b1-999a-495e-a4d8-8634eb5c33ce-%EC%A7%84%EB%9D%BC%EB%A9%B4.jpg', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 11000, 41, 0, '2025-03-25 14:44:19.630685+00', '빙그레 바나나맛우유 6입', '빙그레 바나나맛우유 6입은(는) 간편하면서도 든든한 한 끼를 책임지는 실속 있는 먹거리입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/252/5a898a05-2fe0-4c2a-a50f-d8dd5cd65aeb-%EB%B9%99%EA%B7%B8%EB%A0%88%20%EB%B0%94%EB%82%98%EB%82%98%EB%A7%9B%EC%9A%B0%EC%9C%A0%206%EC%9E%85.jpg', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 4700, 42, 0, '2025-03-25 14:44:19.630685+00', '에뛰드 닥터마스카라 픽서', '에뛰드 닥터마스카라 픽서은(는) 자연 유래 성분과 풍부한 영양감으로 피부에 생기를 부여하는 제품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/224/38032cca-0fe6-46c5-a043-7af4ed6ee6bc-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153205.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 11000, 43, 0, '2025-03-25 14:44:19.630685+00', 'CJ 햇반 210g 12개입', 'CJ 햇반 210g 12개입은(는) 간편하면서도 든든한 한 끼를 책임지는 실속 있는 먹거리입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/253/fbdae8fc-9aef-42ae-a322-ada44465fbb9-CJ%20%ED%96%87%EB%B0%98%20210g%2012%EA%B0%9C%EC%9E%85.jpg', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 11500, 44, 0, '2025-03-25 14:44:19.630685+00', '농심 신라면 블랙 8개', '농심 신라면 블랙은(는) 집에서 간편하게 즐길 수 있는 고품질 프리미엄 식품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/254/dfadd6f9-63d7-4fe4-b35e-6d05d86ea43d-%EB%86%8D%EC%8B%AC%20%EC%8B%A0%EB%9D%BC%EB%A9%B4%20%EB%B8%94%EB%9E%99.jpg', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 13900, 45, 0, '2025-03-25 14:44:19.630685+00', '롯데 빼빼로 오리지널 10입', '롯데 빼빼로 오리지널 10입은(는) 바쁜 일상 속에서도 풍성한 맛과 영양을 동시에 챙길 수 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/255/5de859a4-237f-4ed0-8c17-4c6f569d037a-%EB%A1%AF%EB%8D%B0%20%EB%B9%BC%EB%B9%BC%EB%A1%9C%20%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%2010%EC%9E%85.jpg', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 4000, 46, 0, '2025-03-25 14:44:19.630685+00', '오리온 초코파이 12개입', '오리온 초코파이 12개입은(는) 간편하면서도 든든한 한 끼를 책임지는 실속 있는 먹거리입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/257/8d9b1212-2908-455b-80f3-291b029c2eee-%EC%98%A4%EB%A6%AC%EC%98%A8%20%EC%B4%88%EC%BD%94%ED%8C%8C%EC%9D%B4%2012%EA%B0%9C%EC%9E%85.jpg', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 29200, 47, 0, '2025-03-25 14:44:19.630685+00', '더페이스샵 망고 씨드 수분크림', '더페이스샵 망고 씨드 수분크림은(는) 깊은 보습력과 은은한 향기로 당신의 뷰티 루틴을 한층 고급스럽게 만들어줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/226/33389e50-2920-45b3-b68f-8ed1acc1d379-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153316.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 18700, 48, 0, '2025-03-25 14:44:19.630685+00', '스프라이트 캔 355ml 24입', '스프라이트 캔 355ml 24입은(는) 집에서 간편하게 즐길 수 있는 고품질 프리미엄 식품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/258/6f965800-276e-4e01-b550-e8de874b60fe-%EC%8A%A4%ED%94%84%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EC%BA%94%20355ml%2024%EC%9E%85.jpg', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 7500, 49, 0, '2025-03-25 14:44:19.630685+00', '동원 참치 살코기 100g 3캔', '동원 참치 살코기 100g 3캔은(는) 깊고 진한 맛으로 남녀노소 누구나 즐길 수 있는 인기 식품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/259/c80ac1e6-8fb7-4a8f-a5ac-6ef2857e5365-%EB%8F%99%EC%9B%90%20%EC%B0%B8%EC%B9%98%20%EC%82%B4%EC%BD%94%EA%B8%B0%20100g%203%EC%BA%94.png', 'FOOD');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 86600, 50, 0, '2025-03-25 14:44:19.630685+00', '레고 시티 경찰서 세트', '레고 시티 경찰서 세트은(는) 아이들의 상상력을 자극하고 창의력을 길러주는 교육적 완구입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/261/ab05eb0a-b7b1-4bc8-b5c1-8ea9ccd2fc36-%EB%A0%88%EA%B3%A0%20%EC%8B%9C%ED%8B%B0%20%EA%B2%BD%EC%B0%B0%EC%84%9C%20%EC%84%B8%ED%8A%B8.png', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 185000, 51, 0, '2025-03-25 14:44:19.630685+00', '헬로카봇 펜타스톰 X', '헬로카봇 펜타스톰 X은(는) 시각적 재미와 손의 협응력을 함께 키울 수 있는 스마트 토이입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/263/e9732181-91a0-4683-9f9e-8f2ffb2f8e6e-%ED%97%AC%EB%A1%9C%EC%B9%B4%EB%B4%87%20%ED%8E%9C%ED%83%80%EC%8A%A4%ED%86%B0%20X.jpg', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 160000, 52, 0, '2025-03-25 14:44:19.630685+00', '카시오 G-SHOCK 스포츠워치', '카시오 G-SHOCK 스포츠워치은(는) 체력 향상을 돕고 운동 루틴을 더 풍성하게 만들어주는 필수 아이템입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/246/11722cb4-0061-4170-baac-398dd24fc7db-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154511.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 18000, 53, 0, '2025-03-25 14:44:19.630685+00', '스콧 로드바이크 스피드스터 40', '스콧 로드바이크 스피드스터 40은(는) 활동적인 움직임을 자유롭게 지원하며, 스포츠 퍼포먼스를 극대화합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/249/3f6de02f-eb49-4a05-bac4-c87bdb3f444a-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154705.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 29000, 54, 0, '2025-03-25 14:44:19.630685+00', '스탠리 워터보틀 750ml', '스탠리 워터보틀 750ml은(는) 체력 향상을 돕고 운동 루틴을 더 풍성하게 만들어주는 필수 아이템입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/250/78936706-b88e-48b9-8494-937a06b01d5a-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154831.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 30000, 55, 0, '2025-03-25 14:44:19.630685+00', '플레이도우 플레이 세트', '플레이도우 플레이 세트은(는) 시각적 재미와 손의 협응력을 함께 키울 수 있는 스마트 토이입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/264/cc4c4630-6071-4443-b7a0-4cd459fc9244-%ED%94%8C%EB%A0%88%EC%9D%B4%EB%8F%84%EC%9A%B0%20%ED%94%8C%EB%A0%88%EC%9D%B4%20%EC%84%B8%ED%8A%B8.jpg', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 141000, 56, 0, '2025-03-25 14:44:19.630685+00', '핫휠 레이싱 트랙', '핫휠 레이싱 트랙은(는) 즐거운 놀이시간을 책임지는 안전하고 재미있는 장난감입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/265/29ca4f44-2c94-4639-8211-f8504894e50c-%ED%95%AB%ED%9C%A0%20%EB%A0%88%EC%9D%B4%EC%8B%B1%20%ED%8A%B8%EB%9E%99.jpg', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 47100, 57, 0, '2025-03-25 14:44:19.630685+00', '실바니안 패밀리 하우스', '실바니안 패밀리 하우스은(는) 아이들의 상상력을 자극하고 창의력을 길러주는 교육적 완구입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/266/c4c2aeb0-42c8-4240-929a-9584ce993209-%EC%8B%A4%EB%B0%94%EB%8B%88%EC%95%88%20%ED%8C%A8%EB%B0%80%EB%A6%AC%20%ED%95%98%EC%9A%B0%EC%8A%A4.jpg', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 35500, 58, 0, '2025-03-25 14:44:19.630685+00', '베이블레이드 버스트 B-199', '베이블레이드 버스트 B-199은(는) 시각적 재미와 손의 협응력을 함께 키울 수 있는 스마트 토이입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/267/bd8813c6-6dfd-4c49-890b-37fcc9ad6c7e-%EB%B2%A0%EC%9D%B4%EB%B8%94%EB%A0%88%EC%9D%B4%EB%93%9C%20%EB%B2%84%EC%8A%A4%ED%8A%B8%20B-199.jpg', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 33800, 59, 0, '2025-03-25 14:44:19.630685+00', '시크릿쥬쥬 마법 지팡이', '시크릿쥬쥬 마법 지팡이은(는) 즐거운 놀이시간을 책임지는 안전하고 재미있는 장난감입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/268/b4735394-0bbe-4468-891f-fa43a680cc42-%EC%8B%9C%ED%81%AC%EB%A6%BF%EC%A5%AC%EC%A5%AC%20%EB%A7%88%EB%B2%95%20%EC%A7%80%ED%8C%A1%EC%9D%B4.jpg', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 24900, 60, 0, '2025-03-25 14:44:19.630685+00', '디즈니 겨울왕국 엘사 인형', '디즈니 겨울왕국 엘사 인형은(는) 시각적 재미와 손의 협응력을 함께 키울 수 있는 스마트 토이입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/269/8fcf07cd-1d21-4463-9588-f1ac6506d2f6-%EB%94%94%EC%A6%88%EB%8B%88%20%EA%B2%A8%EC%9A%B8%EC%99%95%EA%B5%AD%20%EC%97%98%EC%82%AC%20%EC%9D%B8%ED%98%95.jpg', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 38600, 61, 0, '2025-03-25 14:44:19.630685+00', '닥터지 레드 블레미쉬 크림', '닥터지 레드 블레미쉬 크림은(는) 가볍고 매끄러운 발림성으로 하루 종일 산뜻한 피부 상태를 유지시켜줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/229/b4899996-3c25-46a7-a9b7-936975647e30-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153506.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 100700, 62, 0, '2025-03-25 14:44:19.630685+00', 'RC 카 2.4GHz 고속 드리프트', 'RC 카 2.4GHz 고속 드리프트은(는) 즐거운 놀이시간을 책임지는 안전하고 재미있는 장난감입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/270/34910922-7e13-4a90-a242-0bf1ff71c3b9-RC%20%EC%B9%B4%202.4GHz%20%EA%B3%A0%EC%86%8D%20%EB%93%9C%EB%A6%AC%ED%94%84%ED%8A%B8.jpg', 'TOYS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 399000, 63, 0, '2025-03-25 14:44:19.630685+00', '한샘 4인용 원목 식탁세트', '한샘 4인용 원목 식탁세트은(는) 어떤 공간에도 자연스럽게 어우러지며 편안한 사용감을 제공합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/271/3d5b2100-f1c8-4102-a5ce-7b3c01a73135-%ED%95%9C%EC%83%98%204%EC%9D%B8%EC%9A%A9%20%EC%9B%90%EB%AA%A9%20%EC%8B%9D%ED%83%81%EC%84%B8%ED%8A%B8.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 40000, 64, 0, '2025-03-25 14:44:19.630685+00', '스포타임 아령 10kg 세트', '스포타임 아령 10kg 세트은(는) 기능성과 스타일을 모두 고려해 운동 중에도 멋스러움을 유지할 수 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/248/71155503-a322-4642-b70e-f731f6f34db3-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154607.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 66800, 65, 0, '2025-03-25 14:44:19.630685+00', '삼성 제트 무선청소기 VS20T9278S7', '삼성 제트 무선청소기 VS20T9278S7은(는) 복잡한 기능 없이도 누구나 쉽게 사용할 수 있도록 직관적으로 설계되었습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/231/726fe109-53b5-4bd6-966f-cb5fdfff036b-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153637.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 449800, 66, 0, '2025-03-25 14:44:19.630685+00', '에넥스 슬라이딩 옷장 1800mm', '에넥스 슬라이딩 옷장 1800mm은(는) 공간 효율성을 고려한 구조로 실내를 보다 넓고 쾌적하게 만들어줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/276/d39dc2ca-35e5-48bc-bb47-105ddc3408e7-%EC%97%90%EB%84%A5%EC%8A%A4%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%98%B7%EC%9E%A5%201800mm.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 11700, 70, 0, '2025-03-25 14:44:19.630685+00', '홈플래닛 샤워기 헤드 필터형', '홈플래닛 샤워기 헤드 필터형은(는) 감각적인 디자인과 유용한 기능으로 만족도를 높여줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/285/e600b7c7-3486-448e-99f2-a979392e214c-%ED%99%88%ED%94%8C%EB%9E%98%EB%8B%9B%20%EC%83%A4%EC%9B%8C%EA%B8%B0%20%ED%97%A4%EB%93%9C%20%ED%95%84%ED%84%B0%ED%98%95.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 23800, 71, 0, '2025-03-25 14:44:19.630685+00', '코스트코 대용량 종이호일', '코스트코 대용량 종이호일은(는) 공간을 깔끔하게 정리하고 쾌적하게 유지할 수 있도록 도와줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/287/f3e9456a-b66c-477d-8b22-3773ba7e8360-%EC%BD%94%EC%8A%A4%ED%8A%B8%EC%BD%94%20%EB%8C%80%EC%9A%A9%EB%9F%89%20%EC%A2%85%EC%9D%B4%ED%98%B8%EC%9D%BC.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 130000, 72, 0, '2025-03-25 14:44:19.630685+00', '필립스 에어프라이어 HD9743/14', '필립스 에어프라이어 HD9743/14은(는) 사용자의 라이프스타일을 고려해 설계된 똑똑한 생활 가전입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/234/24c8273a-b5c7-4917-95d6-7e17e2700d75-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153904.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 13900, 73, 0, '2025-03-25 14:44:19.630685+00', '일렉트로맨 디지털 체중계', '일렉트로맨 디지털 체중계은(는) 간단하면서도 활용도가 높은 제품으로 많은 사랑을 받고 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/289/b46c4b30-ffab-448e-9c91-4d29a2000ada-%EC%9D%BC%EB%A0%89%ED%8A%B8%EB%A1%9C%EB%A7%A8%20%EB%94%94%EC%A7%80%ED%84%B8%20%EC%B2%B4%EC%A4%91%EA%B3%84.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 10000, 74, 0, '2025-03-25 14:44:19.630685+00', 'YES24 온라인 문화상품권 1만원', 'YES24 온라인 문화상품권 1만원은(는) 독특한 아이디어가 접목된 아이템으로, 일상의 재미를 더해줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/291/ff55312d-2ffd-433a-bf93-36233c94e931-YES24%20%EC%98%A8%EB%9D%BC%EC%9D%B8%20%EB%AC%B8%ED%99%94%EC%83%81%ED%92%88%EA%B6%8C%201%EB%A7%8C%EC%9B%90.jpg', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 181900, 68, 0, '2025-03-25 14:44:19.630685+00', '삼익가구 5단 철제 선반', '삼익가구 5단 철제 선반은(는) 실용성과 감각적인 미를 동시에 갖춘 고급형 제품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/280/7fcc8c38-c9e2-41bc-8e7b-7b666e4cec9a-%EC%82%BC%EC%9D%B5%EA%B0%80%EA%B5%AC%205%EB%8B%A8%20%EC%B2%A0%EC%A0%9C%20%EC%84%A0%EB%B0%98.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (1, 9500, 69, 0, '2025-03-25 14:44:19.630685+00', '생활공작소 방향제 허브향', '생활공작소 방향제 허브향은(는) 간단하면서도 활용도가 높은 제품으로 많은 사랑을 받고 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/282/3b5fdc43-cc38-4dd0-aa03-5aa1e9d74c72-%EC%83%9D%ED%99%9C%EA%B3%B5%EC%9E%91%EC%86%8C%20%EB%B0%A9%ED%96%A5%EC%A0%9C%20%ED%97%88%EB%B8%8C%ED%96%A5.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 68000, 75, 0, '2025-03-25 14:44:19.630685+00', '샤오미 스마트 가습기 2세대', '샤오미 스마트 가습기 2세대은(는) 내구성과 성능을 동시에 갖춘 제품으로, 장기적인 만족감을 보장합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/236/4e284d51-dbc1-4eaa-85ed-65b9dad76c37-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153955.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 69900, 76, 0, '2025-03-25 14:44:19.630685+00', '스타벅스 텀블러 SS 투고컵', '스타벅스 텀블러 SS 투고컵은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/293/8f74fe39-627f-4d90-94b3-a8fb718e833d-%EC%8A%A4%ED%83%80%EB%B2%85%EC%8A%A4%20%ED%85%80%EB%B8%94%EB%9F%AC%20SS%20%ED%88%AC%EA%B3%A0%EC%BB%B5.jpeg', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 14600, 77, 0, '2025-03-25 14:44:19.630685+00', '탐사 캠핑용 휴대 랜턴', '탐사 캠핑용 휴대 랜턴은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/295/96ddc8ee-9025-47e9-a2d5-306b95cc9832-%ED%83%90%EC%82%AC%20%EC%BA%A0%ED%95%91%EC%9A%A9%20%ED%9C%B4%EB%8C%80%20%EB%9E%9C%ED%84%B4.jpg', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 39800, 78, 0, '2025-03-25 14:44:19.630685+00', '라이즈업 노트북 거치대 알루미늄', '라이즈업 노트북 거치대 알루미늄은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/297/5a4432e0-6276-455c-bce7-d32fffca62ab-%EB%9D%BC%EC%9D%B4%EC%A6%88%EC%97%85%20%EB%85%B8%ED%8A%B8%EB%B6%81%20%EA%B1%B0%EC%B9%98%EB%8C%80%20%EC%95%8C%EB%A3%A8%EB%AF%B8%EB%8A%84.jpg', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 11200, 79, 0, '2025-03-25 14:44:19.630685+00', '비타500 제로, 100ml, 20개', '비타500 제로, 100ml, 20개은(는) 작지만 강력한 성능으로 여러 상황에서 빛을 발하는 제품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/300/8b080ce7-fd4a-40fb-8926-cb318fbafc17-%EB%B9%84%ED%83%80500%20%EC%A0%9C%EB%A1%9C%2C%20100ml%2C%2020%EA%B0%9C.jpg', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 258000, 80, 0, '2025-03-25 14:44:19.630685+00', '브라운 전기면도기 시리즈9 Pro', '브라운 전기면도기 시리즈9 Pro은(는) 사용자의 라이프스타일을 고려해 설계된 똑똑한 생활 가전입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/239/fbab6ea5-0e30-476d-a833-507cba009a13-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154134.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 112000, 81, 0, '2025-03-25 14:44:19.630685+00', '아디다스 울트라부스트 23 러닝화', '아디다스 울트라부스트 23 러닝화은(는) 활동적인 움직임을 자유롭게 지원하며, 스포츠 퍼포먼스를 극대화합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/241/ea4c2913-0ca1-49e2-80f3-644e21a7a4c5-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154239.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 6200, 82, 0, '2025-03-25 14:44:19.630685+00', '피트니스 밴드 세트 5종', '피트니스 밴드 세트 5종은(는) 기능성과 스타일을 모두 고려해 운동 중에도 멋스러움을 유지할 수 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/244/e60c899c-98f3-40f3-934e-357e0c1bda99-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154407.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 19600, 83, 0, '2025-03-25 14:44:19.630685+00', '이케아 LACK 사이드 테이블', '이케아 LACK 사이드 테이블은(는) 공간 효율성을 고려한 구조로 실내를 보다 넓고 쾌적하게 만들어줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/272/48c68c94-b82d-4bf4-a719-b4811826939a-%EC%9D%B4%EC%BC%80%EC%95%84%20LACK%20%EC%82%AC%EC%9D%B4%EB%93%9C%20%ED%85%8C%EC%9D%B4%EB%B8%94.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 113000, 84, 0, '2025-03-25 14:44:19.630685+00', '리바트 책상 1200x600', '리바트 책상 1200x600은(는) 실용성과 감각적인 미를 동시에 갖춘 고급형 제품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/273/a712fe55-2ad7-47d3-b798-77428e544c70-%EB%A6%AC%EB%B0%94%ED%8A%B8%20%EC%B1%85%EC%83%81%201200x600.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 1100000, 85, 0, '2025-03-25 14:44:19.630685+00', '에몬스 LED 수납 침대 Q사이즈', '에몬스 LED 수납 침대 Q사이즈은(는) 공간 효율성을 고려한 구조로 실내를 보다 넓고 쾌적하게 만들어줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/274/7eb3506b-4fce-4bea-a9fd-70a10ce26954-%EC%97%90%EB%AA%AC%EC%8A%A4%20LED%20%EC%88%98%EB%82%A9%20%EC%B9%A8%EB%8C%80%20Q%EC%82%AC%EC%9D%B4%EC%A6%88.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 74900, 86, 0, '2025-03-25 14:44:19.630685+00', '동서가구 3단 서랍장', '동서가구 3단 서랍장은(는) 공간 효율성을 고려한 구조로 실내를 보다 넓고 쾌적하게 만들어줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/275/e02e9b35-28ca-4d70-863b-8e63743e4914-%EB%8F%99%EC%84%9C%EA%B0%80%EA%B5%AC%203%EB%8B%A8%20%EC%84%9C%EB%9E%8D%EC%9E%A5.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 1054000, 87, 0, '2025-03-25 14:44:19.630685+00', '까사미아 소파베드', '까사미아 소파베드은(는) 오랜 시간 사용해도 질리지 않는 심플한 디자인이 특징입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/277/2ab58e81-8df1-4a91-a773-5e5a62fbc3eb-%EA%B9%8C%EC%82%AC%EB%AF%B8%EC%95%84%20%EC%86%8C%ED%8C%8C%EB%B2%A0%EB%93%9C.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 18300, 88, 0, '2025-03-25 14:44:19.630685+00', '노르딕스타일 커피테이블', '노르딕스타일 커피테이블은(는) 실용성과 감각적인 미를 동시에 갖춘 고급형 제품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/279/95e31d7b-0f18-44cb-9c80-74b9905472f2-%EB%85%B8%EB%A5%B4%EB%94%95%EC%8A%A4%ED%83%80%EC%9D%BC%20%EC%BB%A4%ED%94%BC%ED%85%8C%EC%9D%B4%EB%B8%94.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 14900, 89, 0, '2025-03-25 14:44:19.630685+00', '락앤락 냉장고 정리용기 세트', '락앤락 냉장고 정리용기 세트은(는) 공간을 깔끔하게 정리하고 쾌적하게 유지할 수 있도록 도와줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/281/cee99bb2-8b76-4539-b526-b5818065ee46-%EB%9D%BD%EC%95%A4%EB%9D%BD%20%EB%83%89%EC%9E%A5%EA%B3%A0%20%EC%A0%95%EB%A6%AC%EC%9A%A9%EA%B8%B0%20%EC%84%B8%ED%8A%B8.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 5900, 90, 0, '2025-03-25 14:44:19.630685+00', '코멧 욕실화 논슬립', '코멧 욕실화 논슬립은(는) 일상 속 소소한 편리함을 선사하는 생활 필수품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/283/81a7bc46-0918-4100-8038-b2ce43ac92db-%EC%BD%94%EB%A9%A7%20%EC%9A%95%EC%8B%A4%ED%99%94%20%EB%85%BC%EC%8A%AC%EB%A6%BD.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 36100, 91, 0, '2025-03-25 14:44:19.630685+00', '바세츠 수건 10장 세트', '바세츠 수건 10장 세트은(는) 감각적인 디자인과 유용한 기능으로 만족도를 높여줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/284/a1f8fb8f-a8f3-46a9-976c-8a096bd5142c-%EB%B0%94%EC%84%B8%EC%B8%A0%20%EC%88%98%EA%B1%B4%2010%EC%9E%A5%20%EC%84%B8%ED%8A%B8.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 9900, 92, 0, '2025-03-25 14:44:19.630685+00', '피카소 걸이형 청소포 밀대', '피카소 걸이형 청소포 밀대은(는) 간단하면서도 활용도가 높은 제품으로 많은 사랑을 받고 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/286/dd9b311f-3b38-44af-91f7-2a3a1a99ba1f-%ED%94%BC%EC%B9%B4%EC%86%8C%20%EA%B1%B8%EC%9D%B4%ED%98%95%20%EC%B2%AD%EC%86%8C%ED%8F%AC%20%EB%B0%80%EB%8C%80.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 14900, 93, 0, '2025-03-25 14:44:19.630685+00', '모나리자 천연펄프 화장지 30롤', '모나리자 천연펄프 화장지 30롤은(는) 간단하면서도 활용도가 높은 제품으로 많은 사랑을 받고 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/288/9a2559f7-6eeb-47af-ab46-b14e6e1e098f-%EB%AA%A8%EB%82%98%EB%A6%AC%EC%9E%90%20%EC%B2%9C%EC%97%B0%ED%8E%84%ED%94%84%20%ED%99%94%EC%9E%A5%EC%A7%80%2030%EB%A1%A4.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 28400, 94, 0, '2025-03-25 14:44:19.630685+00', '베이직하우스 커튼 암막 2장', '베이직하우스 커튼 암막 2장은(는) 감각적인 디자인과 유용한 기능으로 만족도를 높여줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/290/c98cb70b-2ece-44e6-8ae4-f6146d740e5d-%EB%B2%A0%EC%9D%B4%EC%A7%81%ED%95%98%EC%9A%B0%EC%8A%A4%20%EC%BB%A4%ED%8A%BC%20%EC%95%94%EB%A7%89%202%EC%9E%A5.jpg', 'LIVING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 15900, 95, 0, '2025-03-25 14:44:19.630685+00', '비츠엠 차량용 핸드폰 거치대', '비츠엠 차량용 핸드폰 거치대은(는) 독특한 아이디어가 접목된 아이템으로, 일상의 재미를 더해줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/292/26a0e264-d04c-4c81-aaf9-76a4423a0876-%EB%B9%84%EC%B8%A0%EC%97%A0%20%EC%B0%A8%EB%9F%89%EC%9A%A9%20%ED%95%B8%EB%93%9C%ED%8F%B0%20%EA%B1%B0%EC%B9%98%EB%8C%80.png', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 11100, 96, 0, '2025-03-25 14:44:19.630685+00', '하리보 골드베렌 젤리 1kg', '하리보 골드베렌 젤리 1kg은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/294/a31010e6-f193-477a-977b-0da608cd8a62-%ED%95%98%EB%A6%AC%EB%B3%B4%20%EA%B3%A8%EB%93%9C%EB%B2%A0%EB%A0%8C%20%EC%A0%A4%EB%A6%AC%201kg.jpg', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 16000, 97, 0, '2025-03-25 14:44:19.630685+00', '삼성 microSD EVO Plus 128GB', '삼성 microSD EVO Plus 128GB은(는) 실용성과 창의성을 동시에 갖춘 제품으로, 일상에 신선한 변화를 줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/296/edf4472c-a572-4ce8-9494-e544cb8f3b25-%EC%82%BC%EC%84%B1%20microSD%20EVO%20Plus%20128GB.jpg', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 10700, 98, 0, '2025-03-25 14:44:19.630685+00', '롯데월드 자유이용권 1인', '롯데월드 자유이용권 1인은(는) 독특한 아이디어가 접목된 아이템으로, 일상의 재미를 더해줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/298/581608a3-19f2-4441-a775-34bb08e2ced1-%EB%A1%AF%EB%8D%B0%EC%9B%94%EB%93%9C%20%EC%9E%90%EC%9C%A0%EC%9D%B4%EC%9A%A9%EA%B6%8C%201%EC%9D%B8.jpg', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 24900, 99, 0, '2025-03-25 14:44:19.630685+00', '강아지 배변패드 중형 100매', '강아지 배변패드 중형 100매은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/299/5a720b98-c5a4-4708-9ece-29efa34a22b7-%EA%B0%95%EC%95%84%EC%A7%80%20%EB%B0%B0%EB%B3%80%ED%8C%A8%EB%93%9C%20%EC%A4%91%ED%98%95%20100%EB%A7%A4.jpg', 'OTHERS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 28200, 100, 0, '2025-03-25 14:44:19.630685+00', '아레나 수경+수모 세트', '아레나 수경+수모 세트은(는) 활동적인 움직임을 자유롭게 지원하며, 스포츠 퍼포먼스를 극대화합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/247/a547e23c-db04-4405-a1f7-513b5cda895e-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154538.png', 'SPORTS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 75000, 7, 0, '2025-03-25 14:44:19.630685+00', '샤오미 미밴드 8 스마트밴드', '샤오미 미밴드 8 스마트밴드은(는) 현대적인 디자인과 함께 고급 기능을 갖추어 업무와 엔터테인먼트를 모두 만족시킵니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/204/f4e06a48-ff79-4304-8116-19060d85bee5-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20151931.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (2, 79900, 2, 0, '2025-03-25 14:44:19.630685+00', 'Anker 나노 파워뱅크 10000mAh', 'Anker 나노 파워뱅크 10000mAh은(는) 현대적인 디자인과 함께 고급 기능을 갖추어 업무와 엔터테인먼트를 모두 만족시킵니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/207/ed2d5ebd-28c6-4075-b0da-25a6e041537a-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152248.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 26400, 11, 0, '2025-03-25 14:44:19.630685+00', 'MLB 뉴욕양키스 볼캡', 'MLB 뉴욕양키스 볼캡은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/213/b32d93c4-1ea0-4ce2-81be-ed90d6edc75b-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152604.png', 'CLOTHING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 1278000, 5, 0, '2025-03-25 14:44:19.630685+00', 'Apple MacBook Air M2 13형', 'Apple MacBook Air M2 13형은(는) 첨단 기술과 혁신적인 설계를 바탕으로, 뛰어난 성능과 직관적인 사용자 경험을 제공합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/203/d39e039d-9787-42de-abf7-2ea6ffca9179-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20151846.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 310000, 6, 0, '2025-03-25 14:44:19.630685+00', 'Apple Watch SE 2세대 GPS', 'Apple Watch SE 2세대 GPS은(는) 탁월한 연결성과 긴 배터리 수명을 제공하여 언제 어디서나 안정적인 사용이 가능합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/209/c5bfa589-96c0-4b44-a249-031f3387f1d8-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152400.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 150000, 3, 0, '2025-03-25 14:44:19.630685+00', 'Sony WH-1000XM5 노이즈캔슬링 헤드폰', 'Sony WH-1000XM5 노이즈캔슬링 헤드폰은(는) 첨단 기술과 혁신적인 설계를 바탕으로, 뛰어난 성능과 직관적인 사용자 경험을 제공합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/208/b15fdb98-3c5f-4e79-91cc-f4e131789ce3-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152327.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 19900, 15, 0, '2025-03-25 14:44:19.630685+00', '유니클로 U 크루넥 티셔츠', '유니클로 U 크루넥 티셔츠은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/215/5bbce9e5-1f09-46a6-9b07-8f4a85cbd342-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152725.png', 'CLOTHING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 780000, 9, 0, '2025-03-25 14:44:19.630685+00', 'LG 울트라기어 게이밍 모니터 27GN750', 'LG 울트라기어 게이밍 모니터 27GN750은(는) 생생한 디스플레이와 빠른 응답 속도로 멀티태스킹에 최적화된 스마트 디바이스입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/201/4252e955-c7b5-4225-a0d4-c926cf21f8a3-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152143.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 139000, 8, 0, '2025-03-25 14:44:19.630685+00', '로지텍 MX Master 3S 마우스', '로지텍 MX Master 3S 마우스은(는) 전문가와 일반 사용자 모두를 위한 성능과 휴대성을 고루 갖춘 전자 제품입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/206/850886fd-7a5e-4ee1-aa5a-9fb6004d6ba0-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152107.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 132000, 18, 0, '2025-03-25 14:44:19.630685+00', '설화수 윤조 에센스 120ml', '설화수 윤조 에센스 120ml은(는) 민감한 피부에도 안심하고 사용할 수 있는 순한 성분으로 구성되어 있습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/221/55de7138-9cc3-4ced-bae7-2602210b6791-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153029.png', 'BEAUTY');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 119000, 14, 0, '2025-03-25 14:44:19.630685+00', '나이키 테크 플리스 조거팬츠', '나이키 테크 플리스 조거팬츠은(는) 트렌드를 반영하면서도 자신만의 개성을 표현할 수 있는 멋진 선택입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/211/e9d794b0-cb3c-473d-bc01-b7aed41357e6-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152440.png', 'CLOTHING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 23000, 17, 0, '2025-03-25 14:44:19.630685+00', 'H&M 여성 하이웨스트 청바지', 'H&M 여성 하이웨스트 청바지은(는) 데일리룩은 물론 특별한 날에도 잘 어울리는 실용적인 패션 아이템입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/217/840b7ee3-6106-4684-8ee9-a26d5d27411d-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152835.png', 'CLOTHING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 17900, 16, 0, '2025-03-25 14:44:19.630685+00', '자라 린넨 셔츠 남성', '자라 린넨 셔츠 남성은(는) 부드러운 소재와 세심한 재단으로 착용자의 움직임을 편안하게 감싸줍니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/216/680f3458-ec86-441d-80c7-a776106efe68-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152803.png', 'CLOTHING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 69000, 13, 0, '2025-03-25 14:44:19.630685+00', '아디다스 에센셜 후디', '아디다스 에센셜 후디은(는) 데일리룩은 물론 특별한 날에도 잘 어울리는 실용적인 패션 아이템입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/212/51e11fea-e938-472e-83a8-a401dff915f5-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152518.png', 'CLOTHING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 145000, 12, 0, '2025-03-25 14:44:19.630685+00', '코오롱스포츠 바람막이 자켓', '코오롱스포츠 바람막이 자켓은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/214/2842326b-93c3-4491-afb4-7075b6d971c4-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152649.png', 'CLOTHING');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 359000, 1, 0, '2025-03-25 14:44:19.630685+00', 'BOSE QC45 무선 헤드폰', 'BOSE QC45 무선 헤드폰은(는) 탁월한 연결성과 긴 배터리 수명을 제공하여 언제 어디서나 안정적인 사용이 가능합니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/205/529ba390-786b-40ba-bf1f-0640915dfef2-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152012.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (0, 1425000, 67, 0, '2025-03-25 14:44:19.630685+00', '보루네오 원목 벙커침대', '보루네오 원목 벙커침대은(는) 인테리어의 완성도를 높여주는 세련된 디자인의 가구입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/278/a2832c6f-c494-4cf6-8753-572a19aa26dd-%EB%B3%B4%EB%A3%A8%EB%84%A4%EC%98%A4%20%EC%9B%90%EB%AA%A9%20%EB%B2%99%EC%BB%A4%EC%B9%A8%EB%8C%80.jpg', 'FURNITURE');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (1, 1950000, 28, 0, '2025-03-25 14:44:19.630685+00', 'LG 휘센 듀얼 에어컨 17평형', 'LG 휘센 듀얼 에어컨 17평형은(는) 사용자의 라이프스타일을 고려해 설계된 똑똑한 생활 가전입니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/232/8ce342d8-297d-4261-9ca9-188bf26a6601-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153805.png', 'HOMEAPPLIANCES');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (2, 2340000, 10, 3, '2025-03-25 14:44:19.630685+00', '에이수스 ROG Zephyrus G14 노트북', '에이수스 ROG Zephyrus G14 노트북은(는) 현대적인 디자인과 함께 고급 기능을 갖추어 업무와 엔터테인먼트를 모두 만족시킵니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/210/907381ae-ab56-4383-8e1e-257daed7bfc7-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152213.png', 'ELECTRONICS');
INSERT INTO public.products (favorite, price, product_id, star, created_at, product_name, description, image, category) VALUES (1, 3250000, 19, 5, '2025-03-25 14:44:19.630685+00', '몽클레어 롱패딩 여성용', '몽클레어 롱패딩 여성용은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.', 'https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/218/c9fafeb4-de5b-429f-a702-4e4bc2ebd0d7-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152903.png', 'CLOTHING');


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 229
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: d107
--

SELECT pg_catalog.setval('public.products_product_id_seq', 100, true);


-- Completed on 2025-04-10 16:55:05

--
-- PostgreSQL database dump complete
--