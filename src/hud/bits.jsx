import React from 'react';
import { ActionBtn, AmmoActionBtn, StatCell, TooltipPop } from './primitives.jsx';
import { assetUrl } from '../assets.js';
import { r2ImageUrl } from '../r2-image.js';

/**
 * <img> whose bytes go through fetch() instead of a raw image request, so
 * R2-hosted HUD icons land in the service-worker MODELS_CACHE exactly like
 * .glb files: download once, reuse offline. Falls back to the raw URL when
 * the fetch fails (no worse than a plain <img>). Renders without src until
 * the blob URL is ready, so nothing downloads twice.
 */
export function R2Img({ src, ...rest }) {
  const [resolved, setResolved] = React.useState(null);
  React.useEffect(() => {
    let live = true;
    setResolved(null);
    r2ImageUrl(src).then((url) => {
      if (live) {
        setResolved(url);
      }
    });
    return () => {
      live = false;
    };
  }, [src]);
  return <img {...rest} src={resolved || undefined} />;
}

/**
 * Renders an icon that is either an emoji glyph or an image path.
 */
export function Icon({ icon, fallback = '❓' }) {
  const src = icon || fallback;
  if (typeof src === 'string' && src.includes('/')) {
    return <R2Img src={assetUrl(src)} className="action-icon" alt="" style={{ width: 36, height: 36, objectFit: 'contain', marginBottom: 2 }} />;
  }
  return <span className="bi">{src}</span>;
}

export const REQ_ICON = 'assets/Resource_requisition.gif';
export const POWER_ICON = 'assets/Resource_power.gif';

export function CostGlyph({ req }) {
  return (
    <R2Img
      src={assetUrl(req ? REQ_ICON : POWER_ICON)}
      alt={req ? 'req' : 'power'}
      style={{ height: 10, verticalAlign: -1, marginLeft: 2 }}
    />
  );
}

/**
 * Renders tooltip text, swapping `100R` / `50P` cost tokens for the DoW
 * resource glyphs. Non-string content passes through untouched.
 */
export function TooltipText({ text }) {
  if (typeof text !== 'string') {
    return text;
  }
  return text.split(/(\d+[RP])/g).map((part, i) => {
    const m = /^(\d+)([RP])$/.exec(part);
    if (!m) {
      return part;
    }
    return (
      <span key={i}>
        {m[1]}
        <CostGlyph req={m[2] === 'R'} />
      </span>
    );
  });
}

/**
 * Generic hover tooltip. Renders `content` in an absolutely-positioned popup
 * above the wrapped element while hovered. Disabled children still show it.
 */
export function Tooltip({ content, children, width = 190 }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && content ? (
        <TooltipPop style={{ width }}><TooltipText text={content} /></TooltipPop>
      ) : null}
    </span>
  );
}

/**
 * Standard grid action button. Mirrors the old btn() helper: icon + label +
 * cost, optional right-click handler, optional inline style overrides.
 */
export function ActionButton({
  icon,
  label,
  cost,
  hideText,
  disabled,
  onClick,
  onRightClick,
  title,
  tooltip,
  style,
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <ActionBtn
      style={style}
      title={tooltip ? undefined : title}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick?.()}
      onContextMenu={(e) => {
        if (onRightClick && !disabled) {
          e.preventDefault();
          e.stopPropagation();
          onRightClick();
        }
      }}
    >
      {hovered && tooltip ? <TooltipPop><TooltipText text={tooltip} /></TooltipPop> : null}
      <Icon icon={icon} />
      {hideText ? null : <span className="btn-label">{label}</span>}
      {!hideText && cost ? <span className="bc">{cost}</span> : null}
    </ActionBtn>
  );
}

/**
 * Compact variant used inside the reinforce-button panel (icon only, 36×36).
 */
export function CompactReinforceButton({
  icon,
  label,
  cost,
  disabled,
  onClick,
  onRightClick,
  tooltip,
  style,
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <ActionBtn
      style={{ width: 36, height: 36, minHeight: 'unset', padding: 0, gap: 0, overflow: 'visible', fontSize: 0, ...style }}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick?.()}
      onContextMenu={(e) => {
        if (onRightClick && !disabled) {
          e.preventDefault();
          e.stopPropagation();
          onRightClick();
        }
      }}
      title={tooltip ? undefined : label}
    >
      {hovered && tooltip ? <TooltipPop><TooltipText text={tooltip} /></TooltipPop> : null}
      <Icon icon={icon} />
      {cost ? <span className="bc">{cost}</span> : null}
    </ActionBtn>
  );
}

/**
 * Tall slim variant used inside the ammo sub-panel.
 */
export function AmmoButton({
  icon,
  label,
  cost,
  disabled,
  onClick,
  tooltip,
  title,
  style,
}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <AmmoActionBtn
      style={style}
      title={tooltip ? undefined : title}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick?.()}
    >
      {hovered && tooltip ? <TooltipPop><TooltipText text={tooltip} /></TooltipPop> : null}
      <Icon icon={icon} />
      {label}
      {cost ? <span className="bc">{cost}</span> : null}
    </AmmoActionBtn>
  );
}

/**
 * One stat row: icon + label + value, with optional warn/good coloring.
 */
export function StatRow({ icon, label, value, cls = '' }) {
  const glyph = typeof icon === 'string' && (icon.includes('/') || icon.startsWith('data:'))
    ? <R2Img src={assetUrl(icon)} alt="" style={{ width: 32, height: 32, objectFit: 'contain', display: 'block' }} />
    : icon;
  return (
    <StatCell className={cls}>
      <span className="si">{glyph}</span>
      {label == null ? (
        <span className="sv" style={{ marginLeft: 0 }}>{value}</span>
      ) : (
        <>
          <span className="sl">{label}</span>
          <span className="sv">{value}</span>
        </>
      )}
    </StatCell>
  );
}
