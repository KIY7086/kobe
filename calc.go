package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"runtime"
	"strconv"
	"strings"
)

type Expression struct {
	Expr string
	Val  float64
}

type ExpressionResult struct {
	Target int    `json:"target"`
	Expr   string `json:"expression"`
}

// 运算符优先级
var precedence = map[byte]int{
	'+': 1,
	'-': 1,
	'*': 2,
	'/': 2,
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("使用方法: program <目标值或范围> [最大数字数]")
		return
	}

	targetInput := os.Args[1]
	var targets []int

	if strings.Contains(targetInput, "-") {
		// 解析范围
		parts := strings.Split(targetInput, "-")
		start, _ := strconv.Atoi(parts[0])
		end, _ := strconv.Atoi(parts[1])
		for i := start; i <= end; i++ {
			targets = append(targets, i)
		}
	} else {
		// 单个目标值
		target, _ := strconv.Atoi(targetInput)
		targets = append(targets, target)
	}

	maxNumbers := 3 // 默认最多使用3个数字
	if len(os.Args) > 2 {
		maxNumbers, _ = strconv.Atoi(os.Args[2])
	}

	precision := 1e-6
	var allResults []ExpressionResult

	for _, target := range targets {
		results := findExpressions(target, maxNumbers, precision)
		if len(results) == 0 {
			fmt.Printf("目标值 %d 未找到有效解\n", target)
		} else {
			fmt.Printf("找到目标值 %d 的 %d 种解法：\n", target, len(results))
			for _, expr := range results {
				fmt.Printf("  %s = %d\n", expr.Expr, target)
				// 保存结果
				allResults = append(allResults, ExpressionResult{
					Target: target,
					Expr:   expr.Expr,
				})
			}
		}
	}

	// 将所有结果保存为 JSON 文件
	saveResultsToJSON(allResults)
}

func findExpressions(target, maxNumbers int, precision float64) []Expression {
	numbers := generateCombinations(maxNumbers)

	// 使用通道收集结果
	resultChan := make(chan Expression, 1000)
	done := make(chan bool)

	// 创建工作池
	numWorkers := runtime.NumCPU()
	chunkSize := len(numbers) / numWorkers
	if chunkSize == 0 {
		chunkSize = 1
	}

	// 启动工作协程
	for i := 0; i < numWorkers; i++ {
		start := i * chunkSize
		end := start + chunkSize
		if i == numWorkers-1 {
			end = len(numbers)
		}

		go func(nums [][]int) {
			seen := make(map[string]bool)
			for _, combination := range nums {
				processNumberCombination(combination, float64(target), precision, seen, resultChan)
			}
			done <- true
		}(numbers[start:end])
	}

	// 收集结果
	var results []Expression
	go func() {
		received := 0
		for received < numWorkers {
			select {
			case <-done:
				received++
			case expr := <-resultChan:
				results = append(results, expr)
			}
		}
		close(resultChan)
	}()

	// 等待所有结果
	for expr := range resultChan {
		results = append(results, expr)
	}

	return results
}

func processNumberCombination(nums []int, target float64, precision float64, seen map[string]bool, resultChan chan<- Expression) {
	used := make([]bool, len(nums))
	var dfs func(string, int)

	dfs = func(expr string, depth int) {
		if depth == len(nums) {
			// 快速检查：如果表达式包含除以0的情况，直接返回
			if strings.Contains(expr, "/0") || strings.Contains(expr, "/24)") {
				return
			}

			// 验证表达式计算结果
			calculatedVal := evaluateExpression(expr)
			if math.Abs(calculatedVal-target) < precision {
				if !seen[expr] {
					seen[expr] = true
					resultChan <- Expression{Expr: expr, Val: calculatedVal}
				}
			}
			return
		}

		for i := 0; i < len(nums); i++ {
			if !used[i] {
				used[i] = true
				if depth == 0 {
					dfs(fmt.Sprintf("%d", nums[i]), 1)
				} else {
					// 优化：减少不必要的表达式生成
					if nums[i] != 0 { // 避免除以0
						dfs(fmt.Sprintf("(%s+%d)", expr, nums[i]), depth+1)
						dfs(fmt.Sprintf("(%s-%d)", expr, nums[i]), depth+1)
						dfs(fmt.Sprintf("(%d-%s)", nums[i], expr), depth+1)
						dfs(fmt.Sprintf("(%s*%d)", expr, nums[i]), depth+1)
						dfs(fmt.Sprintf("(%s/%d)", expr, nums[i]), depth+1)
						// 只在被除数大于除数时生成除法表达式
						if nums[i] <= 24 {
							dfs(fmt.Sprintf("(%d/%s)", nums[i], expr), depth+1)
						}
					}
				}
				used[i] = false
			}
		}
	}

	dfs("", 0)
}

func generateCombinations(max int) [][]int {
	var combinations [][]int
	for length := 1; length <= max; length++ {
		genCombinations(length, []int{}, &combinations)
	}
	return combinations
}

func genCombinations(length int, current []int, result *[][]int) {
	if len(current) == length {
		comb := make([]int, length)
		copy(comb, current)
		*result = append(*result, comb)
		return
	}

	// 每个位置可以是8或24
	genCombinations(length, append(current, 8), result)
	genCombinations(length, append(current, 24), result)
}

func evaluateAll(combinations [][]int, precision float64, target float64) []Expression {
	seen := make(map[string]bool)
	var results []Expression

	for _, nums := range combinations {
		used := make([]bool, len(nums))
		var dfs func(float64, string, int)

		dfs = func(currentVal float64, expr string, depth int) {
			if depth == len(nums) {
				// 验证表达式计算结果
				if validateExpression(expr, target, precision) {
					results = append(results, Expression{Expr: expr, Val: currentVal})
					seen[expr] = true
				}
				return
			}

			for i := 0; i < len(nums); i++ {
				if !used[i] {
					used[i] = true
					num := nums[i]

					if depth == 0 {
						dfs(float64(num), fmt.Sprintf("%d", num), 1)
					} else {
						// 生成所有可能的运算组合，确保括号正确
						operations := []struct {
							val  float64
							expr string
							arg1 interface{}
							arg2 interface{}
						}{
							{currentVal + float64(num), "(%s+%d)", expr, num},
							{currentVal - float64(num), "(%s-%d)", expr, num},
							{float64(num) - currentVal, "(%d-%s)", num, expr},
							{currentVal * float64(num), "(%s*%d)", expr, num},
						}

						// 特殊处理除法，确保括号正确
						if num != 0 {
							operations = append(operations, struct {
								val  float64
								expr string
								arg1 interface{}
								arg2 interface{}
							}{
								currentVal / float64(num), "(%s/%d)", expr, num,
							})
						}
						if currentVal != 0 {
							operations = append(operations, struct {
								val  float64
								expr string
								arg1 interface{}
								arg2 interface{}
							}{
								float64(num) / currentVal, "(%d/%s)", num, expr,
							})
						}

						for _, op := range operations {
							newExpr := fmt.Sprintf(op.expr, op.arg1, op.arg2)
							dfs(op.val, newExpr, depth+1)
						}
					}

					used[i] = false
				}
			}
		}

		dfs(0, "", 0)
	}

	return results
}

// 添加验证函数
func validateExpression(expr string, target float64, precision float64) bool {
	// 计算表达式的值
	val := evaluateExpression(expr)
	return math.Abs(val-target) < precision
}

func evaluateExpression(expr string) float64 {
	// 移除所有空格
	expr = strings.ReplaceAll(expr, " ", "")

	// 将中缀表达式转换为后缀表达式（逆波兰表达式）
	postfix := infixToPostfix(expr)

	// 计算后缀表达式
	return evaluatePostfix(postfix)
}

func infixToPostfix(expr string) []string {
	var result []string
	var stack []byte
	var num strings.Builder

	for i := 0; i < len(expr); i++ {
		ch := expr[i]

		switch {
		case ch >= '0' && ch <= '9':
			num.WriteByte(ch)
			// 如果是最后一个字符或下一个字符不是数字，则添加数字
			if i == len(expr)-1 || !(expr[i+1] >= '0' && expr[i+1] <= '9') {
				result = append(result, num.String())
				num.Reset()
			}
		case ch == '(':
			stack = append(stack, ch)
		case ch == ')':
			// 弹出栈中运算符直到遇到左括号
			for len(stack) > 0 && stack[len(stack)-1] != '(' {
				result = append(result, string(stack[len(stack)-1]))
				stack = stack[:len(stack)-1]
			}
			// 弹出左括号
			if len(stack) > 0 {
				stack = stack[:len(stack)-1]
			}
		case ch == '+' || ch == '-' || ch == '*' || ch == '/':
			// 处理运算符优先级
			for len(stack) > 0 && stack[len(stack)-1] != '(' &&
				precedence[stack[len(stack)-1]] >= precedence[ch] {
				result = append(result, string(stack[len(stack)-1]))
				stack = stack[:len(stack)-1]
			}
			stack = append(stack, ch)
		}
	}

	// 将剩余的运算符添加到结果中
	for len(stack) > 0 {
		result = append(result, string(stack[len(stack)-1]))
		stack = stack[:len(stack)-1]
	}

	return result
}

func evaluatePostfix(tokens []string) float64 {
	var stack []float64

	for _, token := range tokens {
		switch token {
		case "+", "-", "*", "/":
			if len(stack) < 2 {
				return 0
			}
			b := stack[len(stack)-1]
			a := stack[len(stack)-2]
			stack = stack[:len(stack)-2]

			var result float64
			switch token {
			case "+":
				result = a + b
			case "-":
				result = a - b
			case "*":
				result = a * b
			case "/":
				if b == 0 {
					return 0
				}
				result = a / b
			}
			stack = append(stack, result)
		default:
			// 将数字字符串转换为浮点数
			num, _ := strconv.ParseFloat(token, 64)
			stack = append(stack, num)
		}
	}

	if len(stack) != 1 {
		return 0
	}
	return stack[0]
}

func saveResultsToJSON(results []ExpressionResult) {
	data, err := json.MarshalIndent(results, "", "  ")
	if err != nil {
		fmt.Println("JSON 编码错误：", err)
		return
	}
	err = os.WriteFile("results.json", data, 0644)
	if err != nil {
		fmt.Println("写入文件错误：", err)
		return
	}
	fmt.Println("结果已保存到 results.json")
}
