--
-- PostgreSQL database dump
--

-- Dumped from database version 11.1
-- Dumped by pg_dump version 11.2

-- Started on 2019-05-18 19:32:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 199 (class 1259 OID 215497)
-- Name: loans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loans (
    id integer NOT NULL,
    userid integer NOT NULL,
    createdon timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying DEFAULT 'pending'::character varying,
    repaid boolean DEFAULT false,
    amount double precision NOT NULL,
    tenor integer NOT NULL,
    interest double precision NOT NULL,
    balance double precision NOT NULL,
    paymentinstallment double precision NOT NULL
);


ALTER TABLE public.loans OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 215495)
-- Name: loans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.loans_id_seq OWNER TO postgres;

--
-- TOC entry 2852 (class 0 OID 0)
-- Dependencies: 198
-- Name: loans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loans_id_seq OWNED BY public.loans.id;


--
-- TOC entry 201 (class 1259 OID 215511)
-- Name: repayments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.repayments (
    id integer NOT NULL,
    loanid integer NOT NULL,
    adminid integer NOT NULL,
    createdon timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    amount double precision NOT NULL
);


ALTER TABLE public.repayments OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 215509)
-- Name: repayments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.repayments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.repayments_id_seq OWNER TO postgres;

--
-- TOC entry 2853 (class 0 OID 0)
-- Dependencies: 200
-- Name: repayments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.repayments_id_seq OWNED BY public.repayments.id;


--
-- TOC entry 197 (class 1259 OID 215478)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    firstname character varying DEFAULT ''::character varying,
    lastname character varying DEFAULT ''::character varying,
    phone character varying DEFAULT ''::character varying,
    photo character varying,
    address jsonb DEFAULT '{"home": "", "office": ""}'::jsonb,
    status character varying DEFAULT 'unverified'::character varying,
    isadmin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 215476)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2854 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2706 (class 2604 OID 215500)
-- Name: loans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans ALTER COLUMN id SET DEFAULT nextval('public.loans_id_seq'::regclass);


--
-- TOC entry 2710 (class 2604 OID 215514)
-- Name: repayments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repayments ALTER COLUMN id SET DEFAULT nextval('public.repayments_id_seq'::regclass);


--
-- TOC entry 2699 (class 2604 OID 215481)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2844 (class 0 OID 215497)
-- Dependencies: 199
-- Data for Name: loans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loans (id, userid, createdon, status, repaid, amount, tenor, interest, balance, paymentinstallment) FROM stdin;
1	1	2019-05-18 18:31:51.055864+00	approved	f	50000	12	2500	36999.3499999999985	4375
2	2	2019-05-18 18:31:51.055864+00	approved	t	100000	12	5000	0	8750
3	3	2019-05-18 18:31:51.055864+00	approved	f	200000	8	10000	200000	26250
4	4	2019-05-18 18:31:51.055864+00	approved	f	25000	12	1250	24500	2187.5
5	5	2019-05-18 18:31:51.055864+00	approved	f	45000	6	2250	26250	7875
6	6	2019-05-18 18:31:51.055864+00	pending	f	80000	12	4000	8000	7000
7	7	2019-05-18 18:31:51.055864+00	rejected	f	60000	6	3000	6000	10500
8	8	2019-05-18 18:31:51.055864+00	approved	f	125000	12	6250	20000	10937.5
9	9	2019-05-18 18:31:51.055864+00	rejected	f	190000	12	9500	19000	16625
10	10	2019-05-18 18:31:51.055864+00	pending	f	1000000	12	50000	0	87500
\.


--
-- TOC entry 2846 (class 0 OID 215511)
-- Dependencies: 201
-- Data for Name: repayments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.repayments (id, loanid, adminid, createdon, amount) FROM stdin;
1	1	3	2019-05-18 18:32:18.347716+00	4375
2	1	3	2019-05-18 18:32:18.347716+00	4375
3	2	1	2019-05-18 18:32:18.347716+00	26250
4	1	2	2019-05-18 18:32:18.347716+00	4375
5	3	4	2019-05-18 18:32:18.347716+00	2875
6	5	8	2019-05-18 18:32:18.347716+00	10500
7	4	3	2019-05-18 18:32:18.347716+00	4375
8	8	1	2019-05-18 18:32:18.347716+00	4375
9	8	4	2019-05-18 18:32:18.347716+00	4375
10	10	8	2019-05-18 18:32:18.347716+00	4375
\.


--
-- TOC entry 2842 (class 0 OID 215478)
-- Dependencies: 197
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, firstname, lastname, phone, photo, address, status, isadmin) FROM stdin;
1	a@b.com	password	first	men	080121515	\N	{"home": "iyaba", "office": "ring road"}	unverified	f
2	c@d.go	password	name	cat	08151584151	\N	{"home": "london", "office": "NYC"}	unverified	f
3	me@yahoo.com	password	tayo	dele	08012345678	\N	{"home": "ijebu", "office": "ijegun"}	unverified	f
4	abc@gmail.com	password	what	is	08012345678	\N	{"home": "must", "office": "not"}	unverified	f
5	name@chat.co	password	niger	tornadoes	08012345678	\N	{"home": "niger", "office": "niger"}	unverified	f
6	bcc@gmail.com	password	bcc	lions	08012345678	\N	{"home": "gboko", "office": "gboko"}	unverified	f
7	bbc@bbc.uk	password	bbc	broadcast	08012345678	\N	{"home": "london", "office": "uk"}	unverified	f
8	c@g.move	password	abc	def	08012345678	\N	{"home": "shop", "office": "home"}	unverified	f
9	an@dela.ng	password	and	ela	08012345678	\N	{"home": "ikorodu", "office": "lagos"}	unverified	f
10	soft@ware.eng	password	soft	eng	08012345678	\N	{"home": "remote", "office": "on-site"}	unverified	f
\.


--
-- TOC entry 2855 (class 0 OID 0)
-- Dependencies: 198
-- Name: loans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loans_id_seq', 10, true);


--
-- TOC entry 2856 (class 0 OID 0)
-- Dependencies: 200
-- Name: repayments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.repayments_id_seq', 10, true);


--
-- TOC entry 2857 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- TOC entry 2717 (class 2606 OID 215508)
-- Name: loans loans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (id);


--
-- TOC entry 2719 (class 2606 OID 215517)
-- Name: repayments repayments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repayments
    ADD CONSTRAINT repayments_pkey PRIMARY KEY (id);


--
-- TOC entry 2713 (class 2606 OID 215494)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2715 (class 2606 OID 215492)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2019-05-18 19:32:44

--
-- PostgreSQL database dump complete
--

