export default function ResultView({ document: doc, onReset }) {
  const { documentType, fields = {} } = doc;

  return (
    <div className="view result-view">
      <h2>Scan result</h2>

      <dl className="fields">
        <dt>Document type</dt>
        <dd>{documentType || '—'}</dd>

        <dt>Date</dt>
        <dd>{fields.date || '—'}</dd>

        <dt>Vendor</dt>
        <dd>{fields.vendor || '—'}</dd>

        <dt>Total</dt>
        <dd>{fields.total !== null && fields.total !== undefined ? fields.total : '—'}</dd>
      </dl>

      <button onClick={onReset} className="primary-btn">
        Scan another document
      </button>
    </div>
  );
}
