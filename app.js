let imageFiles = [];
let currentIndex = 0;
let imageInfo = [];

const imageInput = document.getElementById("imageInput");
const currentImage = document.getElementById("currentImage");
const storeName = document.getElementById("storeName");
const memoText = document.getElementById("memoText");

imageInput.addEventListener("change", (event) => {
    imageFiles = Array.from(event.target.files);
    imageInfo = imageFiles.map(() => ({ store: "", memo: "" }));
    currentIndex = 0;

    if (imageFiles.length > 0) {
        displayImage(currentIndex);
    }
});

// スワイプ操作の追加
let touchStartX = 0;

currentImage.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
});

currentImage.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;

    // 左へスワイプ（次へ）
    if (diff < -50) {
        saveCurrentInfo();
        currentIndex = (currentIndex + 1) % imageFiles.length;
        displayImage(currentIndex);
    }
    // 右へスワイプ（前へ）
    else if (diff > 50) {
        saveCurrentInfo();
        currentIndex = (currentIndex - 1 + imageFiles.length) % imageFiles.length;
        displayImage(currentIndex);
    }
});

function saveCurrentInfo() {
    imageInfo[currentIndex] = {
        store: storeName.value,
        memo: memoText.value
    };
}

function displayImage(index) {
    const file = imageFiles[index];
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // 入力欄を更新
    storeName.value = imageInfo[index].store || "";
    memoText.value = imageInfo[index].memo || "";
}

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let hideBtnTimer = null;

// 次へ／前へボタンのクリック処理
prevBtn.addEventListener("click", () => {
    saveCurrentInfo();
    currentIndex = (currentIndex - 1 + imageFiles.length) % imageFiles.length;
    displayImage(currentIndex);
    resetHideButtonsTimer();
});

nextBtn.addEventListener("click", () => {
    saveCurrentInfo();
    currentIndex = (currentIndex + 1) % imageFiles.length;
    displayImage(currentIndex);
    resetHideButtonsTimer();
});

// マウス移動やタップなどの操作で表示リセット
["mousemove", "click", "touchstart"].forEach(eventName => {
    document.addEventListener(eventName, resetHideButtonsTimer);
});

// ボタン表示 → 一定時間後に非表示
function resetHideButtonsTimer() {
    prevBtn.classList.remove("hidden");
    nextBtn.classList.remove("hidden");

    if (hideBtnTimer) clearTimeout(hideBtnTimer);

    hideBtnTimer = setTimeout(() => {
        prevBtn.classList.add("hidden");
        nextBtn.classList.add("hidden");
    }, 5000); // 5秒間操作がなければ非表示
}
