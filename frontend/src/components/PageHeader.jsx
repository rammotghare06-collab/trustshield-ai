export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {eyebrow && <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>}
      <h1 style={{ fontSize: 30, marginBottom: description ? 8 : 0 }}>{title}</h1>
      {description && <p className="text-lo" style={{ fontSize: 15, maxWidth: 640, lineHeight: 1.55 }}>{description}</p>}
    </div>
  );
}
