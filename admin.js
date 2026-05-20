/* ═══════════ ADMIN-SPECIFIC STYLES ═══════════ */
:root {
  --bg: #0a0b10; --bg2: #12141d; --bg3: #1a1d2e;
  --card: #14172a; --card2: #1e2235; --border: #2a2d45; --border2: #3a3f62;
  --text: #e8eaf6; --text2: #9ea3c0; --text3: #6b72a0;
  --accent: #6c63ff; --accent2: #5a52e8; --accent3: #7c74ff;
  --green: #00e676; --red: #ff4444; --yellow: #ffd600; --orange: #ff9100;
  --shadow: 0 8px 32px rgba(0,0,0,.5); --radius: 16px; --transition: .2s ease;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
a { color: inherit; text-decoration: none; }
input, select, button, textarea { font-family: inherit; }
.hidden { display: none !important; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

/* ── Login Screen ── */
.login-screen {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at 20% 30%, rgba(108,99,255,.2) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 70%, rgba(255,107,157,.15) 0%, transparent 60%),
              var(--bg);
}
.login-card {
  background: var(--bg2); border: 1px solid var(--border2);
  border-radius: 24px; padding: 48px 40px; width: 420px;
  box-shadow: var(--shadow); animation: fadeUp .5s ease;
}
.login-logo { text-align: center; margin-bottom: 32px; }
.login-logo .l-icon { font-size: 48px; display: block; margin-bottom: 8px; }
.login-logo h1 { font-size: 24px; font-weight: 800; }
.login-logo p { font-size: 13px; color: var(--text3); margin-top: 4px; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; color: var(--text3); margin-bottom: 6px; }
.form-input, .form-select, .form-textarea {
  width: 100%; padding: 12px 16px; background: var(--bg3);
  border: 1.5px solid var(--border); border-radius: 10px;
  color: var(--text); font-size: 14px; outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--accent); box-shadow: 0 0 0 3px rgba(108,99,255,.2);
}
.form-select option { background: var(--bg3); }
.form-textarea { resize: vertical; min-height: 80px; }
.login-btn {
  width: 100%; padding: 14px; background: linear-gradient(135deg, var(--accent), #8b5cf6);
  color: #fff; border: none; border-radius: 10px; font-weight: 700;
  font-size: 15px; cursor: pointer; margin-top: 8px;
  transition: opacity var(--transition), transform var(--transition);
}
.login-btn:hover { opacity: .9; transform: translateY(-1px); }
.login-error { color: var(--red); font-size: 13px; margin-top: 10px; text-align: center; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

/* ── Admin Layout ── */
.admin-layout { display: flex; min-height: 100vh; }
.sidebar {
  width: 240px; flex-shrink: 0; background: var(--bg2);
  border-right: 1px solid var(--border); display: flex; flex-direction: column;
  padding: 24px 0; position: sticky; top: 0; height: 100vh; overflow-y: auto;
}
.sidebar-logo { padding: 0 20px 24px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
.sidebar-logo .sl-icon { font-size: 24px; }
.sidebar-logo .sl-text { font-size: 16px; font-weight: 800; }
.sidebar-logo .sl-sub { font-size: 11px; color: var(--text3); margin-top: 2px; }
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 20px; font-size: 13px; font-weight: 500; color: var(--text2);
  cursor: pointer; transition: all var(--transition); border-left: 3px solid transparent;
}
.nav-item:hover { background: var(--bg3); color: var(--text); }
.nav-item.active { background: rgba(108,99,255,.15); color: var(--accent3); border-left-color: var(--accent); }
.nav-item .ni-icon { font-size: 16px; width: 20px; text-align: center; }
.nav-sep { height: 1px; background: var(--border); margin: 12px 20px; }
.sidebar-footer { margin-top: auto; padding: 16px 20px; }
.logout-btn {
  width: 100%; padding: 10px; background: rgba(255,68,68,.15);
  border: 1px solid rgba(255,68,68,.3); color: var(--red); border-radius: 8px;
  cursor: pointer; font-size: 13px; font-weight: 600; transition: all var(--transition);
}
.logout-btn:hover { background: rgba(255,68,68,.25); }

/* ── Admin Content ── */
.admin-content { flex: 1; overflow-y: auto; }
.admin-topbar {
  background: rgba(18,20,29,.95); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border); padding: 0 28px;
  height: 60px; display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
}
.at-title { font-size: 16px; font-weight: 700; }
.at-user { font-size: 13px; color: var(--text2); display: flex; align-items: center; gap: 8px; }
.at-avatar { width: 32px; height: 32px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
.admin-page { padding: 28px; display: none; }
.admin-page.active { display: block; }

/* ── Stats Cards ── */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 16px; margin-bottom: 28px; }
.stat-card {
  background: var(--card2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 20px;
  transition: transform var(--transition);
}
.stat-card:hover { transform: translateY(-3px); }
.stat-icon { font-size: 28px; margin-bottom: 8px; }
.stat-val { font-size: 28px; font-weight: 800; }
.stat-label { font-size: 12px; color: var(--text3); margin-top: 4px; text-transform: uppercase; letter-spacing: .5px; }

/* ── Admin Tables ── */
.admin-table-wrap { background: var(--card2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.table-header { padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
.table-header h3 { font-size: 15px; font-weight: 700; }
.search-tbl { padding: 8px 14px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 13px; outline: none; width: 220px; }
.search-tbl:focus { border-color: var(--accent); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); font-size: 13px; }
.data-table th { background: var(--bg3); font-weight: 600; color: var(--text2); font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
.data-table td { color: var(--text2); }
.data-table tbody tr:hover { background: rgba(255,255,255,.03); }
.data-table .badge-sm { padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
.tbl-btn { padding: 5px 12px; border-radius: 6px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; transition: all var(--transition); }
.tbl-btn-edit { background: rgba(108,99,255,.2); color: var(--accent3); }
.tbl-btn-edit:hover { background: rgba(108,99,255,.35); }
.tbl-btn-del { background: rgba(255,68,68,.2); color: var(--red); }
.tbl-btn-del:hover { background: rgba(255,68,68,.35); }
.tbl-actions { display: flex; gap: 6px; }
.paginator { display: flex; align-items: center; gap: 10px; padding: 12px 20px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text2); }
.page-btn { padding: 5px 10px; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--text2); font-size: 12px; }
.page-btn:hover, .page-btn.active { border-color: var(--accent); color: var(--accent3); }

/* ── Add Form Card ── */
.form-card { background: var(--card2); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
.form-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-row.three { grid-template-columns: 1fr 1fr 1fr; }
.submit-btn {
  padding: 12px 28px; background: linear-gradient(135deg, var(--accent), #8b5cf6);
  color: #fff; border: none; border-radius: 10px; font-weight: 700;
  font-size: 14px; cursor: pointer; transition: opacity var(--transition);
}
.submit-btn:hover { opacity: .9; }
.cancel-btn { padding: 12px 20px; background: var(--bg3); border: 1px solid var(--border); color: var(--text2); border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; margin-left: 10px; }
.form-hint { font-size: 11px; color: var(--text3); margin-top: 4px; }
.form-btns { display: flex; align-items: center; margin-top: 20px; }
.section-title { font-size: 19px; font-weight: 700; margin-bottom: 20px; }

/* ── Bulk Upload ── */
.upload-zone {
  border: 2px dashed var(--border2); border-radius: var(--radius); padding: 48px;
  text-align: center; cursor: pointer; transition: all var(--transition);
}
.upload-zone:hover { border-color: var(--accent); background: rgba(108,99,255,.05); }
.upload-icon { font-size: 48px; margin-bottom: 12px; }
.upload-zone h3 { font-size: 16px; margin-bottom: 6px; }
.upload-zone p { font-size: 13px; color: var(--text3); }
.upload-preview { background: var(--bg3); border-radius: 10px; padding: 16px; margin-top: 16px; font-size: 13px; color: var(--text2); max-height: 200px; overflow-y: auto; white-space: pre-wrap; font-family: monospace; }

/* ── Toast ── */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--card2); border: 1px solid var(--border2); color: var(--text); padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 500; z-index: 9999; box-shadow: var(--shadow); }

@media(max-width:768px) {
  .admin-layout { flex-direction: column; }
  .sidebar { width: 100%; height: auto; position: static; flex-direction: row; flex-wrap: wrap; padding: 12px; }
  .sidebar-footer { display: none; }
  .form-row { grid-template-columns: 1fr; }
  .form-row.three { grid-template-columns: 1fr; }
}
