--
-- PostgreSQL database dump
--

-- Dumped from database version 11.1
-- Dumped by pg_dump version 11.2

-- Started on 2019-05-14 18:03:11

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
-- TOC entry 197 (class 1259 OID 183167)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    firstname character varying DEFAULT ''::character varying,
    lastname character varying DEFAULT ''::character varying,
    phone character varying DEFAULT ''::character varying,
    address jsonb DEFAULT '{"home": "", "office": ""}'::jsonb,
    status character varying DEFAULT 'unverified'::character varying,
    isadmin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 183165)
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
-- TOC entry 2825 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2686 (class 2604 OID 183170)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2819 (class 0 OID 183167)
-- Dependencies: 197
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, firstname, lastname, phone, address, status, isadmin) FROM stdin;
1	a@b.com	password	first	men	080121515	{"home": "iyaba", "office": "ring road"}	unverified	f
2	c@d.go	password	name	cat	08151584151	{"home": "london", "office": "NYC"}	unverified	f
3	me@yahoo.com	password	tayo	dele	08012345678	{"home": "ijebu", "office": "ijegun"}	unverified	f
4	abc@gmail.com	password	what	is	08012345678	{"home": "must", "office": "not"}	unverified	f
5	name@chat.co	password	niger	tornadoes	08012345678	{"home": "niger", "office": "niger"}	unverified	f
6	bcc@gmail.com	password	bcc	lions	08012345678	{"home": "gboko", "office": "gboko"}	unverified	f
7	bbc@bbc.uk	password	bbc	broadcast	08012345678	{"home": "london", "office": "uk"}	unverified	f
8	c@g.move	password	abc	def	08012345678	{"home": "shop", "office": "home"}	unverified	f
9	an@dela.ng	password	and	ela	08012345678	{"home": "ikorodu", "office": "lagos"}	unverified	f
10	soft@ware.eng	password	soft	eng	08012345678	{"home": "remote", "office": "on-site"}	unverified	f
\.


--
-- TOC entry 2826 (class 0 OID 0)
-- Dependencies: 196
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- TOC entry 2694 (class 2606 OID 183183)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2696 (class 2606 OID 183181)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2019-05-14 18:03:12

--
-- PostgreSQL database dump complete
--

