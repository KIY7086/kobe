// 游戏状态管理
let gameActive = false;
let gameScore = 0;

// 曼巴精神问答游戏
class MambaQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.answeredQuestions = 0;
        this.questionsPerGame = 10;  // 每局10个问题
        
        // 添加遮罩层
        this.overlay = document.createElement('div');
        this.overlay.className = 'game-overlay';
        document.body.appendChild(this.overlay);

        // 获取音效元素
        this.correctSound = document.getElementById('correctSound');
        this.wrongSound1 = document.getElementById('wrongSound1');
        this.wrongSound2 = document.getElementById('wrongSound2');

        // 加载问题
        this.loadQuestions();

        // 添加遮罩层点击事件
        this.overlay.addEventListener('click', (e) => {
            // 只有当点击的是遮罩层本身时才关闭
            if (e.target === this.overlay) {
                this.stop();
            }
        });
    }

    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            const data = await response.json();
            this.allQuestions = data.questions;
        } catch (error) {
            console.error('Failed to load questions:', error);
        }
    }

    shuffleQuestions() {
        // 随机选择10个问题
        this.questions = [...this.allQuestions]
            .sort(() => Math.random() - 0.5)
            .slice(0, this.questionsPerGame);
        this.totalQuestions = this.questions.length;
    }

    init() {
        this.container = document.createElement('div');
        this.container.className = 'mamba-quiz';
        document.body.appendChild(this.container);
    }

    showQuestion() {
        const q = this.questions[this.currentQuestion];
        this.container.innerHTML = `
            <div class="quiz-progress">问题 ${this.currentQuestion + 1}/${this.totalQuestions}</div>
            <div class="quiz-score">得分: ${this.score}</div>
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-answers">
                ${q.answers.map((answer, i) => `
                    <button class="quiz-answer" data-index="${i}">${answer}</button>
                `).join('')}
            </div>
        `;

        this.container.querySelectorAll('.quiz-answer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.checkAnswer(index);
            });
        });
    }

    checkAnswer(index) {
        const q = this.questions[this.currentQuestion];
        const correct = q.correct === index;
        this.answeredQuestions++;

        if (correct) {
            this.score += 10;
            // 播放正确音效
            this.correctSound.currentTime = 0;
            this.correctSound.play();
            this.showResult(true, q.explanation);
        } else {
            // 随机播放错误音效
            const wrongSound = Math.random() < 0.5 ? this.wrongSound1 : this.wrongSound2;
            wrongSound.currentTime = 0;
            wrongSound.play();
            this.showResult(false, q.explanation);
        }
    }

    showResult(correct, explanation) {
        const result = document.createElement('div');
        result.className = `quiz-result ${correct ? 'correct' : 'wrong'}`;

        const emojis = correct ? 
            ['🏆', '🔥','💥', '💫'] :
            ['😱', '😭', '😢','💔'];
        
        const emojiContainer = emojis.map(emoji => 
            `<span class="result-emoji" style="
                animation: ${correct ? 'float' : 'shake'} 1s ease-in-out infinite;
            ">${emoji}</span>`
        ).join('');

        result.innerHTML = `
            <div class="result-emoji-container">${emojiContainer}</div>
            <div class="result-text">
                ${correct ? 'MAMBA MENTALITY! +10' : 'SOFT LIKE CHARMIN!'}
            </div>
            <div class="result-explanation">${explanation}</div>
            ${this.answeredQuestions === this.totalQuestions ? `
                <div class="final-score">
                    最终得分: ${this.score} / ${this.totalQuestions * 10}
                    <div class="score-comment">
                        ${this.getScoreComment(this.score)}
                    </div>
                </div>
                <button class="restart-btn">再来一次！</button>
            ` : ''}
        `;

        // 添加震动效果
        if (!correct) {
            document.body.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 500);
        }

        this.container.appendChild(result);
        
        if (this.answeredQuestions === this.totalQuestions) {
            result.querySelector('.restart-btn').addEventListener('click', () => {
                this.restart();
            });
        } else {
            setTimeout(() => {
                result.remove();
                this.nextQuestion();
            }, 2000);  // 缩短显示时间
        }
    }

    getScoreComment(score) {
        const maxScore = this.totalQuestions * 10;
        const percentage = (score / maxScore) * 100;
        
        if (percentage === 100) return "🏆 曼巴精神完美继承者！";
        if (percentage >= 90) return "💫 科比看了都会点赞！";
        if (percentage >= 80) return "🔥 曼巴精神初显！";
        if (percentage >= 70) return "💪 继续努力！";
        if (percentage >= 60) return "😅 还需要加倍训练！";
        return "😱 凌晨四点不要睡觉！";
    }

    nextQuestion() {
        this.currentQuestion = (this.currentQuestion + 1) % this.totalQuestions;
        this.showQuestion();
    }

    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answeredQuestions = 0;
        this.shuffleQuestions();
        this.showQuestion();
    }

    start() {
        this.overlay.style.display = 'block';
        this.container.style.display = 'block';
        this.restart();
    }

    stop() {
        this.overlay.style.display = 'none';
        this.container.style.display = 'none';
        this.stopSounds();
        // 重置游戏状态
        this.currentQuestion = 0;
        this.score = 0;
        this.answeredQuestions = 0;
    }

    // 停止所有音效
    stopSounds() {
        this.correctSound.pause();
        this.correctSound.currentTime = 0;
        this.wrongSound1.pause();
        this.wrongSound1.currentTime = 0;
        this.wrongSound2.pause();
        this.wrongSound2.currentTime = 0;
    }
}

// 导出游戏实例
export const mambaQuiz = new MambaQuiz();

// 初始化所有游戏
export function initGames() {
    mambaQuiz.init();
} 