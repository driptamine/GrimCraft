import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BASE_WEAPONS, WEAPON_FACTIONS } from './catalog.js';
import { WEAPON_ICONS } from './icons.js';
import { ACTIVE_KEY, DRAFT_KEY, ARMOR_TYPES, approximatePiercing, clone, expectedHit, newMod, parseMod, validateMod, weaponDps, type BalanceArmor, type BalanceMod, type BalanceWeapon } from './model.js';
import './editor.css';

const LABELS = ['Infantry Low', 'Infantry Medium', 'Infantry High', 'Infantry Heavy Medium', 'Infantry Heavy High', 'Commander', 'Vehicle Low', 'Vehicle Medium', 'Vehicle High', 'Vehicle Air', 'Building Low', 'Building Medium', 'Building High', 'Daemon Medium', 'Daemon High'];
const number = (value: number | null) => value == null || !Number.isFinite(value) ? '—' : value.toLocaleString('en-US', { maximumFractionDigits: 3 });
interface BattleResult { expectedDps: number; damage: number; measuredDps: number; shots: number; hits: number; killed: boolean; elapsed: number; timeline: { time: number; hp: number }[] }
function initialMod(): BalanceMod {
  try { const text = localStorage.getItem(DRAFT_KEY);return text ? parseMod(text) : newMod(); } catch { return newMod(); }
}
function NumberField({ label, value, onChange, min = 0, max = 1e6, step = .1, suffix = '', baseline }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; suffix?: string; baseline?: number }) {
  return <label className="balance-field"><span>{label}{baseline != null && value !== baseline && <small>было {number(baseline)}{suffix} <button type="button" aria-label={`Сбросить ${label}`} title="Вернуть исходное значение" onClick={event => { event.preventDefault();onChange(baseline); }}>↺</button></small>}</span><div><input aria-label={label} type="number" min={min} max={max} step={step} value={Number.isFinite(value) ? value : ''} onChange={event => onChange(event.target.value === '' ? NaN : Number(event.target.value))} /><span>{suffix}</span></div></label>;
}
function BalanceEditor() {
  const [history, setHistory] = useState(() => ({ past: [] as BalanceMod[], present: initialMod(), future: [] as BalanceMod[] }));
  const mod = history.present;
  const [selected, setSelected] = useState('lasgun'), [query, setQuery] = useState(''), [faction, setFaction] = useState('all');
  const [status, setStatus] = useState('Черновик сохраняется автоматически в этом браузере.');
  const [activeName, setActiveName] = useState(() => { try { const text = localStorage.getItem(ACTIVE_KEY);return text ? parseMod(text).name : ''; } catch { return ''; } });
  const [tab, setTab] = useState<'weapon' | 'test' | 'changes'>('weapon');
  const [armor, setArmor] = useState<BalanceArmor>('infantry_med'), [targetHP, setTargetHP] = useState(160), [count, setCount] = useState(1), [duration, setDuration] = useState(30), [seed, setSeed] = useState(1), [moving, setMoving] = useState(false);
  const [result, setResult] = useState<BattleResult | null>(null), [running, setRunning] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null), request = useRef<AbortController | null>(null);
  const base = BASE_WEAPONS[selected], weapon = mod.weapons[selected] || base;
  const factions = [...new Set(Object.values(WEAPON_FACTIONS))];
  const visibleWeapons = Object.entries(BASE_WEAPONS).filter(([key, item]) => (faction === 'all' || WEAPON_FACTIONS[key] === faction) && `${key} ${item.name}`.toLowerCase().includes(query.toLowerCase()));
  function selectWeapon(key: string) { setSelected(key);document.getElementById('balance-profile')?.scrollIntoView({ block: 'start' }); }
  const errors = validateMod(mod), changed = Object.keys(mod.weapons).filter(key => BASE_WEAPONS[key]);
  const signature = JSON.stringify({ selected, weapon, armor, targetHP, count, duration, seed, moving });
  const signatureRef = useRef(signature);signatureRef.current = signature;
  useEffect(() => { request.current?.abort();setRunning(false);setResult(null); }, [signature]);
  useEffect(() => {
    if (errors.length) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(mod)); } catch { setStatus('Не удалось сохранить черновик: хранилище браузера недоступно. Экспортируйте JSON.'); }
  }, [mod]);
  function change(next: BalanceMod) {
    if (JSON.stringify(next) === JSON.stringify(mod)) return;
    setHistory(current => ({ past: [...current.past.slice(-49), current.present], present: next, future: [] }));
  }
  function undo() { setHistory(current => current.past.length ? { past: current.past.slice(0, -1), present: current.past.at(-1)!, future: [current.present, ...current.future] } : current); }
  function redo() { setHistory(current => current.future.length ? { past: [...current.past, current.present], present: current.future[0], future: current.future.slice(1) } : current); }
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || (event.target instanceof HTMLElement && event.target.matches('input,textarea'))) return;
      if (event.key.toLowerCase() === 'z') { event.preventDefault();event.shiftKey ? redo() : undo(); }
      else if (event.key.toLowerCase() === 'y') { event.preventDefault();redo(); }
    };
    window.addEventListener('keydown', listener);return () => window.removeEventListener('keydown', listener);
  }, []);
  function edit(patch: Partial<BalanceWeapon>) {
    const next = clone(mod), updated = { ...clone(weapon), ...patch };
    if (JSON.stringify(updated) === JSON.stringify(base)) delete next.weapons[selected];
    else next.weapons[selected] = updated;
    change(next);
  }
  function assertValid() {
    const unknown = Object.keys(mod.weapons).filter(key => !BASE_WEAPONS[key]);
    if (errors.length || unknown.length) { setStatus(errors[0] || `Неизвестное оружие: ${unknown.join(', ')}`);return false; }
    return true;
  }
  function apply() {
    if (!assertValid()) return;
    try { localStorage.setItem(ACTIVE_KEY, JSON.stringify(mod));setActiveName(mod.name);setStatus('Мод выбран. Он применяется при запуске новой одиночной игры и может быть выбран хостом в лобби.'); }
    catch { setStatus('Не удалось сохранить активный мод.'); }
  }
  function exportMod() {
    if (!assertValid()) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(mod, null, 2) + '\n'], { type: 'application/json' }));
    const link = document.createElement('a');link.href = url;link.download = `${mod.id}-${mod.version.replace(/[^\w.-]/g, '_')}.json`;link.click();setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Мод экспортирован в JSON.');
  }
  async function importMod(file?: File) {
    if (!file) return;
    try {
      if (file.size > 512_000) throw new Error('Файл слишком большой (максимум 512 КБ).');
      const imported = parseMod(await file.text());
      if (Object.keys(imported.weapons).some(key => !BASE_WEAPONS[key])) throw new Error('Файл содержит неизвестное оружие.');
      change(imported);setStatus(`Импортирован мод ${imported.name}.`);
    } catch (error) { setStatus(`Импорт отклонён: ${(error as Error).message}`); }
  }
  async function battle() {
    if (!assertValid()) return;
    if (!Number.isInteger(count) || count < 1 || count > 100 || !Number.isFinite(targetHP) || targetHP < 1 || targetHP > 1e7 || !Number.isFinite(duration) || duration < 1 || duration > 300 || !Number.isInteger(seed) || seed < 0 || seed > 2147483647) {
      setStatus('Проверьте параметры теста: HP 1–10 000 000, целое число стрелков 1–100, длительность 1–300 с, целый seed 0–2147483647.');return;
    }
    const controller = new AbortController();request.current?.abort();request.current = controller;
    setRunning(true);setResult(null);setStatus('Тест выполняется в Go…');
    const startedSignature = signature;
    try {
      const response = await fetch('http://127.0.0.1:8080/api/balance/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ weapon, armor, targetHP, count, duration, seed, moving }), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      if (signatureRef.current === startedSignature) { setResult(data);setStatus('Тест завершён. Расчёт и выстрелы выполнил Go-сервер.'); }
    } catch (error) {
      if (!controller.signal.aborted) setStatus(error instanceof TypeError ? 'Нет соединения с Go. Запустите grimcraft-go на порту 8080.' : `Тест не выполнен: ${(error as Error).message}`);
    } finally { if (request.current === controller) setRunning(false); }
  }
  const fields: [keyof BalanceWeapon, string, number, number, number, string][] = [
    ['minDamage', 'Base Damage · Min', 0, 1e6, .1, ''], ['maxDamage', 'Base Damage · Max', 0, 1e6, .1, ''],
    ['minimumDamage', 'Minimum Damage · Min.D', 0, 1e6, .1, ''], ['refire', 'Refire Rate', .05, 300, .05, ' с'], ['range', 'Range', 0, 1000, .5, ''],
  ];
  return <div className="balance-app">
    <header className="balance-header"><div className="balance-header-inner"><a className="balance-brand" href="/"><span className="balance-brand-mark" aria-hidden="true">G</span> GrimCraft <span>Balance Editor</span></a><nav aria-label="Разделы редактора"><a href="#balance-arsenal">Арсенал</a><button onClick={() => { setTab('test');document.getElementById('balance-profile')?.scrollIntoView(); }}>Тестовая арена</button><a href="/" className="balance-link">В игру ↗</a></nav></div></header>
    <section className="balance-toolbar" aria-label="Мод">
      <label>Название<input aria-label="Название мода" value={mod.name} onChange={event => change({ ...mod, name: event.target.value })} /></label>
      <label>ID<input aria-label="ID мода" value={mod.id} onChange={event => change({ ...mod, id: event.target.value })} /></label>
      <label className="balance-version">Версия<input aria-label="Версия мода" value={mod.version} onChange={event => change({ ...mod, version: event.target.value })} /></label>
      <div className="balance-tools"><button onClick={undo} disabled={!history.past.length} title="Undo · Ctrl/Cmd+Z">↶ Undo</button><button onClick={redo} disabled={!history.future.length} title="Redo · Ctrl/Cmd+Shift+Z">↷ Redo</button><button onClick={() => fileInput.current?.click()}>Импорт</button><button onClick={exportMod}>Экспорт JSON</button><button className="balance-primary" onClick={apply}>Выбрать мод</button></div>
      <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={event => { void importMod(event.target.files?.[0]);event.target.value = ''; }} />
    </section>
    <div className="balance-status" role="status">{status}</div>
    <main className="balance-layout">
      <section className="balance-workspace" id="balance-profile">
        <div className="balance-breadcrumb"><a href="#balance-arsenal">← К арсеналу</a><select aria-label="Оружие для редактирования" value={selected} onChange={event => selectWeapon(event.target.value)}>{Object.entries(BASE_WEAPONS).map(([key, item]) => <option key={key} value={key}>{WEAPON_FACTIONS[key]} · {item.name}</option>)}</select></div>
        <div className="balance-heading"><div><h1><img className="balance-weapon-icon" src={WEAPON_ICONS[selected]} alt="" />{weapon.name}</h1><small>{WEAPON_FACTIONS[selected]} · {mod.name} ({mod.version})</small></div><button onClick={() => { const next = clone(mod);delete next.weapons[selected];change(next); }}>Сбросить оружие</button></div>
        <div className="balance-overview">
          <dl className="balance-stat-table">
            <div><dt>Base Damage</dt><dd><span className="balance-stat-icon damage" aria-hidden="true">✦</span>{number(weapon.minDamage)}–{number(weapon.maxDamage)}</dd></div>
            <div><dt>Минимальный урон</dt><dd>{number(weapon.minimumDamage)}</dd></div>
            <div><dt>Точность</dt><dd><span className="balance-stat-icon accuracy" aria-hidden="true">◎</span>{number(weapon.accuracy * 100)}%</dd></div>
            <div><dt>Интервал стрельбы</dt><dd><span className="balance-stat-icon time" aria-hidden="true">◷</span>{number(weapon.refire)} с</dd></div>
            <div><dt>Дальность</dt><dd><span className="balance-stat-icon range" aria-hidden="true">↗</span>{number(weapon.range)}</dd></div>
            <div><dt>DPS · стоя</dt><dd>{number(weaponDps(weapon, armor))}</dd></div>
            <div><dt>DPS · в движении</dt><dd>{number(weaponDps(weapon, armor, true))}</dd></div>
          </dl>
          <aside className="balance-summary"><h2>Профиль оружия</h2><p>{weapon.mode === 'ap' ? 'Урон рассчитывается через Base Damage и Armour Piercing. Точность и интервал определяют итоговый DPS.' : 'Исходная таблица DPS сохранена. Для настройки урона попадания и пробития переключите модель на Base Damage × Armour Piercing.'}</p><label>Броня для предпросмотра<select aria-label="Броня предпросмотра" value={armor} onChange={event => setArmor(event.target.value as BalanceArmor)}>{ARMOR_TYPES.map((key, index) => <option value={key} key={key}>{LABELS[index]}</option>)}</select></label><div className="balance-summary-values"><span>Урон попадания <strong>{number(expectedHit(weapon, armor))}</strong></span><span>Выстрелов / с <strong>{number(1 / weapon.refire)}</strong></span></div><p className="balance-formula">{weapon.mode === 'ap' ? 'DPS = max(средний урон × AP / 100, Min.D) × Accuracy / Refire' : 'Значения можно сравнить с базовым балансом в таблице ниже.'}</p></aside>
        </div>
        <div className="balance-tabs" role="tablist">{[['weapon', 'Характеристики'], ['test', 'Тестовая арена'], ['changes', `Изменения (${changed.length})`]].map(([key, label]) => <button role="tab" aria-selected={tab === key} key={key} onClick={() => setTab(key as typeof tab)}>{label}</button>)}</div>
        {errors.length > 0 && <div className="balance-errors" role="alert"><strong>Исправьте перед применением:</strong><ul>{errors.slice(0, 5).map((error, index) => <li key={index}>{error}</li>)}</ul>{errors.length > 5 && <span>Ещё ошибок: {errors.length - 5}</span>}</div>}
        {tab === 'weapon' && <>
          <details className="balance-disclosure" open><summary><img src={WEAPON_ICONS[selected]} alt="" /><span>Параметры оружия</span><small>{weapon.mode === 'ap' ? 'Base Damage × AP' : 'Готовый DPS'}</small></summary><div className="balance-card"><div className="balance-card-title"><h2>Модель урона</h2><select aria-label="Модель урона" value={weapon.mode} onChange={event => edit({ mode: event.target.value as 'ap' | 'dps' })}><option value="dps">Готовый DPS</option><option value="ap">Base Damage × Armour Piercing</option></select></div>
            <p>{weapon.mode === 'dps' ? 'Сохранены готовые DPS игры. Для полноценного редактирования Base Damage и AP выберите второй режим.' : 'DPS рассчитывается из Base Damage, AP, точности и интервала. Изменение Refire не увеличивает урон попадания.'}</p>
            <div className="balance-fields">{fields.map(([key, label, min, max, step, suffix]) => <NumberField key={key} label={label} value={weapon[key] as number} baseline={base[key] as number} min={min} max={max} step={step} suffix={suffix} onChange={value => edit({ [key]: value })} />)}
              <NumberField label="Accuracy · стоя" value={weapon.accuracy * 100} baseline={base.accuracy * 100} max={100} step={1} suffix="%" onChange={value => edit({ accuracy: value / 100 })} /><NumberField label="Accuracy · в движении" value={weapon.movingAccuracy * 100} baseline={base.movingAccuracy * 100} max={100} step={1} suffix="%" onChange={value => edit({ movingAccuracy: value / 100 })} />
            </div>
          </div></details>
          <details className="balance-disclosure" open><summary><span className="balance-disclosure-icon armor" aria-hidden="true">⬡</span><span>Броня и пробитие</span><small>15 типов брони</small></summary><div className="balance-card"><div className="balance-card-title"><h2>Armour Piercing и DPS</h2><button onClick={() => { edit({ armorPiercing: approximatePiercing(weapon).armorPiercing });setStatus('AP рассчитан приблизительно из готового DPS. Значения на минимальном урoне оставлены неизвестными.'); }}>Оценить AP из DPS</button></div><p>Пустое AP означает «неизвестно». В режиме AP заполните все типы брони. Оценка по DPS не восстанавливает значения, скрытые минимальным уроном.</p>
            <div className="balance-table-wrap"><table><thead><tr><th>Тип брони</th><th>AP, %</th><th>Урон попадания</th><th>DPS</th><th>Было DPS</th><th>Δ</th></tr></thead><tbody>{ARMOR_TYPES.map((armorKey, index) => {
              const dps = weaponDps(weapon, armorKey), before = weaponDps(base, armorKey) || 0;
              return <tr key={armorKey}><th scope="row">{LABELS[index]}</th><td><input aria-label={`AP ${armorKey}`} type="number" min="0" max="100" step=".1" placeholder="?" value={weapon.armorPiercing[armorKey] ?? ''} onChange={event => edit({ armorPiercing: { ...weapon.armorPiercing, [armorKey]: event.target.value === '' ? null : Number(event.target.value) } })} /></td><td>{number(expectedHit(weapon, armorKey))}</td><td>{weapon.mode === 'dps' ? <input aria-label={`DPS ${armorKey}`} type="number" min="0" max="10000000" step=".1" value={weapon.dps[armorKey]} onChange={event => edit({ dps: { ...weapon.dps, [armorKey]: Number(event.target.value) } })} /> : number(dps)}</td><td className="balance-muted">{number(before)}</td><td className={dps != null && dps > before ? 'balance-up' : 'balance-down'}>{dps == null ? '—' : `${dps > before ? '+' : ''}${number(dps - before)}`}</td></tr>;
            })}</tbody></table></div>
          </div></details>
        </>}
        {tab === 'test' && <div className="balance-card"><div className="balance-card-title"><h2>Стрелковый тест</h2><span className="balance-tag">GO SIMULATION</span></div><p>Оружие против неподвижной цели. Выстрелы, точность и урон рассчитываются в Go. Одинаковый seed повторяет результат; модели и карта не загружаются.</p><div className="balance-fields">
          <label className="balance-field"><span>Броня цели</span><select aria-label="Броня цели" value={armor} onChange={event => setArmor(event.target.value as BalanceArmor)}>{ARMOR_TYPES.map((key, index) => <option value={key} key={key}>{LABELS[index]}</option>)}</select></label>
          <NumberField label="HP цели" value={targetHP} min={1} max={1e7} step={10} onChange={setTargetHP} /><NumberField label="Стрелков" value={count} min={1} max={100} step={1} onChange={setCount} /><NumberField label="Длительность" value={duration} min={1} max={300} step={1} suffix=" с" onChange={setDuration} /><NumberField label="Seed" value={seed} min={0} max={2147483647} step={1} onChange={setSeed} />
        </div><label className="balance-checkbox"><input type="checkbox" checked={moving} onChange={event => setMoving(event.target.checked)} />Стрельба в движении</label><button className="balance-primary" onClick={() => void battle()} disabled={running || !!errors.length}>{running ? 'Выполняется…' : 'Запустить тест'}</button>
          {result && <div className="balance-results"><div className="balance-metrics"><div><small>РАСЧЁТНЫЙ DPS</small><strong>{number(result.expectedDps)}</strong></div><div><small>ФАКТИЧЕСКИЙ DPS</small><strong>{number(result.measuredDps)}</strong></div><div><small>ПОПАДАНИЯ / ВЫСТРЕЛЫ</small><strong>{result.hits} / {result.shots}</strong></div><div><small>{result.killed ? 'ВРЕМЯ УБИЙСТВА' : 'ВРЕМЯ ТЕСТА'}</small><strong>{number(result.elapsed)} с</strong></div></div>
            <svg viewBox="0 0 600 180" role="img" aria-label="График оставшегося HP цели"><line x1="0" y1="170" x2="600" y2="170" stroke="#45465d" /><polyline fill="none" stroke="#e6cd28" strokeWidth="2" points={result.timeline.map(point => `${point.time / Math.max(result.elapsed, .001) * 600},${170 - point.hp / targetHP * 155}`).join(' ')} /></svg><p>Снято HP: {number(result.damage)}. {result.killed ? 'Цель уничтожена.' : 'Цель выжила.'} Измеренный DPS учитывает фактически снятое HP; короткие тесты и первый выстрел дают отклонение от среднего.</p>
          </div>}
        </div>}
        {tab === 'changes' && <div className="balance-card"><h2>Изменения относительно базового баланса</h2>{!changed.length && <p>Изменений пока нет. Выберите оружие и измените параметр.</p>}{changed.map(key => <div className="balance-diff" key={key}><button onClick={() => { selectWeapon(key);setTab('weapon'); }}>{BASE_WEAPONS[key].name}</button><pre>{JSON.stringify(Object.fromEntries(Object.entries(mod.weapons[key]).filter(([field, value]) => JSON.stringify(value) !== JSON.stringify(BASE_WEAPONS[key][field as keyof BalanceWeapon]))), null, 2)}</pre></div>)}</div>}
        <div className="balance-profile-id">Weapon ID: <code>{selected}</code><span>Balance Editor · v1</span></div>
      </section>
      <aside className="balance-sidebar" id="balance-arsenal"><div className="balance-arsenal-heading"><h2>Арсенал</h2><span>{Object.keys(BASE_WEAPONS).length} профилей оружия</span><input aria-label="Поиск оружия" placeholder="Поиск оружия…" value={query} onChange={event => setQuery(event.target.value)} /><select aria-label="Раса" value={faction} onChange={event => setFaction(event.target.value)}><option value="all">Все расы</option>{factions.map(name => <option key={name}>{name}</option>)}</select></div>
        <div className="balance-arsenal-groups">{factions.map(name => { const entries = visibleWeapons.filter(([key]) => WEAPON_FACTIONS[key] === name);return entries.length ? <section className="balance-arsenal-group" key={name}><h3>{name}</h3><nav aria-label={`Оружие ${name}`}>{entries.map(([key, item]) => <button key={key} className={selected === key ? 'selected' : ''} aria-pressed={selected === key} onClick={() => selectWeapon(key)}><img src={WEAPON_ICONS[key]} alt="" loading="lazy" /><span>{item.name}{mod.weapons[key] && <i aria-label="изменено">●</i>}</span></button>)}</nav></section> : null; })}</div>
        {!visibleWeapons.length && <p className="balance-empty">Оружие не найдено. Измените поиск или выберите другую расу.</p>}
        <div className="balance-active"><span>Выбран для игры: <strong>{activeName || 'Базовый баланс'}</strong></span>{activeName && <button onClick={() => { localStorage.removeItem(ACTIVE_KEY);setActiveName('');setStatus('Выбран базовый баланс для следующего матча.'); }}>Отключить мод</button>}</div>
      </aside>
    </main>
  </div>;
}
export function mountBalanceEditor(): void {
  document.documentElement.lang = 'ru';
  const root = document.createElement('div');document.body.append(root);createRoot(root).render(<BalanceEditor />);
}
