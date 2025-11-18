'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Upload, CheckCircle, Loader, Shield } from 'lucide-react';
import { ModerationReport } from '@/components/moderation-report';

interface ModerationLabel {
  Confidence: number;
  Name: string;
  ParentName: string;
  TaxonomyLevel: number;
}

export default function ImageUploadPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [moderationLabels, setModerationLabels] = useState<ModerationLabel[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para comprimir imagen (similar al script Python)
  const compressImage = (file: File, maxSizeMB: number = 6, quality: number = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones
        const MAX_DIMENSION = 1280;
        let { width, height } = img;
        
        if (Math.max(width, height) > MAX_DIMENSION) {
          const ratio = MAX_DIMENSION / Math.max(width, height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
          console.log(`Redimensionando de ${img.width}x${img.height} a ${width}x${height}`);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con compresión
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al comprimir imagen'));
              return;
            }
            
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64 = result.split(',')[1];
              
              const compressedSizeMB = (base64.length * 3/4) / (1024 * 1024);
              console.log(`Tamaño después de compresión: ${compressedSizeMB.toFixed(2)} MB`);
              
              resolve(base64);
            };
            reader.onerror = () => reject(new Error('Error al leer imagen comprimida'));
            reader.readAsDataURL(blob);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Error al cargar imagen'));
      
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setModerationLabels([]);

    if (!apiUrl) {
      setMessage({ type: 'error', text: 'Por favor, ingresa la URL del API' });
      return;
    }

    if (!image) {
      setMessage({ type: 'error', text: 'Por favor, selecciona una imagen' });
      return;
    }

    setLoading(true);

    try {
      // Comprimir imagen antes de enviar
      const originalSizeMB = image.size / 1024 / 1024;
      console.log(`Procesando imagen: ${image.name} (${originalSizeMB.toFixed(2)} MB)`);
      
      setMessage({ type: 'success', text: `Procesando imagen de ${originalSizeMB.toFixed(2)} MB...` });
      
      const base64String = await compressImage(image);
      const finalSizeMB = (base64String.length * 3/4) / (1024 * 1024);
      
      const reduction = ((originalSizeMB - finalSizeMB) / originalSizeMB * 100);
      console.log(`Compresión: ${originalSizeMB.toFixed(2)} MB → ${finalSizeMB.toFixed(2)} MB (${reduction.toFixed(1)}% reducción)`);
      
      setMessage({ type: 'success', text: `Imagen comprimida: ${finalSizeMB.toFixed(2)} MB (${reduction.toFixed(1)}% reducción)` });
      
      if (finalSizeMB > 10) {
        setMessage({ type: 'error', text: `Imagen demasiado grande: ${finalSizeMB.toFixed(2)} MB. Máximo permitido: 10 MB` });
        return;
      }
        
      console.log('Enviando base64 de longitud:', base64String.length, 'caracteres');
      console.log(`Tamaño final: ${finalSizeMB.toFixed(2)} MB`);

      // Estrategia múltiple para manejar CORS
      let success = false;
      let responseData: any = null;

      // Intento 1: CORS normal (si la Lambda está actualizada)
      try {
        console.log('Intento 1: CORS normal');
        const corsResponse = await fetch(apiUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: base64String,
        });
        
        if (corsResponse.ok) {
          responseData = await corsResponse.json();
          success = true;
          console.log('CORS exitoso!', responseData);
        } else {
          console.log('CORS falló con status:', corsResponse.status);
        }
      } catch (corsError) {
        console.log('CORS falló:', corsError);
      }

      // Intento 2: no-cors si CORS falló
      if (!success) {
        try {
          console.log('Intento 2: no-cors');
          await fetch(apiUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: base64String,
          });
          success = true;
          console.log('no-cors completado (sin acceso a respuesta)');
        } catch (noCorsError) {
          console.log('no-cors falló:', noCorsError);
        }
      }

      if (success) {
        if (responseData && Array.isArray(responseData)) {
          setModerationLabels(responseData);
          
          // Evaluar si la imagen es apta para publicación
          if (responseData.length === 0) {
            // No hay etiquetas de moderación - imagen apta
            setMessage({ 
              type: 'success', 
              text: '✅ ¡Imagen apta para publicación! No se detectó contenido inapropiado.' 
            });
          } else {
            // Verificar si hay etiquetas con más del 90% de confianza
            const highConfidenceLabels = responseData.filter((label: ModerationLabel) => label.Confidence > 90);
            
            if (highConfidenceLabels.length > 0) {
              setMessage({ 
                type: 'error', 
                text: `❌ Imagen NO apta para publicación. Se detectó contenido inapropiado con alta confianza (${highConfidenceLabels.length} etiqueta${highConfidenceLabels.length > 1 ? 's' : ''} > 90%).` 
              });
            } else {
              setMessage({ 
                type: 'success', 
                text: `⚠️ Imagen procesada. Se detectaron ${responseData.length} etiqueta${responseData.length > 1 ? 's' : ''} de moderación con baja confianza.` 
              });
            }
          }
        } else if (responseData) {
          console.log('Respuesta inesperada:', responseData);
          setMessage({ type: 'success', text: '¡Imagen enviada exitosamente!' });
        } else {
          setMessage({ type: 'success', text: '¡Imagen enviada! (Sin acceso a resultado por limitaciones CORS)' });
        }
        
        // No limpiar la imagen ni el preview para que el usuario pueda ver el resultado junto con la imagen
        // setImage(null);
        // setPreview('');
      } else {
        setMessage({ type: 'error', text: 'No se pudo enviar la imagen. Verifica la URL del API.' });
      }

    } catch (error) {
      console.error('Error al enviar:', error);
      
      let errorMessage = 'Error desconocido';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Error de conexión: Verifique que la URL del API sea correcta y esté accesible.';
      } else if (error instanceof Error) {
        errorMessage = error.message; }
      
      setMessage({ type: 'error', text: `Error al enviar: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 text-balance">
            Moderador de Contenido
            <br/>
            --------<br/>
            ExpoASI UNAL
          </h1>
          <p className="text-slate-400 text-lg">
            Envio de imagenes en base64 hacia api personalizado 
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API URL Input */}
          <Card className="p-6 border-slate-700 bg-slate-800 bg-opacity-50 backdrop-blur">
            <Label className="text-white text-base font-semibold mb-3 block">
              URL del API
            </Label>
            <Input
              type="url"
              placeholder=""
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-2">
              Ingresa la URL completa donde deseas enviar la imagen en Base64
            </p>
          </Card>

          {/* Image Upload Area */}
          <Card className="p-6 border-slate-700 bg-slate-800 bg-opacity-50 backdrop-blur">
            <Label className="text-white text-base font-semibold mb-3 block">
              Selecciona o arrastra una imagen
            </Label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragDrop}
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer block">
                <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-slate-300 font-medium mb-1">
                  Haz clic o arrastra una imagen aquí
                </p>
                <p className="text-xs text-slate-500">
                  Soporta: JPG, PNG, GIF, WebP
                </p>
              </label>
            </div>
          </Card>

          {/* Image Preview */}
          {preview && (
            <Card className="p-6 border-slate-700 bg-slate-800 bg-opacity-50 backdrop-blur">
              <Label className="text-white text-base font-semibold mb-3 block">
                Vista previa
              </Label>
              <div className="rounded-lg overflow-hidden bg-slate-900 p-4">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-contain mx-auto"
                />
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Archivo: {image?.name} ({(image?.size || 0 / 1024).toFixed(2)} KB)
              </p>
            </Card>
          )}

          {/* Message Alert */}
          {message && (
            <div
              className={`p-4 rounded-lg flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30'
                  : 'bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={
                  message.type === 'success' ? 'text-green-300' : 'text-red-300'
                }
              >
                {message.text}
              </p>
            </div>
          )}

          {/* Test Connection Button */}
          <Button
            type="button"
            onClick={async () => {
              if (!apiUrl) {
                setMessage({ type: 'error', text: 'Por favor, ingresa la URL del API primero' });
                return;
              }
              
              setMessage(null);
              try {
                console.log('Probando conexión con:', apiUrl);
                
                const testResponse = await fetch(apiUrl, {
                  method: 'OPTIONS',
                  mode: 'cors',
                });
                
                console.log('Test response status:', testResponse.status);
                console.log('Test response headers:', Object.fromEntries(testResponse.headers));
                
                if (testResponse.status === 200) {
                  setMessage({ type: 'success', text: '✅ Conexión exitosa! El API es accesible.' });
                } else {
                  setMessage({ type: 'error', text: `⚠️ API responde pero con status ${testResponse.status}` });
                }
              } catch (error) {
                console.error('Test connection error:', error);
                setMessage({ type: 'error', text: `❌ No se puede conectar al API: ${error instanceof Error ? error.message : 'Error desconocido'}` });
              }
            }}
            disabled={!apiUrl}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
          >
            <Shield className="w-4 h-4" />
            Probar Conexión al API
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !apiUrl || !image}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Enviar Imagen
              </>
            )}
          </Button>
        </form>

        {moderationLabels.length > 0 && (
          <div className="mt-6">
            <ModerationReport labels={moderationLabels} />
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 p-6 rounded-lg bg-slate-800 bg-opacity-30 border border-slate-700">
          <p className="text-slate-400 text-sm">
            <span className="font-semibold text-slate-300">ℹ️ Información:</span> La imagen será convertida a formato Base64 puro y enviada directamente como body de la petición (Content-Type: text/plain). Compatible con AWS Lambda que espera el base64 directamente.
          </p>
        </div>
      </div>
    </div>
  );
}
