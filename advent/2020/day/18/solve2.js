const { run } = require('../lib');
const peg = require('pegjs');
// copy-n-paste from: https://pegjs.org/online
// then make small tweaks
const parser = peg.generate(`
Expression
  = head:Term tail:(_ ("*") _ Term)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return result * element[3]; }
      }, head);
    }

Term
  = head:Factor tail:(_ ("+") _ Factor)* {
      return tail.reduce(function(result, element) {
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
const solve2 = (lines) =>
  lines.reduce((prev, curr) => prev + parser.parse(curr), 0);

run(__dirname, 'inputtest', solve2, 231);
run(__dirname, 'inputtest1', solve2, 51);
run(__dirname, 'inputtest2', solve2, 46);
run(__dirname, 'inputtest3', solve2, 1445);
run(__dirname, 'inputtest4', solve2, 669060);
run(__dirname, 'inputtest5', solve2, 23340);
run(__dirname, 'input', solve2, 535809575344339);

/*
--- Part Two ---

You manage to answer the child's questions and they finish part 1 of their homework, but get stuck when they reach the next section: advanced math.

Now, addition and multiplication have different precedence levels, but they're not the ones you're familiar with. Instead, addition is evaluated before multiplication.

For example, the steps to evaluate the expression 1 + 2 * 3 + 4 * 5 + 6 are now as follows:

1 + 2 * 3 + 4 * 5 + 6
3   * 3 + 4 * 5 + 6
3   *   7   * 5 + 6
3   *   7   *  11
    21       *  11
        231

Here are the other examples from above:

    1 + (2 * 3) + (4 * (5 + 6)) still becomes 51.
    2 * 3 + (4 * 5) becomes 46.
    5 + (8 * 3 + 9 + 3 * 4 * 3) becomes 1445.
    5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4)) becomes 669060.
    ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2 becomes 23340.

What do you get if you add up the results of evaluating the homework problems using these new rules?

Your puzzle answer was 535809575344339.
*/
