import { CanvasDrawer } from './CanvasDrawer.js';
import { HintManager } from './HintManager.js';

// مسیر فایل JSON
const WORDS_JSON_PATH = "./json/words.json";

//Initial References
const letterContainer = document.querySelector("#letter-container");
const userInputSection = document.querySelector("#user-input");
const newGameContainer = document.querySelector("#new-game-container");
const newGameButton = document.querySelector("#new-game-button");
const canvas = document.querySelector("#canvas");
const resultText = document.querySelector("#result-text");
const generatedWord = document.querySelector("#generated-word");
const lives = document.querySelector("#lives");

const drawer = new CanvasDrawer(canvas);

const PATH = "./Audios/";

const loadAudio = (filename) => {
    const audio = new Audio(PATH + filename);
    audio.load();
    return audio;
};

const win = loadAudio("win.mp3");
const lost = loadAudio("Lose.mp3");
const soundTrack = loadAudio("while_game.mp3");
const type = loadAudio("type.wav");

// تنظیم صدای موزیک پس‌زمینه
const backgroundAudio = document.getElementById("background-audio"); // گرفتن عنصر audio از HTML
backgroundAudio.volume = 0.1; // صدای ملایم

// رویداد برای شروع موزیک پس از اولین تعامل کاربر
const startBackgroundAudio = () => {
    backgroundAudio.play(); // شروع پخش موزیک
    document.removeEventListener("click", startBackgroundAudio); // حذف رویداد پس از اولین اجرا
};

// افزودن رویداد کلیک به سند
document.addEventListener("click", startBackgroundAudio);

const ASCII_A = 65;
const ASCII_Z = 90;
const LIVES = 6;

// Initialize variables
let category;
let word;
let hint;
let wordsList = []; // لیست کلمات
//count
let winCount = 0;
let count = 0;

// Global variable to store the HangmanWord object
let hangmanWord;

for (let i = 0; i < LIVES; i++) {
    let heart = document.createElement("img");
    heart.src = "imgs/bloody.png";
    lives.append(heart);
}

// HangmanWord class to store the word, category, and hint
class HangmanWord {
    constructor(word, category, hint) {
        this.word = word;
        this.category = category;
        this.hint = hint;
    }

    getWord() {
        return this.word;
    }

    getCategory() {
        return this.category;
    }

    getHint() {
        return this.hint;
    }
}

// تابع برای لود کردن داده‌ها از JSON
const loadWordsFromJSON = async () => {
    try {
        const response = await fetch(WORDS_JSON_PATH);
        if (!response.ok) {
            throw new Error("Failed to fetch words.json");
        }
        const data = await response.json();
        wordsList = data.words; // ذخیره کلمات
    } catch (error) {
        console.error("Error loading words from JSON:", error);
    }
};

// Fetching Random Word
const fetchAndInitialize = () => {
    if (wordsList.length === 0) {
        console.error("Words list is empty! Make sure words.json is loaded.");
        return;
    }

    // انتخاب تصادفی کلمه از JSON
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    const randomWordData = wordsList[randomIndex];

    hangmanWord = new HangmanWord(
        randomWordData.word,
        "General", // می‌توانید دسته‌بندی را از فایل JSON نیز اضافه کنید
        randomWordData.hint
    );

    initializer();
};

//Block all the Buttons
const blocker = () => {
    let optionsButtons = document.querySelectorAll(".options");
    let letterButtons = document.querySelectorAll(".letters");

    //disable all options
    optionsButtons.forEach((button) => {
        button.disabled = true;
    });

    //disable all letters
    letterButtons.forEach((button) => {
        button.disabled = true;
    });

    newGameContainer.classList.remove("hide");
};

//Word Generator
const generateWord = () => {
    word = hangmanWord.getWord().toUpperCase(); // گرفتن کلمه
    userInputSection.innerHTML = ""; // پاک کردن محتوا قبلی

    // ایجاد خطوط زیر برای کلمه
    word.split("").forEach(() => {
        const dash = document.createElement("span");
        dash.classList.add("dashes");
        dash.innerText = "_"; // نمایش خط زیر
        userInputSection.appendChild(dash);
    });
};



//Initial Function (Called when page loads/user presses new game)
const initializer = () => {

    winCount = 0;
    count = 0;

    // Display the word and hint
    let categoryH2 = document.createElement("h2");
    let hintH2 = document.createElement("h2");

    // Assuming hangmanWord is an object that provides the word and hint
    word = hangmanWord.getWord();
    hint = hangmanWord.getHint();
    category = hangmanWord.getCategory();

    categoryH2.innerText = `Category: ${category}`;
    hintH2.innerText = `Hint: ${hint}`;

    generatedWord.append(categoryH2);
    generatedWord.append(hintH2);

    // Initially erase all content and hide letters and new game button
    userInputSection.innerHTML = "";
    newGameContainer.classList.add("hide");
    letterContainer.innerHTML = "";

    // Generate word visualization (e.g., underscores or dashes)
    generateWord();

    let charArray = word.split("");
    let dashes = document.getElementsByClassName("dashes");

    const hintManager = new HintManager("hintButton", "hintPopup", hangmanWord.getWord());

    const handleInput = (inputValue) => {
        const charArray = word.toUpperCase().split(""); // کلمه به صورت آرایه
        const dashes = document.querySelectorAll(".dashes"); // خطوط زیر کلمه
        let isCorrect = false; // پرچم برای بررسی صحت
    
        // بررسی حروف کلمه
        charArray.forEach((char, index) => {
            if (char === inputValue) {
                dashes[index].innerText = char; // پر کردن حرف صحیح
                winCount += 1;
                isCorrect = true; // تنظیم پرچم
            }
        });
    
        // اگر ورودی صحیح باشد
        if (isCorrect) {
            if (winCount === charArray.length) { // بررسی برد
                win.play(); // صدای برد
                resultText.innerHTML = ""; // پاک کردن متن قبلی
                let winImg = document.createElement("img");
                winImg.src = "./imgs/WIN.png"; // مسیر تصویر برد
                winImg.alt = "You Win!";
                winImg.style.width = "600px"; // تنظیم اندازه تصویر
                resultText.appendChild(winImg);
                blocker(); // غیرفعال کردن بقیه دکمه‌ها
            }
        } else {
            count += 1; // افزایش شمارش اشتباه‌ها
            drawMan(count); // رسم بخشی از آدمک
            lives.children[count - 1].style.display = "none"; // حذف یک قلب
    
            if (count === LIVES) { // بررسی باخت
                lost.play(); // صدای باخت
                resultText.innerHTML = ""; // پاک کردن متن قبلی
                let loseImg = document.createElement("img");
                loseImg.src = "./imgs/game_over.png"; // مسیر تصویر باخت
                loseImg.alt = "Game Over";
                loseImg.style.width = "600px"; // تنظیم اندازه تصویر
                resultText.appendChild(loseImg);
                blocker(); // غیرفعال کردن بقیه دکمه‌ها
            }
        }
    };
    
    

    for (let i = ASCII_A; i <= ASCII_Z; i++) {
        let button = document.createElement("button");
        button.classList.add("letters");
        let letter = String.fromCharCode(i);
        button.id = `key-${letter}`;

        // اضافه کردن تصویر به دکمه
        let img = document.createElement("img");
        img.src = `./imgs/${letter.toLowerCase()}.png`;
        img.alt = letter;
        img.style.width = "40px";
        img.style.height = "40px";

        button.appendChild(img);

        // افزودن رویداد کلیک
        button.addEventListener("click", () => {
            if (!button.disabled) {
                handleInput(letter); // ارسال حرف به تابع پردازش ورودی
                button.disabled = true; // غیرفعال کردن دکمه
                button.style.opacity = "0.5"; // تغییر ظاهر دکمه
            }
        });

        letterContainer.append(button); // افزودن دکمه به صفحه
    }


    // رویداد برای کیبورد
// رویداد برای کیبورد فیزیکی
document.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase(); // دریافت حرف و تبدیل به حروف بزرگ
    const button = document.getElementById(`key-${key}`); // پیدا کردن دکمه متناظر

    if (key >= 'A' && key <= 'Z') { // بررسی اینکه حرف وارد شده معتبر است
        if (button && !button.disabled) { // بررسی دکمه مرتبط با حرف
            button.click(); // شبیه‌سازی کلیک روی دکمه
        } else {
            console.warn(`Letter "${key}" is already used or invalid.`);
        }
    } else {
        console.warn(`Invalid key "${event.key}".`);
    }
});
    


    // Draw the initial frame
    drawer.initialDrawing();

};

//draw the man
const drawMan = (count) => {
    switch (count) {
        case 1:
            drawer.drawHead();
            break;
        case 2:
            drawer.drawBody();
            break;
        case 3:
            drawer.drawLeftArm();
            break;
        case 4:
            drawer.drawRightArm();
            break;
        case 5:
            drawer.drawLeftLeg();
            break;
        case 6:
            drawer.drawRightLeg();
            break;
        default:
            break;
    }
};


// بارگذاری کلمات و شروع بازی
loadWordsFromJSON().then(fetchAndInitialize);

//New Game
newGameButton.addEventListener("click", fetchAndInitialize);
newGameButton.addEventListener("click", () => {
    location.reload();
});
