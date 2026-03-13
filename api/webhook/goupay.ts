import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Using Service Role for server-side updates

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { status, transaction_id, customer } = req.body;

    console.log(`Webhook received: Transaction ${transaction_id} is ${status} for ${customer?.email}`);

    if (status === 'paid') {
        try {
            // Find the user by email in Supabase Auth (or search profiles by email if stored)
            // For this implementation, we assume the user email matches
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email_metadata', customer.email) // Note: We might need to store email in profiles or use auth.admin
                .single();

            // Alternative: Use auth.admin.listUsers() to find by email if not in profiles
            // For simplicity here, we'll try to find by a hypothetical 'email' field or use the email to identify the profile

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ has_lifetime_access: true })
                .eq('id', userData?.id); // In a robust system, we would map transaction_id to user_id

            if (updateError) {
                console.error('Error updating access:', updateError);
                return res.status(500).json({ success: false });
            }

            console.log(`Access granted for user ${customer.email}`);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('Webhook processing error:', err);
            return res.status(500).json({ success: false });
        }
    }

    return res.status(200).json({ success: true, message: 'Status ignored' });
}
