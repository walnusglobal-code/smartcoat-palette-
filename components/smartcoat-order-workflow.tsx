'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Minus, Plus, Search, Truck, Warehouse } from 'lucide-react'
import { paintColours, type PaintColour } from '@/lib/paint-colours'

type PaintType = { id: string; name: string; category: string; surfaces: string[]; containerSizes: number[] }

const paintTypes: PaintType[] = [
  { id: 'pure-acrylic', name: 'Pure Acrylic Paint', category: 'Interior & Exterior', surfaces: ['Walls', 'Ceilings', 'Plaster'], containerSizes: [1, 4, 10, 20] },
  { id: 'styrene-acrylic', name: 'Styrene-Acrylic Paint', category: 'Interior & Exterior', surfaces: ['Walls', 'Concrete', 'Masonry'], containerSizes: [4, 10, 20] },
  { id: 'vinyl', name: 'Vinyl Acrylic Paint', category: 'Interior', surfaces: ['Walls', 'Ceilings'], containerSizes: [1, 4, 10, 20] },
  { id: 'masonry', name: 'Masonry Coating', category: 'Exterior', surfaces: ['Concrete', 'Masonry', 'Roof'], containerSizes: [4, 10, 20, 25] },
  { id: 'metal', name: 'Metal Coating', category: 'Specialty', surfaces: ['Metal'], containerSizes: [1, 4, 20] },
  { id: 'wood', name: 'Wood Coating', category: 'Specialty', surfaces: ['Wood'], containerSizes: [1, 4, 10] },
  { id: 'primer', name: 'Universal Primer', category: 'Primers & Sealers', surfaces: ['Walls', 'Metal', 'Wood', 'Masonry'], containerSizes: [1, 4, 10, 20] },
  { id: 'floor', name: 'Floor Coating', category: 'Industrial', surfaces: ['Floor', 'Concrete'], containerSizes: [4, 10, 20] },
]

const projectTypes = ['House', 'Apartment', 'Office', 'Shop', 'School', 'Hotel', 'Factory', 'Warehouse', 'Commercial Building', 'Other']
const allSurfaces = ['Walls', 'Ceilings', 'Concrete', 'Plaster', 'Metal', 'Wood', 'Masonry', 'Floor', 'Roof']
const stages = ['Colour', 'Paint', 'Project', 'Quantity', 'Details', 'Review']

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="order-field"><span>{label} {required && <em>*</em>}</span>{children}</label>
}

export function SmartCoatOrderWorkflow({ selectedColour, onChangeColour }: { selectedColour: PaintColour; onChangeColour: () => void }) {
  const [stage, setStage] = useState(0)
  const [paintId, setPaintId] = useState('pure-acrylic')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [projectType, setProjectType] = useState('House')
  const [surfaces, setSurfaces] = useState<string[]>(['Walls'])
  const [finish, setFinish] = useState('Exterior')
  const [area, setArea] = useState('')
  const [quantity, setQuantity] = useState(2)
  const [container, setContainer] = useState(20)
  const [delivery, setDelivery] = useState<'delivery' | 'pickup'>('delivery')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [reference] = useState(() => `SC-2026-${Math.floor(100000 + Math.random() * 899999)}`)
  const [details, setDetails] = useState({ name: '', phone: '', email: '', address: '', city: '', state: '', instructions: '' })
  const paint = paintTypes.find((item) => item.id === paintId) ?? paintTypes[0]
  const categories = ['All', ...Array.from(new Set(paintTypes.map((item) => item.category)))]
  const filteredPaints = useMemo(() => paintTypes.filter((item) => (category === 'All' || item.category === category) && item.name.toLowerCase().includes(search.toLowerCase())), [category, search])
  const estimatedCoverage = area ? `${Math.max(1, Math.ceil(Number(area) / 10)) * 10} m²` : 'Add area for an estimate'
  const toggleSurface = (surface: string) => setSurfaces((current) => current.includes(surface) ? current.filter((item) => item !== surface) : [...current, surface])
  const go = (next: number) => setStage(Math.max(0, Math.min(5, next)))
  const updateDetail = (key: keyof typeof details, value: string) => setDetails((current) => ({ ...current, [key]: value }))
  const submit = () => {
    if (!details.name.trim()) return setError('Please enter your full name so we know who to contact.')
    if (!details.phone.trim()) return setError('Please enter your phone number so we can contact you about your order.')
    if (delivery === 'delivery' && (!details.address.trim() || !details.city.trim() || !details.state.trim())) return setError('Please complete your delivery address, city, and state.')
    setError('')
    setSubmitted(true)
  }

  if (submitted) return <section className="order-shell order-confirmation"><div className="confirmation-mark"><Check size={26} /></div><span className="order-eyebrow">ORDER REQUEST RECEIVED</span><h2>Thank you, {details.name || 'there'}.</h2><p>Your SmartCoat paint request has been submitted to Walnus Global Ventures.</p><div className="reference-card"><span>REFERENCE</span><strong>{reference}</strong><small>{selectedColour.name} / {paint.name} / {quantity} × {container} L / {delivery === 'delivery' ? 'Delivery' : 'Pick up'}</small></div><button className="order-primary" type="button" onClick={() => { setSubmitted(false); go(0) }}>START NEW ORDER <ArrowRight size={15} /></button></section>

  return <section className="order-shell" id="order"><div className="order-heading"><div><span className="order-eyebrow">SMARTCOAT™ / PAINT ORDER</span><h2>Make it <em>yours.</em></h2><p>A guided way to configure the right paint for your project.</p></div><div className="order-index">0{stage + 1}<span>/ 06</span></div></div><nav className="order-progress" aria-label="Order progress">{stages.map((item, index) => <button type="button" key={item} className={index === stage ? 'current' : index < stage ? 'complete' : ''} onClick={() => index <= stage && go(index)}><span>0{index + 1}</span>{item}</button>)}</nav><div className="order-layout"><div className="order-step">
    {stage === 0 && <div className="order-step-content"><div className="step-title"><span>01</span><h3>Choose your colour</h3></div><div className="chosen-colour"><span className="chosen-swatch" style={{ backgroundColor: selectedColour.hex }} /><div><strong>{selectedColour.name}</strong><small>{selectedColour.hex} · {selectedColour.category}</small></div><button type="button" onClick={onChangeColour}>Change colour</button></div><button className="order-primary" type="button" onClick={() => go(1)}>CONTINUE WITH THIS COLOUR <ArrowRight size={15} /></button></div>}
    {stage === 1 && <div className="order-step-content"><div className="step-title"><span>02</span><h3>Choose your paint</h3></div><div className="category-chips">{categories.map((item) => <button type="button" key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="paint-search"><Search size={15} /><input aria-label="Search paint types" placeholder="Search paint types..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><div className="paint-options">{filteredPaints.map((item) => <button type="button" key={item.id} className={paintId === item.id ? 'selected' : ''} onClick={() => { setPaintId(item.id); setContainer(item.containerSizes[0]) }}><span>{item.name}</span><small>{item.category}</small>{paintId === item.id && <Check size={15} />}</button>)}</div><button className="order-primary" type="button" onClick={() => go(2)}>CONTINUE <ArrowRight size={15} /></button></div>}
    {stage === 2 && <div className="order-step-content"><div className="step-title"><span>03</span><h3>Tell us about your project</h3></div><p className="step-help">What are you painting?</p><div className="project-grid">{projectTypes.map((item) => <button type="button" key={item} className={projectType === item ? 'selected' : ''} onClick={() => setProjectType(item)}>{item}</button>)}</div><p className="step-help">Where will it be applied?</p><div className="segmented">{['Interior', 'Exterior', 'Both'].map((item) => <button type="button" key={item} className={finish === item ? 'selected' : ''} onClick={() => setFinish(item)}>{item}</button>)}</div><p className="step-help">Select one or more surfaces.</p><div className="surface-grid">{allSurfaces.filter((surface) => paint.surfaces.includes(surface) || paint.surfaces.length > 3).map((item) => <button type="button" key={item} className={surfaces.includes(item) ? 'selected' : ''} onClick={() => toggleSurface(item)}>{item}</button>)}</div><button className="order-primary" type="button" onClick={() => go(3)}>CONTINUE <ArrowRight size={15} /></button></div>}
    {stage === 3 && <div className="order-step-content"><div className="step-title"><span>04</span><h3>How much paint do you need?</h3></div><Field label="Approximate area"><div className="input-with-unit"><input type="number" min="0" placeholder="e.g. 120" value={area} onChange={(event) => setArea(event.target.value)} /><span>m²</span></div></Field><button className="text-button" type="button" onClick={() => setArea('')}>I DON&apos;T KNOW THE AREA</button><div className="quantity-row"><div><span className="step-help">Quantity</span><strong>{quantity} <small>drums</small></strong></div><div className="stepper"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button></div></div><div className="container-options"><span className="step-help">Container size</span><div>{paint.containerSizes.map((size) => <button type="button" key={size} className={container === size ? 'selected' : ''} onClick={() => setContainer(size)}>{size} L</button>)}</div></div><div className="estimate-card"><span>ESTIMATED COVERAGE</span><strong>{estimatedCoverage}</strong><small>Estimates are based on typical coverage and should be confirmed for your surface.</small></div><button className="order-primary" type="button" onClick={() => go(4)}>CONTINUE <ArrowRight size={15} /></button></div>}
    {stage === 4 && <div className="order-step-content"><div className="step-title"><span>05</span><h3>How would you like to receive it?</h3></div><div className="delivery-options"><button type="button" className={delivery === 'delivery' ? 'selected' : ''} onClick={() => setDelivery('delivery')}><Truck size={20} /><strong>Delivery</strong><small>Bring it to your project</small></button><button type="button" className={delivery === 'pickup' ? 'selected' : ''} onClick={() => setDelivery('pickup')}><Warehouse size={20} /><strong>Pick up</strong><small>Collect from Walnus Global</small></button></div>{delivery === 'delivery' ? <div className="detail-grid"><Field label="Delivery address" required><input value={details.address} onChange={(event) => updateDetail('address', event.target.value)} placeholder="Street and number" /></Field><Field label="City" required><input value={details.city} onChange={(event) => updateDetail('city', event.target.value)} /></Field><Field label="State" required><input value={details.state} onChange={(event) => updateDetail('state', event.target.value)} /></Field><Field label="Delivery instructions"><input value={details.instructions} onChange={(event) => updateDetail('instructions', event.target.value)} placeholder="Optional" /></Field></div> : <div className="pickup-note"><Warehouse size={18} /><span>Collection location<br /><strong>Walnus Global Ventures · Ado-Ekiti</strong></span></div>}<button className="order-primary" type="button" onClick={() => go(5)}>CONTINUE <ArrowRight size={15} /></button></div>}
    {stage === 5 && <div className="order-step-content"><div className="step-title"><span>06</span><h3>Your details</h3></div><div className="detail-grid"><Field label="Full name" required><input value={details.name} onChange={(event) => updateDetail('name', event.target.value)} placeholder="Your name" /></Field><Field label="Phone number" required><input type="tel" value={details.phone} onChange={(event) => updateDetail('phone', event.target.value)} placeholder="080..." /></Field><Field label="Email"><input type="email" value={details.email} onChange={(event) => updateDetail('email', event.target.value)} placeholder="Optional" /></Field><Field label="Additional instructions"><textarea value={details.instructions} onChange={(event) => updateDetail('instructions', event.target.value)} placeholder="Tell us anything else about your order..." /></Field></div>{error && <p className="order-error" role="alert">{error}</p>}<button className="order-primary" type="button" onClick={submit}>SUBMIT PAINT ORDER <ArrowRight size={15} /></button></div>}
  </div><aside className="order-summary"><span className="order-eyebrow">YOUR ORDER</span><div className="summary-colour"><span style={{ backgroundColor: selectedColour.hex }} /><div><strong>{selectedColour.name}</strong><small>{selectedColour.hex}</small></div></div><dl><div><dt>Paint</dt><dd>{paint.name}</dd></div><div><dt>Application</dt><dd>{finish} / {surfaces.join(', ')}</dd></div><div><dt>Project</dt><dd>{projectType}</dd></div><div><dt>Quantity</dt><dd>{quantity} × {container} L</dd></div><div><dt>Receive</dt><dd>{delivery === 'delivery' ? details.city || 'Delivery' : 'Pick up · Ado-Ekiti'}</dd></div></dl><div className="summary-footer"><span>ESTIMATE</span><strong>{estimatedCoverage}</strong></div></aside></div><div className="order-back"><button type="button" onClick={() => go(stage - 1)} disabled={stage === 0}><ArrowLeft size={14} /> BACK</button><span><ChevronDown size={14} /> All information can be changed before submitting</span></div></section>
}

