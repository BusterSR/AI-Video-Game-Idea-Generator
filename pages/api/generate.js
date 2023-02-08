import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter valid keywords",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      //this is where i may have messed up
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text});
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Give FULL links to websites based on the prompt.

Animal: Fun recipes
Names: https://kimandkalee.com/recipes/fun-dinner-ideas/ https://www.eatthis.com/fun-recipes-fight-boredom/ https://www.tasteofhome.com/collection/fun-recipes-for-summer-vacation/
Animal: What are some fun coloring pages?
Names: https://www.crayola.com/featured/free-coloring-pages/ https://www.supercoloring.com/ https://www.hp.com/us-en/shop/tech-takes/15-best-free-printable-coloring-pages-for-kids
Animal: ${capitalizedAnimal}
Names:`;
}
