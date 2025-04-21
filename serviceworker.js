// オフライン対応用のキャッシュ機能

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open("shopping-app").then((cache) => {
            return cache.addAll(["/", "/index.html", "/style.css", "/app.js"]);
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

let lastTap = 0;
zoomContainer.addEventListener("touchend", () => {
    const now = new Date().getTime();
    if (now - lastTap < 300) {
        scale = 1;
        currentImage.style.transform = `scale(${scale})`;
    }
    lastTap = now;
});

const zoomContainer = document.getElementById("zoomContainer");
const currentImage = document.getElementById("currentImage");

let scale = 1;
let lastDistance = null;

zoomContainer.addEventListener("touchmove", function (e) {
    if (e.touches.length === 2) {
        e.preventDefault(); // デフォルト動作（スクロールなど）を防ぐ

        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (lastDistance !== null) {
            const delta = distance - lastDistance;
            scale += delta * 0.005;
            scale = Math.max(0.5, Math.min(3, scale)); // ズーム範囲制限
            currentImage.style.transform = `scale(${scale})`;
        }

        lastDistance = distance;
    }
}, { passive: false });

zoomContainer.addEventListener("touchend", () => {
    lastDistance = null;
});
