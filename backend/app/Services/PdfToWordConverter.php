<?php

namespace App\Services;

class PdfToWordConverter
{
    /**
     * Convert PDF to Word using LibreOffice.
     *
     * @param string \$pdfPath
     * @param string \$outputDir
     * @return string|null
     */
    public static function convert(string \$pdfPath, string \$outputDir): ?string
    {
        if (!file_exists(\$pdfPath)) {
            return null;
        }

        if (!is_dir(\$outputDir)) {
            mkdir(\$outputDir, 0755, true);
        }

        \$command = sprintf(
            'libreoffice --headless --convert-to docx "%s" --outdir "%s" 2>&1',
            escapeshellcmd(\$pdfPath),
            escapeshellcmd(\$outputDir)
        );

        exec(\$command, \$output, \$returnVar);

        if (\$returnVar !== 0) {
            return null;
        }

        \$docxFilename = pathinfo(\$pdfPath, PATHINFO_FILENAME) . '.docx';
        return rtrim(\$outputDir, '/') . '/' . \$docxFilename;
    }
}
