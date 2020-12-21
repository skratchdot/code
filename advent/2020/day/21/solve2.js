const { debug, run } = require('../lib');

const solve2 = (lines) => {
  // initialized via initData()
  let ingredientCounts = {};
  let ingredientMap = {};
  let allergenMap = {};
  let ruleMap = {};

  // here are our rules
  const rules = lines.map((line) => {
    const [_, ingredientList, allergenList] = line.match(
      /(.*)\(contains (.*)\)/
    );
    const allergens = allergenList.split(', ');
    const ingredients = ingredientList.trim().split(' ');
    return { ingredients, allergens };
  });

  const initData = (rules) => {
    ingredientCounts = {};
    ingredientMap = {};
    allergenMap = {};
    ruleMap = {};

    rules.forEach((rule) => {
      const { ingredients, allergens } = rule;
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
    });
  };
  initData(rules);

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

  const croppedRules = rules.map((rule) => {
    const { ingredients, allergens } = rule;
    return {
      ingredients: ingredients.filter(
        (v) => cannotBeAllergen.indexOf(v) === -1
      ),
      allergens,
    };
  });
  initData(croppedRules);
  debug({ croppedRules, ingredientMap, allergenMap });

  let stillSolving = true;
  const found = [];
  while (stillSolving) {
    stillSolving = false;
    // remove anything that doesn't pass our canBeAllergen() check
    Object.keys(allergenMap).forEach((allergen) => {
      [...allergenMap[allergen].values()].forEach((ingredient) => {
        if (!canBeAllergen(ingredient, allergen)) {
          allergenMap[allergen].delete(ingredient);
        }
      });
    });

    // remove "found" items
    Object.keys(allergenMap).forEach((allergen) => {
      if (allergenMap[allergen].size === 1) {
        const ingredient = [...allergenMap[allergen].values()][0];
        found.push({
          allergen,
          ingredient,
        });
        delete allergenMap[allergen];
        Object.keys(allergenMap).forEach((a) => {
          allergenMap[a].delete(ingredient);
        });
      }
    });

    // keep going if we haven't found everything
    if (Object.keys(allergenMap).length) {
      stillSolving = true;
    }

    debug({ allergenMap, found });
  }

  const dangerousIngredientList = found
    .sort((a, b) => a.allergen.localeCompare(b.allergen))
    .map((v) => v.ingredient);

  return dangerousIngredientList.join(',');
};

run(__dirname, 'inputtest', solve2, 'mxmxvkd,sqjhc,fvjkl');
run(
  __dirname,
  'input',
  solve2,
  'lmxt,rggkbpj,mxf,gpxmf,nmtzlj,dlkxsxg,fvqg,dxzq'
);

/*
--- Part Two ---

Now that you've isolated the inert ingredients, you should have enough information to figure out which ingredient contains which allergen.

In the above example:

    mxmxvkd contains dairy.
    sqjhc contains fish.
    fvjkl contains soy.

Arrange the ingredients alphabetically by their allergen and separate them by commas to produce your canonical dangerous ingredient list. (There should not be any spaces in your canonical dangerous ingredient list.) In the above example, this would be mxmxvkd,sqjhc,fvjkl.

Time to stock your raft with supplies. What is your canonical dangerous ingredient list?

Your puzzle answer was lmxt,rggkbpj,mxf,gpxmf,nmtzlj,dlkxsxg,fvqg,dxzq.
 */
