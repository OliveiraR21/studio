

'use server';

import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import { formatInTimeZone } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

interface CertificateData {
    userName: string;
    itemName: string; // Can be Module name or "Geral"
    durationInSeconds?: number;
    type: 'module' | 'general';
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

function formatDuration(totalSeconds: number): string {
    if (!totalSeconds || totalSeconds < 60) {
        return ''; // Don't show duration if it's less than a minute
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);

    const parts: string[] = [];
    if (hours > 0) {
        parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
    }
    if (minutes > 0) {
        parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
    }

    return parts.join(' e ');
}


export async function generateCertificatePdf({ userName, itemName, durationInSeconds = 0, type }: CertificateData): Promise<string> {
    try {
        const pdfDoc = await PDFDocument.create();
        const pdfTitle = type === 'general' ? 'Certificado de Conclusão Geral' : `Certificado de Conclusão - ${itemName}`;
        pdfDoc.setTitle(pdfTitle);
        pdfDoc.setAuthor('Academia Br Supply');
        pdfDoc.setCreator('Academia Br Supply');

        const page = pdfDoc.addPage([841.89, 595.28]); // A4 landscape
        const { width, height } = page.getSize();

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Define colors based on the design
        const darkBg = rgb(0.12, 0.12, 0.12);
        const white = rgb(1, 1, 1);
        const lightGray = rgb(0.8, 0.8, 0.8);
        const primaryOrange = rgb(1, 136 / 255, 46 / 255);

        // Draw background
        page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: darkBg,
        });

        // Draw decorative border
        const padding = 30;
        page.drawRectangle({
            x: padding,
            y: padding,
            width: width - padding * 2,
            height: height - padding * 2,
            borderColor: primaryOrange,
            borderWidth: 1,
        });

        // --- Logo Section (Top-Left) ---
        const logoPath = path.join(process.cwd(), 'public', 'br-supply-logo.png');
        const logoImageBytes = await fs.readFile(logoPath);
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        const logoDims = logoImage.scale(0.10);
        
        page.drawImage(logoImage, {
            x: 60,
            y: height - 60 - logoDims.height,
            width: logoDims.width,
            height: logoDims.height,
        });


        // --- Centered Text Section ---
        let currentY = height - 170; // Moved content block up

        // 1. Main Title
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
        currentY -= (titleSize + 35);

        // 2. "Conferred to" Text
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
        currentY -= (conferredSize + 20);

        // 3. User Name
        const userNameSize = 36;
        const upperUserName = userName.toUpperCase();
        const userNameWidth = boldFont.widthOfTextAtSize(upperUserName, userNameSize);
        page.drawText(upperUserName, {
            x: width / 2 - userNameWidth / 2,
            y: currentY,
            font: boldFont,
            size: userNameSize,
            color: primaryOrange,
        });
        currentY -= (userNameSize + 35);

        // 4. "for successfully completing" Text
        const reasonText = type === 'general' 
            ? 'POR CONCLUIR COM SUCESSO TODOS OS MÓDULOS DE APRENDIZAGEM DA'
            : 'POR CONCLUIR COM SUCESSO O MÓDULO:';
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
        currentY -= (reasonSize + 5);

        // Add platform name for general certificate
        if (type === 'general') {
            const platformTextPart1 = 'BR ';
            const platformTextPart2 = 'ACADEMIA SUPPLY';
            const platformTextSize = reasonSize + 2;

            const part1Width = boldFont.widthOfTextAtSize(platformTextPart1, platformTextSize);
            const part2Width = boldFont.widthOfTextAtSize(platformTextPart2, platformTextSize);
            const totalWidth = part1Width + part2Width;
            const startX = width / 2 - totalWidth / 2;

            page.drawText(platformTextPart1, {
                x: startX,
                y: currentY - 15,
                font: boldFont,
                size: platformTextSize,
                color: primaryOrange,
            });
            page.drawText(platformTextPart2, {
                x: startX + part1Width,
                y: currentY - 15,
                font: boldFont,
                size: platformTextSize,
                color: white,
            });
            currentY -= 35;
        } else {
             currentY -= 15;
        }

        // 5. Item Name (Module or nothing)
        if (type === 'module') {
            const itemNameSize = 24;
            const maxTextWidth = width - 240; // Leave some padding
            const itemNameLines = wrapText(itemName.toUpperCase(), boldFont, itemNameSize, maxTextWidth);
            const lineHeight = 30;

            for (const line of itemNameLines) {
                const itemNameWidth = boldFont.widthOfTextAtSize(line, itemNameSize);
                page.drawText(line, {
                    x: width / 2 - itemNameWidth / 2,
                    y: currentY,
                    font: boldFont,
                    size: itemNameSize,
                    color: primaryOrange,
                });
                currentY -= lineHeight;
            }
            currentY += 15; // remove extra space from last line
        }

        // 6. Add some space after the title
        currentY -= 15;

        // 7. Module Duration
        const durationString = formatDuration(durationInSeconds);
        if (durationString) {
            const durationText = `CARGA HORÁRIA TOTAL: ${durationString.toUpperCase()}`;
            const durationSize = 12;
            const durationWidth = font.widthOfTextAtSize(durationText, durationSize);
            page.drawText(durationText, {
                x: width / 2 - durationWidth / 2,
                y: currentY,
                font: font,
                size: durationSize,
                color: lightGray,
                characterSpacing: 0.5,
            });
        }


        // 8. Date (at the bottom)
        const now = new Date();
        const timeZone = 'America/Sao_Paulo';
        const completionDate = formatInTimeZone(now, timeZone, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        
        const dateText = `Concluído em ${completionDate}`;
        const dateWidth = font.widthOfTextAtSize(dateText, 12);
        page.drawText(dateText, {
            x: width / 2 - dateWidth / 2,
            y: 75, // Adjusted Y position
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
