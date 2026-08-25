'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [income, setIncome] = useState('')
  const [cost, setCost] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*')
    if (data) setProjects(data)
  }

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault()
    if (!title) return
    const { error } = await supabase.from('projects').insert([
      { title, total_income: Number(income) || 0, total_cost: Number(cost) || 0 }
    ])
    if (!error) {
      setTitle(''); setIncome(''); setCost('')
      fetchProjects()
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#ec4899', fontSize: '1.8rem', margin: 0 }}>💎 SEVENTEEN 代購營收與拆卡管理</h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>即時記錄一補二補收益與 13 位成員小卡庫存</p>
      </header>

      <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>➕ 新增代購專案帳目</h2>
        <form onSubmit={handleAddProject} style={{ display: 'grid', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="團購名稱（例如：12th Mini Album 預購）" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="number" 
              placeholder="預估總收入 TWD" 
              value={income} 
              onChange={e => setIncome(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input 
              type="number" 
              placeholder="進貨與運費成本 TWD" 
              value={cost} 
              onChange={e => setCost(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#ec4899', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            儲存代購帳目
          </button>
        </form>
      </section>

      <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: 0 }}>📊 目前代購利潤統計</h2>
        {projects.length === 0 ? <p style={{ color: '#9ca3af' }}>目前還沒有任何帳目記錄，請在上方新增！</p> : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {projects.map((p) => {
              const profit = p.total_income - p.total_cost
              return (
                <div key={p.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{p.title}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      收入: ${p.total_income} | 成本: ${p.total_cost}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>預估淨利</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: profit >= 0 ? '#10b981' : '#ef4444' }}>
                      ${profit}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
