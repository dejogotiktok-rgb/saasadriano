import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, CreditCard, CheckCircle2, QrCode, Copy, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const { user, hasLifetimeAccess } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState<{ qr_code: string; transaction_id: string } | null>(null);

    useEffect(() => {
        if (hasLifetimeAccess) {
            navigate("/dashboard");
        }
    }, [hasLifetimeAccess, navigate]);

    const generatePix = async () => {
        setLoading(true);
        try {
            // In a real scenario, this should be a backend call to GouPay
            // Since we don't have a backend yet, we'll demonstrate the logic
            // Note: Front-end calls to GouPay are discouraged for security, 
            // but provided here for UI demonstration with the user's key.

            const response = await fetch("/api/pix/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: 24790, // R$ 247,90
                    description: `Lifetime Access - Vitrino (${user?.email})`,
                    customer: {
                        name: user?.email?.split("@")[0] || "Cliente Vitrino",
                        email: user?.email || "pagamento@vitrino.com",
                        cpf: "12345678909" // Using a more realistic CPF
                    }
                })
            });

            const data = await response.json();
            console.log("Pix Generation Response:", data);
            if (data.success) {
                setPixData({
                    qr_code: data.pix.qr_code,
                    transaction_id: data.transaction_id
                });
                toast.success("Pix gerado com sucesso!");
            } else {
                toast.error("Erro ao gerar Pix. Verifique sua chave API ou tente novamente.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Erro na conexão com o sistema de pagamentos.");
        } finally {
            setLoading(false);
        }
    };

    const copyPix = () => {
        if (pixData) {
            navigator.clipboard.writeText(pixData.qr_code);
            toast.success("Código Pix copiado!");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center space-y-8"
            >
                <div className="flex flex-col items-center">
                    <div className="p-3 bg-red-600/10 rounded-2xl mb-4">
                        <Sparkles className="h-10 w-10 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter">ACESSO VITALÍCIO</h1>
                    <p className="text-muted-foreground mt-2">Desbloqueie todas as ferramentas de prospecção e IA para sempre.</p>
                </div>

                <div className="bg-card/50 border border-border rounded-3xl p-6 space-y-6">
                    <div className="flex justify-between items-center text-left">
                        <div>
                            <p className="text-xs uppercase font-black text-red-500 tracking-widest">Valor Único</p>
                            <h2 className="text-4xl font-extrabold mt-1">R$ 247,90</h2>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] bg-red-600 text-white px-2 py-1 rounded-full font-bold">LIFETIME</span>
                        </div>
                    </div>

                    <ul className="space-y-3 text-left">
                        {[
                            "Gerador de Mensagens Pro (Centenas de variações)",
                            "Explorador de Nichos com +300 mercados",
                            "Ferramentas de IA Ilimitadas",
                            "Encontre clientes em sua região",
                            "Atualizações futuras garantidas"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-red-500" /> {item}
                            </li>
                        ))}
                    </ul>

                    {!pixData ? (
                        <Button
                            onClick={generatePix}
                            disabled={loading}
                            className="w-full py-8 text-xl font-black bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" />}
                            GERAR PIX AGORA
                        </Button>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="bg-white p-4 rounded-2xl flex justify-center mx-auto w-48 h-48">
                                {/* QR Code Simulation */}
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-black">
                                    <QrCode className="h-32 w-32" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">Copie o código abaixo e pague no seu banco:</p>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-muted/20 border border-border rounded-xl p-3 text-[10px] truncate italic">
                                        {pixData.qr_code}
                                    </div>
                                    <Button size="icon" variant="outline" onClick={copyPix}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" /> Aguardando confirmação do pagamento...
                            </div>
                        </motion.div>
                    )}
                </div>

                <p className="text-[10px] text-muted-foreground text-center">
                    Pagamento processado de forma segura pela <strong>GouPay</strong>.<br />
                    Após o pagamento, o acesso será liberado instantaneamente.
                </p>
            </motion.div>
        </div>
    );
}
