    const fromBase = document.getElementById('fromBase');
    const toBase = document.getElementById('toBase');
    const inputNumber = document.getElementById('inputNumber');
    const convertBtn = document.getElementById('convertBtn');
    const resultCard = document.getElementById('resultCard');
    const resultOutput = document.getElementById('resultOutput');

    // Populate base options (2–20)
    for (let i = 2; i <= 20; i++) {
      const opt1 = document.createElement('option');
      const opt2 = document.createElement('option');
      opt1.value = i; opt1.textContent = `Base ${i}`;
      opt2.value = i; opt2.textContent = `Base ${i}`;
      fromBase.appendChild(opt1);
      toBase.appendChild(opt2);
    }
    fromBase.value = 10;
    toBase.value = 2;

    function convertBase(numStr, from, to) {
      // Validate input for given base
      const validChars = "0123456789ABCDEFGHIJ".slice(0, from);
      const regex = new RegExp(`^[${validChars}]+$`, "i");
      if (!regex.test(numStr)) {
        throw new Error(`Invalid number for base ${from}`);
      }

      // Convert input to decimal
      let decimal = parseInt(numStr, from);
      if (isNaN(decimal)) throw new Error("Invalid input");

      // Convert decimal to target base
      return decimal.toString(to).toUpperCase();
    }

    convertBtn.addEventListener('click', () => {
      try {
        const numStr = inputNumber.value.trim();
        const from = parseInt(fromBase.value);
        const to = parseInt(toBase.value);

        if (!numStr) throw new Error("Please enter a number");

        const result = convertBase(numStr, from, to);
        resultOutput.textContent = `${numStr} (base ${from}) = ${result} (base ${to})`;
        resultCard.style.display = "block";
      } catch (err) {
        resultOutput.textContent = err.message;
        resultCard.style.display = "block";
      }
    });