const fs = require('fs').promises;
const pdf = require('pdf-parse');
const model = require('../config/googleAI');

function chunkText(text, maxLength = 2000) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength) {
            chunks.push(currentChunk);
            currentChunk = sentence;
        } else {
            currentChunk += sentence;
        }
    }
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    return chunks;
}

async function summarizeChunk(chunk) {
    const prompt = `Please provide a concise summary of the following text: "${chunk}"`;

    try {
        const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('Error summarizing chunk:', error.message);
        return '';
    }
}


exports.summarizePDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const dataBuffer = await fs.readFile(req.file.path);
        const parsedData = await pdf(dataBuffer);
        const text = parsedData.text;

        const chunks = chunkText(text);
        const summaries = [];

        for (const chunk of chunks) {
            const summary = await summarizeChunk(chunk);
            if (summary) {
                summaries.push(summary);
            }
        }

        const finalPrompt = `Summarize the following: "${summaries.join(' ')}"`;
        const finalResult = await model.generateContent(finalPrompt);

        await fs.unlink(req.file.path);

        res.json({
            success: true,
            summary: finalResult.response.text(),
            originalFileName: req.file.originalname,
            processedChunks: chunks.length
        });

    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        
        res.status(500).json({ success: false, error: error.message });
    }
};
