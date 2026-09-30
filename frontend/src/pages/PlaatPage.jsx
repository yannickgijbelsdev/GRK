import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { Search, X, Loader2, CheckCircle2, Music2 } from 'lucide-react';

const FORM_ID = '23192e9822f84e63937e2da1b4897df7';
const FORM_URL = `https://frames.koodh.com/api/public/form/${FORM_ID}`;

// ── Song search picker ────────────────────────────────────────────────────
const SongPicker = ({ searchUrl, value, onChange, required }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (value || !query || query.trim().length < 2) {
      setResults([]);
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(`${searchUrl}?term=${encodeURIComponent(query)}&limit=8`);
        const data = await r.json();
        setResults(Array.isArray(data) ? data : (data.results || []));
      } catch { setResults([]); }
      setSearching(false);
    }, 350);
    return () => clearTimeout(timerRef.current);
  }, [query, value, searchUrl]);

  if (value) {
    return (
      <div className="flex items-center gap-3 bg-white border border-[#d8e4f0] rounded-2xl p-3">
        {value.artwork ? (
          <img src={value.artwork} alt="" className="w-14 h-14 rounded-lg object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-[#e4ecf5] flex items-center justify-center"><Music2 className="text-[#4a6480]"/></div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[#062a4a] truncate">{value.title}</div>
          <div className="text-sm text-[#4a6480] truncate">{value.artist}{value.album ? ` · ${value.album}` : ''}</div>
        </div>
        <button
          type="button"
          onClick={() => { onChange(null); setQuery(''); }}
          className="p-2 text-[#4a6480] hover:text-[#062a4a]"
          aria-label="Andere plaat kiezen"
          data-testid="song-picker-clear"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6480]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek op titel of artiest…"
          required={required}
          data-testid="song-picker-input"
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#d8e4f0] focus:outline-none focus:border-[#2a5d99] transition-colors"
        />
        {searching && (
          <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6480] animate-spin" />
        )}
      </div>
      {results.length > 0 && (
        <ul className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-2xl border border-[#d8e4f0] shadow-xl max-h-80 overflow-auto" data-testid="song-picker-results">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => { onChange(r); setResults([]); setQuery(''); }}
                className="w-full text-left px-3 py-2 hover:bg-[#f0f4fa] flex items-center gap-3"
              >
                {r.artwork ? (
                  <img src={r.artwork} alt="" className="w-10 h-10 rounded object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded bg-[#e4ecf5]" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#062a4a] truncate">{r.title}</div>
                  <div className="text-xs text-[#4a6480] truncate">{r.artist}{r.album ? ` · ${r.album}` : ''}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ── Generic field renderer ────────────────────────────────────────────────
const Field = ({ field, value, onChange }) => {
  const commonInput =
    'w-full px-4 py-3 rounded-2xl bg-white border border-[#d8e4f0] focus:outline-none focus:border-[#2a5d99] transition-colors';
  if (field.type === 'textarea') {
    return (
      <textarea
        rows={4}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        data-testid={`field-${field.key}`}
        className={commonInput + ' resize-y'}
      />
    );
  }
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          data-testid={`field-${field.key}`}
          className="w-5 h-5 accent-[#2a5d99]"
        />
        <span className="text-[#062a4a]">{field.label}</span>
      </label>
    );
  }
  const type = field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text';
  return (
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
      data-testid={`field-${field.key}`}
      className={commonInput}
    />
  );
};

const PlaatPage = () => {
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [gotcha, setGotcha] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(FORM_URL);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        if (cancelled) return;
        setForm(data);
      } catch (e) {
        if (!cancelled) setError('Het formulier kan momenteel niet geladen worden. Probeer later opnieuw.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const setValue = (key) => (v) => setValues((prev) => ({ ...prev, [key]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form) return;
    setSubmitting(true);
    setError('');
    try {
      // Build payload: send picked song's id + display info for song_pick
      const payload = { ...values };
      form.fields.forEach((f) => {
        if (f.type === 'song_pick') {
          const s = values[f.key];
          payload[f.key] = s
            ? { id: s.id, title: s.title, artist: s.artist, album: s.album, artwork: s.artwork }
            : null;
        }
      });
      payload[form.honeypot_field || '_gotcha'] = gotcha;
      const r = await fetch(form.submit_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setDone(true);
    } catch (e) {
      setError('Er ging iets mis bij het versturen. Probeer opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Vraag je plaat aan" description="Vraag een plaat aan tijdens Levensloop Genk. 24 uur live vanuit het Atlas College." url="https://grk.fm/plaat" />
      <PageHeader title="Vraag je plaat aan" subtitle="Vraag een plaat aan voor iemand tijdens Levensloop Genk." />
      <section className="py-12 md:py-16 page-pad-bottom bg-white">
        <div className="max-w-2xl mx-auto px-6 lg:px-10">
          {loading && (
            <div className="text-center py-16 text-[#4a6480]"><Loader2 className="mx-auto animate-spin"/></div>
          )}
          {!loading && error && !form && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">{error}</div>
          )}
          {!loading && form && done && (
            <div className="bg-white border border-[#d8e4f0] rounded-3xl p-10 text-center" data-testid="request-song-success">
              <CheckCircle2 size={40} className="mx-auto text-[#2a5d99] mb-3" />
              <h3 className="text-[#062a4a] text-2xl font-black mb-2">Bedankt!</h3>
              <p className="text-[#4a6480]">Je aanvraag is binnen. We doen ons best om jouw plaat tijdens Levensloop Genk te draaien.</p>
            </div>
          )}
          {!loading && form && !done && (
            <form onSubmit={submit} className="space-y-6" data-testid="request-song-form">
              {form.fields.map((f) => (
                <div key={f.key}>
                  {f.type !== 'checkbox' && (
                    <label className="block mb-2 font-semibold text-[#062a4a]">
                      {f.label}
                      {f.required && <span className="text-[#2a5d99] ml-1">*</span>}
                    </label>
                  )}
                  {f.type === 'song_pick' ? (
                    <SongPicker
                      searchUrl={form.song_search_url}
                      value={values[f.key] || null}
                      onChange={setValue(f.key)}
                      required={f.required}
                    />
                  ) : (
                    <Field field={f} value={values[f.key]} onChange={setValue(f.key)} />
                  )}
                </div>
              ))}
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={gotcha}
                onChange={(e) => setGotcha(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">{error}</div>
              )}
              <button
                type="submit"
                disabled={submitting}
                data-testid="request-song-submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,#2a5d99,#4b8fcc)' }}
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                Verstuur aanvraag
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default PlaatPage;
