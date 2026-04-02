// Admin Dashboard — list all bookings from Firestore

document.addEventListener('DOMContentLoaded', () => {
    loadSubscriptions();
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) refreshBtn.addEventListener('click', loadSubscriptions);
});

async function loadSubscriptions() {
    const tableBody = document.getElementById('bookings-tbody');
    const noDataDiv = document.getElementById('no-data');
    if (!tableBody || typeof db === 'undefined') return;

    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.textContent = 'Loading…';
    }

    try {
        let rows = [];
        
        try {
            const snapshot = await db.collection('bookings').get();
            rows = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (fbErr) {}

        // Merge with local storage fallback data
        try {
            const localData = JSON.parse(localStorage.getItem('mealflow_bookings') || '[]');
            rows = [...rows, ...localData];
        } catch(e) {}

        rows.sort((a, b) => {
            const ta = new Date(a.createdAt || 0).getTime();
            const tb = new Date(b.createdAt || 0).getTime();
            return tb - ta;
        });

        tableBody.innerHTML = '';

        if (rows.length === 0) {
            noDataDiv.style.display = 'block';
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.textContent = 'Refresh List';
            }
            return;
        }

        noDataDiv.style.display = 'none';

        rows.forEach((data) => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--slate-100)';
            const statusLabel = data.status || 'Active';
            const statusStyle = getStatusStyle(statusLabel);
            row.innerHTML = `
                <td style="padding: 1.5rem; font-weight: 600; color: var(--slate-800); font-family: var(--font-heading);">${escapeHtml(data.userName || '—')}</td>
                <td style="padding: 1.5rem;">
                    <span style="padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: white; background: ${getPlanColor(data.plan)};">
                        ${escapeHtml(data.plan || '—')}
                    </span>
                </td>
                <td style="padding: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${statusStyle.dot};"></span>
                        <span style="font-weight: 600; color: ${statusStyle.text}; font-size: 0.75rem; text-transform: uppercase;">${escapeHtml(statusLabel)}</span>
                    </div>
                </td>
                <td style="padding: 1.5rem; color: var(--slate-500); font-size: 0.875rem;">${escapeHtml(data.phone || '—')}</td>
                <td style="padding: 1.5rem; color: var(--slate-600); font-size: 0.875rem;">${formatDate(data.startDate)}</td>
                <td style="padding: 1.5rem; color: var(--slate-800); font-weight: 600;">${formatPrice(data.totalPrice)}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading subscriptions:', error);
        tableBody.innerHTML = `<tr><td colspan="6" style="padding: 3rem; text-align: center; color: var(--error);">Failed to load subscriptions. Check the browser console and Firestore rules.</td></tr>`;
        noDataDiv.style.display = 'none';
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.textContent = 'Refresh List';
        }
    }
}

function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getPlanColor(plan) {
    if (plan === 'Basic Plan') return 'var(--slate-500)';
    if (plan === 'Healthy Plan') return 'var(--primary)';
    if (plan === 'Choice Plan') return 'var(--accent)';
    return 'var(--slate-400)';
}

function getStatusStyle(status) {
    const s = (status || '').toLowerCase();
    if (s === 'active') return { dot: 'var(--success)', text: 'var(--success)' };
    if (s === 'cancelled' || s === 'canceled') return { dot: 'var(--error)', text: 'var(--error)' };
    if (s === 'pending') return { dot: 'var(--warning)', text: 'var(--warning)' };
    return { dot: 'var(--slate-400)', text: 'var(--slate-600)' };
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return escapeHtml(String(dateStr));
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatPrice(n) {
    if (n == null || n === '') return '—';
    const num = Number(n);
    if (Number.isNaN(num)) return escapeHtml(String(n));
    return '₹' + num.toLocaleString('en-IN');
}
