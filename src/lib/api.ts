// AI API utilities for Digital Krishi Officer

interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | Array<{
    type: 'text' | 'image_url' | 'file'
    text?: string
    image_url?: { url: string }
    file?: { filename: string; file_data: string }
  }>
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

// Custom AI API Configuration (No API keys required)
const AI_API_CONFIG = {
  url: "https://oi-server.onrender.com/chat/completions",
  headers: {
    'customerId': 'navg803@gmail.com',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  }
}

export async function callAIAPI(
  model: string, 
  messages: AIMessage[], 
  maxTokens: number = 1000
): Promise<string> {
  try {
    const response = await fetch(AI_API_CONFIG.url, {
      method: 'POST',
      headers: AI_API_CONFIG.headers,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data: AIResponse = await response.json()
    return data.choices[0]?.message?.content || "No response generated"
  } catch (error) {
    console.error('AI API Error:', error)
    throw new Error('Failed to get AI response')
  }
}

// Crop recommendation AI prompt
export function getCropRecommendationPrompt(
  location: string,
  soilType: string,
  weather: any,
  farmSize: number,
  experience: number
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are an expert agricultural advisor for Indian farmers. Provide practical, location-specific crop recommendations considering local conditions, market demand, and profitability. Always give advice in a friendly, encouraging manner that builds farmer confidence.

Guidelines:
- Consider seasonal patterns and local climate
- Recommend 3-5 suitable crops with reasons
- Include expected yield and profit margins
- Suggest intercropping opportunities when beneficial
- Consider water requirements and availability
- Factor in market demand and price trends
- Provide timeline for planting and harvesting
- Include risk mitigation strategies`
    },
    {
      role: 'user',
      content: `Please recommend the best crops for my farm:

Location: ${location}
Soil Type: ${soilType}
Farm Size: ${farmSize} acres
Experience: ${experience} years
Current Weather: ${JSON.stringify(weather)}

I need specific recommendations with expected yields, profit margins, and growing timeline. Also suggest any government schemes I might be eligible for.`
    }
  ]
}

// Disease detection AI prompt
export function getDiseaseDetectionPrompt(
  cropName: string,
  location: string,
  symptoms: string
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are an expert plant pathologist specializing in crop diseases in India. Analyze the provided information and give accurate disease diagnosis with practical treatment solutions.

Guidelines:
- Identify the most likely disease based on symptoms
- Provide confidence level (high/medium/low)
- List all visible symptoms clearly
- Recommend immediate treatment steps
- Suggest preventive measures for future
- Consider local disease patterns in the region
- Provide organic and chemical treatment options
- Include timeline for recovery
- Mention when to consult local agriculture officer`
    },
    {
      role: 'user',
      content: `Please analyze this crop disease:

Crop: ${cropName}
Location: ${location}
Observed Symptoms: ${symptoms}

Please provide:
1. Disease identification with confidence level
2. Detailed symptom analysis
3. Immediate treatment recommendations
4. Prevention strategies
5. Expected recovery timeline
6. When to seek additional help`
    }
  ]
}

// Voice query processing prompt
export function getVoiceQueryPrompt(
  query: string,
  userLocation: string,
  language: string
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are a helpful agricultural assistant for Indian farmers. Respond in ${language} when appropriate. Provide practical, actionable advice based on the farmer's query and location.

Guidelines:
- Keep responses conversational and encouraging
- Use simple, clear language
- Provide specific, actionable advice
- Consider local conditions and practices
- Reference relevant government schemes when applicable
- Always be supportive and build confidence
- Include contact information for further help when needed`
    },
    {
      role: 'user',
      content: `Farmer's query: "${query}"
Location: ${userLocation}
Language preference: ${language}

Please provide helpful advice addressing their specific question.`
    }
  ]
}

// Dosage calculation prompt
export function getDosageCalculationPrompt(
  cropName: string,
  cropStage: string,
  landArea: number,
  diseaseSeverity: string,
  treatmentType: 'fertilizer' | 'pesticide'
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are an expert agricultural scientist specializing in precision farming and sustainable agriculture. Calculate optimal dosages for treatments considering environmental impact, cost-effectiveness, and crop health.

Guidelines:
- Provide exact quantities and mixing ratios
- Consider crop stage and growth requirements
- Minimize environmental impact
- Optimize cost-effectiveness
- Include application timing and methods
- Suggest organic alternatives when possible
- Provide safety guidelines for application
- Calculate total cost estimation`
    },
    {
      role: 'user',
      content: `Calculate optimal ${treatmentType} dosage for:

Crop: ${cropName}
Growth Stage: ${cropStage}
Land Area: ${landArea} acres
Disease/Deficiency Severity: ${diseaseSeverity}

Please provide:
1. Recommended product and dosage
2. Mixing instructions and ratios  
3. Application method and timing
4. Safety precautions
5. Cost estimation
6. Expected results timeline
7. Organic alternatives if available`
    }
  ]
}

// Government schemes prompt
export function getGovernmentSchemesPrompt(
  userProfile: any,
  location: string
): AIMessage[] {
  return [
    {
      role: 'system',
      content: `You are a government schemes advisor specializing in Indian agricultural policies. Provide accurate, up-to-date information about relevant schemes based on farmer profile and location.

Guidelines:
- List schemes in order of relevance and benefit
- Provide clear eligibility criteria
- Include application process and required documents
- Mention deadlines and key dates
- Provide official website links and contact information
- Explain benefits clearly in simple terms
- Include both central and state schemes
- Mention success stories to encourage applications`
    },
    {
      role: 'user',
      content: `Please recommend government schemes for this farmer:

Profile: ${JSON.stringify(userProfile)}
Location: ${location}

Include:
1. Most relevant schemes with benefits
2. Eligibility requirements
3. Application process and deadlines
4. Required documents
5. Official registration links
6. Contact information for assistance
7. Expected approval timeline`
    }
  ]
}