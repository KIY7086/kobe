import { calc_kobe, calc_kobe_text } from "./calc.js";
import { initLogoAnimation, initDanmakuAnimation } from './animate.js';
import { initGames, mambaQuiz } from './game.js';

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
    "✨ 81分之夜特别版 ✨",
    "🕊️ 传奇永不落幕，致敬永恒 🕊️",
    "🌟 你见过凌晨四点的解题过程吗 🌟",
    "💯 单场81分的数学奇迹 💯",
    "📐 后仰跳投般优雅的几何 📐",
    "👑 紫金王朝的数学荣耀 👑",
    "📚 曼巴学院必修公式 📚",
    "🖤 为热爱，算到极致 🤍",
    "🚀 从8号到24号的蜕变之路 🚀",
    "🏅 MVP赛季的绝对专注 🏅",
    "💍 五冠王朝的冠军算法 💍",
    "🎓 名人堂级数学思维 🎓",
    "🤟 为Gigi拼尽最后一份热爱 🤟"
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
    "💫 曼巴时刻",
    "🖤 曼巴永恒",
    "💍 第五冠！",
    "🚀 8号起飞",
    "🏆 湖人荣耀",
    "💯 得分王！",
    "📚 Mamba Mentality",
    "🕯️ 致敬传奇",
    "🎓 HOF 2020",
    "📐 绝杀公式",
    "🤟 为爱而战",
    "🏀 小飞侠出击",
    "💥 拒绝妥协"
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

// 修改加载科比名言的部分
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

// 计算距离科比逝世的天数和是否整年
function getKobeTimespan() {
    const kobeDate = new Date('2020-01-26');
    const today = new Date();
    const diffTime = Math.abs(today - kobeDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 检查是否是周年
    const isAnniversary = today.getMonth() === kobeDate.getMonth() && 
                         today.getDate() === kobeDate.getDate() &&
                         today.getFullYear() > kobeDate.getFullYear();
    
    // 如果是周年，计算年数
    const years = isAnniversary ? today.getFullYear() - kobeDate.getFullYear() : 0;
    
    return {
        days: diffDays,
        isAnniversary,
        years
    };
}

// 添加全屏相关函数
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        // 进入全屏
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Safari
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE11
            document.documentElement.msRequestFullscreen();
        }
    }
}

// 添加字体自适应函数
function adjustFontSize() {
    // 检查是否出现滚动条
    const hasVerticalScrollbar = document.body.scrollHeight > window.innerHeight;
    const hasHorizontalScrollbar = document.body.scrollWidth > window.innerWidth;
    
    if (hasVerticalScrollbar || hasHorizontalScrollbar) {
        document.body.classList.add('small-font');
    } else {
        document.body.classList.remove('small-font');
    }
}

// 在关键时刻调用字体调整
window.addEventListener('load', adjustFontSize);
window.addEventListener('resize', adjustFontSize);

// 在显示新内容后也调用字体调整
function showWithFontAdjust(element) {
    element.style.display = 'block';
    requestAnimationFrame(() => {
        adjustFontSize();
    });
}

// 修改创建纪念卡片的函数
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
    const timespan = getKobeTimespan();
    card.innerHTML = `
        <div class="memorial-title">💜 永远的曼巴 💛</div>
        <div class="memorial-days">
            ${timespan.isAnniversary ? `${timespan.years} 周年` : `第 ${timespan.days} 天`}
        </div>
        <div class="memorial-text">🐍 Forever Mamba 🐍</div>
        <div class="memorial-date">1978.08.23 - 2020.01.26</div>
    `;
    document.body.appendChild(card);

    // 修改点击事件处理
    card.addEventListener('click', () => {
        card.classList.add('memorial-exit');
        overlay.classList.remove('active');
        tryPlayMusic();
        toggleFullScreen();

        // 使用分段延迟
        const calculateDelay = (index) => {
            if (index <= 2) {
                // 前两个元素（喜报和时间）快速出现
                return 800 * index;
            } else {
                // 之后的元素慢慢出现
                return 1600 + (index - 2) * 2000;
            }
        };

        // 1. 显示喜报横幅
        setTimeout(() => {
            const banner = document.querySelector('.celebration-banner');
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-50px)';
            showWithFontAdjust(banner);
            
            requestAnimationFrame(() => {
                banner.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                banner.style.opacity = '1';
                banner.style.transform = 'translateY(0)';
            });
        }, calculateDelay(1));

        // 2. 显示时间公告
        setTimeout(() => {
            const timeAnnouncement = document.querySelector('.time-announcement');
            timeAnnouncement.style.opacity = '0';
            timeAnnouncement.style.transform = 'scale(0.8)';
            showWithFontAdjust(timeAnnouncement);
            
            requestAnimationFrame(() => {
                timeAnnouncement.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                timeAnnouncement.style.opacity = '1';
                timeAnnouncement.style.transform = 'scale(1)';
            });
        }, calculateDelay(2));

        // 3. 启动弹幕
        setTimeout(() => {
            if (KOBE_QUOTES.length > 0) {
                initDanmakuAnimation(KOBE_QUOTES);
            }
        }, calculateDelay(3));

        // 4. 添加护法
        setTimeout(() => {
            addGuardians();
        }, calculateDelay(4));

        // 5. 启动Logo动画
        setTimeout(() => {
            initLogoAnimation();
        }, calculateDelay(5));

        // 移除卡片和遮罩
        setTimeout(() => {
            document.body.removeChild(card);
            document.body.removeChild(overlay);
        }, 1000);
    });

    // 修改提示文本样式
    const hint = document.createElement('div');
    hint.style.cssText = `
        color: #FDB927;
        font-size: 16px;
        animation: blink 1s infinite;
        margin-top: 15px;  /* 使用margin-top替代绝对定位 */
    `;
    hint.textContent = '点击卡片开始播放';
    card.appendChild(hint);
}

// 在页面加载完成后初始化游戏
window.addEventListener('load', () => {
    createMemorialCard();
    initGames();
});

// 添加点击喜报横幅启动游戏的功能
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('.celebration-banner');
    if (banner) {
        banner.style.cursor = 'pointer';
        banner.addEventListener('click', () => {
            mambaQuiz.start();
        });
    }
});

// 添加全屏切换失败的错误处理
document.addEventListener('fullscreenerror', (event) => {
    console.error('全屏切换失败:', event);
});

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

// 添加护法元素
function addGuardians() {
    // 精简并主题化护法元素
    const guardianElements = [
        '🏀', '🐍', '💜', '💛', '🏆', '⛹️‍♂️'  // 只保留最相关的元素
    ];
    
    // 创建左右护法容器
    const leftGuardian = document.createElement('div');
    const rightGuardian = document.createElement('div');
    
    leftGuardian.className = 'guardian-container left-guardian';
    rightGuardian.className = 'guardian-container right-guardian';
    
    // 减少数量到4个
    for (let i = 0; i < 4; i++) {
        const leftElem = document.createElement('div');
        const rightElem = document.createElement('div');
        
        leftElem.className = 'guardian-element';
        rightElem.className = 'guardian-element';
        
        // 不再随机组合，而是有意义的搭配
        const pairs = ['🏀⛹️‍♂️', '🐍🏆', '💜💛', '🏆🐍'];
        leftElem.textContent = pairs[i];
        rightElem.textContent = pairs[i];
        
        leftElem.style.animationDelay = `${i * 0.3}s`;  // 更短的延迟
        rightElem.style.animationDelay = `${i * 0.3}s`;
        
        leftGuardian.appendChild(leftElem);
        rightGuardian.appendChild(rightElem);
    }
    
    document.body.appendChild(leftGuardian);
    document.body.appendChild(rightGuardian);
}
