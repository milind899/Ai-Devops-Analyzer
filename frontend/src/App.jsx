import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = 'http://localhost:8000'

/* ─── ANIMATIONS ─── */
const slide = {
  enter: d => ({ x: d > 0 ? 280 : -280, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   d => ({ x: d > 0 ? -280 : 280, opacity: 0 }),
}
const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

/* ─── PALETTES ─── */
const RISK_PALETTE = {
  Low:    { color: '#58CC02', bg: 'rgba(88,204,2,0.1)',   border: 'rgba(88,204,2,0.35)'   },
  Medium: { color: '#FF9600', bg: 'rgba(255,150,0,0.1)',  border: 'rgba(255,150,0,0.35)'  },
  High:   { color: '#FF4B4B', bg: 'rgba(255,75,75,0.1)',  border: 'rgba(255,75,75,0.35)'  },
}
const DECISION_PALETTE = {
  PROCEED: { color: '#58CC02', bg: 'rgba(88,204,2,0.08)',  border: 'rgba(88,204,2,0.3)',  icon: '🚀' },
  REVIEW:  { color: '#FF9600', bg: 'rgba(255,150,0,0.08)', border: 'rgba(255,150,0,0.3)', icon: '🔍' },
  BLOCK:   { color: '#FF4B4B', bg: 'rgba(255,75,75,0.08)', border: 'rgba(255,75,75,0.3)', icon: '🚫' },
}
const PRIORITY_PALETTE = {
  HIGH:   { color: '#FF4B4B', bg: 'rgba(255,75,75,0.12)',   border: 'rgba(255,75,75,0.35)'   },
  MEDIUM: { color: '#FF9600', bg: 'rgba(255,150,0,0.12)',   border: 'rgba(255,150,0,0.35)'   },
  LOW:    { color: '#58CC02', bg: 'rgba(88,204,2,0.12)',    border: 'rgba(88,204,2,0.35)'    },
}

/* ─── SMALL HELPERS ─── */
const S = (style) => style  // passthrough for inline style objects

function Tag({ label, color, bg, border }) {
  return (
    <span style={{ background: bg, border: `1px solid ${border}`, color, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 800 }}>
      {label}
    </span>
  )
}

/* ─── PROGRESS DOTS ─── */
function ProgressDots({ step }) {
  const labels = ['Task', 'Repo', 'Branch']
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
        {labels.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              animate={{ backgroundColor: i <= step ? '#58CC02' : 'rgba(255,255,255,0.15)', scale: i === step ? 1.3 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ width: 12, height: 12, borderRadius: '50%' }}
            />
            {i < labels.length - 1 && (
              <motion.div
                animate={{ backgroundColor: i < step ? '#58CC02' : 'rgba(255,255,255,0.1)' }}
                style={{ width: 36, height: 2, margin: '0 4px', borderRadius: 2 }}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '0 2px', color: 'rgba(255,255,255,0.3)' }}>
        {labels.map((l, i) => (
          <span key={l} style={{ color: i === step ? '#58CC02' : undefined, fontWeight: i === step ? 800 : 400 }}>{l}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── STEP 1: REQUIREMENT ─── */
function StepRequirement({ value, onChange }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>📋</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>What are you deploying?</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>Describe the feature or change in detail</p>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. Add Stripe payment gateway for monthly subscription billing with OAuth2 authentication..."
        rows={5}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.05)', resize: 'none',
          border: `2px solid ${value.length >= 10 ? 'rgba(88,204,2,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 16, padding: '14px 16px', color: '#fff', fontSize: 13,
          lineHeight: 1.7, fontFamily: 'Nunito, sans-serif', transition: 'border-color 0.3s',
        }}
      />
      <div style={{ fontSize: 11, textAlign: 'right', marginTop: 6, color: value.length >= 10 ? '#58CC02' : 'rgba(255,255,255,0.25)' }}>
        {value.length} chars {value.length < 10 && `— need ${10 - value.length} more`}
      </div>
    </div>
  )
}

/* ─── STEP 2: REPO URL ─── */
function StepRepo({ value, onChange }) {
  const examples = ['github.com/myorg/backend', 'github.com/team/auth-service', 'github.com/user/api', 'github.com/team/frontend']
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🔗</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>Repository URL</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>Enter a public GitHub repository link</p>
      </div>
      <input type="url" value={value} onChange={e => onChange(e.target.value)}
        placeholder="https://github.com/username/repository"
        style={{
          width: '100%', background: 'rgba(255,255,255,0.05)',
          border: `2px solid ${value.startsWith('http') ? 'rgba(88,204,2,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 16, padding: '14px 16px', color: '#fff', fontSize: 13,
          fontFamily: 'Nunito, sans-serif', transition: 'border-color 0.3s',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        {examples.map(ex => (
          <button key={ex} onClick={() => onChange(`https://${ex}`)}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '8px 12px', color: 'rgba(255,255,255,0.45)',
              fontSize: 11, textAlign: 'left', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
            }}
            onMouseEnter={e => { e.target.style.color = '#58CC02'; e.target.style.background = 'rgba(88,204,2,0.08)' }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.45)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
          >💡 {ex}</button>
        ))}
      </div>
    </div>
  )
}

/* ─── STEP 3: BRANCH ─── */
function StepBranch({ value, onChange }) {
  const branches = ['main', 'master', 'develop', 'feature/new-ui', 'hotfix/critical-bug', 'release/v2.0']
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🌿</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>Branch / Commit</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>Which branch are you deploying?</p>
      </div>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder="e.g. main, develop, feature/payment-v2"
        style={{
          width: '100%', background: 'rgba(255,255,255,0.05)',
          border: `2px solid ${value.trim().length > 0 ? 'rgba(88,204,2,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 16, padding: '14px 16px', color: '#fff', fontSize: 13,
          fontFamily: 'Nunito, sans-serif', transition: 'border-color 0.3s',
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {branches.map(b => (
          <button key={b} onClick={() => onChange(b)}
            style={{
              background: value === b ? 'rgba(88,204,2,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${value === b ? 'rgba(88,204,2,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: value === b ? '#58CC02' : 'rgba(255,255,255,0.45)',
              borderRadius: 20, padding: '6px 14px', fontSize: 12,
              cursor: 'pointer', fontFamily: 'Nunito, sans-serif', transition: 'all 0.2s',
            }}
          >{b}</button>
        ))}
      </div>
    </div>
  )
}

/* ─── RISK BAR ─── */
function RiskBar({ score, level }) {
  const p = RISK_PALETTE[level] || RISK_PALETTE.Low
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
        <span style={{ color: 'rgba(255,255,255,0.45)' }}>Risk Score</span>
        <span style={{ color: p.color, fontWeight: 800 }}>{Math.round(score * 100)}% — {level}</span>
      </div>
      <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${score * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: p.color, borderRadius: 8 }} />
      </div>
    </div>
  )
}

/* ─── GITHUB STATUS BANNER ─── */
function GithubBanner({ connected, error, repoInfo, filesCount, commitsCount }) {
  if (connected) {
    return (
      <motion.div variants={fade} style={{
        background: 'rgba(88,204,2,0.06)', border: '1px solid rgba(88,204,2,0.2)',
        borderRadius: 14, padding: '12px 16px', marginBottom: 16, fontSize: 12,
      }}>
        <div style={{ color: '#58CC02', fontWeight: 800, marginBottom: 6 }}>✅ GitHub Connected — {repoInfo?.full_name}</div>
        <div style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span>🌐 {repoInfo?.language || 'Unknown'}</span>
          <span>⭐ {repoInfo?.stars?.toLocaleString()}</span>
          <span>📂 {filesCount} file(s) analyzed</span>
          <span>📝 {commitsCount} commit(s) checked</span>
        </div>
        {repoInfo?.description && (
          <div style={{ color: 'rgba(255,255,255,0.3)', marginTop: 6, fontStyle: 'italic' }}>{repoInfo.description}</div>
        )}
      </motion.div>
    )
  }
  return (
    <motion.div variants={fade} style={{
      background: 'rgba(255,150,0,0.06)', border: '1px solid rgba(255,150,0,0.2)',
      borderRadius: 14, padding: '12px 16px', marginBottom: 16, fontSize: 12,
    }}>
      <div style={{ color: '#FF9600', fontWeight: 800, marginBottom: 4 }}>⚠️ GitHub Not Connected — Text Analysis Only</div>
      <div style={{ color: 'rgba(255,255,255,0.4)' }}>{error || 'Could not fetch repository data.'}</div>
    </motion.div>
  )
}

/* ─── FILES LIST ─── */
function FilesList({ files, risky_files }) {
  if (!files?.length) return null
  return (
    <motion.div variants={fade} style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        Files Changed ({files.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 140, overflowY: 'auto' }}>
        {files.map(f => {
          const isRisky = risky_files?.includes(f.filename)
          return (
            <div key={f.filename} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: isRisky ? 'rgba(255,75,75,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isRisky ? 'rgba(255,75,75,0.2)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 10, padding: '6px 10px', fontSize: 11,
            }}>
              <span style={{ color: isRisky ? '#FF4B4B' : 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                {isRisky ? '⚠️ ' : ''}{f.filename}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                +{f.additions} −{f.deletions}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ─── RECOMMENDATION CARD ─── */
function RecommendationCard({ rec, index }) {
  const [open, setOpen] = useState(false)
  const pp = PRIORITY_PALETTE[rec.priority] || PRIORITY_PALETTE.LOW
  return (
    <motion.div variants={fade} style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, overflow: 'hidden', marginBottom: 8,
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '12px 14px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
          <span style={{ color: pp.color, fontWeight: 900, fontSize: 13 }}>{index + 1}.</span>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{rec.type}</span>
          <Tag label={rec.priority} color={pp.color} bg={pp.bg} border={pp.border} />
        </div>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>{open ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 14px 14px' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, fontStyle: 'italic' }}>
                📌 {rec.reason}
              </div>
              {rec.tests.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: pp.color }}>→</span> {t}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── COMMITS LIST ─── */
function CommitsList({ commits }) {
  if (!commits?.length) return null
  return (
    <motion.div variants={fade} style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        Recent Commits Analyzed
      </div>
      {commits.map(c => (
        <div key={c.sha} style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10, padding: '8px 12px', marginBottom: 6, fontSize: 11,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ color: '#7C85FF', fontFamily: 'monospace', fontWeight: 700 }}>{c.sha}</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>{c.date}</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)' }}>{c.message}</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>by {c.author}</div>
        </div>
      ))}
    </motion.div>
  )
}

/* ─── RESULTS PANEL ─── */
function ResultsPanel({ result, onReset }) {
  const rp = RISK_PALETTE[result.risk_level] || RISK_PALETTE.Low
  const dp = DECISION_PALETTE[result.deployment_decision] || DECISION_PALETTE.BLOCK

  return (
    <motion.div variants={fade} initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }}>
      {/* Header */}
      <motion.div variants={fade} style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{dp.icon}</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>Analysis Complete</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 4 }}>
          {new Date().toLocaleTimeString()} · {result.github_used ? 'GitHub + Text Analysis' : 'Text Analysis Only'}
        </p>
      </motion.div>

      {/* GitHub Banner */}
      <GithubBanner
        connected={result.github_connected}
        error={result.github_error}
        repoInfo={result.repo_info}
        filesCount={result.files_count}
        commitsCount={result.commits_analyzed?.length}
      />

      {/* Risk Bar */}
      <motion.div variants={fade}><RiskBar score={result.risk_score} level={result.risk_level} /></motion.div>

      {/* Risk + Confidence Row */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: rp.bg, border: `1px solid ${rp.border}`, borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Risk Level</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: rp.color }}>{result.risk_level}</div>
        </div>
        <div style={{ background: 'rgba(124,133,255,0.08)', border: '1px solid rgba(124,133,255,0.2)', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Confidence</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#7C85FF' }}>{Math.round(result.confidence * 100)}%</div>
        </div>
      </motion.div>

      {/* Keywords */}
      {result.triggered_keywords?.length > 0 && (
        <motion.div variants={fade} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Risk Triggers (from text)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {result.triggered_keywords.map(kw => (
              <Tag key={kw} label={kw} color={rp.color} bg={rp.bg} border={rp.border} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Files Changed */}
      <FilesList files={result.files_analyzed} risky_files={result.risky_files} />

      {/* Commits */}
      <CommitsList commits={result.commits_analyzed} />

      {/* Test Recommendations */}
      {result.recommendations?.length > 0 && (
        <motion.div variants={fade} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Test Recommendations ({result.recommendations.length})
          </div>
          {result.recommendations.map((rec, i) => <RecommendationCard key={i} rec={rec} index={i} />)}
        </motion.div>
      )}

      {/* Decision */}
      <motion.div variants={fade} style={{
        background: dp.bg, border: `2px solid ${dp.border}`,
        borderRadius: 20, padding: '20px 18px', textAlign: 'center', marginBottom: 8,
      }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Deployment Decision</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: dp.color, letterSpacing: 2, marginBottom: 10 }}>
          {dp.icon} {result.deployment_decision}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{result.decision_message}</div>
        <div style={{ fontSize: 12, color: dp.color, fontWeight: 700 }}>{result.decision_action}</div>
      </motion.div>

      <motion.button variants={fade} onClick={onReset} style={{
        width: '100%', padding: '14px', borderRadius: 14, fontSize: 13, fontWeight: 800,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
      }}
        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.09)'}
        onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.04)'}
      >← Analyze Another</motion.button>
    </motion.div>
  )
}

/* ─── HISTORY TABLE ─── */
function HistoryTable({ history }) {
  if (!history.length) return null
  const rCol = { Low: '#58CC02', Medium: '#FF9600', High: '#FF4B4B' }
  const dCol = { PROCEED: '#58CC02', REVIEW: '#FF9600', BLOCK: '#FF4B4B' }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 700, marginTop: 32 }}>
      <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>📊 Analysis History</h3>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Time', 'Risk', 'GitHub', 'Recommendations', 'Decision'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: i < history.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <td style={{ padding: '11px 14px', color: 'rgba(255,255,255,0.35)' }}>{item.timestamp}</td>
                <td style={{ padding: '11px 14px', fontWeight: 800, color: rCol[item.risk_level] }}>{item.risk_level} ({Math.round(item.risk_score * 100)}%)</td>
                <td style={{ padding: '11px 14px', color: item.github_connected ? '#58CC02' : '#FF9600' }}>{item.github_connected ? '✅ Yes' : '⚠️ No'}</td>
                <td style={{ padding: '11px 14px', color: 'rgba(255,255,255,0.5)' }}>{item.recommendations?.length || 0} suites</td>
                <td style={{ padding: '11px 14px', fontWeight: 800, color: dCol[item.deployment_decision] }}>{item.deployment_decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

/* ─── MAIN APP ─── */
export default function App() {
  const [step, setStep]       = useState(0)
  const [dir, setDir]         = useState(1)
  const [form, setForm]       = useState({ requirement: '', repo_url: '', branch: '' })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [history, setHistory] = useState([])

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
  const goBack = () => { setDir(-1); setStep(s => s - 1) }

  const submit = async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Analysis failed')
      }
      const data = await res.json()
      setResult(data)
      setHistory(prev => [{
        ...data,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now(),
      }, ...prev].slice(0, 5))
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
    <StepRequirement key="req"    value={form.requirement} onChange={update('requirement')} />,
    <StepRepo        key="repo"   value={form.repo_url}    onChange={update('repo_url')}    />,
    <StepBranch      key="branch" value={form.branch}      onChange={update('branch')}      />,
    result ? <ResultsPanel key="result" result={result} onReset={reset} /> : null,
  ]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 16px',
      background: 'radial-gradient(ellipse at 50% 0%, #1a0d35 0%, #0a0a18 65%)',
    }}>
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: '#58CC02',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, color: '#fff', boxShadow: '0 0 24px rgba(88,204,2,0.4)',
          }}>AI</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: -0.5, margin: 0 }}>DevOps Risk Analyzer</h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>GitHub-integrated risk scoring · real file analysis · test recommendations</p>
      </motion.div>

      {/* Card */}
      <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        style={{
          width: '100%', maxWidth: step === 3 ? 560 : 480,
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, padding: 32,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(88,204,2,0.04)',
          transition: 'max-width 0.4s ease',
        }}>
        {step < 3 && <ProgressDots step={step} />}

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}>
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.3)', borderRadius: 12, color: '#FF4B4B', fontSize: 13 }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {step < 3 && (
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 0 && (
              <button onClick={goBack} style={{
                flex: 1, padding: '14px', borderRadius: 14, fontSize: 13, fontWeight: 800,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              }}>← Back</button>
            )}
            <button onClick={goNext} disabled={!canContinue() || loading} style={{
              flex: step > 0 ? 2 : 1, padding: '14px', borderRadius: 14, fontSize: 13, fontWeight: 900,
              background: canContinue() && !loading ? '#58CC02' : 'rgba(255,255,255,0.07)',
              color: canContinue() && !loading ? '#fff' : 'rgba(255,255,255,0.25)',
              border: 'none', cursor: canContinue() && !loading ? 'pointer' : 'not-allowed',
              boxShadow: canContinue() && !loading ? '0 4px 20px rgba(88,204,2,0.3)' : 'none',
              transition: 'all 0.25s', fontFamily: 'Nunito, sans-serif',
            }}>
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                      <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing...
                  </span>
                : step === 2 ? '🔍 Analyze Risk' : 'Continue →'}
            </button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {history.length > 0 && <HistoryTable history={history} />}
      </AnimatePresence>

      <div style={{ marginTop: 40, color: 'rgba(255,255,255,0.12)', fontSize: 11 }}>
        AI DevOps Risk Analyzer v2 · GitHub API + Rule-based Analysis
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
