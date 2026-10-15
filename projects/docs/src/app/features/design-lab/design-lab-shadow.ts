import { parseAerisColor } from '@aeris-ui/core/theming';

export interface LabShadow {
  readonly x: number;
  readonly y: number;
  readonly blur: number;
  readonly spread: number;
  readonly color: string;
  readonly opacity: number;
  readonly inset: boolean;
}

export const LAB_DEFAULT_SHADOW: LabShadow = {
  x: 0,
  y: 2,
  blur: 8,
  spread: 0,
  color: '#000000',
  opacity: 0.14,
  inset: false,
};

/** Recognize editable single pixel shadows; preserve other imported expressions verbatim. */
export function parseLabShadow(value: string): LabShadow | null {
  const match = /#[\da-f]{3,8}\b|(?:rgb|hsl)a?\([^)]*\)|\b(?:black|white|transparent)\b/i.exec(
    value,
  );
  if (!match) return null;
  let color = match[0].toLowerCase();
  let opacity = color === 'transparent' ? 0 : 1;
  if (color === 'transparent' || color === 'black') color = '#000000';
  if (color === 'white') color = '#ffffff';
  if (/^#[\da-f]{4}$|^#[\da-f]{8}$/i.test(color)) {
    const hex =
      color.length === 5
        ? [...color.slice(1)].map((digit) => digit + digit).join('')
        : color.slice(1);
    opacity = Number.parseInt(hex.slice(6), 16) / 255;
    color = '#' + hex.slice(0, 6);
  } else if (color.includes('(')) {
    const name = color.slice(0, color.indexOf('('));
    const body = color.slice(color.indexOf('(') + 1, -1);
    const channels = body.split('/');
    let alpha: string | undefined = channels[1];
    let opaque = channels[0] ?? '';
    if (channels.length > 2) return null;
    const commaChannels = opaque.split(',');
    if (commaChannels.length === 4 && alpha === undefined) {
      alpha = commaChannels.pop();
      opaque = commaChannels.join(',');
    }
    if (alpha !== undefined) {
      if (!/^\s*(?:\d+(?:\.\d*)?|\.\d+)%?\s*$/.test(alpha)) return null;
      opacity = Number.parseFloat(alpha) / (alpha.trim().endsWith('%') ? 100 : 1);
      if (opacity < 0 || opacity > 1) return null;
    }
    color = `${name}(${opaque})`;
  }
  const rgb = parseAerisColor(color);
  if (!rgb) return null;
  const rest = (value.slice(0, match.index) + value.slice(match.index + match[0].length)).trim();
  const parts = rest.split(/\s+/);
  const inset = parts.includes('inset');
  const lengths = parts.filter((part) => part !== 'inset');
  if (
    parts.filter((part) => part === 'inset').length > 1 ||
    lengths.length < 2 ||
    lengths.length > 4
  )
    return null;
  if (
    lengths.some(
      (part) =>
        !/^-?(?:\d+(?:\.\d*)?|\.\d+)(?:px)?$/.test(part) ||
        (!part.endsWith('px') && Number(part) !== 0),
    )
  )
    return null;
  const [x = 0, y = 0, blur = 0, spread = 0] = lengths.map(Number.parseFloat);
  if (![x, y, blur, spread].every(Number.isFinite) || blur < 0) return null;
  return {
    x,
    y,
    blur,
    spread,
    color:
      '#' +
      [rgb.red, rgb.green, rgb.blue]
        .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
        .join(''),
    opacity,
    inset,
  };
}

export function serializeLabShadow(shadow: LabShadow): string {
  const rgb = parseAerisColor(shadow.color);
  if (!rgb) throw new Error('Choose a regular shadow color.');
  return `${shadow.inset ? 'inset ' : ''}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px rgb(${rgb.red} ${rgb.green} ${rgb.blue} / ${Number(shadow.opacity.toFixed(4))})`;
}
