const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: process.env.AI_ENDPOINT,
  apiKey: process.env.AI_API_KEY,
});

const analyzeRequirements = async (input) => {
  const response = await client.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: [
      {
        role: "system",
        content: `Analyze the provided client requirements as if you are a pre-sales requirement analyst. 

        Return only valid JSON using the same keys and data types as the following example. Generate all values based on the provided client requirements.

        Do not wrap the JSON in Markdown code fences, and do not include any text before or after it.

        { 
          "summary": "The client needs a CRM system to manage customers, sales opportunities, reporting, access control, and ERP integration.", 
          "mainFeatures": [ 
            "Customer management", 
            "Sales pipeline tracking", 
            "Reporting dashboards", 
            "Role-based access", 
            "ERP integration" 
          ], 
          "technicalNeeds": [ 
            "Backend APIs", 
            "Database design", 
            "Authentication and authorization", 
            "Integration with external ERP system", 
            "Reporting module" 
          ], 
          "risks": [ 
            "ERP integration details are not clear", 
            "Required user roles are not fully defined", 
            "Reporting requirements need more clarification" 
          ], 
          "questions": [
            "Which ERP system should be integrated?", 
            "What user roles should the system support?", 
            "Are the reports fixed or customizable?", 
            "Is there a preferred technology stack?" 
        ], 
        "complexity": "medium" 
      }


        summary: This is a short summary of the client requirements.

        mainFeatures: This is a list of the main features of the client requirements. It needs to be an array of strings with each main feature as a string.

        technicalNeeds: This is a list of the possible technical needs or system components of the client requirements.It needs to be an array of strings with each technical need as a string.

        risks: This is a list of the risks, unclear points, or missing information. It needs to be an array of strings with each point as a string.

        questions: This is a list of the questions that should be asked to the client. It needs to be an array of strings with each question as a string.
        
        complexity: Return exactly one of these values: "low", "medium", or "high", based on the complexity of the client requirements.

        `,
      },
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });

  const content = response.choices[0].message.content;
  const analysis = JSON.parse(content);

  return analysis;
};

module.exports = analyzeRequirements;
