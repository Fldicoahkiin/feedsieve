import { Link } from '@tanstack/react-router';
import {
  ShieldAlert,
  HelpCircle,
  Download,
  Settings2,
  Trophy,
  PlayCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { CHROME_STORE_URL, GITHUB_URL } from '../site';

/**
 * 教程页：上手指南、批量拉黑防封安全边界、常见问题解答。
 */
export default function GuidePage() {
  return (
    <main className="mx-auto max-w-4xl px-[clamp(18px,2.2vw,34px)] py-10 sm:py-14">
      {/* 头部标题与定位 */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-surface px-3.5 py-1 text-xs font-semibold text-gold">
          <span>📖 新手与进阶指南</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-ink">
          福滤娃使用教程
        </h1>
        <p className="mt-2 text-base text-mist">
          从安装配置到打野冲榜，带你彻底告别 X 评论区黄推与牛皮癣。
        </p>
      </div>

      {/* 锚点导航胶囊 */}
      <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="教程目录">
        {[
          ['安装方式', 'install'],
          ['上手四步', 'start'],
          ['打野排位', 'hunting'],
          ['关键设置', 'settings'],
          ['400发防封边界', 'safety'],
          ['常见问题', 'faq'],
        ].map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full bg-surface px-3.5 py-1.5 text-xs font-semibold text-mist shadow-sm border border-line/60 transition-all hover:border-ink/20 hover:text-ink"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* 1. 安装方式 */}
      <section id="install" className="mt-12 scroll-mt-20">
        <div className="flex items-center gap-2 text-xl font-bold text-ink">
          <Download className="size-5 text-gold" />
          <h2>安装方式</h2>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-[var(--panel-elev)]">
          <table className="w-full text-left text-sm" data-testid="guide-table">
            <tbody className="divide-y divide-line/50">
              <GuideRow label="Chrome 应用商店（推荐）">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={CHROME_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-gold hover:underline underline-offset-4"
                  >
                    <span>点「添加至 Chrome」，自动更新</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                  <span className="rounded bg-gold-surface px-2 py-0.5 text-xs font-medium text-gold">
                    官方审核 · 一键同步
                  </span>
                </div>
              </GuideRow>
              <GuideRow label="GitHub Releases">
                <div className="leading-relaxed">
                  <a
                    href={`${GITHUB_URL}/releases`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-ink underline-offset-4 hover:underline"
                  >
                    下载 ZIP 解压
                  </a>{' '}
                  → 地址栏输入{' '}
                  <code className="rounded bg-soft-surface px-1.5 py-0.5 text-xs font-mono text-ink">
                    chrome://extensions
                  </code>{' '}
                  → 开启右上角「开发者模式」 → 点击「加载已解压的扩展程序」
                </div>
              </GuideRow>
              <GuideRow label="从源码构建">
                <div className="leading-relaxed">
                  终端执行{' '}
                  <code className="rounded bg-soft-surface px-1.5 py-0.5 text-xs font-mono text-ink">
                    pnpm install &amp;&amp; pnpm build:extension
                  </code>
                  ，在浏览器加载输出目录{' '}
                  <code className="rounded bg-soft-surface px-1.5 py-0.5 text-xs font-mono text-ink">
                    apps/extension/.output/chrome-mv3
                  </code>
                </div>
              </GuideRow>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-mist leading-relaxed">
          💡 Edge / Brave / Arc 等 Chromium 浏览器均可直接安装商店版。装好即用，无需配置 API Key 或登录任何第三方平台。
        </p>
      </section>

      {/* 2. 上手四步 */}
      <section id="start" className="mt-14 scroll-mt-20">
        <div className="flex items-center gap-2 text-xl font-bold text-ink">
          <PlayCircle className="size-5 text-gold" />
          <h2>上手四步</h2>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <StepCard
            step="01"
            title="刷 X，看黄框"
            desc="打开 x.com 正常刷推。高置信垃圾账号被醒目黄框标出，底部注明判定理由（机器人、色情引流、外链欺诈等）。推文原文不被隐藏，内容看得一清二楚。"
          />
          <StepCard
            step="02"
            title="单个顺手送走"
            desc="点击黄框右上角的「顺手拉黑」：直接调用你已登录 X 会话的内部 Block 接口，手机与 iPad 客户端即刻全端同步消失，永绝后患。"
          />
          <StepCard
            step="03"
            title="攒一批一键送走"
            desc="浏览过程中被黄标的账号会自动暂存至待处理列表。打开扩展弹窗点「一键拉黑」，按安全节奏逐个执行，成功即刻移除，失败会明明白白提示原因。"
          />
          <StepCard
            step="04"
            title="漏网手动标，误伤一秒救"
            desc="看到漏网黄推？任意推文菜单点「标记垃圾并拉黑」，系统自动提取特征；若不小心误伤了好友，在已拉黑列表点「放回来」即可秒级解除屏蔽。"
          />
        </div>
      </section>

      {/* 3. 打野排位 */}
      <section id="hunting" className="mt-14 scroll-mt-20">
        <div className="flex items-center gap-2 text-xl font-bold text-ink">
          <Trophy className="size-5 text-gold" />
          <h2>打野排位</h2>
        </div>
        <div className="mt-4 rounded-2xl border border-line/70 bg-surface p-6 shadow-[var(--panel-elev)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/50 pb-5">
            <div>
              <h3 className="text-base font-bold text-ink">清朗推特，社区闯关</h3>
              <p className="mt-1 text-xs text-mist leading-relaxed">
                打开扩展弹窗「打野」选项卡，可查看个人战报（确认击杀数、命中率、段位称号）与实时排位榜。
              </p>
            </div>
            <Link
              to="/lists/ranked"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              查看全网天梯周榜 →
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-xl bg-soft-surface p-3.5">
              <div className="font-bold text-ink">积分规则</div>
              <div className="mt-1 text-mist leading-relaxed">
                确认击杀 +1 分，全网首杀额外 +1 分；若经社区核实为误杀，不仅不计分反而倒扣 2 分。
              </div>
            </div>
            <div className="rounded-xl bg-soft-surface p-3.5">
              <div className="font-bold text-ink">隐私与认领</div>
              <div className="mt-1 text-mist leading-relaxed">
                上榜默认完全匿名。想公开展示名字的打野玩家，可在弹窗内认领档案并通过邮箱验证，自愿绑定个人 @handle。
              </div>
            </div>
            <div className="rounded-xl bg-soft-surface p-3.5">
              <div className="font-bold text-ink">周赛季荣誉</div>
              <div className="mt-1 text-mist leading-relaxed">
                每周一按 ISO 周结算。周榜 Top 3 且整体命中率 ≥80% 的玩家，将永久获得「猎黄人」或「七娃镇海」社区徽章。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 设置 */}
      <section id="settings" className="mt-14 scroll-mt-20">
        <div className="flex items-center gap-2 text-xl font-bold text-ink">
          <Settings2 className="size-5 text-gold" />
          <h2>核心设置项</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SettingItem
            title="同步关注列表（防误伤金钟罩）"
            desc="一键将你的关注列表存为本地免检名单，自动排除在一切标记与拉黑之外。数据只在本地匹配，永不上传服务器。"
          />
          <SettingItem
            title="订阅关键词库"
            desc={
              <>
                官方提供 8 个场景词库共 778 条公开规则，默认仅启用「黄推/成人引流」，其他分类按需自选。所有词库明牌公示在{' '}
                <Link to="/lists/keywords" className="font-semibold text-gold hover:underline">
                  开源词库
                </Link>
                。
              </>
            }
          />
          <SettingItem
            title="识别灵敏度档位"
            desc="提供 清爽 / 标准 / 大扫除 三档灵敏度，仅影响提示阈值。无论哪一档，黄框标注都绝不执行任何无人值守的静默拉黑。"
          />
          <SettingItem
            title="本地配置备份与迁移"
            desc="支持将本地白名单与自定义规则导出为 JSON 文件，换电脑一键导入合并，无须重新配置，且不包含任何推特登录态。"
          />
        </div>
      </section>

      {/* 5. 批量拉黑的安全边界 */}
      <section id="safety" className="mt-14 scroll-mt-20">
        <div className="flex items-center gap-2 text-xl font-bold text-ink">
          <ShieldAlert className="size-5 text-gold" />
          <h2>批量拉黑的安全边界</h2>
        </div>
        <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 dark:bg-amber-500/10">
          <h3 className="font-bold text-ink text-base">400 发子弹配额与 429 智能休眠熔断</h3>
          <p className="mt-2 text-sm text-mist leading-relaxed">
            拉黑请求走的是你浏览器当前登录的 X 正常会话，与你在网页上手动点屏蔽属于完全相同的数据通道。推特天天治不了批量黄推，但对正常用户的频繁操作抓得极严。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-line/70 bg-surface p-4">
              <span className="font-bold text-ink">🎯 400 发 / 24 小时滚动配额</span>
              <p className="mt-1 text-mist leading-relaxed">
                本地队列内置 24 小时配额上限。配额耗尽后自动暂停，避免短时间发起超量请求引发推特风控。大名单建议分几天逐步送走。
              </p>
            </div>
            <div className="rounded-xl border border-line/70 bg-surface p-4">
              <span className="font-bold text-ink">⚡️ 429 自动装死熔断与随机抖动</span>
              <p className="mt-1 text-mist leading-relaxed">
                每次拉黑操作均附带随机时间抖动；一旦收到 X 接口返回 429 限流响应，立即启动休眠装死，绝不拿你的大号去赌风控。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 常见问题 */}
      <section id="faq" className="mt-14 scroll-mt-20">
        <div className="flex items-center gap-2 text-xl font-bold text-ink">
          <HelpCircle className="size-5 text-gold" />
          <h2>常见问题解答</h2>
        </div>
        <div className="mt-4 space-y-3">
          <FaqItem
            q="为什么是原生拉黑，而不是本地隐藏（display: none）？"
            a="本地隐藏纯属鸵鸟战术，只在当前浏览器把 DOM 节点 display: none 遮住，换到手机或平板刷推依然被黄推骑脸。福滤娃直接调取 X 官方 Block 接口，全端设备立刻同步消失，彻底切断私信与骚扰通知。"
          />
          <FaqItem
            q="会封我自己的推特账号吗？"
            a="我们比你更怕被封号。福滤娃内置 400 发子弹配额限制、拟人化时间抖动；遭遇 429 自动进入装死熔断，绝不拿大号去试探推特风控底线。"
          />
          <FaqItem
            q="需要购买或申请推特开发者 API 吗？"
            a="完全不需要。拉黑操作全程在你本地已登录的 X 会话内完成，福滤娃服务器连你的账号密码长什么样都不知道。"
          />
          <FaqItem
            q="我的推文、浏览历史或密码会被上传吗？"
            a="绝对不会。所有检测规则与正则在本地沙箱运算，推文原文永不出设备；社区名单只在上报时包含账号 handle、分类标签、话术哈希指纹和外链域名。"
          />
          <FaqItem
            q="如果发现误标了正常博主怎么办？"
            a={
              <>
                插件内置已拉黑撤销功能，点「放回来」一键恢复。如果是社区名单误标，可前往{' '}
                <Link to="/lists/apply" className="font-semibold text-gold hover:underline">
                  官网申诉页
                </Link>{' '}
                提交申请，邮箱验证后由维护者核验解封。
              </>
            }
          />
        </div>
      </section>
    </main>
  );
}

function GuideRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="align-top">
      <td className="w-1/3 py-3.5 px-4 font-semibold text-ink sm:w-1/4">{label}</td>
      <td className="py-3.5 px-4 text-mist">{children}</td>
    </tr>
  );
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-surface p-5 shadow-[var(--panel-elev)] transition-all hover:border-ink/20">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-gold-surface font-mono text-xs font-bold text-gold">
          {step}
        </span>
        <h3 className="font-bold text-ink text-sm">{title}</h3>
      </div>
      <p className="mt-2 text-xs text-mist leading-relaxed">{desc}</p>
    </div>
  );
}

function SettingItem({ title, desc }: { title: string; desc: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-surface p-5 shadow-[var(--panel-elev)]">
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <p className="mt-1.5 text-xs text-mist leading-relaxed">{desc}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="group rounded-2xl border border-line/70 bg-surface p-5 shadow-[var(--panel-elev)] transition-all">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-sm text-ink select-none">
        <span>{q}</span>
        <ChevronDown className="size-4 shrink-0 text-fog transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="mt-3 text-xs text-mist leading-relaxed border-t border-line/40 pt-3">
        {a}
      </div>
    </details>
  );
}
