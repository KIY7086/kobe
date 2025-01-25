import { calc_kobe, calc_kobe_text } from "./calc.js";
import { initLogoAnimation, initDanmakuAnimation } from './animate.js';

// 初始化 KOBE_QUOTES
let KOBE_QUOTES = [];

const RANDOM_TEXTS = [
    "⚡️ 黑曼巴出品，必属精品 ⚡️",
    "🎯 科比亲自监制计算公式 🎯",
    "💫 这是一个24秒进攻时间的故事 💫",
    "🏀 投篮空心练出来的算式 🏀",
    "🐍 曼巴精神永不熄 🐍",
    "🔥 凌晨四点的数学课 🔥",
    "✨ 手感在线，计算准确 💪",
    "✨ 81分之夜特别版 ✨"
];

const TOAST_MESSAGES = [
    "🔥 曼巴精神！",
    "💪 永不言弃！",
    "🏀 凌晨四点的洛杉矶",
    "🐍 黑曼巴来了",
    "💜 For Kobe",
    "💛 For Gigi",
    "🎯 空心命中",
    "✨ 81分之夜",
    "🏆 总冠军！",
    "⭐️ All Star",
    "🔥 五冠王朝",
    "💫 曼巴时刻"
];

const month = document.getElementById("month");
const day = document.getElementById("day");
const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const second = document.getElementById("second");
const year = document.getElementById("year");
const quoteElement = document.querySelector(".kobe-quote");

// 随机获取科比名言
function getRandomQuote() {
    if (KOBE_QUOTES.length === 0) return "";
    const index = Math.floor(Math.random() * KOBE_QUOTES.length);
    return KOBE_QUOTES[index];
}

// 搜索函数
function searchExpression(text) {
    const cleanExpr = text
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\s+/g, '');
    
    const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(cleanExpr)}`;
    window.open(searchUrl, '_blank');
}

// 为每个时间元素添加点击事件
function addClickToSearch(element, getValue) {
    element.style.cursor = 'pointer';
    element.addEventListener('click', () => {
        const currentTime = new Date();
        const value = getValue(currentTime);
        searchExpression(value);
    });
}

// 添加点击搜索事件
addClickToSearch(year, time => `${time.getFullYear()}`);
addClickToSearch(month, time => `${calc_kobe_text(time.getMonth() + 1)}`);
addClickToSearch(day, time => `${calc_kobe_text(time.getDate())}`);
addClickToSearch(hour, time => `${calc_kobe_text(time.getHours())}`);
addClickToSearch(minute, time => `${calc_kobe_text(time.getMinutes())}`);
addClickToSearch(second, time => `${calc_kobe_text(time.getSeconds())}`);

function updateTime() {
const current_time = new Date();
    year.innerHTML = current_time.getFullYear();
    month.innerHTML = calc_kobe(current_time.getMonth() + 1);
    day.innerHTML = calc_kobe(current_time.getDate());
    hour.innerHTML = calc_kobe(current_time.getHours());
    minute.innerHTML = calc_kobe(current_time.getMinutes());
    second.innerHTML = calc_kobe(current_time.getSeconds());
}

// 初始更新
updateTime();

// 每秒更新时间
setInterval(updateTime, 1000);

// 更新随机文本
function updateRandomText() {
    if (document.hidden) return;
    const randomText = document.querySelector('.random-text');
    const text = RANDOM_TEXTS[Math.floor(Math.random() * RANDOM_TEXTS.length)];
    randomText.textContent = text;
}

// 每3秒更新一次随机文本
setInterval(updateRandomText, 3000);
updateRandomText();

// 添加飞行的科比元素
const KOBE_IMAGES = [
    './images/8.png',
    './images/24.png',
    '🏀',
    '🐍',
    '💜',
    '💛',
    '🏆'
];

function createFlyingKobe() {
    const kobe = document.createElement('div');
    kobe.className = 'flying-kobe';
    
    // 随机选择显示内容
    const content = KOBE_IMAGES[Math.floor(Math.random() * KOBE_IMAGES.length)];
    if (content.endsWith('.png')) {
        const img = document.createElement('img');
        img.src = content;
        kobe.appendChild(img);
    } else {
        kobe.style.fontSize = '50px';
        kobe.textContent = content;
    }
    
    // 随机起始和结束位置
    const startX = Math.random() * window.innerWidth;
    const endX = Math.random() * window.innerWidth;
    const y = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.2;
    
    kobe.style.setProperty('--startX', `${startX}px`);
    kobe.style.setProperty('--endX', `${endX}px`);
    kobe.style.setProperty('--y', `${y}px`);
    
    document.body.appendChild(kobe);
    
    kobe.addEventListener('animationend', () => {
        document.body.removeChild(kobe);
    });
}

function scheduleFlyingKobe() {
    const delay = 500 + Math.random() * 1000;  // 0.5-1.5秒随机间隔
    setTimeout(() => {
        createFlyingKobe();
        scheduleFlyingKobe();
    }, delay);
}

// 开始创建飞行的科比元素
scheduleFlyingKobe();

// 加载科比名言
fetch('kobe.txt')
    .then(response => response.text())
    .then(text => {
        KOBE_QUOTES = text.split('\n')
            .filter(line => line.trim().length > 0)  // 过滤空行
            .map(line => {
                // 移除任何形式的序号和引号
                return line
                    .replace(/^\d+[\.\、\s]*/, '')  // 移除开头的数字和分隔符
                    .replace(/^["'""]/, '')         // 移除开头的引号
                    .replace(/["'""]$/, '')         // 移除结尾的引号
                    .trim();
            })
            .filter(quote => quote.length > 0);  // 再次过滤空行
        initDanmakuAnimation(KOBE_QUOTES);
    })
    .catch(error => {
        console.error('Failed to load kobe.txt:', error);
        // 使用默认名言
        KOBE_QUOTES = [
            "The most important thing is to try and inspire people so that they can be great in whatever they want to do.",
            "Everything negative – pressure, challenges – is all an opportunity for me to rise.",
            "If you're afraid to fail, then you're probably going to fail.",
            "The moment you give up, is the moment you let someone else win.",
            "Heroes come and go, but legends are forever."
        ];
        initDanmakuAnimation(KOBE_QUOTES);
    });

// 播放音乐
const bgMusic = document.getElementById('bgMusic');
let musicStarted = false;

function tryPlayMusic() {
    if (!musicStarted) {
        bgMusic.play()
            .then(() => {
                musicStarted = true;
            })
            .catch(error => {
                if (error.name !== 'NotAllowedError') {
                    console.error('Music play error:', error);
                }
            });
    }
}

// 任何用户交互都会触发音乐播放
['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event => {
    document.addEventListener(event, tryPlayMusic, { once: true });
});

// 3秒后自动播放
setTimeout(tryPlayMusic, 3000);

// 如果页面可见性改变也尝试播放
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        tryPlayMusic();
    }
});

// 计算距离科比逝世的天数
function getKobeDays() {
    const kobeDate = new Date('2020-01-26');
    const today = new Date();
    const diffTime = Math.abs(today - kobeDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// 创建纪念日卡片
function createMemorialCard() {
    // 创建遮罩
    const overlay = document.createElement('div');
    overlay.className = 'memorial-overlay';
    document.body.appendChild(overlay);

    // 添加动画类
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    const card = document.createElement('div');
    card.className = 'memorial-card';
    const days = getKobeDays();
    card.innerHTML = `
        <div class="memorial-title">💜 永远的曼巴 💛</div>
        <div class="memorial-days">第 ${days} 天</div>
        <div class="memorial-text">🐍 Forever Mamba 🐍</div>
        <div class="memorial-date">1978.08.23 - 2020.01.26</div>
    `;
    document.body.appendChild(card);

    // 点击卡片时移除并播放音乐
    card.addEventListener('click', () => {
        card.classList.add('memorial-exit');
        overlay.classList.remove('active');
        tryPlayMusic();
        setTimeout(() => {
            document.body.removeChild(card);
            document.body.removeChild(overlay);
        }, 1000);
    });

    // 添加提示文本
    const hint = document.createElement('div');
    hint.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        color: #FDB927;
        font-size: 16px;
        animation: blink 1s infinite;
    `;
    hint.textContent = '点击卡片开始播放';
    card.appendChild(hint);
}

// 页面加载时显示纪念卡片
window.addEventListener('load', createMemorialCard);

// 科比数字旋转动画
const kobeElements = document.querySelectorAll('.katex');
kobeElements.forEach(elem => {
    let rotationSpeed = 0;
    let rotationAngle = 0;
    let animationId = null;
    const acceleration = 2; // 每帧增加的速度
    const maxSpeed = 50;    // 最大旋转速度

    function updateRotation() {
        const numberImgs = elem.querySelectorAll('.number-img');
        numberImgs.forEach(img => {
            img.style.transform = `rotate(${rotationAngle}deg)`;
        });
        
        rotationSpeed = Math.min(rotationSpeed + acceleration, maxSpeed);
        rotationAngle = (rotationAngle + rotationSpeed) % 360;
        animationId = requestAnimationFrame(updateRotation);
    }

    elem.addEventListener('mouseenter', () => {
        rotationSpeed = 5;  // 初始速度
        if (!animationId) {
            updateRotation();
        }
    });

    elem.addEventListener('mouseleave', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        // 重置状态
        rotationSpeed = 0;
        rotationAngle = 0;
        const numberImgs = elem.querySelectorAll('.number-img');
        numberImgs.forEach(img => {
            img.style.transform = '';
        });
    });
});

// 页面加载完成后启动动画
window.addEventListener('load', () => {
    initLogoAnimation();
});
