--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-03-27 14:36:16

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
-- TOC entry 883 (class 1247 OID 16450)
-- Name: bank_transaction_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.bank_transaction_type AS ENUM (
    'DEPOSIT',
    'WITHDRAWAL'
);


ALTER TYPE public.bank_transaction_type OWNER TO postgres;

--
-- TOC entry 862 (class 1247 OID 16390)
-- Name: funding_category; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public.funding_category OWNER TO postgres;

--
-- TOC entry 865 (class 1247 OID 16406)
-- Name: funding_scope; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.funding_scope AS ENUM (
    'PUBLIC',
    'PRIVATE'
);


ALTER TYPE public.funding_scope OWNER TO postgres;

--
-- TOC entry 868 (class 1247 OID 16412)
-- Name: funding_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.funding_status AS ENUM (
    'PENDING',
    'COMPLETED',
    'CANCELED',
    'SHIPPING',
    'DELIVERED'
);


ALTER TYPE public.funding_status OWNER TO postgres;

--
-- TOC entry 871 (class 1247 OID 16424)
-- Name: letter_private; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.letter_private AS ENUM (
    'PUBLIC',
    'PRIVATE'
);


ALTER TYPE public.letter_private OWNER TO postgres;

--
-- TOC entry 874 (class 1247 OID 16430)
-- Name: participant_refund_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.participant_refund_status AS ENUM (
    'REFUND',
    'NOT_REFUND'
);


ALTER TYPE public.participant_refund_status OWNER TO postgres;

--
-- TOC entry 877 (class 1247 OID 16436)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAIL'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- TOC entry 880 (class 1247 OID 16444)
-- Name: payment_transaction_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_transaction_type AS ENUM (
    'FUNDING',
    'PRODUCT'
);


ALTER TYPE public.payment_transaction_type OWNER TO postgres;

--
-- TOC entry 886 (class 1247 OID 16456)
-- Name: product_category; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public.product_category OWNER TO postgres;

--
-- TOC entry 892 (class 1247 OID 16484)
-- Name: user_age_range; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_age_range AS ENUM (
    'TEENAGER',
    'YOUNG_ADULT',
    'ADULT',
    'MIDDLE_AGED',
    'SENIOR'
);


ALTER TYPE public.user_age_range OWNER TO postgres;

--
-- TOC entry 889 (class 1247 OID 16478)
-- Name: user_gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_gender AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public.user_gender OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 231 (class 1259 OID 16626)
-- Name: bank_transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_transaction (
                                         transaction_key character varying(255) NOT NULL,
                                         user_id bigint NOT NULL,
                                         transaction_type public.bank_transaction_type,
                                         amount integer,
                                         bank_name character varying(20),
                                         date timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bank_transaction OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16522)
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
                                  user_id bigint NOT NULL,
                                  funding_id integer NOT NULL
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16507)
-- Name: fundings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fundings (
                                 funding_id integer NOT NULL,
                                 user_id bigint NOT NULL,
                                 product_id integer,
                                 title character varying(20) NOT NULL,
                                 body text,
                                 description character varying(255),
                                 category public.funding_category,
                                 category_name character varying(20),
                                 scope public.funding_scope,
                                 participants_number integer,
                                 funded_amount integer,
                                 status public.funding_status,
                                 image character varying(255),
                                 image2 character varying(255),
                                 image3 character varying(255),
                                 created_at timestamp without time zone DEFAULT now(),
                                 updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.fundings OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16506)
-- Name: fundings_funding_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fundings_funding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fundings_funding_id_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 219
-- Name: fundings_funding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fundings_funding_id_seq OWNED BY public.fundings.funding_id;


--
-- TOC entry 223 (class 1259 OID 16538)
-- Name: letters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.letters (
                                letter_id integer NOT NULL,
                                funding_id integer NOT NULL,
                                user_id bigint NOT NULL,
                                comment text NOT NULL,
                                image character varying(255),
                                access public.letter_private,
                                created_at timestamp without time zone DEFAULT now(),
                                updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.letters OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16537)
-- Name: letters_letter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.letters_letter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.letters_letter_id_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 222
-- Name: letters_letter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.letters_letter_id_seq OWNED BY public.letters.letter_id;


--
-- TOC entry 228 (class 1259 OID 16589)
-- Name: participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participants (
                                     user_id bigint NOT NULL,
                                     funding_id integer NOT NULL,
                                     funding_amount integer,
                                     joined_at timestamp without time zone DEFAULT now(),
                                     refund_status public.participant_refund_status
);


ALTER TABLE public.participants OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16567)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
                                 transaction_id integer NOT NULL,
                                 user_id bigint NOT NULL,
                                 related_funding_id integer NOT NULL,
                                 related_product_id integer NOT NULL,
                                 transaction_type public.payment_transaction_type,
                                 amount integer,
                                 status public.payment_status,
                                 date timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16566)
-- Name: payments_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_transaction_id_seq OWNER TO postgres;

--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 226
-- Name: payments_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_transaction_id_seq OWNED BY public.payments.transaction_id;


--
-- TOC entry 233 (class 1259 OID 16687)
-- Name: product_review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_review (
                                       product_review_id integer NOT NULL,
                                       user_id bigint NOT NULL,
                                       product_id bigint NOT NULL,
                                       title character varying(255) NOT NULL,
                                       body text,
                                       star integer,
                                       image character varying(1024),
                                       CONSTRAINT product_review_star_check CHECK (((star >= 1) AND (star <= 5)))
);


ALTER TABLE public.product_review OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16686)
-- Name: product_review_product_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_review_product_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_review_product_review_id_seq OWNER TO postgres;

--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_review_product_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_review_product_review_id_seq OWNED BY public.product_review.product_review_id;


--
-- TOC entry 225 (class 1259 OID 16559)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
                                 product_id integer NOT NULL,
                                 product_name character varying(100) NOT NULL,
                                 category public.product_category,
                                 price integer NOT NULL,
                                 image character varying(255),
                                 favorite integer,
                                 star double precision,
                                 created_at timestamp without time zone DEFAULT now(),
                                 description text
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16558)
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 224
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- TOC entry 230 (class 1259 OID 16606)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
                                review_id integer NOT NULL,
                                funding_id integer NOT NULL,
                                user_id bigint NOT NULL,
                                comment text NOT NULL,
                                image character varying(500),
                                created_at timestamp without time zone DEFAULT now(),
                                updated_at timestamp without time zone DEFAULT now(),
                                visit bigint
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16605)
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 229
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- TOC entry 218 (class 1259 OID 16496)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
                              user_id bigint NOT NULL,
                              kakao_id bigint,
                              nickname character varying(100),
                              email character varying(255),
                              birth date,
                              profile_image character varying(500),
                              address text,
                              gender public.user_gender,
                              age_range public.user_age_range,
                              balance integer,
                              created_at timestamp without time zone DEFAULT now(),
                              updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16495)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4820 (class 2604 OID 16510)
-- Name: fundings funding_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fundings ALTER COLUMN funding_id SET DEFAULT nextval('public.fundings_funding_id_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 16541)
-- Name: letters letter_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.letters ALTER COLUMN letter_id SET DEFAULT nextval('public.letters_letter_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 16570)
-- Name: payments transaction_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN transaction_id SET DEFAULT nextval('public.payments_transaction_id_seq'::regclass);


--
-- TOC entry 4835 (class 2604 OID 16690)
-- Name: product_review product_review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_review ALTER COLUMN product_review_id SET DEFAULT nextval('public.product_review_product_review_id_seq'::regclass);


--
-- TOC entry 4826 (class 2604 OID 16562)
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- TOC entry 4831 (class 2604 OID 16609)
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 16499)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5031 (class 0 OID 16626)
-- Dependencies: 231
-- Data for Name: bank_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_transaction (transaction_key, user_id, transaction_type, amount, bank_name, date) FROM stdin;
\.


--
-- TOC entry 5021 (class 0 OID 16522)
-- Dependencies: 221
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (user_id, funding_id) FROM stdin;
\.


--
-- TOC entry 5020 (class 0 OID 16507)
-- Dependencies: 220
-- Data for Name: fundings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fundings (funding_id, user_id, product_id, title, body, description, category, category_name, scope, participants_number, funded_amount, status, image, image2, image3, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5023 (class 0 OID 16538)
-- Dependencies: 223
-- Data for Name: letters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.letters (letter_id, funding_id, user_id, comment, image, access, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5028 (class 0 OID 16589)
-- Dependencies: 228
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participants (user_id, funding_id, funding_amount, joined_at, refund_status) FROM stdin;
\.


--
-- TOC entry 5027 (class 0 OID 16567)
-- Dependencies: 227
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (transaction_id, user_id, related_funding_id, related_product_id, transaction_type, amount, status, date) FROM stdin;
\.


--
-- TOC entry 5033 (class 0 OID 16687)
-- Dependencies: 233
-- Data for Name: product_review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_review (product_review_id, user_id, product_id, title, body, star, image) FROM stdin;
\.


--
-- TOC entry 5025 (class 0 OID 16559)
-- Dependencies: 225
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, product_name, category, price, image, favorite, star, created_at, description) FROM stdin;
205	BOSE QC45 무선 헤드폰	ELECTRONICS	359000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/205/529ba390-786b-40ba-bf1f-0640915dfef2-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152012.png	0	0	2025-03-25 14:44:19.630685	BOSE QC45 무선 헤드폰은(는) 탁월한 연결성과 긴 배터리 수명을 제공하여 언제 어디서나 안정적인 사용이 가능합니다.
207	Anker 나노 파워뱅크 10000mAh	ELECTRONICS	79900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/207/ed2d5ebd-28c6-4075-b0da-25a6e041537a-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152248.png	0	0	2025-03-25 14:44:19.630685	Anker 나노 파워뱅크 10000mAh은(는) 현대적인 디자인과 함께 고급 기능을 갖추어 업무와 엔터테인먼트를 모두 만족시킵니다.
208	Sony WH-1000XM5 노이즈캔슬링 헤드폰	ELECTRONICS	150000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/208/b15fdb98-3c5f-4e79-91cc-f4e131789ce3-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152327.png	0	0	2025-03-25 14:44:19.630685	Sony WH-1000XM5 노이즈캔슬링 헤드폰은(는) 첨단 기술과 혁신적인 설계를 바탕으로, 뛰어난 성능과 직관적인 사용자 경험을 제공합니다.
202	삼성 갤럭시 탭 S9 FE	ELECTRONICS	495000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/202/7be39af3-8a20-4d4f-a442-19c9011a8603-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20151704.png	0	0	2025-03-25 14:44:19.630685	삼성 갤럭시 탭 S9 FE은(는) 현대적인 디자인과 함께 고급 기능을 갖추어 업무와 엔터테인먼트를 모두 만족시킵니다.
203	Apple MacBook Air M2 13형	ELECTRONICS	1278000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/203/d39e039d-9787-42de-abf7-2ea6ffca9179-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20151846.png	0	0	2025-03-25 14:44:19.630685	Apple MacBook Air M2 13형은(는) 첨단 기술과 혁신적인 설계를 바탕으로, 뛰어난 성능과 직관적인 사용자 경험을 제공합니다.
209	Apple Watch SE 2세대 GPS	ELECTRONICS	310000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/209/c5bfa589-96c0-4b44-a249-031f3387f1d8-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152400.png	0	0	2025-03-25 14:44:19.630685	Apple Watch SE 2세대 GPS은(는) 탁월한 연결성과 긴 배터리 수명을 제공하여 언제 어디서나 안정적인 사용이 가능합니다.
204	샤오미 미밴드 8 스마트밴드	ELECTRONICS	75000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/204/f4e06a48-ff79-4304-8116-19060d85bee5-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20151931.png	0	0	2025-03-25 14:44:19.630685	샤오미 미밴드 8 스마트밴드은(는) 현대적인 디자인과 함께 고급 기능을 갖추어 업무와 엔터테인먼트를 모두 만족시킵니다.
206	로지텍 MX Master 3S 마우스	ELECTRONICS	139000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/206/850886fd-7a5e-4ee1-aa5a-9fb6004d6ba0-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152107.png	0	0	2025-03-25 14:44:19.630685	로지텍 MX Master 3S 마우스은(는) 전문가와 일반 사용자 모두를 위한 성능과 휴대성을 고루 갖춘 전자 제품입니다.
201	LG 울트라기어 게이밍 모니터 27GN750	ELECTRONICS	780000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/201/4252e955-c7b5-4225-a0d4-c926cf21f8a3-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152143.png	0	0	2025-03-25 14:44:19.630685	LG 울트라기어 게이밍 모니터 27GN750은(는) 생생한 디스플레이와 빠른 응답 속도로 멀티태스킹에 최적화된 스마트 디바이스입니다.
210	에이수스 ROG Zephyrus G14 노트북	ELECTRONICS	2340000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/210/907381ae-ab56-4383-8e1e-257daed7bfc7-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152213.png	0	0	2025-03-25 14:44:19.630685	에이수스 ROG Zephyrus G14 노트북은(는) 현대적인 디자인과 함께 고급 기능을 갖추어 업무와 엔터테인먼트를 모두 만족시킵니다.
213	MLB 뉴욕양키스 볼캡	CLOTHING	26400	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/213/b32d93c4-1ea0-4ce2-81be-ed90d6edc75b-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152604.png	0	0	2025-03-25 14:44:19.630685	MLB 뉴욕양키스 볼캡은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.
214	코오롱스포츠 바람막이 자켓	CLOTHING	145000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/214/2842326b-93c3-4491-afb4-7075b6d971c4-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152649.png	0	0	2025-03-25 14:44:19.630685	코오롱스포츠 바람막이 자켓은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.
212	아디다스 에센셜 후디	CLOTHING	69000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/212/51e11fea-e938-472e-83a8-a401dff915f5-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152518.png	0	0	2025-03-25 14:44:19.630685	아디다스 에센셜 후디은(는) 데일리룩은 물론 특별한 날에도 잘 어울리는 실용적인 패션 아이템입니다.
211	나이키 테크 플리스 조거팬츠	CLOTHING	119000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/211/e9d794b0-cb3c-473d-bc01-b7aed41357e6-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152440.png	0	0	2025-03-25 14:44:19.630685	나이키 테크 플리스 조거팬츠은(는) 트렌드를 반영하면서도 자신만의 개성을 표현할 수 있는 멋진 선택입니다.
215	유니클로 U 크루넥 티셔츠	CLOTHING	19900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/215/5bbce9e5-1f09-46a6-9b07-8f4a85cbd342-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152725.png	0	0	2025-03-25 14:44:19.630685	유니클로 U 크루넥 티셔츠은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.
216	자라 린넨 셔츠 남성	CLOTHING	17900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/216/680f3458-ec86-441d-80c7-a776106efe68-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152803.png	0	0	2025-03-25 14:44:19.630685	자라 린넨 셔츠 남성은(는) 부드러운 소재와 세심한 재단으로 착용자의 움직임을 편안하게 감싸줍니다.
217	H&M 여성 하이웨스트 청바지	CLOTHING	23000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/217/840b7ee3-6106-4684-8ee9-a26d5d27411d-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152835.png	0	0	2025-03-25 14:44:19.630685	H&M 여성 하이웨스트 청바지은(는) 데일리룩은 물론 특별한 날에도 잘 어울리는 실용적인 패션 아이템입니다.
221	설화수 윤조 에센스 120ml	BEAUTY	132000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/221/55de7138-9cc3-4ced-bae7-2602210b6791-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153029.png	0	0	2025-03-25 14:44:19.630685	설화수 윤조 에센스 120ml은(는) 민감한 피부에도 안심하고 사용할 수 있는 순한 성분으로 구성되어 있습니다.
218	몽클레어 롱패딩 여성용	CLOTHING	3250000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/218/c9fafeb4-de5b-429f-a702-4e4bc2ebd0d7-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152903.png	0	0	2025-03-25 14:44:19.630685	몽클레어 롱패딩 여성용은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.
219	무신사 스탠다드 반팔티	CLOTHING	19900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/219/7483191c-c87f-4b61-a644-6c7cae6de201-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152931.png	0	0	2025-03-25 14:44:19.630685	무신사 스탠다드 반팔티은(는) 스타일과 기능성을 모두 고려해 제작되어 다양한 상황에서 활용도가 높습니다.
220	리바이스 501 오리지널 진	CLOTHING	76000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/220/9a6ca45e-0bbf-4b8e-bfc3-293d9a0cfa2b-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20152958.png	0	0	2025-03-25 14:44:19.630685	리바이스 501 오리지널 진은(는) 데일리룩은 물론 특별한 날에도 잘 어울리는 실용적인 패션 아이템입니다.
222	헤라 블랙쿠션 21호	BEAUTY	66000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/222/1792d2e1-6213-417e-87f1-8b1a4fbcf820-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153104.png	0	0	2025-03-25 14:44:19.630685	헤라 블랙쿠션 21호은(는) 깊은 보습력과 은은한 향기로 당신의 뷰티 루틴을 한층 고급스럽게 만들어줍니다.
223	라로슈포제 시카플라스트 밤 B5	BEAUTY	40800	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/223/96a9bb22-4545-471d-997f-97f442de0949-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153135.png	0	0	2025-03-25 14:44:19.630685	라로슈포제 시카플라스트 밤 B5은(는) 민감한 피부에도 안심하고 사용할 수 있는 순한 성분으로 구성되어 있습니다.
225	AHC 아이크림 시즌10	BEAUTY	28000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/225/924bd18a-6bb6-4f3f-acdf-bb407be30cdf-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153240.png	0	0	2025-03-25 14:44:19.630685	AHC 아이크림 시즌10은(는) 가볍고 매끄러운 발림성으로 하루 종일 산뜻한 피부 상태를 유지시켜줍니다.
227	클리오 킬커버 파운웨어 쿠션 XP	BEAUTY	32600	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/227/a8bbb158-f33b-4934-b8f3-478a61575817-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153346.png	0	0	2025-03-25 14:44:19.630685	클리오 킬커버 파운웨어 쿠션 XP은(는) 피부에 부담 없이 흡수되어 건강하고 빛나는 피부를 완성합니다.
228	미샤 타임레볼루션 퍼스트에센스	BEAUTY	18700	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/228/9f1e4fcb-43b7-4a8e-b591-502f012447bc-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153426.png	0	0	2025-03-25 14:44:19.630685	미샤 타임레볼루션 퍼스트에센스은(는) 자연 유래 성분과 풍부한 영양감으로 피부에 생기를 부여하는 제품입니다.
230	네이처리퍼블릭 알로에 수딩젤	BEAUTY	11500	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/230/e9b74815-ce46-4c19-a993-79aefa16f3cf-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153535.png	0	0	2025-03-25 14:44:19.630685	네이처리퍼블릭 알로에 수딩젤은(는) 민감한 피부에도 안심하고 사용할 수 있는 순한 성분으로 구성되어 있습니다.
232	LG 휘센 듀얼 에어컨 17평형	HOMEAPPLIANCES	1950000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/232/8ce342d8-297d-4261-9ca9-188bf26a6601-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153805.png	0	0	2025-03-25 14:44:19.630685	LG 휘센 듀얼 에어컨 17평형은(는) 사용자의 라이프스타일을 고려해 설계된 똑똑한 생활 가전입니다.
233	쿠쿠 전기밥솥 6인용 CRP-P0610FD	HOMEAPPLIANCES	179600	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/233/91b2f9b8-3252-4112-b313-8003d1818181-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153838.png	0	0	2025-03-25 14:44:19.630685	쿠쿠 전기밥솥 6인용 CRP-P0610FD은(는) 사용자의 라이프스타일을 고려해 설계된 똑똑한 생활 가전입니다.
235	SK매직 전기레인지 IHR-B310F	HOMEAPPLIANCES	436000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/235/0b0bd3f9-43fe-426a-a919-c1da87062d32-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153932.png	0	0	2025-03-25 14:44:19.630685	SK매직 전기레인지 IHR-B310F은(는) 내구성과 성능을 동시에 갖춘 제품으로, 장기적인 만족감을 보장합니다.
237	다이슨 퓨어쿨 공기청정기	HOMEAPPLIANCES	606500	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/237/90f9dd70-d71b-42e7-98f8-0e256990d68a-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154035.png	0	0	2025-03-25 14:44:19.630685	다이슨 퓨어쿨 공기청정기은(는) 스마트한 기능과 고급스러운 디자인을 결합하여 공간의 품격을 높여줍니다.
238	위닉스 뽀송 제습기 10L	HOMEAPPLIANCES	241000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/238/5dd954f4-f1e9-471a-847e-d67b4d7aae06-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154104.png	0	0	2025-03-25 14:44:19.630685	위닉스 뽀송 제습기 10L은(는) 내구성과 성능을 동시에 갖춘 제품으로, 장기적인 만족감을 보장합니다.
240	테팔 무선청소기 에어포스 360	HOMEAPPLIANCES	246000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/240/a4a6161a-d66f-4698-a3c0-9e9c6ca9d871-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154210.png	0	0	2025-03-25 14:44:19.630685	테팔 무선청소기 에어포스 360은(는) 내구성과 성능을 동시에 갖춘 제품으로, 장기적인 만족감을 보장합니다.
242	나이키 에어맥스 270	SPORTS	80200	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/242/7b3c61e3-0b19-4d9d-87c7-438111b95346-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154305.png	0	0	2025-03-25 14:44:19.630685	나이키 에어맥스 270은(는) 야외 활동은 물론 실내 운동에서도 뛰어난 효율을 자랑하는 제품입니다.
243	리복 홈트레이닝 요가매트	SPORTS	16000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/243/37189e5d-4a0f-4dff-aab9-e23bb6507b89-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154337.png	0	0	2025-03-25 14:44:19.630685	리복 홈트레이닝 요가매트은(는) 활동적인 움직임을 자유롭게 지원하며, 스포츠 퍼포먼스를 극대화합니다.
245	데상트 기능성 트레이닝 셔츠	SPORTS	42000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/245/8b67cfbc-89d4-4f02-b549-641a05e6a4c4-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154437.png	0	0	2025-03-25 14:44:19.630685	데상트 기능성 트레이닝 셔츠은(는) 체력 향상을 돕고 운동 루틴을 더 풍성하게 만들어주는 필수 아이템입니다.
256	팔도 비빔면 5입	FOOD	4400	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/256/1159cbd6-ff51-4318-9c5d-640886b0f72e-%ED%8C%94%EB%8F%84%20%EB%B9%84%EB%B9%94%EB%A9%B4%204%EC%9E%85.jpg	0	0	2025-03-25 14:44:19.630685	팔도 비빔면 4입은(는) 정성껏 준비된 맛으로 언제 먹어도 만족스러운 식사를 선사합니다.
260	맥심 모카골드 커피믹스 100T	FOOD	17500	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/260/f3d57083-7c97-458b-a659-8a868d5192ba-%EB%A7%A5%EC%8B%AC%20%EB%AA%A8%EC%B9%B4%EA%B3%A8%EB%93%9C%20%EC%BB%A4%ED%94%BC%EB%AF%B9%EC%8A%A4%20100T.jpg	0	0	2025-03-25 14:44:19.630685	맥심 모카골드 커피믹스 100T은(는) 간편하면서도 든든한 한 끼를 책임지는 실속 있는 먹거리입니다.
262	타요 미니카 풀세트	TOYS	59500	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/262/926cdf2c-6c1b-418d-aedf-a216a99e91bb-%ED%83%80%EC%9A%94%20%EB%AF%B8%EB%8B%88%EC%B9%B4%20%ED%92%80%EC%84%B8%ED%8A%B8.jpg	0	0	2025-03-25 14:44:19.630685	타요 미니카 풀세트은(는) 아이들의 상상력을 자극하고 창의력을 길러주는 교육적 완구입니다.
251	오뚜기 진라면 매운맛 5입	FOOD	3500	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/251/845109b1-999a-495e-a4d8-8634eb5c33ce-%EC%A7%84%EB%9D%BC%EB%A9%B4.jpg	0	0	2025-03-25 14:44:19.630685	오뚜기 진라면 매운맛 5입은(는) 집에서 간편하게 즐길 수 있는 고품질 프리미엄 식품입니다.
252	빙그레 바나나맛우유 6입	FOOD	11000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/252/5a898a05-2fe0-4c2a-a50f-d8dd5cd65aeb-%EB%B9%99%EA%B7%B8%EB%A0%88%20%EB%B0%94%EB%82%98%EB%82%98%EB%A7%9B%EC%9A%B0%EC%9C%A0%206%EC%9E%85.jpg	0	0	2025-03-25 14:44:19.630685	빙그레 바나나맛우유 6입은(는) 간편하면서도 든든한 한 끼를 책임지는 실속 있는 먹거리입니다.
224	에뛰드 닥터마스카라 픽서	BEAUTY	4700	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/224/38032cca-0fe6-46c5-a043-7af4ed6ee6bc-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153205.png	0	0	2025-03-25 14:44:19.630685	에뛰드 닥터마스카라 픽서은(는) 자연 유래 성분과 풍부한 영양감으로 피부에 생기를 부여하는 제품입니다.
253	CJ 햇반 210g 12개입	FOOD	11000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/253/fbdae8fc-9aef-42ae-a322-ada44465fbb9-CJ%20%ED%96%87%EB%B0%98%20210g%2012%EA%B0%9C%EC%9E%85.jpg	0	0	2025-03-25 14:44:19.630685	CJ 햇반 210g 12개입은(는) 간편하면서도 든든한 한 끼를 책임지는 실속 있는 먹거리입니다.
254	농심 신라면 블랙 8개	FOOD	11500	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/254/dfadd6f9-63d7-4fe4-b35e-6d05d86ea43d-%EB%86%8D%EC%8B%AC%20%EC%8B%A0%EB%9D%BC%EB%A9%B4%20%EB%B8%94%EB%9E%99.jpg	0	0	2025-03-25 14:44:19.630685	농심 신라면 블랙은(는) 집에서 간편하게 즐길 수 있는 고품질 프리미엄 식품입니다.
255	롯데 빼빼로 오리지널 10입	FOOD	13900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/255/5de859a4-237f-4ed0-8c17-4c6f569d037a-%EB%A1%AF%EB%8D%B0%20%EB%B9%BC%EB%B9%BC%EB%A1%9C%20%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%2010%EC%9E%85.jpg	0	0	2025-03-25 14:44:19.630685	롯데 빼빼로 오리지널 10입은(는) 바쁜 일상 속에서도 풍성한 맛과 영양을 동시에 챙길 수 있습니다.
257	오리온 초코파이 12개입	FOOD	4000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/257/8d9b1212-2908-455b-80f3-291b029c2eee-%EC%98%A4%EB%A6%AC%EC%98%A8%20%EC%B4%88%EC%BD%94%ED%8C%8C%EC%9D%B4%2012%EA%B0%9C%EC%9E%85.jpg	0	0	2025-03-25 14:44:19.630685	오리온 초코파이 12개입은(는) 간편하면서도 든든한 한 끼를 책임지는 실속 있는 먹거리입니다.
226	더페이스샵 망고 씨드 수분크림	BEAUTY	29200	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/226/33389e50-2920-45b3-b68f-8ed1acc1d379-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153316.png	0	0	2025-03-25 14:44:19.630685	더페이스샵 망고 씨드 수분크림은(는) 깊은 보습력과 은은한 향기로 당신의 뷰티 루틴을 한층 고급스럽게 만들어줍니다.
258	스프라이트 캔 355ml 24입	FOOD	18700	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/258/6f965800-276e-4e01-b550-e8de874b60fe-%EC%8A%A4%ED%94%84%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EC%BA%94%20355ml%2024%EC%9E%85.jpg	0	0	2025-03-25 14:44:19.630685	스프라이트 캔 355ml 24입은(는) 집에서 간편하게 즐길 수 있는 고품질 프리미엄 식품입니다.
259	동원 참치 살코기 100g 3캔	FOOD	7500	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/259/c80ac1e6-8fb7-4a8f-a5ac-6ef2857e5365-%EB%8F%99%EC%9B%90%20%EC%B0%B8%EC%B9%98%20%EC%82%B4%EC%BD%94%EA%B8%B0%20100g%203%EC%BA%94.png	0	0	2025-03-25 14:44:19.630685	동원 참치 살코기 100g 3캔은(는) 깊고 진한 맛으로 남녀노소 누구나 즐길 수 있는 인기 식품입니다.
261	레고 시티 경찰서 세트	TOYS	86600	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/261/ab05eb0a-b7b1-4bc8-b5c1-8ea9ccd2fc36-%EB%A0%88%EA%B3%A0%20%EC%8B%9C%ED%8B%B0%20%EA%B2%BD%EC%B0%B0%EC%84%9C%20%EC%84%B8%ED%8A%B8.png	0	0	2025-03-25 14:44:19.630685	레고 시티 경찰서 세트은(는) 아이들의 상상력을 자극하고 창의력을 길러주는 교육적 완구입니다.
263	헬로카봇 펜타스톰 X	TOYS	185000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/263/e9732181-91a0-4683-9f9e-8f2ffb2f8e6e-%ED%97%AC%EB%A1%9C%EC%B9%B4%EB%B4%87%20%ED%8E%9C%ED%83%80%EC%8A%A4%ED%86%B0%20X.jpg	0	0	2025-03-25 14:44:19.630685	헬로카봇 펜타스톰 X은(는) 시각적 재미와 손의 협응력을 함께 키울 수 있는 스마트 토이입니다.
246	카시오 G-SHOCK 스포츠워치	SPORTS	160000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/246/11722cb4-0061-4170-baac-398dd24fc7db-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154511.png	0	0	2025-03-25 14:44:19.630685	카시오 G-SHOCK 스포츠워치은(는) 체력 향상을 돕고 운동 루틴을 더 풍성하게 만들어주는 필수 아이템입니다.
249	스콧 로드바이크 스피드스터 40	SPORTS	18000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/249/3f6de02f-eb49-4a05-bac4-c87bdb3f444a-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154705.png	0	0	2025-03-25 14:44:19.630685	스콧 로드바이크 스피드스터 40은(는) 활동적인 움직임을 자유롭게 지원하며, 스포츠 퍼포먼스를 극대화합니다.
250	스탠리 워터보틀 750ml	SPORTS	29000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/250/78936706-b88e-48b9-8494-937a06b01d5a-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154831.png	0	0	2025-03-25 14:44:19.630685	스탠리 워터보틀 750ml은(는) 체력 향상을 돕고 운동 루틴을 더 풍성하게 만들어주는 필수 아이템입니다.
264	플레이도우 플레이 세트	TOYS	30000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/264/cc4c4630-6071-4443-b7a0-4cd459fc9244-%ED%94%8C%EB%A0%88%EC%9D%B4%EB%8F%84%EC%9A%B0%20%ED%94%8C%EB%A0%88%EC%9D%B4%20%EC%84%B8%ED%8A%B8.jpg	0	0	2025-03-25 14:44:19.630685	플레이도우 플레이 세트은(는) 시각적 재미와 손의 협응력을 함께 키울 수 있는 스마트 토이입니다.
265	핫휠 레이싱 트랙	TOYS	141000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/265/29ca4f44-2c94-4639-8211-f8504894e50c-%ED%95%AB%ED%9C%A0%20%EB%A0%88%EC%9D%B4%EC%8B%B1%20%ED%8A%B8%EB%9E%99.jpg	0	0	2025-03-25 14:44:19.630685	핫휠 레이싱 트랙은(는) 즐거운 놀이시간을 책임지는 안전하고 재미있는 장난감입니다.
266	실바니안 패밀리 하우스	TOYS	47100	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/266/c4c2aeb0-42c8-4240-929a-9584ce993209-%EC%8B%A4%EB%B0%94%EB%8B%88%EC%95%88%20%ED%8C%A8%EB%B0%80%EB%A6%AC%20%ED%95%98%EC%9A%B0%EC%8A%A4.jpg	0	0	2025-03-25 14:44:19.630685	실바니안 패밀리 하우스은(는) 아이들의 상상력을 자극하고 창의력을 길러주는 교육적 완구입니다.
267	베이블레이드 버스트 B-199	TOYS	35500	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/267/bd8813c6-6dfd-4c49-890b-37fcc9ad6c7e-%EB%B2%A0%EC%9D%B4%EB%B8%94%EB%A0%88%EC%9D%B4%EB%93%9C%20%EB%B2%84%EC%8A%A4%ED%8A%B8%20B-199.jpg	0	0	2025-03-25 14:44:19.630685	베이블레이드 버스트 B-199은(는) 시각적 재미와 손의 협응력을 함께 키울 수 있는 스마트 토이입니다.
268	시크릿쥬쥬 마법 지팡이	TOYS	33800	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/268/b4735394-0bbe-4468-891f-fa43a680cc42-%EC%8B%9C%ED%81%AC%EB%A6%BF%EC%A5%AC%EC%A5%AC%20%EB%A7%88%EB%B2%95%20%EC%A7%80%ED%8C%A1%EC%9D%B4.jpg	0	0	2025-03-25 14:44:19.630685	시크릿쥬쥬 마법 지팡이은(는) 즐거운 놀이시간을 책임지는 안전하고 재미있는 장난감입니다.
269	디즈니 겨울왕국 엘사 인형	TOYS	24900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/269/8fcf07cd-1d21-4463-9588-f1ac6506d2f6-%EB%94%94%EC%A6%88%EB%8B%88%20%EA%B2%A8%EC%9A%B8%EC%99%95%EA%B5%AD%20%EC%97%98%EC%82%AC%20%EC%9D%B8%ED%98%95.jpg	0	0	2025-03-25 14:44:19.630685	디즈니 겨울왕국 엘사 인형은(는) 시각적 재미와 손의 협응력을 함께 키울 수 있는 스마트 토이입니다.
229	닥터지 레드 블레미쉬 크림	BEAUTY	38600	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/229/b4899996-3c25-46a7-a9b7-936975647e30-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153506.png	0	0	2025-03-25 14:44:19.630685	닥터지 레드 블레미쉬 크림은(는) 가볍고 매끄러운 발림성으로 하루 종일 산뜻한 피부 상태를 유지시켜줍니다.
270	RC 카 2.4GHz 고속 드리프트	TOYS	100700	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/270/34910922-7e13-4a90-a242-0bf1ff71c3b9-RC%20%EC%B9%B4%202.4GHz%20%EA%B3%A0%EC%86%8D%20%EB%93%9C%EB%A6%AC%ED%94%84%ED%8A%B8.jpg	0	0	2025-03-25 14:44:19.630685	RC 카 2.4GHz 고속 드리프트은(는) 즐거운 놀이시간을 책임지는 안전하고 재미있는 장난감입니다.
271	한샘 4인용 원목 식탁세트	FURNITURE	399000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/271/3d5b2100-f1c8-4102-a5ce-7b3c01a73135-%ED%95%9C%EC%83%98%204%EC%9D%B8%EC%9A%A9%20%EC%9B%90%EB%AA%A9%20%EC%8B%9D%ED%83%81%EC%84%B8%ED%8A%B8.jpg	0	0	2025-03-25 14:44:19.630685	한샘 4인용 원목 식탁세트은(는) 어떤 공간에도 자연스럽게 어우러지며 편안한 사용감을 제공합니다.
248	스포타임 아령 10kg 세트	SPORTS	40000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/248/71155503-a322-4642-b70e-f731f6f34db3-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154607.png	0	0	2025-03-25 14:44:19.630685	스포타임 아령 10kg 세트은(는) 기능성과 스타일을 모두 고려해 운동 중에도 멋스러움을 유지할 수 있습니다.
231	삼성 제트 무선청소기 VS20T9278S7	HOMEAPPLIANCES	66800	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/231/726fe109-53b5-4bd6-966f-cb5fdfff036b-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153637.png	0	0	2025-03-25 14:44:19.630685	삼성 제트 무선청소기 VS20T9278S7은(는) 복잡한 기능 없이도 누구나 쉽게 사용할 수 있도록 직관적으로 설계되었습니다.
276	에넥스 슬라이딩 옷장 1800mm	FURNITURE	449800	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/276/d39dc2ca-35e5-48bc-bb47-105ddc3408e7-%EC%97%90%EB%84%A5%EC%8A%A4%20%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%98%B7%EC%9E%A5%201800mm.jpg	0	0	2025-03-25 14:44:19.630685	에넥스 슬라이딩 옷장 1800mm은(는) 공간 효율성을 고려한 구조로 실내를 보다 넓고 쾌적하게 만들어줍니다.
278	보루네오 원목 벙커침대	FURNITURE	1425000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/278/a2832c6f-c494-4cf6-8753-572a19aa26dd-%EB%B3%B4%EB%A3%A8%EB%84%A4%EC%98%A4%20%EC%9B%90%EB%AA%A9%20%EB%B2%99%EC%BB%A4%EC%B9%A8%EB%8C%80.jpg	0	0	2025-03-25 14:44:19.630685	보루네오 원목 벙커침대은(는) 인테리어의 완성도를 높여주는 세련된 디자인의 가구입니다.
280	삼익가구 5단 철제 선반	FURNITURE	181900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/280/7fcc8c38-c9e2-41bc-8e7b-7b666e4cec9a-%EC%82%BC%EC%9D%B5%EA%B0%80%EA%B5%AC%205%EB%8B%A8%20%EC%B2%A0%EC%A0%9C%20%EC%84%A0%EB%B0%98.jpg	0	0	2025-03-25 14:44:19.630685	삼익가구 5단 철제 선반은(는) 실용성과 감각적인 미를 동시에 갖춘 고급형 제품입니다.
282	생활공작소 방향제 허브향	LIVING	9500	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/282/3b5fdc43-cc38-4dd0-aa03-5aa1e9d74c72-%EC%83%9D%ED%99%9C%EA%B3%B5%EC%9E%91%EC%86%8C%20%EB%B0%A9%ED%96%A5%EC%A0%9C%20%ED%97%88%EB%B8%8C%ED%96%A5.jpg	0	0	2025-03-25 14:44:19.630685	생활공작소 방향제 허브향은(는) 간단하면서도 활용도가 높은 제품으로 많은 사랑을 받고 있습니다.
285	홈플래닛 샤워기 헤드 필터형	LIVING	11700	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/285/e600b7c7-3486-448e-99f2-a979392e214c-%ED%99%88%ED%94%8C%EB%9E%98%EB%8B%9B%20%EC%83%A4%EC%9B%8C%EA%B8%B0%20%ED%97%A4%EB%93%9C%20%ED%95%84%ED%84%B0%ED%98%95.jpg	0	0	2025-03-25 14:44:19.630685	홈플래닛 샤워기 헤드 필터형은(는) 감각적인 디자인과 유용한 기능으로 만족도를 높여줍니다.
287	코스트코 대용량 종이호일	LIVING	23800	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/287/f3e9456a-b66c-477d-8b22-3773ba7e8360-%EC%BD%94%EC%8A%A4%ED%8A%B8%EC%BD%94%20%EB%8C%80%EC%9A%A9%EB%9F%89%20%EC%A2%85%EC%9D%B4%ED%98%B8%EC%9D%BC.jpg	0	0	2025-03-25 14:44:19.630685	코스트코 대용량 종이호일은(는) 공간을 깔끔하게 정리하고 쾌적하게 유지할 수 있도록 도와줍니다.
234	필립스 에어프라이어 HD9743/14	HOMEAPPLIANCES	130000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/234/24c8273a-b5c7-4917-95d6-7e17e2700d75-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153904.png	0	0	2025-03-25 14:44:19.630685	필립스 에어프라이어 HD9743/14은(는) 사용자의 라이프스타일을 고려해 설계된 똑똑한 생활 가전입니다.
289	일렉트로맨 디지털 체중계	LIVING	13900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/289/b46c4b30-ffab-448e-9c91-4d29a2000ada-%EC%9D%BC%EB%A0%89%ED%8A%B8%EB%A1%9C%EB%A7%A8%20%EB%94%94%EC%A7%80%ED%84%B8%20%EC%B2%B4%EC%A4%91%EA%B3%84.jpg	0	0	2025-03-25 14:44:19.630685	일렉트로맨 디지털 체중계은(는) 간단하면서도 활용도가 높은 제품으로 많은 사랑을 받고 있습니다.
291	YES24 온라인 문화상품권 1만원	OTHERS	10000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/291/ff55312d-2ffd-433a-bf93-36233c94e931-YES24%20%EC%98%A8%EB%9D%BC%EC%9D%B8%20%EB%AC%B8%ED%99%94%EC%83%81%ED%92%88%EA%B6%8C%201%EB%A7%8C%EC%9B%90.jpg	0	0	2025-03-25 14:44:19.630685	YES24 온라인 문화상품권 1만원은(는) 독특한 아이디어가 접목된 아이템으로, 일상의 재미를 더해줍니다.
236	샤오미 스마트 가습기 2세대	HOMEAPPLIANCES	68000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/236/4e284d51-dbc1-4eaa-85ed-65b9dad76c37-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20153955.png	0	0	2025-03-25 14:44:19.630685	샤오미 스마트 가습기 2세대은(는) 내구성과 성능을 동시에 갖춘 제품으로, 장기적인 만족감을 보장합니다.
293	스타벅스 텀블러 SS 투고컵	OTHERS	69900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/293/8f74fe39-627f-4d90-94b3-a8fb718e833d-%EC%8A%A4%ED%83%80%EB%B2%85%EC%8A%A4%20%ED%85%80%EB%B8%94%EB%9F%AC%20SS%20%ED%88%AC%EA%B3%A0%EC%BB%B5.jpeg	0	0	2025-03-25 14:44:19.630685	스타벅스 텀블러 SS 투고컵은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.
295	탐사 캠핑용 휴대 랜턴	OTHERS	14600	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/295/96ddc8ee-9025-47e9-a2d5-306b95cc9832-%ED%83%90%EC%82%AC%20%EC%BA%A0%ED%95%91%EC%9A%A9%20%ED%9C%B4%EB%8C%80%20%EB%9E%9C%ED%84%B4.jpg	0	0	2025-03-25 14:44:19.630685	탐사 캠핑용 휴대 랜턴은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.
297	라이즈업 노트북 거치대 알루미늄	OTHERS	39800	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/297/5a4432e0-6276-455c-bce7-d32fffca62ab-%EB%9D%BC%EC%9D%B4%EC%A6%88%EC%97%85%20%EB%85%B8%ED%8A%B8%EB%B6%81%20%EA%B1%B0%EC%B9%98%EB%8C%80%20%EC%95%8C%EB%A3%A8%EB%AF%B8%EB%8A%84.jpg	0	0	2025-03-25 14:44:19.630685	라이즈업 노트북 거치대 알루미늄은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.
300	비타500 제로, 100ml, 20개	OTHERS	11200	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/300/8b080ce7-fd4a-40fb-8926-cb318fbafc17-%EB%B9%84%ED%83%80500%20%EC%A0%9C%EB%A1%9C%2C%20100ml%2C%2020%EA%B0%9C.jpg	0	0	2025-03-25 14:44:19.630685	비타500 제로, 100ml, 20개은(는) 작지만 강력한 성능으로 여러 상황에서 빛을 발하는 제품입니다.
239	브라운 전기면도기 시리즈9 Pro	HOMEAPPLIANCES	258000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/239/fbab6ea5-0e30-476d-a833-507cba009a13-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154134.png	0	0	2025-03-25 14:44:19.630685	브라운 전기면도기 시리즈9 Pro은(는) 사용자의 라이프스타일을 고려해 설계된 똑똑한 생활 가전입니다.
241	아디다스 울트라부스트 23 러닝화	SPORTS	112000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/241/ea4c2913-0ca1-49e2-80f3-644e21a7a4c5-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154239.png	0	0	2025-03-25 14:44:19.630685	아디다스 울트라부스트 23 러닝화은(는) 활동적인 움직임을 자유롭게 지원하며, 스포츠 퍼포먼스를 극대화합니다.
244	피트니스 밴드 세트 5종	SPORTS	6200	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/244/e60c899c-98f3-40f3-934e-357e0c1bda99-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154407.png	0	0	2025-03-25 14:44:19.630685	피트니스 밴드 세트 5종은(는) 기능성과 스타일을 모두 고려해 운동 중에도 멋스러움을 유지할 수 있습니다.
272	이케아 LACK 사이드 테이블	FURNITURE	19600	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/272/48c68c94-b82d-4bf4-a719-b4811826939a-%EC%9D%B4%EC%BC%80%EC%95%84%20LACK%20%EC%82%AC%EC%9D%B4%EB%93%9C%20%ED%85%8C%EC%9D%B4%EB%B8%94.jpg	0	0	2025-03-25 14:44:19.630685	이케아 LACK 사이드 테이블은(는) 공간 효율성을 고려한 구조로 실내를 보다 넓고 쾌적하게 만들어줍니다.
273	리바트 책상 1200x600	FURNITURE	113000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/273/a712fe55-2ad7-47d3-b798-77428e544c70-%EB%A6%AC%EB%B0%94%ED%8A%B8%20%EC%B1%85%EC%83%81%201200x600.jpg	0	0	2025-03-25 14:44:19.630685	리바트 책상 1200x600은(는) 실용성과 감각적인 미를 동시에 갖춘 고급형 제품입니다.
274	에몬스 LED 수납 침대 Q사이즈	FURNITURE	1100000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/274/7eb3506b-4fce-4bea-a9fd-70a10ce26954-%EC%97%90%EB%AA%AC%EC%8A%A4%20LED%20%EC%88%98%EB%82%A9%20%EC%B9%A8%EB%8C%80%20Q%EC%82%AC%EC%9D%B4%EC%A6%88.jpg	0	0	2025-03-25 14:44:19.630685	에몬스 LED 수납 침대 Q사이즈은(는) 공간 효율성을 고려한 구조로 실내를 보다 넓고 쾌적하게 만들어줍니다.
275	동서가구 3단 서랍장	FURNITURE	74900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/275/e02e9b35-28ca-4d70-863b-8e63743e4914-%EB%8F%99%EC%84%9C%EA%B0%80%EA%B5%AC%203%EB%8B%A8%20%EC%84%9C%EB%9E%8D%EC%9E%A5.jpg	0	0	2025-03-25 14:44:19.630685	동서가구 3단 서랍장은(는) 공간 효율성을 고려한 구조로 실내를 보다 넓고 쾌적하게 만들어줍니다.
277	까사미아 소파베드	FURNITURE	1054000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/277/2ab58e81-8df1-4a91-a773-5e5a62fbc3eb-%EA%B9%8C%EC%82%AC%EB%AF%B8%EC%95%84%20%EC%86%8C%ED%8C%8C%EB%B2%A0%EB%93%9C.jpg	0	0	2025-03-25 14:44:19.630685	까사미아 소파베드은(는) 오랜 시간 사용해도 질리지 않는 심플한 디자인이 특징입니다.
279	노르딕스타일 커피테이블	FURNITURE	18300	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/279/95e31d7b-0f18-44cb-9c80-74b9905472f2-%EB%85%B8%EB%A5%B4%EB%94%95%EC%8A%A4%ED%83%80%EC%9D%BC%20%EC%BB%A4%ED%94%BC%ED%85%8C%EC%9D%B4%EB%B8%94.jpg	0	0	2025-03-25 14:44:19.630685	노르딕스타일 커피테이블은(는) 실용성과 감각적인 미를 동시에 갖춘 고급형 제품입니다.
281	락앤락 냉장고 정리용기 세트	LIVING	14900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/281/cee99bb2-8b76-4539-b526-b5818065ee46-%EB%9D%BD%EC%95%A4%EB%9D%BD%20%EB%83%89%EC%9E%A5%EA%B3%A0%20%EC%A0%95%EB%A6%AC%EC%9A%A9%EA%B8%B0%20%EC%84%B8%ED%8A%B8.jpg	0	0	2025-03-25 14:44:19.630685	락앤락 냉장고 정리용기 세트은(는) 공간을 깔끔하게 정리하고 쾌적하게 유지할 수 있도록 도와줍니다.
283	코멧 욕실화 논슬립	LIVING	5900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/283/81a7bc46-0918-4100-8038-b2ce43ac92db-%EC%BD%94%EB%A9%A7%20%EC%9A%95%EC%8B%A4%ED%99%94%20%EB%85%BC%EC%8A%AC%EB%A6%BD.jpg	0	0	2025-03-25 14:44:19.630685	코멧 욕실화 논슬립은(는) 일상 속 소소한 편리함을 선사하는 생활 필수품입니다.
284	바세츠 수건 10장 세트	LIVING	36100	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/284/a1f8fb8f-a8f3-46a9-976c-8a096bd5142c-%EB%B0%94%EC%84%B8%EC%B8%A0%20%EC%88%98%EA%B1%B4%2010%EC%9E%A5%20%EC%84%B8%ED%8A%B8.jpg	0	0	2025-03-25 14:44:19.630685	바세츠 수건 10장 세트은(는) 감각적인 디자인과 유용한 기능으로 만족도를 높여줍니다.
286	피카소 걸이형 청소포 밀대	LIVING	9900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/286/dd9b311f-3b38-44af-91f7-2a3a1a99ba1f-%ED%94%BC%EC%B9%B4%EC%86%8C%20%EA%B1%B8%EC%9D%B4%ED%98%95%20%EC%B2%AD%EC%86%8C%ED%8F%AC%20%EB%B0%80%EB%8C%80.jpg	0	0	2025-03-25 14:44:19.630685	피카소 걸이형 청소포 밀대은(는) 간단하면서도 활용도가 높은 제품으로 많은 사랑을 받고 있습니다.
288	모나리자 천연펄프 화장지 30롤	LIVING	14900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/288/9a2559f7-6eeb-47af-ab46-b14e6e1e098f-%EB%AA%A8%EB%82%98%EB%A6%AC%EC%9E%90%20%EC%B2%9C%EC%97%B0%ED%8E%84%ED%94%84%20%ED%99%94%EC%9E%A5%EC%A7%80%2030%EB%A1%A4.jpg	0	0	2025-03-25 14:44:19.630685	모나리자 천연펄프 화장지 30롤은(는) 간단하면서도 활용도가 높은 제품으로 많은 사랑을 받고 있습니다.
290	베이직하우스 커튼 암막 2장	LIVING	28400	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/290/c98cb70b-2ece-44e6-8ae4-f6146d740e5d-%EB%B2%A0%EC%9D%B4%EC%A7%81%ED%95%98%EC%9A%B0%EC%8A%A4%20%EC%BB%A4%ED%8A%BC%20%EC%95%94%EB%A7%89%202%EC%9E%A5.jpg	0	0	2025-03-25 14:44:19.630685	베이직하우스 커튼 암막 2장은(는) 감각적인 디자인과 유용한 기능으로 만족도를 높여줍니다.
292	비츠엠 차량용 핸드폰 거치대	OTHERS	15900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/292/26a0e264-d04c-4c81-aaf9-76a4423a0876-%EB%B9%84%EC%B8%A0%EC%97%A0%20%EC%B0%A8%EB%9F%89%EC%9A%A9%20%ED%95%B8%EB%93%9C%ED%8F%B0%20%EA%B1%B0%EC%B9%98%EB%8C%80.png	0	0	2025-03-25 14:44:19.630685	비츠엠 차량용 핸드폰 거치대은(는) 독특한 아이디어가 접목된 아이템으로, 일상의 재미를 더해줍니다.
294	하리보 골드베렌 젤리 1kg	OTHERS	11100	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/294/a31010e6-f193-477a-977b-0da608cd8a62-%ED%95%98%EB%A6%AC%EB%B3%B4%20%EA%B3%A8%EB%93%9C%EB%B2%A0%EB%A0%8C%20%EC%A0%A4%EB%A6%AC%201kg.jpg	0	0	2025-03-25 14:44:19.630685	하리보 골드베렌 젤리 1kg은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.
296	삼성 microSD EVO Plus 128GB	OTHERS	16000	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/296/edf4472c-a572-4ce8-9494-e544cb8f3b25-%EC%82%BC%EC%84%B1%20microSD%20EVO%20Plus%20128GB.jpg	0	0	2025-03-25 14:44:19.630685	삼성 microSD EVO Plus 128GB은(는) 실용성과 창의성을 동시에 갖춘 제품으로, 일상에 신선한 변화를 줍니다.
298	롯데월드 자유이용권 1인	OTHERS	10700	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/298/581608a3-19f2-4441-a775-34bb08e2ced1-%EB%A1%AF%EB%8D%B0%EC%9B%94%EB%93%9C%20%EC%9E%90%EC%9C%A0%EC%9D%B4%EC%9A%A9%EA%B6%8C%201%EC%9D%B8.jpg	0	0	2025-03-25 14:44:19.630685	롯데월드 자유이용권 1인은(는) 독특한 아이디어가 접목된 아이템으로, 일상의 재미를 더해줍니다.
299	강아지 배변패드 중형 100매	OTHERS	24900	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/299/5a720b98-c5a4-4708-9ece-29efa34a22b7-%EA%B0%95%EC%95%84%EC%A7%80%20%EB%B0%B0%EB%B3%80%ED%8C%A8%EB%93%9C%20%EC%A4%91%ED%98%95%20100%EB%A7%A4.jpg	0	0	2025-03-25 14:44:19.630685	강아지 배변패드 중형 100매은(는) 다양한 환경에서 유용하게 활용할 수 있어 휴대성과 기능성이 뛰어납니다.
247	아레나 수경+수모 세트	SPORTS	28200	https://givuproject-images.s3.ap-northeast-2.amazonaws.com/products/247/a547e23c-db04-4405-a1f7-513b5cda895e-%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-26%20154538.png	0	0	2025-03-25 14:44:19.630685	아레나 수경+수모 세트은(는) 활동적인 움직임을 자유롭게 지원하며, 스포츠 퍼포먼스를 극대화합니다.
\.


--
-- TOC entry 5030 (class 0 OID 16606)
-- Dependencies: 230
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, funding_id, user_id, comment, image, created_at, updated_at, visit) FROM stdin;
\.


--
-- TOC entry 5018 (class 0 OID 16496)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, kakao_id, nickname, email, birth, profile_image, address, gender, age_range, balance, created_at, updated_at) FROM stdin;
1	0	string	string	2025-03-24	string	string	MALE	TEENAGER	0	2025-03-24 10:54:57.191577	2025-03-24 10:54:57.191577
2	1	ㄴㄴㄴ	ㄴㄴ	2025-03-24	string	string	MALE	TEENAGER	0	2025-03-24 12:17:00.661724	2025-03-24 12:17:00.661724
3	33	ㅁㅇㄹㄴㅁㄴㄹㅇㅁㄴㅇㄹ	ㄹㄹㄹㄹ	2025-03-24	string	string	MALE	TEENAGER	0	2025-03-24 06:57:26.656422	2025-03-24 06:57:26.657412
4	4	string	string	2025-03-24	string	string	MALE	TEENAGER	0	2025-03-24 07:05:36.888037	2025-03-24 07:05:36.889037
5	3969091283	신은찬	dmscks3126@gmail.com	2025-03-25	http://k.kakaocdn.net/dn/bss8qz/btsMTbtUN7x/GDBXFNzmtdVGnliXqOeYjk/img_640x640.jpg	카카오 주소 없음	\N	\N	0	2025-03-25 01:54:52.911561	2025-03-25 01:54:52.911561
6	4101698941	정지원	littlesam95@naver.com	\N	http://k.kakaocdn.net/dn/76Rma/btsMaCFLxJv/KeL72Fa3cjcvZnX6VY8My0/img_640x640.jpg	카카오 주소 없음	\N	\N	0	2025-03-26 08:21:36.122141	2025-03-26 08:21:36.122141
7	4101722889	장홍준	jun99421@naver.com	\N	http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg	카카오 주소 없음	\N	\N	0	2025-03-26 08:37:05.700232	2025-03-26 08:37:05.700232
\.


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 219
-- Name: fundings_funding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fundings_funding_id_seq', 1, false);


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 222
-- Name: letters_letter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.letters_letter_id_seq', 1, false);


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 226
-- Name: payments_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_transaction_id_seq', 1, false);


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_review_product_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_review_product_review_id_seq', 1, false);


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 224
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 300, true);


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 229
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 3, true);


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 7, true);


--
-- TOC entry 4854 (class 2606 OID 16631)
-- Name: bank_transaction bank_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transaction
    ADD CONSTRAINT bank_transaction_pkey PRIMARY KEY (transaction_key, user_id);


--
-- TOC entry 4842 (class 2606 OID 16526)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, funding_id);


--
-- TOC entry 4840 (class 2606 OID 16516)
-- Name: fundings fundings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fundings
    ADD CONSTRAINT fundings_pkey PRIMARY KEY (funding_id);


--
-- TOC entry 4844 (class 2606 OID 16547)
-- Name: letters letters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.letters
    ADD CONSTRAINT letters_pkey PRIMARY KEY (letter_id);


--
-- TOC entry 4850 (class 2606 OID 16594)
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (user_id, funding_id);


--
-- TOC entry 4848 (class 2606 OID 16573)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (transaction_id);


--
-- TOC entry 4856 (class 2606 OID 16695)
-- Name: product_review product_review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT product_review_pkey PRIMARY KEY (product_review_id);


--
-- TOC entry 4846 (class 2606 OID 16565)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- TOC entry 4852 (class 2606 OID 16615)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4838 (class 2606 OID 16505)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4858 (class 2606 OID 16532)
-- Name: favorites fk_fundings_to_favorites; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_fundings_to_favorites FOREIGN KEY (funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 4860 (class 2606 OID 16553)
-- Name: letters fk_fundings_to_letters; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.letters
    ADD CONSTRAINT fk_fundings_to_letters FOREIGN KEY (funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 4865 (class 2606 OID 16600)
-- Name: participants fk_fundings_to_participants; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT fk_fundings_to_participants FOREIGN KEY (funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 4862 (class 2606 OID 16579)
-- Name: payments fk_fundings_to_payments; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_fundings_to_payments FOREIGN KEY (related_funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 4867 (class 2606 OID 16621)
-- Name: reviews fk_fundings_to_reviews; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_fundings_to_reviews FOREIGN KEY (funding_id) REFERENCES public.fundings(funding_id) ON DELETE CASCADE;


--
-- TOC entry 4870 (class 2606 OID 16701)
-- Name: product_review fk_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- TOC entry 4863 (class 2606 OID 16584)
-- Name: payments fk_products_to_payments; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_products_to_payments FOREIGN KEY (related_product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- TOC entry 4871 (class 2606 OID 16696)
-- Name: product_review fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4869 (class 2606 OID 16632)
-- Name: bank_transaction fk_users_to_bank_transaction; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_transaction
    ADD CONSTRAINT fk_users_to_bank_transaction FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4859 (class 2606 OID 16527)
-- Name: favorites fk_users_to_favorites; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk_users_to_favorites FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4857 (class 2606 OID 16517)
-- Name: fundings fk_users_to_fundings; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fundings
    ADD CONSTRAINT fk_users_to_fundings FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4861 (class 2606 OID 16548)
-- Name: letters fk_users_to_letters; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.letters
    ADD CONSTRAINT fk_users_to_letters FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4866 (class 2606 OID 16595)
-- Name: participants fk_users_to_participants; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT fk_users_to_participants FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4864 (class 2606 OID 16574)
-- Name: payments fk_users_to_payments; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_users_to_payments FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4868 (class 2606 OID 16616)
-- Name: reviews fk_users_to_reviews; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_users_to_reviews FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-03-27 14:36:17

--
-- PostgreSQL database dump complete
--

