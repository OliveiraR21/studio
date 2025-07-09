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
        
        // Draw Logo on top right
        page.drawImage(logoImage, {
            x: width - logoDims.width - 60,
            y: height - 100,
            width: logoDims.width,
            height: logoDims.height,
        });

        // Main Title
        page.drawText('CERTIFICADO', {
            x: width / 2,
            y: height - 180,
            font: boldFont,
            size: 30,
            color: white,
            xAlignment: 'center',
        });
        
        // "Conferred to" Text
        page.drawText('CONFERIDO A', {
            x: width / 2,
            y: height - 250,
            font: font,
            size: 14,
            color: lightGray,
            xAlignment: 'center',
            characterSpacing: 1,
        });
        
        // User Name
        page.drawText(userName.toUpperCase(), {
            x: width / 2,
            y: height - 290,
            font: boldFont,
            size: 36,
            color: primaryOrange,
            xAlignment: 'center',
        });

        // "for successfully completing" Text
        page.drawText('POR CONCLUIR COM SUCESSO A TRILHA:', {
            x: width / 2,
            y: height - 340,
            font: font,
            size: 14,
            color: lightGray,
            xAlignment: 'center',
            characterSpacing: 1,
        });

        // Track Name
        page.drawText(trackName.toUpperCase(), {
            x: width / 2,
            y: height - 380,
            font: boldFont,
            size: 24,
            color: primaryOrange,
            xAlignment: 'center',
        });

        // Date
        const completionDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        const dateText = `Concluído em ${completionDate}`;
        page.drawText(dateText, {
            x: width / 2,
            y: 80,
            font: font,
            size: 12,
            color: lightGray,
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
