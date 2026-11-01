import { useEffect, useRef, useState } from 'react'

function Icon({ name }: { name: 'github' | 'sun' | 'moon' | 'arrow' | 'menu' | 'close' | 'mail' | 'linkedin' }) {
  const paths = {
    github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 2a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.3 3.5 6.5 6.8 7A4.8 4.8 0 0 0 8 18v4" /><path d="M8 19c-3 .9-3-1.5-4-2" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    menu: <><path d="M4 8h16M4 16h16" /></>,
    close: <><path d="M5 5l14 14M19 5 5 19" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>,
  }
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="label"><span />{children}</div>
}

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    let pointerX = -100
    let pointerY = -100
    let ringX = -100
    let ringY = -100
    let frame = 0
    let activeMagnetic: HTMLElement | null = null

    const move = (event: MouseEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pointerX}px,${pointerY}px,0)`

      const target = event.target as HTMLElement
      const project = target.closest('.seva-project, .vibe-project')
      const link = target.closest('a, button, input, textarea')
      const text = target.closest('h1, h2, h3, p, span, time, label')
      const state = link ? 'link' : project ? 'project' : text ? 'text' : 'default'
      ringRef.current?.setAttribute('data-state', state)

      const magnetic = target.closest<HTMLElement>('.button, .case-button, .inline-link, .case-nav-back')
      if (activeMagnetic && activeMagnetic !== magnetic) activeMagnetic.style.transform = ''
      activeMagnetic = magnetic
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect()
        magnetic.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .12}px, ${(event.clientY - rect.top - rect.height / 2) * .12}px)`
      }
    }

    const render = () => {
      ringX += (pointerX - ringX) * .16
      ringY += (pointerY - ringY) * .16
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX}px,${ringY}px,0)`
      frame = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', move)
    frame = requestAnimationFrame(render)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(frame)
      if (activeMagnetic) activeMagnetic.style.transform = ''
    }
  }, [])

  return <><div className="cursor-dot" ref={dotRef} /><div className="cursor-ring" data-state="default" ref={ringRef} /></>
}

function StatusChip({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'green' }) {
  return <span className={`status-chip ${tone}`}><i />{children}</span>
}

function CaseButton({ children, href, variant = 'solid', onClick }: { children: React.ReactNode; href?: string; variant?: 'solid' | 'outline' | 'text'; onClick?: () => void }) {
  const className = `button case-action ${variant}`
  return href
    ? <a className={className} href={href} target="_blank" rel="noreferrer">{children}<Icon name="arrow" /></a>
    : <button className={className} onClick={onClick}>{children}<Icon name="arrow" /></button>
}

function CaseLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="case-label type-label"><span>{index}</span>{children}</div>
}

function PlaceholderCopy({ children }: { children: React.ReactNode }) {
  return <div className="placeholder-copy"><span>CONTENT STATUS</span><p>{children} — detailed narrative coming soon.</p></div>
}

function UserGroupCard({ index, title, items }: { index: string; title: string; items: string[] }) {
  return <article className="user-card draw-card"><small>{index}</small><h3>{title}</h3><div>{items.map(item => <span key={item}>{item}</span>)}</div></article>
}

function FlowDiagram({ vibe = false }: { vibe?: boolean }) {
  const nodes = vibe
    ? [['01', 'Mood'], ['02', 'Logic'], ['03', 'Song']]
    : [['01', 'Symptoms'], ['02', 'AI triage'], ['03A', 'Doctor'], ['03B', 'ASHA'], ['03C', 'Emergency']]
  return <div className={`case-flow draw-on-scroll ${vibe ? 'simple' : ''}`}>
    {nodes.map((node, index) => <div className={`flow-node n${index + 1}`} key={node[0]}><small>{node[0]}</small><b>{node[1]}</b></div>)}
    {!vibe && <div className="flow-branch" />}
  </div>
}

function ArchitectureDiagram() {
  return <div className="architecture draw-on-scroll">
    {[
      ['01', 'React'],
      ['02', 'FastAPI'],
      ['03', 'Groq Llama + Gemini'],
      ['04', 'PostgreSQL'],
      ['EXT', 'ABHA / ABDM'],
    ].map((node, index) => <div className={index === 4 ? 'external-node' : ''} key={node[1]}><small>{node[0]}</small><b>{node[1]}</b></div>)}
  </div>
}

function CaseStudy({ project, github, onBack }: { project: 'seva' | 'vibe'; github: string; onBack: () => void }) {
  const seva = project === 'seva'
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('drawn')), { threshold: .2 })
    document.querySelectorAll('.draw-on-scroll, .draw-card').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [project])

  return <main className="case-study" id="top">
    <section className="case-hero-section">
      <Wireframe />
      <div className="liquid-cluster case-liquid" aria-hidden="true"><i className="liquid-drop ld-one" /><i className="liquid-drop ld-two" /><i className="liquid-drop ld-three" /></div>
      <button className="case-nav-back" onClick={onBack}>← Back to work</button>
      <div className="case-hero-content">
        <StatusChip tone={seva ? 'green' : 'blue'}>{seva ? 'Prototype' : 'Python'}</StatusChip>
        <h1 className="line-rise"><span>{seva ? 'Seva' : 'VibeSync'}</span><span>{seva ? 'Arogya' : 'Case study'}</span></h1>
        <p>{seva ? 'AI-powered multilingual healthcare triage for rural India.' : 'A mood-based music recommendation system in Python.'}</p>
      </div>
      <span className="case-index">{seva ? 'CASE / 01' : 'CASE / 02'}</span>
    </section>

    <section className="case-section overview">
      <CaseLabel index="01">Overview</CaseLabel>
      <div className="case-main-copy"><h2>{seva ? 'Care pathways, connected.' : 'Music matched to a mood.'}</h2><p>{seva ? 'Built for patients, ASHA workers, PHC doctors and district admins.' : 'VibeSync uses a selected mood to recommend music.'}</p><PlaceholderCopy>Project overview</PlaceholderCopy></div>
    </section>

    <section className="case-section">
      <CaseLabel index="02">Problem</CaseLabel>
      <div className="case-main-copy"><h2>{seva ? 'Rural healthcare access.' : 'Mood-based music discovery.'}</h2><PlaceholderCopy>{seva ? 'Problem context and research' : 'Problem context'}</PlaceholderCopy></div>
    </section>

    {seva && <section className="case-section case-users">
      <CaseLabel index="03">Users</CaseLabel>
      <div className="user-grid">
        <UserGroupCard index="01" title="Patient" items={['Symptom triage', 'Video consultation', 'History & family mode', 'Reminders & SOS']} />
        <UserGroupCard index="02" title="ASHA" items={['Assisted Mode', 'Maternal care', 'High-risk flagging', 'Medicine check']} />
        <UserGroupCard index="03" title="Doctor" items={['Video consultation', 'Patient history', 'High-risk flags']} />
        <UserGroupCard index="04" title="District Admin" items={['Disease trends', 'Health announcements']} />
      </div>
    </section>}

    <section className="case-section">
      <CaseLabel index={seva ? '04' : '03'}>How it works</CaseLabel>
      <div className="case-diagram-panel"><FlowDiagram vibe={!seva} /></div>
    </section>

    <section className="case-section">
      <CaseLabel index={seva ? '05' : '04'}>Features{seva ? ' by user' : ''}</CaseLabel>
      <div className="case-feature-list">
        {(seva ? [
          ['Patient', 'AI triage · video consultation · ABHA login · patient history · family mode · follow-up reminders · SOS'],
          ['ASHA', 'Assisted Mode · maternal care tracking · high-risk flagging · medicine availability'],
          ['Doctor', 'Video consultation · patient history · high-risk patient flags'],
          ['District Admin', 'Disease-trend view · health announcements'],
        ] : [
          ['01', 'Mood Selector'], ['02', 'Mood of the Day'], ['03', 'Surprise Me'], ['04', 'Guess the Song'],
        ]).map(([title, copy]) => <div className="feature-row" key={title}><span>{title}</span><p>{copy}</p><i>↗</i></div>)}
      </div>
    </section>

    {seva ? <section className="case-section">
      <CaseLabel index="06">Architecture</CaseLabel>
      <div className="case-diagram-panel"><ArchitectureDiagram /></div>
    </section> : <section className="case-section tech-section">
      <CaseLabel index="05">Tech</CaseLabel>
      <div className="tech-single"><span>PY</span><h2>Python</h2></div>
    </section>}

    {seva && <section className="case-section">
      <CaseLabel index="07">Screens</CaseLabel>
      <div className="case-screens">
        <div><span>Patient app</span><PatientScreen /></div>
        <div><span>ASHA dashboard</span><AshaScreen /></div>
        <div><span>District dashboard</span><DistrictScreen /></div>
      </div>
    </section>}

    <section className="case-section learning-section">
      <CaseLabel index={seva ? '08' : '06'}>What I learned</CaseLabel>
      <div className="case-main-copy"><h2>Reflection in progress.</h2><PlaceholderCopy>What I learned</PlaceholderCopy>{!seva && <CaseButton href={github} variant="outline">View on GitHub</CaseButton>}</div>
    </section>

    <section className="case-end">
      <span>END OF CASE STUDY</span>
      <button onClick={onBack}>Return to selected work <Icon name="arrow" /></button>
    </section>
  </main>
}

function Wireframe() {
  return <div className="wireframe" aria-hidden="true">
    <svg viewBox="0 0 1440 820" preserveAspectRatio="none">
      <defs>
        <pattern id="smallGrid" width="54" height="54" patternUnits="userSpaceOnUse">
          <path d="M54 0H0V54" fill="none" />
        </pattern>
        <radialGradient id="fade">
          <stop offset="0" stopColor="white" stopOpacity=".9" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="gridMask"><rect width="100%" height="100%" fill="url(#fade)" /></mask>
      </defs>
      <g mask="url(#gridMask)">
        <rect width="100%" height="100%" fill="url(#smallGrid)" />
        <path className="wave a" d="M-30 520C220 380 340 665 565 480S910 270 1090 465s300 38 420-70" />
        <path className="wave b" d="M-30 560C220 420 340 705 565 520S910 310 1090 505s300 38 420-70" />
        <path className="wave c" d="M-30 600C220 460 340 745 565 560S910 350 1090 545s300 38 420-70" />
      </g>
    </svg>
  </div>
}

function PatientScreen() {
  return <div className="device patient-device">
    <div className="device-top"><b>Seva</b><span>हि · EN</span></div>
    <div className="screen-title"><small>SYMPTOM ASSISTANT</small><strong>How are you feeling?</strong></div>
    <div className="chat bot">Tell me what is troubling you today.</div>
    <div className="chat user">I have a fever and feel short of breath.</div>
    <div className="triage-state"><i />Analyzing symptoms...</div>
    <div className="input-line">Type or speak <b>⌁</b></div>
  </div>
}

function AshaScreen() {
  return <div className="device asha-device">
    <div className="device-top"><b>Assisted Mode</b><span>ASHA</span></div>
    <div className="dash-title"><div><small>BENEFICIARIES</small><strong>Today's visits</strong></div><b>+ Add</b></div>
    {[
      ['Meena Patel', 'Maternal care', 'HIGH'],
      ['Rajesh Kumar', 'Follow-up due', ''],
      ['Aarav Shah', 'Triage complete', ''],
      ['Nisha Devi', 'Medicine check', 'HIGH'],
    ].map(x => <div className="patient-row" key={x[0]}><i>{x[0][0]}</i><span><b>{x[0]}</b><small>{x[1]}</small></span>{x[2] && <em>{x[2]}</em>}</div>)}
  </div>
}

function DistrictScreen() {
  return <div className="device admin-device">
    <div className="device-top"><b>District overview</b><span>ADMIN</span></div>
    <div className="trend-head"><div><small>SYMPTOM SIGNALS</small><strong>Disease trends</strong></div><span>Last 30 days</span></div>
    <div className="trend-chart">
      <svg viewBox="0 0 280 100" preserveAspectRatio="none"><path d="M0 78C26 72 36 80 58 62s36 2 59-18 40 25 65 2 34-5 52-30 31 5 46-8" /><path className="area" d="M0 78C26 72 36 80 58 62s36 2 59-18 40 25 65 2 34-5 52-30 31 5 46-8V100H0Z" /></svg>
    </div>
    <div className="signal-grid"><div><small>FEVER</small><b>↑ High</b></div><div><small>RESPIRATORY</small><b>Stable</b></div></div>
    <div className="announcement"><i />Health announcement ready to publish</div>
  </div>
}

function SevaDiagram() {
  return <div className="seva-diagram">
    <div className="data-line line-one"><i /><i /><i /></div>
    <div className="data-line line-two"><i /><i /><i /></div>
    <PatientScreen />
    <AshaScreen />
    <DistrictScreen />
    <div className="diagram-key"><span><i />PATIENT INPUT</span><span><i />ASSISTED CARE</span><span><i />DISTRICT SIGNAL</span></div>
  </div>
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState('')
  const [formState, setFormState] = useState<'idle' | 'coming'>('idle')
  const [emailCopied, setEmailCopied] = useState(false)
  const [casePage, setCasePage] = useState<'seva' | 'vibe' | null>(null)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      document.documentElement.style.setProperty('--scroll-grid', `${window.scrollY * -.025}px`)
    }
    const onMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${event.clientX}px`)
      document.documentElement.style.setProperty('--my', `${event.clientY}px`)
      document.documentElement.style.setProperty('--gx', `${(event.clientX / window.innerWidth - .5) * 14}px`)
      document.documentElement.style.setProperty('--gy', `${(event.clientY / window.innerHeight - .5) * 14}px`)
    }
    window.addEventListener('scroll', onScroll)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  useEffect(() => {
    const updateClock = () => setTime(new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date()))
    updateClock()
    const timer = window.setInterval(updateClock, 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in'))
    }, { threshold: .12 })
    document.querySelectorAll('.reveal').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const github = 'https://github.com/Namra56'
  const email = '202502626010023@glsu.edu.in'
  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setEmailCopied(true)
    window.setTimeout(() => setEmailCopied(false), 1800)
  }
  const openCase = (project: 'seva' | 'vibe') => {
    setTransitioning(true)
    window.setTimeout(() => {
      setCasePage(project)
      window.scrollTo(0, 0)
      window.setTimeout(() => setTransitioning(false), 350)
    }, 300)
  }
  const closeCase = () => {
    setTransitioning(true)
    window.setTimeout(() => {
      setCasePage(null)
      window.scrollTo(0, 0)
      window.setTimeout(() => setTransitioning(false), 350)
    }, 300)
  }
  const skills = [
    ['Languages', 'C++', 'Java', 'Python', 'JavaScript'],
    ['Web', 'HTML', 'CSS', 'React', 'Vite', 'Tailwind'],
    ['Backend & AI', 'FastAPI', 'PostgreSQL', 'Groq', 'Gemini'],
  ]

  return <div className={`site ${casePage ? 'case-open' : ''}`}>
    <Cursor />
    <div className={`page-sweep ${transitioning ? 'active' : ''}`} />
    <header className={scrolled ? 'scrolled' : ''}>
      <a className="identity" href="#top"><span>NK</span><b>Namra Kapadia</b></a>
      <nav>
        <a href="#work">Work</a>
        <a href="#log">Log</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="header-actions">
        <button className="round-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle color theme"><Icon name={theme === 'light' ? 'moon' : 'sun'} /></button>
        <a className="round-button" href={github} target="_blank" rel="noreferrer" aria-label="Namra on GitHub"><Icon name="github" /></a>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu"><Icon name={menu ? 'close' : 'menu'} /></button>
      </div>
    </header>

    <div className={`mobile-menu ${menu ? 'open' : ''}`}>
      {['Work', 'Log', 'About', 'Contact'].map((item, index) => <a href={`#${item.toLowerCase()}`} onClick={() => setMenu(false)} key={item}><small>0{index + 1}</small>{item}</a>)}
    </div>

    {casePage ? <CaseStudy project={casePage} github={github} onBack={closeCase} /> : <>
    <main id="top">
      <section className="hero">
        <Wireframe />
        <div className="liquid-cluster" aria-hidden="true"><i className="liquid-drop ld-one" /><i className="liquid-drop ld-two" /><i className="liquid-drop ld-three" /></div>
        <div className="coordinate c-one">23.0225° N<br />72.5714° E</div>
        <div className="coordinate c-two">GLS / CSE<br />INDIA</div>
        <div className="hero-content reveal">
          <div className="hero-monogram">NK<i /></div>
          <h1 className="line-rise"><span>Turning curiosity</span><span>into <em>working code.</em></span></h1>
          <p className="role">B.TECH CSE <span>·</span> GLS UNIVERSITY <span>·</span> INDIA</p>
          <div className="hero-buttons">
            <a className="button primary" href="#work">See my work <Icon name="arrow" /></a>
            <a className="button secondary" href={github} target="_blank" rel="noreferrer"><Icon name="github" />GitHub</a>
          </div>
        </div>
        <div className="scroll-mark"><span>SCROLL</span><i /></div>
      </section>

      <section className="work section" id="work">
        <div className="section-intro reveal">
          <Label>01 / FEATURED WORK</Label>
          <p>Projects built while learning by shipping.</p>
        </div>

        <article className="seva-project project-showcase large">
          <div className="project-heading reveal">
            <div>
              <div className="project-status"><i />PROTOTYPE</div>
              <h2>Seva Arogya</h2>
            </div>
            <p>An AI-powered multilingual healthcare triage platform for rural India, built for patients, ASHA workers, PHC doctors and district admins.</p>
          </div>
          <div className="tag-row reveal">
            {['Python', 'FastAPI', 'PostgreSQL', 'React', 'Vite', 'Tailwind CSS', 'Llama 3.3 (Groq)', 'Gemini API'].map(tag => <span key={tag}>{tag}</span>)}
          </div>
          <div className="diagram-wrap reveal">
            <div className="diagram-head"><span>SYSTEM VIEW / 01</span><span>TRIAGE → ASSISTED CARE → DISTRICT INTELLIGENCE</span></div>
            <SevaDiagram />
          </div>
          <div className="serves reveal">
            <Label>WHO IT SERVES</Label>
            <div>
              {[
                ['01', 'Patients', 'Multilingual symptom triage, history, family mode, reminders, SOS and video consultation.'],
                ['02', 'ASHA Workers', 'Assisted Mode, maternal care tracking, medicine checks and high-risk flagging.'],
                ['03', 'Care teams', 'PHC doctor workflows and district dashboards for disease trends and announcements.'],
              ].map(item => <div key={item[0]}><small>{item[0]}</small><h3>{item[1]}</h3><p>{item[2]}</p></div>)}
            </div>
          </div>
          <div className="feature-index reveal">
            <Label>FEATURE INDEX</Label>
            <div>{[
              'AI symptom triage chatbot', 'Doctor video consultation', 'ABHA login · ABDM sandbox',
              'Patient history & family mode', 'Follow-up reminders & SOS alert', 'Maternal care tracking',
              'High-risk patient flagging', 'Medicine availability check', 'ASHA Assisted Mode',
              'Disease-trend dashboard', 'Health announcements',
            ].map((feature, index) => <span key={feature}><small>{String(index + 1).padStart(2, '0')}</small>{feature}</span>)}</div>
          </div>
          <button className="case-button reveal" onClick={() => openCase('seva')}>Read case study <Icon name="arrow" /></button>
        </article>

        <article className="vibe-project project-showcase standard reveal">
          <div className="vibe-copy">
            <div className="project-status blue"><i />PYTHON PROJECT</div>
            <h2>VibeSync</h2>
            <p>A mood-based music recommendation system in Python.</p>
            <div className="vibe-features">{['Mood Selector', 'Mood of the Day', 'Surprise Me', 'Guess the Song'].map(x => <span key={x}>{x}</span>)}</div>
            <a className="inline-link" href={github} target="_blank" rel="noreferrer">View on GitHub <Icon name="arrow" /></a>
          </div>
          <div className="vibe-visual">
            <div className="vibe-ui">
              <div className="vibe-ui-top"><b>VibeSync</b><span>MOOD / MUSIC</span></div>
              <small>HOW DO YOU FEEL?</small>
              <div className="mood-chips">{['Happy', 'Chill', 'Sad', 'Energetic'].map(x => <button key={x}>{x}</button>)}</div>
              <div className="now-playing"><div className="album-art"><i /><i /><i /></div><span><small>NOW PLAYING</small><b>Mood of the Day</b><em>Python recommendation</em></span><strong>Ⅱ</strong></div>
              <button className="surprise">Surprise Me <span>↝</span></button>
            </div>
            <div className="sound-path"><i /><i /><i /><i /><i /></div>
          </div>
        </article>
      </section>

      <section className="log section" id="log">
        <div className="section-intro reveal"><Label>02 / LOG</Label><h2>Build notes.</h2></div>
        <div className="log-list reveal">
          <a className="log-row filled" href="#work" onClick={event => { event.preventDefault(); openCase('seva') }}><time>PROJECT 01</time><span>Seva Arogya — AI healthcare triage for rural India</span><Icon name="arrow" /></a>
          <a className="log-row filled" href="#work" onClick={event => { event.preventDefault(); openCase('vibe') }}><time>PROJECT 02</time><span>VibeSync — mood-based music recommender</span><Icon name="arrow" /></a>
          <div className="log-row empty disabled"><time>COMING SOON</time><span>Next entry — in progress</span><Icon name="arrow" /></div>
        </div>
      </section>

      <section className="doodles section">
        <div className="section-intro reveal"><Label>03 / DOODLES</Label><p>Three lines from the workbench.</p></div>
        <div className="doodle-grid">
          <div className="doodle-card reveal"><svg viewBox="0 0 180 110"><path d="M85 14c-17 0-20 7-20 22v10c0 11-6 14-16 14 10 0 16 4 16 15v8c0 15 3 20 20 20M95 14c17 0 20 7 20 22v10c0 11 6 14 16 14-10 0-16 4-16 15v8c0 15-3 20-20 20" /></svg><span>C++</span></div>
          <div className="doodle-card health reveal"><svg viewBox="0 0 180 110"><path d="M12 60h34l10-18 15 39 18-61 15 40h64" /></svg><span>Seva Arogya</span></div>
          <div className="doodle-card reveal"><svg viewBox="0 0 180 110"><path d="M108 23v54c0 12-12 20-25 16-10-3-9-15 0-20 7-4 17-2 25 2V42l42-10v38c0 12-12 20-25 16-10-3-9-15 0-20 7-4 17-2 25 2V20Z" /></svg><span>VibeSync</span></div>
        </div>
      </section>

      <section className="about section" id="about">
        <Label>04 / ABOUT</Label>
        <div className="about-layout">
          <div className="wire-monogram reveal"><span>NK</span><i /><i /><i /></div>
          <div className="about-statement reveal"><p>Interested in C++, Java, Python and web development. Building projects and learning by shipping.</p><span><i />Currently: learning &amp; building</span></div>
        </div>
      </section>

      <section className="skills section">
        <div className="section-intro reveal"><Label>05 / SKILLS</Label><h2>Tools for turning<br />ideas into systems.</h2></div>
        <div className="skill-marquee reveal"><div>{[...skills.flatMap(group => group.slice(1)), ...skills.flatMap(group => group.slice(1))].map((skill, index) => <span key={`${skill}-${index}`}>{skill}<i>×</i></span>)}</div></div>
        <div className="skills-list reveal">
          {skills.map((group, index) => <div key={group[0]}><small>0{index + 1}</small><h3>{group[0]}</h3><p>{group.slice(1).map(item => <span key={item}>{item}</span>)}</p></div>)}
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact-copy reveal">
          <Label>06 / CONTACT</Label>
          <h2>Let's build<br />something.</h2>
          <div className="contact-actions"><a className="button primary" href={github} target="_blank" rel="noreferrer"><Icon name="github" />GitHub</a><button className="button secondary" onClick={copyEmail}><Icon name="mail" />{emailCopied ? 'Email copied' : 'Copy email'}</button></div>
        </div>
        <form className="contact-form reveal" onSubmit={event => { event.preventDefault(); setFormState('coming') }}>
          <label><span>NAME</span><input required placeholder="Your name" /></label>
          <label><span>EMAIL</span><input required type="email" placeholder="you@example.com" /></label>
          <label><span>MESSAGE</span><textarea required rows={4} placeholder="Your message" /></label>
          <button type="submit">Send message <Icon name="arrow" /></button>
          {formState === 'coming' && <p>Form delivery — coming soon.</p>}
        </form>
      </section>
    </main>

    <footer>
      <div className="footer-brand"><div className="identity"><span>NK</span><b>Namra Kapadia</b></div><p>© Namra Kapadia<br />Designed &amp; built by Namra</p></div>
      <div className="footer-links"><div><span>NAVIGATE</span><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></div><div><span>SOCIAL</span><a href={github} target="_blank" rel="noreferrer"><Icon name="github" />GitHub</a><span className="footer-placeholder"><Icon name="linkedin" />LinkedIn · coming soon</span><a href={`mailto:${email}`}><Icon name="mail" />{email}</a></div></div>
      <div className="footer-clock"><span>INDIA STANDARD TIME</span><b>{time} IST</b><a href="#top">Back to top ↑</a></div>
    </footer>
    </>}
  </div>
}

export default App
