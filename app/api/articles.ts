import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const filePath = path.join(process.cwd(), 'data', 'articles.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newArticle = {
        ...req.body,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      const fileData = fs.readFileSync(filePath, 'utf-8');
      const articles = JSON.parse(fileData);
      articles.push(newArticle);

      fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));
      res.status(200).json({ message: 'Article saved successfully', article: newArticle });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save article' });
    }
  } else if (req.method === 'GET') {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const articles = JSON.parse(fileData);
    res.status(200).json(articles);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}