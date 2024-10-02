import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";

const handlePrintQRCode = (
  qrCodeRef: React.RefObject<HTMLDivElement>,
  onClose: () => void,
  size: number
) => {
  const canvas = qrCodeRef.current?.querySelector("canvas");

  if (canvas) {
    const dataUrl = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank", "width=600,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .qr-code-container {
                display: inline-block;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="qr-code-container">
              <img src="${dataUrl}" alt="QR Code" width="${size}" height="${size}" />
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      onClose();
    }
  }
};

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrValue: string;
}

export function QRCodeModal({ isOpen, onClose, qrValue }: QRCodeModalProps) {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(200); 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl text-gray-300 font-bold mb-4 text-center">QR Code da Planta</h2>
        
        <div className="flex flex-col items-center mb-4">
          <label className="text-sm font-medium text-gray-300 mb-2">
            Definir tamanho do QR Code (px)
          </label>
          <Slider
            defaultValue={[size]}
            max={400}
            step={10}
            className="w-[80%]"
            onValueChange={(value) => setSize(value[0])}
          />
          <span className="mt-2 text-sm text-gray-500">{size}px</span>
        </div>

        <div ref={qrCodeRef} className="flex justify-center mb-6">
          <QRCodeCanvas value={qrValue} size={size} />
        </div>

        <div className="flex justify-between space-x-2">

          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePrintQRCode(qrCodeRef, onClose, size)}
            className="flex items-center"
          >
            <PrinterIcon className="mr-2" />
            Imprimir QR Code
          </Button>
        </div>
      </div>
    </div>
  );
}
