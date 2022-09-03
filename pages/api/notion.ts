// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
type Data = {
  data: {};
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const { method, body } = req;
  switch (method) {
    case 'PATCH':
      const { blockID, mount } = JSON.parse(body);
      const response = await notion.pages.update({
        page_id: blockID,
        properties: {
          ['q_nZ']: { number: mount + 1 },
        },
      });
      // q_nZ là id của cột mount --> console.log ra để có thể check id
      return res.status(200).json({ data: response });
    default:
      break;
  }
}
