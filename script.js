const genInput = document.getElementById('gen');
const a1Input = document.getElementById('a1');
const a2Input = document.getElementById('a2');
const a3Input = document.getElementById('a3');
const slider = document.getElementById('level-slider');
const levelDisplay = document.getElementById('level-display');
const resultOutput = document.getElementById('result');
const probeOutput = document.getElementById('probe');
const approxMsg = document.getElementById('approx-msg');

function updateAll() {
  const gen = parseFloat(genInput.value);
  const a1 = parseFloat(a1Input.value);
  const a2 = parseFloat(a2Input.value);
  const a3 = parseFloat(a3Input.value);
  const attenuation = a1 + a2 + a3;
  const output = gen - attenuation;
  const precision = Math.sqrt(0.01**2 + 0.03**2 + 0.05**2 + 0.05**2).toFixed(2);
  const probe = output - 0.5;

  resultOutput.textContent = `${output.toFixed(2)} dBm`;
  levelDisplay.textContent = `${output.toFixed(2)} dBm ±${precision} dB`;
  probeOutput.textContent = `${probe.toFixed(2)} dBm`;

  slider.value = output;
  approxMsg.textContent = '';
}

function updateFromSlider() {
  const target = parseFloat(slider.value);
  gen = parseFloat(genInput.value);

  let best = { a1: 0, a2: 0, a3: 0, diff: Infinity };

  for (let a1 = 0; a1 <= 10; a1 += 0.1) {
    for (let a2 = 0; a2 <= 20; a2 += 0.25) {
      for (let a3 = 0; a3 <= 30; a3 += 1) {
        let totalAtt = a1 + a2 + a3;
        let output = gen - totalAtt;
        let diff = Math.abs(output - target);
        if (diff < best.diff) {
          best = { a1, a2, a3, diff };
        }
      }
    }
  }

  a1Input.value = best.a1.toFixed(1);
  a2Input.value = best.a2.toFixed(2);
  a3Input.value = best.a3.toFixed(0);
  resultOutput.textContent = `${(gen - (best.a1 + best.a2 + best.a3)).toFixed(2)} dBm`;
  levelDisplay.textContent = `${slider.value} dBm ±0.08 dB`;

  approxMsg.textContent = best.diff > 0.05 ? 
    `⚠️ Valore target impossibile esatto, trovato valore più vicino: ${(gen - (best.a1 + best.a2 + best.a3)).toFixed(2)} dBm` : '';
}

[genInput, a1Input, a2Input, a3Input].forEach(el => el.addEventListener('input', updateAll));
slider.addEventListener('input', updateFromSlider);

updateAll();
