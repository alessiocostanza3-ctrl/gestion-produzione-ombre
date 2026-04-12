// ═══════════════════════════════════════════════════════════════════
//  DnD shared utilities — ghost creation, movement, drop detection
// ═══════════════════════════════════════════════════════════════════

const GHOST_BASE = 'position:fixed;pointer-events:none;user-select:none;-webkit-user-select:none;z-index:99999;transition:none;';

/**
 * Crea un ghost (clone fisso) dell'elemento trascinato.
 * @param {HTMLElement} el  — elemento sorgente
 * @param {object}      [opts]
 * @param {number}      [opts.opacity=0.88]
 * @param {string}      [opts.scale='1.04']
 * @param {string}      [opts.rotate='-1deg']
 * @param {string}      [opts.borderRadius='10px']
 * @param {string}      [opts.shadow='0 10px 30px rgba(0,0,0,0.35)']
 * @param {string}      [opts.background]     — se omesso, nessuno
 * @param {string}      [opts.border]         — se omesso, nessuno
 * @param {string}      [opts.transition]     — extra transition (es. 'transform 0.1s')
 * @returns {{ ghost: HTMLElement, offX: number, offY: number }}
 */
export function createGhost(el, clientX, clientY, opts = {}) {
    const rect = el.getBoundingClientRect();
    const ghost = el.cloneNode(true);
    ghost.removeAttribute('id');

    const o    = opts.opacity      ?? 0.88;
    const sc   = opts.scale        ?? '1.04';
    const rot  = opts.rotate       ?? '-1deg';
    const br   = opts.borderRadius ?? '10px';
    const sh   = opts.shadow       ?? '0 10px 30px rgba(0,0,0,0.35)';
    const bg   = opts.background   ? `background:${opts.background};` : '';
    const bd   = opts.border       ? `border:${opts.border};`         : '';
    const tr   = opts.transition   ? `transition:${opts.transition};` : '';

    ghost.style.cssText = GHOST_BASE
        + `width:${rect.width}px;height:${rect.height}px;`
        + `left:${rect.left}px;top:${rect.top}px;`
        + `opacity:${o};`
        + `border-radius:${br};`
        + `box-shadow:${sh};`
        + `transform:scale(${sc}) rotate(${rot});`
        + bg + bd + tr;

    document.body.appendChild(ghost);

    return {
        ghost,
        offX: clientX - rect.left,
        offY: clientY - rect.top
    };
}

/** Sposta il ghost alle coordinate puntatore. */
export function moveGhost(ghost, clientX, clientY, offX, offY) {
    ghost.style.left = (clientX - offX) + 'px';
    ghost.style.top  = (clientY - offY) + 'px';
}

/** Rimuove il ghost dal DOM. */
export function removeGhost(ghost) {
    if (ghost) ghost.remove();
}

/**
 * Trova l'elemento sotto il ghost (nascondendolo momentaneamente).
 * @param {HTMLElement}  ghost
 * @param {number}       clientX
 * @param {number}       clientY
 * @param {string}       selector — CSS selector per closest()
 * @returns {HTMLElement|null}
 */
export function dropTargetAtPoint(ghost, clientX, clientY, selector) {
    if (ghost) ghost.style.visibility = 'hidden';
    const el = document.elementFromPoint(clientX, clientY);
    if (ghost) ghost.style.visibility = '';
    return el ? el.closest(selector) : null;
}
