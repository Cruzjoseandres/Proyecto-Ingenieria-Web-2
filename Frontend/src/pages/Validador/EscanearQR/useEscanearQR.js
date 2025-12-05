import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { validarQr } from '../../../../services/InscripcionService';

export const useEscanearQR = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [validando, setValidando] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const html5QrCodeRef = useRef(null);
    const scannerInitializedRef = useRef(false);

    // Extraer token de la URL del QR
    const extractTokenFromUrl = (url) => {
        try {
            // El QR contiene URL como: http://localhost:5173/validador/validar/TOKEN
            // o simplemente el path: /validador/validar/TOKEN
            const patterns = [
                /\/validador\/validar\/([a-fA-F0-9]+)/,
                /validar-qr\/([a-fA-F0-9]+)/,
                /^([a-fA-F0-9]{64})$/ // Token directo (SHA256 = 64 chars)
            ];

            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match && match[1]) {
                    return match[1];
                }
            }
            return null;
        } catch (err) {
            console.error('Error extrayendo token:', err);
            return null;
        }
    };

    // Validar el token contra el backend
    const handleValidarToken = useCallback(async (token) => {
        try {
            setValidando(true);
            setError(null);
            const data = await validarQr(token);
            setResultado(data);
        } catch (err) {
            console.error('Error al validar:', err);
            setError(err.response?.data?.message || 'Error al validar el código QR');
            setResultado(null);
        } finally {
            setValidando(false);
        }
    }, []);

    // Callback cuando se detecta un QR
    const onScanSuccess = useCallback((decodedText) => {
        console.log('QR detectado:', decodedText);

        const token = extractTokenFromUrl(decodedText);

        if (token) {
            // Detener el escaneo
            if (html5QrCodeRef.current && scannerInitializedRef.current) {
                html5QrCodeRef.current.stop().then(() => {
                    setScanning(false);
                    scannerInitializedRef.current = false;
                    handleValidarToken(token);
                }).catch(err => {
                    console.error('Error al detener scanner:', err);
                    handleValidarToken(token);
                });
            } else {
                handleValidarToken(token);
            }
        } else {
            setError('Código QR no válido. No contiene un token de inscripción.');
        }
    }, [handleValidarToken]);

    // Iniciar el escáner
    const iniciarEscaner = useCallback(async () => {
        setError(null);
        setResultado(null);
        setCameraReady(false);

        try {
            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode('qr-reader');
            }

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            await html5QrCodeRef.current.start(
                { facingMode: 'environment' },
                config,
                onScanSuccess,
                () => { } // Ignorar errores de escaneo continuo
            );

            setScanning(true);
            setCameraReady(true);
            scannerInitializedRef.current = true;
        } catch (err) {
            console.error('Error iniciando cámara:', err);
            setError('No se pudo acceder a la cámara. Verifica los permisos.');
        }
    }, [onScanSuccess]);

    // Detener el escáner
    const detenerEscaner = useCallback(async () => {
        if (html5QrCodeRef.current && scannerInitializedRef.current) {
            try {
                await html5QrCodeRef.current.stop();
                scannerInitializedRef.current = false;
            } catch (err) {
                console.error('Error deteniendo scanner:', err);
            }
        }
        setScanning(false);
        setCameraReady(false);
    }, []);

    // Escanear otro QR
    const escanearOtro = useCallback(() => {
        setResultado(null);
        setError(null);
        iniciarEscaner();
    }, [iniciarEscaner]);

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current && scannerInitializedRef.current) {
                html5QrCodeRef.current.stop().catch(err => {
                    console.error('Error limpiando scanner:', err);
                });
            }
        };
    }, []);

    const handleVolver = () => navigate('/validador');

    const formatFecha = (fecha) => {
        if (!fecha) return 'No disponible';
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Determinar estado visual
    const getEstadoVisual = () => {
        if (!resultado) return null;

        switch (resultado.estado) {
            case 'valido':
                return {
                    tipo: 'success',
                    icono: '✓',
                    titulo: 'Ingreso Válido',
                    badge: 'ACCESO AUTORIZADO',
                    badgeColor: 'success'
                };
            case 'ya_ingresado':
                return {
                    tipo: 'warning',
                    icono: '⚠',
                    titulo: 'Ya Ingresado',
                    badge: 'ENTRADA DUPLICADA',
                    badgeColor: 'warning'
                };
            case 'no_confirmado':
                return {
                    tipo: 'danger',
                    icono: '✗',
                    titulo: 'No Confirmado',
                    badge: 'PAGO PENDIENTE',
                    badgeColor: 'danger'
                };
            case 'invalido':
            default:
                return {
                    tipo: 'danger',
                    icono: '✗',
                    titulo: 'Inválido',
                    badge: 'ACCESO DENEGADO',
                    badgeColor: 'danger'
                };
        }
    };

    return {
        scanning,
        error,
        resultado,
        validando,
        cameraReady,
        iniciarEscaner,
        detenerEscaner,
        escanearOtro,
        handleVolver,
        formatFecha,
        getEstadoVisual
    };
};
