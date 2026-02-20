// CONFIG
const ADMIN_PASS = "tet2026";
const KEY_CODES = "lixi_codes_tet2026";
const KEY_USED  = "lixi_used_tet2026";
const KEY_USED_MONEY = "lixi_used_money_tet2026";
const KEY_ADMIN = "lixi_admin_tet";

let codes = JSON.parse(localStorage.getItem(KEY_CODES)) || {};
let used  = new Set(JSON.parse(localStorage.getItem(KEY_USED)) || []);
let usedMoney = JSON.parse(localStorage.getItem(KEY_USED_MONEY)) || {};

// Loader finishes after 4s, then show content
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
    document.body.classList.remove('content-hidden');
  }, 4000); // 4000ms = 4s (matching loading animation)
});

function createPetal() {
  const petal = document.createElement("div");
  petal.className = "petal";
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.animationDuration = (Math.random() * 8 + 10) + "s";
  petal.style.opacity = Math.random() * 0.6 + 0.4;
  petal.style.transform = `rotate(${Math.random()*360}deg)`;
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 18000);
}
setInterval(createPetal, 500);

// Admin Functions
function loginAdmin() {
  if (document.getElementById("admin-pass").value.trim() === ADMIN_PASS) {
    localStorage.setItem(KEY_ADMIN, "1");
    document.getElementById("admin-login").style.display = "none";
    document.getElementById("admin-section").style.display = "block";
    renderCodes();
  } else {
    alert("Mật khẩu sai rồi nha!");
  }
}

function logoutAdmin() {
  localStorage.removeItem(KEY_ADMIN);
  location.reload();
}

function createCode() {
  let code = document.getElementById("newcode").value.trim().toUpperCase();
  if (!code) code = "TET" + Math.random().toString(36).substring(2,8).toUpperCase();
  if (codes[code]) return alert("Mã này đã có rồi!");

  codes[code] = true;
  localStorage.setItem(KEY_CODES, JSON.stringify(codes));
  document.getElementById("newcode").value = "";
  renderCodes();
  alert(`Tạo thành công: ${code}`);
}

function renderCodes() {
  const el = document.getElementById("codes-list");
  el.innerHTML = "";
  let totalMoney = 0;
  Object.keys(codes).forEach((k) => {
    let mark = "";
    if (used.has(k)) {
      const amount = usedMoney[k] || 0;
      totalMoney += amount;
      mark = ` <span style='color:#fda4af'>(đã dùng: ${amount.toLocaleString()} VNĐ)</span>`;
    } else {
      mark = " <span style='color:#bbf7d0'>(chưa dùng)</span>";
    }
    const deleteBtn = `<button onclick="deleteCode('${k}')" style="background:#e11d48; color:white; padding:5px 12px; font-size:0.9em; margin:0 5px;">Xóa</button>`;
    el.innerHTML += `<div style="padding:8px 0;border-bottom:1px dashed #666;display:flex;justify-content:space-between;align-items:center;">${k}${mark}${deleteBtn}</div>`;
  });
  if (!Object.keys(codes).length) el.innerHTML = "<em>Chưa có mã nào...</em>";
  
  // Show total money stats
  const statsEl = document.getElementById("admin-stats");
  if (statsEl) {
    statsEl.innerHTML = `<div style="color:#fbbf24;font-weight:bold;margin:10px 0;font-size:1.1em;">📊 Tổng đã phân phối: ${totalMoney.toLocaleString()} VNĐ</div>`;
  }
}

function deleteCode(code) {
  if (confirm(`Bạn chắc chắn muốn xóa mã ${code}?`)) {
    delete codes[code];
    used.delete(code);
    delete usedMoney[code];
    localStorage.setItem(KEY_CODES, JSON.stringify(codes));
    localStorage.setItem(KEY_USED, JSON.stringify([...used]));
    localStorage.setItem(KEY_USED_MONEY, JSON.stringify(usedMoney));
    renderCodes();
    alert(`Đã xóa mã: ${code}`);
  }
}

// Member Functions
function checkAndShowEnvelope() {
  const code = document.getElementById("code").value.trim().toUpperCase();
  const result = document.getElementById("result");
  const envelope = document.getElementById("envelope");

  result.innerHTML = "";
  envelope.style.display = "none";

  if (!code) return alert("Nhập mã lì xì đi bạn ơi!");
  if (used.has(code)) {
    result.innerHTML = "Mã này đã được bốc rồi nha!";
    result.style.color = "#fda4af";
    return;
  }
  if (!codes[code]) {
    result.innerHTML = "Mã không đúng rồi...";
    result.style.color = "#fda4af";
    return;
  }

  drawRandomLixi(code);
}

function openLixi() {
  const code = document.getElementById("code").value.trim().toUpperCase();
  if (!code) return;
  if (used.has(code)) return;
  if (!codes[code]) return;
  drawRandomLixi(code);
}

function drawRandomLixi(code) {
  const result = document.getElementById("result");
  const envelope = document.getElementById("envelope");
  envelope.style.display = "none";
  result.innerHTML = "Đang rút lì xì...";
  result.style.color = "#fbbf24";

  const choices = [5000, 10000, 20000, 50000];
  const weights = [0.50, 0.30, 0.15, 0.05];

  setTimeout(() => {
    const r = Math.random();
    let cum = 0;
    let chosen = choices[0];
    for (let i = 0; i < choices.length; i++) {
      cum += weights[i];
      if (r <= cum) { chosen = choices[i]; break; }
    }

    result.innerHTML = chosen.toLocaleString() + " VNĐ";
    result.classList.add('success-pulse');
    launchConfetti();

    used.add(code);
    usedMoney[code] = chosen;
    localStorage.setItem(KEY_USED, JSON.stringify([...used]));
    localStorage.setItem(KEY_USED_MONEY, JSON.stringify(usedMoney));
    renderCodes();
  }, 900);
}

function launchConfetti() {
  const colors = ['red', 'gold', 'yellow'];
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.className = `confetti ${colors[Math.floor(Math.random() * colors.length)]}`;
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

// Init on page load
if (localStorage.getItem(KEY_ADMIN) === "1") {
  document.getElementById("admin-login").style.display = "none";
  document.getElementById("admin-section").style.display = "block";
  renderCodes();
}
