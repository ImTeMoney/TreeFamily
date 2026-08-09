import { useMemo, useRef, useState } from 'react';
import { Minus, Move, Plus, RotateCcw } from 'lucide-react';
import type { Family, Person } from '../types';
import { dataset } from '../data/repository';
import { useAppState } from '../hooks/useAppState';
import { roleEmoji } from '../utils/labels';
import { cn } from '../utils/cn';

const NODE_W = 128;
const NODE_H = 56;
const GAP_X = 24;
const GAP_Y = 78;

interface TreeNode {
  person: Person;
  x: number;
  y: number;
  children: TreeNode[];
}

/** בונה את עץ המשפחה מתוך קשרי האב/האם של הדמויות באשכול */
function buildTree(family: Family): TreeNode[] {
  const members = family.personIds
    .map((id) => dataset.peopleById.get(id))
    .filter((p): p is Person => Boolean(p));
  const memberIds = new Set(members.map((m) => m.id));

  const childrenOf = new Map<string, string[]>();
  const hasParent = new Set<string>();

  for (const person of members) {
    for (const relation of person.relations) {
      if (!memberIds.has(relation.personId)) continue;
      if (relation.kind === 'son' || relation.kind === 'daughter') {
        childrenOf.set(person.id, [...(childrenOf.get(person.id) ?? []), relation.personId]);
        hasParent.add(relation.personId);
      }
      if (relation.kind === 'father' || relation.kind === 'mother') {
        childrenOf.set(relation.personId, [...(childrenOf.get(relation.personId) ?? []), person.id]);
        hasParent.add(person.id);
      }
    }
  }

  for (const [key, value] of childrenOf) childrenOf.set(key, Array.from(new Set(value)));

  const roots = members.filter((m) => !hasParent.has(m.id));
  const placed = new Set<string>();
  let cursor = 0;

  function layout(person: Person, depth: number): TreeNode | null {
    if (placed.has(person.id)) return null;
    placed.add(person.id);

    const childNodes = (childrenOf.get(person.id) ?? [])
      .map((id) => dataset.peopleById.get(id))
      .filter((p): p is Person => Boolean(p))
      .map((child) => layout(child, depth + 1))
      .filter((n): n is TreeNode => Boolean(n));

    let x: number;
    if (childNodes.length > 0) {
      x = (childNodes[0].x + childNodes[childNodes.length - 1].x) / 2;
    } else {
      x = cursor;
      cursor += NODE_W + GAP_X;
    }

    return { person, x, y: depth * GAP_Y, children: childNodes };
  }

  const trees = (roots.length > 0 ? roots : members.slice(0, 1))
    .map((root) => layout(root, 0))
    .filter((n): n is TreeNode => Boolean(n));

  // דמויות שאינן מחוברות בקשר הורה־ילד מוצגות בשורה נפרדת בתחתית
  const orphans = members.filter((m) => !placed.has(m.id));
  for (const orphan of orphans) {
    trees.push({ person: orphan, x: cursor, y: 0, children: [] });
    cursor += NODE_W + GAP_X;
  }

  return trees;
}

function flatten(nodes: TreeNode[]): TreeNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children)]);
}

interface Props {
  family: Family;
  focusPersonId?: string | null;
  className?: string;
}

export function FamilyTree({ family, focusPersonId, className }: Props) {
  const { openPerson } = useAppState();
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const trees = useMemo(() => buildTree(family), [family]);
  const nodes = useMemo(() => flatten(trees), [trees]);

  const width = Math.max(...nodes.map((n) => n.x), 0) + NODE_W + 40;
  const height = Math.max(...nodes.map((n) => n.y), 0) + NODE_H + 40;

  const edges = nodes.flatMap((node) =>
    node.children.map((child) => ({
      key: `${node.person.id}-${child.person.id}`,
      x1: node.x + NODE_W / 2,
      y1: node.y + NODE_H,
      x2: child.x + NODE_W / 2,
      y2: child.y,
    })),
  );

  return (
    <div className={cn('card relative overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-parchment-200 bg-white/70 px-4 py-2">
        <p className="flex items-center gap-1.5 text-xs text-ink-400">
          <Move className="h-3.5 w-3.5" aria-hidden />
          גררו להזזה, והשתמשו בכפתורים לשינוי הזום
        </p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setScale((s) => Math.max(0.4, +(s - 0.15).toFixed(2)))} className="btn-ghost px-2 py-1" aria-label="הרחקה">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-11 text-center text-xs tabular-nums text-ink-400">{Math.round(scale * 100)}%</span>
          <button type="button" onClick={() => setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)))} className="btn-ghost px-2 py-1" aria-label="הגדלה">
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setScale(1);
              setOffset({ x: 0, y: 0 });
            }}
            className="btn-ghost px-2 py-1"
            aria-label="איפוס"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className={cn('relative h-[34rem] overflow-hidden bg-parchment-50/60', dragging ? 'cursor-grabbing' : 'cursor-grab')}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button[data-node]')) return;
          drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
          setDragging(true);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setOffset({
            x: drag.current.ox + (e.clientX - drag.current.x),
            y: drag.current.oy + (e.clientY - drag.current.y),
          });
        }}
        onPointerUp={() => {
          drag.current = null;
          setDragging(false);
        }}
        onPointerLeave={() => {
          drag.current = null;
          setDragging(false);
        }}
      >
        <div
          className="absolute right-4 top-4 origin-top-right transition-transform duration-100"
          style={{ transform: `translate(${-offset.x}px, ${offset.y}px) scale(${scale})`, width, height }}
        >
          <svg width={width} height={height} className="absolute inset-0 overflow-visible" aria-hidden>
            {edges.map((edge) => (
              <path
                key={edge.key}
                d={`M ${width - edge.x1} ${edge.y1} V ${(edge.y1 + edge.y2) / 2} H ${width - edge.x2} V ${edge.y2}`}
                fill="none"
                stroke="#cfb98f"
                strokeWidth={1.5}
              />
            ))}
          </svg>

          {nodes.map((node) => (
            <button
              key={node.person.id}
              data-node
              type="button"
              onClick={() => openPerson(node.person.id)}
              style={{ right: node.x, top: node.y, width: NODE_W, height: NODE_H }}
              className={cn(
                'absolute flex flex-col items-center justify-center rounded-xl border bg-white px-2 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-pop',
                node.person.id === focusPersonId ? 'border-gold-500 ring-2 ring-gold-500/40' : 'border-parchment-200',
              )}
            >
              <span className="text-sm" aria-hidden>
                {roleEmoji[node.person.roles[0] ?? 'other']}
              </span>
              <span className="truncate text-xs font-bold text-ink-900">{node.person.name}</span>
              {node.person.disambiguation && (
                <span className="line-clamp-1 text-[10px] text-ink-400">{node.person.disambiguation}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
