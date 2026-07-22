import { ArrowUpRight, BookOpenText, Code2, Compass, History } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ARTICLES, DESTINATIONS, PROJECTS, TIMELINE } from "../data/site";

const EASE = [0.25, 1, 0.5, 1] as const;

function SectionHeading({
  id,
  index,
  title,
  description,
  icon: Icon,
}: {
  id: string;
  index: string;
  title: string;
  description: string;
  icon: typeof BookOpenText;
}) {
  return (
    <header id={id} className="section-heading scroll-mt-24">
      <div className="section-kicker">
        <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
        <span>{index}</span>
      </div>
      <div>
        <h2 className="font-serif text-2xl font-normal sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-7 text-secondary">{description}</p>
      </div>
    </header>
  );
}

function ExternalArrow() {
  return <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.6} />;
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function SiteSections() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8 lg:px-10">
      <Reveal className="site-section border-t border-divider pt-14 sm:pt-20">
        <SectionHeading
          id="about"
          index="01 / ABOUT"
          title="在技术与表达之间"
          description="这里不再只是一个跳转页，而是我在互联网上的统一起点。"
          icon={Compass}
        />
        <div className="content-grid">
          <p className="font-serif text-xl leading-9 text-primary sm:text-2xl sm:leading-10">
            你好，我是 kerntau，一名即将毕业的信息安全专业学生，也在持续实践前端与全栈工程。
          </p>
          <div className="space-y-4 text-sm leading-7 text-secondary">
            <p>我关注网络安全、底层原理与可维护的软件架构，并把学习过程整理成文章、知识库和开源项目。</p>
            <p>Space 现在承接原主页的内容，同时保留安静、克制、带一点生命感的交互体验。</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="site-section">
        <SectionHeading
          id="writing"
          index="02 / WRITING"
          title="最近写下的内容"
          description="技术文章仍然发布在序栈，这里保留最近更新的索引。"
          icon={BookOpenText}
        />
        <div className="divide-y divide-divider border-y border-divider">
          {ARTICLES.map((article) => (
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="content-row group"
              aria-label={`阅读《${article.title}》，新窗口`}
            >
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                  <time dateTime={article.published.replaceAll(".", "-")}>{article.published}</time>
                  <span aria-hidden="true">/</span>
                  <span>{article.tags.join(" · ")}</span>
                </div>
                <h3 className="text-base font-medium leading-7 text-primary">{article.title}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-secondary">{article.summary}</p>
              </div>
              <ExternalArrow />
            </a>
          ))}
        </div>
        <a href="https://blog.cot.wiki/archive" target="_blank" rel="noopener noreferrer" className="section-action">
          查看全部文章
          <ExternalArrow />
        </a>
      </Reveal>

      <Reveal className="site-section">
        <SectionHeading
          id="projects"
          index="03 / PROJECTS"
          title="正在维护的项目"
          description="旧主页不再作为独立产品继续演进，内容与身份入口统一由 Space 承接。"
          icon={Code2}
        />
        <div className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <article key={project.name} className="project-panel bg-surface">
              <div>
                <p className="mb-3 text-[11px] text-muted">{project.stack}</p>
                <h3 className="font-serif text-xl text-primary">{project.name}</h3>
                <p className="mt-3 text-sm leading-7 text-secondary">{project.description}</p>
              </div>
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
                aria-label={`打开 ${project.name} 源码，新窗口`}
              >
                GitHub
                <ExternalArrow />
              </a>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="site-section">
        <SectionHeading
          id="sites"
          index="04 / PLACES"
          title="我在互联网上的去处"
          description="内容、代码和轻量表达各自有不同的节奏。"
          icon={Compass}
        />
        <div className="divide-y divide-divider border-y border-divider">
          {DESTINATIONS.map((site) => (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="destination-row group"
              aria-label={`打开${site.name}，新窗口`}
            >
              <div>
                <h3 className="text-sm font-medium text-primary">{site.name}</h3>
                <p className="mt-1 text-xs text-muted">{site.address}</p>
              </div>
              <p className="hidden text-sm text-secondary sm:block">{site.description}</p>
              <ExternalArrow />
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal className="site-section">
        <SectionHeading
          id="log"
          index="05 / LOG"
          title="一些时间节点"
          description="不追求完整，只记录方向发生变化的时刻。"
          icon={History}
        />
        <ol className="timeline-list">
          {TIMELINE.map((entry, index) => (
            <li key={`${entry.date}-${entry.title}`} className="timeline-row">
              <time className="text-xs text-muted">{entry.date}</time>
              <span className="timeline-mark" aria-hidden="true">
                <span className="timeline-dot" />
                {index < TIMELINE.length - 1 && <span className="timeline-line" />}
              </span>
              <div className="pb-9">
                <h3 className="text-sm font-medium text-primary">{entry.title}</h3>
                <p className="mt-2 text-sm leading-6 text-secondary">{entry.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
