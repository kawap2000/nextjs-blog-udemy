import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout, { siteTitle } from '../components/Layout';

import Link from "next/link";
import utilStyle from "../styles/utils.module.css";
import { getPostsData } from "../lib/post";
import { flushSync } from 'react-dom';
import fs from "fs";
import path from "path";

const postDirectory = path.join(process.cwd(), "posts");

//SSGの場合
export async function getStaticProps() {
  console.log("##getStaticProps##");
  const isClient = () => typeof window !== 'undefined';
  const isServer = () => typeof window === 'undefined';
  if (isClient()) {
    console.log('これはクライアントサイド');
  }
  if (isServer()) {
    console.log('これはサーバーサイド');
  }
  console.log("##postDirectory##");
  console.log(postDirectory);

  const allPostsData = getPostsData();  //id, title, date, thumbnail
  //const allPostsData = '';
  console.log("##allPostsData##");
  console.log(allPostsData);
  const fsValue = fs;
  //  console.log(fsValue);
  
  return {
    props: {
      allPostsData,
    },
  };
}


//SSRの場合
//export async function getServerSideProps(context) {
//  return {
//    props: {
//      //コンポーネントに渡すためのprops
//    },
//  };
//}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyle.headingMd}>
        <p>私はNext.jsエンジニアです／好きなフレームワークはNext.jsです。</p>
      </section>

      <section className={`${utilStyle.headingMd} ${utilStyle.padding1px}`}>
        <h2>📝エンジニアのブログ</h2>
        <div className={styles.grid}>
          {allPostsData.map(({id, title, date, thumbnail}) => (
          <article key={id}>
            <Link href={`/posts/${id}`}>
            <Image src={`${thumbnail}`} 
            className={styles.thumbnailImage}  
            />
            </Link>
            <Link href={`/posts/${id}`}>
              <a className={utilStyle.boldText}>{title}</a>
            </Link>
            <br />
            <small className={utilStyle.lightText}>{date}</small>
          </article>
        ))}
        </div>
      </section>
    </Layout>
  );
}
