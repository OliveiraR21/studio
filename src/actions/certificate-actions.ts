
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

        // --- Dynamic Layout Section ---
        let currentY = height - 60; // Start with a top margin

        // Use the logo with white text for visibility on a dark background
        const logoPath = path.join(process.cwd(), 'public', 'br-supply-logo.png');
        const logoImageBytes = await fs.readFile(logoPath);
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        const logoDims = logoImage.scale(0.25); // Correctly scaled logo
        
        // 1. Draw Logo, centered
        page.drawImage(logoImage, {
            x: width / 2 - logoDims.width / 2,
            y: currentY - logoDims.height,
            width: logoDims.width,
            height: logoDims.height,
        });
        currentY -= (logoDims.height + 50); // Move Y down past logo + gap

        // 2. Main Title
        const titleText = 'CERTIFICADO';
        const titleSize = 30;
        const titleWidth = boldFont.widthOfTextAtSize(titleText, titleSize);
        page.drawText(titleText, {
            x: width / 2 - titleWidth / 2,
            y: currentY,
            font: boldFont,
            size: titleSize,
            color: white,
        });
        currentY -= (titleSize + 30);

        // 3. "Conferred to" Text
        const conferredText = 'CONFERIDO A';
        const conferredSize = 14;
        const conferredWidth = font.widthOfTextAtSize(conferredText, conferredSize);
        page.drawText(conferredText, {
            x: width / 2 - conferredWidth / 2,
            y: currentY,
            font: font,
            size: conferredSize,
            color: lightGray,
            characterSpacing: 1,
        });
        currentY -= (conferredSize + 25);

        // 4. User Name
        const userNameSize = 36;
        const upperUserName = userName.toUpperCase();
        const userNameWidth = boldFont.widthOfTextAtSize(upperUserName, userNameSize);
        page.drawText(upperUserName, {
            x: width / 2 - userNameWidth / 2,
            y: currentY - userNameSize,
            font: boldFont,
            size: userNameSize,
            color: primaryOrange,
        });
        currentY -= (userNameSize + 40);

        // 5. "for successfully completing" Text
        const reasonText = 'POR CONCLUIR COM SUCESSO A TRILHA:';
        const reasonSize = 14;
        const reasonWidth = font.widthOfTextAtSize(reasonText, reasonSize);
        page.drawText(reasonText, {
            x: width / 2 - reasonWidth / 2,
            y: currentY,
            font: font,
            size: reasonSize,
            color: lightGray,
            characterSpacing: 1,
        });
        currentY -= (reasonSize + 25);

        // 6. Track Name (with wrapping)
        const trackNameSize = 24;
        const maxTextWidth = width - 240; // Leave some padding
        const trackNameLines = wrapText(trackName.toUpperCase(), boldFont, trackNameSize, maxTextWidth);
        const lineHeight = 30;
        currentY -= trackNameSize;

        for (const line of trackNameLines) {
            const trackNameWidth = boldFont.widthOfTextAtSize(line, trackNameSize);
            page.drawText(line, {
                x: width / 2 - trackNameWidth / 2,
                y: currentY,
                font: boldFont,
                size: trackNameSize,
                color: primaryOrange,
            });
            currentY -= lineHeight;
        }

        // 7. Date (at the bottom)
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
