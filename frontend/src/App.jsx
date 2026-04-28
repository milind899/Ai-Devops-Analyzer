import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const slide = {
  enter: d => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: d => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
}

const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

function Tag({ label, colorClass, bgClass, borderClass }) {
  return (
    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${bgClass} ${borderClass} ${colorClass}`}>
      {label}
    </span>
  )
}

function ProgressDots({ step }) {
  const labels = ['Task', 'Repository', 'Branch']
  return (
    <div className="mb-10 w-full">
      <div className="flex items-center justify-between relative z-10">
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-3 relative z-10 w-1/3">
            <motion.div
              animate={{
                backgroundColor: i <= step ? '#6366f1' : '#27272a',
                scale: i === step ? 1.2 : 1,
                boxShadow: i === step ? '0 0 20px rgba(99,102,241,0.5)' : 'none'
              }}
              className="w-3 h-3 rounded-full border border-zinc-700/50"
            />
            <span className={`text-xs transition-colors duration-300 ${i <= step ? 'text-zinc-200 font-semibold' : 'text-zinc-600'}`}>
              {label}
            </span>
          </div>
        ))}
        <div className="absolute top-[5px] left-[16%] right-[16%] h-[1px] bg-zinc-800 -z-10" />
        <motion.div 
          className="absolute top-[5px] left-[16%] h-[2px] bg-indigo-500 -z-10"
          initial={{ width: '0%' }}
          animate={{ width: step === 0 ? '0%' : step === 1 ? '34%' : '68%' }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

function StepRequirement({ value, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">Describe the Change</h2>
        <p className="text-sm text-zinc-400">Explain the feature being deployed to assess context risk.</p>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="e.g. Implement OAuth2 authentication and update PostgreSQL schema..."
          rows={5}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-inner"
        />
        <div className={`absolute bottom-3 right-4 text-xs font-medium ${value.length >= 10 ? 'text-indigo-400' : 'text-zinc-500'}`}>
          {value.length} {value.length < 10 && `/ 10 chars required`}
        </div>
      </div>
    </div>
  )
}

function StepRepo({ value, onChange }) {
  const examples = ['github.com/myorg/backend', 'github.com/team/auth-service', 'github.com/user/api']
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">Target Repository</h2>
        <p className="text-sm text-zinc-400">Provide the public GitHub repository URL.</p>
      </div>
      <input 
        type="url" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder="https://github.com/username/repo"
        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
      />
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {examples.map(ex => (
          <button 
            key={ex} 
            onClick={() => onChange(`https://${ex}`)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400 hover:text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepBranch({ value, onChange }) {
  const branches = ['main', 'master', 'develop', 'feature/new-ui', 'hotfix/critical']
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">Target Branch</h2>
        <p className="text-sm text-zinc-400">Specify the branch containing the deployment candidate.</p>
      </div>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. main, feature/auth"
        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
      />
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {branches.map(b => (
          <button 
            key={b} 
            onClick={() => onChange(b)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              value === b 
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700'
            }`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  )
}

function RiskBar({ score, level }) {
  let color = 'bg-emerald-500'; let glow = 'shadow-emerald-500/50'
  if (level === 'Medium') { color = 'bg-amber-500'; glow = 'shadow-amber-500/50' }
  if (level === 'High') { color = 'bg-rose-500'; glow = 'shadow-rose-500/50' }

  return (
    <div className="w-full space-y-2 mt-4">
      <div className="flex justify-between items-end text-sm">
        <span className="text-zinc-400 font-medium tracking-wide text-xs uppercase">Overall Risk Index</span>
        <span className="font-bold text-white">{Math.round(score * 100)}%</span>
      </div>
      <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${score * 100}%` }} 
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`h-full ${color} rounded-full shadow-[0_0_10px] ${glow}`} 
        />
      </div>
    </div>
  )
}

function GithubBanner({ connected, error, repoInfo, filesCount, commitsCount }) {
  if (connected) {
    return (
      <motion.div variants={fade} className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          {repoInfo?.full_name}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400"></span>{repoInfo?.language || 'Unknown'}</span>
          <span className="flex items-center gap-1">★ {repoInfo?.stars?.toLocaleString()}</span>
          <span className="flex items-center gap-1">📄 {filesCount} files</span>
          <span className="flex items-center gap-1">🔄 {commitsCount} commits</span>
        </div>
      </motion.div>
    )
  }
  return (
    <motion.div variants={fade} className="w-full bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 flex flex-col gap-2">
      <div className="text-rose-400 font-semibold text-sm">Offline Analysis Mode</div>
      <div className="text-zinc-400 text-xs">{error || 'Could not fetch repository data. Falling back to NLP analysis.'}</div>
    </motion.div>
  )
}

function RecommendationCard({ rec, index }) {
  const [open, setOpen] = useState(false)
  
  let pColor = 'text-emerald-400'; let pBg = 'bg-emerald-500/10'; let pBorder = 'border-emerald-500/20'
  if (rec.priority === 'MEDIUM') { pColor = 'text-amber-400'; pBg = 'bg-amber-500/10'; pBorder = 'border-amber-500/20' }
  if (rec.priority === 'HIGH') { pColor = 'text-rose-400'; pBg = 'bg-rose-500/10'; pBorder = 'border-rose-500/20' }

  return (
    <motion.div variants={fade} className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full p-4 flex justify-between items-center focus:outline-none">
        <div className="flex items-center gap-3">
          <span className={`font-bold ${pColor}`}>0{index + 1}</span>
          <span className="text-zinc-200 font-semibold text-sm">{rec.type}</span>
          <Tag label={rec.priority} colorClass={pColor} bgClass={pBg} borderClass={pBorder} />
        </div>
        <svg className={`w-4 h-4 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-4 pt-0 border-t border-zinc-800/50 mt-2 bg-zinc-900/20">
              <p className="text-xs text-zinc-400 italic mb-4 leading-relaxed mt-4">{rec.reason}</p>
              <div className="space-y-2">
                {rec.tests.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className={pColor}>▹</span> 
                    <span className="leading-snug">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ResultsPanel({ result, onReset }) {
  let rColor = 'text-emerald-400'; let rBg = 'bg-emerald-500/10'; let rBorder = 'border-emerald-500/20'; let rGlow = 'shadow-[0_0_30px_rgba(16,185,129,0.15)]'
  if (result.risk_level === 'Medium') { rColor = 'text-amber-400'; rBg = 'bg-amber-500/10'; rBorder = 'border-amber-500/20'; rGlow = 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' }
  if (result.risk_level === 'High') { rColor = 'text-rose-400'; rBg = 'bg-rose-500/10'; rBorder = 'border-rose-500/20'; rGlow = 'shadow-[0_0_30px_rgba(225,29,72,0.15)]' }

  let dColor = 'text-emerald-400'; let dBg = 'bg-emerald-500/5'; let dBorder = 'border-emerald-500/30'
  if (result.deployment_decision === 'REVIEW') { dColor = 'text-amber-400'; dBg = 'bg-amber-500/5'; dBorder = 'border-amber-500/30' }
  if (result.deployment_decision === 'BLOCK') { dColor = 'text-rose-400'; dBg = 'bg-rose-500/5'; dBorder = 'border-rose-500/30' }

  return (
    <motion.div variants={fade} initial="hidden" animate="show" className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Analysis Report</h2>
        <p className="text-xs text-zinc-500 font-mono">{new Date().toISOString()}</p>
      </div>

      <GithubBanner connected={result.github_connected} error={result.github_error} repoInfo={result.repo_info} filesCount={result.files_count} commitsCount={result.commits_analyzed?.length} />

      <motion.div variants={fade} className={`p-6 rounded-2xl ${rBg} border ${rBorder} ${rGlow} backdrop-blur-sm flex flex-col gap-4`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Confidence Score</div>
            <div className="text-2xl font-black text-white">{Math.round(result.confidence * 100)}%</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Computed Risk</div>
            <div className={`text-2xl font-black uppercase tracking-wider ${rColor}`}>{result.risk_level}</div>
          </div>
        </div>
        <RiskBar score={result.risk_score} level={result.risk_level} />
      </motion.div>

      {result.triggered_keywords?.length > 0 && (
        <motion.div variants={fade} className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Detected Anomalies</h3>
          <div className="flex flex-wrap gap-2">
            {result.triggered_keywords.map(kw => <Tag key={kw} label={kw} colorClass={rColor} bgClass={rBg} borderClass={rBorder} />)}
          </div>
        </motion.div>
      )}

      {result.recommendations?.length > 0 && (
        <motion.div variants={fade} className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Required Test Suites</h3>
          <div className="flex flex-col gap-2">
            {result.recommendations.map((rec, i) => <RecommendationCard key={i} rec={rec} index={i} />)}
          </div>
        </motion.div>
      )}

      <motion.div variants={fade} className={`mt-4 p-8 rounded-2xl ${dBg} border-2 ${dBorder} flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden`}>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Final Decision</div>
        <div className={`text-4xl font-black tracking-widest ${dColor}`}>{result.deployment_decision}</div>
        <div className="text-sm text-zinc-300 font-medium max-w-sm">{result.decision_message}</div>
        <div className={`text-xs font-bold uppercase tracking-wider mt-2 ${dColor}`}>{result.decision_action}</div>
      </motion.div>

      <motion.button 
        variants={fade} 
        onClick={onReset} 
        className="w-full mt-2 py-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 text-zinc-300 text-sm font-semibold transition-all"
      >
        Run New Analysis
      </motion.button>
    </motion.div>
  )
}

export default function App() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState({ requirement: '', repo_url: '', branch: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const update = key => val => setForm(p => ({ ...p, [key]: val }))

  const canContinue = () => {
    if (step === 0) return form.requirement.trim().length >= 10
    if (step === 1) return form.repo_url.startsWith('http')
    if (step === 2) return form.branch.trim().length > 0
    return false
  }

  const goNext = async () => {
    if (step < 2) { setDir(1); setStep(s => s + 1) }
    else await submit()
  }

  const submit = async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Analysis failed')
      setResult(await res.json())
      setDir(1); setStep(3)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setDir(-1); setStep(0)
    setForm({ requirement: '', repo_url: '', branch: '' })
    setResult(null); setError(null)
  }

  const steps = [
    <StepRequirement key="req" value={form.requirement} onChange={update('requirement')} />,
    <StepRepo key="repo" value={form.repo_url} onChange={update('repo_url')} />,
    <StepBranch key="branch" value={form.branch} onChange={update('branch')} />,
    result ? <ResultsPanel key="result" result={result} onReset={reset} /> : null,
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center gap-2 mb-10 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 tracking-tight">Nexus CI</h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 font-medium tracking-wide">INTELLIGENT PIPELINE GATEWAY</p>
      </motion.div>

      <motion.div 
        className={`w-full ${step === 3 ? 'max-w-7xl' : 'max-w-4xl'} bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 sm:p-14 shadow-2xl relative z-10 transition-all duration-500 ease-in-out`}
      >
        {step < 3 && <ProgressDots step={step} />}

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 3 && (
          <div className="flex gap-3 mt-10">
            {step > 0 && (
              <button onClick={() => { setDir(-1); setStep(s => s - 1) }} className="px-6 py-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-300 font-semibold transition-all">
                Back
              </button>
            )}
            <button 
              onClick={goNext} 
              disabled={!canContinue() || loading} 
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all duration-300 ${
                canContinue() && !loading 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                  : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Processing...
                </>
              ) : step === 2 ? 'Initialize Analysis' : 'Continue'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
