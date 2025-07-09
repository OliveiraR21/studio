
'use server';

import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CertificateData {
    userName: string;
    trackName: string;
}

// Helper function to wrap text
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
    const words = text.split(' ');
    if (words.length === 0) return [];
    
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + " " + word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width < maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}


export async function generateCertificatePdf({ userName, trackName }: CertificateData): Promise<string> {
    try {
        const pdfDoc = await PDFDocument.create();
        pdfDoc.setTitle(`Certificado de Conclusão - ${trackName}`);
        pdfDoc.setAuthor('Br Supply Academy Stream');
        pdfDoc.setCreator('Br Supply Academy Stream');

        const page = pdfDoc.addPage([841.89, 595.28]); // A4 landscape
        const { width, height } = page.getSize();

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Define colors based on the new design
        const darkBg = rgb(0.1, 0.1, 0.1);
        const white = rgb(1, 1, 1);
        const lightGray = rgb(0.8, 0.8, 0.8);
        const primaryOrange = rgb(1, 136 / 255, 46 / 255); // hsl(26 100% 59%)

        // Draw background
        page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: darkBg,
        });

        // Use the logo with white text for visibility on a dark background
        const logoPath = path.join(process.cwd(), 'public', 'br-supply-logo.png');
        const logoImageBytes = await fs.readFile(logoPath);
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        const logoDims = logoImage.scale(0.25);
        
        // Draw Logo on top right, ensuring it's not cut off
        page.drawImage(logoImage, {
            x: width - logoDims.width - 50, // 50px padding from the right
            y: height - logoDims.height - 50, // 50px padding from the top
            width: logoDims.width,
            height: logoDims.height,
        });

        // Main Title
        const titleText = 'CERTIFICADO';
        const titleWidth = boldFont.widthOfTextAtSize(titleText, 30);
        page.drawText(titleText, {
            x: width / 2 - titleWidth / 2,
            y: height - 200, // Moved down to give space for logo
            font: boldFont,
            size: 30,
            color: white,
        });
        
        // "Conferred to" Text
        const conferredText = 'CONFERIDO A';
        const conferredWidth = font.widthOfTextAtSize(conferredText, 14);
        page.drawText(conferredText, {
            x: width / 2 - conferredWidth / 2,
            y: height - 270, // Adjusted Y
            font: font,
            size: 14,
            color: lightGray,
            characterSpacing: 1,
        });
        
        // User Name
        const upperUserName = userName.toUpperCase();
        const userNameWidth = boldFont.widthOfTextAtSize(upperUserName, 36);
        page.drawText(upperUserName, {
            x: width / 2 - userNameWidth / 2,
            y: height - 310, // Adjusted Y
            font: boldFont,
            size: 36,
            color: primaryOrange,
        });

        // "for successfully completing" Text
        const reasonText = 'POR CONCLUIR COM SUCESSO A TRILHA:';
        const reasonWidth = font.widthOfTextAtSize(reasonText, 14);
        page.drawText(reasonText, {
            x: width / 2 - reasonWidth / 2,
            y: height - 360, // Adjusted Y
            font: font,
            size: 14,
            color: lightGray,
            characterSpacing: 1,
        });

        // Track Name (with wrapping)
        const maxTextWidth = width - 240; // Leave some padding (120px each side)
        const trackNameLines = wrapText(trackName.toUpperCase(), boldFont, 24, maxTextWidth);
        let currentY = height - 400; // Adjusted Y
        const lineHeight = 30;

        for (const line of trackNameLines) {
            const trackNameWidth = boldFont.widthOfTextAtSize(line, 24);
            page.drawText(line, {
                x: width / 2 - trackNameWidth / 2,
                y: currentY,
                font: boldFont,
                size: 24,
                color: primaryOrange,
            });
            currentY -= lineHeight;
        }

        // Date
        const completionDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        const dateText = `Concluído em ${completionDate}`;
        const dateWidth = font.widthOfTextAtSize(dateText, 12);
        page.drawText(dateText, {
            x: width / 2 - dateWidth / 2,
            y: 80,
            font: font,
            size: 12,
            color: lightGray,
        });
        
        // Save PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // Convert to Base64 data URI
        const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
        return `data:application/pdf;base64,${pdfBase64}`;

    } catch (error) {
        console.error("Failed to generate PDF:", error);
        throw new Error("Não foi possível gerar o certificado. Tente novamente mais tarde.");
    }
}
