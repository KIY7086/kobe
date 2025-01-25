export function calc_kobe(number) {
    // 获取预加载的图片的src
    const img8 = document.getElementById('img8');
    const img24 = document.getElementById('img24');
    
    // 定义图片HTML标签
    const img8Html = `<img src="${img8.src}" class="number-img" alt="8">`;
    const img24Html = `<img src="${img24.src}" class="number-img" alt="24">`;
    
    // 获取表达式的文本形式（已经包含了运算符的替换）
    const expr = calc_kobe_text(number);
    
    // 只替换数字为图片，保持括号和运算符不变
    return expr.replace(/\b8\b/g, img8Html)
              .replace(/\b24\b/g, img24Html);
}

export function calc_kobe_text(number) {
    // 从 results.json 中获取表达式
    const expressions = results.filter(item => item.target === number)
                             .map(item => item.expression
                                 .replace(/%!d\(string=/g, '')  // 移除Go语言的格式化标记
                                 .replace(/%!s\(int=/g, '')
                                 .replace(/\*/g, '×')  // 替换运算符
                                 .replace(/(?<![a-zA-Z])\//g, '÷')); // 不替换URL中的斜杠
    
    // 如果找到表达式，随机返回一个
    if (expressions.length > 0) {
        const randomIndex = Math.floor(Math.random() * expressions.length);
        return expressions[randomIndex];
    }
    
    // 如果没有找到表达式，返回默认表达式
    return number <= 24 ? "24" : "(24 + 24)";
}

// 加载 results.json
let results = [];
fetch('/results.json')
    .then(response => response.json())
    .then(data => {
        results = data;
    })
    .catch(error => {
        console.error('Error loading results.json:', error);
    }); 