export class HintManager {
    constructor(hintButtonId, hintPopupId, word) {
        // شناسایی عناصر از DOM
        this.hintButton = document.getElementById(hintButtonId);
        this.hintPopup = document.getElementById(hintPopupId);
        this.word = word;

        // تنظیم رویدادها
        this.addEventListeners();
    }

    addEventListeners() {
        // رویداد کلیک دکمه "Hint"
        this.hintButton.addEventListener('click', () => {
            this.displayHint();
        });

        // رویداد کلیک دکمه بستن داخل پاپ‌آپ
        const closeButton = this.hintPopup.querySelector(".close");
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hidePopup(); // مخفی کردن پاپ‌آپ
            });
        }
    }

    displayHint() {
        // اطمینان از فعال بودن دکمه
        if (this.hintButton.disabled) return;

        // غیرفعال کردن دکمه راهنما
        this.hintButton.disabled = true;

        // تبدیل کلمه به آرایه‌ای از حروف
        const charArray = this.word.toUpperCase().split("");
        const dashes = document.querySelectorAll(".dashes");
        const unfilledIndices = [];

        // پیدا کردن خطوط خالی (هنوز پر نشده‌اند)
        charArray.forEach((char, index) => {
            if (dashes[index].innerText === "_") {
                unfilledIndices.push(index);
            }
        });

        if (unfilledIndices.length > 0) {
            // پر کردن یک خط خالی به صورت تصادفی
            const randomIndex = unfilledIndices[Math.floor(Math.random() * unfilledIndices.length)];
            dashes[randomIndex].innerText = charArray[randomIndex];

            // به‌روزرسانی متن پاپ‌آپ و نمایش آن
            this.updatePopupMessage(`I filled one of the letters for you: "${charArray[randomIndex]}"`);
            this.showPopup();
        } else {
            console.warn("No dashes left to fill.");
        }
    }

    updatePopupMessage(message) {
        // به‌روزرسانی متن داخل پاپ‌آپ
        const hintText = this.hintPopup.querySelector("p");
        if (hintText) {
            hintText.innerText = message;
        }
    }

    showPopup() {
        // نمایش پاپ‌آپ
        this.hintPopup.style.display = "block";

        // پنهان کردن پاپ‌آپ بعد از 1 ثانیه
        setTimeout(() => {
            this.hidePopup();
        }, 2000);
    }

    hidePopup() {
        // پنهان کردن پاپ‌آپ
        this.hintPopup.style.display = "none";
    }
}
