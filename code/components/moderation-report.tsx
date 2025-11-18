import { AlertCircle, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ModerationLabel {
  Confidence: number;
  Name: string;
  ParentName: string;
  TaxonomyLevel: number;
}

interface ModerationReportProps {
  labels: ModerationLabel[];
}

export function ModerationReport({ labels }: ModerationReportProps) {
  if (!labels || labels.length === 0) {
    return null;
  }

  // Group labels by TaxonomyLevel for better visualization
  const groupedByLevel = labels.reduce(
    (acc, label) => {
      if (!acc[label.TaxonomyLevel]) {
        acc[label.TaxonomyLevel] = [];
      }
      acc[label.TaxonomyLevel].push(label);
      return acc;
    },
    {} as Record<number, ModerationLabel[]>
  );

  const levels = Object.keys(groupedByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  // Get highest confidence score
  const maxConfidence = Math.max(...labels.map((l) => l.Confidence));

  return (
    <Card className="p-6 border-slate-700 bg-slate-800 bg-opacity-50 backdrop-blur">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-amber-500" />
        <h2 className="text-white text-lg font-semibold">Reporte de Moderación</h2>
      </div>

      <div className="space-y-4">
        {/* Summary */}
        <div className="p-4 bg-slate-900 bg-opacity-50 rounded-lg border border-slate-700">
          <p className="text-slate-300 text-sm">
            <span className="font-semibold">Total de Etiquetas:</span> {labels.length}
          </p>
          <p className="text-slate-300 text-sm mt-1">
            <span className="font-semibold">Confianza Máxima:</span> {maxConfidence.toFixed(2)}%
          </p>
        </div>

        {/* Labels organized by level */}
        {levels.map((level) => (
          <div key={level} className="space-y-2">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Nivel {level}
            </h3>
            <div className="space-y-2 pl-2 border-l-2 border-slate-700">
              {groupedByLevel[level].map((label, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-900 bg-opacity-50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{label.Name}</p>
                      {label.ParentName && (
                        <p className="text-slate-400 text-xs mt-1">
                          Padre: <span className="text-slate-300">{label.ParentName}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          label.Confidence > 90
                            ? 'bg-red-500 bg-opacity-20 text-red-300'
                            : label.Confidence > 70
                              ? 'bg-amber-500 bg-opacity-20 text-amber-300'
                              : 'bg-blue-500 bg-opacity-20 text-blue-300'
                        }`}
                      >
                        {label.Confidence.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-4 p-3 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-300 text-xs">
          Este reporte contiene los resultados del análisis de moderación de contenido realizado por AWS Rekognition.
        </p>
      </div>
    </Card>
  );
}
