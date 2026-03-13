import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, CreditCard, CheckCircle2, QrCode, Copy, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const { user, hasLifetimeAccess } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState<{ qr_code: string; transaction_id: string } | null>(null);
    const [fullName, setFullName] = useState<string>(user?.email?.split("@")[0] || "");
    const [email, setEmail] = useState<string>(user?.email || "");
    const [cpf, setCpf] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    useEffect(() => {
        if (hasLifetimeAccess) {
            navigate("/dashboard");
        }
    }, [hasLifetimeAccess, navigate]);

    const onlyDigits = (v: string) => v.replace(/\D/g, "");
    const isValidCpf = (v: string) => {
        const c = onlyDigits(v);
        if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
        let sum = 0, rest;
        for (let i = 1; i <= 9; i++) sum += parseInt(c.substring(i - 1, i)) * (11 - i);
        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) rest = 0;
        if (rest !== parseInt(c.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(c.substring(i - 1, i)) * (12 - i);
        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) rest = 0;
        if (rest !== parseInt(c.substring(10, 11))) return false;
        return true;
    };

    const generatePix = async () => {
        setLoading(true);
        try {
            if (!fullName || !email || !isValidCpf(cpf)) {
                toast.error("Preencha nome, e-mail e CPF válido.");
                return;
            }

            const response = await fetch("/api/pix/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: 24790, // R$ 247,90
                    description: `Lifetime Access - Vitrino (${email})`,
                    customer: {
                        name: fullName,
                        email: email,
                        cpf: onlyDigits(cpf),
                        phone: onlyDigits(phone) || "11999999999"
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

                    {!pixData && (
                        <div className="grid grid-cols-1 gap-3 text-left">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Nome completo</label>
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">E-mail</label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="voce@exemplo.com"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">CPF</label>
                                    <Input
                                        inputMode="numeric"
                                        value={cpf}
                                        onChange={(e) => setCpf(onlyDigits(e.target.value))}
                                        placeholder="Somente números"
                                        maxLength={14}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Telefone (opcional)</label>
                                    <Input
                                        inputMode="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(onlyDigits(e.target.value))}
                                        placeholder="DDD + número"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

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
