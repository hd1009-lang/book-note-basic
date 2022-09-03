import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export const getFile = async (direct: string) => {
  const check = await fetch(direct).then((data) => data.text());
  const matterResult = matter(check);
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();
  return { content: contentHtml, data: matterResult.data };
};

interface TitleBook {
  plain_text: string;
}
interface Book {
  title: TitleBook[];
}
export const handleNameOfBook = (titleBook: Book): string => {
  let resultTitleBook: string = '';
  titleBook.title.forEach((item) => (resultTitleBook += item.plain_text));
  return resultTitleBook;
};
