import { extractWithNvidia } from "../utils/ai.utils.js";
import Extraction from "../model/extraction.models.js";

export const extractFileContent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image."
            });
        }

        const base64 = req.file.buffer.toString("base64");
        const imageData = `data:${req.file.mimetype};base64,${base64}`;

        const prompt = `
Analyze this image and extract visible information.

If it contains a resume, extract:
- Name
- Email
- Phone
- Skills
- Education
- Experience
- Projects

If it contains a LinkedIn recruitment post, extract:
- Recruiter email, if visible
- Recruiter or author name
- Company
- Job role
- Required skills
- Post content

Return valid JSON. Use null for missing information.
Do not invent or guess information.
`;

        const extractedContent = await extractWithNvidia(
            prompt,
            imageData
        );
       
        let parsedData = null;
        try {
            const jsonMatch = extractedContent.match(/\{[\s\S]*\}/);
            const toParse = jsonMatch ? jsonMatch[0] : extractedContent;
            parsedData = JSON.parse(toParse); 
            //extractedContent is a string.
            //parsedData is now a JavaScript object containing that string
        } catch (parseError) {
            console.warn("Could not parse extracted JSON, saving raw content:", parseError.message);
            parsedData = { rawContent: extractedContent };
        }

        const savedExtraction = await Extraction.create({
            data: parsedData,
            rawContent: extractedContent,
            createdBy: req.user._id,
        });

        return res.status(200).json({
            success: true,
            message: "Content extracted and saved successfully",
            extractionId: savedExtraction._id,
            extractedContent: parsedData
        });

    } catch (error) {
        console.error("Image extraction error:", {
            message: error.message,
            status: error.response?.status,
            details: error.response?.data
        });  

        return res.status(error.response?.status || 500).json({
            success: false,
            message:
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message ||
                "Failed to extract image content."
        });
    }
};
