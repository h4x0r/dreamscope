"use client";

import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DreamSymbol, SymbolConnection } from "@/lib/types";

interface DreamMapProps {
  symbols: DreamSymbol[];
  connections: SymbolConnection[];
}

function buildNodes(symbols: DreamSymbol[]): Node[] {
  const angleStep = (2 * Math.PI) / symbols.length;
  const radius = 200;
  const centerX = 400;
  const centerY = 300;

  return symbols.map((symbol, i) => ({
    id: symbol.id,
    position: {
      x: centerX + radius * Math.cos(angleStep * i - Math.PI / 2),
      y: centerY + radius * Math.sin(angleStep * i - Math.PI / 2),
    },
    data: {
      label: (
        <div className="text-center px-2">
          <div className="font-semibold text-dream-text text-sm">
            {symbol.label}
          </div>
          <div className="text-dream-muted text-xs mt-1 max-w-[180px] leading-snug">
            {symbol.interpretation.split(".")[0]}.
          </div>
        </div>
      ),
    },
    style: {
      background: "#12121f",
      border: "2px solid #8b5cf6",
      borderRadius: "16px",
      padding: "12px",
      width: 220,
    },
  }));
}

function buildEdges(connections: SymbolConnection[]): Edge[] {
  return connections.map((conn, i) => ({
    id: `edge-${i}`,
    source: conn.from,
    target: conn.to,
    label: conn.relationship,
    style: { stroke: "#64748b" },
    labelStyle: {
      fill: "#64748b",
      fontSize: 11,
    },
    labelBgStyle: {
      fill: "#0a0a12",
    },
    type: "default",
  }));
}

export default function DreamMap({ symbols, connections }: DreamMapProps) {
  const nodes = buildNodes(symbols);
  const edges = buildEdges(connections);

  return (
    <div className="w-full h-[500px] rounded-xl border border-dream-muted/20 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e1e2f" gap={20} />
        <Controls
          style={{
            background: "#12121f",
            borderColor: "#64748b33",
          }}
        />
      </ReactFlow>
    </div>
  );
}
