function advancedCalculator(expression) {
  try {
    // Clean up the expression: remove invalid characters
    if (!/^[\d\s+\-*/%^().]+$/.test(expression)) {
      return "Error: Invalid characters in expression.";
    }

    // Replace ^ with Math.pow-compatible syntax
    expression = expression.replace(/(\d+)\s*\^\s*(\d+)/g, 'Math.pow($1, $2)');

    // Evaluate the expression using Function constructor
    const result = Function('"use strict"; return (' + expression + ')')();

    return Number.isFinite(result) ? result : "Error: Invalid calculation";
  } catch (error) {
    return "Error: Invalid expression";
  }
}

// Example usage:
console.log(advancedCalculator("3 + 5 * 2"));         // 13
console.log(advancedCalculator("10 / 2 + 6"));        // 11
console.log(advancedCalculator("2 ^ 3 + 1"));         // 9
console.log(advancedCalculator("(5 + 3) * 2"));       // 16
console.log(advancedCalculator("10 % 3 + 4"));        // 5
console.log(advancedCalculator("10 / (5 - 5)"));      // Error: Invalid calculation
console.log(advancedCalculator("2 + bad_input"));     // Error: Invalid characters in expression.
