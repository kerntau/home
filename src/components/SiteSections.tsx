import {
  ArrowUpRight,
  Braces,
  Compass,
  Github,
  History,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { PROJECTS, TIMELINE } from "../data/site";

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion() === true;
  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.46, ease: EASE }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({
  id,
  index,
  label,
  title,
  description,
  icon: Icon,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <header id={id} className="section-heading scroll-mt-28">
      <div className="section-index">
        <span>{index}</span>
        <Icon aria-hidden="true" />
        <span>{label}</span>
      </div>
      <div className="section-title-block">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </header>
  );
}

function ExternalArrow() {
  return <ArrowUpRight aria-hidden="true" className="external-arrow" />;
}

function ProjectVisual({ type }: { type: "blog" | "space" }) {
  if (type === "blog") {
    return (
      <div className="project-visual project-visual-blog" aria-hidden="true">
        <div className="mock-browser-bar"><span /><span /><span /></div>
        <div className="mock-blog-layout">
          <p>序栈 / COT</p>
          <strong>把复杂的问题<br />写得清楚。</strong>
          <div className="mock-rule" />
          <small>SECURITY · ALGORITHM · WEB</small>
        </div>
      </div>
    );
  }

  return (
    <div className="project-visual project-visual-space" aria-hidden="true">
      <div className="mock-browser-bar"><span /><span /><span /></div>
      <div className="mock-space-layout">
        <span className="mock-coordinate">32.65 N / 110.78 E</span>
        <strong>@kerntau</strong>
        <span className="mock-orbit" />
        <span className="mock-orbit-dot" />
        <small>PERSONAL SPACE / 001</small>
      </div>
    </div>
  );
}

export default function SiteSections() {
  return (
    <div className="content-shell" id="content">
      <Reveal className="editorial-section about-section">
        <SectionHeading
          id="about"
          index="01"
          label="ABOUT"
          title="在系统与表达之间"
          description="把主页、文章、知识库与开源轨迹收拢为一个持续生长的空间。"
          icon={Compass}
        />
        <div className="about-layout">
          <p className="about-statement">
            我是 kerntau，一名信息安全专业学生，也在持续实践前端与全栈工程。
          </p>
          <div className="about-copy">
            <p>关注网络安全、底层原理与可维护的软件架构，也相信清晰的表达本身就是一种工程能力。</p>
            <p>这里是所有内容的起点：长期笔记进入知识库，完整文章进入序栈，代码与实验留在 GitHub。</p>
          </div>
          <dl className="identity-facts">
            <div><dt>BASE</dt><dd>湖北 · 十堰</dd></div>
            <div><dt>FOCUS</dt><dd>Security / Web</dd></div>
            <div><dt>STATUS</dt><dd><span className="status-dot" />持续构建中</dd></div>
          </dl>
        </div>
      </Reveal>

      <Reveal className="editorial-section projects-section">
        <SectionHeading
          id="projects"
          index="02"
          label="PROJECTS"
          title="正在维护的项目"
          description="主页不再是孤立入口，Space 与序栈共同构成我的公开工作台。"
          icon={Braces}
        />
        <div className="project-grid">
          {PROJECTS.map((project, index) => (
            <article className="project-card" key={project.name}>
              <ProjectVisual type={index === 0 ? "blog" : "space"} />
              <div className="project-copy">
                <div className="project-label">
                  <span>0{index + 1}</span>
                  <span>{project.stack}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-action"
                  aria-label={`打开 ${project.name} 源码，新窗口`}
                >
                  <Github aria-hidden="true" /> GitHub <ExternalArrow />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="editorial-section log-section">
        <SectionHeading
          id="log"
          index="03"
          label="LOG"
          title="方向变化的节点"
          description="不记录所有事情，只留下改变空间形态的时刻。"
          icon={History}
        />
        <ol className="timeline-list">
          {TIMELINE.map((entry, index) => (
            <li key={`${entry.date}-${entry.title}`} className="timeline-row">
              <time>{entry.date}</time>
              <span className="timeline-mark" aria-hidden="true">
                <span className="timeline-dot" />
                {index < TIMELINE.length - 1 && <span className="timeline-line" />}
              </span>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
