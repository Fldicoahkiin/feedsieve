import { Link } from '@tanstack/react-router';
import { CHROME_STORE_URL, GITHUB_URL } from '../site';

/** 首页：品牌主视觉 + 安装入口 + 三支柱 + 公示入口；文案有梗、直击痛点。 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-[clamp(18px,2.2vw,34px)] pb-16 pt-10 sm:pt-14">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          用了福滤娃，
          <br />
          评论区不骚了，也不黑了。
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          开源的 X（Twitter）垃圾账号清理工具：黄推一眼标出，真拉黑全端同步，误杀随时可救。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={CHROME_STORE_URL}
            className="inline-flex h-11 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Chrome 商店一键安装
          </a>
          <a
            href={GITHUB_URL}
            className="inline-flex h-11 items-center rounded-full bg-surface px-7 text-sm font-semibold text-ink shadow-[var(--panel-elev)] transition-colors hover:bg-wash-strong"
          >
            GitHub 开源仓库
          </a>
        </div>
        <figure className="mx-auto mt-10 max-w-3xl">
          <img
            src="/assets/demo.gif"
            alt="福滤娃在时间线上用黄框标注垃圾账号与一键送走演示"
            className="w-full rounded-[calc(var(--radius)+10px)] shadow-[var(--panel-elev)]"
          />
        </figure>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        <Pillar title="只框不藏" text="内容原样展示，判定证据明牌贴出，拉黑权完全归你" />
        <Pillar title="原生超度" text="借登录会话调 X 原生接口，手机平板全端同步清净" />
        <Pillar title="全量明牌" text="3,144条黑名单与778条词库全开源，误伤一秒放回" />
      </section>

      <section className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-mist">
        <InLink to="/guide">使用教程</InLink>
        <InLink to="/lists/blacklist">黑名单公示</InLink>
        <InLink to="/lists/keywords">开源词库</InLink>
        <InLink to="/lists/ranked">打野天梯榜</InLink>
        <ExtLink href={`${GITHUB_URL}/blob/main/CHANGELOG.md`}>更新日志</ExtLink>
        <ExtLink href={`${GITHUB_URL}/blob/main/PRIVACY.md`}>隐私政策</ExtLink>
        <ExtLink href={`${GITHUB_URL}/issues`}>反馈误标</ExtLink>
      </section>

      <section className="mt-14 text-center text-sm text-mist">
        特征在本地沙箱计算，推文原文与个人隐私 100% 不出设备。
      </section>
    </main>
  );
}

function Pillar({ title, text }: { title: string; text: string }) {
  return (
    <div className="panel-card p-6 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-mist">{text}</p>
    </div>
  );
}

function InLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="transition-colors hover:text-ink">
      {children}
    </Link>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
      {children}
    </a>
  );
}
