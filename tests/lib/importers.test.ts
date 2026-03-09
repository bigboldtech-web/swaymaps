import { describe, it, expect } from 'vitest';
import { detectFormat } from '../../lib/importers';
import { parseLucidchartCsv } from '../../lib/importers/lucidchart';
import { parseDrawioXml } from '../../lib/importers/drawio';
import { parseMiroJson } from '../../lib/importers/miro';

describe('detectFormat', () => {
  it('detects CSV files as lucidchart', () => {
    expect(detectFormat('diagram.csv', 'Id,Name')).toBe('lucidchart');
  });

  it('detects .xml files as drawio', () => {
    expect(detectFormat('diagram.xml', '<something>')).toBe('drawio');
  });

  it('detects mxfile content as drawio regardless of extension', () => {
    expect(detectFormat('test.drawio', '<mxfile>')).toBe('drawio');
  });

  it('detects mxGraphModel content as drawio', () => {
    expect(detectFormat('test.txt', '<mxGraphModel>')).toBe('drawio');
  });

  it('detects Miro JSON (type=board)', () => {
    const content = JSON.stringify({ type: 'board', widgets: [] });
    expect(detectFormat('board.json', content)).toBe('miro');
  });

  it('detects Miro JSON (widgets key)', () => {
    const content = JSON.stringify({ widgets: [{ id: '1' }] });
    expect(detectFormat('export.json', content)).toBe('miro');
  });

  it('detects generic JSON with nodes', () => {
    expect(detectFormat('data.json', '{"nodes":[]}')).toBe('json');
  });

  it('returns null for unknown formats', () => {
    expect(detectFormat('file.txt', 'hello world')).toBe(null);
  });

  it('returns null for invalid JSON in .json file', () => {
    expect(detectFormat('bad.json', 'not json {')).toBe(null);
  });
});

describe('parseLucidchartCsv', () => {
  it('parses nodes and edges from CSV', () => {
    const csv = `Id,Name,Shape Library,Line Source,Line Destination
1,Web Server,Process,,
2,Database,Database,,
3,Connection,,1,2`;
    const result = parseLucidchartCsv(csv);
    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
    expect(result.nodes[0].title).toBe('Web Server');
    expect(result.nodes[0].kind).toBe('process');
    expect(result.nodes[1].title).toBe('Database');
    expect(result.nodes[1].kind).toBe('database');
    expect(result.edges[0].sourceId).toBe('1');
    expect(result.edges[0].targetId).toBe('2');
  });

  it('returns warning for empty CSV', () => {
    const result = parseLucidchartCsv('');
    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('empty');
  });

  it('returns warning for header-only CSV', () => {
    const result = parseLucidchartCsv('Id,Name');
    expect(result.nodes).toHaveLength(0);
    expect(result.warnings).toContain('CSV appears empty');
  });

  it('handles quoted fields with commas', () => {
    const csv = `Id,Name,Shape Library,Line Source,Line Destination
1,"Web, Server",Process,,`;
    const result = parseLucidchartCsv(csv);
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].title).toBe('Web, Server');
  });

  it('warns about edges referencing unknown nodes', () => {
    const csv = `Id,Name,Shape Library,Line Source,Line Destination
1,Server,Process,,
2,Link,,1,99`;
    const result = parseLucidchartCsv(csv);
    expect(result.edges).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('assigns position based on index when no coordinates', () => {
    const csv = `Id,Name,Shape Library,Line Source,Line Destination
1,Node A,Process,,
2,Node B,Process,,`;
    const result = parseLucidchartCsv(csv);
    expect(result.nodes[0].posX).toBeDefined();
    expect(result.nodes[0].posY).toBeDefined();
  });

  it('guesses kind from shape names', () => {
    const csv = `Id,Name,Shape Library,Line Source,Line Destination
1,Person Node,Person,,
2,Cloud Node,Cloud,,
3,Decision Node,Decision,,`;
    const result = parseLucidchartCsv(csv);
    expect(result.nodes[0].kind).toBe('person');
    expect(result.nodes[1].kind).toBe('cloud');
    expect(result.nodes[2].kind).toBe('process'); // Decision maps to process
  });
});

describe('parseDrawioXml', () => {
  const validXml = `<mxGraphModel>
    <root>
      <mxCell id="0"/>
      <mxCell id="1" parent="0"/>
      <mxCell id="2" value="Server" vertex="1" parent="1">
        <mxGeometry x="100" y="200" width="120" height="60"/>
      </mxCell>
      <mxCell id="3" value="DB" style="shape=cylinder" vertex="1" parent="1">
        <mxGeometry x="400" y="200" width="120" height="60"/>
      </mxCell>
      <mxCell id="4" value="connects" edge="1" source="2" target="3" parent="1"/>
    </root>
  </mxGraphModel>`;

  it('parses vertices and edges', () => {
    const result = parseDrawioXml(validXml);
    expect(result.nodes.length).toBe(2);
    expect(result.edges.length).toBe(1);
  });

  it('extracts node titles from value attribute', () => {
    const result = parseDrawioXml(validXml);
    const titles = result.nodes.map((n) => n.title);
    expect(titles).toContain('Server');
    expect(titles).toContain('DB');
  });

  it('extracts geometry positions', () => {
    const result = parseDrawioXml(validXml);
    const server = result.nodes.find((n) => n.title === 'Server');
    expect(server?.posX).toBe(100);
    expect(server?.posY).toBe(200);
  });

  it('guesses kind from style attribute', () => {
    const result = parseDrawioXml(validXml);
    const db = result.nodes.find((n) => n.title === 'DB');
    expect(db?.kind).toBe('database');
  });

  it('extracts edge label', () => {
    const result = parseDrawioXml(validXml);
    expect(result.edges[0].label).toBe('connects');
  });

  it('handles empty XML', () => {
    const result = parseDrawioXml('<mxGraphModel><root></root></mxGraphModel>');
    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
  });

  it('handles HTML in value attribute', () => {
    const xml = `<mxGraphModel><root>
      <mxCell id="0"/>
      <mxCell id="1" parent="0"/>
      <mxCell id="2" value="&lt;b&gt;Bold&lt;/b&gt;" vertex="1" parent="1">
        <mxGeometry x="0" y="0" width="100" height="50"/>
      </mxCell>
    </root></mxGraphModel>`;
    const result = parseDrawioXml(xml);
    expect(result.nodes[0].title).toBe('<b>Bold</b>');
  });
});

describe('parseMiroJson', () => {
  it('parses widgets and connectors', () => {
    const json = JSON.stringify({
      type: 'board',
      widgets: [
        { id: '1', type: 'shape', plainText: 'Node A', x: 100, y: 200 },
        { id: '2', type: 'shape', plainText: 'Node B', x: 400, y: 200 },
        { id: '3', type: 'connector', startWidget: { id: '1' }, endWidget: { id: '2' } },
      ],
    });
    const result = parseMiroJson(json);
    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
    expect(result.nodes[0].title).toBe('Node A');
    expect(result.nodes[1].title).toBe('Node B');
    expect(result.edges[0].sourceId).toBe('1');
    expect(result.edges[0].targetId).toBe('2');
  });

  it('handles invalid JSON gracefully', () => {
    const result = parseMiroJson('not json');
    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
    expect(result.warnings).toContain('Invalid JSON');
  });

  it('handles empty widgets array', () => {
    const result = parseMiroJson(JSON.stringify({ widgets: [] }));
    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
  });

  it('filters out connectors referencing unknown widgets', () => {
    const json = JSON.stringify({
      widgets: [
        { id: '1', type: 'shape', plainText: 'Node A', x: 0, y: 0 },
        { id: '99', type: 'connector', startWidget: { id: '1' }, endWidget: { id: 'missing' } },
      ],
    });
    const result = parseMiroJson(json);
    expect(result.nodes).toHaveLength(1);
    expect(result.edges).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('extracts positions from x/y fields', () => {
    const json = JSON.stringify({
      widgets: [{ id: '1', type: 'shape', plainText: 'A', x: 150, y: 250 }],
    });
    const result = parseMiroJson(json);
    expect(result.nodes[0].posX).toBe(150);
    expect(result.nodes[0].posY).toBe(250);
  });
});
