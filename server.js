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
      console.log('Ingredient (pasta):', ingredientData.meals ? ingredientData.meals.length : 'NO MEALS');
      console.log('Category (Pasta):', categoryData.meals ? categoryData.meals.length : 'NO MEALS');
      console.log('Area (Italian):', areaData.meals ? areaData.meals.length : 'NO MEALS');
      

      
      res.json(results);
    })
    .catch(error => {
      console.log('Catch error:', error);
      res.json({ error: 'Failed to fetch meals' });
    });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});