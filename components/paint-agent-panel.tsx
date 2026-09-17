'use client'

import { useState } from 'react'
import { ArrowUpRight, Beaker, Loader2, ShieldCheck } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

const starterPrompts = ['Design a low-VOC exterior acrylic', 'Why is my paint sagging?', 'Explain PVC and CPVC']

export function PaintAgentPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function ask(question = input) {
    const content = question.trim()
    if (!content || loading) return
    const next = [...messages, { role: 'user' as const, content }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const response = await fetch('/api/paint-agent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) })
      const data = await response.json() as { text?: string; error?: string }
      setMessages([...next, { role: 'assistant', content: data.text ?? data.error ?? 'No response returned.' }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'The agent could not connect. Please try again.' }])
    } finally { setLoading(false) }
  }

  return <section className="agent-panel" aria-labelledby="agent-heading">
    <div className="agent-heading"><div><span className="section-eyebrow">SMARTCOAT AI / FORMULATION INTELLIGENCE</span><h2 id="agent-heading">Ask the paint expert.</h2><p>Research chemistry, production, quality, suppliers and safe application workflows.</p></div><div className="agent-badge"><Beaker size={16} /> CONTROLLED AGENT</div></div>
    <div className="agent-disclaimer"><ShieldCheck size={15} /> Every formulation is advisory. Verify SDS, local standards and lab performance before production.</div>
    <div className="agent-thread" aria-live="polite">{messages.length === 0 ? <div className="agent-empty"><strong>Where should we start?</strong><div className="starter-prompts">{starterPrompts.map(prompt => <button key={prompt} type="button" onClick={() => ask(prompt)}>{prompt}<ArrowUpRight size={14} /></button>)}</div></div> : messages.map((message, index) => <div className={`agent-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === 'user' ? 'YOU' : 'SMARTCOAT AI'}</span><p>{message.content}</p></div>)}{loading && <div className="agent-message assistant"><span>SMARTCOAT AI</span><p className="agent-loading"><Loader2 size={15} /> Reviewing chemistry and manufacturing context…</p></div>}</div>
    <form className="agent-form" onSubmit={event => { event.preventDefault(); ask() }}><input value={input} onChange={event => setInput(event.target.value)} placeholder="Ask about a paint, formula, process or supplier…" aria-label="Ask the SmartCoat paint agent" /><button type="submit" disabled={loading || !input.trim()}>ASK AGENT <ArrowUpRight size={15} /></button></form>
  </section>
}
