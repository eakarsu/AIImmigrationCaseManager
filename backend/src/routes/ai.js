const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const { callOpenRouter } = require('../services/openrouter');
const router = express.Router();

// AI Case Assessment
router.post('/case-assessment', auth, async (req, res) => {
  try {
    const { case_type, client_nationality, current_status, description } = req.body;
    const prompt = `You are an expert immigration attorney AI assistant. Provide a detailed case assessment for the following immigration case. Format your response with clear sections using markdown headers (##), bullet points, and bold text for key points.

Case Type: ${case_type}
Client Nationality: ${client_nationality}
Current Immigration Status: ${current_status}
Case Description: ${description}

Provide:
1. **Case Strength Assessment** (Strong/Moderate/Weak with explanation)
2. **Key Requirements** to meet
3. **Potential Challenges** and how to address them
4. **Recommended Next Steps** with timeline
5. **Estimated Processing Time**
6. **Success Probability** (percentage with reasoning)`;

    const result = await callOpenRouter('You are an expert immigration law AI assistant. Provide detailed, professional analysis.', prompt);
    res.json({ assessment: result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI Document Analysis
router.post('/document-analysis', auth, async (req, res) => {
  try {
    const { document_type, document_content, case_type } = req.body;
    const prompt = `Analyze the following immigration document and provide a detailed review. Format your response professionally with markdown.

Document Type: ${document_type}
Related Case Type: ${case_type}
Document Content/Description: ${document_content}

Provide:
1. **Document Completeness** - Is all required information present?
2. **Potential Issues** - Any errors, inconsistencies, or missing information
3. **Compliance Check** - Does it meet USCIS/immigration authority requirements?
4. **Recommendations** - Specific improvements needed
5. **Risk Assessment** - Could this document cause delays or denials?`;

    const result = await callOpenRouter('You are an expert immigration document review AI assistant.', prompt);
    res.json({ analysis: result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI Legal Research
router.post('/legal-research', auth, async (req, res) => {
  try {
    const { research_topic, case_context } = req.body;
    const prompt = `Conduct immigration legal research on the following topic. Format your response professionally with markdown headers, bullet points, and clear organization.

Research Topic: ${research_topic}
Case Context: ${case_context}

Provide:
1. **Relevant Laws & Regulations** (cite specific INA sections, CFR references)
2. **Key Precedent Cases** and their implications
3. **USCIS Policy Guidance** applicable
4. **Recent Changes or Updates** in this area of law
5. **Strategic Recommendations** based on research findings
6. **Risk Factors** to consider`;

    const result = await callOpenRouter('You are an expert immigration law research AI assistant with deep knowledge of US immigration law, INA, CFR, and USCIS policies.', prompt);
    res.json({ research: result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI Form Assistance
router.post('/form-assist', auth, async (req, res) => {
  try {
    const { form_type, client_info, questions } = req.body;
    const prompt = `Help fill out the following immigration form. Format your response professionally with markdown.

Form: ${form_type}
Client Information: ${JSON.stringify(client_info)}
Specific Questions: ${questions}

Provide:
1. **Form Overview** - Purpose and key requirements
2. **Section-by-Section Guidance** with specific answers based on client info
3. **Common Mistakes** to avoid on this form
4. **Supporting Documents Needed**
5. **Filing Tips** and best practices
6. **Important Deadlines** related to this form`;

    const result = await callOpenRouter('You are an expert immigration forms assistant AI.', prompt);
    res.json({ assistance: result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI Translation
router.post('/translate', auth, async (req, res) => {
  try {
    const { text, source_language, target_language } = req.body;
    const prompt = `Translate the following text for immigration documentation purposes. Provide a certified-quality translation.

Source Language: ${source_language}
Target Language: ${target_language}
Text: ${text}

Provide:
1. **Translation** - Accurate, certified-quality translation
2. **Translation Notes** - Any cultural context or nuances
3. **Legal Terminology Notes** - Immigration-specific terms explained
4. **Certification Statement** - Standard translation certification language`;

    const result = await callOpenRouter('You are a professional certified translator specializing in immigration documents.', prompt);
    res.json({ translation: result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI Compliance Check
router.post('/compliance-check', auth, async (req, res) => {
  try {
    const { case_type, case_details, documents_submitted } = req.body;
    const prompt = `Perform a comprehensive immigration compliance check. Format professionally with markdown.

Case Type: ${case_type}
Case Details: ${case_details}
Documents Submitted: ${documents_submitted}

Provide:
1. **Compliance Status** (Compliant/Non-Compliant/Needs Review)
2. **Requirements Met** - Checklist of satisfied requirements
3. **Requirements Missing** - What still needs to be addressed
4. **Regulatory References** - Specific regulations applicable
5. **Action Items** - Prioritized list of tasks
6. **Deadline Alerts** - Any upcoming compliance deadlines`;

    const result = await callOpenRouter('You are an immigration compliance specialist AI.', prompt);
    res.json({ compliance: result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI Status Prediction
router.post('/status-prediction', auth, async (req, res) => {
  try {
    const { case_type, filing_date, service_center, case_details } = req.body;
    const prompt = `Predict the processing timeline and outcome for this immigration case. Format professionally with markdown.

Case Type: ${case_type}
Filing Date: ${filing_date}
Service Center: ${service_center}
Case Details: ${case_details}

Provide:
1. **Estimated Processing Time** with date ranges
2. **Current Processing Trends** for this case type
3. **Likelihood of RFE** (Request for Evidence)
4. **Probability of Approval** with percentage
5. **Potential Delays** and how to mitigate
6. **Recommended Actions** while waiting`;

    const result = await callOpenRouter('You are an immigration case processing prediction AI with knowledge of USCIS processing times and trends.', prompt);
    res.json({ prediction: result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
