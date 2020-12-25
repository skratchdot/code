const { run } = require('../../lib');
const peg = require('pegjs');
// copy-n-paste from: https://pegjs.org/online
// then make small tweaks
const parser = peg.generate(`
Expression
  = head:Factor tail:(_ ("*" / "+") _ Factor)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return result * element[3]; }
        if (element[1] === "+") { return result + element[3]; }
      }, head);
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Integer

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \\t\\n\\r]*
`);
const solve1 = (lines) =>
  lines.reduce((prev, curr) => prev + parser.parse(curr), 0);

run(__dirname, 'inputtest', solve1, 71);
run(__dirname, 'inputtest1', solve1, 51);
run(__dirname, 'inputtest2', solve1, 26);
run(__dirname, 'inputtest3', solve1, 437);
run(__dirname, 'inputtest4', solve1, 12240);
run(__dirname, 'inputtest5', solve1, 13632);
run(__dirname, 'input', solve1, 50956598240016);

/*
--- Day 18: Operation Order ---

As you look out the window and notice a heavily-forested continent slowly appear over the horizon, you are interrupted by the child sitting next to you. They're curious if you could help them with their math homework.

Unfortunately, it seems like this "math" follows different rules than you remember.

The homework (your puzzle input) consists of a series of expressions that consist of addition (+), multiplication (*), and parentheses ((...)). Just like normal math, parentheses indicate that the expression inside must be evaluated before it can be used by the surrounding expression. Addition still finds the sum of the numbers on both sides of the operator, and multiplication still finds the product.

However, the rules of operator precedence have changed. Rather than evaluating multiplication before addition, the operators have the same precedence, and are evaluated left-to-right regardless of the order in which they appear.

For example, the steps to evaluate the expression 1 + 2 * 3 + 4 * 5 + 6 are as follows:

1 + 2 * 3 + 4 * 5 + 6
3   * 3 + 4 * 5 + 6
    9   + 4 * 5 + 6
        13   * 5 + 6
            65   + 6
                71

Parentheses can override this order; for example, here is what happens if parentheses are added to form 1 + (2 * 3) + (4 * (5 + 6)):

1 + (2 * 3) + (4 * (5 + 6))
1 +    6    + (4 * (5 + 6))
    7      + (4 * (5 + 6))
    7      + (4 *   11   )
    7      +     44
            51

Here are a few more examples:

    2 * 3 + (4 * 5) becomes 26.
    5 + (8 * 3 + 9 + 3 * 4 * 3) becomes 437.
    5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) becomes 12240.
    ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 becomes 13632.

Before you can help with the homework, you need to understand it yourself. Evaluate the expression on each line of the homework; what is the sum of the resulting values?

Your puzzle answer was 50956598240016.
 */
