"use client";

import { useMemo } from "react";

import type { Contact } from "@/types/contact";

type Node = {
  id: string;
  name: string;
  x: number;
  y: number;
  strength: number;
};

type Link = {
  source: string;
  target: string;
};

type NetworkGraphProps = {
  contacts: Contact[];
};

const WIDTH = 900;
const HEIGHT = 420;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const RADIUS = 150;

function getStrength(contact: Contact): number {
  if (!contact.aiAnalysis) {
    return 40;
  }
  const manualPain = contact.painPoints?.length ?? 0;
  const insights = contact.aiAnalysis.painPoints.length + contact.aiAnalysis.motivation.length;
  return Math.min(95, 35 + manualPain * 6 + insights * 5);
}

export function NetworkGraph({ contacts }: NetworkGraphProps): React.JSX.Element {
  const { nodes, links } = useMemo(() => {
    const normalized = contacts.slice(0, 30);
    const builtNodes: Node[] = normalized.map((contact, index) => {
      const angle = (index / Math.max(normalized.length, 1)) * Math.PI * 2;
      return {
        id: contact.id,
        name: contact.name,
        strength: getStrength(contact),
        x: CENTER_X + Math.cos(angle) * RADIUS + (index % 2 === 0 ? 20 : -20),
        y: CENTER_Y + Math.sin(angle) * RADIUS + (index % 3 === 0 ? 12 : -12),
      };
    });
    const builtLinks: Link[] = [];
    for (let i = 1; i < builtNodes.length; i += 1) {
      builtLinks.push({ source: builtNodes[0].id, target: builtNodes[i].id });
      if (i > 2 && i % 2 === 0) {
        builtLinks.push({ source: builtNodes[i - 1].id, target: builtNodes[i].id });
      }
    }
    return { nodes: builtNodes, links: builtLinks };
  }, [contacts]);

  if (nodes.length === 0) {
    return <p className="text-sm text-zinc-400">Добавьте контакты, чтобы увидеть карту сети.</p>;
  }

  const byId = new Map(nodes.map((n) => [n.id, n]));
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
      <svg width={WIDTH} height={HEIGHT} role="img" aria-label="Карта связей контактов">
        {links.map((link, index) => {
          const source = byId.get(link.source);
          const target = byId.get(link.target);
          if (!source || !target) return null;
          return <line key={`${link.source}-${link.target}-${index}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#334155" strokeWidth={1.5} />;
        })}
        {nodes.map((node) => {
          const color = node.strength >= 80 ? "#10b981" : node.strength >= 60 ? "#3b82f6" : node.strength >= 45 ? "#f59e0b" : "#ef4444";
          return (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r={Math.max(7, Math.round(node.strength / 10))} fill={color} />
              <text x={node.x + 10} y={node.y - 10} fill="#cbd5e1" fontSize={11}>
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
