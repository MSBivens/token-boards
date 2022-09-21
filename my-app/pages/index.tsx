import type { NextPage } from "next";
import Head from "next/head";
import Features from "../components/index/Features";
import Hero from "../components/index/Hero";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Web3 Job Board</title>
        <meta
          name="description"
          content="a job board built with web3 utilizing decentraliztion, privacy, and security"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <Features />
    </div>
  );
};

export default Home;
