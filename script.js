// ⚙️ Демонстраційна реалізація алгоритму Ель-Гамаля на еліптичній кривій
// (спрощена версія, лише для розуміння логіки)

function randomBigInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandom() {
  document.getElementById('p').value = randomBigInt(500, 2000);
  document.getElementById('a').value = randomBigInt(-10, 10);
  document.getElementById('b').value = randomBigInt(10, 200);
  document.getElementById('gx').value = randomBigInt(1, 50);
  document.getElementById('gy').value = randomBigInt(50, 400);
  document.getElementById('q').value = randomBigInt(100, 999);
  document.getElementById('kb').value = randomBigInt(2, 50);
  document.getElementById('r').value = randomBigInt(2, 100);
}

function generatePublicKey() {
  const gx = parseInt(document.getElementById('gx').value);
  const gy = parseInt(document.getElementById('gy').value);
  const kb = parseInt(document.getElementById('kb').value);

  if (isNaN(gx) || isNaN(gy) || isNaN(kb)) {
    alert("Заповни Gx, Gy і kB!");
    return;
  }

  const ybx = gx * kb;
  const yby = gy * kb;
  const yb = `(${ybx}, ${yby})`;
  document.getElementById('yb').value = yb;
  showOutput(`🔐 Відкритий ключ отримувача YB = ${yb}`);
}

function encrypt() {
  const m = parseInt(document.getElementById('m').value);
  const r = parseInt(document.getElementById('r').value);
  const kb = parseInt(document.getElementById('kb').value);
  const gx = parseInt(document.getElementById('gx').value);
  const gy = parseInt(document.getElementById('gy').value);
  const p = parseInt(document.getElementById('p').value);

  if ([m, r, kb, gx, gy, p].some(isNaN)) {
    alert("Заповни всі необхідні поля!");
    return;
  }

  // Симуляція (не справжня еліптична арифметика)
  const Rx = (r * gx) % p;
  const Ry = (r * gy) % p;
  const Px = (r * gx * kb) % p;
  const C = (m * Px) % p;

  sessionStorage.setItem("Rx", Rx);
  sessionStorage.setItem("Ry", Ry);
  sessionStorage.setItem("C", C);
  sessionStorage.setItem("p", p);
  sessionStorage.setItem("kb", kb);

  const result = `
  <div class="steps-list">
    <div>1️⃣ R = r × G = (${Rx}, ${Ry})</div>
    <div>2️⃣ P = r × YB = (${Px}, ?)</div>
    <div>3️⃣ C = (M × xₚ) mod p = (${m} × ${Px}) mod ${p} = <span class="result-val">${C}</span></div>
  </div>
  <div class="result-val">📦 Шифротекст: R = (${Rx}, ${Ry}), C = ${C}</div>
  `;

  showOutput(result);
}

// === РОЗШИФРУВАННЯ ===
function decrypt() {
  const kb = parseInt(document.getElementById('kbDec').value);
  const p = parseInt(document.getElementById('pDec').value);
  const Rx = parseInt(document.getElementById('rxDec').value);
  const C = parseInt(document.getElementById('cDec').value);

  if ([kb, p, Rx, C].some(isNaN)) {
    alert("Заповни всі поля для розшифрування!");
    return;
  }

  // Обчислення Q = kB × R (імітація)
  const Qx = (kb * Rx) % p;
  // M = C × (Qx⁻¹ mod p)
  const inv = modInverse(Qx, p);
  const M = (C * inv) % p;

  const html = `
    <div class="steps-list">
      <div>1️⃣ Q = kB × R = (${Qx}, ?)</div>
      <div>2️⃣ M = C × (x_Q⁻¹ mod p) = (${C} × ${inv}) mod ${p}</div>
      <div class="result-val">🔓 Відновлене повідомлення M = ${M}</div>
    </div>
  `;
  document.getElementById('outputDec').innerHTML = html;
}

// Модульне обернене (extended Euclid)
function modInverse(a, m) {
  let m0 = m, t, q;
  let x0 = 0, x1 = 1;
  if (m === 1) return 0;
  while (a > 1) {
    q = Math.floor(a / m);
    t = m;
    m = a % m;
    a = t;
    t = x0;
    x0 = x1 - q * x0;
    x1 = t;
  }
  if (x1 < 0) x1 += m0;
  return x1;
}

function showOutput(html) {
  document.getElementById('output').innerHTML = html;
}
