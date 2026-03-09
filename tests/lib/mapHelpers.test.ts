import { describe, it, expect } from 'vitest';
import {
  sanitizeHandle,
  normalizeTitle,
  defaultColorForKind,
  nextKind,
  ideaKindToNodeKind,
  positionForIndex,
  baseX,
  baseY,
  now,
  withCommentArray,
} from '../../lib/mapHelpers';

describe('sanitizeHandle', () => {
  it('returns null for null/undefined input', () => {
    expect(sanitizeHandle(null, 'source')).toBe(null);
    expect(sanitizeHandle(undefined, 'source')).toBe(null);
  });

  it('replaces wrong role prefix in handle', () => {
    expect(sanitizeHandle('target-left', 'source')).toBe('source-left');
    expect(sanitizeHandle('source-right', 'target')).toBe('target-right');
  });

  it('returns handle unchanged if it does not contain the opposite role', () => {
    expect(sanitizeHandle('source-left', 'source')).toBe('source-left');
    expect(sanitizeHandle('handle-top', 'source')).toBe('handle-top');
  });

  it('returns null for empty string', () => {
    expect(sanitizeHandle('', 'source')).toBe(null);
  });
});

describe('normalizeTitle', () => {
  it('trims and lowercases', () => {
    expect(normalizeTitle('  Hello World  ')).toBe('hello world');
  });

  it('handles empty string', () => {
    expect(normalizeTitle('')).toBe('');
  });
});

describe('defaultColorForKind', () => {
  it('returns correct color for each known kind', () => {
    expect(defaultColorForKind('person')).toBe('#38bdf8');
    expect(defaultColorForKind('system')).toBe('#22c55e');
    expect(defaultColorForKind('process')).toBe('#fbbf24');
    expect(defaultColorForKind('database')).toBe('#6366f1');
    expect(defaultColorForKind('api')).toBe('#0ea5e9');
    expect(defaultColorForKind('queue')).toBe('#f59e0b');
    expect(defaultColorForKind('cache')).toBe('#ef4444');
    expect(defaultColorForKind('cloud')).toBe('#8b5cf6');
    expect(defaultColorForKind('team')).toBe('#14b8a6');
    expect(defaultColorForKind('vendor')).toBe('#f97316');
  });

  it('returns default color for generic/unknown kind', () => {
    expect(defaultColorForKind('generic')).toBe('#6366f1');
  });
});

describe('nextKind', () => {
  it('cycles through kinds based on index', () => {
    expect(nextKind(0)).toBe('person');
    expect(nextKind(1)).toBe('system');
    expect(nextKind(2)).toBe('process');
    expect(nextKind(3)).toBe('database');
    expect(nextKind(4)).toBe('api');
  });

  it('wraps around after all kinds', () => {
    // There are 11 kinds total
    expect(nextKind(11)).toBe('person');
    expect(nextKind(12)).toBe('system');
  });
});

describe('ideaKindToNodeKind', () => {
  it('returns generic for undefined/empty input', () => {
    expect(ideaKindToNodeKind()).toBe('generic');
    expect(ideaKindToNodeKind('')).toBe('generic');
  });

  it('maps person-related strings', () => {
    expect(ideaKindToNodeKind('Person')).toBe('person');
    expect(ideaKindToNodeKind('stakeholder')).toBe('person');
    expect(ideaKindToNodeKind('End User')).toBe('person');
  });

  it('maps database-related strings', () => {
    expect(ideaKindToNodeKind('Database')).toBe('database');
    expect(ideaKindToNodeKind('DB')).toBe('database');
    expect(ideaKindToNodeKind('Storage Layer')).toBe('database');
  });

  it('maps api-related strings', () => {
    expect(ideaKindToNodeKind('API')).toBe('api');
    expect(ideaKindToNodeKind('REST endpoint')).toBe('api');
    expect(ideaKindToNodeKind('API Gateway')).toBe('api');
  });

  it('maps queue-related strings', () => {
    expect(ideaKindToNodeKind('Message Queue')).toBe('queue');
    expect(ideaKindToNodeKind('Event Bus')).toBe('queue');
  });

  it('maps cache-related strings', () => {
    expect(ideaKindToNodeKind('Cache Layer')).toBe('cache');
    expect(ideaKindToNodeKind('Redis')).toBe('cache');
  });

  it('maps cloud-related strings', () => {
    expect(ideaKindToNodeKind('AWS Lambda')).toBe('cloud');
    expect(ideaKindToNodeKind('GCP')).toBe('cloud');
    expect(ideaKindToNodeKind('Azure Functions')).toBe('cloud');
  });

  it('maps team-related strings', () => {
    expect(ideaKindToNodeKind('Team')).toBe('team');
    expect(ideaKindToNodeKind('Department')).toBe('team');
  });

  it('maps vendor-related strings', () => {
    expect(ideaKindToNodeKind('Vendor')).toBe('vendor');
    expect(ideaKindToNodeKind('Third-Party API')).toBe('api'); // "api" keyword matches first
    expect(ideaKindToNodeKind('External SaaS')).toBe('vendor');
  });

  it('maps system-related strings', () => {
    expect(ideaKindToNodeKind('System')).toBe('system');
    expect(ideaKindToNodeKind('Platform')).toBe('system');
    expect(ideaKindToNodeKind('Microservice')).toBe('system');
  });

  it('maps process-related strings', () => {
    expect(ideaKindToNodeKind('Process')).toBe('process');
    expect(ideaKindToNodeKind('CI/CD Pipeline')).toBe('process');
    expect(ideaKindToNodeKind('Workflow')).toBe('process');
  });
});

describe('positionForIndex', () => {
  const origin = { x: 0, y: 0 };

  it('positions first item at origin', () => {
    const pos = positionForIndex(0, origin);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);
  });

  it('spaces items horizontally within a row (3 columns)', () => {
    const spacingX = baseX + 80;
    const pos1 = positionForIndex(1, origin);
    expect(pos1.x).toBe(spacingX);
    expect(pos1.y).toBe(0);
  });

  it('wraps to next row after 3 columns', () => {
    const spacingY = baseY + 40;
    const pos3 = positionForIndex(3, origin);
    expect(pos3.x).toBe(0);
    expect(pos3.y).toBe(spacingY);
  });

  it('offsets from provided origin', () => {
    const pos = positionForIndex(0, { x: 100, y: 200 });
    expect(pos.x).toBe(100);
    expect(pos.y).toBe(200);
  });
});

describe('now', () => {
  it('returns a valid ISO 8601 date string', () => {
    const result = now();
    expect(new Date(result).toISOString()).toBe(result);
  });
});

describe('withCommentArray', () => {
  it('preserves existing comments', () => {
    const note = {
      id: '1',
      title: 'Test',
      tags: [],
      content: '',
      comments: [{ id: 'c1', text: 'hello', author: 'me', createdAt: '' }],
      createdAt: '',
      updatedAt: '',
    } as any;
    const result = withCommentArray(note);
    expect(result.comments).toHaveLength(1);
  });

  it('defaults undefined comments to empty array', () => {
    const note = {
      id: '1',
      title: 'Test',
      tags: [],
      content: '',
      createdAt: '',
      updatedAt: '',
    } as any;
    const result = withCommentArray(note);
    expect(result.comments).toEqual([]);
  });
});
