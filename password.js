// Utility Functions
const arrayFromLowToHigh = (low, high) => {
  const array = [];
  for (let i = low; i <= high; i++) {
    array.push(i);
  }
  return array;
};

const UPPERCASE_CHAR_CODES = arrayFromLowToHigh(65, 90);
const LOWERCASE_CHAR_CODES = arrayFromLowToHigh(97, 122);
const NUMBER_CHAR_CODES = arrayFromLowToHigh(48, 57);
const SYMBOLS_CHAR_CODES = [
  ...arrayFromLowToHigh(33, 47),
  ...arrayFromLowToHigh(58, 64),
  ...arrayFromLowToHigh(91, 96),
  ...arrayFromLowToHigh(123, 126),
];

// Class Definition
class PasswordGenerator {
  constructor() {
    this.characterRange = document.getElementById("inputSlider");
    this.characterNumber = document.getElementById("sliderValue");
    this.passwordDisplay = document.getElementById("passBox");
    this.copyIcon = document.getElementById("copyIcon");
    this.genBtn = document.getElementById("genBtn");
    this.lowerCaseElement = document.getElementById("lowercase");
    this.upperCaseElement = document.getElementById("uppercase");
    this.numbersElement = document.getElementById("numbers");
    this.symbolsElement = document.getElementById("symbols");

    this.addEventListeners();
  }

  addEventListeners() {
    this.characterNumber.addEventListener("input", this.syncCharacterAmount);
    this.characterRange.addEventListener("input", this.syncCharacterAmount);

    document
      .getElementById("passwordGenerator")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const password = this.generatePassword(
          +this.characterNumber.value,
          this.lowerCaseElement.checked,
          this.upperCaseElement.checked,
          this.numbersElement.checked,
          this.symbolsElement.checked
        );
        this.displayPassword(password);
      });

    this.copyIcon.addEventListener("click", () => this.copyPassword());
  }

  syncCharacterAmount = (e) => {
    const value = e.target.value;
    this.characterNumber.value = value;
    this.characterRange.value = value;
  };

  generatePassword(
    charAmount,
    lowerCase,
    upperCase,
    includeNumbers,
    includeSymbols
  ) {
    let charCodes = [];
    if (lowerCase) charCodes = [...charCodes, ...LOWERCASE_CHAR_CODES];
    if (upperCase) charCodes = [...charCodes, ...UPPERCASE_CHAR_CODES];
    if (includeNumbers) charCodes = [...charCodes, ...NUMBER_CHAR_CODES];
    if (includeSymbols) charCodes = [...charCodes, ...SYMBOLS_CHAR_CODES];

    const passwordCharacters = Array.from({ length: charAmount }, () => {
      const characterCode =
        charCodes[Math.floor(Math.random() * charCodes.length)];
      return String.fromCharCode(characterCode);
    });

    const password = passwordCharacters.join("");
    this.checkPasswordStrength(password);
    return password;
  }

  displayPassword(password) {
    this.passwordDisplay.value = password;
    this.passwordDisplay.style.color = "lightgray";
    this.passwordDisplay.style.fontSize = "24px";

    this.genBtn.innerHTML = `
      Generate Password 
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
        <path fill="#24232C" d="m5.106 12 6-6-6-6-1.265 1.265 3.841 3.84H.001v1.79h7.681l-3.841 3.84z"/>
      </svg>`;
  }

  copyPassword() {
    navigator.clipboard.writeText(this.passwordDisplay.value).then(() => {
      this.passwordDisplay.value = "Copied!";
      this.passwordDisplay.style.color = "var(--button-color)";
      this.passwordDisplay.style.fontSize = "24px";
      setTimeout(
        () =>
          this.displayPassword(
            this.generatePassword(
              +this.characterNumber.value,
              this.lowerCaseElement.checked,
              this.upperCaseElement.checked,
              this.numbersElement.checked,
              this.symbolsElement.checked
            )
          ),
        1000
      );
    });
  }

  checkPasswordStrength(password) {
    const strength = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[!@#\$%\^\&*\)\(+=._-]+/.test(password),
      password.length >= 8,
    ].reduce((acc, curr) => acc + curr, 0);

    this.updateStrengthBars(strength);
  }

  updateStrengthBars(strength) {
    const strengthBars = document.querySelectorAll(".strength-bar");
    const strengthText = document.querySelector(".mdm-txt");

    strengthBars.forEach((bar, index) => {
      bar.classList.remove("weak", "medium", "strong", "filled");
      if (index < strength) {
        bar.classList.add("filled");
        if (strength <= 2) bar.classList.add("weak");
        else if (strength === 3) bar.classList.add("medium");
        else bar.classList.add("strong");
      }
    });

    const strengthLabels = ["TOO WEAK!", "WEAK", "MEDIUM", "STRONG"];
    strengthText.textContent = strengthLabels[strength - 1] || "";
  }
}

// Instantiate PasswordGenerator
document.addEventListener("DOMContentLoaded", () => new PasswordGenerator());
