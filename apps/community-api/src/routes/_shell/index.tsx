import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/site/seo';
import HomePage from '@/site/pages/HomePage';

export const Route = createFileRoute('/_shell/')({
  head: () =>
    pageHead({
      title: '福滤娃 FeedSieve · 用了福滤娃，评论区不骚了，也不黑了',
      description: '用了福滤娃，评论区不骚了，也不黑了。开源的 X（Twitter）垃圾账号清理工具：黄推一眼标出，真拉黑全端同步，误杀随时可救。',
      path: '/',
    }),
  component: HomePage,
});
