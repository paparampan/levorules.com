// Channel and group as two doors with different jobs: the author's lab and
// the practitioners' workshop. Tags are the channel's most used hashtags,
// topics are the group's real sections.
const CHANNEL_TAGS = ['#колесогода', '#руны', '#сигилы', '#кино', '#эгрегоры', '#книги', '#дайджест'];
const GROUP_TOPICS = ['Болталка', 'Сервиторы', 'Сигилы', 'Медитации', 'Наши кейсы', 'Юмор', 'Потом прочитаю', 'Древние'];

function CommunityDoors() {
  const doors = [
    {
      n: '01', kind: 'канал', title: 'ЛАБОРАТОРИЯ АВТОРА', accent: 'var(--blood-text)',
      text: 'Разборы, практики и эксперименты, в том числе провальные. Чуть больше практик и мыслей.',
      topics: CHANNEL_TAGS, topicsLabel: 'Рубрики канала', tags: true,
      href: 'https://telegram.me/levorules', cta: 'Читать канал ↗',
    },
    {
      n: '02', kind: 'группа', title: 'ЦЕХ ПРАКТИКОВ', accent: 'var(--cyber-cyan)',
      text: 'Здесь говорят о магии с теми, кто тоже в теме. Приноси своё, задавай вопросы, делись опытом, хорошим и плохим.',
      topics: GROUP_TOPICS, topicsLabel: 'Разделы группы', note: 'Градус посвящения на входе никто не проверяет.',
      href: 'https://t.me/+iQufDN8b0kZhY2Ni', cta: 'Зайти в группу ↗',
    },
  ];
  return (
    <section id="community" data-lr-reveal="section" style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
        <SectionTitle eyebrow="сообщество" title="КАНАЛ И ГРУППА" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {doors.map((d) => (
            <a key={d.n} href={d.href} target="_blank" rel="noopener" className="lr-reactive-card" style={{
              '--lr-interaction-accent': d.accent,
              display: 'flex', flexDirection: 'column', gap: 16, padding: 32,
              border: '1px solid var(--border)', background: 'var(--ash)', color: 'inherit', textDecoration: 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: d.accent, textTransform: 'uppercase' }}>
                ▸ {d.n} · {d.kind}
              </div>
              <h3 style={{ margin: 0, fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1 }}>{d.title}</h3>
              <p style={{ margin: 0, color: 'var(--bone-dim)', lineHeight: 1.55 }}>{d.text}</p>
              {d.topics && (
                <ul aria-label={d.topicsLabel} style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {d.topics.map((t) => (
                    <li key={t} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: d.tags ? 'none' : 'uppercase',
                      padding: '5px 9px', border: '1px solid var(--border-strong)', color: 'var(--bone)',
                    }}>{t}</li>
                  ))}
                </ul>
              )}
              {d.note && <p style={{ margin: 0, color: 'var(--bone)', lineHeight: 1.55 }}>{d.note}</p>}
              <span style={{
                marginTop: 'auto', paddingTop: 8, fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 16, letterSpacing: '0.04em', textTransform: 'uppercase', color: d.accent,
              }}>{d.cta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { CommunityDoors });
