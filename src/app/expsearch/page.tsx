"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import dynamic from "next/dynamic";
import Loader from "@/components/loading/Loader";

const DynamicLego = dynamic(() => import("@/components/qrsearch/LegoInput"), {
  ssr: false,
});

export default function Page() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const codeHandler = (code: string) => {
    router.push(`/charactereditor/${code}`);
    return console.log(code);
  };

  return (
    <>
      <Loader />
      <div className="w-full h-full bg-whitesac">
        <div className="w-full h-[92dvh] flex items-center justify-center bg-[url(/bg-qrSearch.png)] bg-cover bg-no-repeat">
          <form
            action={() => codeHandler(code)}
            className="p-8 gap-4 flex flex-col items-center justify-center rounded-2xl bg-whitesac"
          >
            <h1 className="text-2xl font-bold">¿Cuál es tu expediente?</h1>
            <DynamicLego value={code} onChange={setCode} maxLength={6} />
            <div className="w-full text-end">
              <button
                type="submit"
                className={`w-full md:w-fit bg-blue-400 py-2 px-6 font-bold text-lg text-white rounded-2xl transition-all
                            ${
                              code.length === 6
                                ? "cursor-pointer hover:scale-105"
                                : "cursor-not-allowed opacity-50"
                            }`}
                disabled={code.length !== 6}
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
=======
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';

const DynamicLego = dynamic(
  () => import('@/components/qrsearch/LegoInput'),
  { ssr: false }
);

export default function Page() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const codeHandler = (code: string) => {
    if (code.length !== 6) return;
    setIsLoading(true);

    // Fetch the student data
    fetch(`/api/records/${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Swal.fire({
            icon: 'warning',
            title: `¿Estás seguro que deseas registrar el expediente ${code}?`,
            text: 'Una vez creado el QR, no podrás modificarlo',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              setIsLoading(true);
              router.push(`/charactereditor/${code}`);
            }
          });

          setIsLoading(false);
          return;
        }

        router.push(`/charactereditor/${code}`);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al buscar el expediente',
          text: 'Por favor, intenta de nuevo',
          confirmButtonText: 'Entendido',
        });
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full h-full bg-whitesac">
      <div className="w-full h-[92dvh] flex items-center justify-center bg-[url(/bg-qrSearch.png)] bg-cover bg-no-repeat">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            codeHandler(code);
          }}
          className="p-8 gap-4 flex flex-col items-center justify-center rounded-2xl bg-whitesac"
        >
          <h1 className="text-2xl font-bold">¿Cuál es tu expediente?</h1>
          <DynamicLego value={code} onChange={setCode} maxLength={6} />
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className={`w-full md:w-fit bg-blue-400 py-2 px-6 font-bold text-lg text-white rounded-2xl transition-all flex items-center justify-center
                ${code.length === 6 && !isLoading
                  ? 'cursor-pointer hover:scale-105'
                  : 'cursor-not-allowed opacity-50'
                }`}
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loader"></span> Cargando...
                </div>
              ) : (
                "Buscar"
              )}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .loader {
          border: 3px solid white;
          border-top: 3px solid transparent;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .stac
      `}</style>
    </div>
>>>>>>> 4218ea5e1acd8cd8c62ed0ce81bbc9e116a6175a
  );
}
