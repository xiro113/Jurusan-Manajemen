/**
 * UI Utilities - Modals, Toast Alerts, CSV Export, Print Handler
 * Jurusan Manajemen FEB UTM
 */

export const UI = {
  // Toast Alert Notification
  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColors = {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#0284C7'
    };

    toast.style.cssText = `
      background: ${bgColors[type] || '#0F2942'};
      color: #FFFFFF;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      animation: fadeIn 0.3s ease-out;
    `;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Export Data Table to CSV (Excel compatible)
  exportToCSV(filename, headers, rows) {
    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
    csvContent += headers.join(",") + "\n";

    rows.forEach(row => {
      const formattedRow = row.map(field => {
        const stringField = String(field || '').replace(/"/g, '""');
        return `"${stringField}"`;
      });
      csvContent += formattedRow.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Print Document or Leadership Attendance Report
  printReport(title, headers, rows) {
    const printWindow = window.open('', '_blank');
    const tableHeaders = headers.map(h => `<th style="border: 1px solid #ddd; padding: 10px; background: #0F2942; color: #fff;">${h}</th>`).join('');
    const tableRows = rows.map(r => `<tr>${r.map(c => `<td style="border: 1px solid #ddd; padding: 10px;">${c}</td>`).join('')}</tr>`).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - FEB UTM</title>
        <style>
          body { font-family: 'Arial', sans-serif; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px double #000; padding-bottom: 15px; }
          .header h2 { margin: 0; color: #0F2942; text-transform: uppercase; }
          .header p { margin: 5px 0 0 0; color: #555; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          .footer { margin-top: 40px; float: right; text-align: center; }
          .footer p { margin-bottom: 70px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>UNIVERSITAS TRUNODJOYO MADURA</h2>
          <h3>FAKULTAS EKONOMI DAN BISNIS - JURUSAN MANAJEMEN</h3>
          <p>Jl. Raya Telang, PO BOX 2 Kamal - Bangkalan, Jawa Timur | Telp: (031) 3011146</p>
          <hr style="margin-top: 15px;">
          <h4 style="margin-top: 15px; text-decoration: underline;">${title.toUpperCase()}</h4>
        </div>
        <table>
          <thead><tr>${tableHeaders}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div class="footer">
          <p>Bangkalan, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>Ketua Jurusan Manajemen,</p>
          <strong>Dr. A. Yahya Surya Winata, S.E., M.Si.</strong><br>
          <span>NIP. 196904031995121001</span>
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  },

  // Status Badge HTML Generator
  getStatusBadgeHTML(status) {
    const map = {
      'Diterima': 'badge-received',
      'Sedang Diproses': 'badge-processing',
      'Perlu Revisi': 'badge-revision',
      'Selesai/Disetujui': 'badge-approved',
      'Disetujui': 'badge-approved',
      'Ditolak': 'badge-rejected',
      'Menunggu Verifikasi': 'badge-processing',
      'Hadir': 'badge-approved',
      'Izin': 'badge-revision',
      'Sakit': 'badge-received',
      'Alpa': 'badge-rejected'
    };
    const cls = map[status] || 'badge-processing';
    return `<span class="badge-status ${cls}">${status}</span>`;
  },

  // Initialize Smooth Scroll Reveal Animations
  initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const selectors = [
      '.section-header',
      '.stat-card',
      '.prodi-card',
      '.coordinator-card',
      '.coordinator-box',
      '.metric-card',
      '.table-container',
      '.dosen-card',
      '.news-card',
      '.chart-card'
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    setTimeout(() => {
      const elements = document.querySelectorAll(selectors.join(','));
      elements.forEach(el => {
        if (!el.classList.contains('revealed')) {
          el.classList.add('reveal-element');
          observer.observe(el);
        }
      });
    }, 50);
  }
};
