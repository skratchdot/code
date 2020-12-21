const { debug, run } = require('../lib');

const solve1 = (lines) => {
  const ingredientCounts = {};
  const ingredientMap = {};
  const allergenMap = {};
  const ruleMap = {};
  const rules = lines.map((line) => {
    const [_, ingredientList, allergenList] = line.match(
      /(.*)\(contains (.*)\)/
    );
    const allergens = allergenList.split(', ');
    const ingredients = ingredientList.trim().split(' ');
    ingredients.forEach((ingredient) => {
      if (!ingredientMap.hasOwnProperty(ingredient)) {
        ingredientMap[ingredient] = new Set();
      }
      if (!ingredientCounts.hasOwnProperty(ingredient)) {
        ingredientCounts[ingredient] = 0;
      }
      ingredientCounts[ingredient]++;
      allergens.forEach((allergen) => {
        if (!allergenMap.hasOwnProperty(allergen)) {
          allergenMap[allergen] = new Set();
        }
        if (!ruleMap.hasOwnProperty(allergen)) {
          ruleMap[allergen] = [];
        }
        ingredientMap[ingredient].add(allergen);
        allergenMap[allergen].add(ingredient);
        ruleMap[allergen].push(ingredients);
      });
    });
    return { ingredients, allergens };
  });
  debug({ ingredientCounts, ingredientMap, allergenMap, ruleMap, rules });

  const canBeAllergen = (ingredient, allergen) => {
    const rules = ruleMap[allergen];
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].indexOf(ingredient) === -1) {
        return false;
      }
    }
    return true;
  };

  // walk through each ingredient, assmuing it is one of the possible allergens
  // you can determine it's *not* that allergen if the other rules don't pass
  const cannotBeAllergen = [];
  Object.keys(ingredientMap).forEach((ingredient) => {
    let result = false;
    [...ingredientMap[ingredient].values()].forEach((allergen) => {
      if (canBeAllergen(ingredient, allergen)) {
        result = true;
      }
    });
    if (!result) {
      cannotBeAllergen.push(ingredient);
    }
  });

  debug({ cannotBeAllergen });

  const answer = cannotBeAllergen.reduce(
    (prev, curr) => prev + ingredientCounts[curr],
    0
  );
  return answer;
};

run(__dirname, 'inputtest', solve1, 5);
run(__dirname, 'input', solve1, 1679);

/*
--- Day 21: Allergen Assessment ---

You reach the train's last stop and the closest you can get to your vacation island without getting wet. There aren't even any boats here, but nothing can stop you now: you build a raft. You just need a few days' worth of food for your journey.

You don't speak the local language, so you can't read any ingredients lists. However, sometimes, allergens are listed in a language you do understand. You should be able to use this information to determine which ingredient contains which allergen and work out which foods are safe to take with you on your trip.

You start by compiling a list of foods (your puzzle input), one food per line. Each line includes that food's ingredients list followed by some or all of the allergens the food contains.

Each allergen is found in exactly one ingredient. Each ingredient contains zero or one allergen. Allergens aren't always marked; when they're listed (as in (contains nuts, shellfish) after an ingredients list), the ingredient that contains each listed allergen will be somewhere in the corresponding ingredients list. However, even if an allergen isn't listed, the ingredient that contains that allergen could still be present: maybe they forgot to label it, or maybe it was labeled in a language you don't know.

For example, consider the following list of foods:

mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)

The first food in the list has four ingredients (written in a language you don't understand): mxmxvkd, kfcds, sqjhc, and nhms. While the food might contain other allergens, a few allergens the food definitely contains are listed afterward: dairy and fish.

The first step is to determine which ingredients can't possibly contain any of the allergens in any food in your list. In the above example, none of the ingredients kfcds, nhms, sbzzf, or trh can contain an allergen. Counting the number of times any of these ingredients appear in any ingredients list produces 5: they all appear once each except sbzzf, which appears twice.

Determine which ingredients cannot possibly contain any of the allergens in your list. How many times do any of those ingredients appear?

Your puzzle answer was 1679.
 */
