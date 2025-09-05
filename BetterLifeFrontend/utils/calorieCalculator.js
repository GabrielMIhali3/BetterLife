const caloriesBurnedPerHour = {
    '40-50': { calories_min: 210, calories_max: 250 },
    '51-60': { calories_min: 250, calories_max: 300 },
    '61-70': { calories_min: 300, calories_max: 350 },
    '71-80': { calories_min: 350, calories_max: 400 },
    '81-90': { calories_min: 400, calories_max: 450 },
    '91-100': { calories_min: 450, calories_max: 500 },
    '101-110': { calories_min: 500, calories_max: 550 },
    '111-120': { calories_min: 550, calories_max: 600 },
  };
  
  function getCaloriesBurned(weight) {
    for (let range in caloriesBurnedPerHour) {
      const [min, max] = range.split('-').map(Number);
      if (weight >= min && weight <= max) {
        return caloriesBurnedPerHour[range];
      }
    }
    return null;
  }
  
  function calculateTimeToBurnCalories(weightUser, kcal, weightProduct) {
    const caloriesToBurn = (kcal / 100) * weightProduct;
    const calories = getCaloriesBurned(weightUser);
  
    if (calories) {
      let { calories_min, calories_max } = calories;
  
      let timeMin = 60;
      let timeMax = 60;
  
      return Math.floor(timeMin);
    } else {
      return null;
    }
  }
  
  export { calculateTimeToBurnCalories };
  