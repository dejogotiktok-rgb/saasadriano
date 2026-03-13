const GOUPAY_API_KEY = "gou_live_39185fce840443e4ac267b5ccaa3a488";
const GOUPAY_RECIPIENT_ID = process.env.GOUPAY_RECIPIENT_ID;
const GOUPAY_PLATFORM_ID = process.env.GOUPAY_PLATFORM_ID;

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { amount, description, customer } = req.body;

    // GouPay expects amount in cents
    const amountInCents = Math.round(Number(amount));
    // Clean CPF (remove non-digits)
    const cleanCpf = (customer.cpf || "12345678900").replace(/\D/g, "");

    try {
        const payload: any = {
            amount: amountInCents,
            description: description || "Compra na Vitrino",
            customer: {
                name: customer.name || "Cliente Vitrino",
                email: customer.email,
                cpf: cleanCpf,
                phone: (customer.phone || "11999999999").replace(/\D/g, "")
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

        if (!response.ok) {
            console.error("GouPay API Error:", data);
            return res.status(response.status).json({
                success: false,
                message: data.message || "Erro na API da GouPay",
                details: data
            });
        }

        const qrCodeText =
            data.data?.pix_qr_code ||
            data.pix?.qr_code ||
            data.pdu?.qr_code ||
            data.pix_qr_code ||
            data.pdu_qr_code ||
            data.data?.br_code ||
            data.br_code ||
            data.data?.emv ||
            data.emv ||
            data.data?.copy_paste ||
            data.copy_paste ||
            data.qr_code ||
            data.qrcode ||
            data.qrCode;
        const transactionId = data.transaction_id || data.data?.transaction_id || data.id || data.ID || data.data?.id;

        return res.status(200).json({
            success: true,
            transaction_id: transactionId,
            pix: {
                qr_code: qrCodeText || ""
            }
        });
    } catch (error) {
        console.error("Internal Payment Error:", error);
        return res.status(500).json({ success: false, message: "Erro interno ao processar pagamento" });
    }
}
