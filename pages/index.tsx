import { Client } from '@notionhq/client';
import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { motion } from 'framer-motion';
import Router from 'next/router';
import Head from 'next/head';
export default function Home({ result }: ArrayResult) {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [note, setNote] = useState<Result>(result);
  const handleUpdate = async (blockID: string, mount: number) => {
    const { data } = await fetch('/api/notion', {
      method: 'PATCH',
      body: JSON.stringify({ blockID, mount }),
    }).then((data) => data.json());
    setNote(data);
    Router.push('/success');
  };
  const handleShowContent = () => {
    setShowContent(!showContent);
  };
  return (
    <div className='w-full h-screen flex items-center justify-center overflow-hidden'>
      <Head>
        <title>My note</title>
      </Head>
      <div className='w-fit min-w-[30%] h-[500px] text-[14px] overflow-hidden relative '>
        <motion.h4
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, delay: 1 }}
          className='absolute top-[5px] right-[15px] text-[12px] z-[100] font-bold'
        >
          {note.properties.Mount.number}
        </motion.h4>
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={!showContent ? { y: 0, opacity: 1, zIndex: 10 } : { y: '-100%' }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.75 }}
          className='w-full h-[250px] flex items-center justify-center absolute top-0 left-0 z-50  px-[10px]  rounded-[5px] border-4 border-[black] box__title bg-white'
          onClick={() => handleShowContent()}
        >
          <div className=' w-full h-full   relative top-0  flex items-center justify-center px-[5px]'>
            <h3 className=' font-medium text-[20px] md:text-[25px] xl:text-[28px]'>{note.properties.Book.title[0]?.plain_text}</h3>
            <span className='font-medium text-[10px]'>-{note.properties.Page.number}</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={showContent ? { y: 0, opacity: 1, zIndex: 10 } : { y: '100%' }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.75 }}
          className='flex flex-col h-[90%] w-full'
        >
          <motion.div
            onClick={() => handleShowContent()}
            className='max-h-[90%] h-fit w-full overflow-scroll p-[20px] bg-white box__content rounded-[5px]'
          >
            <p> {note.properties.Quote.rich_text[0]?.plain_text}</p>
          </motion.div>
          <motion.button
            className='mt-2 h-[10%] flex-shrink-0 w-[200px] bg-red-100 m-auto border-2 border-current rounded-[5px]'
            onClick={() => handleUpdate(note.id, note.properties.Mount?.number)}
          >
            Xác nhận
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
interface Result {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: {
    Quote: { rich_text: [{ plain_text: string }] };
    Book: { title: [{ plain_text: string }] };
    Mount: { number: number };
    Page: { number: number };
  };
}
interface ArrayResult {
  result: Result;
}

// export async function getStaticProps() {
//   const notion = new Client({ auth: process.env.NOTION_API_KEY });
//   const databaseId = process.env.NOTION_DATABASE_ID;
//   const { results } = await notion.databases.query({ database_id: databaseId as string });
//   const random = Math.floor(Math.random() * results.length);
//   const result = results[random];
//   return {
//     props: {
//       result,
//     },
//   };
// }
export async function getServerSideProps(context: GetServerSideProps) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = process.env.NOTION_DATABASE_ID;
  const { results } = await notion.databases.query({ database_id: databaseId as string });
  const random = Math.floor(Math.random() * results.length);
  const result = results[random];
  return {
    props: {
      result,
    },
  };
}
