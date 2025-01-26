// 动画配置
const ANIMATION_CONFIG = {
    logos: {
        count: 8,                // 更多的logo
        speed: 200,             
        refreshInterval: 3000,   // 更频繁的刷新
        minDistance: 100,        // 最小间距
        width: 232,             
        height: 144             
    },
    danmaku: {
        interval: 3000,
        maxCount: 15
    }
};

// Logo动画
export function initLogoAnimation() {
    // ... 其他 Logo 相关代码 ...
}

// 弹幕动画
export function initDanmakuAnimation(quotes) {
    let lastTime = 0;

    function createDanmaku(text) {
        const danmaku = document.createElement('div');
        danmaku.className = 'danmaku';
        danmaku.textContent = text;
        danmaku.style.top = Math.random() * 80 + 10 + 'vh';
        
        document.getElementById('danmaku-container').appendChild(danmaku);
        
        gsap.fromTo(danmaku,
            { x: window.innerWidth },
            {
                x: -danmaku.offsetWidth,
                duration: 15,
                ease: "none",
                onComplete: () => danmaku.remove()
            }
        );
    }

    function animate(currentTime) {
        if (currentTime - lastTime >= ANIMATION_CONFIG.danmaku.interval) {
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            createDanmaku(quote);
            lastTime = currentTime;
        }
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
} 