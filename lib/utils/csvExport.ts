// ==============================================================================
// SAMA CST — UTILITAIRE D'EXPORT CSV UNIVERSEL (UTF-8 BOM COMPATIBLE EXCEL)
// ==============================================================================

export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  headers: { key: keyof T | string; label: string }[],
  data: T[]
) {
  if (!data || data.length === 0) {
    alert('Aucune donnée à exporter.');
    return;
  }

  const csvRows: string[] = [];

  // En-têtes
  const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(';');
  csvRows.push(headerRow);

  // Lignes de données
  data.forEach((row) => {
    const values = headers.map((h) => {
      const val = row[h.key];
      if (val === undefined || val === null) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(';'));
  });

  // UTF-8 BOM (\uFEFF) pour compatibilité totale avec Microsoft Excel
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
