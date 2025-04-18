'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { StaticCanvas, FabricText } from 'fabric';

import qrbg from '@/assets/QRCard.png';
import qricon from '@/assets/qr-block-icon.png';
import { headwearParts } from '@/components/character-editor/headwear-parts';
import { headParts } from '@/components/character-editor/head-parts';
import { patternParts } from '@/components/character-editor/patterns';
import torso from '@/assets/character-editor/body/torso.png';
import hands from '@/assets/character-editor/body/hands.png';

import { loadImage, applyInvertFilter, createSVG, createQRSVG, SVG_SLEEVE, SVG_TORSO } from '@/utils/canvasUtils';
import { GlareCard } from '@/components/ui/glare-card';

export default function CardImagePage() {
    const scaleFactor = 0.75;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvasInstance, setCanvasInstance] = useState<StaticCanvas | null>(null);
    const params = useParams();
    const qrgenerator = params.qrgenerator as string[];
    const [userId, headwearId, headId, patternId, playerColor, patternTone] = qrgenerator;

    useEffect(() => {
        const partCategories = [headParts, headwearParts, patternParts];
        const selectedImages = [
            partCategories[0][Number(headwearId)],
            partCategories[1][Number(headId)],
            partCategories[2][Number(patternId)],
        ];

        if (!canvasRef.current) return;

        const canvas = new StaticCanvas(canvasRef.current, {
            width: 594 * scaleFactor,
            height: 942 * scaleFactor,
        });
        // Cargar y agregar las imágenes al canvas
        const loadAndDrawImages = async () => {
            try {
                // Imagen de fondo
                const backgroundImage = await loadImage(qrbg.src, {
                    scaleX: canvas.width / 594,
                    scaleY: canvas.height / 942,
                });
                canvas.backgroundImage = backgroundImage;

                // Figura 1
                await loadAndAddImage(torso.src, { left: (52 * scaleFactor), top: (5 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor) });
                const svg1 = await createSVG(SVG_SLEEVE.replace(/COLOR/g, playerColor), true);
                if (svg1) {
                    svg1.set({ left: (192 * scaleFactor), top: (221 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor) });
                    canvas.add(svg1);
                }
                const svg2 = await createSVG(SVG_TORSO.replace(/COLOR/g, playerColor));
                if (svg2) {
                    svg2.set({ left: (227 * scaleFactor), top: (209 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor) });
                    canvas.add(svg2);
                }
                await loadAndAddImage(hands.src, { left: (52 * scaleFactor), top: (5 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor) });

                // Figura 2
                await loadAndAddImage(torso.src, { left: (52 * scaleFactor), top: (444 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor), flipY: true });
                const svg3 = await createSVG(SVG_SLEEVE.replace(/COLOR/g, playerColor), true);
                if (svg3) {
                    svg3.set({ left: (192 * scaleFactor), top: (627 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor), flipY: true });
                    canvas.add(svg3);
                }
                const svg4 = await createSVG(SVG_TORSO.replace(/COLOR/g, playerColor));
                if (svg4) {
                    svg4.set({ left: (227 * scaleFactor), top: (615 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor), flipY: true });
                    canvas.add(svg4);
                }
                loadAndAddImage(hands.src, { left: (52 * scaleFactor), top: (444 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor), flipY: true });
                
                // Partes seleccionadas en figura 1
                for (let i = 0; i < selectedImages.length; i++) {
                    const part = selectedImages[i];
                    if (!part) continue;
                    const img = await loadImage(part.src.src, { left: (52 * scaleFactor), top: (5 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor) });
                    applyInvertFilter(img, patternTone === 'black' && i === 2);
                    canvas.add(img);
                }
                
                // Partes seleccionadas en figura 2
                for (let i = 0; i < selectedImages.length; i++) {
                    const part = selectedImages[i];
                    if (!part) continue;
                    const img = await loadImage(part.src.src, { left: (52 * scaleFactor), top: (444 * scaleFactor), scaleX: (0.5 * scaleFactor), scaleY: (0.5 * scaleFactor), flipY: true });
                    applyInvertFilter(img, patternTone === 'black' && i === 2);
                    canvas.add(img);
                }

                // Textos
                const urlMap = {
                    CeraPro: 'url("/fonts/cera-pro/CeraPro-Bold.woff")'
                }

                const fontCera = await new FontFace('CeraPro', urlMap.CeraPro, {
                    style: 'normal',
                    weight: 'normal'
                }).load()
                

                document.fonts.add(fontCera)
                const text1 = new FabricText(userId, {
                    left: (50 * scaleFactor),
                    top: (555 * scaleFactor),
                    fontSize: (50 * scaleFactor),
                    fill: 'black',  // Color del texto
                    fontFamily: 'CeraPro', // Fuente,
                    fontWeight: 'bold',
                    angle: 270
                });
                canvas.add(text1);
                const text2 = new FabricText(userId, {
                    left: (550 * scaleFactor),
                    top: (390 * scaleFactor),
                    fontSize: (50 * scaleFactor),
                    fill: 'black',  // Color del texto
                    fontFamily: 'CeraPro', // Fuente,
                    fontWeight: 'bold',
                    angle: 90
                });
                canvas.add(text2);

                // QR
                await loadAndAddImage(qricon.src, { left: -(5 * scaleFactor), top: 0, scaleX: (1 * scaleFactor), scaleY: (1 * scaleFactor) });
                const qrSVG = await createQRSVG(Number(userId));
                if (qrSVG) {
                    qrSVG.set({ left: (210 * scaleFactor), top: (381 * scaleFactor), scaleX: (9 * scaleFactor), scaleY: (9 * scaleFactor) });
                    canvas.add(qrSVG);
                }

                // Renderizar todo
                canvas.renderAll();

                setCanvasInstance(canvas);
            } catch (error) {
                console.error(error);
            }
        };

        const loadAndAddImage = async (src: string, options: object | undefined) => {
            const img = await loadImage(src, options);
            canvas.add(img);
        };

        loadAndDrawImages();

        return () => {
            canvas.dispose(); // Cleanup
        };
    }, [headId, headwearId, patternId, patternTone, playerColor, userId]);

    const downloadImage = (dataUrl: string) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'qr-sac.png';
        a.click();
    }

    return (
        <div className=' w-full min-h-fit h-screen p-5 gap-5 bg-blacksac flex flex-col items-center'>
            <button
                onClick={() => downloadImage(canvasInstance?.toDataURL({ format: 'png', multiplier: 2 }) || '')}
                className="w-full md:w-fit relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Descargar Imagen
                </span>
            </button>

            <GlareCard>
                <canvas ref={canvasRef} width={594 * scaleFactor} height={942 * scaleFactor}></canvas>
            </GlareCard>
        </div>
    );
}