const express = require('express');
const app = express();

app.use(express.json());

app.get('/app', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/search', (req, res) => {
  const { ingredient, cuisine, category } = req.body;
  
  Promise.all([
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`).then(r => r.json()),
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`).then(r => r.json()),
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`).then(r => r.json())
  ])
    .then(([ingredientData, categoryData, areaData]) => {
      const categoryNames = new Set(categoryData.meals?.map(m => m.strMeal) || []);
      const areaNames = new Set(areaData.meals?.map(m => m.strMeal) || []);
      
      let results = (ingredientData.meals || []).filter(meal => 
        categoryNames.has(meal.strMeal) && areaNames.has(meal.strMeal)
      );
      
      return Promise.all(results.map(meal =>
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
          .then(r => r.json())
          .then(d => d.meals[0])
      ));
    })
    .then(fullMeals => res.json(fullMeals))
    .catch(error => res.json({ error: 'Failed to fetch meals' }));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});