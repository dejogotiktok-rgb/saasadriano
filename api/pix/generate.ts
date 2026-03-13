const GOUPAY_API_KEY = "gou_live_39185fce840443e4ac267b5ccaa3a488";
const GOUPAY_RECIPIENT_ID = process.env.GOUPAY_RECIPIENT_ID;
const GOUPAY_PLATFORM_ID = process.env.GOUPAY_PLATFORM_ID;

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { amount, description, customer } = req.body;

    // GouPay usually expects amount in cents (integer)
    // If the amount is passed as a decimal (e.g. 247.90), convert to cents (24790)
    // If it's already a large integer, keep it (assuming it's already in cents)
    let amountValue = Number(amount);
    if (amountValue > 0 && amountValue < 1000) {
        // Most likely in Reais (decimal), convert to cents
        amountValue = Math.round(amountValue * 100);
    }
    
    // Clean CPF (must be exactly 11 digits)
    const cleanCpf = (customer.cpf || "12345678900").replace(/\D/g, "");
    
    // Clean Phone (ensure it has at least 10-11 digits, and optionally prepend 55)
    let cleanPhone = (customer.phone || "11999999999").replace(/\D/g, "");
    if (cleanPhone.length === 11 || cleanPhone.length === 10) {
        cleanPhone = "55" + cleanPhone;
    }

    try {
        const payload: any = {
            amount: amountValue,
            value: amountValue, // Some versions use 'value'
            description: description || "Compra na Vitrino",
            customer: {
                name: customer.name || "Cliente Vitrino",
                email: customer.email,
                cpf: cleanCpf,
                tax_id: cleanCpf, // Some versions use 'tax_id'
                phone: cleanPhone
            }
        };
        if (GOUPAY_RECIPIENT_ID) payload.recipient_id = GOUPAY_RECIPIENT_ID;
        if (GOUPAY_PLATFORM_ID) payload.platform_id = GOUPAY_PLATFORM_ID;
        const response = await fetch("https://www.goupay.com.br/api/v1/pix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": GOUPAY_API_KEY
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("GouPay API Response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.error("GouPay API Error:", data);
            return res.status(response.status).json({
                success: false,
                message: data.message || "Erro na API da GouPay",
                details: data
            });
        }

        // Improved QR Code extraction logic
        const findQrCode = (obj: any): string | null => {
            if (!obj) return null;
            
            // Priority list of fields that usually contain the Pix Copy/Paste (EMV) string
            const fields = [
                'pix_qr_code', 'pix_copy_and_paste', 'br_code', 'copy_paste', 
                'emv', 'qr_code_text', 'payload', 'qrcode'
            ];

            // 1. Check root level fields
            for (const field of fields) {
                if (typeof obj[field] === 'string' && obj[field].startsWith('000201')) {
                    return obj[field];
                }
            }

            // 2. Check nested 'data', 'pix', 'pdu' objects
            const nested = ['data', 'pix', 'pdu', 'payment'];
            for (const key of nested) {
                if (obj[key] && typeof obj[key] === 'object') {
                    for (const field of fields) {
                        if (typeof obj[key][field] === 'string' && obj[key][field].startsWith('000201')) {
                            return obj[key][field];
                        }
                    }
                }
            }

            // 3. Fallback: find any field that starts with '000201'
            const searchDeep = (o: any): string | null => {
                for (const k in o) {
                    if (typeof o[k] === 'string' && o[k].startsWith('000201')) return o[k];
                    if (o[k] && typeof o[k] === 'object') {
                        const found = searchDeep(o[k]);
                        if (found) return found;
                    }
                }
                return null;
            };

            return searchDeep(obj);
        };

        const qrCodeText = findQrCode(data);
        
        // Final fallback if we didn't find a 000201 string
        const fallbackQrCode = qrCodeText || 
            data.pix_qr_code ||
            data.pix_copy_and_paste ||
            data.copy_paste ||
            data.data?.pix_qr_code ||
            data.pix?.qr_code ||
            data.pdu?.qr_code ||
            data.pdu_qr_code ||
            data.br_code ||
            data.data?.br_code ||
            data.emv ||
            data.data?.emv ||
            data.qr_code ||
            data.qrcode ||
            data.qrCode;

        const transactionId = data.transaction_id || data.data?.transaction_id || data.id || data.ID || data.data?.id;

        if (!fallbackQrCode) {
            console.error("No QR Code found in GouPay response:", data);
            return res.status(500).json({
                success: false,
                message: "Não foi possível extrair o QR Code do Pix da resposta do servidor",
                details: data
            });
        }

        return res.status(200).json({
            success: true,
            transaction_id: transactionId,
            pix: {
                qr_code: fallbackQrCode,
                copy_paste: qrCodeText || fallbackQrCode
            }
        });
    } catch (error) {
        console.error("Internal Payment Error:", error);
        return res.status(500).json({ success: false, message: "Erro interno ao processar pagamento" });
    }
}
