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

const zoomContainer = document.getElementById("zoomContainer");
let scale = 1;

// ピンチ操作（スマホ）
let lastDistance = null;

zoomContainer.addEventListener("touchmove", function (e) {
    if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (lastDistance !== null) {
            const delta = distance - lastDistance;
            scale += delta * 0.1;
            scale = Math.max(0.5, Math.min(3, scale)); // 拡大率の制限
            currentImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }

        lastDistance = distance;
    }
}, { passive: false });

zoomContainer.addEventListener("touchend", () => {
    lastDistance = null;
});

// Ctrl + マウスホイール（PC）
zoomContainer.addEventListener("wheel", function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
        scale += e.deltaY * -0.001;
        scale = Math.max(0.5, Math.min(3, scale));
        currentImage.style.transform = `scale(${scale})`;
    }
}, { passive: false });

let lastTap = 0;
zoomContainer.addEventListener("touchend", () => {
    const now = new Date().getTime();
    if (now - lastTap < 300) {
        scale = 1;
        translateX = 0;
        translateY = 0;
        currentImage.style.transform = `translate(0px, 0px) scale(1)`;
    }
    lastTap = now;
});


let lastTouchX = 0;
let lastTouchY = 0;
let translateX = 0;
let translateY = 0;
let isDragging = false;

// タッチ or マウス移動でパン
zoomContainer.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    }
}, { passive: false });

zoomContainer.addEventListener("touchmove", (e) => {
    if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - lastTouchX;
        const deltaY = e.touches[0].clientY - lastTouchY;

        translateX += deltaX;
        translateY += deltaY;

        currentImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;

        e.preventDefault();
    }
}, { passive: false });

zoomContainer.addEventListener("touchend", () => {
    isDragging = false;
});

let isMouseDown = false;

currentImage.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    lastTouchX = e.clientX;
    lastTouchY = e.clientY;
});

window.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        const deltaX = e.clientX - lastTouchX;
        const deltaY = e.clientY - lastTouchY;

        translateX += deltaX;
        translateY += deltaY;

        currentImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

        lastTouchX = e.clientX;
        lastTouchY = e.clientY;
    }
});

window.addEventListener("mouseup", () => {
    isMouseDown = false;
});
