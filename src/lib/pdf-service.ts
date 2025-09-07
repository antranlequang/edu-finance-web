import { JobRequirementAnalysis } from './job-analysis-service';

export interface PDFReportData {
  eduscore: number;
  reasoning: string;
  userName: string;
  major: string;
  university: string;
  jobAnalysis?: JobRequirementAnalysis;
  generatedAt: Date;
}

export function generatePDFReport(data: PDFReportData): void {
  // Create a comprehensive HTML report for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EduScore Report - ${data.userName}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .report-container {
                background: white;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #667eea;
            }
            .eduscore-circle {
                width: 120px;
                height: 120px;
                border: 8px solid #667eea;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 20px auto;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                font-size: 32px;
                font-weight: bold;
            }
            .section {
                margin: 25px 0;
            }
            .section-title {
                color: #667eea;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 2px solid #f0f0f0;
            }
            .analysis-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 20px 0;
            }
            .analysis-card {
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid;
            }
            .strengths { 
                background: #f0fdf4; 
                border-left-color: #22c55e; 
            }
            .weaknesses { 
                background: #fff7ed; 
                border-left-color: #f97316; 
            }
            .recommendations { 
                background: #eff6ff; 
                border-left-color: #3b82f6; 
            }
            .jobs { 
                background: #faf5ff; 
                border-left-color: #a855f7; 
            }
            .list-item {
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .list-item:last-child {
                border-bottom: none;
            }
            .badge {
                display: inline-block;
                padding: 4px 12px;
                background: #f3f4f6;
                border-radius: 20px;
                font-size: 12px;
                margin: 2px;
                color: #374151;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
                color: #6b7280;
                font-size: 12px;
            }
            @media print {
                body { background: white !important; }
                .report-container { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="header">
                <h1 style="color: #667eea; margin: 0;">EduScore Profile Analysis</h1>
                <h2 style="color: #6b7280; font-weight: normal; margin: 10px 0;">${data.userName}</h2>
                <div class="eduscore-circle">
                    ${data.eduscore}/100
                </div>
                <p style="font-style: italic; color: #6b7280;">"${data.reasoning}"</p>
            </div>

            <div class="section">
                <div class="section-title">Academic Information</div>
                <p><strong>Major:</strong> ${data.major}</p>
                <p><strong>University:</strong> ${data.university}</p>
                <p><strong>EduScore:</strong> ${data.eduscore}/100</p>
            </div>

            ${data.jobAnalysis ? `
            <div class="analysis-grid">
                <div class="analysis-card strengths">
                    <h3 style="color: #22c55e; margin-top: 0;">Strengths</h3>
                    ${data.jobAnalysis.strengths.map(item => `<div class="list-item">• ${item}</div>`).join('')}
                </div>
                
                <div class="analysis-card weaknesses">
                    <h3 style="color: #f97316; margin-top: 0;">Areas to Improve</h3>
                    ${data.jobAnalysis.weaknesses.map(item => `<div class="list-item">• ${item}</div>`).join('')}
                </div>
            </div>

            <div class="section">
                <div class="section-title">Recommendations</div>
                <div class="analysis-card recommendations">
                    ${data.jobAnalysis.recommendations.map((item, index) => `<div class="list-item">${index + 1}. ${item}</div>`).join('')}
                </div>
            </div>

            <div class="analysis-grid">
                <div class="analysis-card jobs">
                    <h3 style="color: #a855f7; margin-top: 0;">Suitable Job Types</h3>
                    ${data.jobAnalysis.suitableJobTypes.map(item => `<span class="badge">${item}</span>`).join('')}
                </div>

                <div class="analysis-card">
                    <h3 style="color: #667eea; margin-top: 0;">Skills to Develop</h3>
                    ${data.jobAnalysis.skillsToImprove.map(item => `<span class="badge">${item}</span>`).join('')}
                </div>
            </div>
            ` : ''}

            <div class="footer">
                <p>Generated on ${data.generatedAt.toLocaleDateString('vi-VN')} at ${data.generatedAt.toLocaleTimeString('vi-VN')}</p>
                <p>🤖 Generated with HYHAN - Your Education & Career Platform</p>
            </div>
        </div>
    </body>
    </html>
  `;

  // Create a new window/tab with the report content
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (optional)
      setTimeout(() => {
        printWindow.close();
      }, 100);
    }, 500);
  } else {
    // Fallback: download as HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduscore-report-${data.userName}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export async function generatePDFFromCanvas(data: PDFReportData): Promise<void> {
  // Alternative method using HTML5 Canvas (can be extended with libraries like jsPDF)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas not supported');
    
    canvas.width = 800;
    canvas.height = 1000;
    
    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('EduScore Report', canvas.width / 2, 60);
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(data.userName, canvas.width / 2, 90);
    
    // EduScore circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 150, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 6;
    ctx.stroke();
    
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(data.eduscore.toString(), canvas.width / 2, 160);
    
    // Academic info
    ctx.textAlign = 'left';
    ctx.fillStyle = '#333333';
    ctx.font = '16px Arial';
    ctx.fillText(`Major: ${data.major}`, 50, 250);
    ctx.fillText(`University: ${data.university}`, 50, 280);
    
    // Reasoning
    ctx.font = '14px Arial';
    ctx.fillStyle = '#6b7280';
    const reasoningLines = wrapText(ctx, data.reasoning, 50, canvas.width - 100);
    let yPos = 320;
    reasoningLines.forEach(line => {
      ctx.fillText(line, 50, yPos);
      yPos += 20;
    });
    
    // Convert canvas to image and trigger download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eduscore-report-${data.userName}-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
    
  } catch (error) {
    console.error('Error generating PDF from canvas:', error);
    throw error;
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}