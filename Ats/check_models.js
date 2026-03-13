const fs = require('fs');
const apiKey = "AIzaSyAOpS450cfGGB2rqlt7a-OlSs8OkIixl94";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
        let validModels = [];
        data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes("generateContent")) {
                validModels.push(m.name);
            }
        });
        fs.writeFileSync('models.json', JSON.stringify(validModels, null, 2));
    } else {
        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
    }
  })
  .catch(console.error);
