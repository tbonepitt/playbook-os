'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Lesson, LessonCard } from '@playbook-os/core'

function ConceptCard({ card }: { card: Extract<LessonCard, { type: 'concept' }> }) {
  return (
    <div className="space-y-3">
      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded uppercase tracking-wide">
        {card.label}
      </span>
      <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
      <p className="text-gray-700 leading-relaxed">{card.body}</p>
    </div>
  )
}

function MetaphorCard({ card }: { card: Extract<LessonCard, { type: 'metaphor' }> }) {
  return (
    <div className="space-y-3">
      <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded uppercase tracking-wide">
        {card.label}
      </span>
      <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
      <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
        <div className="text-center px-8">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-sm text-gray-500 italic">{card.imagePrompt}</p>
        </div>
      </div>
    </div>
  )
}

function ExampleCard({ card }: { card: Extract<LessonCard, { type: 'example' | 'mistake' | 'apply' }> }) {
  const styles = {
    example: { bg: 'bg-green-50', text: 'text-green-700', label: card.label },
    mistake: { bg: 'bg-red-50', text: 'text-red-700', label: card.label },
    apply: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: card.label },
  }
  const s = styles[card.type as keyof typeof styles]
  return (
    <div className="space-y-3">
      <span className={`inline-block px-2 py-0.5 ${s.bg} ${s.text} text-xs font-semibold rounded uppercase tracking-wide`}>
        {s.label}
      </span>
      <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
      <p className="text-gray-700 leading-relaxed">{card.body}</p>
    </div>
  )
}

function QuizCard({ card }: { card: Extract<LessonCard, { type: 'quiz' }> }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  return (
    <div className="space-y-4">
      <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-semibold rounded uppercase tracking-wide">
        {card.label}
      </span>
      <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
      <div className="space-y-2">
        {card.options.map((opt) => {
          let style = 'border-gray-200 text-gray-700'
          if (checked) {
            if (opt.key === card.correctKey) style = 'border-green-500 bg-green-50 text-green-800'
            else if (opt.key === selected) style = 'border-red-400 bg-red-50 text-red-700'
          } else if (opt.key === selected) {
            style = 'border-gray-900 bg-gray-50'
          }
          return (
            <button
              key={opt.key}
              disabled={checked}
              onClick={() => setSelected(opt.key)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm ${style}`}
            >
              <span className="font-mono mr-2 text-xs">{opt.key}.</span>
              {opt.text}
            </button>
          )
        })}
      </div>
      {!checked && selected && (
        <button
          onClick={() => setChecked(true)}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
        >
          Check answer
        </button>
      )}
      {checked && (
        <p className={`text-sm font-medium ${selected === card.correctKey ? 'text-green-600' : 'text-red-600'}`}>
          {selected === card.correctKey ? '✓ Correct!' : `✕ The correct answer is ${card.correctKey}.`}
        </p>
      )}
    </div>
  )
}

function SourceCard({ card }: { card: Extract<LessonCard, { type: 'source' }> }) {
  return (
    <div className="space-y-3">
      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase tracking-wide">
        {card.label}
      </span>
      <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
      <p className="text-sm text-gray-500">
        {card.citationIds.length} source{card.citationIds.length !== 1 ? 's' : ''} referenced
      </p>
    </div>
  )
}

function CardRenderer({ card }: { card: LessonCard }) {
  switch (card.type) {
    case 'concept': return <ConceptCard card={card} />
    case 'metaphor': return <MetaphorCard card={card} />
    case 'example':
    case 'mistake':
    case 'apply': return <ExampleCard card={card} />
    case 'quiz': return <QuizCard card={card} />
    case 'source': return <SourceCard card={card} />
  }
}

interface LessonPlayerProps {
  lesson: Lesson
  backHref: string
}

export function LessonPlayer({ lesson, backHref }: LessonPlayerProps) {
  const [index, setIndex] = useState(0)
  const cards = lesson.cards
  const card = cards[index]
  const isFirst = index === 0
  const isLast = index === cards.length - 1

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <Link href={backHref} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← {lesson.title}
        </Link>
        <span className="text-sm text-gray-400">
          {index + 1} / {cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-gray-900 transition-all duration-300"
          style={{ width: `${((index + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-lg">
          {card && <CardRenderer card={card} />}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100">
        <button
          disabled={isFirst}
          onClick={() => setIndex((i) => i - 1)}
          className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {/* Card dots */}
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === index ? 'bg-gray-900' : 'bg-gray-200 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <Link
            href={backHref}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Complete ✓
          </Link>
        ) : (
          <button
            onClick={() => setIndex((i) => i + 1)}
            className="px-4 py-2 text-sm text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
