import { sectionById } from '@/data/sections'

export function SectionHead({ id, sub }: { id: string; sub?: string }) {
  const section = sectionById(id)!
  return (
    <>
      <h2 className="sec-h" id={`h-${id}`}>
        {section.label}
        <sup>{section.tag}</sup>
      </h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </>
  )
}
