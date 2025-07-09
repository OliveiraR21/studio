'use server';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CertificateData {
    userName: string;
    trackName: string;
}

export async function generateCertificatePdf({ userName, trackName }: CertificateData): Promise<string> {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([841.89, 595.28]); // A4 landscape
        const { width, height } = page.getSize();

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Use the logo with black text for better visibility on a white background
        const logoPath = path.join(process.cwd(), 'public', 'BrSupply.png');
        const logoImageBytes = await fs.readFile(logoPath);
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        const logoDims = logoImage.scale(0.25);
        
        // Draw Logo
        page.drawImage(logoImage, {
            x: width / 2 - logoDims.width / 2,
            y: height - 100,
            width: logoDims.width,
            height: logoDims.height,
        });

        // Title
        page.drawText('Certificado de Conclusão', {
            x: width / 2,
            y: height - 180,
            font: boldFont,
            size: 32,
            color: rgb(0.1, 0.1, 0.1),
            lineHeight: 34,
            xAlignment: 'center',
        });
        
        // Main Text
        page.drawText('Certificamos que', {
            x: width / 2,
            y: height - 250,
            font: font,
            size: 20,
            color: rgb(0.2, 0.2, 0.2),
            xAlignment: 'center',
        });
        
        // User Name
        page.drawText(userName, {
            x: width / 2,
            y: height - 290,
            font: boldFont,
            size: 28,
            color: rgb(0.96, 0.45, 0.13), // Br Supply Orange: hsl(26 100% 59%)
            xAlignment: 'center',
        });

        // Track Text
        page.drawText('concluiu com sucesso a trilha de conhecimento:', {
            x: width / 2,
            y: height - 340,
            font: font,
            size: 16,
            color: rgb(0.2, 0.2, 0.2),
            xAlignment: 'center',
        });

        // Track Name
        page.drawText(trackName, {
            x: width / 2,
            y: height - 370,
            font: boldFont,
            size: 22,
            color: rgb(0.1, 0.1, 0.1),
            xAlignment: 'center',
        });

        // Date
        const completionDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        const dateText = `Concluído em: ${completionDate}`;
        page.drawText(dateText, {
            x: width / 2,
            y: height - 450,
            font: font,
            size: 12,
            color: rgb(0.4, 0.4, 0.4),
            xAlignment: 'center',
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
