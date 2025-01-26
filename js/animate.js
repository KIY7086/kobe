// 动画配置
const ANIMATION_CONFIG = {
    logos: {
        count: 8,                // logo数量
        speed: 200,             
        refreshInterval: 3000,   // 刷新间隔
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
    function refreshLogos() {
        // 获取现有的logo数量
        const existingCount = document.querySelectorAll('.floating-logo').length;
        
        // 只在logo数量不足时添加新的
        const toCreate = ANIMATION_CONFIG.logos.count - existingCount;
        for (let i = 0; i < toCreate; i++) {
            createLogo();
        }
    }

    function createLogo() {
        // 创建一个容器来管理所有logo的层级
        const container = document.getElementById('logo-container') || (() => {
            const div = document.createElement('div');
            div.id = 'logo-container';
            div.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;';
            document.body.appendChild(div);
            return div;
        })();

        // 创建一个包装器来处理独立的旋转
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:absolute;transform-origin:center;';
        container.appendChild(wrapper);
        
        const logo = document.createElement('img');
        logo.src = './images/lakers.png';
        logo.className = 'floating-logo';
        wrapper.appendChild(logo);

        // 获取有效的随机位置
        function getValidPosition() {
            const existingLogos = document.querySelectorAll('.floating-logo');
            let attempts = 0;
            let x, y;
            
            do {
                x = Math.random() * (window.innerWidth - ANIMATION_CONFIG.logos.width);
                y = Math.random() * (window.innerHeight - ANIMATION_CONFIG.logos.height);
                
                let isValid = true;
                existingLogos.forEach(existing => {
                    const rect = existing.getBoundingClientRect();
                    const distance = Math.hypot(x - rect.left, y - rect.top);
                    if (distance < ANIMATION_CONFIG.logos.minDistance) {
                        isValid = false;
                    }
                });
                
                if (isValid || attempts > 10) return { x, y };
                attempts++;
            } while (true);
        }

        const { x: startX, y: startY } = getValidPosition();
        const endX = (Math.random() * (window.innerWidth + 800)) - 400;
        const endY = (Math.random() * (window.innerHeight + 800)) - 400;
        
        const duration = 2 + Math.random() * 3;
        const hue = Math.random() * 360;

        // 计算随机的飞出方向
        const exitAngle = Math.random() * Math.PI * 2;
        const exitDistance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
        const exitX = endX + Math.cos(exitAngle) * exitDistance;
        const exitY = endY + Math.sin(exitAngle) * exitDistance;

        // 持续旋转动画
        gsap.to(logo, {
            rotation: "+=720",
            duration: 1,
            repeat: -1,
            ease: "none"
        });

        gsap.fromTo(wrapper, 
            { 
                x: startX,
                y: startY,
                filter: `hue-rotate(${hue}deg) brightness(1.5)`,
                scale: 1.2,
                opacity: 0.6
            },
            {
                x: endX,
                y: endY,
                scale: 0.5 + Math.random() * 1.5,
                duration: duration,
                ease: "none",
                repeat: Math.random() > 0.5 ? 1 : 0,
                yoyo: Math.random() > 0.5,
                onComplete: () => {
                    gsap.to(wrapper, {
                        x: exitX,
                        y: exitY,
                        scale: 0.1,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power4.in",
                        onComplete: () => wrapper.remove()
                    });
                }
            }
        );

        if (Math.random() > 0.5) {
            gsap.to(wrapper, {
                filter: `hue-rotate(${Math.random() * 360}deg) brightness(${1 + Math.random()})`,
                duration: duration / 2,
                repeat: 3,
                yoyo: true
            });
        }
    }

    // 开始动画循环
    refreshLogos();
    setInterval(refreshLogos, ANIMATION_CONFIG.logos.refreshInterval);
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